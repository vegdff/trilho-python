/* Painel do professor: lê códigos/ficheiros de progresso dos alunos e mostra a turma. Tudo no navegador. */
(function () {
  "use strict";
  var D = window.TRILHO, P = window.Progress, exercises = D.exercises, worlds = D.worlds;
  var students = []; // {label, alias, entries}
  var root = document.getElementById("prof");
  var tab = "turma";

  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === false || v == null) return;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, "");
      else el.setAttribute(k, v);
    });
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach(function (x) { add(el, x); });
    else if (typeof c === "string" || typeof c === "number") el.appendChild(document.createTextNode(String(c)));
    else el.appendChild(c);
  }

  // Extrai (etiqueta, código) de um texto: cada linha pode ser "Etiqueta: TP1-..." ou só o código.
  function parseText(text, fallbackLabel) {
    var found = [];
    var re = /TP1-[A-Za-z0-9_-]+/g, m;
    var lines = String(text).split(/\r?\n/);
    lines.forEach(function (line) {
      var codes = line.match(re);
      if (!codes) return;
      var before = line.slice(0, line.indexOf(codes[0])).replace(/[:\-–\s]+$/, "").trim();
      codes.forEach(function (c) { found.push({ label: before || fallbackLabel || "", code: c }); });
    });
    // ficheiros com o código partido em várias linhas
    if (!found.length) {
      var joined = String(text).replace(/\s+/g, "");
      var all = joined.match(re);
      if (all) all.forEach(function (c) { found.push({ label: fallbackLabel || "", code: c }); });
    }
    return found;
  }

  function addCodes(items) {
    var errors = [], added = 0;
    items.forEach(function (it) {
      try {
        var d = P.decode(it.code, exercises);
        var label = it.label || d.alias || "Aluno " + (students.length + 1);
        var existing = students.filter(function (s) { return s.label === label; })[0];
        if (existing) existing.entries = P.mergeEntries(existing.entries, d.entries);
        else students.push({ label: label, alias: d.alias, entries: d.entries });
        added++;
      } catch (e) {
        errors.push((it.label ? it.label + ": " : "") + e.message);
      }
    });
    return { added: added, errors: errors };
  }

  function stats(s) {
    var clean = 0, help = 0, skipped = 0;
    exercises.forEach(function (ex) {
      var e = s.entries[ex.id];
      if (!e) return;
      if (e.st === 2) clean++; else if (e.st === 1) help++; else if (e.st === 3) skipped++;
    });
    var xp = P.xpOf(exercises, s.entries);
    return { clean: clean, help: help, skipped: skipped, done: clean + help + skipped, xp: xp, level: P.levelOf(xp) };
  }

  function csv() {
    var head = ["Aluno", "Nível", "XP", "Feitos", "Sem ajuda", "Com ajuda", "Saltados"];
    exercises.forEach(function (ex) { head.push(ex.id); });
    var rows = [head];
    students.forEach(function (s) {
      var st = stats(s);
      var r = [s.label, st.level, st.xp, st.done, st.clean, st.help, st.skipped];
      exercises.forEach(function (ex) { var e = s.entries[ex.id]; r.push(e ? ({ 1: "ajuda", 2: "limpo", 3: "saltado", 0: "" })[e.st] : ""); });
      rows.push(r);
    });
    return "﻿" + rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(";"); }).join("\r\n");
  }
  function download(name, text, type) {
    var a = h("a", { href: URL.createObjectURL(new Blob([text], { type: type })), download: name });
    document.body.appendChild(a); a.click(); a.remove();
  }

  // ---------------- vistas
  function viewLoad() {
    var ta = h("textarea", { class: "codebox", rows: 5, placeholder: "Cola aqui os códigos, um por linha.\nPodes escrever o nome antes: Rita Sousa: TP1-...", "aria-label": "Códigos dos alunos" });
    var msg = h("p", { class: "note", "aria-live": "polite" });
    function report(r) {
      msg.className = "note " + (r.errors.length ? "bad" : "ok");
      msg.textContent = r.added + " aluno(s) carregado(s)." + (r.errors.length ? " Problemas: " + r.errors.join(" | ") : "");
      render();
    }
    var files = h("input", { type: "file", multiple: true, accept: ".txt,.tp,text/plain", class: "file-in", "aria-label": "Escolher ficheiros" });
    files.addEventListener("change", function () {
      var list = Array.prototype.slice.call(files.files);
      var pending = list.length, items = [];
      if (!pending) return;
      list.forEach(function (f) {
        var r = new FileReader();
        r.onload = function () {
          var label = f.name.replace(/\.[^.]+$/, "").replace(/^trilho-/, "").replace(/[-_]+/g, " ");
          var got = parseText(String(r.result), label);
          if (!got.length) items.push({ label: label, code: "" });
          else got.forEach(function (g) { items.push(g); });
          if (--pending === 0) report(addCodes(items));
        };
        r.readAsText(f);
      });
    });
    return h("section", { class: "card stack" },
      h("h2", null, "Carregar progresso da turma"),
      h("p", { class: "note" }, "Descarrega da tarefa do Classroom os ficheiros enviados pelos alunos e escolhe-os todos de uma vez, ou cola os códigos. Se um aluno enviar duas vezes, fica o melhor resultado de cada exercício."),
      h("div", { class: "row" }, h("label", { class: "btn primary file-btn" }, "Escolher ficheiros", files)),
      ta,
      h("div", { class: "row" },
        h("button", { class: "btn", onclick: function () { report(addCodes(parseText(ta.value, ""))); ta.value = ""; } }, "Adicionar códigos colados"),
        students.length ? h("button", { class: "btn ghost danger", onclick: function () { students = []; render(); } }, "Limpar tudo") : null),
      msg);
  }

  function viewClass() {
    if (!students.length) return h("p", { class: "note" }, "Ainda não carregaste nenhum aluno.");
    var rows = students.map(function (s) { return { s: s, st: stats(s) }; }).sort(function (a, b) { return b.st.xp - a.st.xp; });
    var table = h("table", { class: "data" },
      h("thead", null, h("tr", null, ["Aluno", "Nível", "XP", "Feitos", "Progresso", "Sem ajuda", "Com ajuda", "Saltados"].map(function (c) { return h("th", { scope: "col" }, c); }))),
      h("tbody", null, rows.map(function (r) {
        var pct = Math.round((r.st.done / exercises.length) * 100);
        return h("tr", null,
          h("td", null, r.s.label), h("td", { class: "num" }, r.st.level), h("td", { class: "num" }, r.st.xp),
          h("td", { class: "num" }, r.st.done + "/" + exercises.length),
          h("td", null, h("div", { class: "bar", style: "min-width:90px" }, h("div", { class: "bar-fill", style: "width:" + pct + "%" }))),
          h("td", { class: "num" }, r.st.clean), h("td", { class: "num" }, r.st.help), h("td", { class: "num" }, r.st.skipped));
      })));
    return h("div", { class: "stack" },
      h("div", { class: "table-wrap" }, table),
      h("div", { class: "row" }, h("button", { class: "btn", onclick: function () { download("turma-trilho-python.csv", csv(), "text/csv"); } }, "Exportar CSV (Excel)")));
  }

  function legend() {
    return h("div", { class: "legend" },
      h("span", null, h("span", { class: "cell s2" }), "Sem ajuda"), h("span", null, h("span", { class: "cell s1" }), "Com ajuda"),
      h("span", null, h("span", { class: "cell s3" }), "Viu a solução"), h("span", null, h("span", { class: "cell" }), "Por fazer"));
  }
  function viewHeat() {
    if (!students.length) return h("p", { class: "note" }, "Ainda não carregaste nenhum aluno.");
    var out = h("div", { class: "stack" }, legend());
    worlds.forEach(function (w) {
      var block = h("div", { class: "heat-world" }, h("h3", null, w.title));
      students.forEach(function (s) {
        var row = h("div", { class: "heat-row" }, h("span", { class: "heat-name", title: s.label }, s.label));
        w.exercises.forEach(function (ex) {
          var e = s.entries[ex.id];
          row.appendChild(h("span", { class: "cell s" + (e ? e.st : 0), title: ex.title + (e && e.at ? " · tentativas: " + e.at : "") }));
        });
        block.appendChild(row);
      });
      out.appendChild(block);
    });
    return out;
  }

  function viewHard() {
    if (!students.length) return h("p", { class: "note" }, "Ainda não carregaste nenhum aluno.");
    var rows = exercises.map(function (ex) {
      var tried = 0, done = 0, help = 0, skipped = 0, attempts = 0;
      students.forEach(function (s) {
        var e = s.entries[ex.id];
        if (!e) return;
        if (e.st || e.at) tried++;
        if (e.st) done++;
        if (e.st === 1) help++;
        if (e.st === 3) skipped++;
        attempts += e.at || 0;
      });
      var struggle = tried ? (help + skipped) / tried : 0;
      return { ex: ex, tried: tried, done: done, help: help, skipped: skipped, avg: tried ? attempts / tried : 0, struggle: struggle };
    }).filter(function (r) { return r.tried > 0; }).sort(function (a, b) { return b.struggle - a.struggle || b.avg - a.avg; }).slice(0, 15);
    if (!rows.length) return h("p", { class: "note" }, "Ainda não há dados suficientes.");
    return h("div", { class: "stack" },
      h("p", { class: "note" }, "Ordenados pela percentagem de alunos que precisaram de ajuda, falharam várias vezes ou saltaram. Bons candidatos para rever na aula."),
      h("div", { class: "table-wrap" }, h("table", { class: "data" },
        h("thead", null, h("tr", null, ["Exercício", "Tipo", "Tentaram", "Com ajuda", "Saltaram", "Tentativas (média)"].map(function (c) { return h("th", { scope: "col" }, c); }))),
        h("tbody", null, rows.map(function (r) {
          return h("tr", null, h("td", null, r.ex.id + " · " + r.ex.title), h("td", null, r.ex.type), h("td", { class: "num" }, r.tried),
            h("td", { class: "num" }, r.help), h("td", { class: "num" }, r.skipped), h("td", { class: "num" }, r.avg.toFixed(1)));
        })))));
  }

  function viewSolutions() {
    var out = h("div", { class: "stack" }, h("p", { class: "note" }, "Atenção: esta página não é secreta. Qualquer pessoa com o endereço pode abri-la e ver as soluções."));
    worlds.forEach(function (w) {
      out.appendChild(h("h3", null, w.title));
      w.exercises.forEach(function (ex) {
        var body;
        if (ex.type === "predict") body = h("pre", null, "Resposta certa:\n" + ex.options[ex.answer]);
        else if (ex.type === "trace") {
          body = h("pre", null, ex.columns.join(" | ") + "\n" + ex.rows.map(function (r) { return r.map(function (c) { return Array.isArray(c) ? c[0] : c; }).join(" | "); }).join("\n") + (ex.finalOutput ? "\n" + ex.finalOutput.label + " " + ex.finalOutput.answer[0] : ""));
        } else body = h("pre", null, ex.type === "recreate" ? ex.code : ex.type === "parsons" ? ex.parsons : ex.solution);
        out.appendChild(h("details", { class: "sol" }, h("summary", null, ex.id + " · " + ex.title + " (" + ex.type + ")"),
          h("div", { class: "codeview", style: "padding:10px" }, body)));
      });
    });
    return out;
  }

  function render() {
    root.innerHTML = "";
    root.appendChild(h("h1", null, "Painel do professor"));
    root.appendChild(h("p", { class: "note" }, "Uso formativo. Os dados vêm dos códigos que os alunos exportam: é um retrato do momento em que cada aluno guardou, e um aluno pode alterar o seu código."));
    root.appendChild(viewLoad());
    var tabs = [["turma", "Turma"], ["mapa", "Mapa por exercício"], ["dificeis", "Mais difíceis"], ["solucoes", "Soluções"]];
    root.appendChild(h("div", { class: "tabs", role: "tablist" }, tabs.map(function (t) {
      return h("button", { class: "tab", role: "tab", "aria-selected": tab === t[0] ? "true" : "false", onclick: function () { tab = t[0]; render(); } }, t[1]);
    })));
    root.appendChild(tab === "turma" ? viewClass() : tab === "mapa" ? viewHeat() : tab === "dificeis" ? viewHard() : viewSolutions());
  }
  render();
})();
