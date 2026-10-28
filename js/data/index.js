/* Junta todos os mundos num só catálogo e atribui ids estáveis.
   REGRA: nunca reordenar nem remover exercícios; só acrescentar no fim (os códigos de progresso dependem da ordem). */
(function (root) {
  var ICON = { predict: "predict", recreate: "recreate", parsons: "parsons", debug: "debug", code: "code", trace: "trace" };
  var XP = { predict: 10, parsons: 15, code: 20, debug: 20, trace: 20, recreate: 25 };
  var worlds = root.TRILHO_WORLDS;
  var flat = [];
  worlds.forEach(function (w, wi) {
    w.index = wi;
    w.exercises.forEach(function (ex, ei) {
      ex.id = w.id + "-" + (ei + 1);
      ex.world = w.id;
      ex.xp = XP[ex.type];
      ex.n = flat.length; // posição global (usada no código de progresso)
      flat.push(ex);
    });
  });
  var out = { worlds: worlds, exercises: flat, XP: XP };
  if (typeof module === "object" && module.exports) module.exports = out;
  root.TRILHO = out;
})(typeof window !== "undefined" ? window : globalThis);
