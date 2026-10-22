// 用法：node build.js  → 產生 ../content.js（簡體由 OpenCC tw→cn 自動轉換）
const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc-js');
const { IMAGES, ORDER, R } = require('./content-src.js');
const toSC = OpenCC.Converter({ from: 'tw', to: 'cn' });
const both = (s) => ({ tc: s, sc: toSC(s) });

const images = IMAGES.map((im) => ({
  id: im.id,
  src: im.src,
  name: both(im.name),
  words: im.words.map(both),
}));

const rules = R.map((row) => {
  const [re, ...sents] = row;
  if (sents.length !== ORDER.length) throw new Error('句子數量不對：' + re);
  new RegExp(re); // 檢查正規表示式
  const s = {};
  ORDER.forEach((id, i) => { s[id] = both(sents[i]); });
  return { re, s };
});

// 有 like 的圖片，沿用另一張圖的例句（同一個場景、只是多了人物）
IMAGES.filter((im) => im.like).forEach((im) => rules.forEach((r) => { r.s[im.id] = r.s[im.like]; }));

const head = '// 由 tools/build.js 自動產生，請改 tools/content-src.js 後重新執行，不要直接改這個檔。\n';
fs.writeFileSync(path.join(__dirname, '..', 'content.js'), head + 'window.SD_IMAGES=' + JSON.stringify(images) + ';\n');
fs.writeFileSync(path.join(__dirname, '..', 'hints.js'), head + '// 老師專用：例句建議。學生端不會載入這個檔。\nwindow.SD_RULES=' + JSON.stringify(rules) + ';\n');
console.log('images', images.length, 'rules', rules.length);

// 統計有多少語法點能配到建議
global.window = {};
require('../grammar-lite.js');
let hit = 0; const miss = [];
window.GRAMMAR_LITE.points.forEach((p) => {
  const r = rules.find((x) => new RegExp(x.re).test(p.t));
  if (r) hit++; else miss.push(p);
});
const byBook = {};
window.GRAMMAR_LITE.points.forEach((p) => { byBook[p.b] = byBook[p.b] || { all: 0, hit: 0 }; byBook[p.b].all++; });
window.GRAMMAR_LITE.points.forEach((p) => { if (rules.find((x) => new RegExp(x.re).test(p.t))) byBook[p.b].hit++; });
console.log('可配到圖片例句的語法點：', hit, '/', window.GRAMMAR_LITE.points.length, JSON.stringify(byBook));
fs.writeFileSync(path.join(__dirname, 'unmatched.txt'), miss.map((p) => p.id + ' ' + p.t).join('\n'));
