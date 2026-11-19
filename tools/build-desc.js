// 產生語法點「用法說明」資料：node tools/build-desc.js <grammar-data.js 路徑>
// 來源：Generador-de-ejercicios 的 grammar-data.js（t.es/t.en 標題翻譯、d 用法說明）
// 輸出：grammar-desc-b12.js（第1–2冊，所有老師）、grammar-desc-b36.js（第3–6冊，授權老師登入後才載入）
// 每筆 [標題西, 標題英, 標題英(簡), 說明繁, 說明簡, 說明西, 說明英]
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = process.argv[2];
if (!src) { console.error('用法：node tools/build-desc.js <grammar-data.js>'); process.exit(1); }
const sb = { window: {} }; vm.runInNewContext(fs.readFileSync(src, 'utf8'), sb);
const out = { 12: {}, 36: {} };
sb.window.GRAMMAR.points.forEach((p) => {
  const t = p.t || {}, d = p.d || {};
  const row = [t.es || '', t.en || '', t.ens && t.ens !== t.en ? t.ens : '', d.tc || '', d.sc || '', d.es || '', d.en || ''];
  out[p.b <= 2 ? 12 : 36][p.id] = row;
});
const root = path.join(__dirname, '..');
for (const k of [12, 36]) {
  const head = '// 由 tools/build-desc.js 產生，不要手改。[標題西, 標題英, 標題英(簡), 說明繁, 說明簡, 說明西, 說明英]\n';
  fs.writeFileSync(path.join(root, 'grammar-desc-b' + k + '.js'), head + 'window.GDESC=Object.assign(window.GDESC||{},' + JSON.stringify(out[k]) + ');\n');
  console.log('b' + k, Object.keys(out[k]).length);
}
