const { rng, lin, rad, Scene, shadow, person, shade } = require('./lib');
const out = {};

/* F1 紅綠燈過馬路 */
out.crosswalk = () => {
  const s = Scene(); const R = rng(41);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#a9cfe6'], [1, '#f1e9d6']]));
  s.def(lin('road', 0, 0, 0, 1, [[0, '#6c7074'], [1, '#43474b']]));
  s.def(lin('walk', 0, 0, 0, 1, [[0, '#cdc3b0'], [1, '#a79c86']]));
  s.def(lin('pole', 0, 0, 1, 0, [[0, '#59605f'], [0.5, '#9aa3a2'], [1, '#444b4a']]));
  s.def(rad('sun', 0.7, 0.1, 0.8, [[0, '#fff3c4', 0.9], [1, '#fff3c4', 0]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="560" cy="40" r="260" fill="url(#sun)"/>');
  // 遠景大樓（台灣街景：鐵窗、招牌）
  const bl = [[0, 120, 130, '#d9c9a8'], [125, 70, 150, '#b9c4c9'], [270, 140, 120, '#e2d3b4'], [395, 90, 140, '#c8b79a'], [530, 130, 130, '#b8c6cc'], [665, 100, 140, '#dccbaa']];
  bl.forEach(([x, y, w, c], i) => {
    s.add(`<rect x="${x}" y="${y}" width="${w}" height="${330 - y}" fill="${c}"/><rect x="${x}" y="${y}" width="${w}" height="10" fill="#000" opacity="0.1"/>`);
    for (let r = 0; r < 5; r++) for (let q = 0; q < Math.floor(w / 36); q++) {
      const wx = x + 10 + q * 36, wy = y + 22 + r * 44; if (wy > 300) continue;
      s.add(`<rect x="${wx}" y="${wy}" width="24" height="28" fill="#6f8fa6" opacity="0.8"/><path d="M${wx} ${wy + 14}H${wx + 24}M${wx + 12} ${wy}V${wy + 28}" stroke="#4a5358" stroke-width="2"/><rect x="${wx - 3}" y="${wy + 28}" width="30" height="4" fill="#555"/>`);
    }
  });
  s.add('<rect x="130" y="250" width="86" height="26" fill="#d6372b"/><rect x="134" y="254" width="78" height="18" fill="none" stroke="#fff0c0" stroke-width="2"/><rect x="545" y="270" width="80" height="24" fill="#2f6d4f"/><rect x="549" y="274" width="72" height="16" fill="none" stroke="#fff" stroke-width="2"/>');
  // 遠方樹
  s.add('<g filter="url(#b2)"><ellipse cx="60" cy="318" rx="70" ry="40" fill="#4f7f46"/><ellipse cx="740" cy="320" rx="70" ry="36" fill="#4f7f46"/></g>');
  // 道路
  s.add('<rect y="330" width="800" height="170" fill="url(#road)"/>');
  s.add('<path d="M0 410H800" stroke="#f2d04a" stroke-width="3" opacity="0.9" stroke-dasharray="60 40"/>');
  // 斑馬線（透視）
  for (let i = 0; i < 9; i++) { const xa = 40 + i * 90, xb = 20 + i * 98; s.add(`<path d="M${xa} 340L${xa + 52} 340L${xb + 74} 500L${xb} 500Z" fill="#f4f4ee" opacity="0.95"/>`); }
  // 遠側機車等紅燈
  const scooter = (x, y, k, col) => {
    s.add(shadow(x + 30, y + 52, 52, 8, 0.4));
    s.add(`<circle cx="${x}" cy="${y + 40}" r="${14 * k}" fill="#222"/><circle cx="${x + 64 * k}" cy="${y + 40}" r="${14 * k}" fill="#222"/><circle cx="${x}" cy="${y + 40}" r="${6 * k}" fill="#aaa"/><circle cx="${x + 64 * k}" cy="${y + 40}" r="${6 * k}" fill="#aaa"/>`);
    s.add(`<path d="M${x - 6} ${y + 34}Q${x + 6} ${y + 6} ${x + 34 * k} ${y + 10}L${x + 70 * k} ${y + 22}L${x + 66 * k} ${y + 36}Z" fill="${col}"/><rect x="${x + 22 * k}" y="${y - 4}" width="${40 * k}" height="${10}" rx="5" fill="#2b2b2b"/><path d="M${x + 66 * k} ${y + 20}L${x + 64 * k} ${y - 16}L${x + 80 * k} ${y - 20}" stroke="#333" stroke-width="4" fill="none"/>`);
  };
  scooter(60, 340, 1, '#e8b84a'); scooter(200, 350, 1.05, '#4f86c2'); scooter(560, 345, 1, '#d9574a');
  // 騎士（簡化的人）
  s.add(person(s, { x: 94, y: 255, h: 190, skin: 'mid', hair: '#222', hairStyle: 'short', top: '#d9d2c0', bottom: '#333', pose: 'hold', legs: 'none', collar: false }));
  s.add(`<path d="M80 234Q94 212 108 234Z" fill="#c9423a"/>`);
  s.add(person(s, { x: 244, y: 262, h: 190, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#6fa57a', bottom: '#333', pose: 'hold', legs: 'none' }));
  // 前方人行道
  s.add('<rect y="498" width="800" height="102" fill="url(#walk)"/><rect y="494" width="800" height="8" fill="#e6dec9"/>');
  s.add('<g stroke="#8a7f69" stroke-width="2" opacity="0.5"><path d="M0 548H800M0 586H800"/><path d="M100 498V600M260 498V600M420 498V600M580 498V600M740 498V600"/></g>');
  // 行人號誌桿（右）
  s.add('<rect x="640" y="150" width="14" height="400" fill="url(#pole)"/>');
  s.add(shadow(647, 552, 30, 7, 0.4));
  s.add('<rect x="606" y="120" width="86" height="130" rx="10" fill="#1f2326"/><rect x="612" y="126" width="74" height="118" rx="7" fill="#101315"/>');
  s.add('<circle cx="649" cy="162" r="26" fill="#ff3b30" opacity="0.25" filter="url(#b8)"/><g transform="translate(649 160)"><circle cx="0" cy="-14" r="6" fill="#ff4a3f"/><path d="M-9 -6H9L12 12H-12Z M-8 12L-10 26M8 12L10 26" stroke="#ff4a3f" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" fill="#ff4a3f"/></g>');
  s.add('<rect x="618" y="204" width="62" height="32" rx="4" fill="#000"/><text x="649" y="230" font-size="28" font-weight="700" text-anchor="middle" fill="#ff5a3c" font-family="monospace">18</text>');
  s.add('<rect x="660" y="260" width="30" height="40" rx="4" fill="#dfe3e4"/><circle cx="675" cy="280" r="9" fill="#3a76c2"/>');
  // 等紅燈的人
  s.add(person(s, { x: 430, y: 270, h: 330, skin: 'light', hair: '#2a1b14', hairStyle: 'long', top: '#e8c26a', bottom: '#38486a', pose: 'hold', legs: 'stand', shoe: '#f2f2f2' }));
  s.add(person(s, { x: 540, y: 285, h: 320, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#4f86c2', bottom: '#3a3f4a', pose: 'down', legs: 'stand', shoe: '#2a2a2a', sleeve: 'short' }));
  s.add('<rect x="505" y="310" width="30" height="62" rx="9" fill="#2f4a6a"/><rect x="509" y="318" width="22" height="14" rx="4" fill="#244058"/>');
  return s.out();
};

/* F2 動物園（長頸鹿） */
out.zoo = () => {
  const s = Scene(); const R = rng(42);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#8fc8ec'], [1, '#e8f1df']]));
  s.def(lin('gr', 0, 0, 0, 1, [[0, '#8ab85a'], [1, '#5a8f3d']]));
  s.def(lin('gir', 0, 0, 1, 1, [[0, '#f0c068'], [1, '#c98f3e']]));
  s.def(rad('leaf', 0.35, 0.3, 0.9, [[0, '#8cc25a'], [0.6, '#4f8f35'], [1, '#2e6224']]));
  s.def(lin('fn', 0, 0, 0, 1, [[0, '#8a6a46'], [1, '#5f4630']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<g filter="url(#b8)" opacity="0.85"><ellipse cx="160" cy="80" rx="110" ry="26" fill="#fff"/><ellipse cx="600" cy="60" rx="130" ry="24" fill="#fff"/></g>');
  s.add('<g filter="url(#b4)"><ellipse cx="90" cy="330" rx="150" ry="70" fill="#6ea056"/><ellipse cx="700" cy="330" rx="170" ry="80" fill="#6ea056"/></g>');
  s.add('<rect y="340" width="800" height="260" fill="url(#gr)"/>');
  // 遠景大樹（右後）
  s.add('<path d="M640 360Q645 260 636 170L664 170Q660 270 672 360Z" fill="#5f4630"/>');
  [[600, 150, 70], [680, 140, 80], [650, 100, 70], [720, 190, 60]].forEach(([x, y, r]) => s.add(`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#leaf)"/>`));
  // 長頸鹿（側面，頭朝右伸向樹）
  const gx = 330;
  s.add(shadow(gx + 20, 468, 140, 14, 0.4));
  // 後腿與前腿
  s.add(`<g stroke="#e0a850" stroke-width="20" stroke-linecap="round"><path d="M${gx - 80} 395L${gx - 86} 465"/><path d="M${gx - 40} 400L${gx - 42} 468"/><path d="M${gx + 70} 400L${gx + 76} 466"/><path d="M${gx + 110} 396L${gx + 118} 462"/></g>`);
  s.add(`<g fill="#5a3b22"><rect x="${gx - 96}" y="456" width="22" height="14" rx="4"/><rect x="${gx - 52}" y="458" width="22" height="14" rx="4"/><rect x="${gx + 66}" y="456" width="22" height="14" rx="4"/><rect x="${gx + 108}" y="452" width="22" height="14" rx="4"/></g>`);
  // 身體
  s.add(`<path d="M${gx - 110} 360Q${gx - 100} 330 ${gx - 40} 332Q${gx + 40} 326 ${gx + 100} 336Q${gx + 140} 350 ${gx + 130} 390Q${gx + 90} 420 ${gx} 416Q${gx - 80} 420 ${gx - 106} 390Z" fill="url(#gir)"/>`);
  s.add(`<path d="M${gx - 110} 372Q${gx - 135} 380 ${gx - 130} 420" stroke="#c98f3e" stroke-width="6" fill="none" stroke-linecap="round"/>`);
  // 脖子
  s.add(`<path d="M${gx + 70} 345Q${gx + 110} 250 ${gx + 150} 130L${gx + 190} 124Q${gx + 168} 260 ${gx + 130} 372Z" fill="url(#gir)"/>`);
  s.add(`<path d="M${gx + 150} 130Q${gx + 160} 96 ${gx + 200} 98Q${gx + 250} 100 ${gx + 262} 124Q${gx + 262} 144 ${gx + 232} 146Q${gx + 200} 150 ${gx + 188} 128Z" fill="#f0c068"/><ellipse cx="${gx + 246}" cy="128" rx="18" ry="14" fill="#e3b072"/><circle cx="${gx + 202}" cy="108" r="5" fill="#2a1a10"/><circle cx="${gx + 203}" cy="107" r="1.6" fill="#fff"/>`);
  s.add(`<path d="M${gx + 170} 100L${gx + 166} 72M${gx + 186} 98L${gx + 188} 70" stroke="#a37a3e" stroke-width="5" stroke-linecap="round"/><circle cx="${gx + 166}" cy="70" r="6" fill="#4a3220"/><circle cx="${gx + 188}" cy="68" r="6" fill="#4a3220"/><path d="M${gx + 160} 110Q${gx + 142} 108 ${gx + 138} 122Q${gx + 152} 124 ${gx + 164} 118Z" fill="#e0a850"/>`);
  // 斑塊
  const spots = [[-80, 360, 20], [-40, 345, 16], [-10, 385, 22], [30, 350, 18], [60, 390, 20], [95, 365, 17], [-70, 395, 14], [110, 350, 14], [138, 300, 12], [150, 240, 13], [136, 195, 11], [166, 170, 10], [158, 140, 9], [120, 280, 12]];
  spots.forEach(([dx, y, r]) => s.add(`<ellipse cx="${gx + dx}" cy="${y}" rx="${r}" ry="${r * 0.85}" fill="#8a5a2a" opacity="0.8" transform="rotate(${(dx * 7) % 40} ${gx + dx} ${y})"/>`));
  s.add(`<rect x="${gx - 110}" y="360" width="240" height="60" fill="#000" opacity="0.05"/>`);
  // 柵欄（前景）
  s.add('<rect y="476" width="800" height="124" fill="url(#gr)" opacity="0"/>');
  for (let i = 0; i < 17; i++) s.add(`<rect x="${i * 50 - 6}" y="470" width="12" height="130" fill="url(#fn)"/><path d="M${i * 50 - 6} 470L${i * 50} 462L${i * 50 + 6} 470Z" fill="#6f5238"/>`);
  s.add('<rect y="500" width="800" height="12" fill="#7a5a3a"/><rect y="548" width="800" height="12" fill="#7a5a3a"/>');
  // 小朋友與媽媽
  s.add(person(s, { x: 560, y: 410, h: 270, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#f2a65a', bottom: '#4a5a8a', pose: 'wave', legs: 'none', sleeve: 'short' }));
  s.add(person(s, { x: 690, y: 330, h: 400, skin: 'mid', hair: '#3a2a22', hairStyle: 'long', top: '#6fa5c9', bottom: '#38486a', pose: 'hold', legs: 'none' }));
  return s.out();
};

/* F3 游泳池 */
out.pool = () => {
  const s = Scene(); const R = rng(43);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#dfe9ee'], [1, '#c4d3da']]));
  s.def(lin('wt', 0, 0, 0, 1, [[0, '#46b4d6'], [1, '#1d86b8']]));
  s.def(lin('deck', 0, 0, 0, 1, [[0, '#ece4d2'], [1, '#cdbfa4']]));
  s.def(rad('shine', 0.5, 0.5, 0.5, [[0, '#fff', 0.5], [1, '#fff', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  // 高窗
  for (let i = 0; i < 5; i++) s.add(`<rect x="${40 + i * 150}" y="30" width="110" height="110" fill="#bfe3f5"/><path d="M${40 + i * 150} 85H${150 + i * 150}M${95 + i * 150} 30V140" stroke="#fff" stroke-width="6"/><rect x="${40 + i * 150}" y="30" width="110" height="110" fill="none" stroke="#9fb0ba" stroke-width="5"/>`);
  s.add('<rect y="190" width="800" height="12" fill="#5a8fb0" opacity="0.7"/>');
  // 池邊與水
  s.add('<rect y="200" width="800" height="70" fill="url(#deck)"/><rect y="266" width="800" height="10" fill="#fff"/>');
  s.add('<rect y="276" width="800" height="324" fill="url(#wt)"/>');
  // 水波與光斑
  for (let i = 0; i < 40; i++) { const x = R() * 800, y = 290 + R() * 300, w = 30 + R() * 90; s.add(`<path d="M${x.toFixed(0)} ${y.toFixed(0)}q${w / 4} -8 ${w / 2} 0t${w / 2} 0" stroke="#fff" stroke-width="2.5" fill="none" opacity="${(0.15 + R() * 0.3).toFixed(2)}"/>`); }
  for (let i = 0; i < 9; i++) s.add(`<ellipse cx="${60 + R() * 680}" cy="${320 + R() * 250}" rx="${30 + R() * 30}" ry="${8 + R() * 8}" fill="url(#shine)"/>`);
  // 池底瓷磚線
  s.add('<g stroke="#fff" opacity="0.12" stroke-width="2"><path d="M0 360H800M0 450H800M0 560H800"/><path d="M130 276L40 600M330 276L300 600M530 276L560 600M700 276L790 600"/></g>');
  // 分隔水道線
  const lane = (y, k) => { for (let i = 0; i < 24; i++) { const x = i * 36 * k + 8; s.add(`<ellipse cx="${x}" cy="${y}" rx="${14 * k}" ry="${6 * k}" fill="${i % 3 === 0 ? '#e8463a' : (i % 3 === 1 ? '#fff' : '#3a78c8')}"/>`); } s.add(`<path d="M0 ${y}H800" stroke="#fff" stroke-width="2" opacity="0.6"/>`); };
  lane(332, 0.9); lane(470, 1.2);
  // 泳者（頭戴泳帽、手臂划水）
  s.add('<g filter="url(#b2)" opacity="0.5"><ellipse cx="400" cy="410" rx="140" ry="26" fill="#fff"/></g>');
  s.add('<ellipse cx="410" cy="406" rx="70" ry="22" fill="#2a1b14" opacity="0.18"/>');
  s.add('<path d="M290 408Q360 388 440 398Q470 404 480 410L300 424Z" fill="#e6b896"/><path d="M300 424Q260 430 214 424" stroke="#e6b896" stroke-width="12" stroke-linecap="round"/>');
  s.add('<path d="M468 400Q516 376 560 368" stroke="#eec19a" stroke-width="15" stroke-linecap="round" fill="none"/><path d="M312 410Q276 372 238 372" stroke="#dba478" stroke-width="15" stroke-linecap="round" fill="none"/><ellipse cx="564" cy="367" rx="9" ry="7" fill="#eec19a"/><ellipse cx="234" cy="372" rx="9" ry="7" fill="#dba478"/>');
  s.add('<ellipse cx="456" cy="392" rx="34" ry="30" fill="#eec19a"/><path d="M424 392Q426 360 460 360Q490 362 488 392Q460 380 424 392Z" fill="#2c6fc4"/><ellipse cx="478" cy="396" rx="14" ry="10" fill="#1f1f1f" opacity="0.55"/><circle cx="470" cy="388" r="3" fill="#222"/>');
  s.add('<path d="M270 430Q360 440 440 424" stroke="#fff" stroke-width="5" fill="none" opacity="0.8" stroke-linecap="round"/>');
  // 水花
  for (let i = 0; i < 14; i++) s.add(`<circle cx="${230 + R() * 100}" cy="${340 + R() * 40}" r="${2 + R() * 4}" fill="#fff" opacity="0.8"/>`);
  for (let i = 0; i < 10; i++) s.add(`<circle cx="${520 + R() * 80}" cy="${340 + R() * 40}" r="${2 + R() * 4}" fill="#fff" opacity="0.8"/>`);
  // 救生員椅與泳圈
  s.add('<rect x="660" y="120" width="18" height="150" fill="#d9d9d9"/><rect x="716" y="120" width="18" height="150" fill="#bdbdbd"/><rect x="650" y="110" width="94" height="20" fill="#e8463a"/><path d="M660 200H734M660 236H734" stroke="#aaa" stroke-width="6"/>');
  s.add('<circle cx="120" cy="238" r="34" fill="none" stroke="#e8463a" stroke-width="16"/><path d="M120 204A34 34 0 0 1 154 238M120 272A34 34 0 0 1 86 238" stroke="#fff" stroke-width="16" fill="none"/>');
  s.add('<text x="360" y="246" font-size="30" font-weight="700" fill="#2c6fc4" text-anchor="middle" font-family="sans-serif" opacity="0.8">1.2m</text>');
  return s.out();
};

/* F4 露營 */
out.camping = () => {
  const s = Scene(); const R = rng(44);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#0b1230'], [0.6, '#27346a'], [1, '#6b5f8a']]));
  s.def(lin('gr', 0, 0, 0, 1, [[0, '#2f4a3a'], [1, '#1c2e26']]));
  s.def(lin('tent', 0, 0, 1, 0, [[0, '#e8913a'], [0.5, '#f2a850'], [1, '#c4702a']]));
  s.def(rad('fire', 0.5, 0.5, 0.5, [[0, '#ffd27a', 0.95], [0.4, '#ff9a3a', 0.55], [1, '#ff7a1a', 0]]));
  s.def(rad('moon', 0.5, 0.5, 0.5, [[0, '#fff8de', 1], [1, '#fff8de', 0]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  for (let i = 0; i < 110; i++) { const x = R() * 800, y = R() * 300, r = 0.6 + R() * 1.8; s.add(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(0.35 + R() * 0.65).toFixed(2)}"/>`); }
  s.add('<circle cx="650" cy="90" r="70" fill="url(#moon)" opacity="0.8"/><circle cx="650" cy="90" r="26" fill="#fff6d6"/>');
  s.add('<path d="M0 340Q120 250 240 320Q340 240 470 310Q600 230 800 330V600H0Z" fill="#162033"/><path d="M0 380Q200 320 420 370Q620 320 800 380V600H0Z" fill="#1d2b3b"/>');
  s.add('<g fill="#10241c"><path d="M40 400L70 300L100 400Z M70 410L110 290L150 410Z M690 400L725 280L760 400Z M730 410L765 310L800 410Z"/></g>');
  s.add('<rect y="400" width="800" height="200" fill="url(#gr)"/>');
  // 帳篷
  s.add(shadow(250, 500, 190, 14, 0.5));
  s.add('<path d="M70 500L250 250L430 500Z" fill="url(#tent)"/><path d="M250 250L430 500L300 500Z" fill="#000" opacity="0.18"/><path d="M200 500L250 330L300 500Z" fill="#2a1a10"/><path d="M250 330L300 500L270 500Z" fill="#000" opacity="0.3"/><path d="M250 250V500" stroke="#7a3f12" stroke-width="2"/>');
  s.add('<path d="M70 500L250 250" stroke="#7a3f12" stroke-width="3"/><path d="M430 500L250 250" stroke="#8a4a14" stroke-width="3"/><circle cx="250" cy="250" r="5" fill="#555"/>');
  s.add('<path d="M70 500L40 520M430 500L460 520" stroke="#ccc" stroke-width="2"/><circle cx="40" cy="520" r="4" fill="#bbb"/><circle cx="460" cy="520" r="4" fill="#bbb"/>');
  // 營火
  s.add('<circle cx="560" cy="500" r="170" fill="url(#fire)"/>');
  s.add('<g stroke="#4a2c14" stroke-width="13" stroke-linecap="round"><path d="M520 520L600 494"/><path d="M524 494L604 522"/><path d="M540 530L588 488"/></g>');
  s.add('<path d="M560 506Q526 480 548 446Q552 466 566 458Q564 426 584 408Q594 444 604 458Q620 472 598 506Z" fill="#ff8a24"/><path d="M562 506Q542 488 558 470Q562 482 570 478Q572 462 582 452Q590 474 592 484Q598 498 582 506Z" fill="#ffd45a"/>');
  for (let i = 0; i < 16; i++) s.add(`<circle cx="${550 + (R() - 0.5) * 80}" cy="${380 + R() * 100}" r="${1 + R() * 2}" fill="#ffc15a" opacity="${(0.4 + R() * 0.6).toFixed(2)}"/>`);
  // 圍坐的人
  s.add('<rect x="395" y="482" width="110" height="22" rx="10" fill="#6b4a2f"/><rect x="640" y="474" width="110" height="22" rx="10" fill="#6b4a2f"/>');
  s.add(person(s, { x: 450, y: 380, h: 290, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#c9524a', bottom: '#2f3f5a', pose: 'sit', legs: 'sit', sleeve: 'long', shoe: '#3a2a22' }));
  s.add(person(s, { x: 690, y: 374, h: 300, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#4f7aa6', bottom: '#2c3140', pose: 'sit', legs: 'sit', sleeve: 'long', shoe: '#3a2a22' }));
  s.add('<rect x="0" y="0" width="800" height="600" fill="#ffb060" opacity="0.06"/>');
  return s.out();
};

/* F5 野餐 */
out.picnic = () => {
  const s = Scene(); const R = rng(45);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#8cc9f0'], [1, '#e9f3df']]));
  s.def(lin('gr', 0, 0, 0, 1, [[0, '#8cc05a'], [1, '#5b9640']]));
  s.def(rad('leaf', 0.35, 0.3, 0.9, [[0, '#8cc25a'], [0.6, '#4f8f35'], [1, '#2e6224']]));
  s.def(lin('tr', 0, 0, 1, 0, [[0, '#4a3322'], [0.5, '#7a5a3d'], [1, '#3b281a']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><g filter="url(#b8)" opacity="0.9"><ellipse cx="200" cy="90" rx="120" ry="26" fill="#fff"/><ellipse cx="560" cy="60" rx="140" ry="22" fill="#fff"/></g>');
  s.add('<g filter="url(#b4)"><ellipse cx="120" cy="300" rx="190" ry="80" fill="#78ae60"/><ellipse cx="620" cy="300" rx="230" ry="90" fill="#82b868"/></g>');
  s.add('<rect y="300" width="800" height="300" fill="url(#gr)"/>');
  // 大樹
  s.add('<path d="M90 360Q100 220 84 120L128 120Q116 230 140 360Z" fill="url(#tr)"/>');
  [[40, 90, 90], [140, 70, 100], [100, 30, 80], [190, 110, 70], [0, 150, 70]].forEach(([x, y, r]) => s.add(`<circle cx="${x + 60}" cy="${y + 20}" r="${r}" fill="url(#leaf)"/>`));
  s.add('<ellipse cx="300" cy="400" rx="150" ry="24" fill="#2e5a28" opacity="0.28" filter="url(#b8)"/>');
  // 野餐墊（格紋，透視）
  s.add(shadow(430, 548, 290, 20, 0.3));
  s.add('<path d="M170 450L720 450L790 570L100 570Z" fill="#f4efe6"/>');
  for (let i = 0; i < 12; i++) { const t = i / 11; const xa = 170 + t * 550, xb = 100 + t * 690; s.add(`<path d="M${xa} 450L${xb} 570" stroke="#d9473f" stroke-width="${6 + t * 4}" opacity="0.55"/>`); }
  for (let i = 0; i < 6; i++) { const y = 450 + i * i * 3.4 + i * 8; const k = (y - 450) / 120; s.add(`<path d="M${170 - k * 70} ${y}H${720 + k * 70}" stroke="#d9473f" stroke-width="${5 + k * 4}" opacity="0.5"/>`); }
  s.add('<path d="M170 450L720 450L790 570L100 570Z" fill="none" stroke="#c23a32" stroke-width="3"/>');
  // 籃子
  s.add('<rect x="560" y="470" width="120" height="70" rx="10" fill="#b98350"/><path d="M560 490H680M560 512H680" stroke="#8a5e34" stroke-width="3"/><path d="M572 470Q620 400 668 470" stroke="#8a5e34" stroke-width="7" fill="none"/><path d="M576 472Q620 430 664 472L650 480Q620 450 590 480Z" fill="#f4efe6" opacity="0.9"/>');
  // 食物：三明治、水果、飲料
  s.add('<g transform="translate(300 500)"><ellipse cx="60" cy="40" rx="62" ry="16" fill="#fff"/><path d="M14 36L60 6L106 36Z" fill="#f0d29a"/><path d="M14 36H106" stroke="#7bb056" stroke-width="6"/><path d="M14 42H106" stroke="#d9573a" stroke-width="5"/><path d="M14 46H106L60 52Z" fill="#f0d29a"/></g>');
  s.add('<g transform="translate(430 515)"><ellipse cx="50" cy="26" rx="50" ry="14" fill="#fff"/><circle cx="26" cy="14" r="12" fill="#d9362b"/><circle cx="52" cy="10" r="12" fill="#e6572b"/><circle cx="76" cy="16" r="12" fill="#f2b632"/><path d="M52 -4Q56 -12 62 -12" stroke="#4a7a3a" stroke-width="3" fill="none"/></g>');
  s.add('<g transform="translate(215 490)"><rect width="30" height="60" rx="6" fill="#e9a23a"/><rect x="4" y="-12" width="22" height="14" rx="3" fill="#6b4a2f"/></g><g transform="translate(250 500)"><rect width="26" height="50" rx="6" fill="#4f86c2"/><rect x="3" y="-10" width="20" height="12" rx="3" fill="#6b4a2f"/></g>');
  // 人：坐在墊子上的兩人
  s.add(person(s, { x: 300, y: 380, h: 280, skin: 'light', hair: '#2a1b14', hairStyle: 'long', top: '#f2c14e', bottom: '#4a5a8a', pose: 'hold', legs: 'none', sleeve: 'short' }));
  s.add(person(s, { x: 600, y: 395, h: 250, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#d9573a', bottom: '#333', pose: 'wave', legs: 'none', sleeve: 'short' }));
  // 風箏
  s.add('<path d="M660 70L700 110L660 150L620 110Z" fill="#e8463a"/><path d="M660 70V150M620 110H700" stroke="#fff" stroke-width="2"/><path d="M660 150Q640 220 600 330" stroke="#555" stroke-width="2" fill="none"/>');
  return s.out();
};

/* F6 夜晚看星星 */
out.stars = () => {
  const s = Scene(); const R = rng(46);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#050a22'], [0.5, '#16256a'], [1, '#5a4a8a']]));
  s.def(rad('milk', 0.5, 0.5, 0.5, [[0, '#c9d4ff', 0.55], [1, '#c9d4ff', 0]]));
  s.def(lin('hill', 0, 0, 0, 1, [[0, '#1c2433'], [1, '#0c1018']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<g transform="rotate(-28 400 200)"><ellipse cx="420" cy="200" rx="480" ry="70" fill="url(#milk)" filter="url(#b16)"/></g>');
  for (let i = 0; i < 260; i++) { const x = R() * 800, y = R() * 420, r = 0.5 + R() * 1.7; s.add(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(0.3 + R() * 0.7).toFixed(2)}"/>`); }
  [[120, 90], [300, 60], [560, 130], [690, 50]].forEach(([x, y]) => s.add(`<path d="M${x - 14} ${y}H${x + 14}M${x} ${y - 14}V${y + 14}" stroke="#fff" stroke-width="1.5" opacity="0.8"/><circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`));
  // 流星
  s.add('<path d="M580 60L470 130" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.9"/><path d="M580 60L520 98" stroke="#fff" stroke-width="1.5" opacity="0.6"/>');
  // 遠山與城市燈光
  s.add('<path d="M0 420Q150 360 300 410Q460 350 640 410Q730 380 800 400V600H0Z" fill="#141b2c"/>');
  for (let i = 0; i < 40; i++) s.add(`<circle cx="${20 + R() * 330}" cy="${420 + R() * 30}" r="1.4" fill="#ffd28a" opacity="${(0.4 + R() * 0.5).toFixed(2)}"/>`);
  s.add('<path d="M0 470Q200 430 420 480Q640 440 800 480V600H0Z" fill="url(#hill)"/>');
  // 躺在草地上看星星的兩人 —— 以站姿剪影風格表現：用兩個坐在山頂的人，頭仰起
  s.add('<ellipse cx="315" cy="545" rx="130" ry="14" fill="#000" opacity="0.5"/>');
  s.add(person(s, { x: 270, y: 385, h: 280, skin: 'light', hair: '#2a1b14', hairStyle: 'long', top: '#e8b6c0', bottom: '#2a3350', pose: 'wave', legs: 'sit', sleeve: 'long', shoe: '#ddd' }));
  s.add(person(s, { x: 360, y: 400, h: 270, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#4f86c2', bottom: '#2c3140', pose: 'sit', legs: 'sit', sleeve: 'long', shoe: '#ddd' }));
  // 小望遠鏡
  s.add('<g transform="translate(560 430)"><path d="M0 0L34 120M68 0L34 120M34 0V120" stroke="#6b6f78" stroke-width="5"/><g transform="rotate(-38 34 0)"><rect x="-20" y="-24" width="130" height="30" rx="8" fill="#d8dce2"/><rect x="100" y="-28" width="26" height="38" rx="6" fill="#444"/><rect x="-30" y="-18" width="16" height="18" fill="#444"/></g></g>');
  s.add('<rect x="0" y="0" width="800" height="600" fill="#102a6a" opacity="0.08"/>');
  return s.out();
};

/* F7 泡茶 */
out.tea = () => {
  const s = Scene(); const R = rng(47);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#d9c8a6'], [1, '#bfa87f']]));
  s.def(lin('tbl', 0, 0, 0, 1, [[0, '#9a6a3e'], [1, '#6e4624']]));
  s.def(lin('pot', 0, 0, 1, 0, [[0, '#7a3a2a'], [0.45, '#b4604a'], [1, '#5a2619']]));
  s.def(lin('cup', 0, 0, 0, 1, [[0, '#fbf8f0'], [1, '#d9d2c0']]));
  s.def(rad('warm', 0.5, 0.4, 0.6, [[0, '#ffe3a0', 0.5], [1, '#ffe3a0', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  // 窗與竹簾
  s.add('<rect x="540" y="50" width="200" height="220" fill="#cfe3d4"/><g stroke="#8a7a52" stroke-width="2" opacity="0.8">' + Array.from({ length: 22 }, (_, i) => `<path d="M540 ${50 + i * 10}H740"/>`).join('') + '</g><rect x="540" y="50" width="200" height="220" fill="none" stroke="#6b4a2f" stroke-width="8"/>');
  // 掛畫
  s.add('<rect x="90" y="70" width="130" height="190" fill="#efe6cf" stroke="#6b4a2f" stroke-width="7"/><path d="M110 220Q140 150 160 230M150 220Q180 130 200 230" stroke="#2f4a3a" stroke-width="4" fill="none"/><circle cx="170" cy="120" r="18" fill="#c9423a" opacity="0.8"/>');
  s.add('<circle cx="400" cy="300" r="330" fill="url(#warm)"/>');
  // 茶桌
  s.add('<path d="M0 380H800V600H0Z" fill="url(#tbl)"/><path d="M0 380H800" stroke="#c99a62" stroke-width="4"/><g stroke="#4a2c14" stroke-width="2" opacity="0.2"><path d="M0 430H800M0 500H800M0 560H800"/></g>');
  // 茶盤
  s.add(shadow(400, 560, 300, 18, 0.35));
  s.add('<path d="M120 440H680L720 540H80Z" fill="#4a3220"/><path d="M130 446H670L706 534H94Z" fill="#6a4a2c"/><g stroke="#2a1608" stroke-width="2" opacity="0.5"><path d="M180 452L150 534M300 452L290 534M420 452V534M540 452L550 534M660 452L690 534"/></g>');
  // 茶壺
  const px = 400, py = 340;
  s.add(shadow(px, 442, 90, 9, 0.4));
  s.add(`<path d="M${px - 70} ${py + 40}Q${px - 78} ${py - 40} ${px} ${py - 48}Q${px + 78} ${py - 40} ${px + 70} ${py + 40}Q${px + 60} ${py + 92} ${px} ${py + 96}Q${px - 60} ${py + 92} ${px - 70} ${py + 40}Z" fill="url(#pot)"/>`);
  s.add(`<path d="M${px - 40} ${py - 40}Q${px} ${py - 66} ${px + 40} ${py - 40}Z" fill="#a45540"/><circle cx="${px}" cy="${py - 62}" r="10" fill="#8a3f2c"/>`);
  s.add(`<path d="M${px + 66} ${py - 6}Q${px + 130} ${py - 50} ${px + 134} ${py - 76}L${px + 122} ${py - 80}Q${px + 112} ${py - 40} ${px + 62} ${py + 24}Z" fill="#a45540"/>`);
  s.add(`<path d="M${px - 70} ${py - 6}Q${px - 120} ${py - 8} ${px - 114} ${py + 44}Q${px - 108} ${py + 82} ${px - 64} ${py + 72}" stroke="#8a3f2c" stroke-width="16" fill="none" stroke-linecap="round"/>`);
  s.add(`<ellipse cx="${px - 20}" cy="${py - 10}" rx="26" ry="38" fill="#fff" opacity="0.14" transform="rotate(20 ${px - 20} ${py - 10})"/>`);
  // 茶杯
  [[220, 470], [250, 505], [560, 470], [590, 505]].forEach(([x, y]) => { s.add(shadow(x, y + 28, 36, 7, 0.35)); s.add(`<path d="M${x - 34} ${y - 10}H${x + 34}Q${x + 30} ${y + 28} ${x} ${y + 30}Q${x - 30} ${y + 28} ${x - 34} ${y - 10}Z" fill="url(#cup)"/><ellipse cx="${x}" cy="${y - 10}" rx="34" ry="9" fill="#c98f3e"/><ellipse cx="${x}" cy="${y - 10}" rx="28" ry="6" fill="#e0aa52"/>`); });
  // 水氣
  [[px + 134, py - 80, 1], [px, py - 70, 0.8], [220, 455, 0.6], [560, 455, 0.6]].forEach(([x, y, k]) => { for (let j = 0; j < 3; j++) s.add(`<path d="M${x + j * 12 - 12} ${y}Q${x + j * 12 - 28} ${y - 40 * k} ${x + j * 12 - 8} ${y - 80 * k}Q${x + j * 12 + 10} ${y - 120 * k} ${x + j * 12 - 6} ${y - 150 * k}" stroke="#fff" stroke-width="${7 * k}" fill="none" stroke-linecap="round" opacity="0.28" filter="url(#b4)"/>`); });
  // 茶葉罐與盆栽
  s.add('<rect x="40" y="390" width="70" height="90" rx="8" fill="#2f5a46"/><rect x="40" y="390" width="70" height="16" rx="6" fill="#bfa070"/><rect x="52" y="420" width="46" height="34" fill="#e8dfc4"/>');
  s.add('<path d="M730 470Q700 400 740 340M740 470Q770 410 790 360" stroke="#4f7f46" stroke-width="6" fill="none"/><ellipse cx="742" cy="338" rx="22" ry="40" fill="#5f9456" transform="rotate(18 742 338)"/><path d="M706 470H776L766 520H716Z" fill="#c4704a"/>');
  return s.out();
};

/* F8 釣魚 */
out.fishing = () => {
  const s = Scene(); const R = rng(48);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#9ccbe8'], [1, '#f6e6c8']]));
  s.def(lin('wt', 0, 0, 0, 1, [[0, '#6fb0c4'], [1, '#2f7e96']]));
  s.def(lin('dock', 0, 0, 0, 1, [[0, '#b98556'], [1, '#7f5330']]));
  s.def(rad('sun', 0.7, 0.5, 0.6, [[0, '#fff2c0', 0.95], [1, '#fff2c0', 0]]));
  s.def(lin('mt', 0, 0, 0, 1, [[0, '#8fa8b8'], [1, '#b6c6cc']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="560" cy="250" r="240" fill="url(#sun)"/><circle cx="560" cy="250" r="34" fill="#fffbe6"/>');
  s.add('<g filter="url(#b8)" opacity="0.9"><ellipse cx="180" cy="90" rx="120" ry="24" fill="#fff"/><ellipse cx="620" cy="130" rx="110" ry="20" fill="#fff"/></g>');
  s.add('<path d="M0 300Q120 220 240 290Q330 240 430 300V320H0Z" fill="url(#mt)"/><path d="M430 316Q560 250 700 300Q760 280 800 300V320H430Z" fill="#a3b8c2"/>');
  s.add('<rect y="318" width="800" height="282" fill="url(#wt)"/>');
  for (let i = 0; i < 46; i++) { const x = R() * 800, y = 330 + R() * 260, w = 30 + R() * 80; s.add(`<path d="M${x.toFixed(0)} ${y.toFixed(0)}q${w / 4} -6 ${w / 2} 0t${w / 2} 0" stroke="#fff" stroke-width="2" fill="none" opacity="${(0.1 + R() * 0.3).toFixed(2)}"/>`); }
  s.add('<path d="M470 330L650 330M500 340L620 340M520 352L600 352" stroke="#fff3c4" stroke-width="5" opacity="0.5" stroke-linecap="round"/>');
  // 遠方小船
  s.add('<path d="M120 336H200L188 352H134Z" fill="#c4423a"/><path d="M160 336V298L192 336Z" fill="#fff"/><path d="M160 298V338" stroke="#555" stroke-width="2"/>');
  // 碼頭
  s.add('<path d="M0 470H800V510H0Z" fill="url(#dock)"/><path d="M0 470H800" stroke="#d7a876" stroke-width="4"/>');
  for (let i = 0; i < 16; i++) s.add(`<path d="M${i * 52} 470V510" stroke="#4a2c14" stroke-width="2" opacity="0.5"/>`);
  [[60, 510], [300, 510], [560, 510], [760, 510]].forEach(([x, y]) => s.add(`<rect x="${x - 10}" y="${y}" width="20" height="90" fill="#5f4128"/><path d="M${x - 10} ${y + 36}H${x + 10}" stroke="#8aa" stroke-width="2" opacity="0.4"/>`));
  s.add('<rect y="515" width="800" height="85" fill="#245f74" opacity="0.5"/>');
  // 人：坐在碼頭上釣魚
  s.add(person(s, { x: 250, y: 255, h: 330, skin: 'tan', hair: '#222', hairStyle: 'short', top: '#d9c36a', bottom: '#3a4a5c', pose: 'hold', legs: 'sit', sleeve: 'long', shoe: '#3a2a22' }));
  // 草帽
  s.add('<ellipse cx="250" cy="196" rx="44" ry="10" fill="#e8d6a0" stroke="#b89a58" stroke-width="2"/><path d="M222 196Q250 150 278 196Z" fill="#e8d6a0" stroke="#b89a58" stroke-width="2"/><path d="M222 194H278" stroke="#c4423a" stroke-width="4"/>');
  // 釣竿與線
  s.add('<path d="M254 330Q380 210 520 160Q600 130 668 126" stroke="#3a2a1e" stroke-width="5" fill="none" stroke-linecap="round"/>');
  s.add('<path d="M668 126Q676 250 672 380" stroke="#fff" stroke-width="1.5" opacity="0.85" fill="none"/><ellipse cx="672" cy="392" rx="16" ry="5" fill="none" stroke="#fff" stroke-width="2" opacity="0.7"/><circle cx="672" cy="384" r="6" fill="#e8463a"/><path d="M666 384H678" stroke="#fff" stroke-width="2"/>');
  // 桶子與魚
  s.add(shadow(130, 470, 50, 8, 0.4));
  s.add('<path d="M96 410H164L158 468H102Z" fill="#3a78c8"/><ellipse cx="130" cy="410" rx="34" ry="8" fill="#235a9a"/><path d="M96 410Q130 380 164 410" stroke="#999" stroke-width="3" fill="none"/>');
  s.add('<g transform="translate(110 404) rotate(-18)"><ellipse cx="24" cy="10" rx="24" ry="10" fill="#c9d4da"/><path d="M0 10L-14 0V20Z" fill="#a9b8c0"/><circle cx="38" cy="8" r="2.6" fill="#222"/><path d="M12 4Q26 12 12 18" stroke="#8a9aa4" fill="none"/></g>');
  s.add('<g><path d="M0 0" /></g>');
  return s.out();
};

module.exports = out;
