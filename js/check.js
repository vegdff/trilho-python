/* Lógica de verificação partilhada pelo navegador e pelos testes em Node.
   Não depende do DOM nem do Pyodide: recebe uma função `runFn(req)` que devolve o resultado do harness. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Check = factory();
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  // ---------- normalização de saídas ----------
  function lines(s) {
    var l = String(s).replace(/\r/g, "").split("\n").map(function (x) { return x.replace(/\s+$/, ""); });
    while (l.length && l[l.length - 1] === "") l.pop();
    return l;
  }
  function collapse(s) { return s.replace(/\s+/g, " ").trim(); }

  // Compara a saída obtida com a esperada. Devolve {ok, hint}.
  function compareOutput(actual, expected) {
    var a = lines(actual), e = lines(expected);
    var same = a.length === e.length && a.every(function (x, i) { return x === e[i]; });
    if (same) return { ok: true };
    var a2 = a.map(collapse), e2 = e.map(collapse);
    if (a2.length === e2.length && a2.every(function (x, i) { return x === e2[i]; })) {
      return { ok: false, hint: "Quase! Há diferenças nos espaços. Confirma os espaços entre as palavras." };
    }
    var a3 = a2.map(function (x) { return x.toLowerCase(); }), e3 = e2.map(function (x) { return x.toLowerCase(); });
    if (a3.length === e3.length && a3.every(function (x, i) { return x === e3[i]; })) {
      return { ok: false, hint: "Quase! Repara nas maiúsculas e minúsculas." };
    }
    if (a.length !== e.length) {
      return { ok: false, hint: "O programa mostrou " + a.length + (a.length === 1 ? " linha" : " linhas") + " e eram esperadas " + e.length + "." };
    }
    for (var i = 0; i < e.length; i++) {
      if (a[i] !== e[i]) return { ok: false, hint: "A linha " + (i + 1) + " é diferente do esperado." };
    }
    return { ok: false };
  }

  // ---------- mensagens de erro em português ----------
  function friendlyError(err, source) {
    if (!err) return null;
    var t = err.type, m = err.msg || "", line = err.line;
    var where = line ? " (linha " + line + ")" : "";
    var txt;
    switch (t) {
      case "SyntaxError":
        txt = "Erro de escrita" + where + ": o Python não percebeu esta linha. Verifica dois pontos, aspas, parênteses e se usaste `==` para comparar.";
        if (/unterminated string/.test(m)) txt = "Erro" + where + ": falta fechar umas aspas.";
        else if (/expected ':'/.test(m)) txt = "Erro" + where + ": falta o sinal de dois pontos `:` no fim da linha.";
        else if (/invalid decimal literal/.test(m)) txt = "Erro" + where + ": um nome de variável não pode começar por um número.";
        else if (/'\(' was never closed|was never closed/.test(m)) txt = "Erro" + where + ": há um parêntese que nunca foi fechado.";
        else if (/Maybe you meant '=='/.test(m)) txt = "Erro" + where + ": para comparar valores usa `==`, e não `=`.";
        break;
      case "IndentationError":
        txt = "Erro de indentação" + where + ": as linhas dentro de um bloco (if, while, for) têm de estar deslocadas para a direita, todas ao mesmo nível.";
        break;
      case "TabError":
        txt = "Erro de indentação" + where + ": mistura de tabs e espaços.";
        break;
      case "NameError": {
        var nm = (m.match(/'([^']+)'/) || [])[1];
        txt = "O nome `" + (nm || "?") + "` não existe" + where + ". Escreveste-o bem? Foi criado antes de o usares?";
        break;
      }
      case "TypeError":
        txt = "Erro de tipos" + where + ": estás a misturar tipos que não combinam (por exemplo, texto com número). Detalhe: " + m;
        break;
      case "IndexError":
        txt = "Índice fora da lista" + where + ": pediste uma posição que não existe. Lembra-te que a contagem começa em 0.";
        break;
      case "KeyError":
        txt = "Chave inexistente" + where + ": a chave " + m + " não está no dicionário.";
        break;
      case "ValueError":
        txt = "Valor inválido" + where + ": " + m;
        if (/invalid literal for int/.test(m)) txt = "Não consegui converter esse texto para número inteiro" + where + ".";
        break;
      case "ZeroDivisionError":
        txt = "Divisão por zero" + where + ".";
        break;
      case "AttributeError":
        txt = "Esse tipo de valor não tem essa operação" + where + ". Detalhe: " + m;
        break;
      case "OutputLimit":
        txt = "O programa escreveu demasiado texto. Provavelmente há um ciclo infinito: confirma que a condição do `while` acaba por ficar falsa.";
        break;
      case "Timeout":
        txt = "O programa demorou demasiado tempo. Provavelmente há um ciclo infinito.";
        break;
      default:
        txt = t + where + ": " + m;
    }
    return txt;
  }

  // ---------- trace ----------
  function normCell(s) {
    s = String(s == null ? "" : s).toLowerCase().trim();
    s = s.replace(/['"`]/g, "").replace(/[\[\]\(\)\{\}]/g, "");
    s = s.replace(/[,|;]/g, "/").replace(/\s+/g, " ");
    s = s.replace(/\s*\/\s*/g, "/").replace(/^\/|\/$/g, "").trim();
    if (/^[-+]?\d+(\.\d+)?$/.test(s) && s !== "-") s = String(Number(s));
    if (s === "verdadeiro") s = "true";
    if (s === "falso") s = "false";
    if (s === "—" || s === "–" || s === "nao existe" || s === "não existe" || s === "n/a") s = "-";
    return s;
  }

  // answers: matriz de strings (só as células editáveis são lidas). Devolve {ok, wrong:[[r,c]]}
  function checkTrace(ex, answers) {
    var wrong = [], total = 0;
    ex.rows.forEach(function (row, r) {
      row.forEach(function (cell, c) {
        if (c === 0) return; // 1ª coluna é sempre um rótulo
        if (Array.isArray(cell)) {
          total++;
          var given = normCell(answers[r] && answers[r][c]);
          var ok = cell.some(function (a) { return normCell(a) === given; });
          if (!ok) wrong.push([r, c]);
        }
      });
    });
    var final = null;
    if (ex.finalOutput) {
      var g = normCell(answers.final);
      var okf = ex.finalOutput.answer.some(function (a) { return normCell(a) === g; });
      if (!okf) wrong.push(["final"]);
    }
    return { ok: wrong.length === 0, wrong: wrong, total: total };
  }

  // ---------- teste de um exercício de código ----------
  // runFn(req) -> Promise<resultado do harness>
  async function evaluateCode(ex, source, runFn) {
    var tests = ex.tests || [];
    var res = { ok: false, messages: [], failed: null, results: [], error: null };
    if (!source || !source.trim()) {
      res.messages.push("Escreve o teu código primeiro.");
      return res;
    }
    var first = true;
    for (var i = 0; i < tests.length; i++) {
      var t = tests[i];
      var r = await runFn({
        source: source,
        inputs: t.inputs || [],
        requires: first ? ex.requires || [] : [],
        forbid: first ? ex.forbid || [] : [],
      });
      first = false;
      res.results.push(r);
      if (r.error) {
        res.error = r.error;
        res.messages.push(friendlyError(r.error, source));
        res.failed = i;
        return res;
      }
      if (r.need_input !== null && r.need_input !== undefined) {
        res.messages.push("O programa pediu mais respostas (`input`) do que as esperadas neste teste. Confirma quantas perguntas deves fazer.");
        res.failed = i;
        return res;
      }
      if (i === 0) {
        if (r.missing && r.missing.length) {
          res.messages.push("Falta usar: " + r.missing.map(prettyTag).join(", ") + ".");
          res.failed = i;
          return res;
        }
        if (r.forbidden && r.forbidden.length) {
          res.messages.push("Neste exercício não podes usar: " + r.forbidden.map(prettyTag).join(", ") + ".");
          res.failed = i;
          return res;
        }
      }
      var cmp = compareOutput(r.output, t.expected);
      if (!cmp.ok) {
        res.failed = i;
        res.messages.push(
          t.hidden
            ? "O programa falhou num teste escondido" + (t.inputs && t.inputs.length ? " (com as respostas: " + t.inputs.join(", ") + ")" : "") + ". Experimenta outros valores."
            : "O resultado não é o esperado." + (cmp.hint ? " " + cmp.hint : "")
        );
        res.expected = t.hidden ? null : t.expected;
        res.got = r.output;
        res.testInputs = t.inputs || [];
        return res;
      }
      if (i === 0 && ex.checkVars) {
        for (var k = 0; k < ex.checkVars.length; k++) {
          var cv = ex.checkVars[k];
          var got = r.vars && r.vars[cv.name];
          if (got === undefined || got.replace(/"/g, "'") !== cv.value.replace(/"/g, "'")) {
            res.failed = i;
            res.messages.push("Não alteres os dados do enunciado: a variável `" + cv.name + "` devia valer " + cv.value + ".");
            return res;
          }
        }
      }
    }
    res.ok = true;
    return res;
  }

  var TAG_NAMES = {
    if: "if", elif: "elif", else: "else", nested_if: "um if dentro de outro if", while: "while", for: "for",
    break: "break", continue: "continue", ifexp: "o if numa linha", and: "and", or: "or", not: "not", in: "in",
    compare: "uma comparação", augassign: "um operador como +=", floordiv: "//", mod: "%", pow: "**",
    index: "um índice [ ]", comment: "um comentário (#)", fstring: "uma f-string",
  };
  function prettyTag(t) {
    if (TAG_NAMES[t]) return "`" + TAG_NAMES[t] + "`";
    return "`" + t + "()`";
  }

  // Compõe o código de um exercício Parsons a partir da ordem escolhida.
  function composeParsons(lines_, order) { return order.map(function (i) { return lines_[i]; }).join("\n"); }

  // Embaralha de forma determinística (para não variar entre sessões).
  function seededShuffle(n, seed) {
    var a = [];
    for (var i = 0; i < n; i++) a.push(i);
    var s = seed >>> 0 || 1;
    function rnd() { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }
    for (var j = n - 1; j > 0; j--) {
      var k = Math.floor(rnd() * (j + 1));
      var t = a[j]; a[j] = a[k]; a[k] = t;
    }
    return a;
  }

  return {
    compareOutput: compareOutput,
    friendlyError: friendlyError,
    normCell: normCell,
    checkTrace: checkTrace,
    evaluateCode: evaluateCode,
    composeParsons: composeParsons,
    seededShuffle: seededShuffle,
    prettyTag: prettyTag,
    lines: lines,
  };
});
