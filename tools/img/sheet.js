// 預覽：把指定圖片拼成一張總覽 png
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
(async () => {
  const names = process.argv.slice(3); const out = process.argv[2];
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 450 * Math.ceil(names.length / 2) } });
  const html = '<body style="margin:0;display:grid;grid-template-columns:1fr 1fr;gap:4px;background:#222">' + names.map((n) => `<img src="file://${path.resolve(__dirname, '../../images', n + '.svg')}" style="width:100%;display:block">`).join('') + '</body>';
  fs.writeFileSync('/tmp/sheet.html', html);
  await p.goto('file:///tmp/sheet.html'); await p.waitForTimeout(500);
  await p.screenshot({ path: out, fullPage: true }); await b.close();
})();
