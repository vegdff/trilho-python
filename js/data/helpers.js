/* Auxiliares para escrever os mundos e exercícios. */
(function (root) {
  root.TH = {
    // junta parágrafos
    T: function () { return Array.prototype.slice.call(arguments).join("\n\n"); },
    // lista com marcadores
    L: function () {
      return Array.prototype.slice.call(arguments).map(function (i) { return "- " + i; }).join("\n");
    },
  };
  root.TRILHO_WORLDS = root.TRILHO_WORLDS || [];
})(typeof window !== "undefined" ? window : globalThis);
