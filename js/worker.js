/* Worker: carrega o Pyodide (Python no navegador) e executa o código do aluno fora da página principal. */
import { loadPyodide } from "../pyodide/pyodide.mjs";

let runJson = null;
const ready = (async () => {
  const py = await loadPyodide({ indexURL: new URL("../pyodide/", self.location.href).href });
  const resp = await fetch(new URL("../py/harness.py", self.location.href));
  if (!resp.ok) throw new Error("Não foi possível carregar harness.py");
  py.runPython(await resp.text());
  runJson = py.globals.get("run_json");
})();

ready.then(
  () => self.postMessage({ type: "ready" }),
  (e) => self.postMessage({ type: "fatal", message: String((e && e.message) || e) })
);

self.onmessage = async (ev) => {
  const m = ev.data;
  if (m.type !== "run") return;
  try {
    await ready;
    const out = runJson(JSON.stringify(m.req));
    self.postMessage({ type: "result", id: m.id, res: JSON.parse(out) });
  } catch (e) {
    self.postMessage({ type: "result", id: m.id, res: {
      output: "", transcript: "", need_input: null, vars: {}, missing: [], forbidden: [],
      error: { type: "InternalError", msg: String((e && e.message) || e), line: null } } });
  }
};
