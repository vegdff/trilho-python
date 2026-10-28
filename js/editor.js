/* Editor de código: usa CodeMirror 5 se estiver carregado; senão, um textarea simples. */
(function (root) {
  "use strict";

  function create(container, opts) {
    opts = opts || {};
    var value = opts.value || "";
    var api;
    if (root.CodeMirror) {
      var cm = root.CodeMirror(container, {
        value: value,
        mode: "python",
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        smartIndent: true,
        lineWrapping: false,
        readOnly: !!opts.readOnly,
        viewportMargin: Infinity,
        autofocus: false,
        extraKeys: {
          Tab: function (c) {
            if (c.somethingSelected()) c.indentSelection("add");
            else c.replaceSelection("    ", "end");
          },
          "Shift-Tab": function (c) { c.indentSelection("subtract"); },
          "Ctrl-Enter": function () { if (opts.onRun) opts.onRun(); },
          "Cmd-Enter": function () { if (opts.onRun) opts.onRun(); },
        },
      });
      cm.on("change", function () { if (opts.onChange) opts.onChange(cm.getValue()); });
      var marked = null;
      api = {
        getValue: function () { return cm.getValue(); },
        setValue: function (v) { cm.setValue(v); },
        setReadOnly: function (r) { cm.setOption("readOnly", r ? "nocursor" : false); },
        focus: function () { cm.focus(); },
        refresh: function () { cm.refresh(); },
        markLine: function (n) {
          if (marked !== null) cm.removeLineClass(marked, "background", "linha-erro");
          marked = null;
          if (n && n >= 1 && n <= cm.lineCount()) { marked = n - 1; cm.addLineClass(marked, "background", "linha-erro"); }
        },
        el: cm.getWrapperElement(),
      };
    } else {
      var ta = document.createElement("textarea");
      ta.className = "editor-fallback";
      ta.spellcheck = false;
      ta.value = value;
      ta.readOnly = !!opts.readOnly;
      ta.setAttribute("aria-label", "Editor de código");
      ta.addEventListener("input", function () { if (opts.onChange) opts.onChange(ta.value); });
      ta.addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
          e.preventDefault();
          var s = ta.selectionStart;
          ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(ta.selectionEnd);
          ta.selectionStart = ta.selectionEnd = s + 4;
          if (opts.onChange) opts.onChange(ta.value);
        } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          if (opts.onRun) opts.onRun();
        }
      });
      container.appendChild(ta);
      api = {
        getValue: function () { return ta.value; },
        setValue: function (v) { ta.value = v; },
        setReadOnly: function (r) { ta.readOnly = !!r; },
        focus: function () { ta.focus(); },
        refresh: function () {},
        markLine: function () {},
        el: ta,
      };
    }
    return api;
  }

  root.Editor = { create: create };
})(window);
