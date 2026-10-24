const { rng, lin, rad, Scene, shadow, person, shade } = require('./lib');
const out = {};
const T = (x, y, size, t, fill = '#fff', w = 700, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" text-anchor="middle" fill="${fill}" ${extra.includes('font-family') ? '' : 'font-family="sans-serif"'} ${extra}>${t}</text>`;
const RC = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;

/* G1 電影院 */
out.cinema = () => {
  const s = Scene(); const R = rng(61);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#2a1826'], [1, '#5c2d38']]));
  s.def(lin('floor', 0, 0, 0, 1, [[0, '#3c2433'], [1, '#1d1120']]));
  s.def(lin('ctr', 0, 0, 0, 1, [[0, '#8a5632'], [1, '#4d2d19']]));
  s.def(lin('mach', 0, 0, 1, 0, [[0, '#b3322c'], [0.5, '#d9473d'], [1, '#8f241f']]));
  s.def(rad('glow', 0.5, 0.5, 0.5, [[0, '#ffd88a', 0.55], [1, '#ffd88a', 0]]));
  s.def(lin('pop', 0, 0, 0, 1, [[0, '#fff2c0'], [1, '#f2c46a']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<rect y="395" width="800" height="205" fill="url(#floor)"/><rect y="388" width="800" height="9" fill="#2a1822"/>');
  // 地毯花紋
  for (let r = 0; r < 5; r++) for (let q = 0; q < 14; q++) { const x = q * 64 + (r % 2) * 32 - 10, y = 420 + r * 42; s.add(`<path d="M${x} ${y}l16 -10l16 10l-16 10z" fill="#c9a24a" opacity="0.14"/>`); }
  // 天花板燈
  s.add('<rect width="800" height="26" fill="#150c14"/>');
  for (let i = 0; i < 9; i++) s.add(`<circle cx="${50 + i * 92}" cy="26" r="40" fill="url(#glow)"/><circle cx="${50 + i * 92}" cy="14" r="5" fill="#ffe7b0"/>`);
  // 招牌
  s.add('<rect x="285" y="28" width="230" height="52" rx="10" fill="#150c14" stroke="#e5b84a" stroke-width="3"/>');
  s.add(T(400, 69, 38, '電影院', '#f6cf62', 800, 'letter-spacing="8" filter="url(#b2)" opacity="0.7"') + T(400, 69, 38, '電影院', '#ffe9a6', 800, 'letter-spacing="8"'));
  // 海報
  const poster = (x, k) => {
    const y = 88, w = 100, h = 124;
    s.add(`<rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" fill="#e5b84a" opacity="0.18" filter="url(#b4)"/><rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" fill="#1a1018"/>`);
    const g = `pg${k}`;
    const cols = [['#3a6aa8', '#f2c25a'], ['#16213f', '#3a5a9a'], ['#e07a4a', '#f6d68a'], ['#2f7a6a', '#a8d6a0'], ['#6a3a8a', '#f09ab0'], ['#2a5a8a', '#b8dcf0']][k];
    s.def(lin(g, 0, 0, 0, 1, [[0, cols[0]], [1, cols[1]]]));
    s.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${g})"/>`);
    if (k === 0) s.add(`<circle cx="${x + 70}" cy="${y + 38}" r="16" fill="#fff3c0"/><path d="M${x} ${y + 120}L${x + 35} ${y + 62}L${x + 62} ${y + 100}L${x + 82} ${y + 74}L${x + 100} ${y + 120}V${y + 140}H${x}Z" fill="#1d3a5a"/>`);
    if (k === 1) s.add(`<circle cx="${x + 50}" cy="${y + 44}" r="22" fill="#f8f0d0"/><circle cx="${x + 58}" cy="${y + 38}" r="20" fill="#16213f"/><path d="M${x} ${y + 100}Q${x + 25} ${y + 90} ${x + 50} ${y + 100}T${x + 100} ${y + 100}V${y + 140}H${x}Z" fill="#0b1226"/>`);
    if (k === 2) s.add(`<ellipse cx="${x + 50}" cy="${y + 56}" rx="26" ry="32" fill="#d9362b"/><path d="M${x + 36} ${y + 84}L${x + 64} ${y + 84}L${x + 58} ${y + 100}H${x + 42}Z" fill="#7a4a2a"/><path d="M${x} ${y + 128}Q${x + 50} ${y + 112} ${x + 100} ${y + 128}V${y + 140}H${x}Z" fill="#8a4a2a"/>`);
    if (k === 3) s.add(`<path d="M${x + 50} ${y + 20}L${x + 78} ${y + 90}H${x + 22}Z" fill="#1f5a3a"/><path d="M${x + 50} ${y + 50}L${x + 86} ${y + 120}H${x + 14}Z" fill="#2a7a4a"/><rect x="${x + 46}" y="${y + 120}" width="8" height="16" fill="#5a3a1a"/>`);
    if (k === 4) s.add(`<path d="M${x + 50} ${y + 90}C${x + 10} ${y + 60} ${x + 20} ${y + 28} ${x + 50} ${y + 52}C${x + 80} ${y + 28} ${x + 90} ${y + 60} ${x + 50} ${y + 90}Z" fill="#e8546a"/>`);
    if (k === 5) s.add(`<path d="M${x + 20} ${y + 110}Q${x + 50} ${y + 50} ${x + 80} ${y + 110}Z" fill="#fff"/><path d="M${x + 50} ${y + 50}V${y + 110}" stroke="#555" stroke-width="3"/><path d="M${x} ${y + 116}Q${x + 25} ${y + 106} ${x + 50} ${y + 116}T${x + 100} ${y + 116}V${y + 140}H${x}Z" fill="#1d4a7a"/>`);
    s.add(`<rect x="${x}" y="${y + 98}" width="${w}" height="26" fill="#000" opacity="0.28"/>`);
    s.add(T(x + 50, y + 117, 14, ['山海', '夜曲', '熱氣球', '森林', '愛情', '冒險'][k], '#fff', 700));
  };
  for (let i = 0; i < 6; i++) poster(30 + i * 126, i);
  // 售票口招牌
  s.add('<rect x="28" y="244" width="170" height="40" rx="6" fill="#150c14" stroke="#e5b84a" stroke-width="2"/>');
  s.add(T(113, 274, 28, '售票口', '#ffe9a6', 700, 'letter-spacing="6"'));
  // 櫃台後的工作人員
  s.add(person(s, { x: 290, y: 276, h: 300, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#a93644', bottom: '#222', pose: 'table', legs: 'none' }));
  s.add('<path d="M280 280L290 304L300 280" fill="#fff" opacity="0.9"/>');
  // 售票櫃台
  s.add(shadow(215, 478, 200, 12, 0.5));
  s.add('<rect x="20" y="348" width="390" height="124" fill="url(#ctr)"/><rect x="14" y="336" width="402" height="16" rx="3" fill="#b07a48"/><rect x="14" y="336" width="402" height="4" fill="#fff" opacity="0.25"/>');
  s.add('<rect x="40" y="372" width="350" height="70" rx="4" fill="#2a1810"/><path d="M40 410H390" stroke="#e5b84a" stroke-width="2" opacity="0.7"/>');
  s.add(T(215, 402, 30, '今日電影', '#ffe9a6', 700, 'letter-spacing="4"'));
  s.add(T(215, 432, 14, '10:30   13:20   16:10   19:00   21:40', '#f6cf62', 600));
  // 電影票
  const ticket = (x, y, r) => `<g transform="rotate(${r} ${x} ${y})"><rect x="${x - 34}" y="${y - 15}" width="68" height="30" rx="3" fill="#f2d28a"/><path d="M${x + 14} ${y - 15}V${y + 15}" stroke="#a8742a" stroke-width="1.5" stroke-dasharray="3 3"/>${T(x - 10, y + 5, 12, '電影票', '#7a2a2a', 700)}</g>`;
  s.add(ticket(150, 336, -6) + ticket(205, 340, 5));
  // 飲料
  const cup = (x, y, col) => `<path d="M${x - 14} ${y - 50}H${x + 14}L${x + 10} ${y}H${x - 10}Z" fill="${col}"/><rect x="${x - 16}" y="${y - 56}" width="32" height="8" rx="3" fill="#f4f4f0"/><path d="M${x + 2} ${y - 56}L${x + 8} ${y - 78}" stroke="#fff" stroke-width="3"/><path d="M${x - 11} ${y - 30}H${x + 11}" stroke="#fff" stroke-width="5" opacity="0.5"/>`;
  s.add(cup(350, 336, '#d9473d') + cup(385, 336, '#3a7ac8'));
  // 爆米花機
  s.add(shadow(630, 478, 105, 11, 0.5));
  s.add('<rect x="540" y="360" width="180" height="112" fill="url(#mach)"/><rect x="540" y="360" width="180" height="6" fill="#fff" opacity="0.3"/><rect x="556" y="384" width="148" height="12" fill="#fff3d0"/><rect x="556" y="418" width="148" height="34" rx="4" fill="#5a1a18"/>');
  s.add('<rect x="552" y="244" width="156" height="118" rx="4" fill="#fff4d8" opacity="0.28" stroke="#f4f4f0" stroke-width="5"/>');
  s.add('<rect x="552" y="244" width="156" height="118" fill="url(#glow)" opacity="0.9"/>');
  for (let i = 0; i < 70; i++) { const px = 560 + R() * 140, py = 290 + R() * 68; if (py < 296 + Math.abs(px - 630) * 0.25 - 4) continue; s.add(`<circle cx="${px.toFixed(0)}" cy="${py.toFixed(0)}" r="${(6 + R() * 5).toFixed(1)}" fill="url(#pop)"/>`); }
  for (let i = 0; i < 12; i++) s.add(`<circle cx="${(570 + R() * 120).toFixed(0)}" cy="${(256 + R() * 30).toFixed(0)}" r="5" fill="#fff4cc" opacity="0.8"/>`);
  s.add('<path d="M540 230H720L704 248H556Z" fill="#c33a32"/><rect x="540" y="214" width="180" height="22" fill="#e04a40"/>');
  s.add(T(630, 232, 18, '爆米花', '#fff', 800, 'letter-spacing="3"'));
  // 顧客A：拿爆米花
  s.add(person(s, { x: 470, y: 315, h: 300, skin: 'mid', hair: '#1a120e', hairStyle: 'long', top: '#4a9a9a', bottom: '#2f3a52', pose: 'hold', legs: 'stand', shoe: '#f0f0f0' }));
  s.add('<g transform="translate(470 392)"><path d="M-26 -26L26 -26L20 36H-20Z" fill="#fff"/><path d="M-22 -26L-14 -26L-10 36H-16Z M2 -26L10 -26L10 36H4Z M16 -26L22 -26L18 36H14Z" fill="#d9362b"/><circle cx="-14" cy="-32" r="10" fill="#fbe6a0"/><circle cx="2" cy="-38" r="11" fill="#fff2c0"/><circle cx="16" cy="-32" r="10" fill="#f6d680"/><circle cx="-4" cy="-30" r="9" fill="#f9e9b0"/></g>');
  // 顧客B：拿電影票
  s.add(person(s, { x: 722, y: 322, h: 290, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#d9a23a', bottom: '#33394a', pose: 'phone', legs: 'stand', sleeve: 'short', glasses: true }));
  s.add(ticket(768, 286, -14));
  // 前景欄杆
  s.add('<g stroke="#e5b84a" stroke-width="5" stroke-linecap="round"><path d="M10 560V590M110 560V590"/></g><path d="M10 566Q60 580 110 566" stroke="#a82a2a" stroke-width="7" fill="none"/>');
  return s.out();
};

/* G2 銀行 */
out.bank = () => {
  const s = Scene(); const R = rng(62);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#e6e0d0'], [1, '#cfc8b4']]));
  s.def(lin('floor', 0, 0, 0, 1, [[0, '#d9d2c2'], [1, '#aaa38f']]));
  s.def(lin('ctr', 0, 0, 0, 1, [[0, '#8a6a46'], [1, '#5a432a']]));
  s.def(lin('glass', 0, 0, 1, 1, [[0, '#cfe8f2', 0.55], [0.5, '#e8f5fa', 0.25], [1, '#bcdcea', 0.5]]));
  s.def(lin('atm', 0, 0, 1, 0, [[0, '#6d8a8c'], [0.5, '#9bb6b6'], [1, '#587274']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<rect y="395" width="800" height="205" fill="url(#floor)"/>');
  s.add('<g stroke="#8d8672" stroke-width="2" opacity="0.4"><path d="M0 470H800M0 540H800"/><path d="M120 395L40 600M300 395L260 600M480 395L480 600M660 395L720 600"/></g>');
  s.add('<rect y="388" width="800" height="9" fill="#6b5a40"/>');
  // 天花板
  s.add('<rect width="800" height="30" fill="#f4f1e8"/>');
  for (let i = 0; i < 8; i++) s.add(`<rect x="${30 + i * 100}" y="8" width="60" height="9" rx="3" fill="#fff" stroke="#c9c2b0"/>`);
  // 銀行招牌
  s.add('<rect x="20" y="44" width="180" height="62" rx="8" fill="#1d4a4a"/><rect x="24" y="48" width="172" height="54" rx="6" fill="none" stroke="#e5c36a" stroke-width="2"/>');
  s.add('<circle cx="62" cy="75" r="18" fill="none" stroke="#e5c36a" stroke-width="3"/>' + T(62, 83, 22, '$', '#e5c36a', 800));
  s.add(T(142, 90, 38, '銀行', '#fff', 800, 'letter-spacing="4"'));
  // 叫號螢幕
  s.add('<rect x="250" y="44" width="300" height="86" rx="6" fill="#16191c" stroke="#555" stroke-width="4"/>');
  s.add(T(330, 100, 52, 'A023', '#ff5a3c', 800, 'font-family="monospace"'));
  s.add('<path d="M440 56V118" stroke="#444" stroke-width="2"/>');
  s.add(T(495, 82, 20, '請到', '#ffcf5a', 700) + T(495, 108, 26, '2號窗口', '#ffcf5a', 800));
  // 後牆的畫與盆栽
  s.add('<rect x="590" y="64" width="110" height="80" fill="#8fb0c4" stroke="#6b5a40" stroke-width="6"/><path d="M596 138L630 100L660 128L680 110L694 138Z" fill="#4a7a5a"/>');
  // 窗口櫃台
  const win = (x, n) => {
    s.add(`<rect x="${x}" y="200" width="170" height="14" fill="#1d4a4a"/>` + T(x + 85, 212, 12, n + '號窗口', '#fff', 700));
    s.add(`<rect x="${x}" y="214" width="170" height="124" fill="#f0ede2"/>`);
  };
  win(10, 1); win(190, 2); win(370, 3);
  // 後方電腦與文件架
  s.add('<rect x="30" y="236" width="130" height="60" rx="3" fill="#1e2a33"/><rect x="36" y="242" width="118" height="48" fill="#46688a"/><rect x="374" y="236" width="52" height="40" rx="3" fill="#222"/><rect x="380" y="242" width="40" height="28" fill="#5a85a8"/><rect x="396" y="276" width="8" height="30" fill="#333"/>');
  s.add(T(560, 296, 1, '', '#000'));
  // 行員（第2窗口）
  s.add(person(s, { x: 275, y: 262, h: 280, skin: 'light', hair: '#2a1b14', hairStyle: 'bun', top: '#27406a', bottom: '#222', pose: 'table', legs: 'none', glasses: true }));
  s.add('<path d="M264 264Q275 286 286 264L284 276L275 298L266 276Z" fill="#c9423a"/>');
  // 玻璃隔板
  s.add('<rect x="10" y="214" width="530" height="124" fill="url(#glass)"/><path d="M60 214L30 338M240 214L210 338M420 214L390 338" stroke="#fff" stroke-width="10" opacity="0.18"/>');
  s.add('<g stroke="#9aa8ad" stroke-width="5"><path d="M10 214V338M180 214V338M360 214V338M540 214V338"/></g>');
  // 櫃台檯面
  s.add(shadow(280, 470, 270, 11, 0.4));
  s.add('<rect x="0" y="338" width="552" height="132" fill="url(#ctr)"/><rect x="-4" y="330" width="560" height="16" fill="#b79062"/><rect x="-4" y="330" width="560" height="4" fill="#fff" opacity="0.3"/>');
  s.add('<path d="M20 380H530M20 430H530" stroke="#3a2a18" stroke-width="2" opacity="0.5"/>');
  // 窗口小槽、存摺與鈔票
  s.add('<rect x="240" y="324" width="70" height="8" rx="3" fill="#2a2a2a"/>');
  s.add('<g transform="rotate(-6 262 318)"><rect x="236" y="300" width="42" height="28" rx="2" fill="#1f3f7a"/><rect x="236" y="300" width="42" height="28" rx="2" fill="none" stroke="#e5c36a" stroke-width="1.5"/>' + T(257, 319, 12, '存摺', '#f4e6b0', 700) + '</g>');
  const bill = (x, y, r, c) => `<g transform="rotate(${r} ${x} ${y})"><rect x="${x - 26}" y="${y - 12}" width="52" height="24" rx="2" fill="${c}"/><rect x="${x - 22}" y="${y - 8}" width="44" height="16" fill="none" stroke="#fff" stroke-width="1" opacity="0.7"/><circle cx="${x}" cy="${y}" r="6" fill="#fff" opacity="0.6"/></g>`;
  s.add(bill(330, 324, 3, '#d9736a') + bill(334, 318, -4, '#d9736a') + bill(338, 311, 2, '#e2837a'));
  s.add('<rect x="316" y="306" width="46" height="8" fill="#e8c36a" opacity="0.9"/>');
  s.add(T(338, 320, 1, '', '#000'));
  s.add(bill(440, 324, -3, '#6aa0d6') + bill(444, 317, 4, '#6aa0d6'));
  // 提款機
  s.add(shadow(695, 476, 100, 10, 0.45));
  s.add('<rect x="600" y="196" width="190" height="276" rx="8" fill="url(#atm)"/><rect x="608" y="204" width="174" height="30" rx="4" fill="#1d4a4a"/>');
  s.add(T(695, 227, 22, '提款機', '#fff', 800, 'letter-spacing="3"'));
  s.add('<rect x="624" y="246" width="142" height="86" rx="5" fill="#16303f"/><rect x="630" y="252" width="130" height="74" rx="3" fill="#4fa0c8"/>');
  s.add(T(695, 278, 16, '請插入金融卡', '#fff', 700) + '<rect x="650" y="292" width="90" height="22" rx="4" fill="#fff" opacity="0.85"/>' + T(695, 308, 14, '1  2  3  確認', '#1d4a4a', 700));
  for (let r = 0; r < 4; r++) for (let q = 0; q < 3; q++) s.add(`<rect x="${640 + q * 24}" y="${344 + r * 18}" width="20" height="14" rx="2" fill="#e6ebea" stroke="#6a7a7a"/>`);
  s.add('<rect x="722" y="344" width="46" height="26" rx="3" fill="#222"/><rect x="726" y="352" width="38" height="5" fill="#f0c020"/><rect x="722" y="384" width="46" height="46" rx="4" fill="#2a3a3a"/><rect x="728" y="392" width="34" height="8" rx="2" fill="#111"/><path d="M730 400H760V412H730Z" fill="#e8c8c0"/>');
  // 顧客1（前景左）
  s.add(person(s, { x: 95, y: 282, h: 330, skin: 'light', hair: '#c9c9c9', hairStyle: 'bun', top: '#b0507a', bottom: '#3a3f4a', pose: 'hold', legs: 'stand', shoe: '#5a3a2a', glasses: true }));
  s.add('<g transform="rotate(-8 100 330)"><rect x="82" y="316" width="36" height="26" rx="2" fill="#1f3f7a"/>' + T(100, 334, 11, '存摺', '#f4e6b0', 700) + '</g>');
  // 顧客2（持號碼牌）
  s.add(person(s, { x: 565, y: 296, h: 300, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#e4e0d2', bottom: '#2a3350', pose: 'phone', legs: 'stand', sleeve: 'short' }));
  s.add('<g transform="rotate(-10 590 252)"><rect x="574" y="238" width="38" height="28" rx="2" fill="#fff" stroke="#999"/>' + T(593, 258, 13, 'A024', '#d9362b', 800) + '</g>');
  // 號碼牌機
  s.add('<rect x="440" y="396" width="14" height="76" fill="#5a6a6a"/><rect x="420" y="372" width="54" height="34" rx="5" fill="#2f6a6a"/><rect x="428" y="378" width="38" height="8" fill="#fff" opacity="0.8"/>' + T(447, 400, 11, '取號', '#fff', 700));
  return s.out();
};

/* G3 加油站 */
out.gasstation = () => {
  const s = Scene(); const R = rng(63);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#8cc4ea'], [1, '#f2ead2']]));
  s.def(lin('conc', 0, 0, 0, 1, [[0, '#bdbab0'], [1, '#8f8c82']]));
  s.def(lin('roof', 0, 0, 0, 1, [[0, '#f2f0ea'], [1, '#c8c6be']]));
  s.def(lin('car', 0, 0, 0, 1, [[0, '#e5584a'], [1, '#a82e28']]));
  s.def(lin('pump', 0, 0, 1, 0, [[0, '#e9eceb'], [0.6, '#fff'], [1, '#bcc4c2']]));
  s.def(lin('win', 0, 0, 0, 1, [[0, '#a8d4ea'], [1, '#6a9ab8']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<g filter="url(#b8)" opacity="0.85"><ellipse cx="600" cy="150" rx="120" ry="22" fill="#fff"/><ellipse cx="160" cy="180" rx="90" ry="16" fill="#fff"/></g>');
  // 遠景大樓與樹
  [[0, 250, 90, '#cdbfa2'], [95, 230, 80, '#b6c3c8'], [180, 262, 100, '#d8c9aa'], [520, 240, 90, '#b8c4ca'], [615, 255, 70, '#d9cbac'], [690, 235, 110, '#c6b99c']].forEach(([x, y, w, c]) => s.add(`<rect x="${x}" y="${y}" width="${w}" height="${380 - y}" fill="${c}" opacity="0.9"/>` + `<g fill="#6f8fa6" opacity="0.7">${[0, 1, 2].map((r) => [0, 1, 2].map((q) => `<rect x="${x + 10 + q * 26}" y="${y + 14 + r * 24}" width="16" height="14"/>`).join('')).join('')}</g>`));
  s.add('<g filter="url(#b2)"><ellipse cx="300" cy="372" rx="90" ry="40" fill="#5a8a48"/><ellipse cx="470" cy="376" rx="70" ry="32" fill="#4f8040"/></g>');
  // 地面
  s.add('<rect y="370" width="800" height="230" fill="#6e7276"/><rect y="400" width="800" height="200" fill="url(#conc)"/>');
  s.add('<path d="M0 392H800" stroke="#e8c33a" stroke-width="5"/><g stroke="#fff" stroke-width="3" opacity="0.6"><path d="M0 540H800"/></g>');
  s.add('<path d="M0 586Q400 570 800 586" stroke="#fff" stroke-width="3" opacity="0.4" fill="none"/>');
  // 遮雨棚
  s.add('<rect x="-10" y="20" width="820" height="86" fill="url(#roof)"/><rect x="-10" y="60" width="820" height="12" fill="#e8913a"/><rect x="-10" y="100" width="820" height="12" fill="#8c8a82"/>');
  s.add('<rect x="-10" y="112" width="820" height="28" fill="#6f6d66" opacity="0.5"/>');
  s.add('<rect x="250" y="26" width="300" height="30" rx="4" fill="#2a4a3a"/>' + T(400, 51, 26, '加油站', '#fff', 800, 'letter-spacing="8"'));
  s.add(T(400, 94, 20, '營業中', '#a83a2a', 700, 'letter-spacing="6"'));
  // 柱子與價目牌
  s.add('<rect x="24" y="112" width="34" height="360" fill="#e0ded6"/><rect x="24" y="112" width="8" height="360" fill="#fff" opacity="0.6"/><rect x="766" y="112" width="30" height="360" fill="#e0ded6"/>');
  s.add('<rect x="8" y="140" width="68" height="132" rx="5" fill="#1b2326" stroke="#8a8a80" stroke-width="3"/>');
  s.add(T(42, 164, 15, '95', '#fff', 700) + T(42, 188, 20, '32.5', '#ffcf3a', 800, 'font-family="monospace"') + '<path d="M16 198H68" stroke="#555"/>' + T(42, 220, 15, '98', '#fff', 700) + T(42, 244, 20, '34.5', '#ffcf3a', 800, 'font-family="monospace"') + T(42, 264, 11, '元／公升', '#bbb', 600));
  // 汽車（朝左，在群組裡縮放）
  s.add(shadow(300, 486, 250, 14, 0.5));
  s.add('<g transform="translate(60 40) scale(0.9)">');
  s.add('<path d="M40 410L40 360Q42 335 80 330L150 318Q175 262 235 250L355 250Q410 252 430 318L455 326Q472 335 470 370L470 410Z" fill="url(#car)"/>');
  s.add('<path d="M178 318Q196 272 238 268L295 268V318Z M305 268L352 268Q388 272 405 318L305 318Z" fill="url(#win)"/>');
  s.add('<defs><clipPath id="wclip"><path d="M178 318Q196 272 238 268L295 268V318Z"/></clipPath></defs>');
  s.add('<g clip-path="url(#wclip)">' + person(s, { x: 238, y: 296, h: 150, skin: 'light', hair: '#2a1b14', hairStyle: 'long', top: '#f2c14e', pose: 'wave', legs: 'none', collar: false }) + '</g>');
  s.add('<path d="M178 318Q196 272 238 268L295 268V318Z M305 268L352 268Q388 272 405 318L305 318Z" fill="#fff" opacity="0.12"/>');
  s.add('<path d="M300 268V320" stroke="#7a1c18" stroke-width="10"/><path d="M40 372H470" stroke="#000" stroke-width="2" opacity="0.2"/><path d="M360 335H395" stroke="#7a1c18" stroke-width="5" stroke-linecap="round"/>');
  s.add('<rect x="40" y="380" width="430" height="36" fill="#6a1c18" opacity="0.5"/><rect x="40" y="396" width="430" height="14" fill="#2a2a2e"/>');
  s.add('<path d="M40 340L66 338L66 360L40 362Z" fill="#fff3b0"/><path d="M458 336L470 340V362L458 360Z" fill="#c82a22"/>');
  s.add('<circle cx="432" cy="338" r="11" fill="#c0c0c0" stroke="#7a1c18" stroke-width="2"/>');
  [[130], [390]].forEach(([x]) => s.add(`<circle cx="${x}" cy="414" r="46" fill="#1a1a1c"/><circle cx="${x}" cy="414" r="36" fill="#2b2b2e"/><circle cx="${x}" cy="414" r="22" fill="#cfcfcf"/><circle cx="${x}" cy="414" r="8" fill="#888"/><path d="M${x} 392V436M${x - 22} 414H${x + 22}" stroke="#999" stroke-width="3"/>`));
  s.add('</g>');
  // 加油機
  s.add(shadow(700, 508, 80, 10, 0.5));
  s.add('<rect x="650" y="486" width="100" height="22" fill="#f0c020"/><rect x="650" y="486" width="100" height="22" fill="url(#pump)" opacity="0.25"/>');
  s.add('<rect x="660" y="218" width="80" height="272" rx="6" fill="url(#pump)" stroke="#9aa09e" stroke-width="2"/><rect x="654" y="206" width="92" height="22" rx="5" fill="#2a4a3a"/>');
  s.add('<rect x="672" y="244" width="56" height="48" rx="4" fill="#15191b"/>' + T(700, 266, 24, '32.5', '#ff4a3a', 800, 'font-family="monospace"') + T(700, 285, 12, '95無鉛', '#8fd0a0', 700));
  s.add('<rect x="672" y="304" width="56" height="28" rx="4" fill="#2a4a3a"/>' + T(700, 325, 20, '95', '#fff', 800));
  s.add('<rect x="672" y="344" width="56" height="60" rx="4" fill="#d9dedd"/><path d="M672 380H728" stroke="#9aa09e"/>');
  s.add('<rect x="660" y="420" width="80" height="40" fill="#e0e4e3"/><path d="M660 460H740" stroke="#9aa09e"/>');
  s.add('<rect x="650" y="350" width="14" height="70" rx="5" fill="#333"/><rect x="646" y="344" width="22" height="12" rx="4" fill="#555"/>');
  // 油管（機器到手）
  s.add('<path d="M664 402Q640 500 590 430Q560 396 556 340" stroke="#222" stroke-width="9" fill="none" stroke-linecap="round"/>');
  // 加油員
  s.add(person(s, { x: 575, y: 262, h: 330, skin: 'mid', hair: '#1a120e', hairStyle: 'short', top: '#e8a43a', bottom: '#2a3350', pose: 'hold', legs: 'stand', sleeve: 'short', shoe: '#3a3a3a' }));
  s.add('<path d="M545 270L545 460M605 270L605 460" stroke="#fff" stroke-width="0" />');
  s.add('<rect x="556" y="270" width="38" height="14" fill="#fff" opacity="0.55"/>');
  // 油槍：從手到汽車油箱
  s.add('<path d="M562 334L505 346" stroke="#222" stroke-width="9" stroke-linecap="round"/><path d="M505 346L452 346" stroke="#999" stroke-width="6" stroke-linecap="round"/><rect x="558" y="324" width="22" height="22" rx="5" fill="#d9362b"/>');
  return s.out();
};

/* G4 健身房 */
out.gym = () => {
  const s = Scene(); const R = rng(64);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#eceae4'], [1, '#d6d4cc']]));
  s.def(lin('floor', 0, 0, 0, 1, [[0, '#3a3f44'], [1, '#22262a']]));
  s.def(lin('mir', 0, 0, 1, 1, [[0, '#dcecf4'], [0.5, '#f4fafc'], [1, '#c4dcea']]));
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#9fd0f0'], [1, '#e9f3f6']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<rect y="410" width="800" height="190" fill="url(#floor)"/><rect y="404" width="800" height="8" fill="#e8913a"/>');
  s.add('<g stroke="#fff" stroke-width="2" opacity="0.07"><path d="M0 470H800M0 540H800M200 410L80 600M400 410L380 600M600 410L680 600"/></g>');
  s.add('<rect y="70" width="800" height="12" fill="#e8913a" opacity="0.9"/>');
  // 鏡子牆
  s.add('<rect x="20" y="96" width="500" height="294" fill="url(#mir)" stroke="#9aa6aa" stroke-width="6"/>');
  s.add('<path d="M80 96L20 260V96Z M230 96L90 390H20L160 96Z M420 96L330 390H280L370 96Z" fill="#fff" opacity="0.35"/>');
  s.add('<g opacity="0.22"><rect x="360" y="300" width="130" height="90" fill="#555"/><circle cx="410" cy="330" r="10" fill="#d9362b"/><circle cx="440" cy="330" r="10" fill="#3a7ac8"/><circle cx="470" cy="330" r="10" fill="#d9362b"/></g>');
  s.add('<path d="M170 390V96M340 390V96" stroke="#9aa6aa" stroke-width="3"/>');
  // 窗
  s.add('<rect x="560" y="96" width="220" height="200" fill="url(#sky)" stroke="#9aa6aa" stroke-width="7"/><path d="M670 96V296M560 196H780" stroke="#9aa6aa" stroke-width="5"/>');
  s.add('<g fill="#9fb8bb" opacity="0.6"><rect x="570" y="230" width="40" height="66"/><rect x="620" y="210" width="34" height="86"/><rect x="690" y="240" width="50" height="56"/></g>');
  s.add('<rect x="590" y="14" width="190" height="46" rx="8" fill="#2f3a40"/>' + T(685, 48, 32, '健身房', '#fff', 800, 'letter-spacing="6"'));
  s.add(T(130, 58, 26, '今天運動了嗎？', '#e8913a', 700, 'letter-spacing="3"'));
  // 跑步機（側面）
  s.add(shadow(235, 520, 160, 12, 0.5));
  s.add('<path d="M70 500H345L360 524H56Z" fill="#2b3036"/><path d="M80 490H340V506H80Z" fill="#14171a"/><path d="M80 490H340" stroke="#555" stroke-width="3"/><path d="M90 498H335" stroke="#444" stroke-width="2" stroke-dasharray="14 10"/>');
  s.add('<path d="M320 506L352 380L366 384L338 506Z" fill="#59616a"/><rect x="318" y="356" width="76" height="34" rx="8" fill="#2b3036" transform="rotate(-8 356 372)"/><rect x="326" y="360" width="56" height="20" rx="3" fill="#6fd09a" transform="rotate(-8 356 372)"/><path d="M296 408Q330 352 366 370" stroke="#59616a" stroke-width="8" fill="none" stroke-linecap="round"/>');
  s.add(person(s, { x: 205, y: 232, h: 300, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#e8546a', bottom: '#2a2f3a', pose: 'runA', legs: 'run', sleeve: 'short', shoe: '#f4f4f0' }));
  // 啞鈴架
  s.add(shadow(690, 468, 100, 9, 0.45));
  s.add('<rect x="590" y="350" width="190" height="14" fill="#3b4148"/><rect x="590" y="410" width="190" height="14" fill="#3b4148"/><rect x="598" y="364" width="12" height="104" fill="#3b4148"/><rect x="760" y="364" width="12" height="104" fill="#3b4148"/>');
  const db = (x, y, c) => `<rect x="${x}" y="${y - 3}" width="26" height="6" fill="#aaa"/><rect x="${x - 8}" y="${y - 12}" width="10" height="24" rx="3" fill="${c}"/><rect x="${x + 24}" y="${y - 12}" width="10" height="24" rx="3" fill="${c}"/>`;
  for (let i = 0; i < 4; i++) s.add(db(618 + i * 38, 343, ['#3a7ac8', '#d9362b', '#333', '#e8913a'][i]) + db(618 + i * 38, 403, ['#333', '#e8913a', '#3a7ac8', '#d9362b'][i]));
  // 第二個人（拿啞鈴）
  s.add(person(s, { x: 535, y: 258, h: 330, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#3a7ac8', bottom: '#222', pose: 'hold', legs: 'stand', sleeve: 'short', shoe: '#e8e8e8' }));
  s.add('<g transform="translate(535 335)"><rect x="-44" y="-3" width="88" height="7" rx="3" fill="#bbb"/><rect x="-54" y="-14" width="14" height="28" rx="4" fill="#d9362b"/><rect x="40" y="-14" width="14" height="28" rx="4" fill="#d9362b"/><rect x="-62" y="-9" width="9" height="18" rx="3" fill="#a82a22"/><rect x="53" y="-9" width="9" height="18" rx="3" fill="#a82a22"/></g>');
  // 前景：長凳、毛巾、水壺、瑜珈墊、健身球
  s.add(shadow(410, 580, 70, 8, 0.4));
  s.add('<rect x="350" y="540" width="120" height="22" rx="6" fill="#2b3036"/><rect x="360" y="560" width="10" height="26" fill="#444"/><rect x="450" y="560" width="10" height="26" fill="#444"/>');
  s.add('<path d="M360 540Q380 516 410 520Q430 522 440 540Z" fill="#f4f6f8"/><path d="M366 532H430" stroke="#6aa0d6" stroke-width="5"/>');
  s.add('<rect x="446" y="500" width="22" height="42" rx="7" fill="#4f9ad6"/><rect x="450" y="492" width="14" height="10" rx="3" fill="#fff"/>');
  s.add(shadow(100, 572, 90, 9, 0.45));
  s.add('<rect x="30" y="540" width="150" height="34" rx="17" fill="#6ab0a0"/><ellipse cx="30" cy="557" rx="9" ry="17" fill="#8dcbbc"/><ellipse cx="30" cy="557" rx="4" ry="9" fill="#4f9486"/><path d="M50 546H170" stroke="#fff" stroke-width="3" opacity="0.3"/>');
  s.add(shadow(715, 590, 50, 7, 0.4));
  s.add('<circle cx="715" cy="540" r="46" fill="#d8736a"/><ellipse cx="702" cy="522" rx="16" ry="10" fill="#fff" opacity="0.3"/>');
  return s.out();
};

/* G5 火車站 */
out.trainstation = () => {
  const s = Scene(); const R = rng(65);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#8fc6ea'], [1, '#eef0e0']]));
  s.def(lin('plat', 0, 0, 0, 1, [[0, '#cfc9ba'], [1, '#9f9a8a']]));
  s.def(lin('train', 0, 0, 0, 1, [[0, '#f4f6f6'], [1, '#bfc8cb']]));
  s.def(lin('roof', 0, 0, 0, 1, [[0, '#5a6066'], [1, '#2f3438']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<g filter="url(#b8)" opacity="0.8"><ellipse cx="620" cy="120" rx="130" ry="20" fill="#fff"/></g>');
  s.add('<g filter="url(#b2)"><ellipse cx="120" cy="300" rx="160" ry="50" fill="#6e9a5a"/><ellipse cx="700" cy="296" rx="150" ry="46" fill="#5f8c50"/></g>');
  // 火車
  s.add('<rect x="0" y="176" width="800" height="226" fill="url(#train)"/><rect x="0" y="176" width="800" height="8" fill="#9aa4a8"/>');
  s.add('<rect x="0" y="300" width="800" height="22" fill="#2a6ab0"/><rect x="0" y="324" width="800" height="5" fill="#e8913a"/><rect x="0" y="380" width="800" height="22" fill="#4a5258"/>');
  for (let i = 0; i < 6; i++) { const x = 20 + i * 134; s.add(`<rect x="${x}" y="206" width="96" height="82" rx="6" fill="#4a6a82"/><rect x="${x + 4}" y="210" width="88" height="74" rx="4" fill="#9ccbe4" opacity="0.8"/><path d="M${x + 4} 284L${x + 40} 210H${x + 58}L${x + 22} 284Z" fill="#fff" opacity="0.3"/>`); }
  s.add('<rect x="252" y="196" width="80" height="196" fill="#d6dcde" stroke="#7a868a" stroke-width="4"/><path d="M292 196V392" stroke="#7a868a" stroke-width="4"/><rect x="262" y="210" width="20" height="60" fill="#9ccbe4"/><rect x="302" y="210" width="20" height="60" fill="#9ccbe4"/>');
  s.add('<rect x="520" y="196" width="80" height="196" fill="#d6dcde" stroke="#7a868a" stroke-width="4"/><path d="M560 196V392" stroke="#7a868a" stroke-width="4"/><rect x="530" y="210" width="20" height="60" fill="#9ccbe4"/><rect x="570" y="210" width="20" height="60" fill="#9ccbe4"/>');
  // 乘客（車窗內）
  s.add('<circle cx="68" cy="248" r="14" fill="#e0b08a"/><path d="M50 284Q68 260 86 284Z" fill="#5a7aa0"/><circle cx="604" cy="250" r="0" fill="none"/>');
  s.add('<circle cx="438" cy="246" r="14" fill="#c99a74"/><path d="M420 284Q438 258 456 284Z" fill="#c9605a"/>');
  s.add('<rect x="30" y="180" width="70" height="14" rx="2" fill="#16191c"/>' + T(65, 192, 11, '台北  普通車', '#ffcf5a', 700));
  // 鐵軌
  s.add('<rect y="402" width="800" height="52" fill="#6f6a60"/>');
  s.add('<g stroke="#4a3a2a" stroke-width="7" opacity="0.8">' + Array.from({ length: 22 }, (_, i) => `<path d="M${i * 40 - 10} 410L${i * 40 - 20} 450"/>`).join('') + '</g>');
  s.add('<path d="M0 420H800M0 440H800" stroke="#bfc4c6" stroke-width="4"/>');
  [60, 190, 360, 450, 600, 730].forEach((x) => s.add(`<circle cx="${x}" cy="398" r="20" fill="#2a2d30"/><circle cx="${x}" cy="398" r="9" fill="#777"/>`));
  // 月台
  s.add('<rect y="454" width="800" height="146" fill="url(#plat)"/><rect y="454" width="800" height="12" fill="#e8c33a"/><rect y="466" width="800" height="3" fill="#000" opacity="0.2"/>');
  s.add('<g fill="#d8b830" opacity="0.85">' + Array.from({ length: 40 }, (_, i) => `<rect x="${i * 22 - 6}" y="470" width="14" height="6" rx="2"/>`).join('') + '</g>');
  s.add('<g stroke="#8a8474" stroke-width="2" opacity="0.5"><path d="M0 540H800M0 580H800"/><path d="M130 470V600M330 470V600M530 470V600M730 470V600"/></g>');
  // 屋頂
  s.add('<rect x="-10" y="0" width="820" height="78" fill="url(#roof)"/><rect x="-10" y="68" width="820" height="12" fill="#e8913a"/>');
  for (let i = 0; i < 6; i++) s.add(`<rect x="${60 + i * 130}" y="22" width="60" height="9" rx="3" fill="#fff6d0"/>`);
  // 柱子、時鐘、月台牌
  s.add('<rect x="396" y="80" width="14" height="440" fill="#4a5258"/><rect x="396" y="80" width="5" height="440" fill="#fff" opacity="0.2"/>');
  s.add('<circle cx="403" cy="112" r="30" fill="#fff" stroke="#2a2d30" stroke-width="5"/><path d="M403 112V92M403 112L418 120" stroke="#222" stroke-width="3" stroke-linecap="round"/><g fill="#222"><circle cx="403" cy="86" r="2"/><circle cx="403" cy="138" r="2"/><circle cx="377" cy="112" r="2"/><circle cx="429" cy="112" r="2"/></g>');
  s.add('<rect x="352" y="150" width="104" height="34" rx="5" fill="#2a6ab0"/>' + T(404, 175, 20, '第2月台', '#fff', 700));
  // 時刻表
  s.add('<rect x="34" y="96" width="196" height="132" rx="6" fill="#16191c" stroke="#5a6066" stroke-width="5"/>');
  s.add(T(70, 118, 13, '車次', '#9fd0f0', 700) + T(130, 118, 13, '時間', '#9fd0f0', 700) + T(190, 118, 13, '目的地', '#9fd0f0', 700));
  [['123', '10:30', '台北'], ['125', '10:45', '台中'], ['127', '11:00', '高雄'], ['129', '11:20', '花蓮']].forEach((r, i) => s.add(T(70, 144 + i * 26, 15, r[0], '#ffcf5a', 700, 'font-family="monospace"') + T(130, 144 + i * 26, 15, r[1], '#ffcf5a', 700, 'font-family="monospace"') + T(190, 144 + i * 26, 15, r[2], '#ffcf5a', 700)));
  s.add('<rect x="76" y="228" width="12" height="240" fill="#4a5258"/><rect x="176" y="228" width="12" height="240" fill="#4a5258"/>');
  // 旅客：女士和行李箱
  s.add(person(s, { x: 285, y: 292, h: 320, skin: 'light', hair: '#2a1b14', hairStyle: 'long', top: '#f2a65a', bottom: '#3a4a6a', pose: 'hold', legs: 'stand', shoe: '#f0f0f0' }));
  s.add('<g transform="rotate(-6 288 340)"><rect x="262" y="334" width="46" height="30" rx="2" fill="#fff"/><rect x="262" y="334" width="46" height="9" fill="#2a6ab0"/>' + T(285, 360, 14, '車票', '#222', 700) + '</g>');
  s.add(shadow(360, 560, 40, 7, 0.4));
  s.add('<rect x="336" y="480" width="64" height="82" rx="8" fill="#2f7a8a"/><rect x="342" y="486" width="52" height="70" rx="5" fill="none" stroke="#fff" stroke-width="2" opacity="0.4"/><path d="M356 480V462H380V480" stroke="#444" stroke-width="5" fill="none"/><circle cx="346" cy="566" r="5" fill="#222"/><circle cx="390" cy="566" r="5" fill="#222"/>');
  s.add('<path d="M368 482V430" stroke="#888" stroke-width="5"/><rect x="354" y="420" width="28" height="12" rx="4" fill="#333"/>');
  // 長椅與坐著的男子
  s.add(shadow(640, 548, 120, 9, 0.4));
  s.add('<rect x="540" y="452" width="200" height="10" rx="3" fill="#5a4630"/><rect x="540" y="472" width="200" height="14" rx="3" fill="#7a6040"/><rect x="552" y="486" width="10" height="62" fill="#333"/><rect x="718" y="486" width="10" height="62" fill="#333"/>');
  s.add(person(s, { x: 640, y: 332, h: 290, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#6b8f4a', bottom: '#33394a', pose: 'phone', legs: 'sit', sleeve: 'short', shoe: '#3a2a22' }));
  s.add('<rect x="696" y="470" width="42" height="52" rx="8" fill="#c9604a"/><rect x="704" y="486" width="26" height="14" rx="3" fill="#a8442f"/>');
  return s.out();
};

/* G6 辦公室 */
out.office = () => {
  const s = Scene(); const R = rng(66);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#eef0ee'], [1, '#d9dedb']]));
  s.def(lin('floor', 0, 0, 0, 1, [[0, '#8a8f94'], [1, '#5f6469']]));
  s.def(lin('desk', 0, 0, 0, 1, [[0, '#c8a070'], [1, '#97704a']]));
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#9fcdee'], [1, '#e9f2f2']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<rect y="400" width="800" height="200" fill="url(#floor)"/><rect y="394" width="800" height="8" fill="#bfc4c6"/>');
  s.add('<g stroke="#fff" stroke-width="2" opacity="0.1"><path d="M0 470H800M0 540H800M150 400L60 600M400 400L400 600M650 400L740 600"/></g>');
  s.add('<rect width="800" height="24" fill="#f6f6f2"/>' + [0, 1, 2, 3, 4].map((i) => `<rect x="${50 + i * 160}" y="6" width="90" height="9" rx="3" fill="#fff" stroke="#cfd3d0"/>`).join(''));
  // 大窗：城市景
  s.add('<rect x="30" y="50" width="330" height="250" fill="url(#sky)" stroke="#8a9296" stroke-width="8"/>');
  s.add('<g fill="#8fa4b0">' + [[40, 170, 50, 130], [96, 130, 60, 170], [162, 190, 46, 110], [214, 110, 64, 190], [284, 160, 70, 140]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('') + '</g>');
  s.add('<g fill="#d8e8f0" opacity="0.7">' + [[104, 142], [128, 142], [104, 170], [128, 170], [224, 124], [250, 124], [224, 152], [250, 152], [224, 180], [250, 180], [294, 176], [324, 176], [294, 204], [324, 204]].map(([x, y]) => `<rect x="${x}" y="${y}" width="14" height="16"/>`).join('') + '</g>');
  s.add('<path d="M195 50V300M30 175H360" stroke="#8a9296" stroke-width="6"/><path d="M60 50L30 300M180 50L120 300" stroke="#fff" stroke-width="14" opacity="0.18"/>');
  // 白板
  s.add('<rect x="430" y="60" width="300" height="196" rx="4" fill="#fafafa" stroke="#9aa0a4" stroke-width="8"/><rect x="430" y="248" width="300" height="12" fill="#b8bec2"/>');
  s.add(T(580, 96, 22, '本月業績', '#2a5a9a', 700));
  [[470, 150, 70, '#3a7ac8'], [530, 120, 100, '#e8913a'], [590, 135, 85, '#3a7ac8'], [650, 100, 120, '#d9473d']].forEach(([x, y, h, c]) => s.add(`<rect x="${x}" y="${230 - h}" width="40" height="${h}" fill="${c}" opacity="0.9"/>`));
  s.add('<path d="M452 232H708" stroke="#444" stroke-width="2"/><path d="M470 210Q540 170 590 190T690 128" stroke="#2f9a5a" stroke-width="4" fill="none"/>');
  s.add('<rect x="470" y="236" width="40" height="8" rx="3" fill="#d9362b"/><rect x="520" y="236" width="40" height="8" rx="3" fill="#2a5a9a"/>');
  // 時鐘
  s.add('<circle cx="395" cy="90" r="0" fill="none"/>');
  s.add('<circle cx="760" cy="130" r="0" fill="none"/>');
  // 盆栽
  s.add(shadow(60, 520, 50, 8, 0.4));
  s.add('<path d="M30 440H92L84 520H38Z" fill="#c9604a"/><g fill="#3f8a4a"><ellipse cx="46" cy="410" rx="14" ry="42" transform="rotate(-20 46 410)"/><ellipse cx="62" cy="390" rx="14" ry="48"/><ellipse cx="80" cy="412" rx="14" ry="40" transform="rotate(22 80 412)"/></g>');
  // 後方辦公桌（同事 1）
  s.add(shadow(500, 440, 120, 10, 0.4));
  s.add('<rect x="400" y="352" width="200" height="14" rx="3" fill="url(#desk)"/><rect x="410" y="366" width="12" height="76" fill="#7a5a3a"/><rect x="578" y="366" width="12" height="76" fill="#7a5a3a"/>');
  s.add(person(s, { x: 500, y: 304, h: 260, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#e4e8ea', bottom: '#333', pose: 'table', legs: 'none', glasses: true }));
  s.add('<rect x="450" y="304" width="100" height="58" rx="3" fill="#2a3036"/><rect x="456" y="310" width="88" height="44" fill="#5a8ab0"/><rect x="494" y="362" width="12" height="6" fill="#333"/>');
  // 影印機（右後）
  s.add(shadow(740, 520, 60, 8, 0.4));
  s.add('<rect x="690" y="410" width="110" height="110" rx="4" fill="#e2e6e8" stroke="#9aa0a4" stroke-width="3"/><rect x="684" y="396" width="122" height="22" rx="4" fill="#bfc6c8"/><rect x="706" y="428" width="76" height="14" fill="#7a868a"/><rect x="706" y="456" width="76" height="48" rx="3" fill="#d2d8da"/><path d="M706 480H782" stroke="#9aa0a4"/><circle cx="790" cy="428" r="4" fill="#3ac86a"/>');
  s.add('<rect x="716" y="380" width="56" height="18" fill="#fff" stroke="#bbb"/>' + T(744, 468, 12, '印表機', '#556', 700));
  // 前景辦公桌與電腦
  s.add(shadow(300, 586, 230, 12, 0.45));
  s.add('<rect x="70" y="448" width="460" height="18" rx="4" fill="url(#desk)"/><rect x="70" y="448" width="460" height="4" fill="#fff" opacity="0.3"/><rect x="86" y="466" width="14" height="116" fill="#7a5a3a"/><rect x="500" y="466" width="14" height="116" fill="#7a5a3a"/><rect x="100" y="470" width="400" height="42" fill="#97704a" opacity="0.8"/>');
  // 椅子（背對）與坐著的人
  s.add(person(s, { x: 250, y: 330, h: 300, skin: 'light', hair: '#2a1b14', hairStyle: 'long', top: '#4a7ab0', bottom: '#2a2f3a', pose: 'table', legs: 'none' }));
  s.add('<rect x="170" y="380" width="160" height="62" fill="#4a7ab0" opacity="0"/>');
  // 電腦（正面朝向坐者，我們看背面）
  s.add('<rect x="320" y="352" width="136" height="88" rx="4" fill="#23282d"/><rect x="326" y="358" width="124" height="70" fill="#2e353b"/><path d="M380 440H396V448H380Z" fill="#3a4148"/><rect x="354" y="446" width="72" height="5" rx="2" fill="#3a4148"/>');
  s.add('<circle cx="388" cy="394" r="6" fill="#e8e8e8" opacity="0.7"/>');
  // 桌上的物件：文件、咖啡、電話、鍵盤
  s.add('<g transform="rotate(-4 160 436)"><rect x="110" y="424" width="86" height="26" fill="#fff"/><rect x="116" y="418" width="86" height="26" fill="#f4f1e0"/><path d="M122 428H190M122 434H180M122 440H186" stroke="#999" stroke-width="2"/></g>');
  s.add(T(158, 412, 13, '文件', '#555', 700));
  s.add('<path d="M214 420H246L242 448H218Z" fill="#fff" stroke="#bbb"/><path d="M246 428Q260 430 246 440" stroke="#bbb" stroke-width="3" fill="none"/><path d="M222 418Q226 408 222 402M234 418Q238 408 234 402" stroke="#fff" stroke-width="3" fill="none" opacity="0.8"/><ellipse cx="230" cy="422" rx="14" ry="3" fill="#6a3a22"/>');
  s.add('<g transform="translate(480 428)"><rect x="-30" y="0" width="60" height="22" rx="5" fill="#2e353b"/><rect x="-22" y="-8" width="44" height="10" rx="5" fill="#3c444a"/><circle cx="-14" cy="12" r="3" fill="#888"/><circle cx="0" cy="12" r="3" fill="#888"/><circle cx="14" cy="12" r="3" fill="#888"/></g>');
  // 站著的同事拿文件
  s.add(person(s, { x: 640, y: 270, h: 320, skin: 'mid', hair: '#2a1b14', hairStyle: 'short', top: '#8a6aa8', bottom: '#2a2f3a', pose: 'hold', legs: 'stand', sleeve: 'short' }));
  s.add('<g transform="translate(640 345) rotate(-6)"><rect x="-26" y="-20" width="52" height="40" fill="#fff" stroke="#ccc"/><path d="M-18 -10H18M-18 -2H18M-18 6H10" stroke="#999" stroke-width="2"/></g>');
  return s.out();
};

/* G7 飯店櫃台 */
out.hotel = () => {
  const s = Scene(); const R = rng(67);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f0e4cc'], [1, '#d9c6a2']]));
  s.def(lin('floor', 0, 0, 0, 1, [[0, '#d7c9ae'], [1, '#a8987a']]));
  s.def(lin('desk', 0, 0, 0, 1, [[0, '#6a4a30'], [1, '#3e2a1a']]));
  s.def(lin('top', 0, 0, 0, 1, [[0, '#e8dcc4'], [1, '#c9b894']]));
  s.def(rad('lamp', 0.5, 0.5, 0.5, [[0, '#fff0b8', 0.8], [1, '#fff0b8', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<rect y="400" width="800" height="200" fill="url(#floor)"/>');
  s.add('<g stroke="#8a7a5a" stroke-width="2" opacity="0.35"><path d="M0 460H800M0 530H800M130 400L60 600M300 400L270 600M500 400L510 600M670 400L740 600"/></g>');
  s.add('<rect y="392" width="800" height="10" fill="#8a6a44"/>');
  // 牆面木飾
  s.add('<g fill="#c9ad7c" opacity="0.5">' + Array.from({ length: 8 }, (_, i) => `<rect x="${i * 106 + 10}" y="40" width="86" height="340" rx="3"/>`).join('') + '</g>');
  // 吊燈
  s.add('<circle cx="400" cy="70" r="120" fill="url(#lamp)"/><path d="M400 0V40" stroke="#6a5a3a" stroke-width="3"/>');
  s.add('<path d="M340 46H460L430 82H370Z" fill="#e5c36a"/>' + [350, 375, 400, 425, 450].map((x, i) => `<path d="M${x} 84V${100 + (i % 2) * 14}" stroke="#e5c36a" stroke-width="2"/><circle cx="${x}" cy="${104 + (i % 2) * 14}" r="6" fill="#fff4c4"/>`).join(''));
  [[140, 80], [660, 80]].forEach(([x, y]) => s.add(`<circle cx="${x}" cy="${y}" r="70" fill="url(#lamp)" opacity="0.7"/><path d="M${x - 24} ${y - 20}H${x + 24}L${x + 16} ${y + 16}H${x - 16}Z" fill="#fff3c8" stroke="#c9a24a" stroke-width="3"/>`));
  // 世界時鐘
  const clk = (x, name) => `<circle cx="${x}" cy="150" r="26" fill="#fff" stroke="#6a4a30" stroke-width="4"/><path d="M${x} 150V132M${x} 150L${x + 12} 156" stroke="#222" stroke-width="2.5" stroke-linecap="round"/>` + T(x, 196, 14, name, '#4a3a22', 700);
  s.add('<rect x="236" y="116" width="328" height="102" rx="6" fill="#fff8e6" opacity="0.6"/>');
  s.add(clk(290, '台北') + clk(360, '東京') + clk(430, '倫敦') + clk(500, '紐約'));
  // 櫃台背牆：鑰匙格
  s.add('<rect x="150" y="238" width="500" height="120" rx="3" fill="#3e2a1a"/>');
  for (let r = 0; r < 3; r++) for (let q = 0; q < 12; q++) { const x = 160 + q * 40, y = 246 + r * 36; s.add(`<rect x="${x}" y="${y}" width="32" height="30" fill="#2a1c10"/><circle cx="${x + 16}" cy="${y + 12}" r="3" fill="#e5c36a"/>` + (R() > 0.35 ? `<rect x="${x + 11}" y="${y + 15}" width="10" height="12" rx="2" fill="#d9a23a"/>` : '')); }
  // 接待櫃台
  s.add(shadow(400, 490, 300, 12, 0.5));
  s.add('<rect x="90" y="390" width="620" height="100" fill="url(#desk)"/><rect x="80" y="372" width="640" height="22" rx="4" fill="url(#top)"/><rect x="80" y="372" width="640" height="4" fill="#fff" opacity="0.5"/>');
  s.add('<path d="M110 420H690M110 462H690" stroke="#e5c36a" stroke-width="2" opacity="0.5"/>');
  s.add('<rect x="320" y="402" width="160" height="40" rx="4" fill="#2a1c10"/>' + T(400, 432, 28, '歡迎光臨', '#f6d98a', 700, 'letter-spacing="4"'));
  // 櫃台人員
  s.add(person(s, { x: 400, y: 290, h: 300, skin: 'light', hair: '#2a1b14', hairStyle: 'bun', top: '#2a3f5a', bottom: '#222', pose: 'table', legs: 'none' }));
  s.add('<path d="M388 292Q400 314 412 292L408 304L400 322L392 304Z" fill="#d9a23a"/><rect x="418" y="318" width="22" height="8" rx="2" fill="#fff" opacity="0.9"/>');
  // 櫃台上物品：服務鈴、房卡、登記簿
  s.add('<g transform="translate(210 372)"><ellipse cx="0" cy="0" rx="26" ry="6" fill="#8a6a2a"/><path d="M-22 -2Q-22 -26 0 -26Q22 -26 22 -2Z" fill="#e5c36a"/><rect x="-3" y="-34" width="6" height="8" rx="2" fill="#c9a24a"/><path d="M-12 -14Q-10 -22 -2 -23" stroke="#fff" stroke-width="3" fill="none" opacity="0.6"/></g>');
  s.add(T(210, 394, 1, '', '#000'));
  s.add('<g transform="translate(275 366) rotate(-6)"><rect x="-22" y="-10" width="44" height="28" rx="3" fill="#fff"/><rect x="-22" y="-10" width="44" height="8" fill="#2a3f5a"/>' + T(0, 14, 11, '房卡', '#222', 700) + '</g>');
  s.add('<g transform="translate(540 368) rotate(3)"><rect x="-34" y="-8" width="68" height="14" fill="#7a2a2a"/><rect x="-32" y="-12" width="64" height="14" fill="#fff"/><path d="M-26 -6H26" stroke="#999" stroke-width="2"/></g>');
  s.add('<g transform="translate(610 372)"><rect x="-4" y="-34" width="8" height="34" fill="#4a3a22"/><path d="M-4 -34Q-30 -40 -28 -10Q-8 -20 -4 -10Z" fill="#3f8a4a"/><path d="M4 -34Q30 -40 28 -10Q8 -20 4 -10Z" fill="#4f9a56"/></g>');
  // 客人與行李
  s.add(person(s, { x: 150, y: 320, h: 310, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#e07a4a', bottom: '#3a4a6a', pose: 'hold', legs: 'stand', sleeve: 'short', shoe: '#f0f0f0' }));
  s.add('<g transform="translate(145 396) rotate(-6)"><rect x="-22" y="-12" width="44" height="28" rx="3" fill="#fff"/><rect x="-22" y="-12" width="44" height="8" fill="#2a3f5a"/>' + T(0, 12, 11, '房卡', '#222', 700) + '</g>');
  s.add(shadow(60, 566, 36, 7, 0.4));
  s.add('<rect x="24" y="470" width="68" height="94" rx="9" fill="#c9604a"/><rect x="31" y="478" width="54" height="78" rx="5" fill="none" stroke="#fff" stroke-width="2" opacity="0.4"/><path d="M42 470V448H72V470" stroke="#444" stroke-width="6" fill="none"/><circle cx="36" cy="568" r="5" fill="#222"/><circle cx="82" cy="568" r="5" fill="#222"/>');
  // 行李推車與行李
  s.add(shadow(700, 570, 70, 8, 0.4));
  s.add('<path d="M620 420V548M780 420V548" stroke="#e5c36a" stroke-width="6"/><path d="M620 430H780M620 548H780M620 480H780" stroke="#e5c36a" stroke-width="5"/><path d="M620 420Q700 400 780 420" stroke="#e5c36a" stroke-width="6" fill="none"/>');
  s.add('<rect x="640" y="440" width="64" height="104" rx="8" fill="#2f6a8a"/><rect x="650" y="450" width="44" height="84" rx="4" fill="none" stroke="#fff" stroke-width="2" opacity="0.4"/><rect x="714" y="480" width="56" height="64" rx="8" fill="#7a5a3a"/><path d="M714 500H770" stroke="#e5c36a" stroke-width="3"/>');
  s.add('<circle cx="632" cy="558" r="9" fill="#333"/><circle cx="768" cy="558" r="9" fill="#333"/>');
  return s.out();
};

/* G8 博物館 */
out.museum = () => {
  const s = Scene(); const R = rng(68);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#ddd8cc'], [1, '#c4bdab']]));
  s.def(lin('floor', 0, 0, 0, 1, [[0, '#9a8560'], [1, '#6e5b3c']]));
  s.def(lin('glass', 0, 0, 1, 1, [[0, '#dff0f6', 0.45], [0.5, '#fff', 0.1], [1, '#cfe4ec', 0.4]]));
  s.def(rad('spot', 0.5, 0.2, 0.7, [[0, '#fff6d0', 0.55], [1, '#fff6d0', 0]]));
  s.def(lin('vase', 0, 0, 1, 0, [[0, '#2f6aa8'], [0.5, '#5a96d0'], [1, '#1f4a80']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<rect y="410" width="800" height="190" fill="url(#floor)"/><rect y="402" width="800" height="10" fill="#f0ece0"/>');
  s.add('<g stroke="#4a3a22" stroke-width="2" opacity="0.3">' + Array.from({ length: 12 }, (_, i) => `<path d="M${i * 70 - 100} 600L${i * 52 + 30} 412"/>`).join('') + '<path d="M0 470H800M0 540H800"/></g>');
  s.add('<rect width="800" height="26" fill="#f4f0e4"/>');
  // 畫作
  const frame = (x, y, w, h, k) => {
    s.add(`<ellipse cx="${x + w / 2}" cy="${y - 24}" rx="${w * 0.6}" ry="30" fill="url(#spot)"/>`);
    s.add(`<rect x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${h + 20}" fill="#b8903e"/><rect x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" fill="#7a5a1e"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f0e8d0"/>`);
    const g = 'pt' + k;
    if (k === 0) { s.def(lin(g, 0, 0, 0, 1, [[0, '#a8d0ea'], [1, '#f2e6c0']])); s.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${g})"/><circle cx="${x + w * 0.7}" cy="${y + h * 0.3}" r="${w * 0.1}" fill="#fff3b0"/><path d="M${x} ${y + h * 0.7}Q${x + w * 0.3} ${y + h * 0.45} ${x + w * 0.55} ${y + h * 0.65}T${x + w} ${y + h * 0.6}V${y + h}H${x}Z" fill="#6a9a5a"/><path d="M${x} ${y + h * 0.85}Q${x + w * 0.5} ${y + h * 0.7} ${x + w} ${y + h * 0.88}V${y + h}H${x}Z" fill="#4a7a42"/>`); }
    if (k === 1) { s.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e8c88a"/><circle cx="${x + w * 0.35}" cy="${y + h * 0.4}" r="${w * 0.2}" fill="#d9573a"/><circle cx="${x + w * 0.65}" cy="${y + h * 0.55}" r="${w * 0.18}" fill="#3a6aa8"/><rect x="${x + w * 0.2}" y="${y + h * 0.6}" width="${w * 0.25}" height="${h * 0.25}" fill="#2f8a6a"/>`); }
    if (k === 2) { s.def(lin(g, 0, 0, 0, 1, [[0, '#2a3f6a'], [1, '#6a8ac0']])); s.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${g})"/><path d="M${x} ${y + h * 0.7}Q${x + w * 0.25} ${y + h * 0.6} ${x + w * 0.5} ${y + h * 0.7}T${x + w} ${y + h * 0.7}V${y + h}H${x}Z" fill="#1f2f50"/><path d="M${x + w * 0.2} ${y + h * 0.7}L${x + w * 0.3} ${y + h * 0.4}L${x + w * 0.4} ${y + h * 0.7}Z" fill="#f4e8c0"/><circle cx="${x + w * 0.75}" cy="${y + h * 0.25}" r="${w * 0.07}" fill="#fff6d0"/>`); }
  };
  frame(40, 60, 150, 190, 0); frame(230, 90, 120, 120, 1); frame(450, 60, 130, 170, 2);
  s.add('<rect x="620" y="60" width="130" height="30" rx="4" fill="#2a3036"/>' + T(685, 82, 20, '博物館', '#f4e6b0', 700, 'letter-spacing="6"'));
  s.add('<rect x="620" y="100" width="130" height="70" rx="3" fill="#f4f0e4" stroke="#aaa"/><path d="M632 118H738M632 134H738M632 150H710" stroke="#999" stroke-width="3"/>');
  // 雕像
  s.add(shadow(560, 478, 70, 9, 0.45));
  s.add('<rect x="508" y="360" width="104" height="116" fill="#e8e4da"/><rect x="500" y="350" width="120" height="14" fill="#f4f1e8"/><rect x="508" y="360" width="104" height="116" fill="#000" opacity="0.06"/><rect x="500" y="466" width="120" height="12" fill="#cfcabd"/>');
  s.add('<path d="M526 350Q524 310 540 296Q540 270 560 262Q580 270 580 296Q596 310 594 350Z" fill="#dcd6c8"/><ellipse cx="560" cy="276" rx="18" ry="22" fill="#e8e2d4"/><path d="M544 270Q560 250 576 270Q570 262 560 262Q550 262 544 270Z" fill="#c9c2b0"/><path d="M526 350Q524 318 536 304" stroke="#fff" stroke-width="5" fill="none" opacity="0.5"/>');
  s.add(T(560, 410, 13, '雕像', '#8a8574', 700));
  // 展示櫃（花瓶）
  s.add(shadow(330, 480, 110, 9, 0.45));
  s.add('<rect x="240" y="400" width="180" height="76" fill="#5a4a32"/><rect x="236" y="394" width="188" height="10" fill="#7a6648"/>');
  s.add('<rect x="246" y="276" width="168" height="120" fill="url(#glass)" stroke="#9aa6aa" stroke-width="3"/>');
  s.add('<path d="M330 380Q290 380 292 340Q294 312 314 300L318 284H342L346 300Q366 312 368 340Q370 380 330 380Z" fill="url(#vase)"/><rect x="312" y="278" width="36" height="8" rx="3" fill="#f0e8d0"/><path d="M296 330H364M300 352H360" stroke="#f0e8d0" stroke-width="3"/><path d="M310 318Q322 304 330 326Q338 304 350 318" stroke="#f0e8d0" stroke-width="2.5" fill="none"/>');
  s.add('<path d="M252 282L290 390M370 282L408 390" stroke="#fff" stroke-width="10" opacity="0.14"/>');
  s.add('<rect x="268" y="418" width="124" height="22" rx="2" fill="#f4f0e4"/>' + T(330, 435, 14, '花瓶', '#444', 700));
  // 長椅
  s.add(shadow(130, 540, 110, 8, 0.4));
  s.add('<rect x="40" y="490" width="180" height="22" rx="5" fill="#3a2a1c"/><rect x="40" y="512" width="180" height="6" fill="#2a1c10"/><rect x="60" y="518" width="10" height="34" fill="#2a1c10"/><rect x="190" y="518" width="10" height="34" fill="#2a1c10"/>');
  // 人物：媽媽與小孩在看畫
  s.add(person(s, { x: 150, y: 288, h: 320, skin: 'light', hair: '#2a1b14', hairStyle: 'long', top: '#7a9a6a', bottom: '#3a3f4a', pose: 'hold', legs: 'stand', shoe: '#5a3a2a' }));
  s.add(person(s, { x: 230, y: 392, h: 220, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#e8a43a', bottom: '#4a5a8a', pose: 'wave', legs: 'stand', sleeve: 'short' }));
  s.add(person(s, { x: 690, y: 290, h: 320, skin: 'mid', hair: '#6a6a6a', hairStyle: 'gray', top: '#8a4a4a', bottom: '#33394a', pose: 'down', legs: 'stand', glasses: true }));
  s.add('<g transform="translate(676 342)"><rect x="0" y="0" width="30" height="40" rx="2" fill="#f4f0e4" stroke="#999"/><path d="M5 10H25M5 18H25M5 26H18" stroke="#999" stroke-width="2"/></g>');
  return s.out();
};

/* G9 遊樂園 */
out.amusement = () => {
  const s = Scene(); const R = rng(69);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#7cc0ee'], [1, '#f6efd8']]));
  s.def(lin('gr', 0, 0, 0, 1, [[0, '#8cc05a'], [1, '#5b9640']]));
  s.def(lin('path', 0, 0, 0, 1, [[0, '#e6d2a8'], [1, '#c9b080']]));
  s.def(lin('roof', 0, 0, 1, 0, [[0, '#e8546a'], [0.5, '#f48a9a'], [1, '#c4384e']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<g filter="url(#b8)" opacity="0.9"><ellipse cx="160" cy="70" rx="110" ry="22" fill="#fff"/><ellipse cx="620" cy="50" rx="130" ry="20" fill="#fff"/><ellipse cx="420" cy="120" rx="90" ry="14" fill="#fff"/></g>');
  s.add('<g filter="url(#b4)"><ellipse cx="100" cy="330" rx="200" ry="60" fill="#78ae60"/><ellipse cx="700" cy="330" rx="230" ry="66" fill="#82b868"/></g>');
  s.add('<rect y="330" width="800" height="270" fill="url(#gr)"/>');
  // 雲霄飛車（遠）
  s.add('<path d="M0 300Q60 140 120 260T240 200Q300 120 360 250T470 330" stroke="#d9473d" stroke-width="10" fill="none"/><path d="M0 312Q60 152 120 272T240 212Q300 132 360 262T470 342" stroke="#8a2a24" stroke-width="4" fill="none"/>');
  s.add('<g stroke="#8a2a24" stroke-width="4">' + [[30, 270], [75, 190], [120, 266], [180, 240], [240, 206], [300, 170], [360, 252], [420, 300]].map(([x, y]) => `<path d="M${x} ${y + 10}V335"/>`).join('') + '</g>');
  s.add('<g transform="translate(186 228) rotate(-24)"><rect x="-26" y="-14" width="52" height="16" rx="5" fill="#3a7ac8"/><circle cx="-12" cy="-20" r="6" fill="#e8b88a"/><circle cx="6" cy="-20" r="6" fill="#c99a74"/><circle cx="20" cy="-20" r="5" fill="#f2d0a8"/></g>');
  // 摩天輪
  const cx = 600, cy = 220, r = 150;
  s.add('<path d="M600 220L540 400M600 220L660 400" stroke="#6a7a8a" stroke-width="10" stroke-linecap="round"/><path d="M520 400H680" stroke="#6a7a8a" stroke-width="8"/>');
  s.add(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e8ecee" stroke-width="7"/><circle cx="${cx}" cy="${cy}" r="${r - 36}" fill="none" stroke="#e8ecee" stroke-width="4"/>`);
  const cols = ['#e8546a', '#f2b632', '#3a9ac8', '#4fa86a', '#9a5ac8', '#e8913a'];
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); s.add(`<path d="M${cx} ${cy}L${x.toFixed(0)} ${y.toFixed(0)}" stroke="#e8ecee" stroke-width="3"/>`); s.add(`<path d="M${x.toFixed(0)} ${y.toFixed(0)}v10" stroke="#555" stroke-width="2"/><rect x="${(x - 14).toFixed(0)}" y="${(y + 8).toFixed(0)}" width="28" height="22" rx="5" fill="${cols[i % 6]}"/><rect x="${(x - 10).toFixed(0)}" y="${(y + 11).toFixed(0)}" width="20" height="9" fill="#fff" opacity="0.6"/>`); }
  s.add(`<circle cx="${cx}" cy="${cy}" r="12" fill="#6a7a8a"/>`);
  // 旋轉木馬
  s.add(shadow(230, 470, 150, 12, 0.4));
  s.add('<ellipse cx="230" cy="452" rx="150" ry="22" fill="#d9b86a"/><rect x="80" y="440" width="300" height="16" fill="#e8c878"/><ellipse cx="230" cy="440" rx="150" ry="20" fill="#f0d890"/>');
  [[120, 380], [188, 392], [272, 392], [340, 380]].forEach(([x], i) => s.add(`<path d="M${x} 330V440" stroke="#e5c36a" stroke-width="6"/>`));
  const horse = (x, y, c) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="22" ry="12" fill="${c}"/><path d="M14 -4L26 -26Q34 -30 38 -22L30 -14L24 -2Z" fill="${c}"/><path d="M-20 4L-24 22M-8 8L-8 24M10 8L12 24M18 4L22 20" stroke="${c}" stroke-width="5" stroke-linecap="round"/><path d="M14 -6Q8 -18 0 -14" stroke="#fff" stroke-width="4" fill="none"/><path d="M-22 -2Q-34 4 -30 18" stroke="#fff" stroke-width="4" fill="none"/><circle cx="31" cy="-21" r="1.8" fill="#222"/></g>`;
  s.add(horse(130, 400, '#f4f4f0') + horse(332, 398, '#e8913a') + horse(190, 410, '#c9a0e0') + horse(272, 410, '#7ac0e0'));
  s.add('<path d="M70 330L230 262L390 330Z" fill="url(#roof)"/><path d="M70 330Q110 344 150 330Q190 344 230 330Q270 344 310 330Q350 344 390 330V324H70Z" fill="#fff" opacity="0.9"/><path d="M230 262V236" stroke="#e5c36a" stroke-width="4"/><path d="M230 236L250 242L230 248Z" fill="#f2b632"/>');
  s.add('<path d="M90 330V440M370 330V440M230 330V440" stroke="#e5c36a" stroke-width="7"/>');
  // 遠景樹
  s.add('<g><circle cx="470" cy="360" r="40" fill="#4f8f35"/><circle cx="740" cy="350" r="34" fill="#4f8f35"/><rect x="466" y="370" width="8" height="40" fill="#5a3a22"/></g>');
  // 路面
  s.add('<path d="M0 560Q400 470 800 540V600H0Z" fill="url(#path)"/><path d="M0 560Q400 470 800 540" stroke="#a89060" stroke-width="3" fill="none" opacity="0.6"/>');
  // 售票亭
  s.add(shadow(700, 506, 70, 8, 0.4));
  s.add('<rect x="640" y="420" width="120" height="86" fill="#f4efe0"/><rect x="630" y="400" width="140" height="26" fill="#e8546a"/><path d="M630 426Q650 442 670 426Q690 442 710 426Q730 442 750 426L770 426V420H630Z" fill="#fff"/><rect x="656" y="440" width="88" height="40" fill="#2a3036"/><rect x="656" y="470" width="88" height="8" fill="#b8903e"/>');
  s.add(T(700, 419, 17, '售票處', '#fff', 800, 'letter-spacing="3"'));
  // 人物：爸爸拿棉花糖，小孩拿氣球
  s.add(person(s, { x: 450, y: 300, h: 300, skin: 'mid', hair: '#1a120e', hairStyle: 'short', top: '#3a9ac8', bottom: '#3a3f4a', pose: 'hold', legs: 'stand', sleeve: 'short', shoe: '#f0f0f0' }));
  s.add('<path d="M455 400Q462 404 466 396" stroke="#f0d0b0" stroke-width="0"/><g transform="translate(466 372)"><path d="M0 40L0 -2" stroke="#e8d8b8" stroke-width="4"/><circle cx="0" cy="-16" r="18" fill="#f9a8c8"/><circle cx="-12" cy="-10" r="12" fill="#fcc0d8"/><circle cx="12" cy="-10" r="12" fill="#f89ab8"/><circle cx="0" cy="-26" r="12" fill="#fcc0d8"/></g>');
  s.add(person(s, { x: 570, y: 395, h: 210, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#f2b632', bottom: '#d9573a', skirt: true, pose: 'wave', legs: 'stand', sleeve: 'short' }));
  const bal = (x, y, c, k) => `<path d="M${x} ${y}Q${x + k} ${y + 80} 606 353" stroke="#777" stroke-width="1.5" fill="none"/><ellipse cx="${x}" cy="${y - 20}" rx="19" ry="24" fill="${c}"/><ellipse cx="${x - 6}" cy="${y - 28}" rx="5" ry="8" fill="#fff" opacity="0.5"/><path d="M${x - 3} ${y + 4}L${x + 3} ${y + 4}L${x} ${y + 9}Z" fill="${c}"/>`;
  s.add(bal(570, 250, '#e8546a', 10) + bal(620, 270, '#f2b632', -6) + bal(534, 280, '#3a9ac8', 14));
  s.add(T(570, 490, 1, '', '#000'));
  s.add(person(s, { x: 330, y: 440, h: 170, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#e8546a', bottom: '#33394a', pose: 'down', legs: 'stand', sleeve: 'short' }));
  return s.out();
};

/* G10 學校操場 */
out.schoolyard = () => {
  const s = Scene(); const R = rng(70);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#7cc0ee'], [1, '#f2f0dc']]));
  s.def(lin('gr', 0, 0, 0, 1, [[0, '#7fb852'], [1, '#559038']]));
  s.def(lin('trk', 0, 0, 0, 1, [[0, '#d9694a'], [1, '#b04a30']]));
  s.def(lin('bld', 0, 0, 0, 1, [[0, '#efe6d0'], [1, '#d4c8a8']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<g filter="url(#b8)" opacity="0.9"><ellipse cx="200" cy="60" rx="120" ry="20" fill="#fff"/><ellipse cx="560" cy="90" rx="100" ry="16" fill="#fff"/></g>');
  // 教學大樓
  s.add('<rect x="0" y="150" width="800" height="190" fill="url(#bld)"/><rect x="0" y="140" width="800" height="14" fill="#c9604a"/><rect x="0" y="244" width="800" height="6" fill="#bfb090"/>');
  for (let f = 0; f < 2; f++) for (let i = 0; i < 12; i++) { const x = 16 + i * 66, y = 166 + f * 100; s.add(`<rect x="${x}" y="${y}" width="46" height="62" fill="#7fa8c4"/><path d="M${x + 23} ${y}V${y + 62}M${x} ${y + 30}H${x + 46}" stroke="#f4f4f0" stroke-width="3"/><rect x="${x - 3}" y="${y + 62}" width="52" height="5" fill="#bfb090"/>`); }
  s.add('<rect x="340" y="90" width="120" height="70" fill="#efe6d0"/><rect x="330" y="82" width="140" height="12" fill="#c9604a"/><circle cx="400" cy="128" r="24" fill="#fff" stroke="#555" stroke-width="4"/><path d="M400 128V112M400 128L412 134" stroke="#222" stroke-width="3" stroke-linecap="round"/>');
  s.add(T(400, 72, 18, '學校', '#fff', 800, 'letter-spacing="6"') + '');
  s.add('<g filter="url(#b2)"><ellipse cx="60" cy="350" rx="90" ry="34" fill="#4f8f35"/><ellipse cx="740" cy="352" rx="90" ry="34" fill="#4f8f35"/></g>');
  s.add('<rect y="340" width="800" height="260" fill="url(#gr)"/>');
  // 圍籬
  s.add('<g stroke="#8a9296" stroke-width="2" opacity="0.8"><path d="M0 346H800M0 366H800"/>' + Array.from({ length: 40 }, (_, i) => `<path d="M${i * 20 + 4} 342V372"/>`).join('') + '</g>');
  // 跑道
  s.add('<path d="M-40 540Q400 410 840 540V600H-40Z" fill="url(#trk)"/><path d="M-40 560Q400 436 840 560" stroke="#fff" stroke-width="4" fill="none" opacity="0.85"/><path d="M-40 585Q400 466 840 585" stroke="#fff" stroke-width="4" fill="none" opacity="0.85"/><path d="M-40 540Q400 410 840 540" stroke="#fff" stroke-width="4" fill="none" opacity="0.85"/>');
  // 草地上：足球門
  s.add('<path d="M60 440V378H200V440" stroke="#fff" stroke-width="6" fill="none"/><path d="M60 378L36 392V450L60 440M200 378L224 392V450L200 440" stroke="#fff" stroke-width="3" fill="none" opacity="0.8"/><g stroke="#fff" stroke-width="1.5" opacity="0.5">' + Array.from({ length: 10 }, (_, i) => `<path d="M${64 + i * 14} 378V440"/>`).join('') + Array.from({ length: 5 }, (_, i) => `<path d="M60 ${390 + i * 12}H200"/>`).join('') + '</g>');
  // 旗桿
  s.add('<rect x="436" y="110" width="7" height="360" fill="#9aa0a4"/><circle cx="440" cy="106" r="6" fill="#e5c36a"/>');
  s.add('<path d="M443 120Q480 112 512 124Q540 132 560 124V176Q540 184 512 176Q480 164 443 172Z" fill="#d9362b"/><path d="M443 120Q462 116 482 120V148Q462 152 443 148Z" fill="#2a4a9a"/><circle cx="462" cy="134" r="7" fill="#fff"/>');
  s.add(shadow(440, 472, 20, 5, 0.4));
  // 籃球架
  s.add(shadow(670, 476, 70, 8, 0.4));
  s.add('<rect x="660" y="236" width="10" height="236" fill="#5a6066"/><path d="M670 264H600" stroke="#5a6066" stroke-width="8"/><rect x="560" y="212" width="86" height="60" fill="#fff" stroke="#555" stroke-width="4" opacity="0.92"/><rect x="584" y="242" width="38" height="26" fill="none" stroke="#d9362b" stroke-width="3"/><path d="M575 276H631" stroke="#e8913a" stroke-width="4"/><path d="M577 278L588 308M629 278L618 308M588 308H618M583 288H625M586 298H620" stroke="#fff" stroke-width="1.5" fill="none"/>');
  // 學生們
  s.add(person(s, { x: 300, y: 330, h: 300, skin: 'light', hair: '#2a1b14', hairStyle: 'short', top: '#f4f4f0', bottom: '#2a3f7a', pose: 'hold', legs: 'stand', sleeve: 'short', shoe: '#f0f0f0' }));
  s.add('<g transform="translate(300 394)"><circle r="19" fill="#e8913a"/><path d="M-19 0H19M0 -19V19M-13 -13Q0 0 -13 13M13 -13Q0 0 13 13" stroke="#4a2a10" stroke-width="2" fill="none"/></g>');
  s.add(person(s, { x: 530, y: 345, h: 270, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#f4f4f0', bottom: '#2a3f7a', pose: 'wave', legs: 'stand', sleeve: 'short', shoe: '#f0f0f0' }));
  s.add(person(s, { x: 150, y: 416, h: 190, skin: 'mid', hair: '#2a1b14', hairStyle: 'ponytail', top: '#f4f4f0', bottom: '#2a3f7a', pose: 'runA', legs: 'run', sleeve: 'short', shoe: '#f0f0f0' }));
  s.add('<g transform="translate(620 536)"><circle r="20" fill="#e8913a"/><path d="M-20 0H20M0 -20V20M-14 -14Q0 0 -14 14M14 -14Q0 0 14 14" stroke="#4a2a10" stroke-width="2" fill="none"/></g>');
  s.add(shadow(620, 560, 24, 4, 0.4));
  s.add('<g transform="translate(700 540)"><circle r="20" fill="#f2f2ea"/><path d="M-12 -14L0 -6L12 -14L8 4L-8 4Z" fill="#222"/><path d="M0 -6V-20M-20 0L-8 4M20 0L8 4" stroke="#222" stroke-width="2"/></g>');
  s.add(shadow(700, 563, 24, 4, 0.4));
  return s.out();
};

module.exports = out;
