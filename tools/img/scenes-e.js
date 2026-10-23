const { rng, lin, rad, Scene, shadow, person, shade } = require('./lib');
const out = {};
const F = (n) => n.toFixed(1);
const FONT = "'Noto Sans TC','PingFang TC','Microsoft JhengHei',sans-serif";

/* 1 下雪 */
out.snow = () => {
  const s = Scene(); const R = rng(31);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#3f5179'], [0.55, '#8a9dc0'], [1, '#dbe3f1']]));
  s.def(lin('gnd', 0, 0, 0, 1, [[0, '#f6f9fd'], [1, '#c8d4e8']]));
  s.def(lin('cab', 0, 0, 0, 1, [[0, '#8a5a3a'], [1, '#5e3a24']]));
  s.def(rad('win', 0.5, 0.5, 0.5, [[0, '#ffe9a8', 0.95], [1, '#ffd070', 0]]));
  s.def(rad('ball', 0.35, 0.3, 0.8, [[0, '#ffffff'], [0.7, '#e9eff8'], [1, '#b9c7de']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<g filter="url(#b8)" opacity="0.8"><ellipse cx="150" cy="120" rx="200" ry="50" fill="#b3c0da"/><ellipse cx="620" cy="90" rx="220" ry="45" fill="#a8b7d4"/><ellipse cx="400" cy="200" rx="260" ry="40" fill="#c2cde3"/></g>');
  s.add('<path d="M0 330Q120 270 250 320T500 300T800 320V420H0Z" fill="#e1e9f6" filter="url(#b4)"/>');
  s.add('<path d="M0 360Q200 320 400 350T800 340V600H0Z" fill="url(#gnd)"/>');
  const pine = (x, y, k) => {
    s.add(`<rect x="${F(x - 7 * k)}" y="${F(y - 20 * k)}" width="${F(14 * k)}" height="${F(30 * k)}" fill="#4a3322"/>`);
    [[0, 90, 60], [-55, 75, 50], [-100, 60, 40]].forEach(([dy, w, h], i) => {
      const yy = y + dy * k - 20 * k;
      s.add(`<path d="M${F(x - w * k)} ${F(yy)}L${F(x)} ${F(yy - h * 1.5 * k)}L${F(x + w * k)} ${F(yy)}Z" fill="#2d5545"/>`);
      s.add(`<path d="M${F(x - w * k * 0.9)} ${F(yy - 5 * k)}Q${F(x - w * k * 0.4)} ${F(yy - 22 * k)} ${F(x)} ${F(yy - h * 1.5 * k)}Q${F(x + w * k * 0.4)} ${F(yy - 22 * k)} ${F(x + w * k * 0.9)} ${F(yy - 5 * k)}Q${F(x + w * k * 0.4)} ${F(yy - 14 * k)} ${F(x)} ${F(yy - 12 * k)}Q${F(x - w * k * 0.4)} ${F(yy - 14 * k)} ${F(x - w * k * 0.9)} ${F(yy - 5 * k)}Z" fill="#f4f8fd"/>`);
    });
    s.add(shadow(x, y + 12 * k, 55 * k, 8 * k, 0.18));
  };
  pine(70, 400, 0.9); pine(720, 390, 0.8); pine(250, 360, 0.55); pine(335, 365, 0.45);
  // 小木屋
  s.add('<rect x="470" y="300" width="130" height="80" fill="url(#cab)"/><path d="M455 305L535 250L615 305Z" fill="#3b2a22"/><path d="M455 305L535 250L615 305L605 303L535 260L465 303Z" fill="#f5f8fd"/><path d="M450 308Q535 280 620 308L625 300Q535 262 445 300Z" fill="#fff"/>');
  s.add('<circle cx="500" cy="338" r="40" fill="url(#win)" filter="url(#b8)"/><rect x="485" y="325" width="30" height="26" fill="#ffd77a"/><path d="M500 325V351M485 338H515" stroke="#6a4326" stroke-width="2"/><rect x="545" y="335" width="28" height="45" fill="#4a2e1d"/>');
  s.add('<rect x="565" y="262" width="16" height="30" fill="#6a4a3a"/><rect x="563" y="258" width="20" height="8" fill="#f5f8fd"/><g filter="url(#b4)" fill="#e6ecf6" opacity="0.8"><circle cx="575" cy="240" r="10"/><circle cx="586" cy="222" r="13"/><circle cx="600" cy="200" r="16"/></g>');
  s.add('<path d="M0 410Q250 380 520 420T800 400V600H0Z" fill="url(#gnd)"/>');
  // 雪人
  s.add(shadow(165, 520, 70, 10, 0.25));
  s.add('<circle cx="165" cy="480" r="48" fill="url(#ball)"/><circle cx="165" cy="420" r="35" fill="url(#ball)"/><circle cx="165" cy="373" r="25" fill="url(#ball)"/>');
  s.add('<circle cx="157" cy="368" r="3.5" fill="#222"/><circle cx="174" cy="368" r="3.5" fill="#222"/><path d="M165 374L190 380L165 384Z" fill="#e8742a"/><g fill="#222"><circle cx="165" cy="415" r="3"/><circle cx="165" cy="430" r="3"/><circle cx="165" cy="445" r="3"/></g>');
  s.add('<path d="M130 425L88 395M200 425L240 392" stroke="#5a3a24" stroke-width="4" stroke-linecap="round"/><path d="M140 392Q165 404 190 392L190 402Q165 414 140 402Z" fill="#c9443a"/><path d="M183 400L190 428L176 424Z" fill="#c9443a"/><path d="M144 356h42v-8h-8v-18h-26v18h-8z" fill="#2b2b33"/>');
  // 人物
  s.add(person(s, { x: 690, y: 255, h: 330, skin: 'light', hair: '#3a2a22', hairStyle: 'long', top: '#c4473f', bottom: '#2c3447', pose: 'down', legs: 'stand', shoe: '#5a3d2e', collar: false }));
  const sx = 690, sy = 255, ss = 330 / 7;
  s.add(`<path d="M${F(sx - 0.55 * ss)} ${F(sy + 0.02 * ss)}Q${F(sx)} ${F(sy + 0.5 * ss)} ${F(sx + 0.55 * ss)} ${F(sy + 0.02 * ss)}L${F(sx + 0.5 * ss)} ${F(sy + 0.38 * ss)}Q${F(sx)} ${F(sy + 0.8 * ss)} ${F(sx - 0.5 * ss)} ${F(sy + 0.38 * ss)}Z" fill="#f2e6c9"/><path d="M${F(sx + 0.3 * ss)} ${F(sy + 0.5 * ss)}L${F(sx + 0.5 * ss)} ${F(sy + 1.2 * ss)}L${F(sx + 0.22 * ss)} ${F(sy + 1.2 * ss)}Z" fill="#f2e6c9"/>`);
  const hy = sy - 0.64 * ss;
  s.add(`<path d="M${F(sx - 0.48 * ss)} ${F(hy - 0.2 * ss)}C${F(sx - 0.5 * ss)} ${F(hy - 0.8 * ss)} ${F(sx + 0.5 * ss)} ${F(hy - 0.8 * ss)} ${F(sx + 0.48 * ss)} ${F(hy - 0.2 * ss)}Z" fill="#3e6aa0"/><rect x="${F(sx - 0.5 * ss)}" y="${F(hy - 0.28 * ss)}" width="${F(ss)}" height="${F(0.16 * ss)}" rx="3" fill="#f2f2f2"/><circle cx="${F(sx)}" cy="${F(hy - 0.82 * ss)}" r="${F(0.12 * ss)}" fill="#f2f2f2"/>`);
  // 雪花
  for (let i = 0; i < 160; i++) {
    const x = R() * 800, y = R() * 600, r = 1.2 + R() * 3.2 * (y / 600 + 0.3);
    s.add(`<circle cx="${F(x)}" cy="${F(y)}" r="${F(r)}" fill="#fff" opacity="${F(0.45 + R() * 0.5)}"${r > 3.5 ? ' filter="url(#b2)"' : ''}/>`);
  }
  return s.out();
};

/* 2 颱風天 */
out.typhoon = () => {
  const s = Scene(); const R = rng(32);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#2f3b40'], [0.6, '#6b7a80'], [1, '#9aa7aa']]));
  s.def(lin('road', 0, 0, 0, 1, [[0, '#4a5256'], [1, '#262c30']]));
  s.def(lin('wl', 0, 0, 0, 1, [[0, '#7f8b8c'], [1, '#5c6668']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<g filter="url(#b16)" opacity="0.85"><ellipse cx="150" cy="60" rx="220" ry="60" fill="#1f282c"/><ellipse cx="520" cy="40" rx="260" ry="70" fill="#242f33"/><ellipse cx="760" cy="110" rx="160" ry="50" fill="#2c383c"/></g>');
  // 遠處大樓
  [[40, 230, 120], [170, 190, 100], [290, 250, 90], [400, 200, 130], [540, 240, 100], [660, 180, 120]].forEach(([x, y, w], bi) => {
    s.add(`<rect x="${x}" y="${y}" width="${w}" height="${400 - y}" fill="url(#wl)" opacity="0.9"/>`);
    for (let r = 0; r < 8; r++) for (let c = 0; c < Math.floor(w / 26); c++) if (R() < 0.35) s.add(`<rect x="${x + 8 + c * 26}" y="${y + 14 + r * 22}" width="14" height="12" fill="#f2d98a" opacity="0.65"/>`);
  });
  s.add('<rect y="395" width="800" height="22" fill="#6a7274"/><rect y="417" width="800" height="183" fill="url(#road)"/>');
  s.add('<path d="M0 520H800" stroke="#cfd4cf" stroke-width="3" stroke-dasharray="46 40" opacity="0.5"/>');
  // 水窪與反光
  s.add('<g opacity="0.55"><ellipse cx="260" cy="500" rx="130" ry="18" fill="#8fa0a6"/><ellipse cx="620" cy="560" rx="150" ry="20" fill="#8fa0a6"/></g>');
  [[240, 500, 30, 5], [290, 498, 55, 9], [610, 560, 40, 7], [660, 558, 70, 11]].forEach(([x, y, rx, ry]) => s.add(`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="#dfe8ea" stroke-width="1.5" opacity="0.6"/>`));
  // 歪斜的路燈
  s.add('<path d="M640 410Q650 300 700 190" stroke="#33393c" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M700 190Q740 175 770 190" stroke="#33393c" stroke-width="10" fill="none" stroke-linecap="round"/><ellipse cx="770" cy="196" rx="20" ry="9" fill="#e8d9a0" opacity="0.9"/>');
  // 被吹彎的椰子樹
  s.add('<path d="M170 410Q160 310 215 220Q250 165 345 150" stroke="#6d5438" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M170 410Q160 310 215 220Q250 165 345 150" stroke="#8a6d4b" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.6"/>');
  const fr = [[0, 80, '#2d6a3f'], [-25, 120, '#357a47'], [28, 105, '#2a6038'], [55, 85, '#3a8650'], [-50, 70, '#2a6038'], [80, 70, '#2d6a3f']];
  fr.forEach(([a, l, c]) => {
    const ang = (a * Math.PI) / 180; const x0 = 345, y0 = 150;
    const ex = x0 + Math.cos(ang) * l * 2.0, ey = y0 + Math.sin(ang) * l * 1.2 + 25;
    s.add(`<path d="M${x0} ${y0}Q${F((x0 + ex) / 2)} ${F(y0 - 30 + Math.sin(ang) * 40)} ${F(ex)} ${F(ey)}" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>`);
    for (let i = 1; i < 9; i++) { const t = i / 9; const px = x0 + (ex - x0) * t, py = y0 + (ey - y0) * t - Math.sin(t * Math.PI) * 18; s.add(`<path d="M${F(px)} ${F(py)}l${F(22)} ${F(18 + t * 8)}M${F(px)} ${F(py)}l${F(8)} ${F(-16)}" stroke="${c}" stroke-width="3" stroke-linecap="round" fill="none"/>`); }
  });
  // 翻過去的傘
  s.add(shadow(470, 560, 70, 10, 0.3));
  s.add('<path d="M410 548Q470 480 530 548Q500 535 470 548Q440 535 410 548Z" fill="#c4473f"/><path d="M470 548V505M440 545L420 520M500 545L520 520" stroke="#2a2a2a" stroke-width="2"/><path d="M470 548L478 580" stroke="#6a4a2a" stroke-width="5" stroke-linecap="round"/>');
  // 飛葉
  for (let i = 0; i < 22; i++) { const x = R() * 800, y = 120 + R() * 380, a = R() * 360; s.add(`<ellipse cx="${F(x)}" cy="${F(y)}" rx="9" ry="3.5" fill="${['#3f7a45', '#6a8a3a', '#2d5a38'][i % 3]}" transform="rotate(${F(a)} ${F(x)} ${F(y)})"/>`); }
  // 雨
  for (let i = 0; i < 230; i++) { const x = R() * 900 - 60, y = R() * 600, l = 40 + R() * 40; s.add(`<path d="M${F(x)} ${F(y)}l${F(-l * 0.45)} ${F(l)}" stroke="#e4eef2" stroke-width="${F(1 + R() * 1.4)}" opacity="${F(0.2 + R() * 0.35)}" stroke-linecap="round"/>`); }
  return s.out();
};

/* 3 大太陽 */
out.hotsun = () => {
  const s = Scene(); const R = rng(33);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#6fc3f2'], [0.7, '#cfeaf5'], [1, '#fff6d8']]));
  s.def(rad('sun', 0.5, 0.5, 0.5, [[0, '#fffbe0', 1], [0.35, '#fff1a8', 0.8], [1, '#ffe27a', 0]]));
  s.def(lin('pav', 0, 0, 0, 1, [[0, '#ede1c4'], [1, '#d0c19c']]));
  s.def(lin('can', 0, 0, 1, 0, [[0, '#e8493f'], [1, '#c23a30']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="660" cy="90" r="260" fill="url(#sun)"/><circle cx="660" cy="90" r="62" fill="#fff8cc"/>');
  s.add('<g filter="url(#b8)" opacity="0.9"><ellipse cx="200" cy="90" rx="110" ry="22" fill="#fff"/><ellipse cx="320" cy="70" rx="70" ry="16" fill="#fff"/></g>');
  // 店面
  const shops = [[0, 200, 150, '#f2d6a0'], [150, 230, 130, '#cde3d4'], [280, 215, 140, '#f0c8b8'], [420, 235, 130, '#d9d5f0'], [550, 205, 250, '#f4e3a8']];
  shops.forEach(([x, y, w, c]) => { s.add(`<rect x="${x}" y="${y}" width="${w}" height="${400 - y}" fill="${c}"/><rect x="${x}" y="${y}" width="${w}" height="10" fill="#fff" opacity="0.5"/>`); for (let i = 0; i < Math.floor(w / 50); i++) s.add(`<rect x="${x + 14 + i * 48}" y="${y + 32}" width="30" height="44" fill="#8fb9d0" opacity="0.85"/><rect x="${x + 14 + i * 48}" y="${y + 32}" width="30" height="8" fill="#fff" opacity="0.5"/>`); });
  s.add('<rect y="395" width="800" height="205" fill="url(#pav)"/><path d="M0 470H800M0 540H800" stroke="#b9a981" stroke-width="2" opacity="0.5"/>');
  // 路樹
  s.add('<rect x="70" y="270" width="16" height="130" fill="#6b4a30"/><circle cx="78" cy="260" r="70" fill="#4f8f3f"/><circle cx="40" cy="285" r="42" fill="#5ea04a"/><circle cx="118" cy="280" r="46" fill="#47853a"/>');
  s.add('<ellipse cx="82" cy="425" rx="100" ry="14" fill="#000" opacity="0.2" filter="url(#b4)"/>');
  // 刨冰攤
  s.add(shadow(640, 520, 150, 14, 0.25));
  s.add('<rect x="540" y="400" width="200" height="110" fill="#e8f1f5"/><rect x="540" y="468" width="200" height="12" fill="#a9c6d4"/><rect x="552" y="500" width="14" height="30" fill="#8aa6b3"/><rect x="714" y="500" width="14" height="30" fill="#8aa6b3"/>');
  s.add('<path d="M520 385H760L742 340H538Z" fill="url(#can)"/>');
  for (let i = 0; i < 6; i++) s.add(`<path d="M${538 + i * 37} 340H${538 + (i + 1) * 37 - 12}L${520 + (i + 1) * 40 - 12} 385H${520 + i * 40}Z" fill="#fff" opacity="0.92"/>`);
  s.add('<path d="M520 385q10 14 20 0q10 14 20 0q10 14 20 0q10 14 20 0q10 14 20 0q10 14 20 0q10 14 20 0q10 14 20 0q10 14 20 0q10 14 20 0q10 14 20 0q10 14 20 0" fill="#c23a30"/>');
  s.add('<rect x="575" y="395" width="130" height="34" rx="4" fill="#fff"/><text x="640" y="420" font-family="' + FONT + '" font-size="26" font-weight="700" text-anchor="middle" fill="#2b7fb8">冰品</text>');
  [[585, '#f2778f'], [625, '#6fc3f2'], [665, '#ffd24a']].forEach(([x, c], i) => { s.add(`<path d="M${x} 440h34l-6 32h-22Z" fill="#f4f4f4"/><path d="M${x - 2} 442q19 -34 38 0Z" fill="${c}"/><circle cx="${x + 17}" cy="420" r="3" fill="#fff"/>`); });
  // 人物（撐傘）
  s.add(shadow(310, 545, 90, 14, 0.3));
  s.add(person(s, { x: 300, y: 170, h: 430, skin: 'mid', hair: '#2a1b14', hairStyle: 'ponytail', top: '#fff7e0', bottom: '#3f6b9a', pose: 'phone', legs: 'stand', sleeve: 'short', shoe: '#f4f4f4', collar: false }));
  const px = 300 + 0.5 * 61.4, py = 170 - 0.55 * 61.4;
  s.add(`<path d="M${F(px)} ${F(py + 6)}V60" stroke="#4a3a2a" stroke-width="4"/><path d="M${F(px - 150)} 112Q${F(px - 80)} 28 ${F(px)} 24Q${F(px + 80)} 28 ${F(px + 150)} 112Q${F(px + 100)} 98 ${F(px + 50)} 112Q${F(px)} 98 ${F(px - 50)} 112Q${F(px - 100)} 98 ${F(px - 150)} 112Z" fill="#e8b830"/><path d="M${F(px)} 24Q${F(px - 40)} 60 ${F(px - 50)} 112M${F(px)} 24Q${F(px + 40)} 60 ${F(px + 50)} 112" stroke="#b88a18" stroke-width="2" fill="none"/>`);
  // 汗滴
  s.add('<path d="M268 188q-5 10 0 15q5 -5 0 -15Z M336 196q-5 10 0 15q5 -5 0 -15Z" fill="#7fc8f2"/>');
  // 熱氣
  s.add('<g stroke="#fff" stroke-width="3" fill="none" opacity="0.5" stroke-linecap="round"><path d="M20 440q20 -14 40 0t40 0t40 0"/><path d="M180 500q20 -14 40 0t40 0t40 0"/><path d="M420 450q20 -14 40 0t40 0"/><path d="M40 560q20 -14 40 0t40 0t40 0"/></g>');
  return s.out();
};

/* 4 春天賞花 */
out.spring = () => {
  const s = Scene(); const R = rng(34);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#a8d6f0'], [1, '#fdeee6']]));
  s.def(lin('grs', 0, 0, 0, 1, [[0, '#9ccf6a'], [1, '#6aa845']]));
  s.def(lin('pth', 0, 0, 0, 1, [[0, '#e6d5b8'], [1, '#cdb994']]));
  s.def(rad('bl', 0.4, 0.35, 0.8, [[0, '#ffeef2'], [0.7, '#fbbccd'], [1, '#f4a6bc']]));
  s.def(rad('bl2', 0.4, 0.35, 0.8, [[0, '#fff6f8'], [0.7, '#fcc9d6'], [1, '#f6aec2']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<g filter="url(#b8)" opacity="0.8"><ellipse cx="560" cy="110" rx="170" ry="30" fill="#fff"/><ellipse cx="180" cy="160" rx="130" ry="24" fill="#fff"/></g>');
  s.add('<path d="M0 320Q150 250 320 300T620 280T800 300V420H0Z" fill="#a9cfa6" filter="url(#b4)"/>');
  s.add('<rect y="330" width="800" height="270" fill="url(#grs)"/>');
  s.add('<path d="M330 330Q380 400 340 460Q300 530 180 600H640Q520 520 470 450Q430 390 450 330Z" fill="url(#pth)"/>');
  const tree = (x, y, k, trunkLean) => {
    s.add(shadow(x + 10 * k, y + 8, 90 * k, 12 * k, 0.25));
    s.add(`<path d="M${F(x - 13 * k)} ${F(y)}Q${F(x - 10 * k)} ${F(y - 90 * k)} ${F(x + trunkLean * k)} ${F(y - 170 * k)}L${F(x + trunkLean * k + 14 * k)} ${F(y - 170 * k)}Q${F(x + 14 * k)} ${F(y - 90 * k)} ${F(x + 15 * k)} ${F(y)}Z" fill="#5a4034"/>`);
    s.add(`<path d="M${F(x + trunkLean * k)} ${F(y - 140 * k)}L${F(x - 70 * k)} ${F(y - 190 * k)}M${F(x + trunkLean * k + 8 * k)} ${F(y - 130 * k)}L${F(x + 80 * k)} ${F(y - 195 * k)}" stroke="#5a4034" stroke-width="${F(7 * k)}" stroke-linecap="round"/>`);
    s.add('<g filter="url(#b2)">');
    for (let i = 0; i < 70; i++) {
      const a = R() * Math.PI * 2, d = Math.sqrt(R()) * 125 * k;
      const cx = x + trunkLean * k + Math.cos(a) * d * 1.15, cy = y - 205 * k + Math.sin(a) * d * 0.8, r = (15 + R() * 20) * k;
      s.add(`<circle cx="${F(cx)}" cy="${F(cy)}" r="${F(r)}" fill="url(#${i % 2 ? 'bl' : 'bl2'})" opacity="0.95"/>`);
    }
    s.add('</g>');
    for (let i = 0; i < 20; i++) { const cx = x + (R() - 0.5) * 230 * k, cy = y - 220 * k + (R() - 0.5) * 150 * k; s.add(`<circle cx="${F(cx)}" cy="${F(cy)}" r="${F((4 + R() * 5) * k)}" fill="#fff" opacity="0.6"/>`); }
  };
  tree(120, 430, 0.9, 20); tree(690, 420, 0.85, -20); tree(300, 350, 0.45, 8); tree(520, 345, 0.42, -8);
  // 長椅
  s.add(shadow(160, 500, 80, 10, 0.25));
  s.add('<rect x="95" y="455" width="130" height="10" fill="#8a5a36"/><rect x="95" y="436" width="130" height="8" fill="#9a6a42"/><rect x="100" y="465" width="9" height="38" fill="#5a3a24"/><rect x="211" y="465" width="9" height="38" fill="#5a3a24"/><rect x="100" y="425" width="9" height="40" fill="#5a3a24"/><rect x="211" y="425" width="9" height="40" fill="#5a3a24"/>');
  // 草地小花
  for (let i = 0; i < 40; i++) { const x = R() * 800, y = 440 + R() * 160; const c = ['#fff', '#ffd54a', '#ffb3c8'][i % 3]; s.add(`<circle cx="${F(x)}" cy="${F(y)}" r="${F(2 + (y - 430) / 60)}" fill="${c}" opacity="0.9"/>`); }
  // 花瓣
  for (let i = 0; i < 70; i++) { const x = R() * 800, y = 150 + R() * 450, a = R() * 360; s.add(`<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(4 + R() * 2)}" ry="2.6" fill="#ffc6d6" opacity="${F(0.6 + R() * 0.4)}" transform="rotate(${F(a)} ${F(x)} ${F(y)})"/>`); }
  return s.out();
};

/* 5 秋天 */
out.autumn = () => {
  const s = Scene(); const R = rng(35);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#f3b87a'], [0.5, '#f9dcae'], [1, '#fff3da']]));
  s.def(lin('grs', 0, 0, 0, 1, [[0, '#a8a24a'], [1, '#7a7a30']]));
  s.def(lin('pth', 0, 0, 0, 1, [[0, '#d8b98a'], [1, '#b8946a']]));
  s.def(rad('sun', 0.5, 0.5, 0.5, [[0, '#fff3c4', 0.9], [1, '#ffd890', 0]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="400" cy="230" r="230" fill="url(#sun)"/>');
  s.add('<path d="M0 300Q200 240 400 285T800 270V420H0Z" fill="#c9884a" opacity="0.55" filter="url(#b4)"/>');
  s.add('<rect y="360" width="800" height="240" fill="url(#grs)"/>');
  s.add('<path d="M385 352Q392 350 415 352Q440 420 500 500Q560 570 700 600H130Q250 580 300 520Q380 420 385 352Z" fill="url(#pth)"/>');
  const cols = ['#d9482b', '#e8792a', '#f2a93a', '#c2352a', '#e6c23a', '#b8541f'];
  const tree = (x, y, k, c0) => {
    s.add(shadow(x, y + 6, 100 * k, 12 * k, 0.25));
    s.add(`<path d="M${F(x - 14 * k)} ${F(y)}Q${F(x - 8 * k)} ${F(y - 100 * k)} ${F(x - 6 * k)} ${F(y - 190 * k)}L${F(x + 10 * k)} ${F(y - 190 * k)}Q${F(x + 10 * k)} ${F(y - 100 * k)} ${F(x + 16 * k)} ${F(y)}Z" fill="#4e3626"/>`);
    s.add('<g filter="url(#b2)">');
    for (let i = 0; i < 80; i++) {
      const a = R() * Math.PI * 2, d = Math.sqrt(R()) * 125 * k;
      const cx = x + Math.cos(a) * d * 1.1, cy = y - 215 * k + Math.sin(a) * d * 0.75, r = (14 + R() * 18) * k;
      const c = cols[(c0 + Math.floor(R() * 3)) % cols.length];
      s.add(`<circle cx="${F(cx)}" cy="${F(cy)}" r="${F(r)}" fill="${c}" opacity="0.93"/><circle cx="${F(cx - r * 0.25)}" cy="${F(cy - r * 0.25)}" r="${F(r * 0.55)}" fill="${shade(c, 0.22)}" opacity="0.5"/>`);
    }
    s.add('</g>');
  };
  tree(110, 440, 0.95, 0); tree(710, 430, 0.9, 2); tree(300, 365, 0.5, 1); tree(520, 360, 0.48, 3);
  // 地上落葉
  for (let i = 0; i < 90; i++) {
    const side = R();
    const x = side < 0.5 ? R() * 800 : 200 + R() * 400, y = 400 + R() * 200, a = R() * 360, c = cols[i % cols.length];
    s.add(`<path d="M${F(x)} ${F(y)}q${F(8)} ${F(-8)} ${F(16)} 0q${F(-8)} ${F(8)} ${F(-16)} 0Z" fill="${c}" opacity="0.92" transform="rotate(${F(a)} ${F(x)} ${F(y)}) scale(${F(0.7 + (y - 400) / 250)})" transform-origin="${F(x)} ${F(y)}"/>`);
  }
  // 楓葉（前景）
  const maple = (x, y, k, c, a) => s.add(`<g transform="translate(${x} ${y}) rotate(${a}) scale(${k})"><path d="M0 -16L5 -6L14 -10L10 0L18 4L8 8L10 16L0 12L-10 16L-8 8L-18 4L-10 0L-14 -10L-5 -6Z" fill="${c}"/><path d="M0 12V24" stroke="#6a3a1a" stroke-width="2"/></g>`);
  [[90, 110, 1.6, '#d9482b', 20], [250, 70, 1.3, '#f2a93a', -30], [560, 130, 1.7, '#c2352a', 40], [700, 80, 1.2, '#e8792a', 10], [420, 170, 1.4, '#e8792a', -15], [330, 250, 1.1, '#d9482b', 60]].forEach((a) => maple(...a));
  // 長椅
  s.add(shadow(590, 520, 80, 10, 0.25));
  s.add('<rect x="525" y="475" width="130" height="10" fill="#8a5a36"/><rect x="525" y="456" width="130" height="8" fill="#9a6a42"/><rect x="530" y="485" width="9" height="38" fill="#5a3a24"/><rect x="641" y="485" width="9" height="38" fill="#5a3a24"/><rect x="530" y="445" width="9" height="40" fill="#5a3a24"/><rect x="641" y="445" width="9" height="40" fill="#5a3a24"/>');
  return s.out();
};

/* 6 雨後彩虹 */
out.rainbow = () => {
  const s = Scene(); const R = rng(36);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#6f8fa6'], [0.45, '#b6d1e0'], [1, '#f2f0dc']]));
  s.def(lin('grs', 0, 0, 0, 1, [[0, '#7fc062'], [1, '#4a9040']]));
  s.def(lin('road', 0, 0, 0, 1, [[0, '#5f666a'], [1, '#3d4448']]));
  s.def(rad('sunb', 0.8, 0.5, 0.5, [[0, '#fff6c8', 0.85], [1, '#fff6c8', 0]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="700" cy="200" r="280" fill="url(#sunb)"/>');
  s.add('<g filter="url(#b8)"><ellipse cx="110" cy="70" rx="200" ry="50" fill="#5c7488"/><ellipse cx="330" cy="40" rx="170" ry="40" fill="#6b8296"/><ellipse cx="640" cy="260" rx="120" ry="20" fill="#fff" opacity="0.7"/></g>');
  const band = ['#e8473f', '#f08a34', '#f6d23c', '#58b45a', '#3f8fd8', '#4a58b8', '#8a4cb0'];
  const cx = 330, cy = 470;
  band.forEach((c, i) => { const r = 330 - i * 14; s.add(`<path d="M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}" stroke="${c}" stroke-width="15" fill="none" opacity="0.55"/>`); });
  s.add(`<path d="M${cx - 340} ${cy}A340 340 0 0 1 ${cx + 340} ${cy}" stroke="#fff" stroke-width="30" fill="none" opacity="0.12" filter="url(#b8)"/>`);
  s.add('<path d="M0 360Q120 300 260 345T560 330T800 350V430H0Z" fill="#7aae7a" filter="url(#b4)"/>');
  s.add('<rect y="380" width="800" height="220" fill="url(#grs)"/>');
  s.add('<path d="M0 470Q300 440 800 480V600H0Z" fill="url(#road)"/><path d="M0 470Q300 440 800 480" stroke="#9aa3a6" stroke-width="3" fill="none"/>');
  s.add('<path d="M0 535Q300 510 800 545" stroke="#e8e4d0" stroke-width="3" stroke-dasharray="40 34" fill="none" opacity="0.7"/>');
  // 水窪裡的彩虹倒影
  s.add('<ellipse cx="300" cy="555" rx="190" ry="26" fill="#9fc4d8" opacity="0.9"/><g opacity="0.5"><ellipse cx="300" cy="555" rx="150" ry="16" fill="none" stroke="#e8473f" stroke-width="3"/><ellipse cx="300" cy="555" rx="130" ry="13" fill="none" stroke="#f6d23c" stroke-width="3"/><ellipse cx="300" cy="555" rx="110" ry="10" fill="none" stroke="#58b45a" stroke-width="3"/><ellipse cx="300" cy="555" rx="90" ry="8" fill="none" stroke="#3f8fd8" stroke-width="3"/></g>');
  // 小房子與樹
  s.add('<rect x="590" y="360" width="100" height="62" fill="#f2e4c6"/><path d="M580 362L640 318L700 362Z" fill="#b8473a"/><rect x="610" y="382" width="22" height="22" fill="#8fb9d0"/><rect x="652" y="388" width="22" height="34" fill="#7a4a2a"/>');
  [[60, 430, 1], [740, 440, 0.8], [520, 400, 0.6]].forEach(([x, y, k]) => { s.add(`<rect x="${F(x - 7 * k)}" y="${F(y - 60 * k)}" width="${F(14 * k)}" height="${F(70 * k)}" fill="#5a4030"/><circle cx="${x}" cy="${F(y - 90 * k)}" r="${F(55 * k)}" fill="#3f8a45"/><circle cx="${F(x - 28 * k)}" cy="${F(y - 70 * k)}" r="${F(34 * k)}" fill="#4a9a50"/><circle cx="${F(x + 30 * k)}" cy="${F(y - 74 * k)}" r="${F(32 * k)}" fill="#357a3c"/>`); });
  // 水珠與殘雨
  for (let i = 0; i < 50; i++) { const x = R() * 800, y = R() * 380; s.add(`<path d="M${F(x)} ${F(y)}l-5 22" stroke="#fff" stroke-width="1.2" opacity="${F(0.12 + R() * 0.2)}"/>`); }
  for (let i = 0; i < 30; i++) { const x = R() * 800, y = 395 + R() * 70; s.add(`<circle cx="${F(x)}" cy="${F(y)}" r="${F(1.5 + R() * 2)}" fill="#fff" opacity="0.7"/>`); }
  return s.out();
};

/* 7 中秋烤肉 */
out.midautumn = () => {
  const s = Scene(); const R = rng(37);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#0f1a3a'], [0.6, '#1f3262'], [1, '#3a4a7a']]));
  s.def(rad('moon', 0.5, 0.5, 0.5, [[0, '#fffbe6', 1], [0.3, '#fff2b8', 0.55], [1, '#fff2b8', 0]]));
  s.def(rad('mb', 0.38, 0.35, 0.8, [[0, '#fffdf0'], [0.7, '#f6ecc0'], [1, '#e0d09a']]));
  s.def(lin('tbl', 0, 0, 0, 1, [[0, '#8a5a36'], [1, '#5a3a24']]));
  s.def(rad('cake', 0.4, 0.35, 0.8, [[0, '#e0a050'], [0.7, '#b8742e'], [1, '#8a4e1e']]));
  s.def(rad('pom', 0.38, 0.32, 0.85, [[0, '#f2e680'], [0.65, '#d4c24a'], [1, '#a89a2a']]));
  s.def(rad('coal', 0.5, 0.5, 0.5, [[0, '#ffd070', 1], [0.5, '#ff7a30', 0.9], [1, '#c22a10', 0]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  for (let i = 0; i < 70; i++) s.add(`<circle cx="${F(R() * 800)}" cy="${F(R() * 280)}" r="${F(0.6 + R() * 1.4)}" fill="#fff" opacity="${F(0.3 + R() * 0.6)}"/>`);
  s.add('<circle cx="430" cy="170" r="260" fill="url(#moon)"/><circle cx="430" cy="170" r="92" fill="url(#mb)"/>');
  s.add('<g fill="#c8b880" opacity="0.5"><ellipse cx="400" cy="145" rx="22" ry="14"/><ellipse cx="455" cy="190" rx="26" ry="18"/><ellipse cx="410" cy="205" rx="14" ry="9"/><ellipse cx="465" cy="140" rx="12" ry="8"/></g>');
  s.add('<g filter="url(#b8)" opacity="0.6"><ellipse cx="260" cy="200" rx="150" ry="14" fill="#3a4a7a"/><ellipse cx="640" cy="130" rx="130" ry="12" fill="#3a4a7a"/></g>');
  // 屋頂剪影
  s.add('<path d="M0 360L70 330H140L200 360V430H0Z" fill="#101a30"/><path d="M560 350L640 318L720 350H800V430H560Z" fill="#101a30"/><rect x="620" y="334" width="14" height="30" fill="#0c1426"/><g fill="#f2cf7a" opacity="0.8"><rect x="90" y="378" width="18" height="22"/><rect x="650" y="378" width="18" height="22"/><rect x="710" y="378" width="18" height="22"/></g>');
  s.add('<rect y="410" width="800" height="190" fill="#1a2440"/><path d="M0 410Q400 395 800 410" stroke="#2c3a60" stroke-width="3" fill="none"/>');
  // 燈串
  s.add('<path d="M0 60Q200 110 400 70T800 70" stroke="#2a2a30" stroke-width="2" fill="none"/>');
  [[60, 80], [160, 98], [260, 102], [360, 85], [460, 78], [560, 76], [660, 70], [760, 68]].forEach(([x, y], i) => s.add(`<circle cx="${x}" cy="${y + 6}" r="24" fill="${['#ffd070', '#ff9a50'][i % 2]}" opacity="0.4" filter="url(#b8)"/><circle cx="${x}" cy="${y + 6}" r="7" fill="${['#ffe8a0', '#ffc080'][i % 2]}"/>`));
  // 桌子
  s.add(shadow(260, 580, 250, 16, 0.4));
  s.add('<path d="M40 470H500L520 495H20Z" fill="#a8744a"/><rect x="20" y="495" width="500" height="22" fill="url(#tbl)"/><rect x="50" y="517" width="20" height="70" fill="#4a2e1c"/><rect x="470" y="517" width="20" height="70" fill="#4a2e1c"/>');
  // 月餅盒與月餅
  s.add('<ellipse cx="190" cy="478" rx="115" ry="26" fill="#d9c9a0"/><ellipse cx="190" cy="474" rx="108" ry="22" fill="#f2e8c8"/>');
  [[130, 474], [190, 482], [250, 474]].forEach(([x, y]) => { s.add(`<ellipse cx="${x}" cy="${y}" rx="31" ry="13" fill="url(#cake)"/><ellipse cx="${x}" cy="${y - 4}" rx="30" ry="12" fill="url(#cake)"/>`); for (let i = 0; i < 8; i++) s.add(`<ellipse cx="${x}" cy="${y - 4}" rx="2.4" ry="9" fill="#6a3a14" opacity="0.55" transform="rotate(${i * 45} ${x} ${y - 4})"/>`); s.add(`<ellipse cx="${x}" cy="${y - 4}" rx="9" ry="4" fill="#d9954a"/>`); });
  // 柚子
  s.add('<circle cx="380" cy="445" r="48" fill="url(#pom)"/><ellipse cx="382" cy="398" rx="14" ry="6" fill="#8a7a1a"/><path d="M382 398Q400 380 418 388Q404 402 384 400Z" fill="#4f8a3a"/><ellipse cx="366" cy="430" rx="12" ry="8" fill="#fff" opacity="0.3" transform="rotate(-30 366 430)"/>');
  s.add('<circle cx="448" cy="462" r="32" fill="url(#pom)"/><path d="M448 432Q462 420 474 426Q462 438 450 436Z" fill="#4f8a3a"/>');
  // 烤肉架
  s.add(shadow(640, 586, 140, 12, 0.4));
  s.add('<path d="M520 520H760L740 570H540Z" fill="#2a2a30"/><path d="M520 520H760" stroke="#55555c" stroke-width="5"/><rect x="545" y="570" width="10" height="22" fill="#1e1e22"/><rect x="725" y="570" width="10" height="22" fill="#1e1e22"/>');
  s.add('<ellipse cx="640" cy="528" rx="105" ry="14" fill="url(#coal)"/><circle cx="640" cy="525" r="70" fill="url(#coal)" opacity="0.5" filter="url(#b16)"/>');
  s.add('<path d="M540 506H740M540 512H740" stroke="#7a7a82" stroke-width="2"/>');
  for (let i = 0; i < 6; i++) { const x = 570 + i * 28; s.add(`<path d="M${x - 8} 520L${x + 12} 488" stroke="#c9a06a" stroke-width="3" stroke-linecap="round"/><rect x="${x - 2}" y="496" width="10" height="9" rx="3" fill="#8a4a24" transform="rotate(-48 ${x} 500)"/><rect x="${x + 3}" y="490" width="10" height="9" rx="3" fill="#a85a2c" transform="rotate(-48 ${x} 494)"/>`); }
  s.add('<g filter="url(#b4)" fill="#cfd6e8" opacity="0.5"><circle cx="650" cy="470" r="14"/><circle cx="662" cy="440" r="20"/><circle cx="680" cy="405" r="26"/><circle cx="700" cy="368" r="30"/></g>');
  for (let i = 0; i < 14; i++) s.add(`<circle cx="${F(580 + R() * 120)}" cy="${F(440 + R() * 70)}" r="${F(1 + R() * 1.6)}" fill="#ffb04a" opacity="${F(0.5 + R() * 0.5)}"/>`);
  return s.out();
};

/* 8 過年 */
out.newyear = () => {
  const s = Scene(); const R = rng(38);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#a8221f'], [1, '#7d1618']]));
  s.def(lin('gold', 0, 0, 1, 1, [[0, '#f8e08a'], [0.5, '#e0b13a'], [1, '#b88a1a']]));
  s.def(lin('floor', 0, 0, 0, 1, [[0, '#7a5232'], [1, '#4e321e']]));
  s.def(lin('rc', 0, 0, 0, 1, [[0, '#e8352e'], [1, '#b8201c']]));
  s.def(rad('lan', 0.4, 0.35, 0.8, [[0, '#ff7a5a'], [0.6, '#e02a24'], [1, '#a81814']]));
  s.def(rad('lg', 0.5, 0.5, 0.5, [[0, '#ffd070', 0.8], [1, '#ffd070', 0]]));
  s.def(lin('tc', 0, 0, 0, 1, [[0, '#c8281f'], [1, '#9a1a16']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="440" width="800" height="160" fill="url(#floor)"/>');
  // 春聯
  const poem = (x, chars) => { s.add(`<rect x="${x}" y="40" width="74" height="330" fill="url(#rc)" stroke="url(#gold)" stroke-width="3"/>`); chars.split('').forEach((ch, i) => s.add(`<text x="${x + 37}" y="${95 + i * 58}" font-family="${FONT}" font-size="42" font-weight="800" text-anchor="middle" fill="#f8e08a">${ch}</text>`)); };
  poem(40, '新年納餘慶'); poem(686, '嘉節號長春');
  s.add('<rect x="260" y="40" width="280" height="62" fill="url(#rc)" stroke="url(#gold)" stroke-width="3"/><text x="400" y="86" font-family="' + FONT + '" font-size="40" font-weight="800" text-anchor="middle" fill="#f8e08a" letter-spacing="10">新年快樂</text>');
  // 福字
  s.add('<g transform="translate(400 235) rotate(45)"><rect x="-70" y="-70" width="140" height="140" fill="url(#rc)" stroke="url(#gold)" stroke-width="4"/></g><text x="400" y="272" font-family="' + FONT + '" font-size="110" font-weight="800" text-anchor="middle" fill="#f8e08a">福</text>');
  // 燈籠
  [[190, 70], [610, 70]].forEach(([x, y]) => {
    s.add(`<path d="M${x} 0V${y}" stroke="#e0b13a" stroke-width="3"/><circle cx="${x}" cy="${y + 52}" r="70" fill="url(#lg)" filter="url(#b8)"/><rect x="${x - 14}" y="${y}" width="28" height="10" fill="url(#gold)"/>`);
    s.add(`<ellipse cx="${x}" cy="${y + 58}" rx="50" ry="46" fill="url(#lan)"/><path d="M${x - 24} ${y + 14}Q${x - 36} ${y + 58} ${x - 24} ${y + 102}M${x} ${y + 12}V${y + 104}M${x + 24} ${y + 14}Q${x + 36} ${y + 58} ${x + 24} ${y + 102}" stroke="#8a1612" stroke-width="2" fill="none" opacity="0.6"/><rect x="${x - 16}" y="${y + 102}" width="32" height="9" fill="url(#gold)"/><path d="M${x - 8} ${y + 111}v36M${x} ${y + 111}v42M${x + 8} ${y + 111}v36" stroke="#e0b13a" stroke-width="3"/>`);
  });
  // 桌子與桌布
  s.add(shadow(400, 586, 330, 14, 0.4));
  s.add('<path d="M110 400H690L730 450H70Z" fill="#e8d8b4"/><rect x="70" y="450" width="660" height="26" fill="url(#tc)"/><path d="M70 476H730V560H70Z" fill="url(#tc)"/><path d="M70 476H730" stroke="url(#gold)" stroke-width="4"/>');
  // 年菜
  const plate = (x, y, rx, ry) => s.add(`<ellipse cx="${x}" cy="${y + 6}" rx="${rx}" ry="${ry}" fill="#b8a888"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fbf6ea"/><ellipse cx="${x}" cy="${y}" rx="${rx - 8}" ry="${ry - 3}" fill="none" stroke="#e8c26a" stroke-width="1.5"/>`);
  // 魚
  plate(210, 418, 100, 24);
  s.add('<path d="M130 416Q170 388 230 400Q268 406 292 414Q268 428 230 432Q170 440 130 416Z" fill="#c8602a"/><path d="M130 416L108 398L112 428Z" fill="#b84e20"/><circle cx="270" cy="412" r="3" fill="#222"/><path d="M180 404Q200 396 222 402" stroke="#e8a060" stroke-width="2" fill="none"/><path d="M160 414Q200 408 250 414" stroke="#e8a060" stroke-width="1.5" fill="none" opacity="0.7"/><g fill="#4f8a3a"><circle cx="190" cy="408" r="4"/><circle cx="215" cy="414" r="4"/><circle cx="240" cy="408" r="4"/></g>');
  // 餃子
  plate(420, 428, 90, 20);
  for (let i = 0; i < 8; i++) { const x = 360 + (i % 4) * 28 + (i > 3 ? 14 : 0), y = i > 3 ? 434 : 420; s.add(`<path d="M${x - 14} ${y + 4}Q${x} ${y - 20} ${x + 14} ${y + 4}Q${x} ${y + 10} ${x - 14} ${y + 4}Z" fill="#fbf1dc" stroke="#e0cfa8" stroke-width="1.2"/><path d="M${x - 10} ${y - 3}l3 2l3 -3l3 3l3 -3l3 3l3 -2" stroke="#d8c498" stroke-width="1" fill="none"/>`); }
  // 橘子與年糕
  s.add(shadow(570, 420, 70, 8, 0.25));
  [[540, 410], [575, 416], [558, 392]].forEach(([x, y]) => s.add(`<circle cx="${x}" cy="${y}" r="20" fill="#f39a2a"/><circle cx="${x - 6}" cy="${y - 6}" r="7" fill="#fff" opacity="0.25"/><path d="M${x} ${y - 20}q8 -8 14 -4q-6 8 -14 4Z" fill="#4f8a3a"/>`));
  s.add('<rect x="620" y="394" width="80" height="34" rx="6" fill="#e0b13a"/><rect x="620" y="394" width="80" height="12" rx="6" fill="#f2d070"/><rect x="650" y="388" width="20" height="10" fill="#c8281f"/>');
  // 紅包（前景）
  const env = (x, y, a) => s.add(`<g transform="translate(${x} ${y}) rotate(${a})"><rect x="-34" y="-50" width="68" height="100" rx="4" fill="url(#rc)" stroke="url(#gold)" stroke-width="2"/><path d="M-34 -50L0 -18L34 -50" fill="#a81814" stroke="url(#gold)" stroke-width="2"/><circle cx="0" cy="-18" r="8" fill="url(#gold)"/><text x="0" y="28" font-family="${FONT}" font-size="26" font-weight="800" text-anchor="middle" fill="#f8e08a">福</text></g>`);
  env(240, 530, -14); env(320, 520, 6); env(400, 534, 18);
  s.add('<g fill="url(#gold)"><circle cx="540" cy="520" r="14"/><circle cx="566" cy="530" r="14"/><circle cx="594" cy="522" r="14"/><circle cx="552" cy="545" r="14"/></g><g fill="#a07010"><rect x="536" y="516" width="8" height="8"/><rect x="562" y="526" width="8" height="8"/><rect x="590" y="518" width="8" height="8"/><rect x="548" y="541" width="8" height="8"/></g>');
  // 金色碎片
  for (let i = 0; i < 40; i++) s.add(`<circle cx="${F(R() * 800)}" cy="${F(R() * 600)}" r="${F(1 + R() * 2)}" fill="#ffd070" opacity="${F(0.3 + R() * 0.5)}"/>`);
  return s.out();
};

module.exports = out;
