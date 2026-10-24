const { rng, lin, rad, Scene, shadow, person, shade } = require('./lib');
const out = {};

/* ---- 共用小工具 ---- */
const FONT = 'font-family="\'Noto Sans CJK TC\',\'PingFang TC\',sans-serif"';
// 紙箱
const box = (s, x, y, w, h, d = 18, col = '#cfa772', tape = true) => {
  const t = shade(col, 0.2), r = shade(col, -0.22);
  s.add(shadow(x + w / 2 + d / 2, y + h + 2, w * 0.62, 7, 0.35));
  s.add(`<path d="M${x} ${y}L${x + d} ${y - d * 0.55}L${x + w + d} ${y - d * 0.55}L${x + w} ${y}Z" fill="${t}"/>`);
  s.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>`);
  s.add(`<path d="M${x + w} ${y}L${x + w + d} ${y - d * 0.55}L${x + w + d} ${y + h - d * 0.55}L${x + w} ${y + h}Z" fill="${r}"/>`);
  if (tape) s.add(`<rect x="${x + w / 2 - 8}" y="${y}" width="16" height="${h * 0.45}" fill="#e9dbb4" opacity="0.85"/><path d="M${x + w / 2 - 8} ${y}L${x + w / 2 - 8 + d * 0.9} ${y - d * 0.5}L${x + w / 2 + 8 + d * 0.9} ${y - d * 0.5}L${x + w / 2 + 8} ${y}Z" fill="#e9dbb4" opacity="0.85"/>`);
};
// 花朵
const flowerHead = (x, y, kind, r) => {
  x = +x; y = +y;
  if (kind.startsWith('rose')) { const c = kind === 'rose' ? '#d8384f' : '#f2a0b8'; return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${r * 0.66}" fill="${shade(c, -0.15)}"/><path d="M${x - r * 0.4} ${y}Q${x} ${y - r * 0.6} ${x + r * 0.4} ${y}Q${x} ${y + r * 0.4} ${x - r * 0.1} ${y}" stroke="${shade(c, -0.45)}" stroke-width="1.6" fill="none"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.25}" fill="#fff" opacity="0.2"/>`; }
  if (kind === 'sun') { let p = ''; for (let i = 0; i < 14; i++) p += `<ellipse cx="${x}" cy="${y - r * 0.85}" rx="${r * 0.2}" ry="${r * 0.5}" fill="${i % 2 ? '#f6c52a' : '#f9d646'}" transform="rotate(${i * 360 / 14} ${x} ${y})"/>`; return p + `<circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="#6a4320"/><circle cx="${x}" cy="${y}" r="${r * 0.3}" fill="#4a2e16"/>`; }
  if (kind === 'daisy') { let p = ''; for (let i = 0; i < 9; i++) p += `<ellipse cx="${x}" cy="${y - r * 0.6}" rx="${r * 0.22}" ry="${r * 0.46}" fill="#fff" transform="rotate(${i * 40} ${x} ${y})"/>`; return p + `<circle cx="${x}" cy="${y}" r="${r * 0.3}" fill="#f2c230"/>`; }
  if (kind === 'tulip') return `<path d="M${x - r * 0.8} ${y - r * 0.3}Q${x - r * 0.9} ${y + r} ${x} ${y + r}Q${x + r * 0.9} ${y + r} ${x + r * 0.8} ${y - r * 0.3}L${x + r * 0.4} ${y - r * 0.9}L${x} ${y - r * 0.3}L${x - r * 0.4} ${y - r * 0.9}Z" fill="#f08a3c"/><path d="M${x} ${y - r * 0.3}Q${x - r * 0.2} ${y + r * 0.6} ${x} ${y + r}" stroke="#c7621f" stroke-width="2" fill="none"/>`;
  if (kind === 'hyd') { let p = ''; for (let i = 0; i < 9; i++) { const a = i * 2.4, d = i === 0 ? 0 : r * 0.55; p += `<circle cx="${(x + Math.cos(a) * d).toFixed(1)}" cy="${(y + Math.sin(a) * d).toFixed(1)}" r="${r * 0.4}" fill="${i % 2 ? '#8a9ae0' : '#a9b6f0'}"/>`; } return p; }
  return '';
};
const bucketOf = (s, cx, rimY, w, h, kinds, seed, spread = 0.6, base = 80, tint = '#7fa5b8') => {
  const R = rng(seed); const n = kinds.length * 3 + 2; const stems = [], heads = [];
  for (let i = 0; i < n; i++) {
    const th = -spread + (2 * spread * i) / (n - 1) + (R() - 0.5) * 0.12, L = base + R() * 50 + (1 - Math.abs(th) / spread) * 25;
    const hx = cx + Math.sin(th) * L, hy = rimY - Math.cos(th) * L;
    stems.push(`<path d="M${(cx + th * w * 0.4).toFixed(1)} ${rimY + 10}Q${(cx + th * w * 0.4 + (hx - cx) * 0.5).toFixed(1)} ${(rimY - L * 0.45).toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)}" stroke="#3f7d3c" stroke-width="3.5" fill="none"/>`);
    if (i % 3 === 1) stems.push(`<ellipse cx="${(cx + th * w * 0.4 + (hx - cx) * 0.35).toFixed(1)}" cy="${(rimY - L * 0.3).toFixed(1)}" rx="14" ry="5" fill="#4f9448" transform="rotate(${-30 + th * 80} ${(cx + th * w * 0.4 + (hx - cx) * 0.35).toFixed(1)} ${(rimY - L * 0.3).toFixed(1)})"/>`);
    heads.push([hy, flowerHead(hx.toFixed(1), hy.toFixed(1), kinds[i % kinds.length], 17 + R() * 5)]);
  }
  s.add(stems.join('')); s.add(heads.sort((a, b) => a[0] - b[0]).map((h) => h[1]).join(''));
  const k = s.uid('bk'); s.def(lin(k, 0, 0, 1, 0, [[0, shade(tint, 0.25)], [0.5, tint], [1, shade(tint, -0.35)]]));
  s.add(shadow(cx, rimY + h + 2, w * 0.6, 9, 0.4));
  s.add(`<path d="M${cx - w / 2} ${rimY}L${cx - w * 0.4} ${rimY + h}L${cx + w * 0.4} ${rimY + h}L${cx + w / 2} ${rimY}Z" fill="url(#${k})"/><ellipse cx="${cx}" cy="${rimY}" rx="${w / 2}" ry="8" fill="${shade(tint, -0.3)}"/><ellipse cx="${cx}" cy="${rimY + 1}" rx="${w / 2 - 3}" ry="6" fill="#2b4a58"/><path d="M${cx - w / 2} ${rimY}Q${cx} ${rimY + 14} ${cx + w / 2} ${rimY}" stroke="${shade(tint, 0.3)}" stroke-width="2" fill="none"/>`);
};

/* H1 花店 */
out.flowershop = () => {
  const s = Scene(); const R = rng(81);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f8ebe3'], [1, '#ecd5c8']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#cfa77c'], [1, '#a47c55']]));
  s.def(lin('ctr', 0, 0, 0, 1, [[0, '#f0e0c4'], [1, '#d3b88d']]));
  s.def(lin('top', 0, 0, 0, 1, [[0, '#a98258'], [1, '#8a6642']]));
  s.def(lin('sh', 0, 0, 0, 1, [[0, '#a98258'], [1, '#7f5e3c']]));
  s.def(lin('win', 0, 0, 0, 1, [[0, '#cfe9f4'], [1, '#f0f6e6']]));
  s.def(rad('glow', 0.5, 0.5, 0.5, [[0, '#fff6d8', 0.7], [1, '#fff6d8', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="400" width="800" height="200" fill="url(#fl)"/>');
  s.add('<g stroke="#7f5e3c" stroke-width="2" opacity="0.3"><path d="M0 430H800M0 470H800M0 520H800M0 580H800"/></g>');
  // 窗
  s.add('<rect x="196" y="76" width="170" height="220" fill="url(#win)"/><path d="M281 76V296M196 186H366" stroke="#fff" stroke-width="6"/><rect x="196" y="76" width="170" height="220" fill="none" stroke="#8a6642" stroke-width="8"/>');
  s.add('<g filter="url(#b8)"><ellipse cx="236" cy="266" rx="46" ry="26" fill="#6aa65a"/><ellipse cx="330" cy="150" rx="40" ry="24" fill="#8cbf6a"/></g>');
  s.add(`<rect x="232" y="210" width="76" height="30" rx="5" fill="#d6483c"/><text x="270" y="232" font-size="20" font-weight="700" text-anchor="middle" fill="#fff" ${FONT}>營業中</text><path d="M270 210V196" stroke="#8a6642" stroke-width="2"/>`);
  // 吊牌
  s.add('<path d="M500 0V14M620 0V14" stroke="#6b4b2f" stroke-width="3"/>');
  s.add(`<rect x="448" y="12" width="224" height="62" rx="14" fill="#fff8ef" stroke="#8a6642" stroke-width="5"/><text x="560" y="60" font-size="46" font-weight="700" text-anchor="middle" fill="#d0486a" ${FONT}>花店</text>`);
  s.add(flowerHead(468, 22, 'rose2', 12) + flowerHead(652, 22, 'daisy', 12));
  // 後牆層板與花瓶
  [[330, 168], [330, 288]].forEach(([x, y]) => s.add(`<rect x="${x + 90}" y="${y}" width="360" height="12" fill="url(#sh)"/><rect x="${x + 90}" y="${y + 12}" width="360" height="6" fill="#000" opacity="0.15"/>`));
  const vase = (x, y, col, k, kinds) => {
    const R2 = rng(k);
    let st = '', hd = [];
    for (let i = 0; i < 4; i++) { const hx = x + (i - 1.5) * 15, hy = y - 52 - R2() * 20; st += `<path d="M${x + (i - 1.5) * 4} ${y - 22}L${hx} ${hy}" stroke="#3f7d3c" stroke-width="3"/>`; hd.push(flowerHead(hx, hy, kinds[i % kinds.length], 11)); }
    s.add(st + hd.join('') + `<path d="M${x - 14} ${y - 26}Q${x - 24} ${y - 6} ${x - 16} ${y}L${x + 16} ${y}Q${x + 24} ${y - 6} ${x + 14} ${y - 26}Z" fill="${col}" opacity="0.92"/><path d="M${x - 8} ${y - 24}Q${x - 14} ${y - 8} ${x - 9} ${y}" stroke="#fff" stroke-width="3" opacity="0.5" fill="none"/>`);
  };
  vase(470, 168, '#bfe0ea', 3, ['daisy', 'tulip', 'rose2']); vase(540, 168, '#e8c6a0', 5, ['sun', 'sun', 'daisy']); vase(690, 168, '#c9d8a8', 7, ['hyd', 'rose', 'hyd']); vase(745, 168, '#bfe0ea', 9, ['tulip', 'tulip', 'daisy']);
  vase(450, 288, '#e8c6a0', 11, ['rose', 'rose2', 'daisy']); vase(720, 288, '#bfe0ea', 13, ['hyd', 'daisy', 'hyd']);
  // 盆栽
  s.add('<path d="M600 288Q580 250 586 226Q604 250 604 288ZM606 288Q614 240 640 224Q630 262 612 288Z" fill="#4f9448"/><path d="M590 288H636L630 316H596Z" fill="#c98a5a"/>');
  // 店員
  s.add(person(s, { x: 560, y: 236, h: 330, skin: 'mid', hair: '#2a1b14', hairStyle: 'bun', top: '#8fb98a', bottom: '#333', pose: 'hold', legs: 'sit' }));
  s.add('<path d="M515 288Q560 300 605 288L612 372H508Z" fill="#fff6e8" opacity="0.96"/><path d="M515 288Q560 304 605 288" stroke="#cdb99c" stroke-width="3" fill="none"/><path d="M530 340H590" stroke="#e7d6b8" stroke-width="2"/>');
  // 櫃台
  s.add(shadow(560, 526, 250, 14, 0.4));
  s.add('<rect x="330" y="372" width="450" height="150" fill="url(#ctr)"/><rect x="320" y="366" width="470" height="14" rx="3" fill="url(#top)"/>');
  s.add('<g stroke="#b79b70" stroke-width="2" opacity="0.7"><path d="M380 392V510M470 392V510M560 392V510M650 392V510M740 392V510"/></g><rect x="330" y="372" width="450" height="150" fill="#000" opacity="0.04"/>');
  // 桌上花束
  s.add('<path d="M440 360Q470 350 520 345Q560 344 580 350L572 368H450Z" fill="#fffdf6" opacity="0.95"/><path d="M455 366L585 352" stroke="#e8dfc8" stroke-width="2"/>');
  s.add(flowerHead(480, 338, 'rose', 17) + flowerHead(506, 330, 'sun', 20) + flowerHead(538, 336, 'rose2', 17) + flowerHead(466, 352, 'daisy', 12));
  s.add('<path d="M418 366Q440 350 470 348L478 372Z" fill="#fff" opacity="0.9"/><path d="M432 358L470 366M436 372L470 370" stroke="#d0486a" stroke-width="6" stroke-linecap="round"/>');
  s.add('<path d="M620 366L628 352L640 366M628 352L620 342" stroke="#888" stroke-width="3" fill="none"/><circle cx="624" cy="344" r="3" fill="#d8384f"/>');
  s.add('<circle cx="700" cy="352" r="12" fill="#e8c6a0"/><circle cx="700" cy="352" r="5" fill="#b78a5a"/><rect x="690" y="340" width="20" height="8" fill="#d0486a"/>');
  // 顧客
  s.add(person(s, { x: 124, y: 196, h: 372, skin: 'light', hair: '#4a3022', hairStyle: 'long', top: '#e9a7b2', bottom: '#4a5a7a', pose: 'hold', legs: 'stand', shoe: '#f2f2f2' }));
  s.add('<path d="M96 262L132 262L124 318L104 318Z" fill="#fff8ef" stroke="#e0d4bc" stroke-width="2"/><path d="M108 290L120 290" stroke="#d0486a" stroke-width="5"/>'); s.add(flowerHead(104, 252, 'sun', 15) + flowerHead(130, 248, 'rose', 14) + flowerHead(118, 238, 'daisy', 11) + flowerHead(142, 262, 'rose2', 11));
  // 前景水桶
  bucketOf(s, 290, 482, 120, 88, ['rose', 'daisy', 'tulip'], 21, 0.7, 70);
  bucketOf(s, 560, 492, 130, 92, ['sun', 'sun', 'rose2'], 22, 0.65, 72, '#8ab07a');
  bucketOf(s, 720, 506, 100, 76, ['hyd', 'tulip'], 23, 0.6, 60, '#a8b3c4');
  s.add('<rect width="800" height="600" fill="url(#glow)" opacity="0.4"/>');
  return s.out();
};

/* H2 藥局 */
out.pharmacy = () => {
  const s = Scene(); const R = rng(82);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#eef4f1'], [1, '#d9e4df']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#d9dde0'], [1, '#b3babf']]));
  s.def(lin('ctr', 0, 0, 0, 1, [[0, '#fdfdfb'], [1, '#d7dedb']]));
  s.def(lin('grn', 0, 0, 0, 1, [[0, '#2f9a62'], [1, '#1f7a4a']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="400" width="800" height="200" fill="url(#fl)"/>');
  s.add('<g stroke="#9aa3a8" stroke-width="2" opacity="0.5"><path d="M0 450H800M0 510H800M0 580H800M130 400L40 600M300 400L260 600M470 400L470 600M640 400L680 600M800 420L800 600"/></g>');
  // 上方招牌
  s.add('<rect width="800" height="70" fill="url(#grn)"/><rect y="70" width="800" height="6" fill="#bfe3cf"/>');
  s.add(`<rect x="300" y="12" width="200" height="46" rx="8" fill="#fff"/><text x="420" y="48" font-size="34" font-weight="700" text-anchor="middle" fill="#1f7a4a" ${FONT} letter-spacing="6">藥局</text><path d="M342 20h14v12h12v14h-12v12h-14v-12h-12v-14h12z" fill="#2f9a62" transform="translate(-18 -4)"/>`);
  // 貨架
  const cols = ['#f2f2ee', '#fff', '#e7f0f7', '#f7efe0', '#e9f4ea'], acc = ['#d8384f', '#2f7fc4', '#2f9a62', '#e8a02f', '#8a62c4'];
  [[100, 8, 258], [8, 8, 258]].forEach(() => {});
  for (let sec = 0; sec < 2; sec++) {
    const x0 = sec === 0 ? 20 : 410, w = sec === 0 ? 350 : 370;
    s.add(`<rect x="${x0}" y="96" width="${w}" height="246" fill="#f5f8f6" stroke="#aeb8b4" stroke-width="3"/>`);
    for (let r = 0; r < 4; r++) {
      const y = 96 + r * 62; s.add(`<rect x="${x0}" y="${y + 52}" width="${w}" height="8" fill="#c9d1ce"/><rect x="${x0}" y="${y + 60}" width="${w}" height="3" fill="#000" opacity="0.12"/>`);
      let x = x0 + 8;
      while (x < x0 + w - 36) {
        const bw = 26 + Math.floor(R() * 20), bh = 30 + Math.floor(R() * 18), c = cols[Math.floor(R() * 5)], a = acc[Math.floor(R() * 5)];
        if (R() < 0.35) s.add(`<rect x="${x + 4}" y="${y + 52 - 36}" width="${bw * 0.6}" height="36" rx="5" fill="${a}" opacity="0.9"/><rect x="${x + 8}" y="${y + 52 - 46}" width="${bw * 0.6 - 8}" height="10" rx="2" fill="#f2f2f2"/><rect x="${x + 6}" y="${y + 52 - 26}" width="${bw * 0.6 - 4}" height="12" fill="#fff" opacity="0.85"/>`);
        else s.add(`<rect x="${x}" y="${y + 52 - bh}" width="${bw}" height="${bh}" fill="${c}" stroke="#c4ccc8" stroke-width="1"/><rect x="${x}" y="${y + 52 - bh}" width="${bw}" height="8" fill="${a}"/><rect x="${x + 5}" y="${y + 52 - bh + 14}" width="${bw - 10}" height="6" fill="${a}" opacity="0.6"/>`);
        x += (R() < 0.35 ? 26 * 0.6 + 12 : bw + 6);
      }
    }
  }
  s.add('<rect x="360" y="96" width="50" height="246" fill="#e6ece9"/><rect x="368" y="110" width="34" height="34" fill="#fff" stroke="#2f9a62" stroke-width="3"/><path d="M380 118h10v8h8v10h-8v8h-10v-8h-8v-10h8z" fill="#2f9a62" transform="translate(-4 -2)"/>');
  s.add(`<text x="385" y="190" font-size="20" font-weight="700" text-anchor="middle" fill="#1f7a4a" ${FONT}>藥</text>`);
  // 藥師
  s.add(person(s, { x: 560, y: 236, h: 330, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#fbfbf8', bottom: '#333', pose: 'hold', legs: 'sit', glasses: true }));
  s.add('<path d="M525 262L560 330L595 262" stroke="#d7dedb" stroke-width="3" fill="none"/><rect x="574" y="296" width="30" height="14" rx="2" fill="#2f9a62"/><path d="M560 262V372" stroke="#d7dedb" stroke-width="2"/>');
  // 櫃台
  s.add(shadow(520, 548, 300, 14, 0.4));
  s.add('<rect x="250" y="386" width="540" height="160" fill="url(#ctr)"/><rect x="240" y="378" width="560" height="14" rx="3" fill="#fff" stroke="#c9d1ce" stroke-width="2"/><rect x="250" y="450" width="540" height="12" fill="url(#grn)"/>');
  // 櫃台上物品
  s.add('<rect x="640" y="352" width="70" height="28" rx="3" fill="#fff" stroke="#9fc9e6" stroke-width="2"/><rect x="640" y="352" width="70" height="9" fill="#5aa9dc"/><path d="M660 366h30" stroke="#9fc9e6" stroke-width="3"/>');
  s.add('<path d="M440 380V344Q440 336 450 336H492Q502 336 502 344V380Z" fill="#fff" stroke="#c9d1ce" stroke-width="2"/><path d="M458 350h10v8h8v10h-8v8h-10v-8h-8v-10h8z" fill="#d8384f" transform="translate(6 -6) scale(0.9)"/><path d="M440 350H502" stroke="#e4e9e7" stroke-width="2"/>');
  s.add('<rect x="590" y="360" width="26" height="20" rx="3" fill="#e8a02f"/><ellipse cx="603" cy="360" rx="13" ry="5" fill="#fff"/><rect x="510" y="364" width="16" height="16" fill="#f2f2f2" stroke="#9fc9e6" stroke-width="2"/><rect x="530" y="368" width="40" height="12" rx="2" fill="#e8f4fb" stroke="#9fc9e6" stroke-width="1.5"/>');
  s.add('<path d="M722 380L736 360L744 360L746 380" fill="#d9dde0"/><rect x="726" y="352" width="14" height="14" rx="3" fill="#b7bdc2"/><ellipse cx="740" cy="372" rx="26" ry="8" fill="#f2f2f2"/><path d="M720 372Q740 356 760 372" stroke="#d8384f" stroke-width="3" fill="none"/>');
  // 顧客（戴口罩）
  s.add(person(s, { x: 124, y: 200, h: 380, skin: 'mid', hair: '#222', hairStyle: 'short', top: '#d9a066', bottom: '#4a5a7a', pose: 'hold', legs: 'stand', shoe: '#e8e8e8' }));
  const sc = 380 / 7;
  s.add(`<path d="M${124 - 0.34 * sc} ${200 - 0.42 * sc}L${124 + 0.34 * sc} ${200 - 0.42 * sc}L${124 + 0.3 * sc} ${200 - 0.02 * sc}Q${124} ${200 + 0.1 * sc} ${124 - 0.3 * sc} ${200 - 0.02 * sc}Z" fill="#e6f3fa" stroke="#9fc9e6" stroke-width="1.5"/><path d="M${124 - 0.34 * sc} ${200 - 0.36 * sc}L${124 - 0.5 * sc} ${200 - 0.55 * sc}M${124 + 0.34 * sc} ${200 - 0.36 * sc}L${124 + 0.5 * sc} ${200 - 0.55 * sc}" stroke="#9fc9e6" stroke-width="1.5"/>`);
  s.add(`<rect x="${124 + 0.2 * sc}" y="${200 + 1.35 * sc}" width="${0.5 * sc}" height="${0.65 * sc}" rx="4" fill="#fff" stroke="#c9d1ce" stroke-width="2"/><path d="M${124 + 0.28 * sc} ${200 + 1.55 * sc}h${0.15 * sc}v-3h${0.1 * sc}v3h${0.15 * sc}" stroke="#d8384f" stroke-width="0" fill="none"/>`);
  // 前景推車/體重計
  s.add(shadow(700, 584, 70, 8, 0.4));
  s.add('<rect x="650" y="540" width="100" height="40" rx="8" fill="#e9eeec" stroke="#b7bdc2" stroke-width="2"/><rect x="675" y="550" width="50" height="14" rx="3" fill="#2b3a40"/><text x="700" y="562" font-size="11" fill="#7fe3a8" text-anchor="middle" font-family="monospace">58.0</text>');
  return s.out();
};

/* H3 手機行 */
out.phoneshop = () => {
  const s = Scene(); const R = rng(83);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f4f5f7'], [1, '#e1e5ea']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#d5d8dc'], [1, '#aeb3b9']]));
  s.def(lin('tab', 0, 0, 0, 1, [[0, '#ffffff'], [1, '#d5dbe0']]));
  s.def(lin('sc1', 0, 0, 1, 1, [[0, '#4fb3e8'], [1, '#7a5fd6']]));
  s.def(lin('sc2', 0, 0, 1, 1, [[0, '#f7a24a'], [1, '#e8506a']]));
  s.def(lin('sc3', 0, 0, 1, 1, [[0, '#4fd1a5'], [1, '#2f8fc4']]));
  s.def(lin('tl', 0, 0, 0, 1, [[0, '#18bfa9'], [1, '#0f9a89']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="410" width="800" height="190" fill="url(#fl)"/>');
  s.add('<g stroke="#9aa0a6" stroke-width="2" opacity="0.4"><path d="M0 460H800M0 530H800M200 410L120 600M400 410V600M600 410L680 600"/></g>');
  s.add(`<rect width="800" height="84" fill="url(#tl)"/><text x="400" y="62" font-size="50" font-weight="700" text-anchor="middle" fill="#fff" ${FONT} letter-spacing="10">手機</text><rect x="40" y="26" width="26" height="42" rx="5" fill="#fff"/><rect x="734" y="26" width="26" height="42" rx="5" fill="#fff"/><rect x="44" y="31" width="18" height="28" rx="2" fill="#0f9a89"/><rect x="738" y="31" width="18" height="28" rx="2" fill="#0f9a89"/>`);
  // 牆面展示
  s.add('<rect x="30" y="110" width="740" height="236" rx="6" fill="#fff" stroke="#c5ccd2" stroke-width="3"/>');
  for (let r = 0; r < 3; r++) {
    const y = 120 + r * 76;
    s.add(`<rect x="30" y="${y + 66}" width="740" height="6" fill="#c5ccd2"/>`);
    for (let i = 0; i < 9; i++) {
      const x = 52 + i * 80;
      if (r === 2 && (i % 3 === 1)) { // 手機殼、耳機
        s.add(`<rect x="${x}" y="${y + 10}" width="40" height="54" rx="6" fill="${['#f2a0b8', '#8ac4e8', '#f6d46a'][i % 3 === 1 ? (i % 2) : 0]}"/><circle cx="${x + 12}" cy="${y + 22}" r="6" fill="#222" opacity="0.7"/><rect x="${x + 34}" y="${y + 10}" width="0" height="0"/>`);
      } else if (r === 1 && i % 4 === 2) {
        s.add(`<path d="M${x + 6} ${y + 60}Q${x + 6} ${y + 14} ${x + 26} ${y + 14}Q${x + 46} ${y + 14} ${x + 46} ${y + 60}" stroke="#444" stroke-width="5" fill="none"/><rect x="${x + 2}" y="${y + 46}" width="10" height="16" rx="4" fill="#e8506a"/><rect x="${x + 40}" y="${y + 46}" width="10" height="16" rx="4" fill="#e8506a"/>`);
      } else {
        const g = ['sc1', 'sc2', 'sc3'][(i + r) % 3];
        s.add(`<rect x="${x + 4}" y="${y + 6}" width="34" height="58" rx="6" fill="#23272d"/><rect x="${x + 7}" y="${y + 10}" width="28" height="50" rx="3" fill="url(#${g})"/><circle cx="${x + 21}" cy="${y + 14}" r="1.6" fill="#111"/>`);
      }
    }
  }
  // 價格牌
  s.add(`<rect x="560" y="352" width="1" height="1"/>`);
  // 店員
  s.add(person(s, { x: 270, y: 226, h: 340, skin: 'light', hair: '#2a1b14', hairStyle: 'short', top: '#18bfa9', bottom: '#333', pose: 'hold', legs: 'sit', glasses: true }));
  s.add('<path d="M246 220L270 268L294 220" stroke="#1f4f8a" stroke-width="3" fill="none"/><rect x="262" y="268" width="16" height="24" rx="2" fill="#fff" stroke="#ccc"/>');
  const s1 = 340 / 7;
  s.add(`<g transform="rotate(-8 ${270 + 0.3 * s1} ${226 + 1.5 * s1})"><rect x="${270 + 0.15 * s1}" y="${226 + 1.2 * s1}" width="20" height="34" rx="4" fill="#23272d"/><rect x="${270 + 0.15 * s1 + 2}" y="${226 + 1.2 * s1 + 3}" width="16" height="28" rx="2" fill="url(#sc3)"/></g>`);
  // 顧客
  s.add(person(s, { x: 560, y: 232, h: 330, skin: 'tan', hair: '#1a120e', hairStyle: 'long', top: '#e86a5c', bottom: '#333', pose: 'hold', legs: 'sit', sleeve: 'short' }));
  const s2 = 330 / 7;
  s.add(`<g transform="rotate(8 ${560 - 0.3 * s2} ${232 + 1.5 * s2})"><rect x="${560 - 0.3 * s2 - 12}" y="${232 + 1.1 * s2}" width="26" height="42" rx="5" fill="#23272d"/><rect x="${560 - 0.3 * s2 - 9}" y="${232 + 1.1 * s2 + 3}" width="20" height="36" rx="3" fill="url(#sc2)"/></g>`);
  // 展示桌
  s.add(shadow(400, 540, 380, 14, 0.4));
  s.add('<rect x="30" y="396" width="740" height="140" fill="url(#tab)"/><rect x="20" y="388" width="760" height="14" rx="3" fill="#fff" stroke="#c5ccd2" stroke-width="2"/><rect x="30" y="470" width="740" height="10" fill="url(#tl)"/>');
  // 桌上手機架
  [[110, 'sc1'], [200, 'sc2'], [450, 'sc3'], [660, 'sc1'], [730, 'sc2']].forEach(([x, g]) => s.add(`<path d="M${x - 14} 388L${x - 6} 372H${x + 22}L${x + 28} 388Z" fill="#b8bec4"/><g transform="rotate(-6 ${x} 372)"><rect x="${x - 2}" y="326" width="28" height="48" rx="5" fill="#23272d"/><rect x="${x + 0}" y="330" width="24" height="40" rx="3" fill="url(#${g})"/></g>`));
  s.add('<path d="M280 386Q300 370 330 372" stroke="#444" stroke-width="3" fill="none"/><rect x="330" y="366" width="16" height="20" rx="3" fill="#fff" stroke="#bbb"/>');
  // 前景大手機展示
  s.add(shadow(110, 590, 70, 9, 0.45));
  s.add('<rect x="64" y="560" width="92" height="20" rx="6" fill="#c5ccd2"/><rect x="100" y="470" width="20" height="92" fill="#b3bac1"/><g transform="rotate(-5 110 470)"><rect x="60" y="410" width="100" height="126" rx="10" fill="#23272d"/><rect x="66" y="418" width="88" height="110" rx="5" fill="url(#sc1)"/></g>');
  s.add('<circle cx="100" cy="470" r="22" fill="#fff" opacity="0.25"/><path d="M82 480Q100 440 128 454" stroke="#fff" stroke-width="3" opacity="0.7" fill="none"/>');
  s.add('<rect x="640" y="520" width="110" height="60" rx="8" fill="#fff" stroke="#c5ccd2" stroke-width="2"/><rect x="654" y="532" width="26" height="36" rx="4" fill="#e8506a"/><rect x="686" y="532" width="26" height="36" rx="4" fill="#4fb3e8"/><rect x="718" y="532" width="20" height="36" rx="4" fill="#f6d46a"/>');
  return s.out();
};

/* H4 麵店 */
out.noodleshop = () => {
  const s = Scene(); const R = rng(84);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f4dfae'], [1, '#e3c385']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#c4a27a'], [1, '#8f7253']]));
  s.def(lin('tab', 0, 0, 0, 1, [[0, '#d9aa6a'], [1, '#b98648']]));
  s.def(lin('steel', 0, 0, 0, 1, [[0, '#e6eaec'], [1, '#aeb6ba']]));
  s.def(rad('lamp', 0.5, 0.2, 0.7, [[0, '#ffe7a8', 0.7], [1, '#ffe7a8', 0]]));
  s.def(lin('bowl', 0, 0, 0, 1, [[0, '#fffdf6'], [1, '#d8d2c2']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="404" width="800" height="196" fill="url(#fl)"/>');
  s.add('<g stroke="#6d553b" stroke-width="2" opacity="0.3"><path d="M0 450H800M0 510H800M0 580H800"/></g>');
  s.add('<rect y="260" width="800" height="14" fill="#b9402f" opacity="0.0"/>');
  // 燈籠
  [[400, 70], [790, 40]].forEach(([x, y]) => s.add(`<path d="M${x} 0V${y}" stroke="#555" stroke-width="2"/><ellipse cx="${x}" cy="${y + 34}" rx="24" ry="30" fill="#d8392b"/><path d="M${x - 24} ${y + 34}Q${x} ${y + 50} ${x + 24} ${y + 34}M${x - 20} ${y + 16}Q${x} ${y + 26} ${x + 20} ${y + 16}" stroke="#a82619" stroke-width="2" fill="none"/><rect x="${x - 10}" y="${y + 2}" width="20" height="6" fill="#e8c24a"/><rect x="${x - 10}" y="${y + 60}" width="20" height="6" fill="#e8c24a"/>`));
  s.add(`<text x="400" y="116" font-size="30" font-weight="700" text-anchor="middle" fill="#fff0c8" ${FONT}>麵</text>`);
  // 菜單木板
  const menu = [['牛肉麵', '120'], ['湯麵', '80'], ['小菜', '30']];
  menu.forEach(([n, p], i) => { const x = 450 + i * 112; s.add(`<rect x="${x}" y="48" width="100" height="116" rx="6" fill="#6b4a30" stroke="#4a3220" stroke-width="3"/><text x="${x + 50}" y="90" font-size="22" font-weight="700" text-anchor="middle" fill="#fff0c8" ${FONT}>${n}</text><path d="M${x + 14} 104H${x + 86}" stroke="#e8c24a" stroke-width="2"/><text x="${x + 50}" y="146" font-size="30" font-weight="700" text-anchor="middle" fill="#ffd56a" font-family="sans-serif">${p}</text>`); });
  // 廚房出餐檯
  s.add('<rect x="0" y="150" width="360" height="130" fill="#d9c7a0" opacity="0.5"/><rect x="0" y="150" width="360" height="8" fill="#b79b6a"/>');
  s.add('<g stroke="#8a6a3a" stroke-width="3"><path d="M30 150V190M80 150V190M130 150V190"/></g><path d="M20 190H150" stroke="#8a6a3a" stroke-width="3"/>');
  s.add('<path d="M28 190l6 28M60 190l-4 24M96 190l4 22M130 190l-2 30" stroke="#555" stroke-width="3"/><ellipse cx="206" cy="200" rx="22" ry="10" fill="#c7cdd0"/><path d="M190 190Q206 160 222 190" stroke="#6b4a30" stroke-width="3" fill="none"/>');
  // 老闆
  s.add(person(s, { x: 120, y: 196, h: 300, skin: 'mid', hair: '#2a1b14', hairStyle: 'short', top: '#fbf6e8', bottom: '#333', pose: 'hold', legs: 'sit', sleeve: 'short' }));
  s.add('<g transform="translate(120 146) scale(0.46 0.6) translate(-120 -130)"><path d="M72 106Q120 78 168 106L166 136H74Z" fill="#fffdf8" stroke="#e0d8c4" stroke-width="3"/><rect x="72" y="126" width="94" height="12" fill="#fffdf8" stroke="#e0d8c4" stroke-width="3"/></g>');
  s.add('<path d="M84 245L90 316H152L158 245Q120 262 84 245Z" fill="#fffdf8"/>');
  s.add('<rect x="0" y="324" width="360" height="100" fill="url(#steel)"/><rect x="0" y="316" width="360" height="12" fill="#f4f6f6" stroke="#aeb6ba"/>');
  // 大湯鍋與蒸氣
  s.add('<path d="M214 330Q214 296 240 296H330Q356 296 356 330Z" fill="#9aa3a8"/><ellipse cx="285" cy="296" rx="72" ry="10" fill="#6a7378"/><ellipse cx="285" cy="298" rx="62" ry="7" fill="#b9602f"/><path d="M208 308H214M356 308H362" stroke="#555" stroke-width="5"/>');
  s.add('<g filter="url(#b8)" opacity="0.8"><ellipse cx="270" cy="250" rx="30" ry="40" fill="#fff"/><ellipse cx="310" cy="205" rx="26" ry="38" fill="#fff"/><ellipse cx="270" cy="160" rx="24" ry="30" fill="#fff" opacity="0.7"/></g>');
  // 顧客
  s.add(person(s, { x: 600, y: 238, h: 320, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#4f86c2', bottom: '#333', pose: 'hold', legs: 'sit' }));
  s.add('<path d="M578 340Q560 380 556 408" stroke="#6b4a30" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M584 340Q570 380 566 408" stroke="#8a5a30" stroke-width="3" fill="none" stroke-linecap="round"/>');
  s.add('<path d="M550 400Q560 372 572 360Q580 376 578 400" stroke="#f1deaa" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M556 398Q566 374 576 364" stroke="#e4cd8a" stroke-width="3" fill="none" stroke-linecap="round"/>');
  // 桌子
  s.add(shadow(560, 560, 300, 14, 0.4));
  s.add('<path d="M345 400H800V440H325Z" fill="url(#tab)"/><rect x="325" y="440" width="475" height="30" fill="#a87a40"/><rect x="345" y="470" width="14" height="110" fill="#8a6234"/><rect x="760" y="470" width="14" height="110" fill="#8a6234"/>');
  s.add('<path d="M345 400H800" stroke="#eac990" stroke-width="3"/>');
  // 麵碗
  s.add('<ellipse cx="540" cy="448" rx="110" ry="22" fill="#000" opacity="0.18" filter="url(#b4)"/>');
  s.add('<path d="M430 400Q432 484 540 486Q648 484 650 400Z" fill="url(#bowl)"/><path d="M440 462Q540 502 640 462" stroke="#c43d2c" stroke-width="5" fill="none"/><ellipse cx="540" cy="400" rx="110" ry="24" fill="#f4ede0"/><ellipse cx="540" cy="402" rx="98" ry="19" fill="#c47a35"/>');
  s.add('<g stroke="#f2deaa" stroke-width="5" fill="none" stroke-linecap="round"><path d="M470 400Q500 386 530 400Q560 414 600 398"/><path d="M480 408Q520 394 556 408Q580 414 612 404"/><path d="M490 396Q520 384 548 394"/></g>');
  s.add('<path d="M500 394Q520 380 544 392Q536 410 508 408Z" fill="#7a3f22"/><path d="M506 396Q522 386 538 394" stroke="#a5603a" stroke-width="2" fill="none"/><circle cx="590" cy="392" r="9" fill="#3a9a4a"/><circle cx="575" cy="402" r="7" fill="#4aab5a"/><circle cx="604" cy="404" r="6" fill="#3a9a4a"/><ellipse cx="480" cy="404" rx="12" ry="9" fill="#d8b070"/><ellipse cx="480" cy="404" rx="6" ry="5" fill="#f2d86a"/>');
  s.add('<g filter="url(#b8)" opacity="0.7"><ellipse cx="540" cy="340" rx="50" ry="36" fill="#fff"/><ellipse cx="560" cy="290" rx="34" ry="28" fill="#fff" opacity="0.7"/></g>');
  // 筷子、桌上小物
  s.add('<path d="M670 470L750 440M676 480L756 450" stroke="#6b3a1e" stroke-width="4" stroke-linecap="round"/><path d="M420 462L330 448" stroke="#6b3a1e" stroke-width="0"/>');
  s.add('<rect x="700" y="372" width="30" height="34" rx="3" fill="#c43d2c"/><rect x="740" y="380" width="22" height="26" rx="3" fill="#e8c24a"/><path d="M702 372h26M742 380h18" stroke="#fff" stroke-width="2"/><rect x="760" y="386" width="30" height="16" rx="3" fill="#fff"/>');
  s.add('<path d="M700 398H730M740 398H762" stroke="#000" stroke-width="2" opacity="0.2"/>');
  // 前景紅板凳與小碟
  s.add(shadow(180, 580, 70, 9, 0.45));
  s.add('<path d="M120 500H240L246 520H114Z" fill="#d8392b"/><rect x="114" y="518" width="132" height="10" rx="4" fill="#a82619"/><rect x="126" y="528" width="10" height="52" fill="#a82619"/><rect x="224" y="528" width="10" height="52" fill="#a82619"/><path d="M130 500H232" stroke="#ff7a6a" stroke-width="3"/>');
  s.add('<ellipse cx="380" cy="545" rx="0" ry="0"/>');
  return s.out();
};

/* H5 搬家 */
out.moving = () => {
  const s = Scene(); const R = rng(85);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f2ece0'], [1, '#e3d8c4']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#c9a77e'], [1, '#a98458']]));
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#9ccfee'], [1, '#e8f1e0']]));
  s.def(lin('sofa', 0, 0, 0, 1, [[0, '#7a9bb0'], [1, '#56778c']]));
  s.def(rad('sun', 0.4, 0.4, 0.7, [[0, '#fff6cc', 0.6], [1, '#fff6cc', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="414" width="800" height="186" fill="url(#fl)"/><rect y="408" width="800" height="9" fill="#f7f2e8"/>');
  s.add('<g stroke="#7a5a3a" stroke-width="2" opacity="0.28"><path d="M0 450H800M0 500H800M0 560H800M100 417L40 600M300 417L280 600M500 417L520 600M700 417L760 600"/></g>');
  // 窗外：街道與卡車
  s.add('<rect x="40" y="60" width="330" height="270" fill="url(#sky)"/>');
  s.add('<path d="M40 250Q120 210 200 240Q280 200 370 244V330H40Z" fill="#7fb06a"/><g fill="#d8cdb8"><rect x="50" y="170" width="60" height="90"/><rect x="290" y="150" width="70" height="110"/></g><rect x="40" y="292" width="330" height="38" fill="#7a7e83"/><path d="M40 310H370" stroke="#f2d04a" stroke-width="3" stroke-dasharray="30 20"/>');
  s.add('<rect x="108" y="226" width="136" height="70" rx="4" fill="#f4f4f0"/><rect x="108" y="226" width="136" height="70" rx="4" fill="none" stroke="#c5c5c0" stroke-width="2"/><path d="M244 250H282Q292 250 296 266L300 296H244Z" fill="#d94a3a"/><path d="M252 256H280Q286 256 290 268L292 276H252Z" fill="#bfe3f5"/><circle cx="138" cy="298" r="11" fill="#222"/><circle cx="272" cy="298" r="11" fill="#222"/><circle cx="138" cy="298" r="4" fill="#aaa"/><circle cx="272" cy="298" r="4" fill="#aaa"/><path d="M118 244H234" stroke="#3f7fc4" stroke-width="10" stroke-linecap="round"/>');
  s.add('<rect x="40" y="60" width="330" height="270" fill="url(#sun)"/>');
  s.add('<path d="M205 60V330M40 195H370" stroke="#fff" stroke-width="8"/><rect x="40" y="60" width="330" height="270" fill="none" stroke="#fffdf5" stroke-width="12"/><rect x="34" y="330" width="342" height="12" fill="#fffdf5"/>');
  // 右側沙發（包膜）與檯燈
  s.add(shadow(640, 486, 170, 12, 0.4));
  s.add('<rect x="500" y="330" width="280" height="86" rx="18" fill="url(#sofa)"/><rect x="490" y="372" width="300" height="100" rx="18" fill="#6a8aa0"/><rect x="480" y="360" width="46" height="116" rx="16" fill="#5a7a90"/><rect x="764" y="360" width="46" height="116" rx="16" fill="#4e6e84"/><path d="M526 410H764" stroke="#4e6e84" stroke-width="3"/>');
  s.add('<path d="M486 358L800 372L806 470L480 470Z" fill="#fff" opacity="0.22"/><path d="M500 340L690 372M600 332L780 400" stroke="#fff" stroke-width="4" opacity="0.4"/>');
  s.add('<path d="M470 408V300" stroke="#444" stroke-width="5"/><path d="M440 300L500 300L486 262H454Z" fill="#f2e6b8"/><ellipse cx="470" cy="408" rx="20" ry="6" fill="#444"/>');
  s.add('<path d="M744 332Q752 290 770 276Q768 310 756 332ZM758 332Q776 300 796 296Q786 322 768 336Z" fill="#4f9448"/><path d="M742 332H784L778 360H748Z" fill="#c98a5a"/>');
  // 紙箱疊
  box(s, 392, 360, 100, 80, 24, '#cfa772'); box(s, 404, 300, 80, 60, 20, '#c29a62');
  box(s, 30, 440, 130, 96, 28, '#d3ac76'); box(s, 172, 470, 96, 70, 22, '#c29a62');
  s.add('<g><rect x="54" y="486" width="46" height="16" fill="#fff" opacity="0.0"/></g>');
  s.add(`<text x="95" y="520" font-size="24" font-weight="700" text-anchor="middle" fill="#8a3a2a" ${FONT} opacity="0.85">易碎</text>`);
  // 搬箱子的人
  const hx = 410, hy = 196, hh = 380, sc = hh / 7;
  s.add(person(s, { x: 560, y: 186, h: 390, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#e8a02f', bottom: '#38486a', pose: 'hold', legs: 'walk', shoe: '#3a3a40', sleeve: 'short' }));
  s.add(`<path d="M${560 - 0.55 * 390 / 7 - 40} ${186 + 1.1 * 390 / 7}h0" stroke="none"/>`);
  box(s, 504, 270, 120, 98, 22, '#d9b27c');
  // 另一人在封箱
  s.add(person(s, { x: 292, y: 213, h: 250, skin: 'light', hair: '#6a3a22', hairStyle: 'ponytail', top: '#c9524a', bottom: '#4a4a56', pose: 'hold', legs: 'stand' }));
  box(s, 228, 358, 130, 76, 24, '#c29a62');
  box(s, 240, 306, 104, 50, 20, '#cfa772', false);
  s.add('<rect x="284" y="306" width="14" height="50" fill="#e9dbb4" opacity="0.9"/><path d="M284 306L302 296H316L298 306Z" fill="#f0e4c0"/>');
  s.add('<g transform="translate(332 292)"><circle cx="0" cy="0" r="15" fill="#e8c24a" stroke="#b8932a" stroke-width="3"/><circle cx="0" cy="0" r="6" fill="#f4efdc"/></g>');
  return s.out();
};

/* H6 電梯 */
out.elevator = () => {
  const s = Scene(); const R = rng(86);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#e0d8c8'], [1, '#c9bfac']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#cfc6b6'], [1, '#a89e8c']]));
  s.def(lin('steel', 0, 0, 1, 0, [[0, '#8e969a'], [0.3, '#dfe4e6'], [0.6, '#b4bcc0'], [1, '#8a9296']]));
  s.def(lin('door', 0, 0, 1, 0, [[0, '#b6bec2'], [0.5, '#e6eaec'], [1, '#aab2b6']]));
  s.def(lin('mir', 0, 0, 1, 1, [[0, '#dcebf0'], [0.5, '#b9d0d8'], [1, '#d4e4ea']]));
  s.def(lin('cab', 0, 0, 0, 1, [[0, '#fbf3df'], [1, '#e6d9b8']]));
  s.def(lin('cfl', 0, 0, 0, 1, [[0, '#9a8f7c'], [1, '#c7bca6']]));
  s.def(rad('lt', 0.5, 0.0, 0.7, [[0, '#fff8e0', 0.9], [1, '#fff8e0', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="450" width="800" height="150" fill="url(#fl)"/><rect y="440" width="800" height="12" fill="#a79c88"/>');
  s.add('<g stroke="#8a7f6c" stroke-width="2" opacity="0.35"><path d="M0 500H800M0 560H800M150 452L60 600M330 452L300 600M510 452L520 600M690 452L780 600"/></g>');
  // 牆面紋路
  s.add('<g stroke="#b8ad99" stroke-width="2" opacity="0.5"><path d="M0 120H170M630 120H800M0 300H170M630 300H800"/></g>');
  // 電梯框
  s.add('<rect x="160" y="74" width="480" height="388" rx="6" fill="url(#steel)"/>');
  s.add('<rect x="196" y="108" width="408" height="346" fill="url(#cab)"/>');
  // 轎廂內部：鏡子、牆板
  s.add('<rect x="226" y="136" width="348" height="190" fill="url(#mir)" stroke="#8d9ea4" stroke-width="4"/><path d="M270 136L330 326M330 136L420 326M470 136L440 326" stroke="#fff" stroke-width="22" opacity="0.18"/>');
  s.add('<rect x="226" y="326" width="348" height="94" fill="#c3a77a"/><path d="M226 360H574M226 392H574" stroke="#a88a5c" stroke-width="2"/><path d="M226 326H574" stroke="#8a6f44" stroke-width="3"/>');
  s.add('<rect x="196" y="108" width="408" height="26" fill="#fffdf2"/><rect x="196" y="108" width="408" height="346" fill="url(#lt)"/>');
  s.add('<path d="M196 108L226 136V420L196 454Z" fill="#8b7a58" opacity="0.55"/><path d="M604 108L574 136V420L604 454Z" fill="#8b7a58" opacity="0.65"/>');
  // 轎廂地板
  s.add('<path d="M196 454L226 420H574L604 454Z" fill="url(#cfl)"/><path d="M226 420H574" stroke="#8a7f6c" stroke-width="2"/>');
  // 扶手
  s.add('<rect x="236" y="300" width="328" height="9" rx="4" fill="url(#steel)"/><rect x="238" y="306" width="6" height="12" fill="#8e969a"/><rect x="556" y="306" width="6" height="12" fill="#8e969a"/>');
  // 轎廂內按鈕面板（右側牆）
  s.add('<rect x="576" y="190" width="22" height="130" fill="#d9dee0" stroke="#9aa3a7" stroke-width="2"/>');
  for (let i = 0; i < 6; i++) s.add(`<circle cx="587" cy="${206 + i * 20}" r="5.5" fill="${i === 3 ? '#ffb347' : '#f4f4f0'}" stroke="#7a8388" stroke-width="1.5"/>`);
  // 樓層顯示
  s.add(`<rect x="352" y="22" width="96" height="46" rx="6" fill="#1d2023" stroke="#8e969a" stroke-width="4"/><text x="408" y="58" font-size="34" font-weight="700" text-anchor="middle" fill="#ff8a3c" font-family="monospace">5</text><path d="M376 36L366 52H386Z" fill="#ff8a3c"/>`);
  s.add('<circle cx="420" cy="46" r="26" fill="#ff8a3c" opacity="0.12" filter="url(#b8)"/>');
  // 乘客
  const feet = 432;
  const pp = (x, h, o) => { const sc = h / 7; return person(s, Object.assign({ x, y: feet - 6.08 * sc, h }, o)); };
  s.add(pp(300, 296, { skin: 'light', hair: '#4a3022', hairStyle: 'long', top: '#e6c458', bottom: '#4a5a7a', pose: 'down', legs: 'stand', shoe: '#f2f2f2' }));
  // 購物袋
  const sc1 = 296 / 7, hx = 300 + 0.9 * sc1, hy = feet - 6.08 * sc1 + 2.15 * sc1;
  s.add(`<path d="M${hx - 8} ${hy}Q${hx} ${hy - 22} ${hx + 8} ${hy}" stroke="#7a3a2a" stroke-width="2.5" fill="none"/><path d="M${hx - 22} ${hy + 4}H${hx + 24}L${hx + 20} ${hy + 52}H${hx - 18}Z" fill="#d8503f"/><path d="M${hx + 24} ${hy + 4}L${hx + 20} ${hy + 52}H${hx + 30}L${hx + 32} ${hy + 8}Z" fill="#a83a2c"/><path d="M${hx - 8} ${hy - 4}Q${hx - 6} ${hy - 18} ${hx + 2} ${hy - 4}" stroke="#4f9448" stroke-width="3" fill="none"/>`);
  s.add(pp(396, 190, { skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#7fb3d8', bottom: '#d8845a', pose: 'down', legs: 'stand', shoe: '#e8e8e8', sleeve: 'short' }));
  s.add(pp(500, 304, { skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#587a62', bottom: '#33394a', pose: 'hold', legs: 'stand', shoe: '#2a2a2a', glasses: true }));
  const sc3 = 304 / 7, y3 = feet - 6.08 * sc3;
  s.add(`<g transform="rotate(-6 ${500 - 0.3 * sc3} ${y3 + 1.5 * sc3})"><rect x="${500 - 0.3 * sc3 - 9}" y="${y3 + 1.1 * sc3}" width="20" height="32" rx="4" fill="#23272d"/><rect x="${500 - 0.3 * sc3 - 7}" y="${y3 + 1.1 * sc3 + 3}" width="16" height="26" rx="2" fill="#4fb3e8"/></g>`);
  // 門片（兩側已打開）
  s.add('<rect x="160" y="108" width="36" height="352" fill="url(#door)"/><rect x="604" y="108" width="36" height="352" fill="url(#door)"/><path d="M172 108V460M184 108V460M616 108V460M628 108V460" stroke="#8e969a" stroke-width="1.5" opacity="0.7"/>');
  s.add('<rect x="160" y="456" width="480" height="8" fill="#7e868a"/>');
  // 地面反光
  s.add('<rect x="196" y="464" width="408" height="80" fill="#fff8e0" opacity="0.18"/>');
  // 外面呼叫按鈕
  s.add('<rect x="652" y="236" width="36" height="92" rx="7" fill="url(#steel)" stroke="#7a8388" stroke-width="2"/>');
  s.add('<circle cx="670" cy="262" r="12" fill="#2b2f33"/><circle cx="670" cy="262" r="9" fill="#ffb347"/><path d="M670 255L664 266H676Z" fill="#fff"/><circle cx="670" cy="300" r="12" fill="#2b2f33"/><circle cx="670" cy="300" r="9" fill="#e8e8e0"/><path d="M670 307L664 296H676Z" fill="#555"/>');
  s.add('<circle cx="670" cy="262" r="22" fill="#ffb347" opacity="0.25" filter="url(#b4)"/>');
  // 等電梯的人
  s.add(person(s, { x: 744, y: 196, h: 366, skin: 'mid', hair: '#2a1b14', hairStyle: 'bun', top: '#8f6fb0', bottom: '#2f3446', pose: 'down', legs: 'stand', shoe: '#f2f2f2' }));
  s.add(`<rect x="60" y="118" width="72" height="34" rx="4" fill="#fff8ef" stroke="#a79c88" stroke-width="3"/><text x="96" y="143" font-size="22" font-weight="700" text-anchor="middle" fill="#4a4a4a" ${FONT}>電梯</text>`);
  // 前景盆栽
  s.add(shadow(100, 584, 70, 9, 0.45));
  s.add('<path d="M52 520H148L140 584H60Z" fill="#8a5a3a"/><ellipse cx="100" cy="520" rx="48" ry="9" fill="#6f4426"/>');
  [[-40, -140, -20], [-12, -190, -6], [20, -170, 14], [46, -120, 28], [-52, -80, -38], [0, -120, 0]].forEach(([dx, dy, rot]) => s.add(`<path d="M100 520Q${100 + dx * 0.6} ${520 + dy * 0.6} ${100 + dx} ${520 + dy}Q${100 + dx + 22} ${520 + dy * 0.6} 100 520Z" fill="${rot > 0 ? '#3f8a3c' : '#4f9f48'}" transform="rotate(${rot} 100 520)"/>`));
  return s.out();
};

/* H7 做菜 */
out.cooking = () => {
  const s = Scene(); const R = rng(87);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f6f1e4'], [1, '#e8dfc9']]));
  s.def(lin('cab', 0, 0, 0, 1, [[0, '#c59a68'], [1, '#9c7248']]));
  s.def(lin('top', 0, 0, 0, 1, [[0, '#e9e4d8'], [1, '#c9c2b2']]));
  s.def(lin('hood', 0, 0, 0, 1, [[0, '#d9dee0'], [1, '#98a1a5']]));
  s.def(lin('wok', 0, 0, 0, 1, [[0, '#4a4f55'], [1, '#22262a']]));
  s.def(rad('warm', 0.5, 0.6, 0.7, [[0, '#ffd89a', 0.5], [1, '#ffd89a', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  // 磁磚
  let g = '';
  for (let r = 0; r < 12; r++) { const y = r * 30; g += `<path d="M0 ${y}H800"/>`; for (let x = (r % 2) * 30; x < 800; x += 60) g += `<path d="M${x} ${y}V${y + 30}"/>`; }
  s.add(`<g stroke="#d3c9b0" stroke-width="1.5" opacity="0.8">${g}</g>`);
  // 抽油煙機
  s.add('<rect x="410" y="0" width="60" height="50" fill="#b9c1c5"/><path d="M320 54H560L600 130H280Z" fill="url(#hood)"/><rect x="280" y="130" width="320" height="12" fill="#7a8388"/><circle cx="560" cy="92" r="5" fill="#444"/><circle cx="530" cy="92" r="5" fill="#444"/>');
  // 左側層架：調味罐
  s.add('<rect x="30" y="200" width="230" height="10" fill="#8a6a46"/><rect x="30" y="110" width="230" height="10" fill="#8a6a46"/>');
  [[48, '#d9b46a'], [84, '#c24a3a'], [120, '#f2f2ee'], [156, '#6a4020'], [192, '#e3c14a'], [228, '#4f8f4a']].forEach(([x, c], i) => {
    s.add(`<rect x="${x - 12}" y="${200 - 48}" width="26" height="48" rx="5" fill="${c}"/><rect x="${x - 8}" y="${200 - 58}" width="18" height="10" rx="2" fill="#555"/><rect x="${x - 12}" y="${200 - 30}" width="26" height="14" fill="#fff" opacity="0.6"/>`);
    if (i < 4) s.add(`<path d="M${x - 14} 110l0 -34q14 -8 28 0l0 34z" fill="${['#e6efe6', '#f4e6c8', '#dfe8f0', '#f0dfe0'][i]}" stroke="#bbb" stroke-width="1.5"/>`);
  });
  // 右側掛架與廚具
  s.add('<rect x="600" y="150" width="170" height="8" rx="4" fill="#7a8388"/>');
  s.add('<g stroke="#7a8388" stroke-width="3" fill="none"><path d="M620 158V230"/><path d="M660 158V250"/><path d="M700 158V236"/><path d="M740 158V228"/></g><ellipse cx="620" cy="244" rx="18" ry="14" fill="#8a9296"/><path d="M646 250H676V300H646Z" fill="#d9a050"/><path d="M700 236V290" stroke="#8a6a46" stroke-width="6"/><path d="M730 228Q750 244 744 276Q738 244 730 228Z" fill="#8a9296"/>');
  // 小孩（左）
  s.add(person(s, { x: 150, y: 262, h: 220, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#f2a65a', bottom: '#4a5a8a', pose: 'hold', legs: 'sit', sleeve: 'short' }));
  // 大人（中）
  s.add(person(s, { x: 410, y: 226, h: 330, skin: 'mid', hair: '#2a1b14', hairStyle: 'short', top: '#d9d2c0', bottom: '#333', pose: 'table', legs: 'sit', sleeve: 'short' }));
  s.add('<path d="M370 252Q410 272 450 252L458 352H362Z" fill="#c9503f"/><path d="M370 252Q410 276 450 252" stroke="#9a3a2c" stroke-width="3" fill="none"/><path d="M386 300H434V338H386Z" fill="#a83a2c"/>');
  // 檯面
  s.add(shadow(400, 540, 400, 12, 0.35));
  s.add('<rect x="0" y="352" width="800" height="14" fill="url(#top)"/><rect x="0" y="366" width="800" height="8" fill="#a8a090"/>');
  s.add('<rect x="0" y="374" width="800" height="226" fill="url(#cab)"/>');
  s.add('<g stroke="#6f5030" stroke-width="3" opacity="0.7"><path d="M200 374V600M400 374V600M600 374V600M0 480H800" opacity="0"/><path d="M200 374V600M400 374V600M600 374V600"/></g>');
  [[100, 430], [300, 430], [500, 430], [700, 430]].forEach(([x, y]) => s.add(`<rect x="${x - 70}" y="${y - 40}" width="140" height="120" fill="#000" opacity="0.04"/><rect x="${x - 6}" y="${y - 30}" width="12" height="26" rx="3" fill="#e0c9a0"/>`));
  // 瓦斯爐面
  s.add('<path d="M330 352L660 352L690 330H300Z" fill="#2b2f33"/><ellipse cx="520" cy="338" rx="46" ry="8" fill="#555"/><ellipse cx="400" cy="338" rx="30" ry="6" fill="#444"/><ellipse cx="400" cy="338" rx="14" ry="3" fill="#222"/>');
  s.add('<g fill="#d9dee0" stroke="#8a9296"><circle cx="360" cy="400" r="12"/><circle cx="400" cy="400" r="12"/><circle cx="440" cy="400" r="12"/></g><g stroke="#555" stroke-width="3"><path d="M360 392V400M400 392V400M440 392V400"/></g>');
  // 炒鍋
  s.add('<path d="M510 328Q528 322 548 326L560 336Q544 340 520 338Z" fill="#6a4020"/>');
  s.add('<path d="M440 328Q440 362 520 364Q600 362 600 328Z" fill="url(#wok)"/><ellipse cx="520" cy="328" rx="80" ry="14" fill="#1a1d20"/><ellipse cx="520" cy="329" rx="72" ry="10" fill="#6a3a1c"/>');
  s.add('<path d="M600 330L690 316" stroke="#5a3a20" stroke-width="9" stroke-linecap="round"/>');
  // 鍋內食材
  [['#d94a3a', 480, 328], ['#4faa4a', 506, 324], ['#f0b030', 534, 330], ['#4faa4a', 556, 326], ['#d94a3a', 520, 332], ['#8fcf5a', 494, 332], ['#f0b030', 570, 331], ['#4faa4a', 462, 330]].forEach(([c, x, y]) => s.add(`<ellipse cx="${x}" cy="${y}" rx="11" ry="5" fill="${c}" transform="rotate(${(x * 7) % 40 - 20} ${x} ${y})"/>`));
  s.add('<g filter="url(#b4)" opacity="0.6"><ellipse cx="500" cy="352" rx="40" ry="8" fill="#ffb347"/></g>');
  // 鍋鏟
  s.add('<path d="M455 332L502 322" stroke="#8a5a30" stroke-width="7" stroke-linecap="round"/><path d="M498 316Q520 308 528 322Q518 336 496 332Z" fill="#a8aeb2"/>');
  // 蒸氣
  s.add('<g filter="url(#b8)" opacity="0.65"><ellipse cx="510" cy="270" rx="38" ry="30" fill="#fff"/><ellipse cx="540" cy="215" rx="34" ry="30" fill="#fff" opacity="0.8"/><ellipse cx="520" cy="165" rx="30" ry="26" fill="#fff" opacity="0.5"/></g>');
  s.add('<rect width="800" height="600" fill="url(#warm)" opacity="0.5"/>');
  // 左側檯面：砧板、青菜、菜刀
  s.add('<rect x="30" y="350" width="240" height="14" rx="4" fill="#d9b88a"/><rect x="38" y="364" width="224" height="5" fill="#9a7a4a"/>');
  s.add('<ellipse cx="90" cy="340" rx="24" ry="14" fill="#d94a3a"/><path d="M84 328Q90 320 98 328" stroke="#3f8a3c" stroke-width="4" fill="none"/><ellipse cx="150" cy="342" rx="26" ry="12" fill="#e87a2a"/><path d="M180 350Q200 330 230 334Q214 346 186 354Z" fill="#4faa4a"/><path d="M196 346Q212 326 240 328" stroke="#6fc05a" stroke-width="4" fill="none"/>');
  s.add('<path d="M160 352L230 344L232 352Z" fill="#c5ccd0"/><rect x="232" y="344" width="32" height="8" rx="3" fill="#2b2b2b" transform="rotate(-3 232 344)"/>');
  s.add('<rect x="700" y="308" width="24" height="44" rx="7" fill="#e3b02a"/><rect x="706" y="296" width="12" height="14" rx="3" fill="#c24a3a"/><rect x="732" y="316" width="28" height="36" rx="6" fill="#3a2418"/><rect x="738" y="304" width="16" height="14" rx="3" fill="#555"/><rect x="736" y="328" width="20" height="12" fill="#fff" opacity="0.6"/>');
  // 前景：盤子與碗
  s.add(shadow(180, 590, 100, 8, 0.35));
  s.add('<ellipse cx="190" cy="548" rx="86" ry="22" fill="#fff"/><ellipse cx="190" cy="546" rx="68" ry="16" fill="#f4efe4"/><ellipse cx="190" cy="542" rx="48" ry="10" fill="#c46a2a"/><ellipse cx="170" cy="538" rx="14" ry="6" fill="#4faa4a"/><ellipse cx="206" cy="540" rx="12" ry="6" fill="#d94a3a"/>');
  s.add('<path d="M420 520Q422 568 470 570Q518 568 520 520Z" fill="#f2efe6"/><ellipse cx="470" cy="520" rx="50" ry="12" fill="#fffdf6"/><ellipse cx="470" cy="522" rx="42" ry="8" fill="#e8dcc0"/><path d="M430 548H510" stroke="#3a6aa0" stroke-width="3"/>');
  s.add('<path d="M560 540L640 520M566 552L646 532" stroke="#6b3a1e" stroke-width="4" stroke-linecap="round"/>');
  return s.out();
};

/* H8 打掃 */
out.cleaning = () => {
  const s = Scene(); const R = rng(88);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f7f1e3'], [1, '#e9dec8']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#cfa979'], [1, '#a8814f']]));
  s.def(lin('sofa', 0, 0, 0, 1, [[0, '#8aa88f'], [1, '#6a8a72']]));
  s.def(lin('win', 0, 0, 0, 1, [[0, '#bfe3f7'], [1, '#f2f7e8']]));
  s.def(rad('sun', 0.5, 0.2, 0.9, [[0, '#fffbe0', 0.9], [1, '#fffbe0', 0]]));
  s.def(lin('buck', 0, 0, 1, 0, [[0, '#6fa7e0'], [0.5, '#4a86c8'], [1, '#2f629a']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="392" width="800" height="208" fill="url(#fl)"/><rect y="384" width="800" height="9" fill="#fffaf0"/>');
  // 地板木紋透視
  s.add('<g stroke="#7a5a35" stroke-width="2" opacity="0.28"><path d="M0 440H800M0 500H800M0 570H800"/><path d="M100 393L20 600M240 393L190 600M380 393L360 600M520 393L530 600M660 393L700 600M790 393L860 600"/></g>');
  // 窗戶
  s.add('<rect x="520" y="56" width="250" height="270" fill="url(#win)"/><g filter="url(#b8)"><ellipse cx="600" cy="270" rx="70" ry="32" fill="#7fb06a"/><ellipse cx="720" cy="130" rx="40" ry="22" fill="#fff" opacity="0.8"/></g><path d="M645 56V326M520 191H770" stroke="#fff" stroke-width="8"/><rect x="520" y="56" width="250" height="270" fill="none" stroke="#fffdf5" stroke-width="12"/><path d="M510 326H780" stroke="#fffdf5" stroke-width="12"/>');
  s.add('<path d="M520 56L770 326" stroke="#fff" stroke-width="30" opacity="0.14"/><path d="M520 250L640 326" stroke="#fff" stroke-width="22" opacity="0.14"/>');
  s.add('<path d="M540 336L460 520H680L770 336Z" fill="url(#sun)" opacity="0.35"/>');
  // 沙發（左後）
  s.add(shadow(160, 400, 130, 9, 0.3));
  s.add('<rect x="40" y="258" width="250" height="100" rx="18" fill="#7a9a82"/><rect x="30" y="318" width="270" height="76" rx="14" fill="url(#sofa)"/><rect x="22" y="300" width="36" height="92" rx="14" fill="#6a8a72"/><rect x="272" y="300" width="36" height="92" rx="14" fill="#5a7a62"/><path d="M165 322V392" stroke="#5a7a62" stroke-width="2"/>');
  s.add('<rect x="206" y="290" width="48" height="44" rx="8" fill="#f2c24a" transform="rotate(8 230 312)"/>');
  // 畫
  s.add('<rect x="160" y="70" width="150" height="104" fill="#fff" stroke="#8a6a46" stroke-width="6"/><path d="M168 160L210 110L246 146L270 124L302 160Z" fill="#7fb08a"/><circle cx="270" cy="102" r="12" fill="#f6c852"/>');
  // 垃圾桶
  s.add(shadow(470, 398, 36, 6, 0.4));
  s.add('<path d="M440 328H500L494 396H446Z" fill="#8f9aa0"/><rect x="436" y="320" width="68" height="12" rx="4" fill="#aab4ba"/><path d="M456 336V390M470 336V390M484 336V390" stroke="#76818a" stroke-width="2"/>');
  // 掃把靠牆
  s.add('<path d="M382 190L392 348" stroke="#a87a44" stroke-width="7" stroke-linecap="round"/><path d="M380 348H408L416 398H372Z" fill="#d9b04a"/><path d="M384 352L380 396M394 352L394 398M404 352L408 396" stroke="#b08a2c" stroke-width="2"/><rect x="376" y="342" width="36" height="9" fill="#555"/>');
  // 媽媽拖地
  s.add(person(s, { x: 262, y: 206, h: 370, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#e0705c', bottom: '#3a4a6a', pose: 'hold', legs: 'walk', shoe: '#f2f2f2', sleeve: 'short' }));
  const scA = 370 / 7;
  // 溼地板反光
  s.add('<ellipse cx="400" cy="526" rx="170" ry="26" fill="#fff" opacity="0.22"/><ellipse cx="420" cy="528" rx="120" ry="16" fill="#fff" opacity="0.18"/>');
  s.add(`<path d="M${262 + 0.3 * scA} ${206 + 1.55 * scA}L400 520" stroke="#a87a44" stroke-width="7" stroke-linecap="round"/>`);
  s.add('<path d="M368 520H452L458 540H362Z" fill="#cfd6da"/><path d="M366 534Q380 560 394 536Q408 562 422 536Q436 560 452 536L458 540H362Z" fill="#f2f2ee" stroke="#c4cbcf" stroke-width="1.5"/><rect x="364" y="514" width="92" height="9" rx="4" fill="#4a86c8"/>');
  // 兒子吸地
  s.add(person(s, { x: 640, y: 214, h: 330, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#6fa57a', bottom: '#33394a', pose: 'hold', legs: 'walk', shoe: '#2a2a2a', sleeve: 'short' }));
  const scB = 330 / 7;
  s.add(`<path d="M${640 + 0.3 * scB} ${214 + 1.55 * scB}L706 492" stroke="#8a9296" stroke-width="8" stroke-linecap="round"/>`);
  s.add('<path d="M690 408L742 400L750 470L702 484Z" fill="#d94a3a"/><path d="M742 400L760 408L766 466L750 470Z" fill="#a83a2c"/><circle cx="724" cy="440" r="8" fill="#f2f2ee"/>');
  s.add('<path d="M672 494H752L762 516H664Z" fill="#33394a"/><rect x="668" y="508" width="92" height="9" rx="3" fill="#8a9296"/>');
  s.add('<path d="M766 440Q790 470 760 504" stroke="#444" stroke-width="5" fill="none"/>');
  s.add('<g fill="#fff" opacity="0.7"><circle cx="560" cy="500" r="3"/><circle cx="600" cy="520" r="2"/><circle cx="520" cy="470" r="2.5"/></g>');
  // 前景水桶與抹布
  bucket(s, 108, 482);
  // 小心地滑牌
  s.add(shadow(540, 568, 40, 6, 0.4));
  s.add('<path d="M510 560L526 484H554L570 560Z" fill="#f2c82a" stroke="#c9a010" stroke-width="3"/>');
  s.add(`<text x="540" y="516" font-size="14" font-weight="700" text-anchor="middle" fill="#333" ${FONT}>小心</text><text x="540" y="534" font-size="14" font-weight="700" text-anchor="middle" fill="#333" ${FONT}>地滑</text><path d="M532 544L540 550L548 544" stroke="#333" stroke-width="2" fill="none"/>`);
  return s.out();
};
function bucket(s, cx, y) {
  s.add(shadow(cx, y + 92, 66, 9, 0.45));
  s.add(`<path d="M${cx - 62} ${y}L${cx - 50} ${y + 90}H${cx + 50}L${cx + 62} ${y}Z" fill="url(#buck)"/><ellipse cx="${cx}" cy="${y}" rx="62" ry="12" fill="#2f629a"/><ellipse cx="${cx}" cy="${y + 2}" rx="54" ry="9" fill="#9fd3f0"/><path d="M${cx - 40} ${y + 2}Q${cx - 20} ${y - 2} ${cx} ${y + 2}" stroke="#fff" stroke-width="2" fill="none" opacity="0.7"/>`);
  s.add(`<path d="M${cx - 62} ${y}Q${cx} ${y - 60} ${cx + 62} ${y}" stroke="#8a9296" stroke-width="4" fill="none"/>`);
  s.add(`<path d="M${cx + 20} ${y - 2}Q${cx + 50} ${y + 6} ${cx + 66} ${y + 8}L${cx + 66} ${y + 52}Q${cx + 50} ${y + 60} ${cx + 38} ${y + 40}Z" fill="#f2c24a"/><path d="M${cx + 46} ${y + 10}V${y + 48}" stroke="#d9a02a" stroke-width="2"/>`);
  s.add(`<rect x="${cx - 40}" y="${y + 36}" width="64" height="26" rx="6" fill="#fff" opacity="0.22"/><circle cx="${cx - 50}" cy="${y - 14}" r="3" fill="#fff" opacity="0.8"/>`);
}

/* H9 唱歌（KTV包廂） */
out.singing = () => {
  const s = Scene(); const R = rng(89);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#2a1646'], [1, '#43226a']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#36204f'], [1, '#1b0f2e']]));
  s.def(lin('tv', 0, 0, 1, 1, [[0, '#1a4a9a'], [0.5, '#6a2fa8'], [1, '#d9487a']]));
  s.def(lin('sofa', 0, 0, 0, 1, [[0, '#8a3a6a'], [1, '#5a2248']]));
  s.def(lin('tab', 0, 0, 0, 1, [[0, '#9a6a45'], [1, '#6f4a2e']]));
  s.def(rad('blue', 0.5, 0.3, 0.6, [[0, '#6aa6ff', 0.55], [1, '#6aa6ff', 0]]));
  s.def(rad('pink', 0.5, 0.5, 0.5, [[0, '#ff4fa8', 0.5], [1, '#ff4fa8', 0]]));
  s.def(rad('cyan', 0.5, 0.5, 0.5, [[0, '#30e0ff', 0.45], [1, '#30e0ff', 0]]));
  s.def(rad('ball', 0.35, 0.3, 0.8, [[0, '#ffffff'], [0.5, '#b8c4e0'], [1, '#5a6590']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="420" width="800" height="180" fill="url(#fl)"/>');
  s.add('<path d="M0 60H800M0 400H800" stroke="#ff4fa8" stroke-width="3" opacity="0.6"/><path d="M0 66H800" stroke="#30e0ff" stroke-width="2" opacity="0.5"/>');
  // 隔音牆面軟包
  for (let i = 0; i < 16; i++) s.add(`<path d="M${i * 50} 80V400" stroke="#000" stroke-width="3" opacity="0.18"/>`);
  // 喇叭
  s.add('<rect x="16" y="120" width="70" height="140" rx="6" fill="#18121f" stroke="#3a2f4a" stroke-width="3"/><circle cx="51" cy="160" r="14" fill="#2c2438"/><circle cx="51" cy="218" r="24" fill="#2c2438"/><circle cx="51" cy="218" r="10" fill="#0e0a14"/>');
  // 螢幕
  s.add('<rect x="170" y="86" width="410" height="250" rx="6" fill="#0d0a14" stroke="#3a2f4a" stroke-width="6"/><rect x="180" y="96" width="390" height="230" fill="url(#tv)"/>');
  s.add('<path d="M180 280Q280 230 380 270Q470 300 570 250V326H180Z" fill="#000" opacity="0.22"/><circle cx="500" cy="150" r="30" fill="#ffd56a" opacity="0.8"/>');
  s.add(`<text x="375" y="226" font-size="38" font-weight="700" text-anchor="middle" fill="#fff" stroke="#2a1a5a" stroke-width="6" paint-order="stroke" ${FONT} letter-spacing="4">我們一起唱歌</text>`);
  s.add(`<text x="375" y="280" font-size="34" font-weight="700" text-anchor="middle" fill="#ffe14a" stroke="#2a1a5a" stroke-width="6" paint-order="stroke" ${FONT} letter-spacing="4">快樂每一天</text>`);
  s.add(`<rect x="192" y="106" width="64" height="26" rx="4" fill="#000" opacity="0.4"/><text x="224" y="126" font-size="18" font-weight="700" text-anchor="middle" fill="#7fe3a8" font-family="monospace">♪ 98</text>`);
  s.add('<rect x="180" y="96" width="390" height="230" fill="url(#blue)"/>');
  // 燈球與光束
  s.add('<path d="M690 0V70" stroke="#999" stroke-width="3"/>');
  s.add('<g opacity="0.18" fill="#ff4fa8"><path d="M690 120L600 300L660 320Z"/></g><g opacity="0.16" fill="#30e0ff"><path d="M690 120L760 320L800 280Z"/></g><g opacity="0.14" fill="#ffd56a"><path d="M690 120L520 200L540 250Z"/></g>');
  s.add('<circle cx="690" cy="120" r="50" fill="url(#ball)"/>');
  s.add('<g stroke="#4a5580" stroke-width="1.5" opacity="0.7" fill="none"><ellipse cx="690" cy="120" rx="50" ry="14"/><ellipse cx="690" cy="120" rx="50" ry="32"/><path d="M690 70V170M660 74Q640 120 660 166M720 74Q740 120 720 166"/></g>');
  s.add('<circle cx="676" cy="102" r="10" fill="#fff" opacity="0.6"/>');
  [[610, 100], [770, 150], [740, 60], [630, 170]].forEach(([x, y], i) => s.add(`<path d="M${x} ${y}l4 -8l4 8l-4 8z" fill="#fff" opacity="${0.5 + (i % 2) * 0.3}"/>`));
  // 沙發與朋友
  s.add('<rect x="470" y="318" width="330" height="92" rx="18" fill="#6a2a56"/>');
  s.add(person(s, { x: 590, y: 300, h: 250, skin: 'light', hair: '#3a2a22', hairStyle: 'long', top: '#f2a65a', bottom: '#3a4a7a', pose: 'hold', legs: 'sit', shoe: '#e8e8e8' }));
  s.add(person(s, { x: 700, y: 304, h: 250, skin: 'mid', hair: '#1a120e', hairStyle: 'short', top: '#58b8a8', bottom: '#33394a', pose: 'hold', legs: 'sit', shoe: '#2a2a2a', sleeve: 'short' }));
  s.add('<rect x="460" y="392" width="340" height="44" rx="14" fill="url(#sofa)"/><rect x="450" y="340" width="40" height="96" rx="14" fill="#7a2f5c"/><path d="M560 394V436M670 394V436" stroke="#4a1a38" stroke-width="2"/>');
  s.add('<path d="M615 276q10 -10 14 4M570 270l8 -6 6 8" stroke="#fff" stroke-width="2" fill="none" opacity="0.0"/>');
  // 主唱
  s.add(person(s, { x: 130, y: 236, h: 400, skin: 'tan', hair: '#1a120e', hairStyle: 'ponytail', top: '#e8506a', bottom: '#2c3140', pose: 'phone', legs: 'stand', shoe: '#f2f2f2', sleeve: 'long' }));
  const sc = 400 / 7;
  s.add(`<path d="M${130 + 0.34 * sc} ${236 - 0.3 * sc}L${130 + 1.0 * sc} ${236 - 1.05 * sc}" stroke="#222" stroke-width="6" stroke-linecap="round"/><circle cx="${130 + 0.34 * sc}" cy="${236 - 0.3 * sc}" r="9" fill="#555"/><circle cx="${130 + 0.34 * sc}" cy="${236 - 0.3 * sc}" r="9" fill="none" stroke="#aaa" stroke-width="2"/><path d="M${130 + 0.28 * sc} ${236 - 0.36 * sc}l${0.12 * sc} ${0.1 * sc}" stroke="#bbb" stroke-width="1.5"/>`);
  s.add('<g fill="#ffe14a" font-size="34" font-weight="700" font-family="sans-serif"><text x="200" y="80" opacity="0.9">♪</text><text x="610" y="70" opacity="0.7" fill="#7fe3ff">♫</text><text x="100" y="100" opacity="0.6" fill="#ff8fc0">♬</text></g>');
  // 燈光色塊
  s.add('<ellipse cx="200" cy="520" rx="170" ry="40" fill="url(#pink)"/><ellipse cx="620" cy="500" rx="170" ry="34" fill="url(#cyan)"/>');
  // 茶几
  s.add(shadow(420, 586, 250, 10, 0.5));
  s.add('<path d="M170 478H700L730 520H140Z" fill="url(#tab)"/><rect x="140" y="520" width="590" height="28" fill="#5a3a22"/><rect x="160" y="548" width="14" height="40" fill="#4a2e1a"/><rect x="696" y="548" width="14" height="40" fill="#4a2e1a"/><path d="M170 478H700" stroke="#c99a6a" stroke-width="3"/>');
  // 桌上：點歌本、鈴鼓、飲料、零食
  s.add('<path d="M200 500L270 486L288 508L214 524Z" fill="#e8d9a8"/><path d="M200 500L214 524L218 530L202 506Z" fill="#c9b878"/><path d="M222 502L268 492M226 510L274 500" stroke="#7a6a3a" stroke-width="2"/><rect x="228" y="496" width="24" height="8" fill="#d8503f" transform="rotate(-12 240 500)"/>');
  s.add('<ellipse cx="380" cy="500" rx="50" ry="14" fill="#c98a4a"/><ellipse cx="380" cy="498" rx="40" ry="9" fill="#f2e6c8"/><g fill="#d9dee0" stroke="#8a9296"><circle cx="338" cy="496" r="6"/><circle cx="360" cy="508" r="6"/><circle cx="400" cy="508" r="6"/><circle cx="422" cy="496" r="6"/></g>');
  [[480, '#e8506a'], [526, '#4fb3e8'], [572, '#ffb347']].forEach(([x, c]) => s.add(`<path d="M${x - 14} 460L${x - 11} 502H${x + 11}L${x + 14} 460Z" fill="#fff" opacity="0.8"/><path d="M${x - 13} 474L${x - 11} 502H${x + 11}L${x + 13} 474Z" fill="${c}"/><path d="M${x} 460L${x + 8} 440" stroke="#f2f2f2" stroke-width="3"/>`));
  s.add('<ellipse cx="650" cy="502" rx="40" ry="11" fill="#f2f2ee"/><ellipse cx="650" cy="499" rx="32" ry="8" fill="#e8a02f"/><circle cx="636" cy="496" r="6" fill="#d9a050"/><circle cx="652" cy="500" r="6" fill="#c98a3a"/><circle cx="666" cy="496" r="6" fill="#d9a050"/>');
  s.add('<rect x="580" y="486" width="40" height="22" rx="3" fill="#2b2f33" transform="rotate(-6 600 496)"/><circle cx="592" cy="494" r="3" fill="#ff4f4f"/>');
  return s.out();
};

/* H10 跳舞 */
out.dancing = () => {
  const s = Scene(); const R = rng(90);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#eef2f4'], [1, '#d6dde1']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#d9b384'], [1, '#b08555']]));
  s.def(lin('mir', 0, 0, 0, 1, [[0, '#e4eef2'], [1, '#c3d4dc']]));
  s.def(rad('spot', 0.5, 0.0, 0.8, [[0, '#fff8e0', 0.6], [1, '#fff8e0', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="388" width="800" height="212" fill="url(#fl)"/>');
  s.add('<g stroke="#7a5a35" stroke-width="2" opacity="0.3"><path d="M0 430H800M0 490H800M0 560H800M120 388L40 600M260 388L220 600M400 388V600M540 388L580 600M680 388L760 600"/></g>');
  s.add('<g opacity="0.35" fill="#fff"><path d="M0 600L260 388H400L180 600Z"/><path d="M420 600L640 388H700L560 600Z"/></g>');
  // 鏡牆
  s.add('<rect x="30" y="50" width="740" height="340" fill="url(#mir)" stroke="#9aa6ac" stroke-width="8"/>');
  s.add('<path d="M210 50V390M390 50V390M570 50V390" stroke="#9aa6ac" stroke-width="4"/>');
  s.add('<path d="M110 50L30 160M300 50L100 390M440 50L360 200M690 50L470 390M770 150L650 390" stroke="#fff" stroke-width="26" opacity="0.28"/>');
  s.add('<g opacity="0.5"><rect x="60" y="60" width="24" height="10" fill="#fff"/><rect x="330" y="60" width="24" height="10" fill="#fff"/><rect x="620" y="60" width="24" height="10" fill="#fff"/></g>');
  // 鏡中倒影（簡化）
  const cfg = [
    { x: 190, y: 246, h: 290, skin: 'light', hair: '#2a1b14', hairStyle: 'bun', top: '#f2a0c0', bottom: '#f2a0c0', dress: true, pose: 'wave', legs: 'stand', shoe: '#f2f2f2', sleeve: 'short' },
    { x: 520, y: 150, h: 400, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#e8506a', bottom: '#22262e', pose: 'wave', legs: 'walk', shoe: '#2a2a2e', sleeve: 'short' },
    { x: 660, y: 190, h: 350, skin: 'mid', hair: '#3a2a22', hairStyle: 'ponytail', top: '#4f86c2', bottom: '#2c3140', pose: 'runA', legs: 'walk', shoe: '#f2f2f2', sleeve: 'short' },
  ];
  const ps = cfg.map((c) => person(s, c));
  cfg.forEach((c, i) => { const feet = c.y + 6.08 * c.h / 7; s.add(`<g opacity="0.22" transform="translate(${c.x + 90} 372) scale(0.55) translate(${-c.x} ${-feet})">${ps[i]}</g>`); });
  s.add('<rect x="30" y="50" width="740" height="340" fill="url(#spot)" opacity="0.5"/>');
  // 扶桿
  s.add('<rect x="30" y="300" width="740" height="10" rx="5" fill="#a87a44"/><rect x="30" y="300" width="740" height="3" fill="#d9b080"/><g fill="#7a8388"><rect x="90" y="310" width="8" height="26"/><rect x="390" y="310" width="8" height="26"/><rect x="690" y="310" width="8" height="26"/></g>');
  s.add('<rect x="30" y="388" width="740" height="8" fill="#6b4a30" opacity="0.5"/>');
  // 老師與學生（真人）
  s.add(ps[0]); s.add(ps[2]); s.add(ps[1]);
  // 左下：水壺與包
  s.add(shadow(730, 580, 60, 8, 0.4));
  s.add('<rect x="690" y="510" width="70" height="62" rx="12" fill="#d8503f"/><path d="M704 510Q725 480 746 510" stroke="#8a2a20" stroke-width="5" fill="none"/><rect x="702" y="536" width="46" height="18" rx="4" fill="#b83a2c"/>');
  s.add('<rect x="650" y="530" width="24" height="44" rx="8" fill="#4fb3e8"/><rect x="654" y="520" width="16" height="12" rx="3" fill="#2f629a"/><rect x="650" y="546" width="24" height="12" fill="#fff" opacity="0.5"/>');
  // 右下：音響
  s.add(shadow(60, 580, 60, 8, 0.45));
  s.add('<rect x="10" y="430" width="100" height="150" rx="8" fill="#1e2024" stroke="#3a3f46" stroke-width="3"/><circle cx="60" cy="470" r="16" fill="#33383f"/><circle cx="60" cy="470" r="7" fill="#15171a"/><circle cx="60" cy="536" r="30" fill="#33383f"/><circle cx="60" cy="536" r="13" fill="#15171a"/><circle cx="92" cy="444" r="3" fill="#7fe3a8"/>');
  // 音符
  s.add('<g fill="#e8506a" font-size="40" font-weight="700" font-family="sans-serif"><text x="340" y="160" opacity="0.85">♪</text><text x="385" y="115" opacity="0.7" fill="#4f86c2">♫</text><text x="300" y="215" opacity="0.7" fill="#f2a65a">♬</text></g>');
  return s.out();
};

module.exports = out;
