const { rng, lin, rad, Scene, shadow, person, shade } = require('./lib');
const out = {};
const sz = (h) => h / 7; // 人物單位

/* ---- 共用小物件 ---- */
const winFrame = (s, x, y, w, h, fillId, frame = '#e8e3d6') => {
  s.add(`<rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" fill="${frame}" rx="3"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${fillId})"/><path d="M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}" stroke="${frame}" stroke-width="5"/>`);
};
const plant = (s, x, y, sc = 1, pot = '#b5683e') => {
  s.add(shadow(x, y + 2, 34 * sc, 7 * sc, 0.35));
  for (let i = 0; i < 9; i++) { const a = -80 + i * 20; const l = (60 + (i % 3) * 18) * sc; const r = a * Math.PI / 180; s.add(`<path d="M${x} ${y - 30 * sc}Q${x + Math.sin(r) * l * 0.5} ${y - 30 * sc - l * 0.7} ${x + Math.sin(r) * l} ${y - 30 * sc - Math.cos(r) * l}Q${x + Math.sin(r) * l * 0.55 + 6} ${y - 30 * sc - l * 0.5} ${x} ${y - 30 * sc}Z" fill="${i % 2 ? '#3f8a47' : '#2f6f3a'}"/>`); }
  s.add(`<path d="M${x - 24 * sc} ${y - 34 * sc}H${x + 24 * sc}L${x + 18 * sc} ${y}H${x - 18 * sc}Z" fill="${pot}"/><rect x="${x - 26 * sc}" y="${y - 38 * sc}" width="${52 * sc}" height="${8 * sc}" fill="${shade(pot, 0.12)}"/>`);
};

/* 1 看醫生 */
out.doctor = () => {
  const s = Scene();
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#e6f0f2'], [1, '#cfe0e4']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#b9c3c7'], [1, '#8f9a9f']]));
  s.def(lin('bed', 0, 0, 0, 1, [[0, '#4d8fa6'], [1, '#356b80']]));
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#bfe3f5'], [1, '#f1f7e8']]));
  s.def(rad('lamp', 0.5, 0.2, 0.7, [[0, '#fffbe8', 0.75], [1, '#fffbe8', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="440" width="800" height="160" fill="url(#fl)"/><path d="M0 440H800" stroke="#fff" stroke-width="6" opacity="0.6"/>');
  s.add('<g opacity="0.2" stroke="#fff" stroke-width="2"><path d="M0 490H800M0 545H800M230 440L130 600M520 440L600 600"/></g>');
  s.add('<circle cx="400" cy="30" r="260" fill="url(#lamp)"/>');
  winFrame(s, 560, 70, 170, 150, 'sky');
  // 視力表
  s.add('<rect x="90" y="85" width="86" height="126" fill="#fff" stroke="#8a949a" stroke-width="3" rx="3"/>');
  [[16, 'E'], [13, 'F P'], [10, 'T O Z'], [8, 'L P E D'], [6, 'P E C F D']].forEach(([f, t], i) => s.add(`<text x="133" y="${108 + i * 22}" font-family="Arial" font-weight="700" font-size="${f + 4}" fill="#2a2e33" text-anchor="middle">${t}</text>`));
  // 人體圖
  s.add('<rect x="400" y="100" width="70" height="105" fill="#f6f1e2" stroke="#9aa3a8" stroke-width="2"/><circle cx="435" cy="125" r="11" fill="#e9b894"/><path d="M435 138V175M415 148H455M435 175L423 198M435 175L447 198" stroke="#c9524a" stroke-width="5" stroke-linecap="round"/>');
  // 櫃子與洗手台
  s.add('<rect x="0" y="330" width="100" height="125" fill="#f2f4f4" stroke="#aab4b8" stroke-width="2"/><rect x="8" y="338" width="84" height="52" fill="#e3e8e9"/><rect x="8" y="394" width="84" height="52" fill="#e3e8e9"/><circle cx="82" cy="364" r="3" fill="#888"/><circle cx="82" cy="420" r="3" fill="#888"/>');
  s.add('<rect x="14" y="298" width="22" height="32" rx="4" fill="#4f9d73"/><rect x="42" y="306" width="18" height="24" rx="3" fill="#d9a53c"/>');
  // 檢查床
  s.add(shadow(560, 556, 190, 16, 0.35));
  s.add('<rect x="380" y="440" width="360" height="40" rx="10" fill="url(#bed)"/><rect x="388" y="428" width="344" height="18" rx="9" fill="#f4f7f8"/><rect x="392" y="478" width="14" height="82" fill="#8f9aa0"/><rect x="714" y="478" width="14" height="82" fill="#8f9aa0"/>');
  // 病人（坐在床上）
  s.add(person(s, { x: 575, y: 232, h: 360, skin: 'tan', hair: '#1c1410', hairStyle: 'short', top: '#7aa86a', bottom: '#4a5568', pose: 'sit', legs: 'sit', sleeve: 'long', shoe: '#e9e4d6' }));
  // 醫生
  s.add(person(s, { x: 270, y: 130, h: 470, skin: 'light', hair: '#2a1b14', hairStyle: 'bun', top: '#f4f6f8', bottom: '#46566a', pose: 'hold', legs: 'stand', shoe: '#ffffff', glasses: true, collar: false }));
  // 聽診器
  s.add('<path d="M246 133Q236 190 250 218Q268 246 296 214Q312 190 296 133" stroke="#2b2f33" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="278" cy="238" r="12" fill="#c9ced2" stroke="#2b2f33" stroke-width="3"/>');
  // 病歷板
  s.add('<g transform="rotate(-8 330 306)"><rect x="318" y="262" width="64" height="86" rx="4" fill="#8a6a46"/><rect x="324" y="272" width="52" height="70" fill="#fff"/><path d="M330 286H370M330 298H370M330 310H360M330 322H366" stroke="#9aa3a8" stroke-width="3"/></g>');
  return s.out();
};

/* 2 打籃球 */
out.basketball = () => {
  const s = Scene(); const R = rng(21);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#7fb6e0'], [1, '#f4e8c8']]));
  s.def(lin('court', 0, 0, 0, 1, [[0, '#d9884a'], [1, '#b2622c']]));
  s.def(rad('ball', 0.35, 0.3, 0.8, [[0, '#f2924a'], [0.7, '#d4661f'], [1, '#9c4310']]));
  s.def(rad('sun', 0.85, 0.15, 0.7, [[0, '#fff3c4', 0.9], [1, '#fff3c4', 0]]));
  s.def(lin('board', 0, 0, 1, 1, [[0, '#ffffff'], [1, '#d7dde0']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="680" cy="80" r="280" fill="url(#sun)"/>');
  s.add('<g filter="url(#b4)"><ellipse cx="90" cy="285" rx="130" ry="90" fill="#6aa064"/><ellipse cx="330" cy="300" rx="150" ry="70" fill="#7aae6e"/><ellipse cx="610" cy="290" rx="150" ry="85" fill="#63995d"/></g>');
  // 圍籬
  s.add('<rect y="300" width="800" height="110" fill="#8fb49a" opacity="0.35"/>');
  s.add('<g stroke="#6d7a80" stroke-width="2" opacity="0.8">' + Array.from({ length: 36 }, (_, i) => `<path d="M${i * 24} 300V410"/>`).join('') + '<path d="M0 300H800M0 410H800"/></g>');
  s.add('<g stroke="#6d7a80" stroke-width="1.5" opacity="0.5">' + Array.from({ length: 6 }, (_, i) => `<path d="M0 ${320 + i * 16}H800"/>`).join('') + '</g>');
  s.add('<rect y="410" width="800" height="190" fill="url(#court)"/>');
  s.add('<g fill="none" stroke="#fff" stroke-width="5" opacity="0.9"><path d="M0 560H800"/><path d="M470 410L400 560M740 410L800 560"/><path d="M400 560Q600 500 800 560" /></g>');
  s.add('<g opacity="0.15" stroke="#4a2008" stroke-width="2"><path d="M0 460H800M0 510H800M200 410L90 600M600 410L690 600"/></g>');
  // 籃板與籃框（右）
  s.add('<rect x="676" y="130" width="14" height="300" fill="#5b6266"/><rect x="640" y="426" width="86" height="12" fill="#5b6266"/>');
  s.add('<path d="M690 232H640" stroke="#5b6266" stroke-width="10"/><rect x="590" y="120" width="26" height="132" fill="url(#board)" stroke="#aeb7bb" stroke-width="3" transform="skewY(0)"/>');
  s.add('<rect x="600" y="150" width="9" height="70" fill="none" stroke="#d9503c" stroke-width="3"/>');
  s.add('<ellipse cx="560" cy="232" rx="38" ry="9" fill="none" stroke="#e0502e" stroke-width="7"/><path d="M522 235L534 290M545 241L548 296M575 241L572 296M598 235L586 290M534 290Q560 304 586 290" stroke="#fff" stroke-width="3" fill="none" opacity="0.95"/>');
  // 背景小球員
  s.add(person(s, { x: 150, y: 330, h: 190, skin: 'light', hair: '#2a1b14', hairStyle: 'short', top: '#3f6fb5', bottom: '#222', pose: 'down', legs: 'stand', sleeve: 'short', shoe: '#eee', collar: false }));
  // 主角：跳投
  s.add(shadow(330, 548, 90, 14, 0.4));
  s.add(person(s, { x: 330, y: 160, h: 360, skin: 'mid', hair: '#171210', hairStyle: 'short', top: '#d9402e', bottom: '#2a2f45', pose: 'wave', legs: 'run', sleeve: 'short', shoe: '#ffffff', collar: false }));
  s.add('<circle cx="385" cy="76" r="26" fill="url(#ball)"/><path d="M359 76H411M385 50V102M367 58Q385 76 367 94M403 58Q385 76 403 94" stroke="#6b2a08" stroke-width="2" fill="none" opacity="0.7"/>');
  return s.out();
};

/* 3 彈吉他 */
out.guitar = () => {
  const s = Scene();
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#e8dcc6'], [1, '#d2c2a4']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#9b7048'], [1, '#6c4a2a']]));
  s.def(lin('dusk', 0, 0, 0, 1, [[0, '#35467a'], [0.6, '#d98a6a'], [1, '#f2c27a']]));
  s.def(lin('gt', 0, 0, 1, 1, [[0, '#e0a455'], [0.5, '#c77d2c'], [1, '#8a4a16']]));
  s.def(rad('lamp', 0.5, 0.5, 0.5, [[0, '#ffe4a8', 0.8], [1, '#ffe4a8', 0]]));
  s.def(lin('rug', 0, 0, 0, 1, [[0, '#a3523f'], [1, '#7a3a2c']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="430" width="800" height="170" fill="url(#fl)"/>');
  s.add('<g opacity="0.2" stroke="#2a1608" stroke-width="2"><path d="M0 480H800M0 535H800M180 430L90 600M420 430V600M650 430L730 600"/></g>');
  winFrame(s, 80, 80, 200, 190, 'dusk', '#f1ebdd');
  s.add('<circle cx="640" cy="120" r="140" fill="url(#lamp)" filter="url(#b8)"/>');
  s.add('<path d="M640 0V90" stroke="#333" stroke-width="2"/><path d="M610 112Q640 70 670 112Z" fill="#d9a53c"/><ellipse cx="640" cy="116" rx="28" ry="6" fill="#fff2c0"/>');
  // 海報
  s.add('<rect x="540" y="200" width="80" height="110" fill="#2f4858"/><circle cx="580" cy="250" r="26" fill="#e0a43c"/><path d="M552 300Q580 270 608 300Z" fill="#c9524a"/>');
  // 音箱
  s.add('<rect x="610" y="380" width="120" height="150" rx="6" fill="#2a2a2e"/><circle cx="670" cy="470" r="42" fill="#18181a" stroke="#555" stroke-width="3"/><circle cx="670" cy="470" r="18" fill="#2c2c30"/><circle cx="640" cy="398" r="5" fill="#d9a53c"/><circle cx="662" cy="398" r="5" fill="#d9a53c"/><circle cx="684" cy="398" r="5" fill="#d9a53c"/>');
  plant(s, 90, 560, 1.2);
  // 地毯
  s.add('<ellipse cx="400" cy="548" rx="260" ry="34" fill="url(#rug)"/><ellipse cx="400" cy="548" rx="230" ry="26" fill="none" stroke="#e8c98a" stroke-width="3" opacity="0.7"/>');
  // 椅子
  s.add(shadow(400, 560, 120, 14, 0.4));
  s.add('<rect x="320" y="388" width="170" height="22" rx="6" fill="#7a5230"/><rect x="338" y="410" width="12" height="140" fill="#5a3a20"/><rect x="460" y="410" width="12" height="140" fill="#5a3a20"/><rect x="372" y="410" width="10" height="130" fill="#4a2e18"/>');
  s.add(person(s, { x: 400, y: 190, h: 400, skin: 'light', hair: '#3a261c', hairStyle: 'long', top: '#6a8f7a', bottom: '#2f3f5a', pose: 'hold', legs: 'sit', sleeve: 'long', shoe: '#f4f0e6', collar: false }));
  // 吉他（斜放在身上，琴頸向左上）
  s.add('<g transform="rotate(-24 420 330)"><path d="M440 285C410 270 395 300 395 322C395 340 380 345 385 372C392 405 440 418 478 404C516 392 520 360 508 344C496 330 500 305 478 288C466 280 452 282 440 285Z" fill="url(#gt)"/><path d="M440 285C410 270 395 300 395 322C395 340 380 345 385 372C392 405 440 418 478 404C516 392 520 360 508 344C496 330 500 305 478 288C466 280 452 282 440 285Z" fill="none" stroke="#6a3a10" stroke-width="3"/><circle cx="446" cy="346" r="22" fill="#2a1a0e"/><circle cx="446" cy="346" r="26" fill="none" stroke="#e8c98a" stroke-width="3"/><rect x="474" y="368" width="34" height="8" rx="3" fill="#3a2410"/><rect x="296" y="318" width="116" height="16" fill="#4a2e18"/><path d="M296 326H412" stroke="#d9d2c0" stroke-width="1.5" opacity="0.7"/><path d="M296 322H410M296 330H410" stroke="#d9d2c0" stroke-width="1" opacity="0.6"/><rect x="270" y="312" width="32" height="28" rx="4" fill="#3a2410"/><g fill="#d9d2c0"><circle cx="278" cy="318" r="3"/><circle cx="278" cy="334" r="3"/><circle cx="292" cy="318" r="3"/><circle cx="292" cy="334" r="3"/></g></g>');
  // 音符
  s.add('<g fill="#fff" opacity="0.55" font-size="34" font-family="serif"><text x="250" y="260">♪</text><text x="228" y="214">♫</text><text x="560" y="190">♪</text></g>');
  return s.out();
};

/* 4 洗衣服／曬衣服 */
out.laundry = () => {
  const s = Scene(); const R = rng(33);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#8cc7ee'], [1, '#f2f4ea']]));
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#efe6d6'], [1, '#d9ccb4']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#b8b2a6'], [1, '#8c867a']]));
  s.def(lin('bk', 0, 0, 0, 1, [[0, '#e8c27a'], [1, '#b88a3c']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<g filter="url(#b8)" opacity="0.85"><ellipse cx="160" cy="90" rx="120" ry="30" fill="#fff"/><ellipse cx="560" cy="140" rx="140" ry="28" fill="#fff"/></g>');
  // 對面大樓
  s.add('<rect x="470" y="150" width="330" height="300" fill="#cdbfa8"/><g fill="#7fa3bd">' + Array.from({ length: 12 }, (_, i) => `<rect x="${490 + (i % 4) * 78}" y="${176 + Math.floor(i / 4) * 86}" width="50" height="58"/>`).join('') + '</g>');
  s.add('<rect x="0" y="400" width="800" height="200" fill="url(#fl)"/><path d="M0 400H800" stroke="#6e695f" stroke-width="6"/>');
  s.add('<rect x="0" y="380" width="800" height="22" fill="#6e695f"/><g stroke="#55514a" stroke-width="3">' + Array.from({ length: 34 }, (_, i) => `<path d="M${i * 24 + 8} 380V400"/>`).join('') + '</g>');
  // 晾衣桿
  s.add('<rect x="36" y="80" width="12" height="320" fill="#707880"/><rect x="752" y="80" width="12" height="320" fill="#707880"/><rect x="36" y="86" width="728" height="8" rx="4" fill="#a3abb2"/><rect x="36" y="140" width="728" height="6" rx="3" fill="#a3abb2" opacity="0.7"/>');
  // 衣服
  const cl = (x, y, w, h, c, kind) => {
    const sw = 2 + R() * 3;
    if (kind === 'tee') s.add(`<g transform="rotate(${sw} ${x + w / 2} ${y})"><path d="M${x} ${y + 18}L${x + 14} ${y}H${x + w - 14}L${x + w} ${y + 18}L${x + w - 14} ${y + 32}V${y + h}H${x + 14}V${y + 32}Z" fill="${c}"/><path d="M${x + 14} ${y}Q${x + w / 2} ${y + 16} ${x + w - 14} ${y}" fill="${shade(c, -0.2)}"/><path d="M${x + 14} ${y + 32}V${y + h}" stroke="#000" opacity="0.1" stroke-width="6"/></g><circle cx="${x + 14}" cy="${y - 3}" r="3" fill="#e8e0cc"/><circle cx="${x + w - 14}" cy="${y - 3}" r="3" fill="#e8e0cc"/>`);
    else if (kind === 'pants') s.add(`<g transform="rotate(${sw} ${x + w / 2} ${y})"><path d="M${x} ${y}H${x + w}L${x + w - 4} ${y + h}H${x + w / 2 + 4}L${x + w / 2} ${y + 24}L${x + w / 2 - 4} ${y + h}H${x + 4}Z" fill="${c}"/><path d="M${x} ${y + 8}H${x + w}" stroke="#000" opacity="0.15" stroke-width="3"/></g><circle cx="${x + 8}" cy="${y - 3}" r="3" fill="#e8e0cc"/><circle cx="${x + w - 8}" cy="${y - 3}" r="3" fill="#e8e0cc"/>`);
    else s.add(`<g transform="rotate(${sw} ${x + w / 2} ${y})"><path d="M${x} ${y}H${x + w}V${y + h}Q${x + w / 2} ${y + h + 8} ${x} ${y + h}Z" fill="${c}"/><path d="M${x + w / 3} ${y}V${y + h}M${x + w * 2 / 3} ${y}V${y + h}" stroke="#fff" opacity="0.5" stroke-width="3"/></g><circle cx="${x + 8}" cy="${y - 3}" r="3" fill="#e8e0cc"/><circle cx="${x + w - 8}" cy="${y - 3}" r="3" fill="#e8e0cc"/>`);
  };
  cl(70, 96, 64, 96, '#e8573e', 'tee'); cl(150, 96, 52, 118, '#3f6fb5', 'pants'); cl(222, 96, 70, 60, '#f0d46a', 'towel'); cl(540, 96, 64, 96, '#5aa27a', 'tee'); cl(624, 96, 56, 118, '#8a5aa0', 'pants'); cl(700, 96, 40, 90, '#e8e2d4', 'tee');
  cl(90, 152, 60, 70, '#e8a0b0', 'towel'); cl(580, 152, 60, 70, '#6fb0d0', 'towel');
  // 洗衣籃
  s.add(shadow(130, 566, 90, 12, 0.4));
  s.add('<path d="M50 470H210L196 566H64Z" fill="url(#bk)"/><path d="M50 470H210" stroke="#8a6020" stroke-width="8"/><g stroke="#8a6020" stroke-width="3" opacity="0.7"><path d="M56 500H204M60 530H200M92 470L98 566M130 470V566M168 470L162 566"/></g>');
  s.add('<path d="M70 476Q100 430 140 450Q170 430 196 474Z" fill="#f4f0e6"/><path d="M90 470Q120 440 150 466Z" fill="#6fb0d0"/>');
  // 人物：伸手掛衣服
  s.add(person(s, { x: 400, y: 190, h: 400, skin: 'mid', hair: '#2a1b14', hairStyle: 'ponytail', top: '#f0e6d0', bottom: '#4a6a8a', pose: 'wave', legs: 'stand', sleeve: 'short', shoe: '#f2f2f2', collar: false }));
  // 手上的衣服
  s.add('<g transform="rotate(8 520 80)"><path d="M486 112L494 84H546L554 112L546 124V170H494V124Z" fill="#d9a53c"/><path d="M494 84Q520 98 546 84" fill="#a67a1c"/></g>');
  return s.out();
};

/* 5 剪頭髮 */
out.haircut = () => {
  const s = Scene();
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#2f5a5c'], [1, '#234547']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#e8e2d4'], [1, '#bdb5a2']]));
  s.def(lin('mir', 0, 0, 1, 1, [[0, '#d9eaf0'], [0.5, '#a9c6d2'], [1, '#c9dde5']]));
  s.def(lin('chair', 0, 0, 0, 1, [[0, '#b83a30'], [1, '#7a241e']]));
  s.def(lin('cape', 0, 0, 1, 1, [[0, '#4a4f58'], [1, '#22252b']]));
  s.def(rad('lamp', 0.5, 0.5, 0.5, [[0, '#fff0c8', 0.85], [1, '#fff0c8', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="450" width="800" height="150" fill="url(#fl)"/>');
  s.add('<g opacity="0.25">' + Array.from({ length: 9 }, (_, i) => Array.from({ length: 3 }, (_, j) => `<rect x="${i * 100 + (j % 2) * 50 - 50}" y="${450 + j * 52}" width="50" height="52" fill="${(i + j) % 2 ? '#222' : '#fff'}"/>`).join('')).join('') + '</g>');
  // 鏡子
  s.add('<rect x="130" y="60" width="540" height="300" rx="6" fill="#e8e2d4"/><rect x="142" y="72" width="516" height="276" fill="url(#mir)"/><path d="M200 348L330 72H390L260 348ZM430 348L540 72H570L460 348Z" fill="#fff" opacity="0.22"/>');
  // 檯面
  s.add('<rect x="110" y="360" width="580" height="22" fill="#3a2a1e"/><rect x="120" y="382" width="560" height="74" fill="#1d3a3c"/>');
  s.add('<rect x="170" y="318" width="22" height="42" rx="4" fill="#6fb0d0"/><rect x="200" y="326" width="18" height="34" rx="3" fill="#e8a0b0"/><rect x="230" y="322" width="16" height="38" rx="3" fill="#f2f2f2"/><path d="M560 360V334L572 330V360Z" fill="#c9ced2"/><rect x="590" y="320" width="50" height="40" rx="5" fill="#d9a53c"/>');
  s.add('<circle cx="400" cy="20" r="200" fill="url(#lamp)"/><path d="M400 0V40" stroke="#222" stroke-width="2"/><path d="M370 66Q400 20 430 66Z" fill="#e8e2d4"/>');
  // 理髮椅
  s.add(shadow(450, 570, 150, 16, 0.45));
  s.add('<rect x="436" y="480" width="26" height="70" fill="#9aa0a4"/><ellipse cx="449" cy="556" rx="66" ry="14" fill="#6b7378"/><rect x="360" y="400" width="180" height="32" rx="12" fill="url(#chair)"/><rect x="520" y="440" width="14" height="46" fill="#7a8084"/><rect x="370" y="428" width="160" height="40" rx="10" fill="#8a2a22"/>');
  s.add('<path d="M390 506H510" stroke="#9aa0a4" stroke-width="12" stroke-linecap="round"/>');
  // 客人（坐著）
  s.add(person(s, { x: 450, y: 215, h: 380, skin: 'light', hair: '#4a3328', hairStyle: 'short', top: '#d9c27a', bottom: '#2c3140', pose: 'sit', legs: 'sit', sleeve: 'long', shoe: '#3a2a22', collar: false }));
  // 理髮披肩
  s.add('<path d="M408 228Q450 250 492 228L545 330L550 420L352 420L360 330Z" fill="url(#cape)"/><path d="M408 228Q450 252 492 228" stroke="#e8e2d4" stroke-width="8" fill="none"/><path d="M380 330L370 420M520 330L530 420" stroke="#000" opacity="0.2" stroke-width="4"/>');
  // 理髮師（左）
  s.add(person(s, { x: 285, y: 170, h: 440, skin: 'mid', hair: '#1a120e', hairStyle: 'short', top: '#f4f1ea', bottom: '#222', pose: 'phone', legs: 'stand', sleeve: 'short', shoe: '#222', collar: false }));
  // 圍裙
  s.add('<path d="M250 236H320L330 420H240Z" fill="#2b2b30" opacity="0.92"/>');
  // 剪刀與梳子
  s.add('<path d="M336 140L420 134" stroke="#d9dde0" stroke-width="4" stroke-linecap="round"/><path d="M336 144L418 150" stroke="#b9bfc4" stroke-width="4" stroke-linecap="round"/><circle cx="330" cy="136" r="7" fill="none" stroke="#c9524a" stroke-width="3"/><circle cx="330" cy="148" r="7" fill="none" stroke="#c9524a" stroke-width="3"/><path d="M426 160H446" stroke="#222" stroke-width="5" stroke-linecap="round" opacity="0"/>');
  s.add('<path d="M246 392H190" stroke="#222" stroke-width="3"/>');
  // 髮絲
  s.add('<g fill="#4a3328" opacity="0.85"><rect x="522" y="420" width="10" height="3"/><rect x="538" y="430" width="8" height="3"/><rect x="560" y="444" width="10" height="3"/></g>');
  return s.out();
};

/* 6 逛街買衣服 */
out.clothes = () => {
  const s = Scene(); const R = rng(46);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f1ece2'], [1, '#e0d8c8']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#c9a577'], [1, '#9a7448']]));
  s.def(lin('mir', 0, 0, 1, 1, [[0, '#e9f2f5'], [1, '#c3d6de']]));
  s.def(rad('lamp', 0.5, 0.5, 0.5, [[0, '#fff1cc', 0.7], [1, '#fff1cc', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="430" width="800" height="170" fill="url(#fl)"/>');
  s.add('<g opacity="0.2" stroke="#4a3018" stroke-width="2"><path d="M0 480H800M0 535H800M200 430L120 600M420 430V600M620 430L700 600"/></g>');
  s.add('<circle cx="200" cy="40" r="170" fill="url(#lamp)"/><circle cx="620" cy="40" r="170" fill="url(#lamp)"/>');
  // 左：掛衣架
  s.add('<rect x="20" y="108" width="260" height="8" rx="4" fill="#8a8f94"/><rect x="26" y="116" width="8" height="300" fill="#8a8f94"/><rect x="264" y="116" width="8" height="300" fill="#8a8f94"/>');
  const cols = ['#e8573e', '#3f6fb5', '#5aa27a', '#d9a53c', '#8a5aa0', '#e8a0b0', '#2f4858', '#f2efe6', '#6fb0d0', '#c9733a'];
  for (let i = 0; i < 9; i++) { const x = 42 + i * 26; const c = cols[i % cols.length]; s.add(`<path d="M${x} 108Q${x} 118 ${x + 4} 120" stroke="#777" stroke-width="2" fill="none"/><path d="M${x - 10} 122L${x + 4} 120L${x + 18} 122L${x + 20} 150V${i % 2 ? 250 : 300}H${x - 12}V150Z" fill="${c}"/><path d="M${x + 4} 120V${i % 2 ? 250 : 300}" stroke="#000" opacity="0.12" stroke-width="2"/>`); }
  // 右：疊好的衣服層架
  s.add('<rect x="600" y="140" width="180" height="290" fill="#cdb48a" stroke="#8a6a3c" stroke-width="4"/><path d="M600 236H780M600 332H780" stroke="#8a6a3c" stroke-width="5"/>');
  [[0, 0], [1, 1], [2, 2]].forEach(([r, k]) => { for (let j = 0; j < 3; j++) { const c = cols[(r * 3 + j + k) % cols.length]; for (let n = 0; n < 4; n++) s.add(`<rect x="${612 + j * 56}" y="${222 + r * 96 - n * 12}" width="50" height="12" rx="2" fill="${shade(c, n % 2 ? 0.1 : -0.08)}"/>`); } });
  // 全身鏡
  s.add('<rect x="300" y="86" width="150" height="350" rx="6" fill="#8a6a3c"/><rect x="310" y="96" width="130" height="330" fill="url(#mir)"/><path d="M320 420L390 98H415L345 420Z" fill="#fff" opacity="0.35"/>');
  s.add('<rect x="368" y="436" width="14" height="12" fill="#6a4c28"/>');
  // 購物袋
  s.add(shadow(620, 575, 60, 9, 0.4));
  s.add('<path d="M570 500H660L668 580H562Z" fill="#d9402e"/><path d="M590 500Q615 470 640 500" stroke="#7a2418" stroke-width="5" fill="none"/><path d="M562 580H668" stroke="#a02a1c" stroke-width="3"/><path d="M584 530H646" stroke="#fff" stroke-width="3" opacity="0.7"/>');
  // 顧客
  s.add(person(s, { x: 520, y: 140, h: 470, skin: 'light', hair: '#6a4a3a', hairStyle: 'long', top: '#f4f1ea', bottom: '#3d5a80', pose: 'hold', legs: 'stand', sleeve: 'short', shoe: '#f2f2f2', collar: false }));
  // 手上拿著衣服比在身上
  s.add('<path d="M492 205L508 184Q520 200 532 184L548 205L560 236L540 246V310H500V246L480 236Z" fill="#e8573e"/><path d="M508 184Q520 202 532 184" fill="#a02a1c"/><path d="M520 200V310" stroke="#000" opacity="0.12" stroke-width="3"/>');
  s.add('<path d="M520 168Q520 156 528 152" stroke="#777" stroke-width="3" fill="none"/>');
  return s.out();
};

/* 7 慶生 */
out.birthday = () => {
  const s = Scene(); const R = rng(57);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f6e4cc'], [1, '#e8c9a4']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#9c7048'], [1, '#6c4a2a']]));
  s.def(lin('tb', 0, 0, 0, 1, [[0, '#f4efe4'], [1, '#d9d0bc']]));
  s.def(lin('cake', 0, 0, 0, 1, [[0, '#fff6ea'], [1, '#ecd3b4']]));
  s.def(rad('flame', 0.5, 0.5, 0.5, [[0, '#fff3a0', 1], [0.4, '#ffb340', 0.85], [1, '#ff7a20', 0]]));
  s.def(rad('glow', 0.5, 0.6, 0.6, [[0, '#ffd89a', 0.6], [1, '#ffd89a', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="470" width="800" height="130" fill="url(#fl)"/>');
  // 旗串
  const fc = ['#e8573e', '#f0c14e', '#5aa27a', '#3f6fb5', '#e8a0b0'];
  s.add('<path d="M0 40Q200 120 400 50Q600 -10 800 70" stroke="#6a4a2a" stroke-width="3" fill="none"/>');
  for (let i = 0; i < 16; i++) { const t = i / 15; const x = 20 + t * 760; const y = 40 + Math.sin(t * Math.PI * 1.4) * 58 + (t > 0.5 ? -t * 30 + 20 : 0); s.add(`<path d="M${x - 16} ${y}L${x + 16} ${y + 4}L${x} ${y + 44}Z" fill="${fc[i % 5]}"/>`); }
  // 氣球
  const balloon = (x, y, c) => s.add(`<path d="M${x} ${y + 62}Q${x - 6} ${y + 120} ${x + 8} ${y + 190}" stroke="#777" stroke-width="2" fill="none"/><ellipse cx="${x}" cy="${y}" rx="34" ry="42" fill="${c}"/><ellipse cx="${x - 12}" cy="${y - 16}" rx="8" ry="13" fill="#fff" opacity="0.45"/><path d="M${x - 5} ${y + 42}L${x} ${y + 52}L${x + 5} ${y + 42}Z" fill="${shade(c, -0.2)}"/>`);
  balloon(60, 200, '#e8573e'); balloon(124, 250, '#f0c14e'); balloon(742, 210, '#3f6fb5'); balloon(680, 270, '#5aa27a');
  s.add('<circle cx="400" cy="360" r="260" fill="url(#glow)"/>');
  // 人物（站在桌後）
  s.add(person(s, { x: 165, y: 180, h: 440, skin: 'light', hair: '#3a2a22', hairStyle: 'long', top: '#e8a0b0', bottom: '#333', pose: 'table', legs: 'none', sleeve: 'short' }));
  s.add(person(s, { x: 318, y: 275, h: 310, skin: 'mid', hair: '#171210', hairStyle: 'ponytail', top: '#f0c14e', bottom: '#333', pose: 'table', legs: 'none', sleeve: 'short' }));
  s.add(person(s, { x: 484, y: 190, h: 430, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#4f6a8f', bottom: '#333', pose: 'table', legs: 'none', sleeve: 'long', glasses: true }));
  s.add(person(s, { x: 640, y: 215, h: 400, skin: 'light', hair: '#c9a66a', hairStyle: 'bun', top: '#5aa27a', bottom: '#333', pose: 'table', legs: 'none', sleeve: 'long' }));
  // 壽星帽
  s.add('<path d="M296 214L318 150L340 214Z" fill="#e8573e"/><circle cx="318" cy="148" r="7" fill="#f0c14e"/><path d="M304 200H332M308 186H328" stroke="#fff" stroke-width="3" opacity="0.8"/>');
  // 桌子
  s.add(shadow(400, 586, 340, 14, 0.4));
  s.add('<path d="M40 372H760L800 470H0Z" fill="url(#tb)"/><rect x="0" y="470" width="800" height="14" fill="#c9bfa8"/><rect x="0" y="484" width="800" height="100" fill="#a8523a"/><path d="M60 372H740" stroke="#fff" stroke-width="2" opacity="0.7"/>');
  s.add('<path d="M0 484Q50 500 100 484T200 484T300 484T400 484T500 484T600 484T700 484T800 484V500H0Z" fill="#e8573e" opacity="0.5"/>');
  // 蛋糕
  s.add(shadow(318, 456, 112, 16, 0.3));
  s.add('<ellipse cx="318" cy="440" rx="104" ry="26" fill="#e0c9a8"/><path d="M214 400V440Q318 478 422 440V400Z" fill="url(#cake)"/><ellipse cx="318" cy="400" rx="104" ry="26" fill="#fff9f0"/><path d="M214 400Q230 420 244 402Q260 426 278 404Q296 428 318 406Q340 430 358 404Q376 428 392 402Q408 422 422 400" fill="#e8a0b0"/><circle cx="260" cy="396" r="8" fill="#d9402e"/><circle cx="318" cy="388" r="8" fill="#d9402e"/><circle cx="376" cy="396" r="8" fill="#d9402e"/>');
  [[274, 392], [300, 384], [336, 384], [362, 392]].forEach(([x, y], i) => s.add(`<rect x="${x - 3}" y="${y - 34}" width="7" height="36" rx="2" fill="${fc[i]}"/><circle cx="${x}" cy="${y - 44}" r="18" fill="url(#flame)"/><path d="M${x} ${y - 52}Q${x + 5} ${y - 42} ${x} ${y - 34}Q${x - 5} ${y - 42} ${x} ${y - 52}Z" fill="#fff6c0"/>`));
  // 盤子與杯子、禮物
  s.add('<ellipse cx="560" cy="428" rx="40" ry="12" fill="#fff"/><ellipse cx="560" cy="426" rx="28" ry="7" fill="#e8e2d4"/><ellipse cx="640" cy="432" rx="40" ry="12" fill="#fff"/><path d="M92 410h26l-4 34H96z" fill="#e8573e"/><path d="M130 412h26l-4 34h-18z" fill="#3f6fb5"/>');
  s.add('<rect x="680" y="404" width="62" height="48" fill="#3f6fb5"/><rect x="706" y="404" width="10" height="48" fill="#f0c14e"/><rect x="680" y="424" width="62" height="9" fill="#f0c14e"/><path d="M711 404Q690 380 700 394Q708 400 711 404Q714 400 722 394Q732 380 711 404Z" fill="#f0c14e"/>');
  return s.out();
};

/* 8 寫作業 */
out.homework = () => {
  const s = Scene(); const R = rng(68);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#d8e2d6'], [1, '#b9c9b8']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#a88458'], [1, '#745630']]));
  s.def(lin('night', 0, 0, 0, 1, [[0, '#16233f'], [1, '#2f4a6b']]));
  s.def(lin('desk', 0, 0, 0, 1, [[0, '#d9b078'], [1, '#a87c44']]));
  s.def(rad('lamp', 0.5, 0.35, 0.6, [[0, '#ffe9b0', 0.9], [1, '#ffe9b0', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="470" width="800" height="130" fill="url(#fl)"/>');
  s.add('<g opacity="0.2" stroke="#2a1608" stroke-width="2"><path d="M0 520H800M0 568H800"/></g>');
  winFrame(s, 80, 60, 190, 220, 'night', '#f1ebdd');
  s.add('<g fill="#fff" opacity="0.9"><circle cx="120" cy="100" r="2"/><circle cx="210" cy="130" r="2"/><circle cx="170" cy="86" r="1.6"/><circle cx="240" cy="96" r="2"/></g><path d="M200 120a22 22 0 1 0 14 40a18 18 0 1 1 -14 -40Z" fill="#f4e7b0"/>');
  // 書架
  s.add('<rect x="560" y="70" width="190" height="8" fill="#6a4a2a"/><rect x="560" y="170" width="190" height="8" fill="#6a4a2a"/>');
  const bc = ['#e8573e', '#3f6fb5', '#5aa27a', '#d9a53c', '#8a5aa0', '#2f4858'];
  for (let i = 0; i < 9; i++) s.add(`<rect x="${566 + i * 20}" y="${78 + (i % 3) * 6}" width="17" height="${92 - (i % 3) * 6}" fill="${bc[i % 6]}"/>`);
  for (let i = 0; i < 7; i++) s.add(`<rect x="${570 + i * 24}" y="${126 + 52 - 46 + 8}" width="0" height="0"/>`);
  s.add('<circle cx="640" cy="215" r="24" fill="#e8d9a8"/><circle cx="640" cy="215" r="20" fill="none" stroke="#6a4a2a" stroke-width="3"/><path d="M640 215V203M640 215L650 220" stroke="#333" stroke-width="2"/>');
  s.add('<circle cx="215" cy="300" r="170" fill="url(#lamp)" filter="url(#b8)"/>');
  // 家長（坐在右側）
  s.add(person(s, { x: 520, y: 215, h: 400, skin: 'light', hair: '#3a2a22', hairStyle: 'long', top: '#c9737a', bottom: '#3d4a5c', pose: 'down', legs: 'sit', sleeve: 'long', shoe: '#3a2a22' }));
  // 孩子
  s.add(person(s, { x: 330, y: 270, h: 320, skin: 'mid', hair: '#171210', hairStyle: 'short', top: '#f0c14e', bottom: '#333', pose: 'table', legs: 'none', sleeve: 'short' }));
  // 書桌
  s.add(shadow(360, 580, 280, 14, 0.4));
  s.add('<path d="M90 402H640L670 450H60Z" fill="#e8c898"/><rect x="60" y="450" width="610" height="22" fill="url(#desk)"/><rect x="82" y="472" width="22" height="108" fill="#8a5c34"/><rect x="626" y="472" width="22" height="108" fill="#8a5c34"/><rect x="480" y="472" width="140" height="70" fill="#b98a54" stroke="#8a5c34" stroke-width="3"/><circle cx="550" cy="500" r="4" fill="#4a3018"/>');
  // 檯燈
  s.add('<rect x="192" y="388" width="46" height="14" rx="4" fill="#3a4a5a"/><path d="M214 388L200 330L238 296" stroke="#3a4a5a" stroke-width="7" fill="none" stroke-linejoin="round"/><path d="M218 270L268 304L244 318L204 292Z" fill="#e8573e"/><path d="M213 296L254 320L246 326L206 300Z" fill="#fff4c4" opacity="0.9"/>');
  // 桌上物品
  s.add('<rect x="252" y="394" width="140" height="10" fill="#fff" transform="skewX(-20)" opacity="0"/><path d="M262 380L392 380L410 410L240 410Z" fill="#fff"/><path d="M270 388H386M266 396H394M262 404H400" stroke="#9aa3a8" stroke-width="1.5"/><path d="M300 392L316 384" stroke="#d9402e" stroke-width="3"/>');
  s.add('<rect x="96" y="372" width="86" height="26" fill="#3f6fb5"/><rect x="102" y="350" width="76" height="22" fill="#e8573e"/><rect x="108" y="330" width="64" height="20" fill="#5aa27a"/><rect x="560" y="380" width="44" height="26" rx="4" fill="#d9a53c"/><path d="M570 380L574 356M580 380V352M590 380L588 358" stroke="#3a4a5a" stroke-width="4"/>');
  return s.out();
};

/* 9 遛狗 */
out.dogwalk = () => {
  const s = Scene(); const R = rng(79);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#7fa8d8'], [0.6, '#f2c694'], [1, '#f8e2b8']]));
  s.def(lin('river', 0, 0, 0, 1, [[0, '#d9b08a'], [1, '#6f8fb0']]));
  s.def(lin('grass', 0, 0, 0, 1, [[0, '#7bb356'], [1, '#4a8a3a']]));
  s.def(lin('path', 0, 0, 0, 1, [[0, '#d8c8a8'], [1, '#b8a47e']]));
  s.def(rad('sun', 0.5, 0.5, 0.5, [[0, '#fff3c4', 0.95], [1, '#ffd89a', 0]]));
  s.def(rad('dog', 0.4, 0.3, 0.8, [[0, '#e8b46a'], [0.7, '#c98a3c'], [1, '#8a5a1c']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="560" cy="250" r="190" fill="url(#sun)"/><circle cx="560" cy="250" r="34" fill="#fff6d0"/>');
  s.add('<g filter="url(#b8)" opacity="0.8"><ellipse cx="150" cy="110" rx="130" ry="22" fill="#fbe3c4"/><ellipse cx="640" cy="80" rx="150" ry="20" fill="#f8d4b0"/></g>');
  s.add('<path d="M0 270Q120 240 240 262T500 258T800 262V330H0Z" fill="#5d7f66" opacity="0.7" filter="url(#b2)"/>');
  s.add('<rect y="290" width="800" height="90" fill="url(#river)"/><g stroke="#fff" stroke-width="2" opacity="0.4"><path d="M50 320H150M300 340H420M560 312H700M120 360H220"/></g><path d="M470 292L650 292L620 380H500Z" fill="#fff3c4" opacity="0.35" filter="url(#b4)"/>');
  // 橋
  s.add('<rect y="380" width="800" height="220" fill="url(#grass)"/>');
  s.add('<path d="M0 500Q300 470 800 500V600H0Z" fill="url(#path)"/><path d="M0 500Q300 470 800 500" stroke="#f0e6cc" stroke-width="4" fill="none" opacity="0.7"/>');
  // 樹
  const tree = (x, y, sc) => { s.add(`<path d="M${x - 10 * sc} ${y}Q${x - 6 * sc} ${y - 90 * sc} ${x - 8 * sc} ${y - 130 * sc}L${x + 12 * sc} ${y - 130 * sc}Q${x + 8 * sc} ${y - 80 * sc} ${x + 14 * sc} ${y}Z" fill="#5a3d27"/>`); [[-40, -150, 70], [30, -170, 80], [0, -210, 70], [-10, -140, 90]].forEach(([dx, dy, r]) => s.add(`<circle cx="${x + dx * sc}" cy="${y + dy * sc}" r="${r * sc}" fill="${r > 75 ? '#4f9a46' : '#3f8a3a'}"/>`)); s.add(shadow(x, y + 6, 60 * sc, 10 * sc, 0.3)); };
  tree(70, 440, 1.05); tree(740, 430, 0.95);
  // 長椅
  s.add('<rect x="590" y="400" width="130" height="8" fill="#7a5230"/><rect x="590" y="416" width="130" height="8" fill="#7a5230"/><rect x="598" y="424" width="8" height="36" fill="#4a2e18"/><rect x="706" y="424" width="8" height="36" fill="#4a2e18"/><rect x="598" y="380" width="8" height="30" fill="#4a2e18"/><rect x="706" y="380" width="8" height="30" fill="#4a2e18"/><rect x="590" y="376" width="130" height="8" fill="#7a5230"/>');
  // 人
  s.add(person(s, { x: 270, y: 150, h: 430, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#d9a53c', bottom: '#33394a', pose: 'down', legs: 'walk', sleeve: 'long', shoe: '#f2f2f2', collar: false }));
  // 狗
  const dx = 520, dy = 530;
  s.add(shadow(dx, dy + 40, 100, 12, 0.4));
  s.add(`<path d="M${dx - 78} ${dy - 20}Q${dx - 120} ${dy - 50} ${dx - 106} ${dy - 80}Q${dx - 92} ${dy - 56} ${dx - 70} ${dy - 42}Z" fill="#c98a3c"/>`);
  s.add(`<rect x="${dx - 56}" y="${dy + 4}" width="16" height="40" rx="7" fill="#b87a30"/><rect x="${dx + 34}" y="${dy + 4}" width="16" height="40" rx="7" fill="#b87a30"/>`);
  s.add(`<ellipse cx="${dx}" cy="${dy - 12}" rx="84" ry="44" fill="url(#dog)"/><path d="M${dx - 60} ${dy + 10}Q${dx} ${dy + 24} ${dx + 60} ${dy + 10}Q${dx} ${dy + 34} ${dx - 60} ${dy + 10}Z" fill="#f0d49a" opacity="0.7"/>`);
  s.add(`<rect x="${dx - 38}" y="${dy + 4}" width="16" height="42" rx="7" fill="#d9a050"/><rect x="${dx + 54}" y="${dy + 4}" width="16" height="42" rx="7" fill="#d9a050"/>`);
  s.add(`<ellipse cx="${dx + 82}" cy="${dy - 52}" rx="34" ry="30" fill="url(#dog)"/><path d="M${dx + 74} ${dy - 78}Q${dx + 58} ${dy - 56} ${dx + 66} ${dy - 36}Q${dx + 80} ${dy - 50} ${dx + 82} ${dy - 74}Z" fill="#7a4a14"/><ellipse cx="${dx + 108}" cy="${dy - 44}" rx="20" ry="15" fill="#f0d49a"/><ellipse cx="${dx + 124}" cy="${dy - 48}" rx="6" ry="5" fill="#2a1a10"/><circle cx="${dx + 92}" cy="${dy - 58}" r="4" fill="#2a1a10"/><path d="M${dx + 102} ${dy - 34}Q${dx + 110} ${dy - 28} ${dx + 118} ${dy - 36}" stroke="#2a1a10" stroke-width="2" fill="none"/><path d="M${dx + 106} ${dy - 32}Q${dx + 112} ${dy - 14} ${dx + 108} ${dy - 12}Q${dx + 102} ${dy - 22} ${dx + 104} ${dy - 32}Z" fill="#e8808a"/>`);
  s.add(`<path d="M${dx + 60} ${dy - 28}Q${dx + 82} ${dy - 20} ${dx + 100} ${dy - 28}" stroke="#d9402e" stroke-width="7" fill="none" stroke-linecap="round"/>`);
  // 牽繩：手 (270+0.9*s, 150+2.15*s)，s=430/7
  const sx = 270 + 0.9 * (430 / 7), sy = 150 + 2.15 * (430 / 7);
  s.add(`<path d="M${sx} ${sy}Q${(sx + dx + 80) / 2} ${sy + 80} ${dx + 82} ${dy - 28}" stroke="#d9402e" stroke-width="3" fill="none"/>`);
  return s.out();
};

module.exports = out;
