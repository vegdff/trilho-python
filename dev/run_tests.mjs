import { loadPyodide } from 'pyodide';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const base = new URL('..', import.meta.url).pathname;
for (const f of ['helpers','mundos-1','mundos-2','mundos-3']) require(base + 'js/data/' + f + '.js');
const T = require(base + 'js/data/index.js');
const Check = require(base + 'js/check.js');
const py = await loadPyodide();
py.runPython(fs.readFileSync(base + 'py/harness.py', 'utf8'));
const rj = py.globals.get('run_json');
const run = async (req) => JSON.parse(rj(JSON.stringify(req)));
let fail = 0, ok = 0;
const bad = (ex, msg) => { fail++; console.log('FALHA', ex.id, ex.title, '->', msg); };
const good = () => { ok++; };
const ids = new Set();
for (const ex of T.exercises) {
  if (ids.has(ex.id)) bad(ex, 'id repetido'); ids.add(ex.id);
  if (!ex.hints || !ex.hints.length) bad(ex, 'sem dicas');
  if (!ex.explain) bad(ex, 'sem explicação');
  const t = ex.type;
  if (t === 'predict') {
    const r = await run({ source: ex.code, inputs: ex.inputs || [] });
    if (r.error) { bad(ex, 'erro ao correr: ' + JSON.stringify(r.error)); continue; }
    const real = ex.inputs ? r.transcript : r.output;
    const rightOpt = ex.options[ex.answer];
    if (!Check.compareOutput(rightOpt, real).ok) bad(ex, 'opção certa difere.\n real=' + JSON.stringify(real) + '\n opt =' + JSON.stringify(rightOpt));
    else {
      let dup = ex.options.filter((o, i) => i !== ex.answer && Check.compareOutput(o, real).ok);
      if (dup.length) bad(ex, 'outra opção também correta'); else good();
    }
  } else if (t === 'trace') {
    // verificar saída final
    const r = await run({ source: ex.code, inputs: [] });
    if (r.error) { bad(ex, 'erro: ' + JSON.stringify(r.error)); continue; }
    if (ex.finalOutput) {
      const lastLine = Check.lines(r.output).pop();
      if (!ex.finalOutput.answer.some(a => Check.normCell(a) === Check.normCell(lastLine))) bad(ex, 'finalOutput ' + lastLine);
      else good();
    } else good();
    // a tabela de resposta deve passar no seu próprio check
    const ans = ex.rows.map(row => row.map(c => Array.isArray(c) ? c[0] : c));
    ans.final = ex.finalOutput ? ex.finalOutput.answer[0] : '';
    const c = Check.checkTrace(ex, ans);
    if (!c.ok) bad(ex, 'tabela não passa no próprio check');
  } else {
    const sol = t === 'recreate' ? ex.code : t === 'parsons' ? ex.parsons : ex.solution;
    if (!sol) { bad(ex, 'sem solução'); continue; }
    const res = await Check.evaluateCode(ex, sol, run);
    if (!res.ok) bad(ex, 'solução falha: ' + res.messages.join(' | ') + ' got=' + JSON.stringify(res.got) + ' exp=' + JSON.stringify(res.expected));
    else good();
    if (t === 'debug') {
      const rs = await Check.evaluateCode(ex, ex.starter, run);
      if (rs.ok) bad(ex, 'o código inicial já passa!');
    }
    if (t === 'code' && ex.starter) {
      const rs = await Check.evaluateCode(ex, ex.starter, run);
      if (rs.ok) bad(ex, 'o starter já passa!');
    }
    if (t === 'parsons') {
      const n = ex.parsons.split('\n').length;
      if (n < 3) bad(ex, 'parsons curto');
    }
    // tests visíveis: pelo menos um
    if (!(ex.tests||[]).some(x => !x.hidden)) bad(ex, 'sem teste visível');
  }
}
console.log(`\n${T.exercises.length} exercícios, ${T.worlds.length} mundos | OK: ${ok} | falhas: ${fail}`);
const byType = {};
T.exercises.forEach(e => byType[e.type] = (byType[e.type]||0)+1);
console.log(byType);
process.exit(fail ? 1 : 0);
