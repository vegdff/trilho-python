/* Trilho Python: interface do aluno. JavaScript simples, sem frameworks. */
(function () {
  "use strict";

  var D = window.TRILHO, P = window.Progress, C = window.Check;
  var exercises = D.exercises, worlds = D.worlds;
  var byId = {}, worldById = {};
  exercises.forEach(function (e) { byId[e.id] = e; });
  worlds.forEach(function (w) { worldById[w.id] = w; });

  var TYPE_LABEL = { predict: "Prever", recreate: "Recriar", parsons: "Ordenar", debug: "Corrigir", code: "Programar", trace: "Traçar" };
  var TYPE_HELP = {
    predict: "Prevê o resultado sem correr o código.",
    recreate: "Memoriza o código e escreve-o de memória.",
    parsons: "Ordena as linhas do programa.",
    debug: "Encontra e corrige os erros.",
    code: "Escreve o programa.",
    trace: "Segue o programa passo a passo num quadro.",
  };
  var ICONS = {
    predict: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    recreate: '<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/>',
    parsons: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
    debug: '<rect x="8" y="8" width="8" height="12" rx="4"/><path d="M12 8V4M8 12H4M16 12h4M8 17l-3 2M16 17l3 2M9 5l1.5 2M15 5l-1.5 2"/>',
    code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
    trace: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    skip: '<path d="M5 4l10 8-10 8z"/><path d="M19 5v14"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    up: '<path d="M18 15l-6-6-6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    star: '<path d="M12 2l3 7 7 .6-5.3 4.7L18.2 22 12 18l-6.2 4 1.5-7.7L2 9.6 9 9z"/>',
  };
  function icon(name, cls) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("class", "ico " + (cls || ""));
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "2");
    s.setAttribute("stroke-linecap", "round");
    s.setAttribute("stroke-linejoin", "round");
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = ICONS[name] || "";
    return s;
  }

  // ---------------------------------------------------------------- utilitários DOM
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === false || v == null) return;
        if (k === "class") el.className = v;
        else if (k === "html") el.innerHTML = v;
        else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, "");
        else el.setAttribute(k, v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach(function (x) { append(el, x); });
    else if (typeof c === "string" || typeof c === "number") el.appendChild(document.createTextNode(String(c)));
    else el.appendChild(c);
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function inline(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }
  // Markdown mínimo: parágrafos, listas com "- ", blocos de código com ``` e `código` / **negrito**
  function md(text) {
    var out = "";
    var parts = String(text).split(/(```[\s\S]*?```)/g);
    parts.forEach(function (part) {
      if (part.indexOf("```") === 0) {
        var code = part.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
        out += '<pre class="code-block" data-code="' + esc(code).replace(/"/g, "&quot;") + '"></pre>';
        return;
      }
      part.split(/\n{2,}/).forEach(function (block) {
        block = block.replace(/^\n+|\n+$/g, "");
        if (!block) return;
        var ls = block.split("\n"), buf = [], list = [];
        function flushP() { if (buf.length) { out += "<p>" + inline(buf.join(" ")) + "</p>"; buf = []; } }
        function flushL() { if (list.length) { out += "<ul>" + list.map(function (x) { return "<li>" + inline(x) + "</li>"; }).join("") + "</ul>"; list = []; } }
        ls.forEach(function (l) {
          if (/^- /.test(l)) { flushP(); list.push(l.slice(2)); }
          else { flushL(); buf.push(l); }
        });
        flushP(); flushL();
      });
    });
    return out;
  }
  // Troca os <pre.code-block> por visualizações de código com realce de sintaxe
  function hydrateCode(root) {
    Array.prototype.forEach.call(root.querySelectorAll("pre.code-block"), function (pre) {
      var code = pre.getAttribute("data-code") || "";
      pre.replaceWith(codeView(code));
    });
  }
  function codeView(code, opts) {
    var wrap = h("div", { class: "codeview" });
    var ed = window.Editor.create(wrap, { value: code, readOnly: true });
    setTimeout(function () { ed.refresh(); }, 0);
    if (!window.CodeMirror) { wrap.textContent = ""; wrap.appendChild(h("pre", null, code)); }
    return wrap;
  }
  function slug(s) { return String(s || "aluno").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "aluno"; }

  var toastTimer;
  function toast(msg, kind) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.className = "toast show " + (kind || "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = "toast"; }, 4200);
  }

  // ---------------------------------------------------------------- tema
  function applyTheme() {
    var t = P.getState().theme;
    var root = document.documentElement;
    if (t === "light" || t === "dark") root.setAttribute("data-theme", t);
    else root.removeAttribute("data-theme");
  }
  function effectiveTheme() {
    var t = P.getState().theme;
    if (t === "light" || t === "dark") return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function toggleTheme() {
    P.setTheme(effectiveTheme() === "dark" ? "light" : "dark");
    applyTheme();
    renderTopbar();
  }

  // ---------------------------------------------------------------- motor Python
  var engine = { state: "idle", msg: "" };
  var runner = new window.Runner({
    onStatus: function (s, msg) {
      engine.state = s; engine.msg = msg || "";
      var el = document.getElementById("engine-status");
      if (el) updateEngineStatus(el);
    },
  });
  function updateEngineStatus(el) {
    el.className = "engine " + engine.state;
    el.textContent =
      engine.state === "loading" ? "A preparar o Python (só demora na primeira vez)..." :
      engine.state === "failed" ? engine.msg : "";
  }
  function runFn(req) { return runner.run(req); }

  // ---------------------------------------------------------------- estado derivado
  function isDone(ex) { return P.isDone(ex.id); }
  function unlocked(ex) {
    if (P.getState().free) return true;
    if (ex.n === 0) return true;
    return isDone(ex) || isDone(exercises[ex.n - 1]);
  }
  function worldCounts(w) {
    var done = w.exercises.filter(isDone).length;
    return { done: done, total: w.exercises.length };
  }
  function nextTodo() {
    for (var i = 0; i < exercises.length; i++) if (!isDone(exercises[i])) return exercises[i];
    return null;
  }
  function totalXP() { return P.xpOf(exercises); }

  // ---------------------------------------------------------------- barra superior
  function renderTopbar() {
    var xp = totalXP(), lv = P.levelOf(xp);
    var inLevel = xp % P.XP_PER_LEVEL;
    var bar = document.getElementById("topbar");
    bar.innerHTML = "";
    bar.appendChild(
      h("a", { class: "brand", href: "#/" },
        h("span", { class: "brand-mark", "aria-hidden": "true" }, "</>"),
        h("span", { class: "brand-name" }, "Trilho Python"))
    );
    bar.appendChild(
      h("div", { class: "topbar-right" },
        h("button", { class: "level-chip", onclick: openProgressModal, title: "Ver e guardar o meu progresso" },
          h("span", { class: "lv" }, "Nível " + lv),
          h("span", { class: "xpbar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": inLevel },
            h("span", { class: "xpfill", style: "width:" + inLevel + "%" })),
          h("span", { class: "xp" }, xp + " XP")),
        h("button", { class: "btn ghost icon-btn", onclick: openProgressModal, title: "Guardar ou carregar progresso", "aria-label": "Guardar ou carregar progresso" }, icon("save"), h("span", { class: "hide-sm" }, "Progresso")),
        h("button", { class: "btn ghost icon-btn", onclick: toggleTheme, title: "Mudar entre tema claro e escuro", "aria-label": "Mudar tema" }, icon(effectiveTheme() === "dark" ? "sun" : "moon")))
    );
  }

  // ---------------------------------------------------------------- modal
  function openModal(title, content, onClose) {
    var root = document.getElementById("modal-root");
    var prevFocus = document.activeElement;
    function close() {
      root.innerHTML = "";
      document.removeEventListener("keydown", key);
      if (prevFocus && prevFocus.focus) prevFocus.focus();
      if (onClose) onClose();
    }
    function key(e) { if (e.key === "Escape") close(); }
    var box = h("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-label": title },
      h("div", { class: "modal-head" }, h("h2", null, title), h("button", { class: "btn ghost icon-btn", onclick: close, "aria-label": "Fechar" }, icon("x"))),
      h("div", { class: "modal-body" }, content));
    root.innerHTML = "";
    root.appendChild(h("div", { class: "overlay", onclick: function (e) { if (e.target === e.currentTarget) close(); } }, box));
    document.addEventListener("keydown", key);
    var f = box.querySelector("input, textarea, button.primary");
    if (f) f.focus();
    return { close: close };
  }

  function openProgressModal() {
    var st = P.getState();
    var xp = totalXP(), lv = P.levelOf(xp);
    var modal;
    var done = exercises.filter(isDone).length;
    var codeBox = h("textarea", { class: "codebox", readonly: true, rows: 3, "aria-label": "O teu código de progresso" });
    function refreshCode() { codeBox.value = P.exportCode(exercises); }
    refreshCode();
    var alias = h("input", { type: "text", maxlength: 24, value: st.alias, placeholder: "Ex.: Rita S.", "aria-label": "Nome ou alcunha" });
    alias.addEventListener("input", function () { P.setAlias(alias.value); refreshCode(); });
    var importBox = h("textarea", { class: "codebox", rows: 3, placeholder: "Cola aqui o código TP1-...", "aria-label": "Código para importar" });
    var importMsg = h("p", { class: "note", "aria-live": "polite" });
    function doImport(text) {
      try {
        var d = P.importCode(text, exercises);
        importMsg.className = "note ok";
        importMsg.textContent = "Progresso carregado" + (d.alias ? " (" + d.alias + ")" : "") + ". Foi juntado ao que já tinhas neste dispositivo, ficando o melhor resultado de cada exercício." +
          (d.extra ? " Atenção: este código tem " + d.extra + " exercícios que esta versão não tem." : "");
        alias.value = P.getState().alias;
        refreshCode();
        renderTopbar();
        route();
      } catch (e) {
        importMsg.className = "note bad";
        importMsg.textContent = e.message;
      }
    }
    var fileIn = h("input", { type: "file", accept: ".txt,.tp,text/plain", class: "file-in", "aria-label": "Escolher ficheiro de progresso" });
    fileIn.addEventListener("change", function () {
      var f = fileIn.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () { doImport(String(r.result)); };
      r.readAsText(f);
    });
    var themeSel = h("select", { "aria-label": "Tema" },
      h("option", { value: "auto" }, "Automático (segue o dispositivo)"),
      h("option", { value: "light" }, "Claro"),
      h("option", { value: "dark" }, "Escuro"));
    themeSel.value = st.theme;
    themeSel.addEventListener("change", function () { P.setTheme(themeSel.value); applyTheme(); renderTopbar(); });
    var free = h("input", { type: "checkbox", id: "free-mode" });
    free.checked = !!st.free;
    free.addEventListener("change", function () { P.setFree(free.checked); route(); });

    var persistNote = P.isPersistent()
      ? "O teu progresso fica guardado neste navegador. Se limparem os dados do navegador, perde-se: por isso guarda o código."
      : "Atenção: este navegador não permite guardar dados (modo privado?). O progresso perde-se ao fechar. Guarda o código!";

    var content = h("div", { class: "stack" },
      h("p", { class: "lead" }, "Nível " + lv + " · " + xp + " XP · " + done + " de " + exercises.length + " exercícios feitos"),
      h("p", { class: "note" }, persistNote),
      h("label", { class: "field" }, h("span", null, "O teu nome ou alcunha (opcional, aparece ao professor)"), alias),
      h("div", { class: "card-inner" },
        h("h3", null, "Guardar para continuar noutro dispositivo"),
        h("p", { class: "note" }, "Copia o código ou descarrega o ficheiro. Para entregar ao professor, anexa o ficheiro (ou cola o código) na tarefa do Classroom."),
        codeBox,
        h("div", { class: "row" },
          h("button", { class: "btn primary", onclick: function () {
            refreshCode();
            var done_ = function () { toast("Código copiado."); };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(codeBox.value).then(done_, function () { codeBox.select(); document.execCommand("copy"); done_(); });
            else { codeBox.select(); document.execCommand("copy"); done_(); }
          } }, "Copiar código"),
          h("button", { class: "btn", onclick: function () {
            refreshCode();
            var txt = "Trilho Python - progresso\nNome: " + (P.getState().alias || "(sem nome)") + "\nData: " + new Date().toLocaleString("pt-PT") + "\n\n" + codeBox.value + "\n";
            var a = h("a", { href: URL.createObjectURL(new Blob([txt], { type: "text/plain" })), download: "trilho-" + slug(P.getState().alias) + ".txt" });
            document.body.appendChild(a); a.click(); a.remove();
          } }, "Descarregar ficheiro"))),
      h("div", { class: "card-inner" },
        h("h3", null, "Carregar progresso"),
        importBox,
        h("div", { class: "row" },
          h("button", { class: "btn primary", onclick: function () { doImport(importBox.value); } }, "Carregar código"),
          h("label", { class: "btn file-btn" }, "Escolher ficheiro", fileIn)),
        importMsg),
      h("div", { class: "card-inner" },
        h("h3", null, "Preferências"),
        h("label", { class: "field" }, h("span", null, "Tema"), themeSel),
        h("label", { class: "check" }, free, h("span", null, "Modo livre: desbloquear todos os exercícios (para rever ou experimentar)"))),
      h("div", { class: "row end" },
        h("button", { class: "btn danger", onclick: function () {
          if (window.confirm("Queres mesmo apagar todo o progresso deste dispositivo? Isto não se pode desfazer (a não ser que tenhas guardado o código).")) {
            P.reset(); applyTheme(); modal.close(); renderTopbar(); location.hash = "#/"; route();
          }
        } }, "Apagar progresso")));
    modal = openModal("O meu progresso", content);
  }

  // ---------------------------------------------------------------- vistas
  var $app;
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }

  function viewHome() {
    var xp = totalXP(), lv = P.levelOf(xp);
    var todo = nextTodo();
    var doneAll = !todo;
    var doneN = exercises.filter(isDone).length;
    var name = P.getState().alias;
    var hero = h("section", { class: "hero" },
      h("div", null,
        h("h1", null, name ? "Olá, " + name : "Aprende Python passo a passo"),
        h("p", { class: "lead" }, doneN === 0
          ? "Resolve desafios curtos, ganha XP e sobe de nível. Cada mundo ensina uma ideia nova e treina-a de várias formas."
          : "Tens " + doneN + " de " + exercises.length + " exercícios feitos. Continua de onde ficaste."),
        h("div", { class: "row" },
          doneAll
            ? h("p", { class: "note ok" }, "Concluíste todos os mundos. Podes voltar a qualquer exercício para treinar.")
            : h("a", { class: "btn primary big", href: "#/" + (todo.n === 0 || worldFirst(todo) ? "mundo/" + todo.world : "ex/" + todo.id) }, doneN === 0 ? "Começar" : "Continuar"),
          h("button", { class: "btn", onclick: openProgressModal }, "Guardar ou carregar progresso"))),
      h("div", { class: "hero-stats" },
        h("div", { class: "stat" }, h("span", { class: "stat-n" }, lv), h("span", { class: "stat-l" }, "Nível")),
        h("div", { class: "stat" }, h("span", { class: "stat-n" }, xp), h("span", { class: "stat-l" }, "XP")),
        h("div", { class: "stat" }, h("span", { class: "stat-n" }, doneN + "/" + exercises.length), h("span", { class: "stat-l" }, "Exercícios"))));

    var grid = h("div", { class: "worlds" });
    worlds.forEach(function (w, i) {
      var c = worldCounts(w);
      var locked = !unlocked(w.exercises[0]);
      var pct = Math.round((c.done / c.total) * 100);
      var card = h(locked ? "div" : "a", {
        class: "world-card" + (locked ? " locked" : "") + (c.done === c.total ? " complete" : ""),
        href: locked ? false : "#/mundo/" + w.id,
        "aria-disabled": locked ? "true" : false,
        title: locked ? "Termina o mundo anterior para desbloquear" : false,
      },
        h("div", { class: "world-n" }, locked ? icon("lock") : c.done === c.total ? icon("check") : String(i + 1)),
        h("div", { class: "world-txt" },
          h("h3", null, w.title),
          h("p", null, w.subtitle),
          h("div", { class: "bar" }, h("div", { class: "bar-fill", style: "width:" + pct + "%" })),
          h("span", { class: "world-count" }, c.done + " de " + c.total)));
      grid.appendChild(card);
    });

    $app.innerHTML = "";
    $app.appendChild(hero);
    $app.appendChild(h("h2", { class: "section-title" }, "Mundos"));
    $app.appendChild(grid);
    $app.appendChild(h("p", { class: "note small" }, "Uso formativo: serve para treinares. Não conta para a avaliação."));
  }
  function worldFirst(ex) { return worldById[ex.world].exercises[0] === ex; }

  function viewWorld(id) {
    var w = worldById[id];
    if (!w) return go("#/");
    if (!unlocked(w.exercises[0])) { toast("Termina primeiro o mundo anterior."); return go("#/"); }
    var c = worldCounts(w);
    var theory = h("div", { class: "theory", html: md(w.theory) });
    hydrateCode(theory);
    var list = h("ol", { class: "path" });
    w.exercises.forEach(function (ex, i) {
      var st = P.get(ex.id).st;
      var lock = !unlocked(ex);
      var node = h(lock ? "div" : "a", {
        class: "node t-" + ex.type + (lock ? " locked" : "") + (st ? " done st" + st : ""),
        href: lock ? false : "#/ex/" + ex.id,
        "aria-disabled": lock ? "true" : false,
      },
        h("span", { class: "node-ico" }, lock ? icon("lock") : st === 3 ? icon("skip") : st ? icon("check") : icon(ex.type)),
        h("span", { class: "node-txt" },
          h("strong", null, ex.title),
          h("span", { class: "node-sub" }, TYPE_LABEL[ex.type] + " · " + ex.xp + " XP" + (st === 2 ? " · sem ajuda" : st === 1 ? " · com ajuda" : st === 3 ? " · solução vista" : ""))));
      list.appendChild(h("li", null, node));
    });
    var next = w.exercises.filter(function (e) { return !isDone(e) && unlocked(e); })[0];
    $app.innerHTML = "";
    $app.appendChild(h("nav", { class: "crumbs" }, h("a", { href: "#/" }, "← Mundos")));
    $app.appendChild(h("header", { class: "world-head" },
      h("div", null, h("h1", null, w.title), h("p", { class: "lead" }, w.subtitle)),
      h("span", { class: "pill" }, c.done + " de " + c.total + " feitos")));
    $app.appendChild(h("section", { class: "card" }, h("h2", null, "Para ler antes de começar"), theory));
    $app.appendChild(h("h2", { class: "section-title" }, "Desafios"));
    $app.appendChild(list);
    if (next) $app.appendChild(h("div", { class: "row" }, h("a", { class: "btn primary big", href: "#/ex/" + next.id }, c.done ? "Continuar" : "Começar o mundo")));
    else {
      var after = exercises[w.exercises[w.exercises.length - 1].n + 1];
      $app.appendChild(h("div", { class: "row" }, h("p", { class: "note ok" }, "Mundo concluído."), after ? h("a", { class: "btn primary", href: "#/mundo/" + after.world }, "Próximo mundo") : null));
    }
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- consola de execução livre
  function makeConsole() {
    var out = h("pre", { class: "console-out", "aria-live": "polite" });
    var err = h("div", { class: "console-err" });
    var inputRow = h("form", { class: "console-in hidden" });
    var inp = h("input", { type: "text", "aria-label": "Resposta ao input()", autocomplete: "off", spellcheck: "false" });
    var go_ = h("button", { class: "btn primary small", type: "submit" }, "Enviar");
    inputRow.appendChild(inp); inputRow.appendChild(go_);
    var box = h("div", { class: "console hidden" }, h("div", { class: "console-title" }, "Resultado"), out, inputRow, err);
    var api = {
      el: box,
      clear: function () { out.textContent = ""; err.textContent = ""; inputRow.classList.add("hidden"); box.classList.add("hidden"); },
      // corre com respostas interativas
      run: async function (source, editor, presetInputs) {
        var inputs = (presetInputs || []).slice();
        box.classList.remove("hidden");
        for (var guard = 0; guard < 60; guard++) {
          out.textContent = "A executar...";
          err.textContent = "";
          var r = await runFn({ source: source, inputs: inputs });
          out.textContent = r.transcript || "";
          if (r.error) {
            inputRow.classList.add("hidden");
            err.textContent = C.friendlyError(r.error, source);
            if (editor && r.error.line) editor.markLine(r.error.line);
            return r;
          }
          if (r.need_input !== null && r.need_input !== undefined) {
            inputRow.classList.remove("hidden");
            inp.value = "";
            inp.focus();
            var val = await new Promise(function (res) {
              inputRow.onsubmit = function (e) { e.preventDefault(); res(inp.value); };
            });
            inputs.push(val);
            continue;
          }
          inputRow.classList.add("hidden");
          if (!r.transcript) out.textContent = "(o programa não mostrou nada)";
          return r;
        }
        err.textContent = "Demasiadas perguntas seguidas.";
      },
      show: function (text) { box.classList.remove("hidden"); out.textContent = text; },
    };
    return api;
  }

  // ---------------------------------------------------------------- vista de exercício
  function viewExercise(id) {
    var ex = byId[id];
    if (!ex) return go("#/");
    if (!unlocked(ex)) { toast("Completa primeiro o exercício anterior."); return go("#/"); }
    var w = worldById[ex.world];
    var xpBefore = totalXP();
    var ctx = { ex: ex, hints: 0, peeked: false, finished: false, busy: false, solutionShown: false };
    var wasDone = isDone(ex);

    var builder = ({ predict: buildPredict, recreate: buildRecreate, parsons: buildParsons, debug: buildCode, code: buildCode, trace: buildTrace })[ex.type](ctx);

    var feedback = h("div", { class: "feedback", "aria-live": "polite" });
    var btnCheck = h("button", { class: "btn primary", onclick: onCheck }, "Verificar");
    var hintsBox = h("div", { class: "hints" });
    var btnHint = h("button", { class: "btn", onclick: onHint }, "Pedir dica");
    var btnSol = h("button", { class: "btn hidden", onclick: onSolution }, "Ver solução e avançar");
    var engineEl = h("span", { id: "engine-status", class: "engine" });
    updateEngineStatus(engineEl);

    function updateHintBtn() {
      var total = (ex.hints || []).length;
      btnHint.textContent = ctx.hints >= total ? "Sem mais dicas" : "Pedir dica (" + ctx.hints + "/" + total + ")";
      btnHint.disabled = ctx.hints >= total || ctx.finished;
    }
    function onHint() {
      if (ctx.hints >= (ex.hints || []).length) return;
      var text = ex.hints[ctx.hints];
      ctx.hints++;
      P.noteHint(ex.id);
      hintsBox.appendChild(h("div", { class: "hint" }, h("strong", null, "Dica " + ctx.hints + ". "), h("span", { html: inline(text) })));
      updateHintBtn();
    }
    async function onCheck() {
      if (ctx.busy || ctx.finished) return;
      ctx.busy = true; btnCheck.disabled = true;
      feedback.innerHTML = "";
      var res;
      try { res = await builder.check(); } catch (e) { res = { ok: false, messages: ["Ocorreu um erro inesperado: " + e.message], skip: true }; }
      ctx.busy = false; btnCheck.disabled = false;
      if (res.skip) { showFail(res, false); return; }
      P.noteAttempt(ex.id);
      var rec = P.get(ex.id);
      if (res.ok) {
        var clean = rec.at === 1 && rec.h === 0 && !ctx.peeked && !wasDone;
        if (wasDone) clean = P.get(ex.id).st === 2;
        P.setResult(ex.id, clean ? 2 : 1, rec.at, rec.h);
        finish(clean);
      } else {
        showFail(res, true);
        if (rec.at >= 3 || ctx.hints >= (ex.hints || []).length && rec.at >= 2) btnSol.classList.remove("hidden");
      }
    }
    function showFail(res, counted) {
      var box = h("div", { class: "fb bad" });
      box.appendChild(h("strong", null, counted ? "Ainda não. " : ""));
      (res.messages || []).forEach(function (m) { box.appendChild(h("p", { html: inline(m) })); });
      if (res.expected != null && res.got != null) {
        box.appendChild(h("div", { class: "compare" },
          h("div", null, h("span", { class: "cmp-l" }, "Esperado" + (res.testInputs && res.testInputs.length ? " (com as respostas: " + res.testInputs.join(", ") + ")" : "")), h("pre", null, res.expected || "(nada)")),
          h("div", null, h("span", { class: "cmp-l" }, "Obtido"), h("pre", null, res.got || "(nada)"))));
      }
      feedback.innerHTML = "";
      feedback.appendChild(box);
      if (counted && P.get(ex.id).at >= 3) btnSol.classList.remove("hidden");
    }
    function finish(clean) {
      ctx.finished = true;
      var gained = totalXP() - xpBefore;
      var lvBefore = P.levelOf(xpBefore), lvAfter = P.levelOf(totalXP());
      btnCheck.disabled = true; btnHint.disabled = true; btnSol.classList.add("hidden");
      if (builder.lock) builder.lock();
      renderTopbar();
      var box = h("div", { class: "fb good" },
        h("div", { class: "fb-head" }, icon("check"), h("strong", null, wasDone ? "Correto!" : clean ? "Correto, à primeira e sem ajuda!" : "Correto!")),
        gained > 0 ? h("p", { class: "xp-gain" }, "+" + gained + " XP" + (clean ? " (inclui " + P.CLEAN_BONUS + " de bónus)" : "")) : (wasDone ? h("p", null, "Já tinhas concluído este exercício, por isso não ganhas XP outra vez.") : null),
        lvAfter > lvBefore ? h("p", { class: "levelup" }, icon("star"), " Subiste para o nível " + lvAfter + "!") : null,
        ex.explain ? h("p", { class: "explain", html: "<strong>Porquê: </strong>" + inline(ex.explain) }) : null);
      feedback.innerHTML = "";
      feedback.appendChild(box);
      if (builder.afterDone) builder.afterDone(feedback);
      var wc = worldCounts(w);
      if (!wasDone && wc.done === wc.total) {
        toast("Mundo concluído: " + w.title + ". Aproveita para guardar o teu progresso.", "good");
      }
      feedback.appendChild(nextRow());
      feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    function nextRow() {
      var nx = exercises[ex.n + 1];
      var row = h("div", { class: "row" });
      if (nx) {
        var href = nx.world !== ex.world ? "#/mundo/" + nx.world : "#/ex/" + nx.id;
        row.appendChild(h("a", { class: "btn primary big", href: href }, nx.world !== ex.world ? "Próximo mundo" : "Continuar"));
      } else {
        row.appendChild(h("p", { class: "note ok" }, "Chegaste ao fim dos exercícios. Parabéns!"));
      }
      row.appendChild(h("a", { class: "btn", href: "#/mundo/" + ex.world }, "Voltar ao mundo"));
      return row;
    }
    function onSolution() {
      if (ctx.finished) return;
      if (!window.confirm("Ver a solução? Este exercício conta como saltado e não ganhas XP.")) return;
      ctx.finished = true; ctx.solutionShown = true;
      var rec = P.get(ex.id);
      if (!wasDone) P.setResult(ex.id, 3, Math.max(rec.at, 1), rec.h);
      builder.showSolution();
      btnCheck.disabled = true; btnHint.disabled = true; btnSol.classList.add("hidden");
      renderTopbar();
      feedback.innerHTML = "";
      feedback.appendChild(h("div", { class: "fb info" },
        h("strong", null, "Esta é uma solução possível. "),
        h("p", { html: inline(ex.explain || "Estuda-a com calma e depois tenta recriá-la.") }),
        nextRow()));
    }

    updateHintBtn();
    var head = h("header", { class: "ex-head" },
      h("nav", { class: "crumbs" }, h("a", { href: "#/mundo/" + w.id }, "← " + w.title)),
      h("div", { class: "ex-title" },
        h("span", { class: "type-badge t-" + ex.type }, icon(ex.type), TYPE_LABEL[ex.type]),
        h("h1", null, ex.title),
        h("span", { class: "pill" }, ex.xp + " XP")));
    var prompt = h("div", { class: "prompt", html: md(ex.prompt) });
    hydrateCode(prompt);

    $app.innerHTML = "";
    $app.appendChild(head);
    $app.appendChild(h("p", { class: "note" }, TYPE_HELP[ex.type]));
    $app.appendChild(prompt);
    $app.appendChild(builder.el);
    $app.appendChild(h("div", { class: "actions" }, btnCheck, builder.extraButtons || null, btnHint, btnSol, engineEl));
    $app.appendChild(hintsBox);
    $app.appendChild(feedback);
    if (wasDone) {
      feedback.appendChild(h("p", { class: "note" }, "Já fizeste este exercício. Podes repeti-lo para treinar."));
    }
    window.scrollTo(0, 0);
    if (builder.afterMount) builder.afterMount();
  }

  // ---- prever
  function buildPredict(ctx) {
    var ex = ctx.ex, sel = null;
    var optEls = [];
    var list = h("div", { class: "options", role: "radiogroup", "aria-label": "Opções" });
    ex.options.forEach(function (o, i) {
      var b = h("button", { class: "option", role: "radio", "aria-checked": "false", onclick: function () {
        if (ctx.finished) return;
        sel = i;
        optEls.forEach(function (e, j) { e.classList.remove("wrong"); e.classList.toggle("sel", j === i); e.setAttribute("aria-checked", j === i ? "true" : "false"); });
      } }, h("pre", null, o));
      optEls.push(b); list.appendChild(b);
    });
    var cons = makeConsole();
    var el = h("div", { class: "stack" },
      codeView(ex.code),
      ex.inputs ? h("p", { class: "note" }, "Neste teste o utilizador escreve, por esta ordem: " + ex.inputs.map(function (x) { return "«" + x + "»"; }).join(", ") + ".") : null,
      h("p", { class: "label" }, "O que aparece no ecrã?"), list, cons.el);
    return {
      el: el,
      check: async function () {
        if (sel === null) return { ok: false, messages: ["Escolhe uma das opções."], skip: true };
        if (sel === ex.answer) return { ok: true };
        optEls[sel].classList.add("wrong");
        return { ok: false, messages: ["Essa não é a resposta certa. Volta a seguir o código linha a linha."] };
      },
      lock: function () { optEls.forEach(function (e) { e.disabled = true; }); optEls[ex.answer].classList.add("right"); },
      showSolution: function () { optEls.forEach(function (e) { e.disabled = true; }); optEls[ex.answer].classList.add("right"); },
      afterDone: function (fb) {
        fb.appendChild(h("button", { class: "btn small", onclick: async function () {
          await cons.run(ex.code, null, ex.inputs || []);
        } }, "Correr o código para confirmar"));
      },
    };
  }

  // ---- editor com rascunho (código e correção)
  function buildCode(ctx) {
    var ex = ctx.ex;
    var cons = makeConsole();
    var start = P.getDraft(ex.id);
    if (start == null) start = ex.starter || "";
    var holder = h("div", { class: "editor" });
    var editor;
    var timer;
    editor = window.Editor.create(holder, {
      value: start,
      onChange: function (v) {
        editor.markLine(0);
        clearTimeout(timer);
        timer = setTimeout(function () { P.setDraft(ex.id, v); }, 400);
      },
      onRun: function () { run(); },
    });
    async function run() {
      editor.markLine(0);
      await cons.run(editor.getValue(), editor);
    }
    var runBtn = h("button", { class: "btn", onclick: run, title: "Atalho: Ctrl+Enter" }, "Executar");
    var resetBtn = h("button", { class: "btn ghost", onclick: function () {
      if (editor.getValue() !== (ex.starter || "") && !window.confirm("Voltar ao código inicial? Perdes o que escreveste.")) return;
      editor.setValue(ex.starter || ""); P.clearDraft(ex.id); cons.clear();
    } }, "Repor código");
    var wrap = h("div", { class: "stack" },
      ex.type === "debug" ? h("p", { class: "label" }, "Código com erros") : h("p", { class: "label" }, "O teu código"),
      holder, cons.el);
    return {
      el: wrap,
      extraButtons: [runBtn, resetBtn],
      afterMount: function () { editor.refresh(); },
      check: async function () {
        var res = await C.evaluateCode(ex, editor.getValue(), runFn);
        if (res.error && res.error.line) editor.markLine(res.error.line);
        return res;
      },
      lock: function () { P.clearDraft(ex.id); },
      showSolution: function () {
        editor.setValue(ex.solution);
        editor.markLine(0);
      },
    };
  }

  // ---- recriar de memória
  function buildRecreate(ctx) {
    var ex = ctx.ex;
    var cons = makeConsole();
    var phase = P.getDraft(ex.id) != null ? "write" : "memorize";
    var stage = h("div", { class: "stack" });
    var holder = h("div", { class: "editor" });
    var editor = window.Editor.create(holder, {
      value: P.getDraft(ex.id) || "",
      onChange: function (v) { editor.markLine(0); P.setDraft(ex.id, v); },
      onRun: function () { run(); },
    });
    async function run() { editor.markLine(0); await cons.run(editor.getValue(), editor); }
    var peekBox = h("div", { class: "peek hidden" });
    function render() {
      stage.innerHTML = "";
      if (phase === "memorize") {
        stage.appendChild(h("p", { class: "label" }, "Estuda este código"));
        stage.appendChild(codeView(ex.code));
        stage.appendChild(h("div", { class: "row" }, h("button", { class: "btn primary", onclick: function () {
          phase = "write"; P.setDraft(ex.id, editor.getValue() || ""); render();
        } }, "Já decorei, esconder")));
      } else {
        stage.appendChild(h("p", { class: "label" }, "Escreve o código de memória"));
        stage.appendChild(holder);
        stage.appendChild(peekBox);
        stage.appendChild(cons.el);
        setTimeout(function () { editor.refresh(); editor.focus(); }, 0);
      }
    }
    var peekBtn = h("button", { class: "btn ghost", onclick: function () {
      if (phase !== "write") return;
      if (peekBox.classList.contains("hidden")) {
        if (!ctx.peeked && !window.confirm("Se espreitares, perdes o bónus de «sem ajuda» neste exercício. Espreitar?")) return;
        ctx.peeked = true;
        P.noteHint(ex.id);
        peekBox.innerHTML = "";
        peekBox.appendChild(codeView(ex.code));
        peekBox.classList.remove("hidden");
        peekBtn.textContent = "Esconder outra vez";
      } else {
        peekBox.classList.add("hidden");
        peekBtn.textContent = "Espreitar o código";
      }
    } }, "Espreitar o código");
    var runBtn = h("button", { class: "btn", onclick: function () { if (phase === "write") run(); } }, "Executar");
    render();
    return {
      el: stage,
      extraButtons: [runBtn, peekBtn],
      check: async function () {
        if (phase === "memorize") return { ok: false, messages: ["Primeiro estuda o código e carrega em «Já decorei, esconder»."], skip: true };
        var res = await C.evaluateCode(ex, editor.getValue(), runFn);
        if (res.error && res.error.line) editor.markLine(res.error.line);
        return res;
      },
      lock: function () { P.clearDraft(ex.id); },
      showSolution: function () {
        phase = "write"; render();
        editor.setValue(ex.code);
      },
    };
  }

  // ---- ordenar linhas
  function buildParsons(ctx) {
    var ex = ctx.ex;
    var all = ex.parsons.split("\n").concat(ex.distractors || []);
    var nCorrect = ex.parsons.split("\n").length;
    // posição inicial embaralhada de forma determinística
    var seed = 0;
    for (var i = 0; i < ex.id.length; i++) seed = (seed * 31 + ex.id.charCodeAt(i)) >>> 0;
    var order = C.seededShuffle(all.length, seed);
    var program = order.filter(function (k) { return k < nCorrect; });
    // garante que não começa já resolvido
    var solved = program.every(function (v, idx) { return v === idx; });
    if (solved && program.length > 1) { var t0 = program[0]; program[0] = program[1]; program[1] = t0; }
    var pool = order.filter(function (k) { return k >= nCorrect; });
    var cons = makeConsole();
    var progEl = h("ul", { class: "parsons", "aria-label": "O teu programa" });
    var poolEl = h("ul", { class: "parsons pool", "aria-label": "Linhas a mais" });
    var dragFrom = null;

    function indentOf(line) { var m = line.match(/^ */)[0].length; return Math.floor(m / 4); }
    function lineEl(k, where, idx) {
      var text = all[k];
      var li = h("li", { class: "pline", draggable: where === "prog" ? "true" : false });
      li.style.setProperty("--ind", indentOf(text));
      li.appendChild(h("code", null, text.trim() === "" ? " " : text.replace(/^ +/, "")));
      var btns = h("span", { class: "pbtns" });
      if (where === "prog") {
        btns.appendChild(h("button", { class: "btn ghost small", "aria-label": "Mover para cima", disabled: idx === 0 || ctx.finished, onclick: function () { move(idx, idx - 1); } }, icon("up")));
        btns.appendChild(h("button", { class: "btn ghost small", "aria-label": "Mover para baixo", disabled: idx === program.length - 1 || ctx.finished, onclick: function () { move(idx, idx + 1); } }, icon("down")));
        if (all.length > nCorrect) btns.appendChild(h("button", { class: "btn ghost small", "aria-label": "Tirar do programa", disabled: ctx.finished, onclick: function () { program.splice(idx, 1); pool.push(k); render(); } }, icon("x")));
        li.addEventListener("dragstart", function (e) { dragFrom = idx; li.classList.add("dragging"); try { e.dataTransfer.setData("text/plain", String(idx)); e.dataTransfer.effectAllowed = "move"; } catch (x) {} });
        li.addEventListener("dragend", function () { li.classList.remove("dragging"); dragFrom = null; });
        li.addEventListener("dragover", function (e) { e.preventDefault(); li.classList.add("over"); });
        li.addEventListener("dragleave", function () { li.classList.remove("over"); });
        li.addEventListener("drop", function (e) { e.preventDefault(); li.classList.remove("over"); if (dragFrom !== null && dragFrom !== idx) move(dragFrom, idx); });
      } else {
        btns.appendChild(h("button", { class: "btn small", disabled: ctx.finished, onclick: function () { pool.splice(idx, 1); program.push(k); render(); } }, "Usar"));
      }
      li.appendChild(btns);
      return li;
    }
    function move(a, b) {
      if (b < 0 || b >= program.length) return;
      var v = program.splice(a, 1)[0];
      program.splice(b, 0, v);
      render();
    }
    function render() {
      progEl.innerHTML = "";
      program.forEach(function (k, idx) { progEl.appendChild(lineEl(k, "prog", idx)); });
      poolEl.innerHTML = "";
      pool.forEach(function (k, idx) { poolEl.appendChild(lineEl(k, "pool", idx)); });
      poolWrap.classList.toggle("hidden", pool.length === 0 && all.length === nCorrect);
    }
    var poolWrap = h("div", null, h("p", { class: "label" }, "Linhas a mais (podem não ser precisas)"), poolEl);
    var el = h("div", { class: "stack" },
      h("p", { class: "label" }, "O teu programa (arrasta ou usa as setas)"), progEl, poolWrap, cons.el);
    render();
    function source() { return program.map(function (k) { return all[k]; }).join("\n"); }
    var runBtn = h("button", { class: "btn", onclick: function () { cons.run(source(), null); } }, "Executar");
    return {
      el: el,
      extraButtons: [runBtn],
      check: async function () {
        if (!program.length) return { ok: false, messages: ["Ainda não tens nenhuma linha no programa."], skip: true };
        var res = await C.evaluateCode(ex, source(), runFn);
        return res;
      },
      lock: function () { render(); },
      showSolution: function () {
        program = []; for (var q = 0; q < nCorrect; q++) program.push(q);
        pool = []; for (var z = nCorrect; z < all.length; z++) pool.push(z);
        render();
      },
    };
  }

  // ---- quadro de traçagem
  function buildTrace(ctx) {
    var ex = ctx.ex;
    var inputs = {}; // "r,c" -> input
    var table = h("table", { class: "trace" });
    var thead = h("thead", null, h("tr", null, ex.columns.map(function (c) { return h("th", { scope: "col" }, c); })));
    var tbody = h("tbody");
    ex.rows.forEach(function (row, r) {
      var tr = h("tr");
      row.forEach(function (cell, c) {
        if (Array.isArray(cell)) {
          var inp = h("input", { type: "text", autocomplete: "off", spellcheck: "false", "aria-label": ex.columns[c] + ", linha " + (r + 1) });
          inp.addEventListener("input", function () { inp.parentNode.classList.remove("wrong"); });
          inputs[r + "," + c] = inp;
          tr.appendChild(h("td", { class: "fill" }, inp));
        } else tr.appendChild(h(c === 0 ? "th" : "td", c === 0 ? { scope: "row" } : null, cell));
      });
      tbody.appendChild(tr);
    });
    table.appendChild(thead); table.appendChild(tbody);
    var finalInp = null;
    var finalRow = null;
    if (ex.finalOutput) {
      finalInp = h("input", { type: "text", autocomplete: "off", spellcheck: "false", "aria-label": ex.finalOutput.label });
      finalRow = h("label", { class: "field final" }, h("span", null, ex.finalOutput.label), finalInp);
    }
    var el = h("div", { class: "stack" },
      h("p", { class: "label" }, "Código"), codeView(ex.code),
      h("p", { class: "label" }, "Quadro de traçagem"),
      h("div", { class: "table-wrap" }, table), finalRow);
    function answers() {
      var a = ex.rows.map(function () { return []; });
      Object.keys(inputs).forEach(function (k) { var p = k.split(","); a[+p[0]][+p[1]] = inputs[k].value; });
      if (finalInp) a.final = finalInp.value;
      return a;
    }
    return {
      el: el,
      check: function () {
        var a = answers();
        var empty = false;
        Object.keys(inputs).forEach(function (k) { if (!inputs[k].value.trim()) empty = true; });
        if (empty || (finalInp && !finalInp.value.trim())) return Promise.resolve({ ok: false, messages: ["Preenche todas as células em branco antes de verificar."], skip: true });
        var res = C.checkTrace(ex, a);
        Object.keys(inputs).forEach(function (k) { inputs[k].parentNode.classList.remove("wrong"); });
        if (finalInp) finalInp.parentNode.classList.remove("wrong");
        res.wrong.forEach(function (w) {
          if (w[0] === "final") finalInp.parentNode.classList.add("wrong");
          else inputs[w[0] + "," + w[1]].parentNode.classList.add("wrong");
        });
        if (res.ok) return Promise.resolve({ ok: true });
        return Promise.resolve({ ok: false, messages: [res.wrong.length === 1 ? "Há 1 célula errada, assinalada a vermelho." : "Há " + res.wrong.length + " células erradas, assinaladas a vermelho. Segue o código linha a linha."] });
      },
      lock: function () { Object.keys(inputs).forEach(function (k) { inputs[k].disabled = true; }); if (finalInp) finalInp.disabled = true; },
      showSolution: function () {
        ex.rows.forEach(function (row, r) { row.forEach(function (cell, c) { if (Array.isArray(cell)) { inputs[r + "," + c].value = cell[0]; inputs[r + "," + c].disabled = true; inputs[r + "," + c].parentNode.classList.remove("wrong"); } }); });
        if (finalInp) { finalInp.value = ex.finalOutput.answer[0]; finalInp.disabled = true; }
      },
    };
  }

  // ---------------------------------------------------------------- router
  function route() {
    var hash = location.hash || "#/";
    var m;
    if ((m = hash.match(/^#\/mundo\/([\w-]+)/))) viewWorld(m[1]);
    else if ((m = hash.match(/^#\/ex\/([\w-]+)/))) viewExercise(m[1]);
    else viewHome();
    renderTopbar();
  }

  document.addEventListener("DOMContentLoaded", function () {
    P.load();
    applyTheme();
    $app = document.getElementById("app");
    window.addEventListener("hashchange", route);
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      if (mq.addEventListener) mq.addEventListener("change", function () { renderTopbar(); });
    }
    route();
    // pré-carrega o motor de Python quando o navegador estiver livre
    var kick = function () { runner.start().catch(function () {}); };
    if (window.requestIdleCallback) requestIdleCallback(kick, { timeout: 2500 }); else setTimeout(kick, 800);
  });
})();
