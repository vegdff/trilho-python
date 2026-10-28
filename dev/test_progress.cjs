const path=require('path');const base=path.join(__dirname,'..')+'/';
for (const f of ['helpers','mundos-1','mundos-2','mundos-3']) require(base+'js/data/'+f+'.js');
const T=require(base+'js/data/index.js'); const P=require(base+'js/progress.js');
const assert=require('assert');
P.load(); P.setAlias('Rita Ç');
P.setResult(T.exercises[0].id,2,1,0); P.setResult(T.exercises[5].id,1,3,2); P.setResult(T.exercises[111].id,3,15,1);
const code=P.exportCode(T.exercises); console.log(code.length, code.slice(0,60));
const d=P.decode(code,T.exercises);
assert.equal(d.alias,'Rita Ç'); assert.equal(d.entries[T.exercises[0].id].st,2); assert.equal(d.entries[T.exercises[5].id].at,3); assert.equal(d.entries[T.exercises[111].id].st,3);
assert.equal(Object.keys(d.entries).length,3);
// corrupção
const bad=code.slice(0,20)+(code[20]==='A'?'B':'A')+code.slice(21);
assert.throws(()=>P.decode(bad,T.exercises));
assert.throws(()=>P.decode('olá',T.exercises));
// cola com quebras de linha
P.decode(code.slice(0,30)+'\n '+code.slice(30),T.exercises);
// merge
P.reset(); P.setResult(T.exercises[0].id,1,2,0); P.importCode(code,T.exercises);
assert.equal(P.get(T.exercises[0].id).st,2); assert.equal(P.get(T.exercises[5].id).st,1);
// xp
const xp=P.xpOf(T.exercises); console.log('xp',xp,'nivel',P.levelOf(xp));
console.log('progress OK');
