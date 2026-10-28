/* Corre código Python no worker, com limite de tempo (ciclos infinitos). */
(function (root) {
  "use strict";
  var TIMEOUT_MS = 5000;

  function Runner(opts) {
    this.opts = opts || {};
    this.worker = null;
    this.readyP = null;
    this.nextId = 1;
    this.pending = {};
    this.state = "idle"; // idle | loading | ready | failed
    this.failMsg = "";
  }

  Runner.prototype._status = function (s, extra) {
    this.state = s;
    if (this.opts.onStatus) this.opts.onStatus(s, extra);
  };

  Runner.prototype.start = function () {
    var self = this;
    if (this.readyP) return this.readyP;
    this._status("loading");
    this.readyP = new Promise(function (resolve, reject) {
      var w;
      try {
        w = new Worker("js/worker.js", { type: "module" });
      } catch (e) {
        self.failMsg = "O teu navegador não consegue iniciar o motor de Python (" + e.message + ").";
        self._status("failed", self.failMsg);
        reject(new Error(self.failMsg));
        return;
      }
      self.worker = w;
      w.onmessage = function (ev) {
        var m = ev.data;
        if (m.type === "ready") { self._status("ready"); resolve(); }
        else if (m.type === "fatal") {
          self.failMsg = "Não foi possível carregar o Python: " + m.message;
          self._status("failed", self.failMsg);
          reject(new Error(self.failMsg));
        } else if (m.type === "result") {
          var p = self.pending[m.id];
          if (p) { delete self.pending[m.id]; clearTimeout(p.timer); p.resolve(m.res); }
        }
      };
      w.onerror = function (ev) {
        self.failMsg = "Erro ao iniciar o motor de Python. Se abriste o ficheiro diretamente do disco, usa o endereço do site (https://...).";
        self._status("failed", self.failMsg);
        reject(new Error(self.failMsg));
      };
    });
    this.readyP.catch(function () {});
    return this.readyP;
  };

  Runner.prototype._restart = function () {
    if (this.worker) { try { this.worker.terminate(); } catch (e) {} }
    this.worker = null;
    this.readyP = null;
    this.state = "idle";
    return this.start();
  };

  // req: {source, inputs, requires, forbid}. Devolve sempre um resultado (nunca rejeita por falha do aluno).
  Runner.prototype.run = function (req) {
    var self = this;
    return this.start().then(function () {
      return new Promise(function (resolve) {
        var id = self.nextId++;
        var timer = setTimeout(function () {
          delete self.pending[id];
          // termina o worker preso e prepara outro
          self._restart();
          resolve({ output: "", transcript: "", need_input: null, vars: {}, missing: [], forbidden: [],
            error: { type: "Timeout", msg: "Tempo excedido", line: null } });
        }, TIMEOUT_MS);
        self.pending[id] = { resolve: resolve, timer: timer };
        self.worker.postMessage({ type: "run", id: id, req: req });
      });
    }, function (err) {
      return { output: "", transcript: "", need_input: null, vars: {}, missing: [], forbidden: [],
        error: { type: "EngineError", msg: err.message, line: null } };
    });
  };

  root.Runner = Runner;
})(window);
