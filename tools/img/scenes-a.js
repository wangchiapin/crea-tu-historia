const { rng, lin, rad, Scene, shadow, shade } = require('./lib');
const out = {};

/* 1 書店 */
out.bookstore = () => {
  const s = Scene(); const R = rng(7);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#d9c7a6'], [1, '#c3ab83']]));
  s.def(lin('floor', 0, 0, 0, 1, [[0, '#a8794b'], [1, '#7a5230']]));
  s.def(lin('shelf', 0, 0, 1, 0, [[0, '#5a3d27'], [1, '#7a5636']]));
  s.def(rad('glow', 0.5, 0.5, 0.5, [[0, '#ffe3a6', 0.75], [1, '#ffe3a6', 0]]));
  s.def(lin('tbl', 0, 0, 0, 1, [[0, '#b98556'], [1, '#8a5c36']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  s.add('<rect y="400" width="800" height="200" fill="url(#floor)"/>');
  s.add('<g opacity="0.18" stroke="#2a1608" stroke-width="2"><path d="M0 440H800M0 490H800M0 550H800"/><path d="M200 400L120 600M400 400V600M600 400L680 600"/></g>');
  const cols = ['#b5483a', '#3f6b8f', '#d6a53c', '#4d7a52', '#8a5aa0', '#e0d6c0', '#2f4858', '#c9733a', '#6b8f71', '#a63d4d'];
  const shelfBlock = (x0, x1, y0, rows, rh) => {
    s.add(`<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${rows * rh + 10}" fill="url(#shelf)"/>`);
    for (let r = 0; r < rows; r++) {
      const y = y0 + 8 + r * rh; let x = x0 + 8;
      s.add(`<rect x="${x0 + 6}" y="${y}" width="${x1 - x0 - 12}" height="${rh - 4}" fill="#2b1a0f" opacity="0.55"/>`);
      while (x < x1 - 16) {
        const w = 10 + R() * 14, h = rh - 12 - R() * 16, c = cols[Math.floor(R() * cols.length)];
        const lean = R() < 0.08;
        s.add(`<rect x="${x.toFixed(1)}" y="${(y + rh - 4 - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${c}" ${lean ? `transform="rotate(8 ${x} ${y + rh})"` : ''}/><rect x="${(x + 2).toFixed(1)}" y="${(y + rh - 4 - h + 8).toFixed(1)}" width="${(w - 4).toFixed(1)}" height="3" fill="#f2e9cf" opacity="0.7"/>`);
        s.add(`<rect x="${x.toFixed(1)}" y="${(y + rh - 4 - h).toFixed(1)}" width="3" height="${h.toFixed(1)}" fill="#fff" opacity="0.15"/>`);
        x += w + 1;
      }
      s.add(`<rect x="${x0 + 4}" y="${y + rh - 4}" width="${x1 - x0 - 8}" height="6" fill="#4a3220"/>`);
    }
  };
  shelfBlock(0, 250, 40, 5, 70);
  shelfBlock(550, 800, 40, 5, 70);
  shelfBlock(285, 515, 120, 3, 62);
  s.add('<circle cx="400" cy="70" r="110" fill="url(#glow)" filter="url(#b16)"/><circle cx="130" cy="30" r="90" fill="url(#glow)" filter="url(#b16)"/><circle cx="670" cy="30" r="90" fill="url(#glow)" filter="url(#b16)"/>');
  [[400, 70], [130, 30], [670, 30]].forEach(([x, y]) => s.add(`<path d="M${x} 0V${y - 16}" stroke="#333" stroke-width="2"/><path d="M${x - 24} ${y + 8}Q${x} ${y - 24} ${x + 24} ${y + 8}Z" fill="#2f6b57"/><ellipse cx="${x}" cy="${y + 9}" rx="16" ry="4" fill="#fff6c9"/>`));
  // 前景桌子與書堆
  s.add(shadow(400, 560, 260, 20, 0.4));
  s.add('<path d="M170 430H630L660 470H140Z" fill="#cd9a68"/><rect x="140" y="470" width="520" height="22" fill="url(#tbl)"/><rect x="170" y="492" width="22" height="90" fill="#6d4526"/><rect x="608" y="492" width="22" height="90" fill="#6d4526"/>');
  const stack = (x, y, n, w) => { for (let i = 0; i < n; i++) { const c = cols[Math.floor(R() * cols.length)]; const hh = 18 + R() * 8; const off = (R() - 0.5) * 10; s.add(`<rect x="${x + off}" y="${y - (i + 1) * 22}" width="${w - R() * 14}" height="${hh}" rx="2" fill="${c}"/><rect x="${x + off + 3}" y="${y - (i + 1) * 22 + 4}" width="${w - 20}" height="${hh - 8}" fill="#f1e8d0" opacity="0.85"/>`); } };
  stack(220, 460, 5, 110); stack(470, 460, 3, 120);
  s.add('<rect x="355" y="408" width="88" height="22" rx="3" fill="#e4d9bd" transform="rotate(-4 400 420)"/><path d="M399 410V430" stroke="#9c8c68" stroke-width="2"/><rect x="341" y="432" width="116" height="10" rx="3" fill="#c34b3b" opacity="0.9"/>');
  s.add('<g transform="translate(575 330)"><rect x="-6" y="40" width="64" height="70" rx="8" fill="#b6683f"/><path d="M26 44C0 10 -10 -10 14 -20C22 0 30 10 26 44Z" fill="#4d8a4a"/><path d="M28 44C50 10 66 0 60 -22C42 -6 32 12 28 44Z" fill="#69a65a"/><path d="M26 44C22 0 30 -30 24 -50C12 -30 20 0 26 44Z" fill="#3c7440"/></g>');
  return s.out();
};

/* 2 湖邊 */
out.lake = () => {
  const s = Scene(); const R = rng(11);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#8fc3e8'], [0.7, '#e9f1f4'], [1, '#f7e8cf']]));
  s.def(lin('wat', 0, 0, 0, 1, [[0, '#9fc9d6'], [0.5, '#5f9db4'], [1, '#2f6b86']]));
  s.def(lin('mtn', 0, 0, 0, 1, [[0, '#7f9fb0'], [1, '#b4c8cf']]));
  s.def(lin('mtn2', 0, 0, 0, 1, [[0, '#5e8a78'], [1, '#9bb8a6']]));
  s.def(lin('dock', 0, 0, 0, 1, [[0, '#b58a5c'], [1, '#7c5632']]));
  s.def(rad('sun', 0.5, 0.5, 0.5, [[0, '#fff6d4', 0.95], [1, '#fff6d4', 0]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="560" cy="150" r="170" fill="url(#sun)"/>');
  s.add('<g opacity="0.85" filter="url(#b8)"><ellipse cx="160" cy="110" rx="120" ry="24" fill="#fff"/><ellipse cx="260" cy="90" rx="70" ry="20" fill="#fff"/><ellipse cx="640" cy="60" rx="100" ry="18" fill="#fff"/></g>');
  s.add('<path d="M0 290L90 210L170 260L270 170L380 270L470 220L560 280L680 200L800 290V320H0Z" fill="url(#mtn)"/>');
  s.add('<path d="M0 320L120 260L230 305L330 250L450 315L580 265L700 310L800 280V345H0Z" fill="url(#mtn2)" filter="url(#b2)"/>');
  s.add('<rect y="320" width="800" height="280" fill="url(#wat)"/>');
  s.add('<g opacity="0.5" filter="url(#b2)"><path d="M0 330L90 410L170 350L270 440L380 355L470 400L560 345L680 420L800 335V330Z" fill="#6f8fa0"/></g>');
  s.add('<ellipse cx="560" cy="360" rx="120" ry="12" fill="#fff6d4" opacity="0.55" filter="url(#b4)"/>');
  for (let i = 0; i < 46; i++) { const x = R() * 800, y = 345 + R() * 250, w = 14 + R() * 70 * ((y - 320) / 280); s.add(`<path d="M${x.toFixed(0)} ${y.toFixed(0)}h${w.toFixed(0)}" stroke="#fff" stroke-width="${(1 + (y - 340) / 120).toFixed(1)}" opacity="${(0.15 + R() * 0.3).toFixed(2)}" stroke-linecap="round"/>`); }
  // 鴨子
  const duck = (x, y, sc = 1, flip = 1) => s.add(`<g transform="translate(${x} ${y}) scale(${sc * flip} ${sc})">${shadow(0, 14, 30, 6, 0.25)}<ellipse cx="0" cy="6" rx="30" ry="14" fill="#f5f3ec"/><path d="M12 0C30 -4 40 8 24 14Z" fill="#e8e4d8"/><circle cx="26" cy="-12" r="11" fill="#2f6b4a"/><path d="M34 -12L48 -8L34 -5Z" fill="#e8a02f"/><circle cx="29" cy="-14" r="1.8" fill="#111"/><path d="M-8 6C-2 -4 12 -2 16 8C6 14 -2 14 -8 6Z" fill="#cfc9b8"/><path d="M-30 4Q-42 -4 -34 -8Q-28 -2 -26 4Z" fill="#ece8dc"/></g><ellipse cx="${x}" cy="${y + 22}" rx="${34 * sc}" ry="3" fill="#fff" opacity="0.5"/>`);
  duck(250, 470, 1.15, 1); duck(330, 500, 0.8, 1); duck(470, 440, 0.65, -1);
  // 棧橋
  s.add('<path d="M0 520L360 520L420 600H0Z" fill="url(#dock)"/><g stroke="#4a2f18" stroke-width="2" opacity="0.5"><path d="M0 540H382M0 565H402M0 590H416"/><path d="M90 520L60 600M180 520L170 600M270 520L270 600"/></g><path d="M0 520H360" stroke="#d9b98c" stroke-width="3"/>');
  s.add('<rect x="320" y="490" width="14" height="46" fill="#5a3b20"/><rect x="20" y="490" width="14" height="46" fill="#5a3b20"/><path d="M20 495H334" stroke="#7a5430" stroke-width="8"/>');
  // 蘆葦
  for (let i = 0; i < 26; i++) { const x = 600 + R() * 200, h = 90 + R() * 130, lean = (R() - 0.5) * 40; s.add(`<path d="M${x.toFixed(0)} 600Q${(x + lean / 2).toFixed(0)} ${600 - h / 2} ${(x + lean).toFixed(0)} ${600 - h}" stroke="${R() < 0.5 ? '#6f8a3c' : '#8aa04c'}" stroke-width="3" fill="none"/>`); if (R() < 0.4) s.add(`<ellipse cx="${(x + lean).toFixed(0)}" cy="${(600 - h).toFixed(0)}" rx="5" ry="16" fill="#8a5a36" transform="rotate(${(lean / 3).toFixed(0)} ${(x + lean).toFixed(0)} ${(600 - h).toFixed(0)})"/>`); }
  return s.out();
};

/* 3 早餐 */
out.breakfast = () => {
  const s = Scene(); const R = rng(5);
  s.def(lin('tbl', 0, 0, 0, 1, [[0, '#c99a66'], [1, '#9a6c40']]));
  s.def(rad('pl', 0.4, 0.35, 0.8, [[0, '#ffffff'], [1, '#dcd7cc']]));
  s.def(lin('egg', 0, 0, 0, 1, [[0, '#f3cf6b'], [1, '#d99a35']]));
  s.def(lin('milk', 0, 0, 0, 1, [[0, '#f6f1e4'], [1, '#e4dcc6']]));
  s.def(lin('fry', 0, 0, 1, 1, [[0, '#e9b155'], [0.5, '#c97d27'], [1, '#9d5a17']]));
  s.def(rad('win', 0.2, 0.0, 1.1, [[0, '#fff8de', 0.65], [1, '#fff8de', 0]]));
  s.add('<rect width="800" height="600" fill="url(#tbl)"/>');
  for (let i = 0; i < 22; i++) { const y = i * 28 + R() * 10; s.add(`<path d="M0 ${y.toFixed(0)}Q400 ${(y + (R() - 0.5) * 18).toFixed(0)} 800 ${y.toFixed(0)}" stroke="#6b4524" stroke-width="${(1 + R() * 2).toFixed(1)}" opacity="${(0.07 + R() * 0.1).toFixed(2)}" fill="none"/>`); }
  s.add('<path d="M0 90H800" stroke="#fff" opacity="0.05"/>');
  // 亞麻餐巾
  s.add('<path d="M40 380L250 350L270 560L60 585Z" fill="#e9e1d1"/><path d="M40 380L250 350" stroke="#fff" stroke-width="3" opacity="0.5"/><g stroke="#c8bda5" stroke-width="1" opacity="0.7"><path d="M60 420L260 400M62 460L262 440M64 500L264 480M66 540L266 520"/></g>');
  // 盤子與蛋餅
  s.add(shadow(430, 470, 220, 62, 0.35));
  s.add('<ellipse cx="420" cy="440" rx="215" ry="115" fill="url(#pl)"/><ellipse cx="420" cy="440" rx="168" ry="86" fill="#f3efe5"/><ellipse cx="420" cy="440" rx="168" ry="86" fill="none" stroke="#d4cfc2" stroke-width="2"/>');
  [[345, 400], [440, 392], [535, 410]].forEach(([x, y], i) => s.add(`<g transform="rotate(${-8 + i * 7} ${x} ${y})"><rect x="${x - 38}" y="${y - 36}" width="76" height="78" rx="14" fill="url(#egg)"/><ellipse cx="${x}" cy="${y - 36}" rx="38" ry="12" fill="#f8e4a2"/><path d="M${x - 24} ${y - 36}Q${x} ${y - 28} ${x + 24} ${y - 36}" stroke="#c98d2b" stroke-width="2" fill="none"/><path d="M${x - 20} ${y - 20}V${y + 30}M${x + 4} ${y - 18}V${y + 34}" stroke="#d9a23e" stroke-width="2" opacity="0.6"/><rect x="${x - 38}" y="${y - 36}" width="12" height="78" rx="8" fill="#fff" opacity="0.18"/></g>`));
  s.add('<ellipse cx="350" cy="448" rx="20" ry="7" fill="#c0392b" opacity="0.85"/><ellipse cx="452" cy="440" rx="18" ry="6" fill="#c0392b" opacity="0.85"/><ellipse cx="545" cy="458" rx="20" ry="7" fill="#c0392b" opacity="0.85"/>');
  // 豆漿碗
  s.add(shadow(640, 350, 112, 30, 0.35));
  s.add('<ellipse cx="640" cy="330" rx="105" ry="44" fill="#e8e1d2"/><path d="M535 326C540 400 600 420 640 420C690 420 745 400 745 326Z" fill="url(#pl)"/><ellipse cx="640" cy="326" rx="100" ry="38" fill="#d7cfb9"/><ellipse cx="640" cy="330" rx="92" ry="32" fill="url(#milk)"/><ellipse cx="620" cy="326" rx="40" ry="10" fill="#fff" opacity="0.5"/>');
  s.add('<g opacity="0.55" filter="url(#b4)" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"><path d="M610 290Q590 260 616 230Q640 200 616 170"/><path d="M660 292Q684 262 660 232Q640 205 662 178"/></g>');
  // 油條
  s.add(shadow(560, 560, 170, 14, 0.3));
  [[395, 540, -4], [450, 548, 2]].forEach(([x, y, r]) => s.add(`<g transform="rotate(${r} ${x} ${y})"><rect x="${x}" y="${y - 24}" width="200" height="40" rx="20" fill="url(#fry)"/><path d="M${x + 20} ${y - 6}Q${x + 100} ${y - 20} ${x + 180} ${y - 6}" stroke="#8a4c10" stroke-width="2.5" fill="none" opacity="0.6"/><rect x="${x + 16}" y="${y - 20}" width="150" height="8" rx="4" fill="#ffd98a" opacity="0.5"/></g>`));
  // 筷子與湯匙
  s.add('<g transform="rotate(-6 560 220)"><rect x="300" y="196" width="320" height="8" rx="4" fill="#8f4a2a"/><rect x="300" y="214" width="320" height="8" rx="4" fill="#a65a35"/></g>');
  s.add('<ellipse cx="700" cy="470" rx="34" ry="22" fill="#e6e4de"/><path d="M730 470L790 490" stroke="#d6d4cd" stroke-width="12" stroke-linecap="round"/><ellipse cx="697" cy="466" rx="24" ry="14" fill="#f8f7f2"/>');
  s.add('<rect width="800" height="600" fill="url(#win)"/>');
  return s.out();
};

/* 4 陽台 */
out.balcony = () => {
  const s = Scene(); const R = rng(21);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#9ccbea'], [1, '#f4eadb']]));
  s.def(lin('floor', 0, 0, 0, 1, [[0, '#a9a199'], [1, '#7c756d']]));
  s.def(lin('pot', 0, 0, 1, 0, [[0, '#d98458'], [0.5, '#c0623a'], [1, '#8f4426']]));
  s.def(rad('lf', 0.35, 0.3, 0.9, [[0, '#7fc062'], [0.6, '#3f8a3f'], [1, '#235a28']]));
  s.def(rad('lf2', 0.35, 0.3, 0.9, [[0, '#a0d27c'], [1, '#4f9a4a']]));
  s.def(rad('pk', 0.4, 0.4, 0.7, [[0, '#ffc0d0'], [1, '#e0577f']]));
  s.def(rad('sun', 0.7, 0.1, 0.9, [[0, '#fff5cc', 0.7], [1, '#fff5cc', 0]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<g filter="url(#b4)" opacity="0.8">' + [[40, 280, 70, 200], [130, 220, 80, 260], [230, 300, 60, 180], [320, 250, 90, 230], [450, 290, 70, 190], [540, 210, 85, 270], [650, 270, 75, 210], [740, 240, 70, 240]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${['#b9c3cc', '#a8b4bf', '#c7ced4'][Math.floor(R() * 3)]}"/>`).join('') + '</g>');
  s.add('<g filter="url(#b8)" opacity="0.8"><ellipse cx="200" cy="120" rx="110" ry="22" fill="#fff"/><ellipse cx="600" cy="90" rx="120" ry="20" fill="#fff"/></g><rect width="800" height="600" fill="url(#sun)"/>');
  // 欄杆
  s.add('<rect y="360" width="800" height="14" fill="#e8e8e6"/><rect y="372" width="800" height="5" fill="#9a9a96" opacity="0.5"/>');
  for (let x = 10; x < 800; x += 38) s.add(`<rect x="${x}" y="374" width="9" height="150" fill="#eeeeec"/><rect x="${x + 6}" y="374" width="3" height="150" fill="#000" opacity="0.1"/>`);
  s.add('<rect y="522" width="800" height="10" fill="#dcdcda"/>');
  s.add('<rect y="530" width="800" height="70" fill="url(#floor)"/><g stroke="#4c4640" opacity="0.25"><path d="M0 560H800M0 590H800M180 530V600M420 530V600M660 530V600"/></g>');
  // 花盆與植物
  const pot = (x, y, w, h) => s.add(`${shadow(x + w / 2, y + h + 6, w * 0.65, 10, 0.4)}<path d="M${x} ${y}H${x + w}L${x + w - 10} ${y + h}H${x + 10}Z" fill="url(#pot)"/><rect x="${x - 4}" y="${y - 10}" width="${w + 8}" height="16" rx="4" fill="#d9744a"/><rect x="${x - 2}" y="${y - 8}" width="10" height="12" fill="#fff" opacity="0.18"/>`);
  const leaves = (cx, cy, n, r, g = 'lf') => { for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (R() - 0.5) * 2.6, d = 20 + R() * r; const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.9; s.add(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(14 + R() * 12).toFixed(1)}" ry="${(24 + R() * 14).toFixed(1)}" fill="url(#${R() < 0.5 ? g : 'lf2'})" transform="rotate(${((a * 180) / Math.PI + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`); } };
  pot(60, 450, 110, 80); leaves(115, 440, 22, 80);
  [[85, 380], [140, 360], [118, 405], [160, 410]].forEach(([x, y]) => s.add(`<g><circle cx="${x}" cy="${y}" r="17" fill="url(#pk)"/><circle cx="${x}" cy="${y}" r="6" fill="#ffd96a"/><path d="M${x - 12} ${y - 4}Q${x} ${y - 16} ${x + 12} ${y - 4}" stroke="#fff" opacity="0.4" fill="none"/></g>`));
  pot(330, 470, 90, 60); leaves(375, 460, 26, 70); 
  [[330, 400], [395, 385], [420, 420], [355, 372]].forEach(([x, y]) => s.add(`<circle cx="${x}" cy="${y}" r="13" fill="#fff4cf"/><circle cx="${x}" cy="${y}" r="6" fill="#f2b630"/>`));
  pot(560, 440, 120, 90); leaves(620, 420, 30, 100);
  // 澆花壺
  s.add(shadow(470, 536, 70, 10, 0.4));
  s.add('<g transform="translate(450 470)"><path d="M-10 0H70L64 56H-4Z" fill="#4c86b8"/><path d="M-10 0H70L66 12H-8Z" fill="#6aa3d4"/><path d="M70 14L128 -26L136 -18L76 40Z" fill="#4c86b8"/><ellipse cx="134" cy="-24" rx="12" ry="7" fill="#7fb1db" transform="rotate(-38 134 -24)"/><path d="M-10 6Q-44 20 -10 48" stroke="#3a6d96" stroke-width="9" fill="none"/><path d="M0 0Q30 -34 60 0" stroke="#3a6d96" stroke-width="8" fill="none"/><rect x="2" y="6" width="9" height="46" fill="#fff" opacity="0.2"/></g>');
  return s.out();
};

/* 5 行李箱與車票 */
out.luggage = () => {
  const s = Scene(); const R = rng(3);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#e7e0d3'], [1, '#d4cbb9']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#b99a73'], [1, '#8a6c49']]));
  s.def(lin('sc', 0, 0, 1, 1, [[0, '#4f8fb8'], [0.5, '#2f6f9a'], [1, '#1d4f73']]));
  s.def(lin('pp', 0, 0, 1, 1, [[0, '#b53a46'], [1, '#7f1f2c']]));
  s.def(lin('tk', 0, 0, 1, 0, [[0, '#fbf8f1'], [1, '#eae3d2']]));
  s.def(rad('win', 0.1, 0.0, 1.0, [[0, '#fff6d8', 0.7], [1, '#fff6d8', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="330" width="800" height="270" fill="url(#fl)"/>');
  for (let i = 0; i < 9; i++) s.add(`<path d="M0 ${340 + i * 30}H800" stroke="#5a4326" stroke-width="2" opacity="0.18"/>`);
  s.add('<path d="M0 330H800" stroke="#fff" opacity="0.3" stroke-width="3"/><rect x="0" y="318" width="800" height="14" fill="#cfc6b3"/>');
  // 窗
  s.add('<rect x="470" y="60" width="270" height="210" fill="#9fcdea"/><path d="M470 270L540 190L600 235L660 170L740 250V270Z" fill="#6f9a84"/><rect x="470" y="60" width="270" height="210" fill="none" stroke="#f5f1e8" stroke-width="12"/><path d="M605 60V270M470 165H740" stroke="#f5f1e8" stroke-width="8"/>');
  // 行李箱
  s.add(shadow(230, 560, 190, 22, 0.45));
  s.add('<rect x="150" y="150" width="14" height="30" fill="#222"/><rect x="290" y="150" width="14" height="30" fill="#222"/><path d="M150 152H304" stroke="#2a2a2a" stroke-width="12" stroke-linecap="round"/><rect x="100" y="180" width="260" height="360" rx="34" fill="url(#sc)"/>');
  for (let i = 0; i < 7; i++) s.add(`<rect x="${130 + i * 34}" y="200" width="12" height="320" rx="6" fill="#1b4a6c" opacity="0.55"/><rect x="${130 + i * 34}" y="200" width="4" height="320" rx="2" fill="#fff" opacity="0.2"/>`);
  s.add('<rect x="100" y="180" width="70" height="360" rx="34" fill="#fff" opacity="0.1"/><rect x="100" y="352" width="260" height="6" fill="#143b57" opacity="0.7"/><rect x="214" y="342" width="32" height="26" rx="5" fill="#d8dde0"/><circle cx="150" cy="552" r="14" fill="#222"/><circle cx="310" cy="552" r="14" fill="#222"/><rect x="120" y="260" width="64" height="44" rx="4" fill="#f3efe6" transform="rotate(-6 150 280)"/><path d="M130 275H172M130 287H160" stroke="#b9442f" stroke-width="3" transform="rotate(-6 150 280)"/>');
  // 護照
  s.add(shadow(540, 480, 100, 14, 0.4));
  s.add('<g transform="rotate(-12 540 440)"><rect x="470" y="360" width="140" height="190" rx="8" fill="url(#pp)"/><rect x="470" y="360" width="10" height="190" fill="#000" opacity="0.2"/><circle cx="540" cy="440" r="30" fill="none" stroke="#e8c76a" stroke-width="3"/><path d="M510 440H570M540 410V470M520 422Q540 440 520 458M560 422Q540 440 560 458" stroke="#e8c76a" stroke-width="2" fill="none"/><rect x="498" y="496" width="84" height="6" rx="3" fill="#e8c76a"/></g>');
  // 車票
  s.add('<g transform="rotate(8 680 520)">' + shadow(684, 540, 80, 9, 0.3) + '<rect x="600" y="470" width="170" height="78" rx="6" fill="url(#tk)"/><rect x="600" y="470" width="42" height="78" fill="#d94b3d"/><path d="M642 470V548" stroke="#c9bfa6" stroke-dasharray="4 4"/><path d="M654 490H756M654 506H740M654 522H720" stroke="#6a6354" stroke-width="3"/><rect x="610" y="486" width="22" height="46" fill="#fff" opacity="0.4"/></g>');
  // 太陽眼鏡與帽子
  s.add('<g transform="translate(380 410)">' + shadow(40, 52, 60, 7, 0.4) + '<rect x="-4" y="12" width="42" height="30" rx="14" fill="#222"/><rect x="48" y="12" width="42" height="30" rx="14" fill="#222"/><path d="M38 22Q43 16 48 22" stroke="#222" stroke-width="4" fill="none"/><rect x="0" y="16" width="14" height="8" rx="4" fill="#fff" opacity="0.25"/></g>');
  s.add('<rect width="800" height="600" fill="url(#win)"/>');
  return s.out();
};


/* 6 臥室 */
out.bedroom = () => {
  const s = Scene(); const R = rng(9);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#d8dfe6'], [1, '#c3ccd6']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#b58f66'], [1, '#8b6844']]));
  s.def(lin('duv', 0, 0, 0, 1, [[0, '#f4f1ea'], [1, '#d9d4c7']]));
  s.def(lin('blk', 0, 0, 0, 1, [[0, '#6f8fa8'], [1, '#4b6a82']]));
  s.def(lin('cur', 0, 0, 1, 0, [[0, '#efe6d6'], [0.5, '#f9f3e6'], [1, '#e3d8c3']]));
  s.def(rad('lamp', 0.5, 0.5, 0.5, [[0, '#ffd88a', 0.85], [1, '#ffd88a', 0]]));
  s.def(rad('moon', 0.5, 0.5, 0.5, [[0, '#dce8ff', 0.5], [1, '#dce8ff', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><rect y="430" width="800" height="170" fill="url(#fl)"/><rect y="424" width="800" height="10" fill="#efefef"/>');
  // 窗
  s.add('<rect x="270" y="60" width="260" height="250" fill="#1d2f4d"/><circle cx="430" cy="130" r="26" fill="#f3f0dc"/><circle cx="430" cy="130" r="80" fill="url(#moon)"/>');
  for (let i = 0; i < 18; i++) s.add(`<circle cx="${(280 + R() * 240).toFixed(0)}" cy="${(70 + R() * 130).toFixed(0)}" r="${(1 + R() * 1.3).toFixed(1)}" fill="#fff" opacity="${(0.4 + R() * 0.5).toFixed(2)}"/>`);
  s.add('<path d="M270 310V250L330 220L390 250V310Z" fill="#101a2e"/><g fill="#ffd88a" opacity="0.9"><rect x="290" y="262" width="8" height="10"/><rect x="340" y="250" width="8" height="10"/><rect x="360" y="282" width="8" height="10"/></g>');
  s.add('<rect x="270" y="60" width="260" height="250" fill="none" stroke="#f3efe6" stroke-width="12"/><path d="M400 60V310M270 185H530" stroke="#f3efe6" stroke-width="7"/><rect x="258" y="310" width="284" height="14" fill="#e6e1d6"/>');
  // 窗簾
  s.add('<path d="M215 40H300C292 120 296 220 306 330H215Z" fill="url(#cur)"/><path d="M500 40H585C585 120 580 220 585 330H494C504 220 508 120 500 40Z" fill="url(#cur)"/><g stroke="#cfc3a9" opacity="0.7"><path d="M240 40L236 330M268 40L262 330M526 40L526 330M556 40L560 330"/></g><rect x="200" y="30" width="400" height="8" rx="4" fill="#6a5a45"/>');
  // 床
  s.add(shadow(400, 575, 330, 26, 0.45));
  s.add('<rect x="100" y="330" width="600" height="110" rx="10" fill="#7c5535"/><rect x="100" y="320" width="600" height="60" rx="14" fill="#8e6340"/>');
  s.add('<path d="M110 420L110 570H690L690 420Q400 395 110 420Z" fill="url(#duv)"/><path d="M110 420Q400 395 690 420L690 450Q400 428 110 452Z" fill="url(#blk)"/>');
  for (let i = 0; i < 6; i++) s.add(`<path d="M${130 + i * 100} 460Q${150 + i * 100} 520 ${126 + i * 100} 570" stroke="#b9b3a2" stroke-width="3" fill="none" opacity="0.5"/>`);
  s.add('<path d="M110 450Q400 430 690 450" stroke="#fff" opacity="0.4" stroke-width="3" fill="none"/>');
  // 枕頭
  s.add('<g><rect x="150" y="355" width="210" height="82" rx="34" fill="#fbf9f4"/><rect x="150" y="355" width="210" height="30" rx="15" fill="#fff"/><path d="M165 420Q255 440 345 420" stroke="#d7d1c2" stroke-width="3" fill="none"/><rect x="430" y="355" width="210" height="82" rx="34" fill="#f1ede3"/><rect x="430" y="355" width="210" height="30" rx="15" fill="#fbf8f0"/><path d="M445 420Q535 440 625 420" stroke="#d0cabb" stroke-width="3" fill="none"/></g>');
  // 貓
  s.add('<g transform="translate(390 478)"><ellipse cx="0" cy="22" rx="92" ry="14" fill="#000" opacity="0.18" filter="url(#b4)"/><path d="M-82 18C-90 -30 -40 -48 20 -42C80 -38 100 -6 86 18C60 30 -40 30 -82 18Z" fill="#c9895a"/><path d="M-40 -34C-10 -48 30 -48 50 -36C30 -26 -10 -26 -40 -34Z" fill="#e6b184" opacity="0.8"/><path d="M-60 -22Q-40 -34 -20 -20M-30 -30Q-10 -42 10 -26M10 -34Q30 -42 48 -28" stroke="#9a5f36" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.75"/><path d="M80 10C112 4 118 -22 100 -34C112 -10 100 4 80 4Z" fill="#c9895a"/><circle cx="-70" cy="0" r="30" fill="#c9895a"/><path d="M-92 -22L-86 -50L-68 -30Z M-72 -30L-56 -52L-48 -22Z" fill="#c9895a"/><path d="M-88 -26L-85 -42L-74 -30Z" fill="#e9a5a0"/><path d="M-82 -2Q-76 -8 -68 -2M-62 -2Q-56 -8 -48 -2" stroke="#3a2418" stroke-width="2.5" fill="none"/><ellipse cx="-62" cy="8" rx="4" ry="3" fill="#d96f6f"/><path d="M-92 8L-112 4M-92 12L-112 14M-48 8L-30 4M-48 12L-30 14" stroke="#fff" stroke-width="1.5" opacity="0.7"/></g>');
  // 床頭燈
  s.add('<circle cx="725" cy="300" r="120" fill="url(#lamp)" filter="url(#b8)"/><rect x="690" y="380" width="100" height="120" fill="#7c5535"/><rect x="684" y="372" width="112" height="14" fill="#9a6d46"/><rect x="722" y="340" width="10" height="34" fill="#3a3a3a"/><path d="M700 345L714 290H742L756 345Z" fill="#f6d79a"/><ellipse cx="727" cy="346" rx="29" ry="5" fill="#fff0c8"/>');
  s.add('<g transform="translate(40 330)"><rect x="0" y="40" width="60" height="110" fill="#7c5535"/><rect x="-6" y="32" width="72" height="12" fill="#9a6d46"/><rect x="14" y="2" width="30" height="30" rx="4" fill="#e9e3d3"/><rect x="18" y="6" width="22" height="22" fill="#9bc3d9"/></g>');
  return s.out();
};

/* 7 海邊 */
out.seaside = () => {
  const s = Scene(); const R = rng(14);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#4a9fe0'], [1, '#bfe3f4']]));
  s.def(lin('sea', 0, 0, 0, 1, [[0, '#2a8aa8'], [0.5, '#46b4c2'], [1, '#8ad5d0']]));
  s.def(lin('sand', 0, 0, 0, 1, [[0, '#ecd7a8'], [1, '#d3b27b']]));
  s.def(rad('sun', 0.5, 0.5, 0.5, [[0, '#fffbe0', 0.9], [1, '#fffbe0', 0]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="640" cy="90" r="180" fill="url(#sun)"/><circle cx="640" cy="90" r="34" fill="#fffbe6"/>');
  s.add('<g filter="url(#b8)" opacity="0.9"><ellipse cx="170" cy="100" rx="100" ry="22" fill="#fff"/><ellipse cx="240" cy="82" rx="60" ry="20" fill="#fff"/><ellipse cx="460" cy="150" rx="90" ry="14" fill="#fff"/></g>');
  s.add('<rect y="250" width="800" height="200" fill="url(#sea)"/><rect y="250" width="800" height="3" fill="#fff" opacity="0.5"/>');
  s.add('<g opacity="0.45" filter="url(#b2)"><ellipse cx="640" cy="290" rx="90" ry="10" fill="#fff"/></g>');
  for (let i = 0; i < 40; i++) { const y = 262 + R() * 170, x = R() * 800, w = 20 + R() * 90 * ((y - 250) / 200); s.add(`<path d="M${x.toFixed(0)} ${y.toFixed(0)}h${w.toFixed(0)}" stroke="#fff" opacity="${(0.15 + R() * 0.3).toFixed(2)}" stroke-width="${(1 + (y - 250) / 80).toFixed(1)}" stroke-linecap="round"/>`); }
  // 帆船
  s.add('<g transform="translate(180 268)"><path d="M0 0L60 0L50 12H8Z" fill="#7a4c2a"/><path d="M28 -4V-70L56 -8Z" fill="#fff"/><path d="M24 -4V-56L6 -8Z" fill="#f1d36a"/></g>');
  // 浪線
  s.add('<path d="M0 420Q100 400 200 420T400 420T600 420T800 420V470H0Z" fill="#dff4f1" opacity="0.8"/><path d="M0 440Q100 425 200 440T400 440T600 440T800 440V470H0Z" fill="#fff" opacity="0.8"/>');
  s.add('<path d="M0 450Q120 438 240 452T480 450T800 448V600H0Z" fill="url(#sand)"/><path d="M0 450Q120 438 240 452T480 450T800 448V462Q600 466 480 462T240 466T0 462Z" fill="#9c8250" opacity="0.35"/>');
  for (let i = 0; i < 160; i++) s.add(`<circle cx="${(R() * 800).toFixed(0)}" cy="${(470 + R() * 130).toFixed(0)}" r="${(0.8 + R() * 1.6).toFixed(1)}" fill="${R() < 0.5 ? '#b99a62' : '#fff2cf'}" opacity="0.5"/>`);
  // 太陽傘
  s.add(shadow(520, 560, 190, 18, 0.28));
  s.add('<rect x="428" y="270" width="8" height="290" fill="#e9e3d3" transform="rotate(6 432 560)"/>');
  const sl = (a, b, c) => `<path d="M${a} 316Q${b} 240 ${c} 310Z" fill="${(a + b) % 2 ? '#e24e4a' : '#fff'}"/>`;
  s.add('<g transform="rotate(6 432 320)"><path d="M270 330Q320 215 432 205Q544 215 594 330Q560 316 530 332Q500 316 470 332Q440 316 410 332Q380 316 350 332Q320 316 270 330Z" fill="#fff"/><path d="M270 330Q300 250 365 222L400 330Z" fill="#e24e4a"/><path d="M432 205Q500 215 530 330L470 330Q450 270 432 205Z" fill="#e24e4a"/><path d="M500 220Q560 255 594 330Q560 316 530 332Z" fill="#fff"/><path d="M270 330Q300 250 365 222" stroke="#fff" stroke-width="3" fill="none" opacity="0.4"/></g>');
  // 毛巾、拖鞋、貝殼、球
  s.add('<g transform="rotate(-6 460 545)"><rect x="330" y="500" width="260" height="80" rx="6" fill="#3d8fc0"/><g fill="#fff" opacity="0.9"><rect x="330" y="512" width="260" height="10"/><rect x="330" y="536" width="260" height="10"/><rect x="330" y="560" width="260" height="10"/></g><path d="M330 500H590" stroke="#fff" opacity="0.4" stroke-width="3"/></g>');
  s.add('<g transform="translate(130 520) rotate(-20)">' + shadow(0, 40, 50, 8, 0.3) + '<path d="M-14 -34C-34 -34 -34 30 -10 40C16 44 34 34 34 8C34 -22 14 -34 -14 -34Z" fill="#f08c3a"/><path d="M-6 -30Q4 -4 -2 -2M10 -32Q2 -6 -2 -2" stroke="#fff" stroke-width="4" fill="none" opacity="0.85"/></g>');
  s.add('<g transform="translate(200 548) rotate(-30)"><path d="M-14 -34C-34 -34 -34 30 -10 40C16 44 34 34 34 8C34 -22 14 -34 -14 -34Z" fill="#f08c3a"/><path d="M-6 -30Q4 -4 -2 -2M10 -32Q2 -6 -2 -2" stroke="#fff" stroke-width="4" fill="none" opacity="0.85"/></g>');
  s.add('<g transform="translate(700 530)">' + shadow(0, 30, 40, 6, 0.3) + '<circle r="38" fill="#fff"/><path d="M-38 0A38 38 0 0 1 0 -38V38A38 38 0 0 1 -38 0Z" fill="#e24e4a"/><path d="M0 -38A38 38 0 0 1 38 0L0 0Z" fill="#f1c84a"/><path d="M0 0L38 0A38 38 0 0 1 0 38Z" fill="#3d8fc0"/><circle r="38" fill="none" stroke="#000" opacity="0.1"/><circle cx="-12" cy="-14" r="12" fill="#fff" opacity="0.3"/></g>');
  s.add('<g transform="translate(250 580)"><path d="M0 0C-24 -8 -26 -34 0 -38C26 -34 24 -8 0 0Z" fill="#f5d6cf"/><path d="M0 0V-36M-10 -3V-34M10 -3V-34" stroke="#d9a79c" stroke-width="2"/></g>');
  return s.out();
};

/* 8 山路 */
out.trail = () => {
  const s = Scene(); const R = rng(31);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#7fb5e4'], [1, '#e9f1f0']]));
  s.def(lin('m1', 0, 0, 0, 1, [[0, '#8aa4bb'], [1, '#c5d3dd']]));
  s.def(lin('m2', 0, 0, 0, 1, [[0, '#5f8a73'], [1, '#a9c4b3']]));
  s.def(lin('m3', 0, 0, 0, 1, [[0, '#3f7048'], [1, '#6a9a64']]));
  s.def(lin('path', 0, 0, 0, 1, [[0, '#cdb48b'], [1, '#a68a60']]));
  s.def(lin('wd', 0, 0, 1, 0, [[0, '#9a6e44'], [0.6, '#7a5230'], [1, '#573820']]));
  s.def(rad('sun', 0.3, 0.2, 0.8, [[0, '#fff4c8', 0.8], [1, '#fff4c8', 0]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="200" cy="100" r="260" fill="url(#sun)"/>');
  s.add('<g filter="url(#b8)" opacity="0.9"><ellipse cx="560" cy="110" rx="130" ry="20" fill="#fff"/><ellipse cx="660" cy="86" rx="70" ry="16" fill="#fff"/></g>');
  s.add('<path d="M0 300L120 170L200 240L330 100L470 250L560 190L700 280L800 220V380H0Z" fill="url(#m1)"/><path d="M330 100L300 150L330 140L350 170L380 130Z" fill="#fff" opacity="0.55"/>');
  s.add('<g filter="url(#b8)" opacity="0.8"><ellipse cx="400" cy="300" rx="330" ry="26" fill="#fff"/></g>');
  s.add('<path d="M0 360L90 290L200 340L330 270L460 350L600 290L720 340L800 300V430H0Z" fill="url(#m2)"/>');
  s.add('<g filter="url(#b8)" opacity="0.65"><ellipse cx="300" cy="372" rx="300" ry="20" fill="#fff"/></g>');
  s.add('<path d="M0 420Q150 360 300 400Q500 330 800 400V600H0Z" fill="url(#m3)"/>');
  const pine = (x, y, h, c = '#2d5a3a') => { let t = `<rect x="${x - 3}" y="${y - h * 0.2}" width="6" height="${h * 0.22}" fill="#4a3322"/>`; for (let i = 0; i < 4; i++) { const yy = y - h * 0.15 - i * h * 0.22, w = h * (0.34 - i * 0.06); t += `<path d="M${x - w} ${yy}L${x} ${yy - h * 0.34}L${x + w} ${yy}Z" fill="${shade(c, i * 0.08)}"/>`; } return t; };
  for (let i = 0; i < 10; i++) s.add(pine(20 + i * 30 + R() * 14, 430 + R() * 20, 60 + R() * 30, '#3f7a4d'));
  for (let i = 0; i < 6; i++) s.add(pine(600 + i * 34 + R() * 10, 430 + R() * 10, 70 + R() * 24, '#3f7a4d'));
  // 小路
  s.add('<path d="M270 600C300 540 360 520 400 500C440 480 450 450 440 430L470 430C490 460 480 490 470 505C500 530 560 560 640 600Z" fill="url(#path)"/><path d="M270 600C300 540 360 520 400 500C440 480 450 450 440 430" stroke="#6b552f" stroke-width="3" fill="none" opacity="0.3"/>');
  for (let i = 0; i < 40; i++) { const y = 440 + R() * 160; const t = (y - 430) / 170; const xl = 440 - t * 150 + R() * 4, xr = 470 + t * 120; const x = xl + R() * (xr - xl); s.add(`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(2 + R() * 5 * t + 1).toFixed(1)}" ry="${(1 + R() * 3 * t).toFixed(1)}" fill="${R() < 0.5 ? '#8f7650' : '#d8c29a'}" opacity="0.7"/>`); }
  // 前景樹
  s.add('<g filter="url(#b2)">' + pine(90, 600, 330, '#25502f') + pine(740, 600, 380, '#25502f') + '</g>');
  // 路標
  s.add(shadow(160, 596, 70, 9, 0.4));
  s.add('<g transform="translate(130 340)"><rect x="0" y="0" width="14" height="260" fill="url(#wd)"/><path d="M-36 20H86L104 38L86 56H-36Z" fill="#d9ab6a"/><path d="M-36 20H86L104 38" stroke="#fff" opacity="0.3" stroke-width="2" fill="none"/><path d="M-26 38H74" stroke="#5a3b1c" stroke-width="4" stroke-linecap="round" opacity="0.7"/><path d="M-30 78H70L52 96L70 114H-30Z" fill="#c6935a" transform="translate(14 0)"/><path d="M-6 96H54" stroke="#5a3b1c" stroke-width="4" stroke-linecap="round" opacity="0.7"/></g>');
  // 石頭與野花
  [[30, 585, 40, 24], [190, 590, 34, 18], [560, 570, 50, 26]].forEach(([x, y, w, h]) => s.add(`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="#8e8e88"/><ellipse cx="${x - w * 0.2}" cy="${y - h * 0.3}" rx="${w * 0.6}" ry="${h * 0.5}" fill="#b8b8b0"/>`));
  for (let i = 0; i < 18; i++) { const x = 240 + R() * 420, y = 520 + R() * 70; s.add(`<path d="M${x.toFixed(0)} ${y.toFixed(0)}v-12" stroke="#3d7a3a" stroke-width="2"/><circle cx="${x.toFixed(0)}" cy="${(y - 14).toFixed(0)}" r="4" fill="${['#f2d14a', '#fff', '#e8738a'][i % 3]}"/>`); }
  return s.out();
};

/* 9 腳踏車 */
out.bicycle = () => {
  const s = Scene(); const R = rng(8);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#cf8a64'], [1, '#b66e49']]));
  s.def(lin('wall2', 0, 0, 1, 0, [[0, '#e8dcc6'], [1, '#d7c8ab']]));
  s.def(lin('pave', 0, 0, 0, 1, [[0, '#a9a7a2'], [1, '#7f7d78']]));
  s.def(rad('sun', 0.9, 0.0, 1.0, [[0, '#fff0b8', 0.7], [1, '#fff0b8', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  for (let r = 0; r < 14; r++) for (let c = 0; c < 18; c++) { const x = c * 48 - (r % 2) * 24, y = r * 24; s.add(`<rect x="${x + 1}" y="${y + 1}" width="46" height="22" fill="${['#c47c56', '#b9704a', '#d08b64', '#be7650'][Math.floor(R() * 4)]}" opacity="0.9"/>`); }
  s.add('<rect x="0" y="0" width="800" height="330" fill="none"/><rect x="560" y="70" width="190" height="250" fill="#2f4f4a"/><rect x="568" y="78" width="174" height="234" fill="#8fc0c8"/><path d="M655 78V312M568 195H742" stroke="#2f4f4a" stroke-width="6"/><path d="M568 78L742 312" stroke="#fff" opacity="0.18" stroke-width="30"/><rect x="550" y="312" width="210" height="14" fill="#e8dcc6"/>');
  s.add('<g transform="translate(578 296)"><rect x="0" y="0" width="150" height="20" fill="#8b5a36"/><path d="M10 0Q20 -30 40 -8Q48 -36 70 -10Q90 -40 100 -6Q120 -26 138 0Z" fill="#4c8a4c"/><circle cx="40" cy="-14" r="6" fill="#f2a1b8"/><circle cx="96" cy="-20" r="6" fill="#f2a1b8"/></g>');
  s.add('<rect y="470" width="800" height="130" fill="url(#pave)"/><rect y="462" width="800" height="14" fill="#cfcdc6"/><g stroke="#55534f" opacity="0.35"><path d="M0 520H800M0 570H800M160 476V600M420 476V600M680 476V600"/></g>');
  // 腳踏車
  s.add(shadow(360, 522, 250, 18, 0.45));
  const wheel = (cx, cy) => { let t = `<circle cx="${cx}" cy="${cy}" r="78" fill="none" stroke="#202020" stroke-width="9"/><circle cx="${cx}" cy="${cy}" r="70" fill="none" stroke="#9aa0a4" stroke-width="3"/>`; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; t += `<path d="M${cx} ${cy}L${(cx + Math.cos(a) * 70).toFixed(1)} ${(cy + Math.sin(a) * 70).toFixed(1)}" stroke="#bfc4c8" stroke-width="1"/>`; } return t + `<circle cx="${cx}" cy="${cy}" r="9" fill="#555"/>`; };
  s.add(wheel(190, 440) + wheel(520, 440));
  s.add('<g fill="none" stroke="#d63a35" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><path d="M190 440L270 330L440 330L520 440"/><path d="M270 330L330 440L440 330"/><path d="M330 440L190 440"/><path d="M440 330L420 280"/></g>');
  s.add('<path d="M270 330L330 440L440 330" stroke="#fff" stroke-width="2" opacity="0.3" fill="none"/><path d="M390 280H455" stroke="#222" stroke-width="9" stroke-linecap="round"/><path d="M248 316H300" stroke="#222" stroke-width="12" stroke-linecap="round"/><path d="M270 330L262 312" stroke="#333" stroke-width="7"/><circle cx="330" cy="440" r="22" fill="none" stroke="#777" stroke-width="5"/><path d="M330 440L352 470" stroke="#333" stroke-width="7"/><rect x="340" y="468" width="30" height="10" rx="3" fill="#222"/>');
  // 籃子與花
  s.add('<g transform="translate(450 232)"><path d="M0 0H86L74 62H12Z" fill="#c9a06a"/><g stroke="#8a6a3a" stroke-width="2" opacity="0.7"><path d="M0 16H84M4 32H80M8 48H76"/><path d="M20 0L26 62M42 0V62M64 0L58 62"/></g><path d="M-2 0H88" stroke="#9a7442" stroke-width="6"/><g><path d="M20 -2V-44M44 -2V-62M66 -2V-40" stroke="#3d7a3a" stroke-width="3"/><circle cx="20" cy="-50" r="16" fill="#f4c542"/><circle cx="20" cy="-50" r="6" fill="#8a5a1c"/><circle cx="44" cy="-68" r="18" fill="#f6a1b8"/><circle cx="44" cy="-68" r="6" fill="#fff3a8"/><circle cx="68" cy="-46" r="15" fill="#fff"/><circle cx="68" cy="-46" r="6" fill="#f2b630"/></g></g>');
  return s.out();
};

/* 10 水果攤 */
out.fruit = () => {
  const s = Scene(); const R = rng(17);
  s.def(lin('bg', 0, 0, 0, 1, [[0, '#cfe2c6'], [1, '#e6dcc2']]));
  s.def(lin('wd', 0, 0, 0, 1, [[0, '#c69560'], [1, '#8f6338']]));
  s.def(rad('mg', 0.35, 0.3, 0.9, [[0, '#ffd45a'], [0.6, '#f59b2f'], [1, '#d9692a']]));
  s.def(rad('or', 0.35, 0.3, 0.9, [[0, '#ffc15a'], [0.6, '#f08a1a'], [1, '#c8630c']]));
  s.def(rad('wm', 0.35, 0.3, 0.9, [[0, '#5da04a'], [0.7, '#2f6f3a'], [1, '#1c4a28']]));
  s.def(rad('ap', 0.35, 0.3, 0.9, [[0, '#ff7a6a'], [0.6, '#d9342b'], [1, '#8f1a1a']]));
  s.def(lin('bn', 0, 0, 0, 1, [[0, '#ffe56a'], [1, '#e1b727']]));
  s.add('<rect width="800" height="600" fill="url(#bg)"/>');
  s.add('<g filter="url(#b8)" opacity="0.9"><rect x="20" y="170" width="120" height="260" fill="#b8c9a8"/><rect x="660" y="140" width="130" height="290" fill="#c9bf9c"/><circle cx="420" cy="260" r="110" fill="#a9c79a" opacity="0.7"/></g>');
  // 遮陽棚
  for (let i = 0; i < 10; i++) s.add(`<path d="M${i * 80} 0H${i * 80 + 80}L${i * 80 + 72} 100Q${i * 80 + 40} 124 ${i * 80 + 8} 100Z" fill="${i % 2 ? '#fff6e0' : '#d84a3c'}"/>`);
  s.add('<path d="M0 100Q40 124 80 100T160 100T240 100T320 100T400 100T480 100T560 100T640 100T720 100T800 100V0H0Z" fill="none"/><rect y="0" width="800" height="16" fill="#000" opacity="0.15"/>');
  s.add('<rect x="30" y="100" width="10" height="260" fill="#6a4a2a"/><rect x="760" y="100" width="10" height="260" fill="#6a4a2a"/>');
  s.add('<rect y="360" width="800" height="240" fill="#6b4a2c"/>');
  // 木箱
  const crate = (x, y, w, h) => s.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#wd)"/><g stroke="#5a3b1c" opacity="0.6" stroke-width="2"><path d="M${x} ${y + h * 0.33}H${x + w}M${x} ${y + h * 0.66}H${x + w}"/></g><rect x="${x}" y="${y}" width="${w}" height="8" fill="#e0b27a" opacity="0.6"/>`);
  const ball = (x, y, r, g) => s.add(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="url(#${g})"/>`);
  // 西瓜（左）
  crate(40, 410, 250, 110);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const x = 100 + i * 70 + j * 30, y = 395 - j * 22; s.add(`<ellipse cx="${x}" cy="${y}" rx="48" ry="42" fill="url(#wm)"/><path d="M${x - 40} ${y - 12}Q${x} ${y - 36} ${x + 40} ${y - 12}M${x - 44} ${y + 6}Q${x} ${y - 20} ${x + 44} ${y + 6}" stroke="#1f5a2a" stroke-width="4" fill="none" opacity="0.6"/>`); }
  s.add('<g transform="translate(220 340)"><ellipse cx="0" cy="0" rx="52" ry="48" fill="#2f6f3a"/><ellipse cx="0" cy="0" rx="44" ry="40" fill="#eaf3d0"/><ellipse cx="0" cy="0" rx="38" ry="34" fill="#ee4b55"/><circle cx="-14" cy="-8" r="3" fill="#2a1a1a"/><circle cx="10" cy="-14" r="3" fill="#2a1a1a"/><circle cx="14" cy="8" r="3" fill="#2a1a1a"/><circle cx="-8" cy="12" r="3" fill="#2a1a1a"/><circle cx="-24" cy="6" r="3" fill="#2a1a1a"/><ellipse cx="-12" cy="-18" rx="14" ry="6" fill="#fff" opacity="0.2"/></g>');
  // 芒果（中）
  crate(310, 430, 220, 100);
  for (let i = 0; i < 8; i++) { const x = 340 + (i % 4) * 46 + (i > 3 ? 20 : 0), y = i > 3 ? 404 : 420; s.add(`<ellipse cx="${x}" cy="${y}" rx="26" ry="34" fill="url(#mg)" transform="rotate(${-18 + i * 5} ${x} ${y})"/><ellipse cx="${x - 7}" cy="${y - 12}" rx="6" ry="12" fill="#fff" opacity="0.28" transform="rotate(${-18 + i * 5} ${x} ${y})"/>`); }
  // 橘子與蘋果（右）
  crate(560, 410, 200, 110);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5 - r; c++) { const x = 590 + c * 36 + r * 18, y = 400 - r * 30; ball(x, y, 22, r === 1 ? 'ap' : 'or'); s.add(`<ellipse cx="${x - 7}" cy="${y - 9}" rx="6" ry="4" fill="#fff" opacity="0.3"/><path d="M${x} ${y - 21}l3 -5" stroke="#3d6a2a" stroke-width="2"/>`); }
  // 香蕉
  s.add('<g transform="translate(405 354)">' + [0, 1, 2, 3].map((i) => `<path d="M${-60 + i * 8} ${i * 6}C${-20 + i * 8} ${-40 + i * 6} ${40 + i * 8} ${-34 + i * 6} ${74 + i * 8} ${-6 + i * 6}C${44 + i * 8} ${-14 + i * 6} ${-10 + i * 8} ${-4 + i * 6} ${-60 + i * 8} ${i * 6}Z" fill="url(#bn)" stroke="#a37c14" stroke-width="1.5"/>`).join('') + '<path d="M-62 0L-70 -6" stroke="#5a4310" stroke-width="6" stroke-linecap="round"/></g>');
  // 價格牌與秤
  s.add('<g transform="translate(150 250) rotate(-3)"><rect width="110" height="60" rx="4" fill="#fffdf4"/><rect width="110" height="12" fill="#d84a3c"/><text x="55" y="48" font-size="34" font-weight="700" text-anchor="middle" fill="#2b2b2b" font-family="sans-serif">$30</text></g>');
  s.add('<g transform="translate(600 270) rotate(2)"><rect width="110" height="60" rx="4" fill="#fffdf4"/><rect width="110" height="12" fill="#d84a3c"/><text x="55" y="48" font-size="34" font-weight="700" text-anchor="middle" fill="#2b2b2b" font-family="sans-serif">$50</text></g>');
  s.add('<g transform="translate(40 560)"><path d="M0 0H730" stroke="#4a301a" stroke-width="3" opacity="0.5"/></g>');
  return s.out();
};

module.exports = out;
