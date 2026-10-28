/* Progresso do aluno: guardado no navegador (localStorage) e exportável como código ou ficheiro.
   Estados: 0 = por fazer, 1 = feito com ajuda, 2 = feito sem ajuda, 3 = saltado (viu a solução). */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Progress = factory();
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  var PREFIX = "TP1-";
  var SALT = "trilho-python-v1";
  var KEY = "trilho.estado.v1";
  var CLEAN_BONUS = 5;
  var XP_PER_LEVEL = 100;
  var RANK = { 0: 0, 3: 1, 1: 2, 2: 3 };

  // ---------- armazenamento com alternativa em memória ----------
  var mem = {};
  function store() {
    try {
      var ls = typeof localStorage !== "undefined" ? localStorage : null;
      if (ls) { ls.setItem("trilho.teste", "1"); ls.removeItem("trilho.teste"); return ls; }
    } catch (e) {}
    return {
      getItem: function (k) { return k in mem ? mem[k] : null; },
      setItem: function (k, v) { mem[k] = String(v); },
      removeItem: function (k) { delete mem[k]; },
    };
  }
  var persistent = (function () {
    try { var ls = localStorage; ls.setItem("trilho.t", "1"); ls.removeItem("trilho.t"); return true; } catch (e) { return false; }
  })();

  // ---------- estado ----------
  var state = { alias: "", theme: "auto", free: false, ex: {}, drafts: {} };

  function load() {
    try {
      var raw = store().getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        state.alias = s.alias || "";
        state.theme = s.theme || "auto";
        state.free = !!s.free;
        state.ex = s.ex || {};
        state.drafts = s.drafts || {};
      }
    } catch (e) {}
    return state;
  }
  function save() {
    try { store().setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function reset() { state = { alias: "", theme: state.theme, free: false, ex: {}, drafts: {} }; save(); }

  function get(id) { return state.ex[id] || { st: 0, at: 0, h: 0 }; }
  function setResult(id, st, attempts, hints) {
    var cur = get(id);
    // nunca descer de categoria
    if (RANK[st] < RANK[cur.st]) st = cur.st;
    state.ex[id] = { st: st, at: Math.min(15, Math.max(attempts, cur.at || 0)), h: Math.max(hints || 0, cur.h || 0) };
    save();
  }
  function noteAttempt(id) {
    var cur = get(id);
    state.ex[id] = { st: cur.st, at: Math.min(15, (cur.at || 0) + 1), h: cur.h || 0 };
    save();
  }
  function noteHint(id) {
    var cur = get(id);
    state.ex[id] = { st: cur.st, at: cur.at || 0, h: (cur.h || 0) + 1 };
    save();
  }
  function setAlias(a) { state.alias = String(a || "").trim().slice(0, 24); save(); }
  function setTheme(t) { state.theme = t; save(); }
  function setFree(f) { state.free = !!f; save(); }
  function setDraft(id, code) { state.drafts[id] = code; save(); }
  function getDraft(id) { return state.drafts[id]; }
  function clearDraft(id) { delete state.drafts[id]; save(); }

  function isDone(id) { var s = get(id).st; return s === 1 || s === 2 || s === 3; }

  function xpOf(exercises, entries) {
    var xp = 0;
    exercises.forEach(function (ex) {
      var e = entries ? entries[ex.id] : get(ex.id);
      if (!e) return;
      if (e.st === 1) xp += ex.xp;
      else if (e.st === 2) xp += ex.xp + CLEAN_BONUS;
    });
    return xp;
  }
  function levelOf(xp) { return 1 + Math.floor(xp / XP_PER_LEVEL); }

  // ---------- codificação ----------
  var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  function b64enc(bytes) {
    var out = "";
    for (var i = 0; i < bytes.length; i += 3) {
      var b0 = bytes[i], b1 = i + 1 < bytes.length ? bytes[i + 1] : 0, b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
      out += B64[b0 >> 2] + B64[((b0 & 3) << 4) | (b1 >> 4)];
      if (i + 1 < bytes.length) out += B64[((b1 & 15) << 2) | (b2 >> 6)];
      if (i + 2 < bytes.length) out += B64[b2 & 63];
    }
    return out;
  }
  function b64dec(str) {
    var vals = [];
    for (var i = 0; i < str.length; i++) {
      var v = B64.indexOf(str[i]);
      if (v < 0) throw new Error("Caracter inválido no código.");
      vals.push(v);
    }
    var out = [];
    for (var j = 0; j < vals.length; j += 4) {
      var a = vals[j], b = vals[j + 1], c = vals[j + 2], d = vals[j + 3];
      if (b === undefined) throw new Error("Código incompleto.");
      out.push((a << 2) | (b >> 4));
      if (c !== undefined) out.push(((b & 15) << 4) | (c >> 2));
      if (d !== undefined) out.push(((c & 3) << 6) | d);
    }
    return out;
  }
  var crcTable = null;
  function crc32(bytes) {
    if (!crcTable) {
      crcTable = [];
      for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        crcTable[n] = c >>> 0;
      }
    }
    var crc = 0xffffffff;
    for (var i = 0; i < bytes.length; i++) crc = crcTable[(crc ^ bytes[i]) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }
  function utf8enc(s) {
    var out = [];
    var enc = unescape(encodeURIComponent(s));
    for (var i = 0; i < enc.length; i++) out.push(enc.charCodeAt(i));
    return out;
  }
  function utf8dec(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    try { return decodeURIComponent(escape(s)); } catch (e) { return ""; }
  }
  function checksum(payload) {
    return crc32(utf8enc(SALT).concat(payload));
  }

  // entries: {id: {st, at}}; exercises: lista ordenada do catálogo
  function encode(exercises, entries, alias) {
    var n = exercises.length;
    var al = utf8enc(String(alias || "").slice(0, 24)).slice(0, 60);
    var payload = [1, (n >> 8) & 255, n & 255, al.length].concat(al);
    var bits = 0, acc = 0;
    var packed = [];
    exercises.forEach(function (ex) {
      var e = entries[ex.id] || { st: 0, at: 0 };
      var v = ((e.st & 3) << 4) | (Math.min(15, e.at || 0) & 15);
      acc = (acc << 6) | v;
      bits += 6;
      while (bits >= 8) {
        packed.push((acc >> (bits - 8)) & 255);
        bits -= 8;
        acc &= (1 << bits) - 1;
      }
    });
    if (bits > 0) packed.push((acc << (8 - bits)) & 255);
    payload = payload.concat(packed);
    var c = checksum(payload);
    payload.push((c >>> 24) & 255, (c >>> 16) & 255, (c >>> 8) & 255, c & 255);
    return PREFIX + b64enc(payload);
  }

  // Devolve {alias, entries:{id:{st,at}}, count} ou lança Error com mensagem em português.
  function decode(code, exercises) {
    code = String(code || "").trim().replace(/\s+/g, "");
    var m = code.match(/TP1-[A-Za-z0-9_-]+/);
    if (!m) throw new Error("Isto não parece um código do Trilho Python (tem de começar por TP1-).");
    var bytes;
    try { bytes = b64dec(m[0].slice(PREFIX.length)); } catch (e) { throw new Error("O código está danificado: " + e.message); }
    if (bytes.length < 9) throw new Error("O código está incompleto.");
    var body = bytes.slice(0, bytes.length - 4);
    var got = ((bytes[bytes.length - 4] << 24) | (bytes[bytes.length - 3] << 16) | (bytes[bytes.length - 2] << 8) | bytes[bytes.length - 1]) >>> 0;
    if (checksum(body) !== got) throw new Error("O código não é válido. Copiaste-o completo? Falta ou sobra algum carácter.");
    if (body[0] !== 1) throw new Error("Este código é de uma versão desconhecida.");
    var n = (body[1] << 8) | body[2];
    var alen = body[3];
    var alias = utf8dec(body.slice(4, 4 + alen));
    var data = body.slice(4 + alen);
    var entries = {};
    var bits = 0, acc = 0, di = 0;
    for (var i = 0; i < n; i++) {
      while (bits < 6) { acc = (acc << 8) | (data[di++] || 0); bits += 8; }
      var v = (acc >> (bits - 6)) & 63;
      bits -= 6;
      acc &= (1 << bits) - 1;
      if (i < exercises.length) {
        var st = v >> 4, at = v & 15;
        if (st) entries[exercises[i].id] = { st: st, at: at };
        else if (at) entries[exercises[i].id] = { st: 0, at: at };
      }
    }
    return { alias: alias, entries: entries, count: n, extra: Math.max(0, n - exercises.length) };
  }

  // Junta duas coleções, ficando com a melhor de cada exercício.
  function mergeEntries(a, b) {
    var out = {};
    var keys = {};
    Object.keys(a).forEach(function (k) { keys[k] = 1; });
    Object.keys(b).forEach(function (k) { keys[k] = 1; });
    Object.keys(keys).forEach(function (k) {
      var x = a[k] || { st: 0, at: 0, h: 0 }, y = b[k] || { st: 0, at: 0, h: 0 };
      var best = RANK[x.st] >= RANK[y.st] ? x : y;
      out[k] = { st: best.st, at: Math.max(x.at || 0, y.at || 0), h: Math.max(x.h || 0, y.h || 0) };
    });
    return out;
  }
  function importCode(code, exercises) {
    var d = decode(code, exercises);
    state.ex = mergeEntries(state.ex, d.entries);
    if (!state.alias && d.alias) state.alias = d.alias;
    save();
    return d;
  }
  function exportCode(exercises) { return encode(exercises, state.ex, state.alias); }

  return {
    PREFIX: PREFIX, CLEAN_BONUS: CLEAN_BONUS, XP_PER_LEVEL: XP_PER_LEVEL,
    load: load, save: save, reset: reset, get: get, setResult: setResult, noteAttempt: noteAttempt, noteHint: noteHint,
    setAlias: setAlias, setTheme: setTheme, setFree: setFree, setDraft: setDraft, getDraft: getDraft, clearDraft: clearDraft, isDone: isDone,
    xpOf: xpOf, levelOf: levelOf, encode: encode, decode: decode, mergeEntries: mergeEntries,
    importCode: importCode, exportCode: exportCode,
    getState: function () { return state; }, isPersistent: function () { return persistent; },
  };
});
