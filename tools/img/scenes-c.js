const { rng, lin, rad, Scene, shadow, person, shade } = require('./lib');
const out = {};
const FF = 'Noto Sans TC, PingFang TC, Microsoft JhengHei, sans-serif';
const txt = (x, y, size, str, fill = '#fff', anchor = 'middle', weight = 700, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${fill}" font-family="${FF}" ${extra}>${str}</text>`;
const lantern = (x, y, r = 22) => `<g><path d="M${x} ${y - r * 1.5}V${y - r}" stroke="#7a1c14" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.15}" fill="url(#lan)"/><path d="M${x - r * 0.5} ${y - r}Q${x - r * 0.1} ${y} ${x - r * 0.5} ${y + r}M${x + r * 0.5} ${y - r}Q${x + r * 0.1} ${y} ${x + r * 0.5} ${y + r}" stroke="#7a1c14" stroke-width="1.5" fill="none" opacity="0.6"/><rect x="${x - r * 0.45}" y="${y - r * 1.25}" width="${r * 0.9}" height="${r * 0.28}" fill="#d9a53c"/><rect x="${x - r * 0.45}" y="${y + r * 0.97}" width="${r * 0.9}" height="${r * 0.28}" fill="#d9a53c"/><path d="M${x} ${y + r * 1.25}V${y + r * 1.9}" stroke="#d9a53c" stroke-width="3"/></g>`;
const lanGrad = (s) => s.def(rad('lan', 0.4, 0.35, 0.9, [[0, '#ff7a5a'], [0.6, '#d93c2a'], [1, '#8f1f18']]));
const cupFn = (x, y, w, h, col, lid = '#fff') => `<g><path d="M${x} ${y}H${x + w}L${x + w * 0.82} ${y + h}H${x + w * 0.18}Z" fill="${col}" opacity="0.92"/><path d="M${x + w * 0.06} ${y + h * 0.5}H${x + w * 0.94}" stroke="#fff" opacity="0.25"/><rect x="${x - 3}" y="${y - 7}" width="${w + 6}" height="9" rx="3" fill="${lid}"/><path d="M${x + w * 0.55} ${y - 7}L${x + w * 0.7} ${y - h * 0.5}" stroke="#2f2a25" stroke-width="5" stroke-linecap="round"/></g>`;

/* 21 便利商店 */
out.conveni = () => {
  const s = Scene(); const R = rng(21);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#eef0ea'], [1, '#d7dcd2']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#cfd3cc'], [1, '#a9aea6']]));
  s.def(lin('glass', 0, 0, 1, 1, [[0, '#cfe8f2', 0.9], [1, '#9ec6d8', 0.9]]));
  s.def(rad('lt', 0.5, 0, 0.9, [[0, '#ffffff', 0.7], [1, '#ffffff', 0]]));
  s.def(lin('cnt', 0, 0, 0, 1, [[0, '#f4f4f0'], [1, '#c9cdc6']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  // 招牌色帶（綠橘藍）
  s.add('<rect y="0" width="800" height="36" fill="#1b8b4c"/><rect y="36" width="800" height="9" fill="#f08a24"/><rect y="45" width="800" height="9" fill="#2f78c8"/>');
  s.add(txt(400, 27, 24, '24H　歡迎光臨', '#fff', 'middle', 700, 'letter-spacing="6"'));
  s.add('<rect y="400" width="800" height="200" fill="url(#fl)"/><g opacity="0.25" stroke="#7d8279" stroke-width="2"><path d="M0 470H800M0 540H800"/><path d="M130 400L40 600M300 400L260 600M500 400L540 600M670 400L760 600"/></g>');
  // 後方冷藏櫃（飲料）
  s.add('<rect x="30" y="80" width="470" height="300" fill="#3b4a52"/>');
  const dr = ['#e8573e', '#3f8fd0', '#f2c038', '#4ea85a', '#f28aa0', '#9b6bd0', '#e0e0e0', '#f0873a'];
  for (let c = 0; c < 4; c++) {
    const x0 = 40 + c * 115;
    s.add(`<rect x="${x0}" y="90" width="108" height="280" fill="url(#glass)"/>`);
    for (let r = 0; r < 4; r++) {
      const y = 100 + r * 68; s.add(`<rect x="${x0}" y="${y + 56}" width="108" height="5" fill="#8b979c"/>`);
      for (let i = 0; i < 5; i++) { const col = dr[Math.floor(R() * dr.length)]; const bx = x0 + 8 + i * 19; s.add(`<rect x="${bx}" y="${y + 12}" width="14" height="44" rx="4" fill="${col}"/><rect x="${bx + 4}" y="${y + 6}" width="6" height="8" fill="#ddd"/><rect x="${bx + 1}" y="${y + 28}" width="12" height="10" fill="#fff" opacity="0.7"/>`); }
    }
    s.add(`<rect x="${x0 + 4}" y="94" width="14" height="270" fill="#fff" opacity="0.14"/>`);
  }
  // 右側零食貨架
  s.add('<rect x="540" y="90" width="230" height="300" fill="#e2e4dd"/><rect x="540" y="90" width="230" height="300" fill="none" stroke="#9aa093" stroke-width="3"/>');
  for (let r = 0; r < 4; r++) {
    const y = 100 + r * 72; s.add(`<rect x="546" y="${y + 62}" width="218" height="6" fill="#9aa093"/>`);
    for (let i = 0; i < 6; i++) { const col = dr[Math.floor(R() * dr.length)]; const bx = 552 + i * 35, h = 38 + R() * 16; s.add(`<rect x="${bx}" y="${y + 62 - h}" width="30" height="${h}" rx="3" fill="${col}"/><rect x="${bx + 5}" y="${y + 62 - h + 8}" width="20" height="12" fill="#fff" opacity="0.8"/>`); }
  }
  s.add('<rect x="0" y="54" width="800" height="22" fill="url(#lt)" opacity="0.7"/>');
  // 結帳櫃台
  s.add(shadow(400, 575, 330, 18, 0.35));
  s.add('<rect x="120" y="400" width="560" height="170" fill="url(#cnt)"/><rect x="110" y="392" width="580" height="16" fill="#fff"/><rect x="110" y="404" width="580" height="4" fill="#9aa093" opacity="0.5"/>');
  s.add('<rect x="130" y="440" width="540" height="10" fill="#1b8b4c"/>');
  // 關東煮鍋
  s.add('<rect x="150" y="360" width="150" height="34" rx="6" fill="#bfc4bb"/><rect x="156" y="364" width="138" height="14" fill="#c98a3a"/><g opacity="0.5" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"><path d="M200 350Q190 330 204 314"/><path d="M240 352Q250 332 238 316"/></g>');
  for (let i = 0; i < 5; i++) s.add(`<rect x="${164 + i * 26}" y="352" width="4" height="22" fill="#d9c08a"/><circle cx="${166 + i * 26}" cy="352" r="7" fill="#f4e6c4"/>`);
  // 收銀機與零食
  s.add('<rect x="420" y="350" width="110" height="44" rx="4" fill="#3a3f45"/><rect x="430" y="358" width="60" height="22" fill="#9ed3a0"/><rect x="500" y="360" width="20" height="14" fill="#555"/>');
  [[560, '#e8573e'], [590, '#f2c038'], [620, '#3f8fd0']].forEach(([x, c]) => s.add(`<rect x="${x}" y="372" width="26" height="20" rx="3" fill="${c}"/>`));
  // 店員
  s.add(person(s, { x: 360, y: 130, h: 440, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#1b8b4c', bottom: '#33394a', pose: 'down', legs: 'none', sleeve: 'short', collar: true }));
  s.add('<rect x="120" y="400" width="560" height="170" fill="url(#cnt)"/><rect x="110" y="392" width="580" height="16" fill="#fff"/><rect x="130" y="440" width="540" height="10" fill="#1b8b4c"/>');
  s.add('<rect x="150" y="360" width="150" height="34" rx="6" fill="#bfc4bb"/><rect x="156" y="364" width="138" height="14" fill="#c98a3a"/>');
  for (let i = 0; i < 5; i++) s.add(`<rect x="${164 + i * 26}" y="352" width="4" height="22" fill="#d9c08a"/><circle cx="${166 + i * 26}" cy="352" r="7" fill="#f4e6c4"/>`);
  s.add('<rect x="420" y="350" width="110" height="44" rx="4" fill="#3a3f45"/><rect x="430" y="358" width="60" height="22" fill="#9ed3a0"/>');
  [[560, '#e8573e'], [590, '#f2c038'], [620, '#3f8fd0']].forEach(([x, c]) => s.add(`<rect x="${x}" y="372" width="26" height="20" rx="3" fill="${c}"/>`));
  return s.out();
};

/* 22 公車站 */
out.busstop = () => {
  const s = Scene(); const R = rng(22);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#8fb8d8'], [0.7, '#f2d9b6'], [1, '#f6e3c6']]));
  s.def(lin('road', 0, 0, 0, 1, [[0, '#6d7078'], [1, '#4a4d54']]));
  s.def(lin('bus', 0, 0, 0, 1, [[0, '#f4f1e8'], [1, '#d0cdc2']]));
  s.def(rad('sun', 0.8, 0.5, 0.7, [[0, '#fff0c0', 0.9], [1, '#fff0c0', 0]]));
  s.def(lin('gl', 0, 0, 1, 1, [[0, '#cfe6f0', 0.55], [1, '#a6c6d8', 0.35]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="660" cy="250" r="280" fill="url(#sun)"/>');
  // 後方大樓
  s.add('<g filter="url(#b2)" opacity="0.85">' + [[0, 150, 120, 230], [110, 110, 110, 270], [230, 170, 90, 210], [560, 100, 120, 280], [690, 150, 110, 230]].map(([x, y, w, h], i) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${['#a9b5c0', '#b8b3a8', '#9fb0b8', '#b5aca0', '#a7b4bd'][i]}"/>`).join('') + '</g>');
  for (let i = 0; i < 40; i++) s.add(`<rect x="${(R() * 760).toFixed(0)}" y="${(160 + R() * 160).toFixed(0)}" width="8" height="10" fill="#fff6d6" opacity="0.5"/>`);
  s.add('<rect y="360" width="800" height="240" fill="url(#road)"/><rect y="336" width="800" height="70" fill="#cfc9bb"/><rect y="404" width="800" height="12" fill="#9d9889"/><g stroke="#a8a293" stroke-width="2" opacity="0.7"><path d="M0 370H800M0 392H800"/><path d="M80 336V406M200 336V406M320 336V406M440 336V406M560 336V406M680 336V406"/></g>');
  s.add('<g fill="#e6dfc8" opacity="0.8"><rect x="40" y="540" width="90" height="8"/><rect x="220" y="540" width="90" height="8"/><rect x="400" y="540" width="90" height="8"/><rect x="580" y="540" width="90" height="8"/></g>');
  // 公車（右側駛來）
  s.add(shadow(560, 500, 270, 14, 0.4));
  s.add('<path d="M330 270H770Q790 270 790 290V470H330Z" fill="url(#bus)"/><rect x="330" y="420" width="460" height="22" fill="#d84a3a"/><rect x="330" y="442" width="460" height="10" fill="#f0b22e"/>');
  [350, 440, 530, 620, 710].forEach((x) => s.add(`<rect x="${x}" y="292" width="72" height="84" rx="6" fill="#7fa4b8"/><rect x="${x + 6}" y="296" width="22" height="76" fill="#fff" opacity="0.2"/>`));
  s.add('<rect x="330" y="276" width="130" height="14" fill="#1a1d22"/>' + txt(395, 288, 12, '307 板橋', '#ffb347', 'middle', 700));
  [[400, 490], [700, 490]].forEach(([x, y]) => s.add(`<circle cx="${x}" cy="${y}" r="34" fill="#25272b"/><circle cx="${x}" cy="${y}" r="17" fill="#9a9a9a"/>`));
  // 站牌亭
  s.add('<g><rect x="36" y="236" width="300" height="12" fill="#3a4a58"/><rect x="40" y="248" width="8" height="150" fill="#5a6a78"/><rect x="324" y="248" width="8" height="150" fill="#5a6a78"/><rect x="48" y="248" width="276" height="140" fill="url(#gl)"/><path d="M60 380L120 252M130 380L190 252" stroke="#fff" opacity="0.4" stroke-width="10"/></g>');
  s.add('<rect x="50" y="378" width="274" height="12" fill="#8a6a46"/><rect x="60" y="390" width="8" height="30" fill="#4a4a50"/><rect x="306" y="390" width="8" height="30" fill="#4a4a50"/>');
  // 站牌
  s.add('<rect x="344" y="190" width="9" height="200" fill="#4a5560"/><rect x="326" y="140" width="46" height="64" rx="5" fill="#2f78c8"/>' + txt(349, 170, 15, '公車', '#fff') + txt(349, 190, 15, '站', '#fff'));
  // 候車的人
  s.add(person(s, { x: 150, y: 154, h: 295, skin: 'mid', hair: '#2a1b14', hairStyle: 'short', top: '#4f8f6a', bottom: '#2f3a52', pose: 'phone', legs: 'stand', shoe: '#eee' }));
  // 機車
  s.add('<g transform="translate(20 450)">' + shadow(110, 112, 120, 9, 0.4) + '<circle cx="40" cy="86" r="26" fill="#25272b"/><circle cx="40" cy="86" r="12" fill="#aaa"/><circle cx="190" cy="86" r="26" fill="#25272b"/><circle cx="190" cy="86" r="12" fill="#aaa"/><path d="M40 86L70 40H92L110 56H172L190 86" stroke="#d8503c" stroke-width="2" fill="none"/><path d="M62 82Q58 40 84 34L100 34L112 60H176Q196 62 196 86L180 86Q168 70 150 74L120 76L100 86Z" fill="#d8503c"/><path d="M50 40Q56 6 74 -6L88 -4Q82 20 90 40Z" fill="#c9442f"/><path d="M74 -6Q90 -26 110 -26" stroke="#444" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="104" y="30" width="78" height="18" rx="8" fill="#2a2a2e"/><path d="M60 46L40 86" stroke="#555" stroke-width="7"/><rect x="170" y="34" width="26" height="28" rx="6" fill="#bd3c2a"/></g>');
  return s.out();
};

/* 23 廟 */
out.temple = () => {
  const s = Scene(); const R = rng(23);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#9cc4e0'], [1, '#f4ead0']]));
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#d9a14a'], [1, '#b87a2c']]));
  s.def(lin('roof', 0, 0, 0, 1, [[0, '#2f7a6a'], [1, '#1f5a50']]));
  s.def(lin('red', 0, 0, 1, 0, [[0, '#a8261c'], [0.5, '#d1392b'], [1, '#8f1f18']]));
  s.def(lin('step', 0, 0, 0, 1, [[0, '#cfc8b8'], [1, '#a9a290']]));
  s.def(rad('smk', 0.5, 0.5, 0.5, [[0, '#fff', 0.55], [1, '#fff', 0]]));
  lanGrad(s);
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<g filter="url(#b8)" opacity="0.7"><ellipse cx="120" cy="150" rx="110" ry="30" fill="#fff"/><ellipse cx="680" cy="110" rx="100" ry="26" fill="#fff"/></g>');
  s.add('<g filter="url(#b4)" opacity="0.8"><ellipse cx="60" cy="330" rx="120" ry="90" fill="#6a9a5a"/><ellipse cx="750" cy="330" rx="120" ry="90" fill="#5f8f55"/></g>');
  // 屋頂（燕尾脊）
  s.add('<path d="M110 200Q130 190 150 168Q170 150 200 150H600Q630 150 650 168Q670 190 690 200Q668 206 640 204L630 224H170L160 204Q132 206 110 200Z" fill="url(#roof)"/>');
  s.add('<path d="M170 224H630L624 238H176Z" fill="#c9962f"/>');
  s.add('<g stroke="#1a4a40" stroke-width="2" opacity="0.5">' + Array.from({ length: 26 }, (_, i) => `<path d="M${180 + i * 17} 156V222"/>`).join('') + '</g>');
  s.add('<path d="M388 150L400 120L412 150Z" fill="#e0b63c"/><circle cx="400" cy="116" r="8" fill="#e0b63c"/>');
  // 牆與柱
  s.add('<rect x="170" y="238" width="460" height="200" fill="url(#wall)"/>');
  [190, 330, 460, 590].forEach((x) => s.add(`<rect x="${x - 12}" y="238" width="24" height="200" fill="url(#red)"/><rect x="${x - 16}" y="420" width="32" height="18" fill="#7a5a30"/>`));
  s.add('<rect x="262" y="252" width="276" height="50" rx="4" fill="#7a1c14"/><rect x="266" y="256" width="268" height="42" rx="2" fill="none" stroke="#e0b63c" stroke-width="2"/>' + txt(400, 288, 32, '平安宮', '#f2cf63', 'middle', 700, 'letter-spacing="10"'));
  // 門
  s.add('<rect x="350" y="318" width="100" height="120" fill="#7a1c14"/><rect x="354" y="322" width="44" height="112" fill="url(#red)"/><rect x="402" y="322" width="44" height="112" fill="url(#red)"/>');
  [[376, 380], [424, 380]].forEach(([x, y]) => s.add(`<circle cx="${x}" cy="${y}" r="12" fill="#e0b63c"/>`));
  s.add('<g fill="#e0b63c" opacity="0.8">' + [0, 1, 2].map((r) => [0, 1, 2].map((c) => `<circle cx="${366 + c * 16}" cy="${338 + r * 16}" r="2.5"/><circle cx="${414 + c * 16}" cy="${338 + r * 16}" r="2.5"/>`).join('')).join('') + '</g>');
  // 窗花
  [[240, 350], [560, 350]].forEach(([x, y]) => s.add(`<rect x="${x - 30}" y="${y - 40}" width="60" height="80" rx="30" fill="#7a1c14"/><path d="M${x - 22} ${y}H${x + 22}M${x} ${y - 32}V${y + 32}" stroke="#e0b63c" stroke-width="3"/>`));
  // 階梯
  s.add('<rect x="130" y="438" width="540" height="30" fill="url(#step)"/><rect x="100" y="468" width="600" height="34" fill="url(#step)"/><rect x="70" y="502" width="660" height="98" fill="#bdb6a4"/><g stroke="#8d8672" stroke-width="2" opacity="0.5"><path d="M130 438H670M100 468H700M70 502H730"/></g>');
  // 紅燈籠
  [[225, 270, 24], [575, 270, 24], [150, 250, 16], [650, 250, 16]].forEach(([x, y, r]) => s.add(lantern(x, y, r)));
  // 香爐
  s.add(shadow(400, 560, 120, 14, 0.4));
  s.add('<path d="M330 500H470L460 550H340Z" fill="#8c6a2a"/><path d="M322 496H478L470 510H330Z" fill="#c9962f"/><rect x="346" y="550" width="108" height="10" fill="#6a4e1e"/><path d="M335 500Q320 470 340 470M465 500Q480 470 460 470" stroke="#c9962f" stroke-width="8" fill="none"/>');
  for (let i = 0; i < 9; i++) s.add(`<path d="M${356 + i * 11} 498V${470 - (i % 3) * 8}" stroke="#7a1c14" stroke-width="3"/><circle cx="${356 + i * 11}" cy="${470 - (i % 3) * 8}" r="2.5" fill="#ff8a3c"/>`);
  s.add('<g filter="url(#b8)"><path d="M380 470Q360 420 395 390Q430 360 400 320" stroke="#fff" stroke-width="22" opacity="0.5" fill="none"/><path d="M420 470Q440 430 410 400Q385 370 420 340" stroke="#fff" stroke-width="18" opacity="0.4" fill="none"/></g>');
  // 兩側石獅
  [[170, 1], [630, -1]].forEach(([x, d]) => s.add(`<g transform="translate(${x} 440)"><rect x="-30" y="40" width="60" height="22" fill="#a9a290"/><path d="M-22 40Q-26 0 -6 -8Q-12 -28 8 -30Q26 -28 22 -6Q30 12 22 40Z" fill="#c4bda9"/><circle cx="2" cy="-14" r="3" fill="#333"/></g>`));
  return s.out();
};

/* 24 手搖飲店 */
out.bubbletea = () => {
  const s = Scene(); const R = rng(24);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f6ecd9'], [1, '#e8d9bc']]));
  s.def(lin('cnt', 0, 0, 0, 1, [[0, '#d9b98a'], [1, '#a8834f']]));
  s.def(lin('awn', 0, 0, 0, 1, [[0, '#2f9a8a'], [1, '#237a6e']]));
  s.def(rad('lt', 0.5, 0, 0.9, [[0, '#fff4d0', 0.8], [1, '#fff4d0', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  // 遮陽棚
  for (let i = 0; i < 10; i++) s.add(`<path d="M${i * 80} 0H${i * 80 + 80}L${i * 80 + 72} 70Q${i * 80 + 40} 88 ${i * 80 + 8} 70Z" fill="${i % 2 ? '#fff3d6' : 'url(#awn)'}"/>`);
  // 招牌
  s.add('<rect x="270" y="96" width="260" height="56" rx="8" fill="#237a6e"/>' + txt(400, 136, 34, '茶 の 時 光', '#fff6dc', 'middle', 700, 'letter-spacing="3"'));
  // 菜單板
  s.add('<rect x="40" y="170" width="250" height="260" rx="6" fill="#2b3a36"/><rect x="46" y="176" width="238" height="248" rx="4" fill="none" stroke="#e8d9bc" stroke-width="2"/>');
  s.add(txt(165, 206, 22, '飲 料 菜 單', '#f6e8c0'));
  [['珍珠奶茶', '55'], ['綠茶', '30'], ['檸檬愛玉', '50'], ['四季春', '35'], ['芋頭鮮奶', '65'], ['紅茶拿鐵', '50']].forEach(([n, p], i) => s.add(txt(62, 242 + i * 30, 19, n, '#fff', 'start', 500) + txt(268, 242 + i * 30, 19, '$' + p, '#ffd36a', 'end', 700) + `<path d="M62 ${248 + i * 30}H268" stroke="#fff" opacity="0.18" stroke-dasharray="3 4"/>`));
  // 掛燈
  s.add('<circle cx="560" cy="150" r="100" fill="url(#lt)"/><path d="M560 88V120" stroke="#555" stroke-width="2"/><path d="M540 140Q560 108 580 140Z" fill="#e8c34a"/>');
  // 右牆：果汁杯圖
  s.add('<rect x="590" y="190" width="170" height="130" rx="6" fill="#fff8e6" stroke="#d9c08a" stroke-width="3"/>');
  s.add(cupFn(630, 220, 38, 70, '#c98a5a') + cupFn(690, 230, 34, 62, '#8fc96a'));
  s.add(txt(675, 308, 14, '今日推薦', '#a8602a', 'middle', 700));
  // 櫃台
  s.add(shadow(400, 586, 400, 16, 0.3));
  s.add('<rect x="0" y="440" width="800" height="160" fill="url(#cnt)"/><rect x="0" y="430" width="800" height="16" fill="#e6c89a"/><path d="M0 500H800" stroke="#7a5a30" opacity="0.3" stroke-width="3"/>');
  // 封口機與杯子
  s.add('<rect x="694" y="360" width="96" height="72" rx="8" fill="#e8e4da"/><rect x="702" y="370" width="80" height="26" rx="4" fill="#2f9a8a"/><rect x="722" y="402" width="40" height="30" fill="#bfbab0"/>');
  s.add('<g fill="#2a1a12">' + Array.from({ length: 0 }, (_, i) => `<circle cx="${312 + (i % 4) * 9 + (i > 7 ? 3 : 0)}" cy="${420 - Math.floor(i / 4) * 8}" r="4"/>`).join('') + '</g>');
  // 店員
  s.add(person(s, { x: 430, y: 215, h: 400, skin: 'light', hair: '#3a2418', hairStyle: 'ponytail', top: '#fff3d6', bottom: '#33394a', pose: 'hold', legs: 'none', sleeve: 'short', collar: false }));
  s.add('<path d="M388 258H472L466 300H394Z" fill="#2f9a8a" opacity="0.9"/>');
  s.add('<rect x="0" y="440" width="800" height="160" fill="url(#cnt)"/><rect x="0" y="430" width="800" height="16" fill="#e6c89a"/>');
  s.add(cupFn(405, 268, 50, 80, '#c98a5a'));
  s.add(cupFn(520, 350, 52, 82, '#c98a5a') + cupFn(584, 358, 48, 74, '#8fc96a') + cupFn(640, 354, 50, 78, '#f0a8b8'));
  s.add(txt(400, 548, 28, '全 部 現 做', '#7a5a30', 'middle', 700, 'opacity="0.5" letter-spacing="8"'));
  return s.out();
};

/* 25 麵包店 */
out.bakery = () => {
  const s = Scene(); const R = rng(25);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f4e2c0'], [1, '#e6c998']]));
  s.def(lin('wood', 0, 0, 0, 1, [[0, '#b98556'], [1, '#8a5c36']]));
  s.def(lin('glass', 0, 0, 0, 1, [[0, '#fff', 0.35], [1, '#cfe0e8', 0.2]]));
  s.def(rad('bun', 0.35, 0.3, 0.9, [[0, '#f0b868'], [0.6, '#d68a3a'], [1, '#9a5a1e']]));
  s.def(rad('glow', 0.5, 0, 1, [[0, '#ffe3a6', 0.8], [1, '#ffe3a6', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<g opacity="0.2" stroke="#b08a5a" stroke-width="2">' + Array.from({ length: 16 }, (_, i) => `<path d="M${i * 52} 0V320"/>`).join('') + '</g>');
  // 後牆架：吐司與長棍
  s.add('<rect x="30" y="50" width="740" height="14" fill="url(#wood)"/><rect x="30" y="170" width="740" height="14" fill="url(#wood)"/>');
  for (let i = 0; i < 6; i++) s.add(`<rect x="${60 + i * 120}" y="${54}" width="90" height="116" rx="14" fill="#d99a4a" transform="rotate(${-72 + i * 3} ${105 + i * 120} 170)" opacity="0.001"/>`);
  for (let i = 0; i < 9; i++) { const x = 60 + i * 80; s.add(`<g transform="rotate(${-14 + (i % 3) * 4} ${x + 14} 168)"><rect x="${x}" y="64" width="26" height="104" rx="13" fill="#d68a3a"/><path d="M${x + 4} 80l18 8M${x + 4} 104l18 8M${x + 4} 128l18 8" stroke="#8a4a14" stroke-width="3" opacity="0.7" stroke-linecap="round"/><rect x="${x + 3}" y="70" width="6" height="90" rx="3" fill="#fff" opacity="0.18"/></g>`); }
  s.add('<circle cx="400" cy="60" r="180" fill="url(#glow)" filter="url(#b16)"/>');
  // 黑板
  s.add('<rect x="50" y="196" width="230" height="96" rx="6" fill="#2b3a36"/><rect x="50" y="196" width="230" height="96" rx="6" fill="none" stroke="#8a5c36" stroke-width="8"/>');
  s.add(txt(165, 226, 22, '今 日 現 烤', '#fff3d6') + txt(80, 256, 16, '菠蘿麵包', '#fff', 'start', 500) + txt(250, 256, 16, '$35', '#ffd36a', 'end') + txt(80, 280, 16, '牛角麵包', '#fff', 'start', 500) + txt(250, 280, 16, '$40', '#ffd36a', 'end'));
  // 展示櫃
  s.add(shadow(400, 584, 380, 14, 0.35));
  s.add('<rect x="40" y="380" width="720" height="200" fill="url(#wood)"/><rect x="30" y="370" width="740" height="14" fill="#d9a870"/>');
  s.add('<rect x="70" y="300" width="660" height="70" fill="url(#glass)"/>');
  // 麵包盤
  const bun = (x, y, r) => s.add(`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.78}" fill="url(#bun)"/><path d="M${x - r * 0.5} ${y - r * 0.3}Q${x} ${y - r * 0.6} ${x + r * 0.5} ${y - r * 0.3}" stroke="#f6d49a" stroke-width="2" fill="none" opacity="0.7"/>`);
  const croi = (x, y) => s.add(`<path d="M${x - 28} ${y}Q${x - 20} ${y - 26} ${x} ${y - 28}Q${x + 20} ${y - 26} ${x + 28} ${y}Q${x} ${y + 8} ${x - 28} ${y}Z" fill="#e0a04a"/><path d="M${x - 14} ${y - 20}Q${x - 6} ${y} ${x - 14} ${y + 4}M${x} ${y - 26}V${y + 6}M${x + 14} ${y - 20}Q${x + 6} ${y} ${x + 14} ${y + 4}" stroke="#a8641c" stroke-width="2.5" fill="none"/>`);
  [[110, 'b'], [260, 'c'], [410, 'b'], [560, 'c']].forEach(([x, k]) => {
    s.add(`<rect x="${x - 60}" y="352" width="140" height="10" fill="#e8e2d4"/>`);
    for (let i = 0; i < 3; i++) (k === 'b' ? bun : () => croi(x - 30 + i * 36, 352))(x - 30 + i * 36, 346, 22);
  });
  [[100, 'c'], [250, 'b'], [400, 'c'], [550, 'b']].forEach(([x, k]) => { for (let i = 0; i < 3; i++) (k === 'b' ? bun(x - 20 + i * 34, 408, 22) : croi(x - 24 + i * 36, 414)); });
  s.add('<rect x="70" y="300" width="660" height="70" fill="url(#glass)"/><path d="M90 300L130 370" stroke="#fff" opacity="0.3" stroke-width="12"/>');
  // 價籤
  [[110, '$30'], [260, '$40'], [410, '$35'], [560, '$45']].forEach(([x, p]) => s.add(`<rect x="${x - 20}" y="438" width="52" height="26" rx="3" fill="#fffdf4"/>` + txt(x + 6, 458, 17, p, '#c0392b')));
  // 烘焙師傅
  s.add(person(s, { x: 600, y: 160, h: 380, skin: 'light', hair: '#4a3a2a', hairStyle: 'short', top: '#f8f4ea', bottom: '#33394a', pose: 'hold', legs: 'none', sleeve: 'short', collar: false }));
  s.add('<path d="M566 98Q562 56 600 58Q638 56 634 98Z" fill="#fff"/><rect x="566" y="94" width="68" height="12" rx="3" fill="#f0ede4"/>');
  s.add('<rect x="40" y="380" width="720" height="200" fill="url(#wood)"/><rect x="30" y="370" width="740" height="14" fill="#d9a870"/>');
  s.add(txt(400, 520, 36, '麵 包 工 房', '#f6e0b8', 'middle', 700, 'opacity="0.55" letter-spacing="14"'));
  return s.out();
};

/* 26 圖書館 */
out.library = () => {
  const s = Scene(); const R = rng(26);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#e4dcc8'], [1, '#cdbf9f']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#9a7650'], [1, '#6c4e30']]));
  s.def(lin('shelf', 0, 0, 1, 0, [[0, '#5a3d27'], [1, '#7a5636']]));
  s.def(lin('tbl', 0, 0, 0, 1, [[0, '#c9955f'], [1, '#97663a']]));
  s.def(rad('lamp', 0.5, 0.3, 0.7, [[0, '#ffe3a6', 0.85], [1, '#ffe3a6', 0]]));
  s.def(lin('win', 0, 0, 0, 1, [[0, '#cfe6f4'], [1, '#f6efd8']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<rect y="410" width="800" height="190" fill="url(#fl)"/><g opacity="0.2" stroke="#2a1608" stroke-width="2"><path d="M0 450H800M0 500H800M0 560H800"/></g>');
  // 窗
  s.add('<rect x="320" y="40" width="160" height="190" fill="url(#win)" stroke="#8a6a46" stroke-width="8"/><path d="M400 40V230M320 135H480" stroke="#8a6a46" stroke-width="5"/>');
  const cols = ['#b5483a', '#3f6b8f', '#d6a53c', '#4d7a52', '#8a5aa0', '#e0d6c0', '#2f4858', '#c9733a', '#6b8f71', '#a63d4d'];
  const shelfBlock = (x0, x1, y0, rows, rh) => {
    s.add(`<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${rows * rh + 10}" fill="url(#shelf)"/>`);
    for (let r = 0; r < rows; r++) {
      const y = y0 + 8 + r * rh; let x = x0 + 8;
      s.add(`<rect x="${x0 + 6}" y="${y}" width="${x1 - x0 - 12}" height="${rh - 4}" fill="#2b1a0f" opacity="0.55"/>`);
      while (x < x1 - 16) { const w = 9 + R() * 13, h = rh - 12 - R() * 16, c = cols[Math.floor(R() * cols.length)]; s.add(`<rect x="${x.toFixed(1)}" y="${(y + rh - 4 - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${c}"/><rect x="${(x + 2).toFixed(1)}" y="${(y + rh - 4 - h + 6).toFixed(1)}" width="${(w - 4).toFixed(1)}" height="5" fill="#fff" opacity="0.4"/><rect x="${x.toFixed(1)}" y="${(y + rh - 4 - h).toFixed(1)}" width="3" height="${h.toFixed(1)}" fill="#fff" opacity="0.15"/>`); x += w + 1; }
      s.add(`<rect x="${x0 + 4}" y="${y + rh - 4}" width="${x1 - x0 - 8}" height="6" fill="#4a3220"/>`);
    }
  };
  shelfBlock(0, 290, 30, 5, 66); shelfBlock(510, 800, 30, 5, 66);
  s.add('<rect x="0" y="366" width="290" height="44" fill="#3d2a1a"/><rect x="510" y="366" width="290" height="44" fill="#3d2a1a"/>');
  // 書架標籤
  [[60, '文學'], [180, '歷史'], [570, '科學'], [690, '語言']].forEach(([x, t]) => s.add(`<rect x="${x - 26}" y="376" width="52" height="22" rx="2" fill="#f4ecd8"/>` + txt(x, 393, 14, t, '#5a3d27')));
  // 閱覽桌
  s.add(shadow(400, 580, 330, 16, 0.4));
  s.add('<path d="M110 450H690L730 500H70Z" fill="#dba978"/><rect x="70" y="500" width="660" height="26" fill="url(#tbl)"/><rect x="100" y="526" width="26" height="60" fill="#6d4526"/><rect x="674" y="526" width="26" height="60" fill="#6d4526"/>');
  // 讀者（桌後，露出上半身）
  s.add(person(s, { x: 400, y: 312, h: 400, skin: 'light', hair: '#2a1b14', hairStyle: 'long', top: '#7a9a7a', bottom: '#33394a', pose: 'table', legs: 'none', sleeve: 'long', collar: true }));
  s.add('<path d="M110 450H690L730 500H70Z" fill="#dba978"/><rect x="70" y="500" width="660" height="26" fill="url(#tbl)"/>');
  s.add('<path d="M350 460L400 448L450 460L450 500L400 488L350 500Z" fill="#f6efe0"/><path d="M400 448V488" stroke="#b9a98a" stroke-width="2"/><path d="M360 468L392 460M360 478L392 470M408 460L440 468M408 470L440 478" stroke="#9a8a6a" stroke-width="2"/>');
  // 書堆 與 檯燈
  [[190, 4], [570, 3]].forEach(([x, n]) => { for (let i = 0; i < n; i++) s.add(`<rect x="${x - 50 + (i % 2) * 6}" y="${480 - (i + 1) * 20}" width="100" height="19" fill="${cols[(i * 3 + n) % cols.length]}"/><rect x="${x - 50 + (i % 2) * 6}" y="${480 - (i + 1) * 20 + 14}" width="100" height="3" fill="#fff" opacity="0.5"/>`); });
  s.add('<path d="M640 470V400L664 360" stroke="#2f4858" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M640 372Q662 340 690 372Z" fill="#2f6b57"/><ellipse cx="640" cy="472" rx="22" ry="6" fill="#2f4858"/><circle cx="664" cy="390" r="110" fill="url(#lamp)" filter="url(#b8)"/>');
  s.add('<rect x="270" y="450" width="190" height="2" fill="#000" opacity="0"/>');
  return s.out();
};

/* 27 郵局 */
out.postoffice = () => {
  const s = Scene(); const R = rng(27);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#e7ebe0'], [1, '#d0d6c6']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#c4c8b8'], [1, '#9ea28f']]));
  s.def(lin('cnt', 0, 0, 0, 1, [[0, '#4a8a5e'], [1, '#2f6a44']]));
  s.def(lin('glass', 0, 0, 1, 1, [[0, '#d4ecf2', 0.55], [1, '#a6c8d4', 0.35]]));
  s.def(lin('box', 0, 0, 1, 0, [[0, '#d9b384'], [1, '#b98e5c']]));
  s.def(lin('mb', 0, 0, 1, 0, [[0, '#c9362a'], [0.5, '#e8503c'], [1, '#9a2418']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<rect y="420" width="800" height="180" fill="url(#fl)"/><g opacity="0.25" stroke="#6d7262" stroke-width="2"><path d="M0 480H800M0 540H800"/><path d="M130 420L50 600M330 420L300 600M530 420L560 600M700 420L780 600"/></g>');
  // 上方招牌
  s.add('<rect x="0" y="0" width="800" height="70" fill="#1f7a4a"/><rect x="0" y="70" width="800" height="8" fill="#145a34"/>' + txt(400, 50, 40, '中 華 郵 政 ・ 郵 局', '#fff', 'middle', 700, 'letter-spacing="6"'));
  // 窗口布告
  s.add('<rect x="40" y="110" width="170" height="130" fill="#fffdf4" stroke="#bfc5b0" stroke-width="3"/>' + txt(125, 140, 20, '營 業 時 間', '#1f7a4a') + txt(125, 175, 16, '週一至週五', '#555', 'middle', 500) + txt(125, 200, 18, '08:30–17:30', '#c0392b') + txt(125, 226, 14, '國定假日休息', '#777', 'middle', 500));
  s.add('<rect x="600" y="110" width="160" height="130" fill="#fffdf4" stroke="#bfc5b0" stroke-width="3"/>' + txt(680, 140, 20, '掛 號 ・ 包 裹', '#1f7a4a') + txt(680, 180, 15, '請先抽號碼牌', '#555', 'middle', 500) + `<rect x="640" y="192" width="80" height="34" rx="4" fill="#1f7a4a"/>` + txt(680, 218, 22, '023', '#fff'));
  // 玻璃窗口與店員
  s.add('<rect x="230" y="120" width="340" height="230" fill="#e0e6d8"/>');
  s.add(person(s, { x: 400, y: 214, h: 380, skin: 'mid', hair: '#2a1b14', hairStyle: 'bun', top: '#1f7a4a', bottom: '#33394a', pose: 'table', legs: 'none', sleeve: 'short', collar: true }));
  s.add('<rect x="230" y="120" width="340" height="230" fill="url(#glass)"/><path d="M260 340L330 126" stroke="#fff" opacity="0.4" stroke-width="16"/><rect x="224" y="114" width="352" height="10" fill="#7a8a78"/><rect x="224" y="350" width="352" height="10" fill="#7a8a78"/><rect x="224" y="114" width="10" height="246" fill="#7a8a78"/><rect x="566" y="114" width="10" height="246" fill="#7a8a78"/>');
  // 櫃台
  s.add(shadow(400, 586, 330, 16, 0.35));
  s.add('<rect x="170" y="360" width="460" height="226" fill="url(#cnt)"/><rect x="160" y="352" width="480" height="16" fill="#e8eedf"/>');
  s.add('<rect x="260" y="318" width="90" height="34" rx="4" fill="#bfc5b8"/><rect x="266" y="324" width="50" height="18" fill="#9ed3a0"/><rect x="450" y="324" width="70" height="28" fill="#f4ecd8"/><path d="M458 334H512M458 344H500" stroke="#999" stroke-width="2"/>');
  // 左：紅色郵筒
  s.add(shadow(100, 574, 70, 10, 0.4));
  s.add('<rect x="50" y="330" width="96" height="244" rx="48" fill="url(#mb)"/><rect x="50" y="370" width="96" height="14" fill="#7a1c14" opacity="0.4"/><rect x="66" y="404" width="64" height="12" rx="3" fill="#2a1008"/>' + txt(98, 466, 22, '郵', '#fff') + txt(98, 494, 22, '筒', '#fff') + '<rect x="58" y="574" width="80" height="8" fill="#7a1c14"/>');
  // 右：包裹與磅秤
  s.add(shadow(700, 578, 110, 12, 0.4));
  s.add('<path d="M600 470H760V570H600Z" fill="url(#box)"/><path d="M600 470L640 440H800L760 470Z" fill="#e8c898"/><path d="M680 470V570" stroke="#8a6a3a" stroke-width="10" opacity="0.5"/><rect x="640" y="520" width="50" height="30" fill="#fffdf4"/><path d="M646 530H684M646 540H676" stroke="#666" stroke-width="2"/>');
  s.add('<path d="M680 380H770V440H680Z" fill="url(#box)"/><path d="M680 380L700 362H790L770 380Z" fill="#e8c898"/><path d="M724 380V440" stroke="#8a6a3a" stroke-width="8" opacity="0.5"/>');
  // 信件
  s.add('<g transform="translate(210 332) rotate(-6)"><rect width="46" height="30" fill="#fff" stroke="#c9c4b4"/><path d="M0 0L23 17L46 0" stroke="#b9b49f" fill="none"/><rect x="32" y="4" width="10" height="8" fill="#e8503c"/></g>');
  return s.out();
};

/* 28 餐廳點菜 */
out.restaurant = () => {
  const s = Scene(); const R = rng(28);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#7a2a22'], [1, '#5a1c16']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#6a5038'], [1, '#42301e']]));
  s.def(lin('tbl', 0, 0, 0, 1, [[0, '#f4ecdc'], [1, '#d9ccb0']]));
  s.def(rad('lt', 0.5, 0.2, 0.7, [[0, '#ffd88a', 0.8], [1, '#ffd88a', 0]]));
  lanGrad(s);
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<g opacity="0.12" stroke="#e8c070" stroke-width="2">' + Array.from({ length: 10 }, (_, i) => `<path d="M${i * 90} 0V380"/>`).join('') + '</g>');
  s.add('<rect y="400" width="800" height="200" fill="url(#fl)"/>');
  // 牆上書法 / 窗框
  s.add('<rect x="60" y="120" width="150" height="190" fill="#f1e4c4" stroke="#c9962f" stroke-width="6"/>' + txt(135, 200, 52, '福', '#b2261a') + txt(135, 270, 22, '歡迎光臨', '#6a3a1a', 'middle', 700, 'letter-spacing="2"'));
  s.add('<rect x="590" y="120" width="150" height="190" fill="#f1e4c4" stroke="#c9962f" stroke-width="6"/><path d="M620 280Q650 220 680 200Q700 180 715 150" stroke="#2f6a3a" stroke-width="5" fill="none"/><path d="M660 240q14 -22 36 -22M646 258q-18 -14 -38 -6" stroke="#2f6a3a" stroke-width="4" fill="none"/>');
  [[120, 60], [270, 40], [420, 56], [570, 40], [700, 60]].forEach(([x, y], i) => s.add(lantern(x, y + 30, i === 2 ? 28 : 22)));
  s.add('<circle cx="400" cy="200" r="260" fill="url(#lt)" filter="url(#b16)"/>');
  // 圓桌（桌面橢圓）
  s.add(shadow(400, 570, 300, 18, 0.45));
  s.add('<rect x="380" y="470" width="40" height="110" fill="#3a2a1c"/>');
  // 顧客（坐在桌後）
  s.add(person(s, { x: 290, y: 285, h: 390, skin: 'light', hair: '#2a1b14', hairStyle: 'short', top: '#4f6f9a', bottom: '#2f3a52', pose: 'table', legs: 'none', sleeve: 'long', collar: true }));
  // 服務生（站在桌旁右側，拿點菜單）
  s.add(person(s, { x: 580, y: 150, h: 460, skin: 'mid', hair: '#2a1b14', hairStyle: 'ponytail', top: '#fff8ea', bottom: '#2a2f3a', pose: 'hold', legs: 'stand', sleeve: 'long', collar: false, shoe: '#2a2a2e' }));
  s.add('<path d="M545 220H615L609 308H551Z" fill="#c9362a" opacity="0.95"/>');
  s.add('<g transform="translate(556 296) rotate(-10)"><rect width="46" height="60" rx="3" fill="#fffdf4" stroke="#b9ae92"/><path d="M8 14H38M8 26H38M8 38H30" stroke="#8a7a58" stroke-width="3"/></g><path d="M626 300L606 346" stroke="#222" stroke-width="3" stroke-linecap="round"/>');
  // 桌面
  s.add('<ellipse cx="400" cy="480" rx="300" ry="62" fill="#9a6a3c"/><ellipse cx="400" cy="472" rx="290" ry="56" fill="url(#tbl)"/>');
  s.add('<ellipse cx="400" cy="472" rx="190" ry="34" fill="#c9362a" opacity="0.25"/>');
  // 菜餚與茶
  const plate = (x, y, rx, col) => `<ellipse cx="${x}" cy="${y + 6}" rx="${rx}" ry="${rx * 0.34}" fill="#000" opacity="0.18"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.34}" fill="#fff"/><ellipse cx="${x}" cy="${y - 2}" rx="${rx * 0.7}" ry="${rx * 0.22}" fill="${col}"/>`;
  s.add(plate(380, 470, 62, '#c4541e') + plate(480, 486, 54, '#5c9a3a') + plate(290, 494, 46, '#d9a53c'));
  s.add('<g fill="#7a2a14"><circle cx="360" cy="466" r="6"/><circle cx="378" cy="470" r="6"/><circle cx="398" cy="466" r="6"/></g><g fill="#2f6a2a"><circle cx="462" cy="484" r="6"/><circle cx="486" cy="482" r="6"/></g>');
  s.add('<path d="M215 478h26l-4 24h-18z" fill="#f0e6d0"/><ellipse cx="228" cy="478" rx="13" ry="4" fill="#c9962f"/><path d="M345 502H420" stroke="#6a4a2a" stroke-width="3"/>');
  s.add('<g opacity="0.45" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#b2)"><path d="M380 440Q372 420 384 404"/><path d="M482 456Q490 436 480 420"/></g>');
  return s.out();
};

/* 29 超市 */
out.supermarket = () => {
  const s = Scene(); const R = rng(29);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f0f0ea'], [1, '#d9dbd0']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#d6d8d0'], [1, '#a8aba2']]));
  s.def(lin('sh', 0, 0, 0, 1, [[0, '#e6e8e2'], [1, '#b9bcb3']]));
  s.def(rad('lt', 0.5, 0, 0.8, [[0, '#ffffff', 0.7], [1, '#ffffff', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  // 地板（透視）
  s.add('<path d="M0 600V380L300 330H500L800 380V600Z" fill="url(#fl)"/><g stroke="#9a9d94" stroke-width="2" opacity="0.5"><path d="M400 330V600M300 330L120 600M500 330L680 600M200 345L-100 600M600 345L900 600"/><path d="M0 420H800M0 480H800M0 550H800"/></g>');
  // 左右貨架（透視）
  const colr = ['#e8573e', '#3f8fd0', '#f2c038', '#4ea85a', '#f28aa0', '#9b6bd0', '#f0873a', '#e8e4da'];
  const aisle = (side) => {
    const sg = side;
    const xo = (x) => (sg > 0 ? 800 - x : x);
    s.add(`<path d="M${xo(0)} 60L${xo(300)} 190V330L${xo(0)} 470Z" fill="url(#sh)"/>`);
    for (let r = 0; r < 4; r++) {
      const t = r / 4;
      const yA0 = 60 + t * 410, yA1 = 60 + (t + 0.25) * 410;
      const yB0 = 190 + t * 140, yB1 = 190 + (t + 0.25) * 140;
      s.add(`<path d="M${xo(0)} ${yA1 - 10}L${xo(300)} ${yB1 - 4}" stroke="#7d8076" stroke-width="5"/>`);
      for (let i = 0; i < 8; i++) {
        const u0 = i / 8, u1 = (i + 0.8) / 8;
        const px = (u) => 0 + u * 300;
        const top = (u) => yA0 + (yB0 - yA0) * u + 14, bot = (u) => yA1 - 10 + (yB1 - 4 - (yA1 - 10)) * u;
        const col = colr[Math.floor(R() * colr.length)];
        s.add(`<path d="M${xo(px(u0))} ${top(u0)}L${xo(px(u1))} ${top(u1)}L${xo(px(u1))} ${bot(u1)}L${xo(px(u0))} ${bot(u0)}Z" fill="${col}"/><path d="M${xo(px(u0))} ${top(u0) + 8}L${xo(px(u1))} ${top(u1) + 6}" stroke="#fff" stroke-width="5" opacity="0.5"/>`);
      }
    }
  };
  aisle(-1); aisle(1);
  // 中間遠處（貨架盡頭）
  s.add('<rect x="300" y="190" width="200" height="140" fill="#cfd4c8"/>');
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) s.add(`<rect x="${306 + i * 21.5}" y="${200 + r * 42}" width="17" height="34" fill="${colr[(i * 3 + r) % colr.length]}"/>`);
  // 天花與燈、吊牌
  s.add('<rect width="800" height="60" fill="#f4f4ee"/><g>' + [[200, 40], [400, 40], [600, 40]].map(([x, y]) => `<rect x="${x - 70}" y="${y - 8}" width="140" height="12" rx="4" fill="#fff"/><ellipse cx="${x}" cy="${y + 4}" rx="110" ry="26" fill="url(#lt)"/>`).join('') + '</g>');
  s.add('<rect x="290" y="62" width="220" height="48" rx="6" fill="#d9362a"/>' + txt(400, 98, 30, '特 價 優 惠', '#fff', 'middle', 700, 'letter-spacing="4"'));
  // 購物車與人
  s.add(shadow(400, 590, 220, 16, 0.4));
  s.add('<rect x="262" y="318" width="276" height="12" rx="6" fill="#e8573e"/>');
  s.add(person(s, { x: 400, y: 222, h: 400, skin: 'mid', hair: '#3a2a22', hairStyle: 'bun', top: '#e8896a', bottom: '#3d4a5c', pose: 'hold', legs: 'none', sleeve: 'short', collar: false }));
  s.add('<path d="M260 330H540L510 490H290Z" fill="#cfd4d8" opacity="0.5"/><path d="M260 330H540L510 490H290Z" fill="none" stroke="#6a7078" stroke-width="5"/><g stroke="#6a7078" stroke-width="3" opacity="0.8">' + Array.from({ length: 8 }, (_, i) => `<path d="M${280 + i * 33} 332L${296 + i * 28} 488"/>`).join('') + '<path d="M274 400H526M282 440H518"/></g>');
  [['#f2c038', 300, 380, 40, 70], ['#3f8fd0', 350, 392, 38, 64], ['#4ea85a', 404, 376, 44, 74], ['#e8573e', 458, 396, 36, 60]].forEach(([c, x, y, w, h]) => s.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${c}"/><rect x="${x + 6}" y="${y + 14}" width="${w - 12}" height="16" fill="#fff" opacity="0.8"/>`));
  s.add('<path d="M296 486H506V500H296Z" fill="#6a7078"/><circle cx="310" cy="530" r="16" fill="#2a2d32"/><circle cx="492" cy="530" r="16" fill="#2a2d32"/><path d="M300 500V516M496 500V516" stroke="#6a7078" stroke-width="6"/>');
  return s.out();
};

module.exports = out;
