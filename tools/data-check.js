// 用法：node data-check.js c   → 印出 data-c.js 每張圖產生的所有例句，檢查通不通順
const { TPL, H } = require('./content-src2.js');
const { R } = require('./content-src.js');
const imgs = require('./data-' + process.argv[2] + '.js');
const need = 'id name words zh pa pn pin pe pl nm act v O cl a a2 g O2 cl2 loc t sp cmp skip'.split(' ');
imgs.forEach((im) => {
  const miss = need.filter((k) => im[k] == null); if (miss.length) console.log('!! 缺欄位', im.id, miss.join(','));
  console.log('\n## ' + im.id + ' ' + im.name);
  R.forEach((row, ri) => { const f = TPL[ri]; if (!f || im.skip.includes(ri) || (im.home && H(im).includes(ri))) return; const x = f(im); if (x) console.log(ri + ' [' + row[0].slice(0, 14) + '] ' + x); });
});
