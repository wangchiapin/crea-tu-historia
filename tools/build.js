// 用法：node build.js  → 產生 ../content.js（簡體由 OpenCC tw→cn 自動轉換）
const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc-js');
const { IMAGES, ORDER, R } = require('./content-src.js');
const { IMAGES2, TPL, H } = require('./content-src2.js');
const IMAGES3 = ['c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'].reduce((a, k) => { try { return a.concat(require('./data-' + k + '.js')); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; return a; } }, []);
const ALL2 = IMAGES2.concat(IMAGES3);
const toSC = OpenCC.Converter({ from: 'tw', to: 'cn' });
const both = (s) => ({ tc: s, sc: toSC(s) });

/* 分類（設定頁分組用）。新增圖片請在資料檔裡寫 cat，舊的 60 張記在這裡 */
const CAT_OLD = {
  地點場所: 'cafe park bookstore lake balcony seaside trail mrt nightmarket classroom market airport conveni busstop temple library postoffice supermarket kitchen bedroom livingroom desk doctor zoo pool camping crosswalk',
  飲食: 'breakfast hotpot dumpling fruit bubbletea bakery restaurant tea',
  動作活動: 'jogger phonecall basketball guitar laundry haircut clothes homework dogwalk fishing picnic bicycle luggage',
  天氣季節: 'rain snow typhoon hotsun spring autumn rainbow stars',
  節日: 'birthday midautumn newyear',
  人物生活: 'cafe2',
};
const CAT = {}; Object.keys(CAT_OLD).forEach((c) => CAT_OLD[c].split(' ').forEach((id) => { CAT[id] = c; }));
const CATS = ['地點場所', '飲食', '動作活動', '天氣季節', '節日', '人物生活'];
const images = IMAGES.concat(ALL2).map((im) => ({
  id: im.id,
  cat: im.cat || CAT[im.id] || '人物生活',
  src: im.src || ('images/' + im.id + '.svg'),
  name: both(im.name),
  words: im.words.map(both),
}));

const rules = R.map((row, ri) => {
  const [re, ...sents] = row;
  if (sents.length !== ORDER.length) throw new Error('句子數量不對：' + re);
  new RegExp(re); // 檢查正規表示式
  const s = {};
  ORDER.forEach((id, i) => { s[id] = both(sents[i]); });
  // 第二批圖片：用範本填空產生（沒有範本、或該圖不適用的就不放）
  ALL2.forEach((im) => {
    const f = TPL[ri];
    if (!f || im.skip.includes(ri) || (im.home && H(im).includes(ri))) return;
    const x = f(im);
    if (x) s[im.id] = both(x);
  });
  return { re, s };
});

// 有 like 的圖片，沿用另一張圖的例句（同一個場景、只是多了人物）
IMAGES.filter((im) => im.like).forEach((im) => rules.forEach((r) => { r.s[im.id] = r.s[im.like]; }));

const head = '// 由 tools/build.js 自動產生，請改 tools/content-src.js 後重新執行，不要直接改這個檔。\n';
fs.writeFileSync(path.join(__dirname, '..', 'content.js'), head + 'window.SD_IMAGES=' + JSON.stringify(images) + ';\n');
// 例句建議拆兩份：配得到第 1–2 冊語法點的（所有老師），和只配得到第 3–6 冊的（授權老師登入後才載入）
global.window = {}; require('../grammar-b12.js'); require('../grammar-b36.js');
const pts12 = window.GRAMMAR_LITE.points.slice();
const ptsAll = pts12.concat(window.GRAMMAR_MORE.points);
const r12 = rules.filter((r) => pts12.some((p) => new RegExp(r.re).test(p.t)));
const r36 = rules.filter((r) => !r12.includes(r));
fs.writeFileSync(path.join(__dirname, '..', 'hints.js'), head + '// 老師專用：例句建議（第 1–2 冊）。學生端不會載入這個檔。\nwindow.SD_RULES=' + JSON.stringify(r12) + ';\n');
fs.writeFileSync(path.join(__dirname, '..', 'hints-b36.js'), head + '// 老師專用：例句建議（第 3–6 冊），授權老師登入後才載入。\nwindow.SD_RULES_MORE=' + JSON.stringify(r36) + ';\n');
console.log('hints rules', r12.length, '+', r36.length);
console.log('images', images.length, 'rules', rules.length);
const bad = images.filter((i) => !CATS.includes(i.cat)); if (bad.length) throw new Error('分類不對：' + bad.map((i) => i.id + '=' + i.cat).join(','));
const cnt = {}; images.forEach((i) => { cnt[i.cat] = (cnt[i.cat] || 0) + 1; }); console.log(JSON.stringify(cnt));

// 統計有多少語法點能配到建議
window.GRAMMAR_LITE.points = ptsAll;
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
