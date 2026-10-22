const { rng, lin, rad, Scene, shadow, shade, person } = require('./lib');
const out = {};

/* 11 捷運 */
out.mrt = () => {
  const s = Scene(); const R = rng(4);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#eceff1'], [1, '#cfd6da']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#8e969b'], [1, '#6b7378']]));
  s.def(lin('seat', 0, 0, 0, 1, [[0, '#3d7fc4'], [1, '#2a5f9a']]));
  s.def(lin('seat2', 0, 0, 0, 1, [[0, '#f0a03c'], [1, '#c97c1c']]));
  s.def(lin('pole', 0, 0, 1, 0, [[0, '#9aa0a4'], [0.4, '#f4f6f7'], [1, '#7f868a']]));
  s.def(lin('night', 0, 0, 0, 1, [[0, '#1a2a44'], [1, '#2f4a6b']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<rect y="0" width="800" height="70" fill="#dfe4e7"/><g fill="#fff" opacity="0.9"><rect x="40" y="26" width="720" height="16" rx="8"/></g><rect y="70" width="800" height="5" fill="#b8c0c4"/>');
  // 路線圖
  s.add('<rect x="120" y="86" width="560" height="34" rx="6" fill="#fff" stroke="#b0b8bd"/><path d="M146 103H654" stroke="#d9473f" stroke-width="6"/>' + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${160 + i * 68}" cy="103" r="7" fill="#fff" stroke="#d9473f" stroke-width="3"/>`).join('') + '<circle cx="364" cy="103" r="9" fill="#d9473f"/>');
  // 窗戶（夜景）
  [[60, 150, 250], [550, 150, 250]].forEach(([x, y, w]) => { s.add(`<rect x="${x}" y="${y}" width="${w}" height="190" fill="url(#night)" stroke="#aab2b6" stroke-width="8"/>`); for (let i = 0; i < 14; i++) s.add(`<rect x="${x + 6 + R() * (w - 22)}" y="${y + 70 + R() * 100}" width="${4 + R() * 8}" height="${4 + R() * 6}" fill="#ffd88a" opacity="${0.4 + R() * 0.5}"/>`); s.add(`<path d="M${x} ${y + 190}L${x + w} ${y}" stroke="#fff" opacity="0.07" stroke-width="40"/>`); });
  // 車門
  s.add('<rect x="320" y="140" width="160" height="330" fill="#c3cbcf" stroke="#9aa3a8" stroke-width="4"/><rect x="330" y="150" width="68" height="310" fill="#a9d0e6" opacity="0.7"/><rect x="402" y="150" width="68" height="310" fill="#a9d0e6" opacity="0.7"/><path d="M400 140V470" stroke="#7d868b" stroke-width="4"/>');
  s.add('<rect y="470" width="800" height="130" fill="url(#fl)"/><path d="M0 470H800" stroke="#fff" opacity="0.3" stroke-width="3"/><rect x="316" y="468" width="168" height="8" fill="#f2c94c"/>');
  // 長座椅
  [[0, 330], [480, 320]].forEach(([x, w], i) => { s.add(`<rect x="${x}" y="340" width="${w}" height="26" fill="#b7bec2"/>`); const cols = ['seat', 'seat2', 'seat']; const nn = i === 0 ? 3 : 3; for (let j = 0; j < nn; j++) { const sx = x + 8 + j * ((w - 16) / nn); s.add(`<rect x="${sx}" y="372" width="${(w - 16) / nn - 6}" height="48" rx="8" fill="url(#${j === 1 ? 'seat2' : 'seat'})"/><rect x="${sx}" y="420" width="${(w - 16) / nn - 6}" height="14" fill="#1e2d40" opacity="0.5"/>`); } });
  s.add('<rect y="420" width="800" height="50" fill="#9aa2a6" opacity="0.0"/>');
  // 扶手
  s.add('<rect x="140" y="0" width="12" height="470" fill="url(#pole)"/><rect x="650" y="0" width="12" height="470" fill="url(#pole)"/>');
  s.add(shadow(146, 474, 24, 6, 0.4));
  s.add('<g stroke="#9aa0a4" stroke-width="5" fill="none"><path d="M0 76H800"/></g>');
  for (let i = 0; i < 12; i++) s.add(`<g><path d="M${40 + i * 66} 76V100" stroke="#b5bbbe" stroke-width="3"/><circle cx="${40 + i * 66}" cy="112" r="11" fill="none" stroke="#e8edef" stroke-width="3" opacity="0.95"/></g>`);
  // 人物：站著拿手機的女生
  s.add(person(s, { x: 430, y: 150, h: 430, skin: 'light', hair: '#2a1b14', hairStyle: 'long', top: '#e8e2d4', bottom: '#2f3f5a', pose: 'phone', legs: 'stand', shoe: '#f2f2f2' }));
  // 手機（貼近耳朵）省略，改成她的另一手握扶手
  s.add('<g transform="translate(450 92) rotate(10)"><rect width="14" height="28" rx="3" fill="#1c1c1e"/><rect x="2" y="3" width="10" height="22" fill="#6fa8d8" opacity="0.8"/></g>');
  return s.out();
};

/* 12 夜市 */
out.nightmarket = () => {
  const s = Scene(); const R = rng(12);
  s.def(lin('bg', 0, 0, 0, 1, [[0, '#0e1226'], [1, '#2a1d2e']]));
  s.def(rad('bulb', 0.5, 0.5, 0.5, [[0, '#fff0b8', 1], [0.35, '#ffcf6a', 0.6], [1, '#ffa933', 0]]));
  s.def(lin('stall', 0, 0, 0, 1, [[0, '#6b3d22'], [1, '#43260f']]));
  s.def(lin('awn', 0, 0, 0, 1, [[0, '#d64a3a'], [1, '#a5281e']]));
  s.def(lin('cnt', 0, 0, 0, 1, [[0, '#cfd3d6'], [1, '#8d9498']]));
  s.def(rad('warm', 0.5, 0.45, 0.6, [[0, '#ffb04a', 0.45], [1, '#ffb04a', 0]]));
  s.add('<rect width="800" height="600" fill="url(#bg)"/>');
  // 遠方燈泡散景
  for (let i = 0; i < 34; i++) { const x = R() * 800, y = 20 + R() * 230, r = 10 + R() * 26; s.add(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="url(#bulb)" opacity="${(0.3 + R() * 0.5).toFixed(2)}" filter="url(#b4)"/>`); }
  s.add('<circle cx="400" cy="380" r="330" fill="url(#warm)"/>');
  // 攤位
  s.add('<rect x="70" y="150" width="660" height="380" fill="url(#stall)"/><rect x="70" y="150" width="660" height="22" fill="#ffd98a" opacity="0.35"/>');
  for (let i = 0; i < 11; i++) s.add(`<path d="M${50 + i * 62} 120H${112 + i * 62}L${106 + i * 62} 190Q${81 + i * 62} 208 ${56 + i * 62} 190Z" fill="${i % 2 ? '#fff0d0' : 'url(#awn)'}"/>`);
  s.add('<rect x="40" y="100" width="720" height="26" fill="#8b2418"/>');
  for (let i = 0; i < 18; i++) { const x = 60 + i * 41; s.add(`<path d="M${x} 126V140" stroke="#222"/><circle cx="${x}" cy="150" r="30" fill="url(#bulb)" opacity="0.9"/><circle cx="${x}" cy="150" r="7" fill="#fffbe0"/>`); }
  // 招牌（用簡單文字）
  s.add('<g transform="translate(250 24)"><rect width="300" height="64" rx="8" fill="#b02a1e"/><rect x="6" y="6" width="288" height="52" rx="5" fill="none" stroke="#ffd98a" stroke-width="3"/><text x="150" y="46" font-size="38" font-weight="800" text-anchor="middle" fill="#ffe9a8" font-family="Noto Sans CJK TC, PingFang TC, Microsoft JhengHei, sans-serif">夜市小吃</text></g>');
  // 紅燈籠
  [[70, 70], [730, 70], [160, 80], [640, 80]].forEach(([x, y]) => s.add(`<path d="M${x} 0V${y - 28}" stroke="#333"/><ellipse cx="${x}" cy="${y}" rx="22" ry="28" fill="#d6372b"/><ellipse cx="${x}" cy="${y}" rx="22" ry="28" fill="url(#bulb)" opacity="0.4"/><rect x="${x - 10}" y="${y - 32}" width="20" height="6" fill="#e5b55a"/><rect x="${x - 10}" y="${y + 26}" width="20" height="6" fill="#e5b55a"/><path d="M${x} ${y + 32}v14" stroke="#e5b55a" stroke-width="3"/>`));
  // 店家（老闆）
  s.add(person(s, { x: 400, y: 232, h: 400, skin: 'mid', hair: '#222', hairStyle: 'short', top: '#f4f1ea', bottom: '#333', pose: 'hold', legs: 'none', collar: false }));
  s.add('<path d="M356 262L444 262L462 412L338 412Z" fill="#e9e3d4"/><path d="M372 238L376 262M428 238L424 262" stroke="#c9c0a8" stroke-width="4"/><rect x="372" y="330" width="56" height="34" rx="4" fill="#fff" opacity="0.55"/>');
  // 櫃檯與食物
  s.add('<rect x="70" y="410" width="660" height="30" fill="url(#cnt)"/><rect x="70" y="440" width="660" height="90" fill="#3a2414"/><rect x="70" y="410" width="660" height="6" fill="#fff" opacity="0.4"/>');
  // 鍋子與蒸氣
  s.add('<g><ellipse cx="190" cy="408" rx="86" ry="18" fill="#7a7f83"/><path d="M104 360C108 410 130 424 190 424C250 424 272 410 276 360Z" fill="#9aa0a4"/><ellipse cx="190" cy="360" rx="86" ry="22" fill="#b34a2a"/><ellipse cx="190" cy="360" rx="76" ry="16" fill="#8a3a1e"/><g fill="#6a2f18"><ellipse cx="160" cy="358" rx="16" ry="7"/><ellipse cx="200" cy="362" rx="18" ry="7"/><ellipse cx="230" cy="356" rx="12" ry="5"/></g></g>');
  s.add('<g opacity="0.45" filter="url(#b4)" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"><path d="M160 330Q140 300 168 270Q196 240 170 210"/><path d="M210 330Q232 298 206 268Q184 240 208 214"/></g>');
  [[560, 400], [640, 396], [700, 402]].forEach(([x, y], i) => s.add(`<g><ellipse cx="${x}" cy="${y + 8}" rx="34" ry="10" fill="#ece7da"/><ellipse cx="${x}" cy="${y}" rx="30" ry="14" fill="${['#c9772e', '#d9b34a', '#b5502a'][i]}"/><path d="M${x - 14} ${y - 4}h28" stroke="#fff" opacity="0.3" stroke-width="3"/></g>`));
  s.add('<g transform="translate(540 384)"><rect x="-6" y="-84" width="4" height="70" fill="#d9c08a"/><rect x="22" y="-96" width="4" height="82" fill="#d9c08a"/><rect x="50" y="-80" width="4" height="66" fill="#d9c08a"/></g>');
  // 前景客人剪影
  s.add('<g opacity="0.92"><ellipse cx="60" cy="620" rx="150" ry="200" fill="#0b0c16"/><circle cx="62" cy="388" r="42" fill="#0b0c16"/><ellipse cx="740" cy="640" rx="140" ry="190" fill="#0b0c16"/><circle cx="745" cy="418" r="40" fill="#0b0c16"/></g>');
  s.add('<g opacity="0.25"><ellipse cx="62" cy="388" rx="42" ry="42" fill="url(#bulb)"/></g>');
  return s.out();
};

/* 13 教室 */
out.classroom = () => {
  const s = Scene(); const R = rng(13);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#ece7da'], [1, '#d8d1be']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#b8946a'], [1, '#8d6c47']]));
  s.def(lin('bd', 0, 0, 0, 1, [[0, '#2f5a4a'], [1, '#234639']]));
  s.def(lin('dk', 0, 0, 0, 1, [[0, '#d8b17c'], [1, '#b38a55']]));
  s.def(rad('win', 0.9, 0.2, 1.0, [[0, '#fff9dc', 0.75], [1, '#fff9dc', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="380" width="800" height="220" fill="url(#fl)"/>');
  for (let i = 0; i < 8; i++) s.add(`<path d="M0 ${392 + i * 30}H800" stroke="#4a3320" opacity="0.15" stroke-width="2"/>`);
  // 黑板
  s.add('<rect x="130" y="50" width="540" height="240" rx="6" fill="#8a6a40"/><rect x="142" y="62" width="516" height="216" fill="url(#bd)"/><rect x="142" y="262" width="516" height="16" fill="#a37f4f"/>');
  s.add('<g fill="none" stroke="#f1f1e6" stroke-width="4" stroke-linecap="round" opacity="0.9"><path d="M190 110H330M190 150H300"/><path d="M200 200Q230 170 260 200T320 200"/></g><text x="470" y="150" font-size="68" font-weight="700" text-anchor="middle" fill="#f4f4ea" opacity="0.92" font-family="Noto Sans CJK TC, PingFang TC, Microsoft JhengHei, sans-serif">你好</text><g fill="#fff"><rect x="560" y="256" width="26" height="6" rx="3"/><rect x="600" y="256" width="20" height="6" rx="3" fill="#f4d46a"/></g>');
  s.add('<g opacity="0.12" fill="#fff"><ellipse cx="300" cy="170" rx="120" ry="50"/></g>');
  // 窗戶（右）
  s.add('<rect x="700" y="60" width="100" height="250" fill="#a9d4ee"/><path d="M700 60H800V310H700" fill="none" stroke="#f2eee2" stroke-width="10"/><path d="M750 60V310M700 185H800" stroke="#f2eee2" stroke-width="6"/>');
  // 時鐘
  s.add('<circle cx="400" cy="30" r="22" fill="#fff" stroke="#444" stroke-width="3"/><path d="M400 30V16M400 30L412 36" stroke="#333" stroke-width="3" stroke-linecap="round"/>');
  // 後排桌椅（小）
  [[170, 410], [360, 410], [550, 410]].forEach(([x, y]) => { s.add(`<rect x="${x}" y="${y}" width="120" height="14" fill="url(#dk)"/><rect x="${x + 8}" y="${y + 14}" width="6" height="40" fill="#6a4a2c"/><rect x="${x + 106}" y="${y + 14}" width="6" height="40" fill="#6a4a2c"/><rect x="${x + 30}" y="${y - 40}" width="60" height="34" rx="6" fill="#4a6fa8"/>`); });
  // 主角：女學生
  s.add(shadow(300, 590, 200, 16, 0.35));
  s.add(person(s, { x: 300, y: 260, h: 420, skin: 'light', hair: '#2b1a12', hairStyle: 'ponytail', top: '#ffffff', bottom: '#2a3f6e', pose: 'table', legs: 'none', sleeve: 'short', armCol: '#ffffff' }));
  // 桌子在她前面
  s.add('<path d="M120 420H500L520 450H100Z" fill="#e4c294"/><rect x="100" y="450" width="420" height="26" fill="url(#dk)"/><rect x="120" y="476" width="14" height="100" fill="#6a4a2c"/><rect x="486" y="476" width="14" height="100" fill="#6a4a2c"/>');
  s.add('<g transform="translate(250 396) rotate(-4)"><rect width="110" height="46" rx="3" fill="#f6f3ea"/><path d="M55 0V46" stroke="#c9c2ac" stroke-width="2"/><g stroke="#8a8470" stroke-width="2"><path d="M8 10H48M8 20H44M8 30H46M62 10H102M62 20H98M62 30H100"/></g></g>');
  s.add('<rect x="410" y="414" width="62" height="12" rx="3" fill="#d4423a"/><rect x="415" y="404" width="52" height="10" rx="3" fill="#f2c94c"/>');
  s.add('<rect width="800" height="600" fill="url(#win)"/>');
  return s.out();
};

/* 14 市場買菜 */
out.market = () => {
  const s = Scene(); const R = rng(14);
  s.def(lin('bg', 0, 0, 0, 1, [[0, '#d8dfc9'], [1, '#c9c2a6']]));
  s.def(lin('tbl', 0, 0, 0, 1, [[0, '#9a7a56'], [1, '#6f5339']]));
  s.def(rad('tm', 0.35, 0.3, 0.9, [[0, '#ff7a5a'], [0.6, '#d93c2a'], [1, '#8f1f18']]));
  s.def(rad('cab', 0.35, 0.3, 0.9, [[0, '#d4eba0'], [0.6, '#a5cf6a'], [1, '#6e9a40']]));
  s.def(lin('cr', 0, 0, 0, 1, [[0, '#ff9a3c'], [1, '#d96a12']]));
  s.def(rad('win', 0.5, 0, 1, [[0, '#fff4c8', 0.5], [1, '#fff4c8', 0]]));
  s.add('<rect width="800" height="600" fill="url(#bg)"/>');
  s.add('<g filter="url(#b8)" opacity="0.7"><rect x="0" y="120" width="180" height="300" fill="#b9c8a4"/><rect x="620" y="100" width="180" height="320" fill="#cdbf9a"/></g>');
  for (let i = 0; i < 10; i++) s.add(`<path d="M${i * 80} 0H${i * 80 + 80}L${i * 80 + 70} 90Q${i * 80 + 40} 112 ${i * 80 + 10} 90Z" fill="${i % 2 ? '#fff3d6' : '#3f8a4f'}"/>`);
  s.add('<rect y="0" width="800" height="14" fill="#000" opacity="0.18"/>');
  // 菜攤桌
  s.add('<rect y="380" width="800" height="220" fill="#5c4630"/><rect y="372" width="800" height="12" fill="url(#tbl)"/>');
  const basket = (x, y, w, h) => s.add(`<path d="M${x} ${y}H${x + w}L${x + w - 12} ${y + h}H${x + 12}Z" fill="#c9a06a"/><g stroke="#8a6a3a" opacity="0.7" stroke-width="2"><path d="M${x + 4} ${y + h * 0.3}H${x + w - 4}M${x + 8} ${y + h * 0.6}H${x + w - 8}"/></g><rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="9" rx="3" fill="#a87e48"/>`);
  basket(20, 430, 210, 120); basket(250, 430, 200, 120); basket(470, 430, 210, 120);
  for (let i = 0; i < 12; i++) { const x = 44 + (i % 6) * 32 + (i > 5 ? 14 : 0), y = 428 - Math.floor(i / 6) * 26; s.add(`<circle cx="${x}" cy="${y}" r="20" fill="url(#tm)"/><path d="M${x - 8} ${y - 18}l8 4l8 -4" stroke="#3d7a3a" stroke-width="3" fill="none"/><ellipse cx="${x - 7}" cy="${y - 7}" rx="5" ry="3" fill="#fff" opacity="0.3"/>`); }
  for (let i = 0; i < 7; i++) { const x = 275 + (i % 4) * 44 + (i > 3 ? 20 : 0), y = 426 - Math.floor(i / 4) * 40; s.add(`<ellipse cx="${x}" cy="${y}" rx="26" ry="36" fill="url(#cab)"/><path d="M${x} ${y - 34}V${y + 34}M${x - 12} ${y - 28}Q${x - 10} ${y} ${x - 12} ${y + 28}M${x + 12} ${y - 28}Q${x + 10} ${y} ${x + 12} ${y + 28}" stroke="#88b24f" stroke-width="2" fill="none" opacity="0.8"/>`); }
  for (let i = 0; i < 14; i++) { const x = 490 + i * 14, h = 70 + R() * 30; s.add(`<path d="M${x} ${440}L${x + 4} ${440 + h * 0.4}" stroke="#2e6a30" stroke-width="3"/>`); s.add(`<path d="M${x - 6} 424Q${x + 10} 404 ${x + 24} 424L${x + 12} 520Z" fill="url(#cr)" transform="rotate(${-10 + i * 2} ${x} 470)" opacity="0.95"/>`); }
  s.add('<g transform="translate(500 380)">' + [0, 1, 2, 3, 4].map((i) => `<path d="M${i * 30} 40Q${i * 30 - 4} 0 ${i * 30 + 10} -30Q${i * 30 + 24} 0 ${i * 30 + 20} 40Z" fill="${i % 2 ? '#4e9a3f' : '#3c8a34'}"/>`).join('') + '</g>');
  // 價格牌
  s.add('<g transform="translate(60 340) rotate(-4)"><rect width="90" height="48" rx="3" fill="#fffdf4"/><text x="45" y="36" font-size="26" font-weight="700" text-anchor="middle" fill="#c0392b" font-family="sans-serif">$20</text></g>');
  // 顧客：提袋子的女士（在攤位前面，站在桌後視角→桌前）
  s.add(person(s, { x: 420, y: 140, h: 520, skin: 'mid', hair: '#3a2a22', hairStyle: 'bun', top: '#d9786a', bottom: '#3d4a5c', pose: 'hold', legs: 'stand', shoe: '#444', collar: false }));
  s.add('<g transform="translate(470 285)"><path d="M0 0H76L68 96H8Z" fill="#e8dcc0"/><path d="M14 0Q38 -34 62 0" stroke="#8a7a58" stroke-width="5" fill="none"/><path d="M8 40H68" stroke="#c9b98f" stroke-width="3"/></g>');
  // 把桌子畫在人物前面一部分
  s.add('<rect y="458" width="800" height="142" fill="#5c4630"/><rect y="452" width="800" height="10" fill="url(#tbl)"/>');
  s.add('<rect width="800" height="600" fill="url(#win)"/>');
  return s.out();
};

/* 15 火鍋聚餐 */
out.hotpot = () => {
  const s = Scene(); const R = rng(15);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#5a3426'], [1, '#3a2218']]));
  s.def(lin('tb', 0, 0, 0, 1, [[0, '#c79a66'], [1, '#8d6238']]));
  s.def(rad('lamp', 0.5, 0.0, 1, [[0, '#ffd98a', 0.7], [1, '#ffd98a', 0]]));
  s.def(rad('pot', 0.5, 0.4, 0.7, [[0, '#d63a28'], [1, '#8a1f14']]));
  s.def(rad('br', 0.5, 0.4, 0.7, [[0, '#f4e6b4'], [1, '#d8c079']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<g fill="#ffd98a" opacity="0.9" filter="url(#b4)">' + [100, 250, 400, 550, 700].map((x) => `<circle cx="${x}" cy="60" r="14"/>`).join('') + '</g><rect width="800" height="600" fill="url(#lamp)"/>');
  s.add('<g opacity="0.5"><rect x="40" y="110" width="140" height="130" fill="#d9c8a0"/><rect x="620" y="110" width="140" height="130" fill="#d9c8a0"/></g>');
  // 三個朋友（桌後）
  s.add(person(s, { x: 180, y: 230, h: 420, skin: 'light', hair: '#222', hairStyle: 'short', top: '#4a86c2', bottom: '#333', pose: 'table', legs: 'none', glasses: true }));
  s.add(person(s, { x: 400, y: 210, h: 440, skin: 'mid', hair: '#3a261c', hairStyle: 'long', top: '#e8b6c0', bottom: '#333', pose: 'table', legs: 'none' }));
  s.add(person(s, { x: 620, y: 230, h: 420, skin: 'tan', hair: '#1c1410', hairStyle: 'short', top: '#7aa86a', bottom: '#333', pose: 'table', legs: 'none', sleeve: 'short' }));
  // 桌子
  s.add(shadow(400, 590, 380, 14, 0.4));
  s.add('<path d="M20 400H780L840 600H-40Z" fill="url(#tb)"/><path d="M20 400H780" stroke="#e6c699" stroke-width="3"/><g stroke="#6a4624" opacity="0.18"><path d="M-10 470H810M-30 530H830"/></g>');
  // 火鍋
  s.add(shadow(400, 500, 210, 40, 0.4));
  s.add('<ellipse cx="400" cy="470" rx="205" ry="70" fill="#34302c"/><ellipse cx="400" cy="462" rx="190" ry="62" fill="#4a4540"/><ellipse cx="400" cy="460" rx="172" ry="52" fill="#2b2824"/><path d="M400 408V512" stroke="#4a4540" stroke-width="8"/><ellipse cx="318" cy="460" rx="80" ry="44" fill="url(#pot)" transform="rotate(0)"/><ellipse cx="484" cy="460" rx="80" ry="44" fill="url(#br)"/>');
  [[300, 452], [340, 468], [310, 478], [270, 462]].forEach(([x, y]) => s.add(`<circle cx="${x}" cy="${y}" r="6" fill="#e8c06a" opacity="0.8"/>`));
  [[470, 448], [500, 470], [525, 450], [452, 474]].forEach(([x, y]) => s.add(`<ellipse cx="${x}" cy="${y}" rx="13" ry="7" fill="#7aa850"/>`));
  s.add('<g opacity="0.5" filter="url(#b8)" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round"><path d="M330 400Q300 340 340 290Q380 240 340 190"/><path d="M470 400Q500 340 460 290Q420 240 470 190"/></g>');
  // 盤子：肉、菜
  const plate = (x, y, kind) => { s.add(`<ellipse cx="${x}" cy="${y + 10}" rx="76" ry="22" fill="#000" opacity="0.25" filter="url(#b2)"/><ellipse cx="${x}" cy="${y}" rx="72" ry="24" fill="#f4f1e8"/><ellipse cx="${x}" cy="${y - 2}" rx="58" ry="17" fill="#e5e1d4"/>`); if (kind === 'meat') for (let i = 0; i < 6; i++) s.add(`<ellipse cx="${x - 40 + i * 16}" cy="${y - 4 + (i % 2) * 4}" rx="16" ry="7" fill="${i % 2 ? '#d85a6a' : '#e88a96'}"/><path d="M${x - 48 + i * 16} ${y - 4 + (i % 2) * 4}h22" stroke="#fff" opacity="0.5"/>`); else for (let i = 0; i < 7; i++) s.add(`<ellipse cx="${x - 40 + i * 13}" cy="${y - 6 + (i % 2) * 4}" rx="11" ry="9" fill="${['#6aa84a', '#8bc060', '#4f9a3f'][i % 3]}"/>`); };
  plate(100, 540, 'meat'); plate(700, 540, 'veg'); plate(400, 565, 'meat');
  s.add('<g transform="rotate(-8 600 515)"><rect x="560" y="510" width="120" height="5" fill="#a65a35"/><rect x="560" y="522" width="120" height="5" fill="#b96a40"/></g>');
  [[230, 530], [560, 548]].forEach(([x, y]) => s.add(`<ellipse cx="${x}" cy="${y}" rx="24" ry="9" fill="#e9e5d8"/><path d="M${x - 22} ${y - 2}C${x - 20} ${y + 16} ${x + 20} ${y + 16} ${x + 22} ${y - 2}Z" fill="#f4f1e8"/>`));
  return s.out();
};

/* 16 跑步 */
out.jogger = () => {
  const s = Scene(); const R = rng(16);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#9fd0ee'], [1, '#f6efd8']]));
  s.def(lin('grass', 0, 0, 0, 1, [[0, '#7bb356'], [1, '#4a8a3a']]));
  s.def(lin('trk', 0, 0, 0, 1, [[0, '#c9694a'], [1, '#a34d33']]));
  s.def(rad('leaf', 0.35, 0.3, 0.9, [[0, '#8cc25a'], [0.6, '#4f8f35'], [1, '#2e6224']]));
  s.def(rad('sun', 0.15, 0.1, 0.8, [[0, '#fff2c0', 0.9], [1, '#fff2c0', 0]]));
  s.def(lin('tr', 0, 0, 1, 0, [[0, '#4a3322'], [0.5, '#7a5a3d'], [1, '#3b281a']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="120" cy="80" r="260" fill="url(#sun)"/>');
  s.add('<g filter="url(#b4)" opacity="0.9"><ellipse cx="80" cy="300" rx="120" ry="100" fill="#7fb06a"/><ellipse cx="300" cy="320" rx="130" ry="80" fill="#8cbc78"/><ellipse cx="560" cy="310" rx="140" ry="90" fill="#78a864"/><ellipse cx="760" cy="300" rx="120" ry="100" fill="#86b472"/></g>');
  s.add('<rect y="360" width="800" height="240" fill="url(#grass)"/>');
  s.add('<path d="M0 470Q300 440 800 470V600H0Z" fill="url(#trk)"/><path d="M0 470Q300 440 800 470" stroke="#e8a08a" stroke-width="3" fill="none" opacity="0.6"/><path d="M0 540Q300 515 800 540" stroke="#fff" stroke-width="4" opacity="0.7" stroke-dasharray="40 30" fill="none"/>');
  // 左右大樹
  [[60, 1], [740, -1]].forEach(([x, d]) => { s.add(`<path d="M${x - 20} 460Q${x - 10} 300 ${x - 16} 190L${x + 22} 190Q${x + 16} 320 ${x + 30} 460Z" fill="url(#tr)"/>`); [[-40, 120, 90], [30, 90, 100], [60, 170, 80], [-20, 190, 80]].forEach(([dx, dy, r]) => s.add(`<circle cx="${x + dx}" cy="${dy}" r="${r}" fill="url(#leaf)"/>`)); });
  // 跑者
  s.add(person(s, { x: 400, y: 150, h: 400, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#e8573e', bottom: '#2f3a52', pose: 'runA', legs: 'run', sleeve: 'short', shoe: '#f4f4f4', collar: false }));
  s.add('<path d="M305 420Q285 428 260 424M300 450Q272 462 244 456" stroke="#fff" stroke-width="3" opacity="0.5" stroke-linecap="round"/>');
  return s.out();
};

/* 17 客廳看電視 */
out.livingroom = () => {
  const s = Scene(); const R = rng(17);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#d9d2c3'], [1, '#c2b9a5']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#a07850'], [1, '#6f5030']]));
  s.def(lin('sofa', 0, 0, 0, 1, [[0, '#6c8a8d'], [1, '#476467']]));
  s.def(lin('rug', 0, 0, 0, 1, [[0, '#c9b08a'], [1, '#a98f68']]));
  s.def(lin('tv', 0, 0, 1, 1, [[0, '#2a6fa8'], [0.5, '#5aa8d8'], [1, '#e8a84a']]));
  s.def(rad('tvg', 0.5, 0.5, 0.6, [[0, '#7fc0f0', 0.4], [1, '#7fc0f0', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="420" width="800" height="180" fill="url(#fl)"/><rect y="414" width="800" height="10" fill="#f1ede3"/>');
  s.add('<ellipse cx="400" cy="540" rx="340" ry="48" fill="url(#rug)"/>');
  // 電視
  s.add('<rect x="250" y="70" width="300" height="180" rx="8" fill="#161616"/><rect x="258" y="78" width="284" height="164" fill="url(#tv)"/><path d="M258 200Q330 160 400 200T542 190V242H258Z" fill="#1f5a3a" opacity="0.7"/><circle cx="480" cy="120" r="18" fill="#fff3b0" opacity="0.9"/><path d="M258 78L542 242" stroke="#fff" opacity="0.07" stroke-width="40"/>');
  s.add('<circle cx="400" cy="160" r="260" fill="url(#tvg)" filter="url(#b16)"/>');
  s.add('<rect x="200" y="250" width="400" height="14" fill="#8a6a46"/><rect x="215" y="264" width="370" height="120" fill="#5a3f28"/><rect x="230" y="276" width="170" height="96" fill="#2e2016" opacity="0.6"/><rect x="415" y="276" width="170" height="96" fill="#2e2016" opacity="0.6"/>');
  // 植物
  s.add('<g transform="translate(110 300)"><path d="M0 100H60L52 170H8Z" fill="#b6683f"/><g fill="#3f8a45"><ellipse cx="30" cy="40" rx="14" ry="50"/><ellipse cx="6" cy="60" rx="12" ry="44" transform="rotate(-30 6 60)"/><ellipse cx="54" cy="60" rx="12" ry="44" transform="rotate(30 54 60)"/></g></g>');
  s.add('<g transform="translate(640 70)"><rect width="100" height="130" fill="#6a4a2c"/><rect x="8" y="8" width="84" height="114" fill="#a9d1e8"/><path d="M8 122L50 70L92 122Z" fill="#6f9a84"/></g>');
  // 沙發與人
  s.add(shadow(400, 590, 330, 18, 0.4));
  s.add('<rect x="110" y="380" width="580" height="170" rx="26" fill="url(#sofa)"/><rect x="110" y="380" width="580" height="30" rx="14" fill="#7f9c9f"/>');
  s.add(person(s, { x: 400, y: 335, h: 330, skin: 'light', hair: '#3a2a22', hairStyle: 'short', top: '#d9a53c', bottom: '#4a5568', pose: 'sit', legs: 'sit', sleeve: 'long', shoe: '#e9e4d6' }));
  s.add('<rect x="110" y="480" width="580" height="90" rx="22" fill="url(#sofa)" opacity="0"/>');
  s.add('<rect x="110" y="410" width="110" height="130" rx="30" fill="#5a7a7e"/><rect x="580" y="410" width="110" height="130" rx="30" fill="#4f6e72"/><rect x="110" y="410" width="110" height="20" rx="10" fill="#7f9c9f" opacity="0.7"/><rect x="580" y="410" width="110" height="20" rx="10" fill="#7f9c9f" opacity="0.7"/>');
  s.add('<g transform="translate(432 392) rotate(-10)"><rect width="14" height="32" rx="5" fill="#222"/><g fill="#999"><circle cx="11" cy="10" r="3"/><circle cx="11" cy="22" r="3"/><circle cx="11" cy="34" r="3"/></g></g>');
  s.add('<g transform="translate(240 500)"><rect width="100" height="14" rx="3" fill="#8a6a46"/><rect x="10" y="14" width="6" height="40" fill="#6a4a2c"/><rect x="84" y="14" width="6" height="40" fill="#6a4a2c"/><ellipse cx="30" cy="-6" rx="20" ry="8" fill="#f2efe6"/><path d="M12 -6Q30 14 48 -6Z" fill="#fff"/></g>');
  return s.out();
};

/* 18 打電話（窗邊夜景） */
out.phonecall = () => {
  const s = Scene(); const R = rng(18);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#2b2f5a'], [0.6, '#d9784a'], [1, '#f2c27a']]));
  s.def(lin('fr', 0, 0, 0, 1, [[0, '#4a3a2e'], [1, '#2e231b']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#6f5640'], [1, '#4a3828']]));
  s.def(rad('sun', 0.5, 0.5, 0.5, [[0, '#ffe3a6', 0.9], [1, '#ffe3a6', 0]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="560" cy="360" r="190" fill="url(#sun)"/><circle cx="560" cy="360" r="40" fill="#ffe9b8"/>');
  s.add('<g filter="url(#b4)" opacity="0.9"><ellipse cx="180" cy="220" rx="140" ry="18" fill="#f2a080"/><ellipse cx="300" cy="170" rx="100" ry="12" fill="#e88a78"/></g>');
  // 城市剪影
  const bl = [[0, 330, 70], [60, 280, 60], [110, 340, 80], [190, 250, 70], [250, 320, 60], [300, 270, 90], [380, 340, 70], [440, 300, 80], [520, 250, 60], [570, 330, 90], [650, 270, 70], [710, 320, 90]];
  s.add('<g fill="#2a2440">' + bl.map(([x, y, w]) => `<rect x="${x}" y="${y + 20}" width="${w}" height="${380 - y}"/>`).join('') + '</g>');
  s.add('<g fill="#ffd88a">' + bl.map(([x, y, w]) => { let t = ''; for (let i = 0; i < 9; i++) if (R() < 0.55) t += `<rect x="${x + 6 + (i % 3) * ((w - 12) / 3)}" y="${y + 34 + Math.floor(i / 3) * 24}" width="8" height="10" opacity="${(0.5 + R() * 0.5).toFixed(2)}"/>`; return t; }).join('') + '</g>');
  // 窗框
  s.add('<path d="M60 40H740V560H60Z" fill="none" stroke="url(#fr)" stroke-width="26"/><path d="M400 40V560M60 300H740" stroke="#3a2c22" stroke-width="12"/><rect x="40" y="540" width="720" height="22" fill="#5a4636"/>');
  s.add('<path d="M70 50L330 290" stroke="#fff" opacity="0.06" stroke-width="40"/>');
  s.add('<rect y="560" width="800" height="40" fill="url(#fl)"/>');
  // 人物（背光，站在窗前）
  s.add(person(s, { x: 250, y: 150, h: 500, skin: 'mid', hair: '#1e1510', hairStyle: 'short', top: '#4f6a8f', bottom: '#2c3140', pose: 'phone', legs: 'stand', sleeve: 'long', shoe: '#3a2a22', glasses: true }));
  s.add('<g transform="translate(280 88) rotate(12)"><rect width="14" height="30" rx="3" fill="#18181a"/><rect x="2" y="3" width="10" height="24" fill="#ffd9a0" opacity="0.9"/></g>');
  // 窗邊植物
  s.add('<g transform="translate(600 440)"><path d="M0 60H70L62 120H8Z" fill="#6a4330"/><g fill="#2f5a3a"><ellipse cx="35" cy="0" rx="16" ry="58"/><ellipse cx="10" cy="14" rx="14" ry="48" transform="rotate(-28 10 14)"/><ellipse cx="60" cy="14" rx="14" ry="48" transform="rotate(28 60 14)"/></g></g>');
  return s.out();
};

/* 19 包餃子 */
out.dumpling = () => {
  const s = Scene(); const R = rng(19);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#e8dec7'], [1, '#d7c9a8']]));
  s.def(lin('tbl', 0, 0, 0, 1, [[0, '#d2a874'], [1, '#a47a46']]));
  s.def(lin('dw', 0, 0, 0, 1, [[0, '#fffdf4'], [1, '#ece4cf']]));
  s.def(rad('win', 0.1, 0.0, 1.1, [[0, '#fff8d8', 0.6], [1, '#fff8d8', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><g opacity="0.7"><rect x="520" y="60" width="220" height="170" fill="#bfe0ef"/><path d="M520 60H740V230H520Z" fill="none" stroke="#f4efe2" stroke-width="10"/><path d="M630 60V230M520 145H740" stroke="#f4efe2" stroke-width="6"/></g>');
  s.add('<g transform="translate(40 90)"><rect width="150" height="12" fill="#8a6a46"/><g fill="#d9a58a"><path d="M10 12H70L64 70H16Z"/></g><g fill="#a9c47a"><path d="M86 12H140L134 60H92Z"/></g></g>');
  // 人物：媽媽與女兒（桌後）
  s.add(person(s, { x: 250, y: 262, h: 470, skin: 'light', hair: '#2a1b14', hairStyle: 'bun', top: '#c9524a', bottom: '#333', pose: 'table', legs: 'none', sleeve: 'long' }));
  s.add(person(s, { x: 520, y: 302, h: 360, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#f2c14e', bottom: '#333', pose: 'table', legs: 'none', sleeve: 'short' }));
  // 桌子
  s.add(shadow(400, 600, 400, 12, 0.3));
  s.add('<path d="M0 410H800V600H0Z" fill="url(#tbl)"/><path d="M0 410H800" stroke="#ecd0a0" stroke-width="4"/><g stroke="#6f4d26" opacity="0.15"><path d="M0 470H800M0 540H800"/></g>');
  // 麵粉痕跡
  s.add('<g fill="#fff" opacity="0.55" filter="url(#b2)"><ellipse cx="260" cy="470" rx="150" ry="36"/><ellipse cx="560" cy="500" rx="120" ry="30"/></g>');
  // 擀好的麵皮
  [[190, 480], [250, 468], [310, 484], [230, 520], [290, 520]].forEach(([x, y]) => s.add(`<ellipse cx="${x}" cy="${y}" rx="32" ry="12" fill="url(#dw)" stroke="#d9cfb4"/>`));
  // 餃子（排在盤子上）
  s.add('<ellipse cx="590" cy="520" rx="170" ry="52" fill="#f2efe6"/><ellipse cx="590" cy="516" rx="152" ry="42" fill="#e8e3d4"/>');
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) { const x = 482 + c * 38 + r * 18, y = 502 + r * 26; s.add(`<g><path d="M${x - 17} ${y + 6}C${x - 17} ${y - 20} ${x + 17} ${y - 20} ${x + 17} ${y + 6}Z" fill="url(#dw)" stroke="#d6cbb0"/><path d="M${x - 14} ${y + 2}C${x - 8} ${y - 10} ${x + 8} ${y - 10} ${x + 14} ${y + 2}" stroke="#d6cbb0" stroke-width="1.5" fill="none" stroke-dasharray="3 2"/></g>`); }
  // 餡料碗
  s.add('<ellipse cx="410" cy="500" rx="60" ry="20" fill="#e9e1d1"/><path d="M350 496C356 540 380 548 410 548C440 548 464 540 470 496Z" fill="#f4efe3"/><ellipse cx="410" cy="496" rx="54" ry="16" fill="#9a6a3a"/><g fill="#6aa84a" opacity="0.9"><circle cx="390" cy="494" r="4"/><circle cx="416" cy="498" r="4"/><circle cx="430" cy="492" r="3"/></g>');
  // 擀麵棍
  s.add('<g transform="rotate(-10 150 440)"><rect x="60" y="430" width="170" height="16" rx="8" fill="#c9a06a"/><rect x="30" y="434" width="40" height="8" rx="4" fill="#a67c48"/><rect x="220" y="434" width="40" height="8" rx="4" fill="#a67c48"/></g>');
  s.add('<rect width="800" height="600" fill="url(#win)"/>');
  return s.out();
};

/* 20 機場 */
out.airport = () => {
  const s = Scene(); const R = rng(20);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#7fbce8'], [1, '#d9eef6']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#d8d6d0'], [1, '#a9a7a0']]));
  s.def(lin('ceil', 0, 0, 0, 1, [[0, '#f4f4f2'], [1, '#e1e1de']]));
  s.def(lin('pl', 0, 0, 0, 1, [[0, '#ffffff'], [1, '#cfd6dc']]));
  s.def(lin('sc', 0, 0, 1, 1, [[0, '#d95a4a'], [1, '#9c2e22']]));
  s.add('<rect width="800" height="600" fill="url(#ceil)"/>');
  // 大窗與飛機
  s.add('<rect x="40" y="90" width="720" height="300" fill="url(#sky)"/>');
  s.add('<g filter="url(#b8)" opacity="0.9"><ellipse cx="160" cy="150" rx="100" ry="20" fill="#fff"/><ellipse cx="600" cy="130" rx="110" ry="16" fill="#fff"/></g>');
  s.add('<rect x="40" y="320" width="720" height="70" fill="#a9aba6"/><rect x="40" y="340" width="720" height="4" fill="#f2c94c" opacity="0.8"/>');
  s.add('<g transform="translate(330 220)"><path d="M0 70C0 40 30 30 110 30L320 36C360 38 380 52 372 62C360 78 310 80 260 80L40 84C14 84 0 80 0 70Z" fill="url(#pl)"/><path d="M130 30L190 -30L222 -30L196 34Z" fill="#d6dde3"/><path d="M230 36L300 -12L318 -12L290 38Z" fill="#cdd5dc"/><path d="M340 36L372 -20L384 -16L368 44Z" fill="#e24a3c"/><g fill="#5f6f7d"><circle cx="60" cy="52" r="5"/><circle cx="86" cy="52" r="5"/><circle cx="112" cy="52" r="5"/><circle cx="138" cy="52" r="5"/><circle cx="164" cy="52" r="5"/><circle cx="190" cy="52" r="5"/><circle cx="216" cy="52" r="5"/><circle cx="242" cy="52" r="5"/></g><path d="M0 68H372" stroke="#b9c2ca" stroke-width="3" opacity="0.8"/><path d="M6 62Q40 44 100 40" stroke="#4a86c2" stroke-width="6" fill="none"/><ellipse cx="170" cy="86" rx="26" ry="12" fill="#8a949c"/><circle cx="60" cy="100" r="8" fill="#333"/></g>');
  s.add('<path d="M40 90H760V390H40Z" fill="none" stroke="#c9cdd0" stroke-width="12"/>');
  for (let i = 1; i < 5; i++) s.add(`<path d="M${40 + i * 144} 90V390" stroke="#c9cdd0" stroke-width="8"/>`);
  s.add('<path d="M100 90L330 390" stroke="#fff" opacity="0.08" stroke-width="60"/>');
  // 出發看板
  s.add('<rect x="250" y="20" width="300" height="56" rx="6" fill="#161a26"/><text x="400" y="58" font-size="30" font-weight="700" text-anchor="middle" fill="#ffd45a" font-family="sans-serif">GATE 12 · 14:30</text>');
  // 地板
  s.add('<rect y="390" width="800" height="210" fill="url(#fl)"/><g stroke="#8a8780" opacity="0.4"><path d="M0 460H800M0 540H800"/><path d="M130 390L30 600M300 390L250 600M470 390L470 600M640 390L690 600"/></g>');
  s.add('<ellipse cx="400" cy="470" rx="280" ry="40" fill="#fff" opacity="0.18" filter="url(#b8)"/>');
  // 長椅
  s.add('<g transform="translate(560 420)"><rect width="190" height="14" rx="4" fill="#4a5a6e"/><rect y="-34" width="190" height="30" rx="6" fill="#5a6c82"/><rect x="14" y="14" width="8" height="46" fill="#7a8591"/><rect x="168" y="14" width="8" height="46" fill="#7a8591"/></g>');
  // 人物與行李箱
  s.add(shadow(300, 595, 90, 10, 0.3));
  s.add('<g transform="translate(390 440)">' + shadow(40, 150, 56, 9, 0.35) + '<rect x="-4" y="-40" width="12" height="46" fill="#333"/><rect x="0" y="0" width="86" height="150" rx="16" fill="url(#sc)"/><g fill="#7a1f16" opacity="0.5"><rect x="14" y="10" width="8" height="130" rx="4"/><rect x="38" y="10" width="8" height="130" rx="4"/><rect x="62" y="10" width="8" height="130" rx="4"/></g><rect x="0" y="0" width="22" height="150" rx="14" fill="#fff" opacity="0.14"/><circle cx="16" cy="152" r="6" fill="#222"/><circle cx="70" cy="152" r="6" fill="#222"/></g>');
  s.add(person(s, { x: 300, y: 215, h: 390, skin: 'light', hair: '#2a1b14', hairStyle: 'long', top: '#f0e6d0', bottom: '#3d5a80', pose: 'hold', legs: 'stand', shoe: '#f7f7f7' }));
  s.add('<g transform="translate(290 345) rotate(-8)"><rect width="46" height="22" rx="3" fill="#fff"/><rect width="46" height="6" fill="#4a86c2"/><path d="M4 12H34M4 17H28" stroke="#888" stroke-width="2"/></g>');
  return s.out();
};

module.exports = out;
