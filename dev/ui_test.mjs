import { JSDOM } from 'jsdom';
import { loadPyodide } from 'pyodide';
import fs from 'node:fs';
const base = new URL('..', import.meta.url).pathname;
const read = (p) => fs.readFileSync(base + p, 'utf8');

const py = await loadPyodide();
py.runPython(read('py/harness.py'));
const rj = py.globals.get('run_json');

const html = read('index.html').replace(/<script src=.*?<\/script>/g, '').replace(/<link rel="stylesheet".*?>/g, '');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' });
const w = dom.window;
w.confirm = () => true;
w.scrollTo = () => {};
w.Element.prototype.scrollIntoView = () => {};
w.HTMLElement.prototype.select = function () {};
w.document.execCommand = () => true;
class FakeWorker {
  constructor() { setTimeout(() => this.onmessage && this.onmessage({ data: { type: 'ready' } }), 5); }
  postMessage(m) {
    if (m.type !== 'run') return;
    const res = JSON.parse(rj(JSON.stringify(m.req)));
    setTimeout(() => this.onmessage({ data: { type: 'result', id: m.id, res } }), 1);
  }
  terminate() {}
}
w.Worker = FakeWorker;
w.requestIdleCallback = (f) => setTimeout(f, 1);
const files = ['js/data/helpers.js','js/data/mundos-1.js','js/data/mundos-2.js','js/data/mundos-3.js','js/data/index.js','js/check.js','js/progress.js','js/runner.js','js/editor.js','js/app.js'];
for (const f of files) {
  try { w.eval(read(f)); } catch (e) { console.log('ERRO a carregar', f, e); process.exit(1); }
}
w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
const $ = (s, r = w.document) => r.querySelector(s);
const $$ = (s, r = w.document) => Array.from(r.querySelectorAll(s));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function until(fn, label, ms = 8000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { const v = fn(); if (v) return v; await sleep(10); }
  throw new Error('timeout: ' + label);
}
async function nav(hash) { w.location.hash = hash; await sleep(15); }
const T = w.TRILHO;
let fails = 0;
const fail = (m) => { fails++; console.log('FALHA UI:', m); };
const clickBtn = (txt) => { const b = $$('button').find(b => b.textContent.trim().startsWith(txt)); if (!b) throw new Error('botão não encontrado: ' + txt); b.click(); };

// 1. página inicial
if ($$('.world-card').length !== T.worlds.length) fail('nº de cartões de mundo ' + $$('.world-card').length);
if ($$('.world-card.locked').length !== T.worlds.length - 1) fail('só o 1º mundo deve estar desbloqueado');
if (!/Nível 1/.test($('#topbar').textContent)) fail('barra superior');

// 2. resolver todos os exercícios pela interface
function setVal(el, v) { el.value = v; el.dispatchEvent(new w.Event('input', { bubbles: true })); }
async function solveParsons(ex) {
  const target = ex.parsons.split('\n').map(s => s.replace(/^ +/, ''));
  const names = () => $$('.parsons:not(.pool) li code').map(c => c.textContent);
  for (let i = 0; i < target.length; i++) {
    const cur = names();
    const j = cur.indexOf(target[i], i);
    if (j < 0) throw new Error('linha em falta ' + target[i]);
    for (let k = j; k > i; k--) {
      const li = $$('.parsons:not(.pool) li')[k];
      li.querySelectorAll('button')[0].click();
    }
  }
}
for (const ex of T.exercises) {
  await nav('#/ex/' + ex.id);
  if (!$('.ex-title')) { fail('não abriu ' + ex.id); continue; }
  const before = $('#topbar .xp').textContent;
  try {
    if (ex.type === 'predict') { $$('.option')[ex.answer].click(); }
    else if (ex.type === 'recreate') { clickBtn('Já decorei'); await sleep(5); setVal($('textarea.editor-fallback'), ex.code); }
    else if (ex.type === 'debug' || ex.type === 'code') { setVal($('textarea.editor-fallback'), ex.solution); }
    else if (ex.type === 'parsons') { await solveParsons(ex); }
    else if (ex.type === 'trace') {
      ex.rows.forEach((row, r) => row.forEach((c, ci) => { if (Array.isArray(c)) setVal($$('table.trace tbody tr')[r].querySelectorAll('td')[ci - 1 + 0 + 0] ? $$('table.trace tbody tr')[r].querySelectorAll('td.fill input')[ex.rows[r].slice(0, ci).filter(Array.isArray).length] : null, c[0]); }));
      if (ex.finalOutput) setVal($('.field.final input'), ex.finalOutput.answer[0]);
    }
    clickBtn('Verificar');
    await until(() => $('.fb.good') || $('.fb.bad'), 'feedback ' + ex.id);
    if (!$('.fb.good')) fail(ex.id + ' ' + ex.title + ' não passou: ' + $('.fb.bad').textContent.slice(0, 160));
  } catch (e) { fail(ex.id + ' excepção: ' + e.message); }
}
const xpTxt = $('#topbar .xp').textContent;
console.log('XP final:', xpTxt, '| nível:', $('#topbar .lv').textContent);
const expectedXP = T.exercises.reduce((a, e) => a + e.xp + 5, 0);
if (xpTxt !== expectedXP + ' XP') fail('XP esperado ' + expectedXP + ' obtido ' + xpTxt);

// 3. falhas repetidas -> solução e estado "saltado" (usa o estado de uma nova sessão)
w.Progress.reset();
w.Progress.setResult('w1-1',2,1,0); w.Progress.setResult('w1-2',2,1,0);
await nav('#/');
await nav('#/ex/w1-3');
setVal($('textarea.editor-fallback'), $('textarea.editor-fallback').value);
for (let i = 0; i < 3; i++) { clickBtn('Verificar'); await until(() => $('.fb.bad'), 'falha ' + i); await sleep(20); }
if ($('button.hidden') === null && !$$('button').some(b => b.textContent.startsWith('Ver solução') && !b.classList.contains('hidden'))) fail('botão de solução não apareceu');
clickBtn('Ver solução');
await sleep(20);
if (w.Progress.get('w1-3').st !== 3) fail('estado saltado esperado');
if (!/Continuar/.test($('.feedback').textContent)) fail('sem botão continuar após solução');

// 4. desbloqueio sequencial
await nav('#/ex/w1-5');
if (!$('.world-card') && !/Completa primeiro/.test($('#toast').textContent)) fail('exercício bloqueado devia redirecionar');

// 5. modal de progresso + import/export
w.Progress.reset();
w.Progress.setResult('w1-1', 2, 1, 0);
await nav('#/');
$('.level-chip').click();
await sleep(10);
const code = $('.modal textarea.codebox').value;
if (!/^TP1-/.test(code)) fail('código de progresso em falta');
const imp = $$('.modal textarea.codebox')[1];
setVal(imp, 'lixo');
clickBtn('Carregar código');
if (!/não parece/.test($('.modal .note.bad').textContent)) fail('mensagem de código inválido');
setVal(imp, code);
clickBtn('Carregar código');
if (!/Progresso carregado/.test($('.modal .note.ok').textContent)) fail('importação');

// 6. tema
const th = w.document.documentElement;
$('button[aria-label="Mudar tema"]').click();
if (!th.getAttribute('data-theme')) fail('tema não aplicado');

console.log(fails ? `${fails} falhas` : 'UI OK');
process.exit(fails ? 1 : 0);
