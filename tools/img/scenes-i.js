const { rng, lin, rad, Scene, shadow, person, shade, SKINS } = require('./lib');
const out = {};
const FF = 'Noto Sans TC, PingFang TC, Microsoft JhengHei, sans-serif';
const txt = (x, y, size, str, fill = '#fff', anchor = 'middle', weight = 700, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${fill}" font-family="${FF}" ${extra}>${str}</text>`;
const P2 = (pts) => pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
const stroke = (pts, w, c, extra = '') => `<path d="M${P2(pts)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none" ${extra}/>`;

/* 自製可擺任意姿勢的人（關節點 → 粗線條）
   o: r 頭半徑, head[x,y], neck[x,y], hip[x,y], dir(-1,0,1 臉朝向), skin, hair, hairStyle(short|long|bun|ponytail|gray|none),
   top, bottom, shoe, short(短袖), shorts(短褲), tw(軀幹寬倍率), arms:[{p:[肩,肘,手], front}], legs:[{p:[髖,膝,腳], back}], helmet, glasses, cap */
function fig(s, o) {
  const k = s.uid('f'); const sk = SKINS[o.skin || 'light']; const r = o.r;
  const top = o.top || '#5f7fa6', bot = o.bottom || '#33394a', hair = o.hair || '#2a1b14', shoe = o.shoe || '#2a2a2e';
  const dir = o.dir || 0; const [hx, hy] = o.head;
  s.def(rad(k + 'sk', 0.42, 0.38, 0.8, [[0, sk[0]], [0.65, sk[1]], [1, sk[2]]]));
  s.def(lin(k + 'tp', 0, 0, 1, 1, [[0, shade(top, 0.15)], [0.55, top], [1, shade(top, -0.28)]]));
  s.def(lin(k + 'hr', 0, 0, 1, 1, [[0, shade(hair, 0.25)], [0.5, hair], [1, shade(hair, -0.4)]]));
  const a = [];
  if (o.shadow) a.push(shadow(o.shadow[0], o.shadow[1], o.shadow[2], o.shadow[3] || 10, 0.4));
  const armDraw = (A) => {
    const [sh, el, ha] = A.p; const full = !o.short;
    return stroke([sh, el], r * 0.74, full ? top : shade(top, A.front ? 0 : -0.15)) + stroke([el, ha], r * 0.62, full ? shade(top, A.front ? 0 : -0.15) : sk[1]) +
      `<ellipse cx="${ha[0].toFixed(1)}" cy="${ha[1].toFixed(1)}" rx="${(r * 0.36).toFixed(1)}" ry="${(r * 0.4).toFixed(1)}" fill="url(#${k}sk)"/>`;
  };
  const legDraw = (L) => {
    const [h, kn, f] = L.p; const bare = o.shorts || o.skirt;
    let g = stroke([h, kn], r * 1.18, L.back ? shade(bot, -0.2) : bot) + stroke([kn, f], r * 0.88, L.back ? shade(bot, -0.2) : (bare ? sk[1] : bot));
    if (o.shorts) g += stroke([kn, [kn[0] + (f[0] - kn[0]) * 0.12, kn[1] + (f[1] - kn[1]) * 0.12]], r * 0.9, sk[1]);
    const fx = f[0] + dir * r * 0.45, fy = f[1] + r * 0.22;
    g += `<ellipse cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" rx="${(r * (dir ? 0.95 : 0.7)).toFixed(1)}" ry="${(r * 0.38).toFixed(1)}" fill="${L.back ? shade(shoe, -0.2) : shoe}"/>`;
    return g;
  };
  (o.arms || []).filter((x) => !x.front).forEach((x) => a.push(armDraw(x)));
  (o.legs || []).filter((x) => x.back).forEach((x) => a.push(legDraw(x)));
  (o.legs || []).filter((x) => !x.back).forEach((x) => a.push(legDraw(x)));
  // 軀幹
  const [nx, ny] = o.neck, [px, py] = o.hip; const tw = r * (o.tw || 3.2);
  { const dx = px - nx, dy = py - ny, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, vx = -uy, vy = ux;
    const q = (cx2, cy2, w, d) => [cx2 + ux * d + vx * w, cy2 + uy * d + vy * w];
    const sT = r * 0.2, bW = tw * 0.5, hW = tw * 0.42;
    const A = q(nx, ny, -bW, sT), B = q(nx, ny, bW, sT), C = q(px, py, hW, 0), D = q(px, py, -hW, 0);
    const A2 = q(nx, ny, -bW * 0.55, -r * 0.1), B2 = q(nx, ny, bW * 0.55, -r * 0.1);
    const E = q(px, py, hW * 0.98, r * 0.75), F = q(px, py, -hW * 0.98, r * 0.75);
    const f = (p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1);
    a.push(`<path d="M${f(A)}Q${f(A2)} ${f(q(nx, ny, 0, -r * 0.15))}Q${f(B2)} ${f(B)}L${f(C)}L${f(D)}Z" fill="${top}" stroke="${top}" stroke-width="${r * 0.35}" stroke-linejoin="round"/>`);
    a.push(`<path d="M${f(q(nx, ny, bW * 0.1, sT))}L${f(q(px, py, hW * 0.2, 0))}L${f(q(px, py, hW, 0))}L${f(B)}Z" fill="#000" opacity="0.1"/>`);
    a.push(`<path d="M${f(D)}L${f(C)}L${f(E)}L${f(F)}Z" fill="${bot}" stroke="${bot}" stroke-width="${r * 0.3}" stroke-linejoin="round"/>`);
  }
  // 脖子
  a.push(stroke([[nx, ny - r * 0.2], [nx, ny + r * 0.4]], r * 0.55, sk[2]));
  (o.arms || []).filter((x) => x.front).forEach((x) => a.push(armDraw(x)));
  // 頭
  const rx = r * 0.86, ry = r;
  if (o.hairStyle === 'long') a.push(`<path d="M${hx - rx * 1.05} ${hy - r * 0.1}C${hx - rx * 1.3} ${hy + r * 1.8} ${hx - rx * 0.8} ${hy + r * 2.2} ${hx - rx * 0.4} ${hy + r * 2.1}L${hx + rx * 0.4} ${hy + r * 2.1}C${hx + rx * 0.8} ${hy + r * 2.2} ${hx + rx * 1.3} ${hy + r * 1.8} ${hx + rx * 1.05} ${hy - r * 0.1}Z" fill="url(#${k}hr)" transform="translate(${dir * -r * 0.35} 0)"/>`);
  if (o.hairStyle === 'ponytail') a.push(`<path d="M${hx - dir * rx * 0.7 - (dir === 0 ? -rx : 0)} ${hy - r * 0.5}C${hx - dir * rx * 2.3 - (dir === 0 ? -rx * 1.5 : 0)} ${hy - r * 0.2} ${hx - dir * rx * 2.2 - (dir === 0 ? -rx * 1.4 : 0)} ${hy + r * 1.8} ${hx - dir * rx * 1.5 - (dir === 0 ? -rx * 1.1 : 0)} ${hy + r * 2.2}C${hx - dir * rx * 1.5 - (dir === 0 ? -rx * 1.1 : 0)} ${hy + r * 1} ${hx - dir * rx * 1.2 - (dir === 0 ? -rx : 0)} ${hy + r * 0.2} ${hx - dir * rx * 0.5} ${hy}Z" fill="url(#${k}hr)"/>`);
  if (o.hairStyle === 'bun') a.push(`<circle cx="${hx - dir * r * 0.3}" cy="${hy - r * 1.05}" r="${r * 0.42}" fill="url(#${k}hr)"/>`);
  a.push(`<ellipse cx="${hx}" cy="${hy}" rx="${rx}" ry="${ry}" fill="url(#${k}sk)"/>`);
  a.push(`<ellipse cx="${hx - rx * 0.95}" cy="${hy + r * 0.05}" rx="${r * 0.14}" ry="${r * 0.24}" fill="${sk[1]}"/>`);
  // 臉
  const ex = rx * 0.4, ey = hy + r * 0.08, fx = dir * r * 0.32;
  if (!(o.dir === 2)) {
    const er = Math.max(1.2, r * 0.07);
    if (dir === 0) a.push(`<ellipse cx="${hx - ex}" cy="${ey}" rx="${er * 1.3}" ry="${er}" fill="#2b1d17"/><ellipse cx="${hx + ex}" cy="${ey}" rx="${er * 1.3}" ry="${er}" fill="#2b1d17"/>`);
    else a.push(`<ellipse cx="${hx + fx + dir * ex * 0.3}" cy="${ey}" rx="${er * 1.1}" ry="${er}" fill="#2b1d17"/><ellipse cx="${hx + fx + dir * ex * 1.45}" cy="${ey}" rx="${er * 0.9}" ry="${er}" fill="#2b1d17"/>`);
    a.push(`<path d="M${hx + fx - r * 0.1} ${ey + r * 0.42}Q${hx + fx + dir * r * 0.05} ${ey + r * 0.55} ${hx + fx + r * 0.15} ${ey + r * 0.42}" stroke="#9a4d44" stroke-width="${Math.max(1, r * 0.07)}" stroke-linecap="round" fill="none"/>`);
    if (dir) a.push(`<path d="M${hx + dir * rx * 0.92} ${ey + r * 0.05}l${dir * r * 0.1} ${r * 0.25}l${-dir * r * 0.12} ${r * 0.02}" stroke="${sk[2]}" stroke-width="${Math.max(1, r * 0.06)}" fill="none"/>`);
    a.push(`<ellipse cx="${hx + fx - r * 0.3}" cy="${ey + r * 0.32}" rx="${r * 0.18}" ry="${r * 0.1}" fill="#e58b80" opacity="0.28"/><ellipse cx="${hx + fx + r * 0.3}" cy="${ey + r * 0.32}" rx="${r * 0.18}" ry="${r * 0.1}" fill="#e58b80" opacity="0.28"/>`);
  }
  // 前髮
  const hs = o.hairStyle || 'short';
  if (hs !== 'none' && !o.helmet) {
    const f2 = dir * r * 0.15;
    if (!dir) a.push(`<path d="M${hx - rx * 1.04} ${hy + r * 0.2}C${hx - rx * 1.25} ${hy - r * 1.2} ${hx + rx * 1.25} ${hy - r * 1.2} ${hx + rx * 1.04} ${hy + r * 0.2}C${hx + rx * 0.9} ${hy - r * 0.35} ${hx + f2} ${hy - r * 0.62} ${hx - rx * 0.1 + f2} ${hy - r * 0.5}C${hx - rx * 0.6} ${hy - r * 0.45} ${hx - rx * 0.9} ${hy - r * 0.2} ${hx - rx * 1.04} ${hy + r * 0.2}Z" fill="${hs === 'gray' ? '#cfcfcf' : `url(#${k}hr)`}"/>`);
    if (dir) a.push(`<path d="M${hx - dir * rx * 0.98} ${hy + r * 0.45}C${hx - dir * rx * 1.4} ${hy - r * 0.4} ${hx - dir * rx * 0.8} ${hy - r * 1.3} ${hx} ${hy - r * 1.04}C${hx + dir * rx * 0.7} ${hy - r * 1.05} ${hx + dir * rx * 1.05} ${hy - r * 0.8} ${hx + dir * rx * 0.95} ${hy - r * 0.3}C${hx + dir * rx * 0.55} ${hy - r * 0.62} ${hx - dir * rx * 0.1} ${hy - r * 0.6} ${hx - dir * rx * 0.45} ${hy - r * 0.1}C${hx - dir * rx * 0.5} ${hy + r * 0.1} ${hx - dir * rx * 0.55} ${hy + r * 0.3} ${hx - dir * rx * 0.62} ${hy + r * 0.4}Z" fill="${hs === 'gray' ? '#cfcfcf' : `url(#${k}hr)`}"/>`);
  }
  if (o.glasses) a.push(`<g fill="none" stroke="#2b2b2b" stroke-width="${Math.max(1, r * 0.06)}"><circle cx="${hx - ex + fx * 0.6}" cy="${ey}" r="${r * 0.26}"/><circle cx="${hx + ex + fx * 0.6}" cy="${ey}" r="${r * 0.26}"/><path d="M${hx - ex + fx * 0.6 + r * 0.26} ${ey}H${hx + ex + fx * 0.6 - r * 0.26}"/></g>`);
  if (o.helmet) {
    const hc = o.helmet;
    s.def(rad(k + 'hm', 0.35, 0.25, 0.9, [[0, shade(hc, 0.35)], [0.6, hc], [1, shade(hc, -0.35)]]));
    a.push(`<path d="M${hx - rx * 1.2} ${hy + r * 0.35}C${hx - rx * 1.35} ${hy - r * 1.6} ${hx + rx * 1.35} ${hy - r * 1.6} ${hx + rx * 1.2} ${hy + r * 0.35}L${hx + rx * 1.1} ${hy + r * 0.62}L${hx - rx * 1.1} ${hy + r * 0.62}Z" fill="url(#${k}hm)"/>`);
    a.push(`<path d="M${hx - rx * 1.1} ${hy + r * 0.5}H${hx + rx * 1.2}" stroke="${shade(hc, -0.4)}" stroke-width="${r * 0.12}"/>`);
    a.push(`<path d="M${hx - rx * 0.9} ${hy - r * 0.8}Q${hx} ${hy - r * 1.3} ${hx + rx * 0.8} ${hy - r * 0.85}" stroke="#fff" stroke-width="${r * 0.12}" fill="none" opacity="0.4" stroke-linecap="round"/>`);
    if (dir) a.push(`<path d="M${hx + dir * rx * 0.5} ${hy + r * 0.55}Q${hx + dir * rx * 0.2} ${hy + r * 1.1} ${hx - dir * rx * 0.2} ${hy + r * 0.95}" stroke="#222" stroke-width="${r * 0.08}" fill="none"/>`);
  }
  return a.join('\n');
}

const wall = (s, id, c1, c2) => s.def(lin(id, 0, 0, 0, 1, [[0, c1], [1, c2]]));

/* I1 騎機車 */
out.scooter = () => {
  const s = Scene(); const R = rng(91);
  wall(s, 'sky', '#a8d3ea', '#f3ead4'); wall(s, 'road', '#6e7276', '#474b4f'); wall(s, 'walk', '#d3c9b4', '#aa9f88');
  s.def(lin('body', 0, 0, 1, 1, [[0, '#ff8a6a'], [0.5, '#e2503f'], [1, '#a92e24']]));
  s.def(lin('pole', 0, 0, 1, 0, [[0, '#59605f'], [0.5, '#9aa3a2'], [1, '#444b4a']]));
  s.def(rad('tyre', 0.5, 0.5, 0.5, [[0, '#555'], [0.55, '#222'], [1, '#111']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><g filter="url(#b8)" opacity="0.8"><ellipse cx="150" cy="70" rx="110" ry="22" fill="#fff"/><ellipse cx="620" cy="50" rx="120" ry="20" fill="#fff"/></g>');
  // 遠景大樓
  const bl = [[0, 110, 130, '#d9c9a8'], [125, 60, 140, '#b9c4c9'], [262, 130, 120, '#e2d3b4'], [385, 80, 150, '#c8b79a'], [535, 120, 130, '#b8c6cc'], [665, 90, 140, '#dccbaa']];
  bl.forEach(([x, y, w, c]) => {
    s.add(`<rect x="${x}" y="${y}" width="${w}" height="${360 - y}" fill="${c}"/><rect x="${x}" y="${y}" width="${w}" height="9" fill="#000" opacity="0.1"/>`);
    for (let r = 0; r < 6; r++) for (let q = 0; q < Math.floor(w / 36); q++) { const wx = x + 10 + q * 36, wy = y + 20 + r * 42; if (wy > 300) continue; s.add(`<rect x="${wx}" y="${wy}" width="24" height="26" fill="#6f8fa6" opacity="0.8"/><path d="M${wx} ${wy + 13}H${wx + 24}" stroke="#4a5358" stroke-width="2"/><rect x="${wx - 3}" y="${wy + 26}" width="30" height="4" fill="#666"/>`); }
  });
  s.add('<rect x="150" y="236" width="90" height="26" fill="#d6372b"/>' + txt(195, 256, 17, '早 餐 店', '#fff6dc') + '<rect x="680" y="250" width="84" height="24" fill="#2f6d4f"/>' + txt(722, 268, 16, '藥 局', '#fff') + '<rect x="268" y="238" width="62" height="22" fill="#e8b84a"/>' + txt(299, 255, 15, '便 當', '#5a3a10'));
  s.add('<g filter="url(#b2)"><ellipse cx="40" cy="352" rx="80" ry="36" fill="#4f7f46"/><ellipse cx="770" cy="352" rx="80" ry="34" fill="#4f7f46"/></g>');
  // 騎樓（右後）+ 人行道
  s.add('<rect y="352" width="800" height="40" fill="url(#walk)"/><rect y="388" width="800" height="6" fill="#e6dec9"/>');
  // 道路
  s.add('<rect y="394" width="800" height="206" fill="url(#road)"/>');
  s.add('<path d="M0 450H800" stroke="#f2d04a" stroke-width="4" stroke-dasharray="70 44" opacity="0.9"/>');
  s.add('<path d="M0 575H800" stroke="#f4f4ee" stroke-width="5" opacity="0.8"/>');
  // 紅綠燈（左）
  s.add('<rect x="60" y="130" width="12" height="268" fill="url(#pole)"/>' + shadow(66, 398, 24, 5, 0.4));
  s.add('<rect x="40" y="96" width="52" height="116" rx="9" fill="#1f2326"/><circle cx="66" cy="124" r="12" fill="#ff4a3f" opacity="0.35"/><circle cx="66" cy="154" r="12" fill="#6b5a1c"/><circle cx="66" cy="184" r="12" fill="#43e07a"/><circle cx="66" cy="184" r="22" fill="#43e07a" opacity="0.25" filter="url(#b4)"/>');
  // 遠方機車與汽車
  const mini = (x, y, c) => s.add(`<g transform="translate(${x} ${y}) scale(-0.42 0.42)">${shadow(0, 56, 70, 9, 0.35)}<circle cx="-62" cy="30" r="24" fill="#222"/><circle cx="62" cy="30" r="24" fill="#222"/><path d="M-80 28Q-70 -26 -20 -24L40 -6L56 -50L74 -52L70 20Z" fill="${c}"/><circle cx="62" cy="-60" r="16" fill="#e8c34a"/><rect x="-30" y="-100" width="36" height="76" rx="14" fill="#556"/><circle cx="-12" cy="-118" r="18" fill="#e8c34a"/></g>`);
  mini(108, 432, '#4f86c2');
  s.add('<g transform="translate(40 -4)"><rect x="610" y="392" width="150" height="50" rx="14" fill="#dfe3e4"/><path d="M630 392Q650 360 690 358L730 360Q752 372 752 392Z" fill="#cfd6d9"/><path d="M644 392Q658 368 690 366L722 368Q738 376 740 392Z" fill="#7fa6bd"/><circle cx="650" cy="444" r="16" fill="#222"/><circle cx="728" cy="444" r="16" fill="#222"/></g>');
  // 主角：機車（朝右）
  const cx = 400, gy = 548, K = 2.15;
  s.add(shadow(cx + 6, gy + 6, 250, 18, 0.5));
  s.add(`<g transform="translate(${cx} ${gy}) scale(${K})">
    <circle cx="-70" cy="-31" r="31" fill="url(#tyre)"/><circle cx="-70" cy="-31" r="17" fill="#c8ccd0"/><circle cx="-70" cy="-31" r="6" fill="#666"/>
    <circle cx="80" cy="-31" r="31" fill="url(#tyre)"/><circle cx="80" cy="-31" r="17" fill="#c8ccd0"/><circle cx="80" cy="-31" r="6" fill="#666"/>
    <path d="M80 -100L80 -34" stroke="#8a8f94" stroke-width="7" stroke-linecap="round"/>
    <path d="M44 -31A36 36 0 0 1 116 -31L108 -31A28 28 0 0 0 52 -31Z" fill="#c9402f"/>
    <path d="M-112 -48Q-122 -86 -98 -96L-8 -96Q4 -72 6 -42Q-24 -36 -42 -54Q-70 -66 -96 -50Z" fill="url(#body)"/>
    <path d="M-104 -62Q-70 -80 -20 -78" stroke="#fff" stroke-width="3" opacity="0.4" fill="none"/>
    <path d="M-102 -96Q-98 -108 -80 -108L-12 -108Q-6 -104 -6 -96Z" fill="#2b2b30"/>
    <rect x="2" y="-30" width="62" height="9" rx="4" fill="#3a3a40"/>
    <path d="M58 -26Q60 -66 66 -104L86 -110Q98 -80 100 -50L98 -30Z" fill="url(#body)"/>
    <path d="M70 -100Q72 -70 70 -40" stroke="#fff" stroke-width="3" opacity="0.35" fill="none"/>
    <path d="M92 -100Q110 -98 110 -84Q106 -74 92 -80Z" fill="#fff6c8" stroke="#c9a94a" stroke-width="1.5"/>
    <path d="M62 -116L88 -120" stroke="#2b2b2b" stroke-width="7" stroke-linecap="round"/>
    <path d="M84 -120L90 -146" stroke="#2b2b2b" stroke-width="2.5"/><rect x="78" y="-164" width="24" height="18" rx="7" fill="#d0d6da" stroke="#555" stroke-width="2"/><rect x="82" y="-160" width="16" height="10" rx="4" fill="#8fb6cc"/>
    <rect x="-116" y="-72" width="8" height="14" rx="3" fill="#ff3b30"/>
    </g>`);
  const T = (x, y) => [cx + x * K, gy + y * K];
  // 背包（在騎士後面）
  s.add(`<rect x="${T(-30, -168)[0]}" y="${T(-30, -168)[1]}" width="58" height="92" rx="16" fill="#3a6a52" transform="rotate(8 ${T(-30, -168)[0]} ${T(-30, -168)[1]})"/>`);
  s.add(fig(s, {
    r: 33, head: T(12, -186), neck: T(0, -160), hip: T(-26, -100), dir: 1, skin: 'mid', hair: '#222', top: '#eeeee4', bottom: '#3c4a64', shoe: '#2a2a2e', helmet: '#2f6dba', tw: 2.7,
    arms: [{ p: [T(2, -152), T(34, -124), T(64, -118)], front: true }],
    legs: [{ p: [T(-24, -100), T(28, -100), T(32, -34)] }]
  }));
  s.add(`<path d="M${T(62, -116)[0]} ${T(62, -116)[1]}l10 -4" stroke="#222" stroke-width="9" stroke-linecap="round"/>`);
  // 前景護欄與花
  s.add('<rect y="560" width="800" height="40" fill="url(#walk)" opacity="0"/>');
  return s.out();
};


/* I2 瑜伽 */
out.yoga = () => {
  const s = Scene(); const R = rng(92);
  wall(s, 'wall', '#f4ecdc', '#e6d8bd'); wall(s, 'floor', '#d2a971', '#b0834e'); wall(s, 'sky', '#bfe0f0', '#f6efd9');
  s.def(lin('mat', 0, 0, 1, 1, [[0, '#7fb88a'], [1, '#4f8f62']]));
  s.def(rad('sun', 0.5, 0.5, 0.5, [[0, '#fff6d0', 0.9], [1, '#fff6d0', 0]]));
  s.def(rad('leaf', 0.35, 0.3, 0.9, [[0, '#8cc25a'], [0.6, '#4f8f35'], [1, '#2e6224']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  // 大窗（窗外：樹與山）
  s.add('<rect x="130" y="40" width="540" height="300" fill="url(#sky)"/>');
  s.add('<path d="M130 300Q220 200 320 270Q420 170 520 260Q600 210 670 280V340H130Z" fill="#9dbfa0" opacity="0.8"/><path d="M130 330Q250 270 380 310Q520 260 670 320V340H130Z" fill="#7da582"/>');
  s.add('<circle cx="560" cy="110" r="150" fill="url(#sun)"/>');
  s.add('<g stroke="#fff" stroke-width="10"><path d="M400 40V340M130 190H670"/></g><rect x="130" y="40" width="540" height="300" fill="none" stroke="#a9805a" stroke-width="12"/><rect x="118" y="336" width="564" height="14" fill="#c9a074"/>');
  // 窗簾
  s.add('<path d="M60 20Q110 200 90 400H30V20Z" fill="#f8f2e4"/><path d="M740 20Q690 200 710 400H770V20Z" fill="#f8f2e4"/><path d="M60 20Q95 200 80 400M740 20Q705 200 720 400" stroke="#d8c9a8" stroke-width="3" fill="none"/>');
  // 左側盆栽、右側架子
  s.add('<g transform="translate(40 330)"><path d="M0 40L10 120H70L80 40Z" fill="#c7794a"/><ellipse cx="40" cy="40" rx="40" ry="8" fill="#a85a30"/>' + [[-20, -40, -25], [10, -80, 0], [40, -40, 25], [30, -90, 40]].map(([dx, dy, rot]) => `<path d="M40 40Q${40 + dx} ${dy} ${40 + dx * 1.4} ${dy - 20}Q${50 + dx} ${dy + 20} 44 40Z" fill="url(#leaf)" transform="rotate(${rot} 40 40)"/>`).join('') + '</g>');
  s.add('<rect x="690" y="270" width="100" height="10" fill="#a9805a"/><rect x="700" y="280" width="6" height="40" fill="#8a6440"/><rect x="778" y="280" width="6" height="40" fill="#8a6440"/>');
  s.add('<g transform="translate(710 214)"><rect x="0" y="0" width="38" height="56" rx="8" fill="#f2e6cf"/><rect x="12" y="-10" width="14" height="12" fill="#d9a53c"/><path d="M6 10H32M6 20H32" stroke="#c9b08a" stroke-width="2"/></g><g transform="translate(750 226)"><rect x="0" y="0" width="30" height="44" rx="6" fill="#e4a99a"/><rect x="8" y="-8" width="14" height="10" fill="#8a6440"/></g>');
  // 地板
  s.add('<rect y="390" width="800" height="210" fill="url(#floor)"/><rect y="384" width="800" height="12" fill="#f4e9d2"/>');
  s.add('<g stroke="#8a5f30" stroke-width="2" opacity="0.28">' + Array.from({ length: 8 }, (_, i) => `<path d="M0 ${410 + i * 28}H800"/>`).join('') + '</g>');
  // 瑜伽墊（透視）
  s.add(shadow(400, 560, 250, 16, 0.4));
  s.add('<path d="M250 440H550L640 560H160Z" fill="url(#mat)"/><path d="M250 440H550L556 452H244Z" fill="#fff" opacity="0.2"/><path d="M160 560H640" stroke="#2e6a44" stroke-width="6"/>');
  // 人：樹式（正面）
  const cx = 400, fy = 548;
  s.add(fig(s, {
    r: 30, head: [cx, 150], neck: [cx, 188], hip: [cx, 330], dir: 0, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#e4709a', bottom: '#2f3a54', shoe: '#e8e8e8', tw: 2.1, short: true, shadow: [cx, fy + 6, 90, 10],
    arms: [{ p: [[cx - 30, 205], [cx - 60, 140], [cx - 6, 82]] }, { p: [[cx + 30, 205], [cx + 60, 140], [cx + 6, 82]], front: true }],
    legs: [{ p: [[cx - 16, 335], [cx - 100, 395], [cx - 8, 440]], back: false }, { p: [[cx + 16, 335], [cx + 16, 445], [cx + 16, fy - 6]] }]
  }));
  s.add(`<ellipse cx="${cx}" cy="82" rx="14" ry="8" fill="#f0c8a8" opacity="0.0"/>`);
  // 前景：水壺、毛巾
  s.add('<g transform="translate(660 540)"><rect x="0" y="-10" width="34" height="62" rx="9" fill="#4f9ac2"/><rect x="6" y="-20" width="22" height="14" rx="4" fill="#2f5a78"/><rect x="0" y="16" width="34" height="14" fill="#fff" opacity="0.3"/></g>' + shadow(678, 596, 28, 6, 0.4));
  s.add('<path d="M120 566Q150 540 210 556L222 580Q160 592 112 584Z" fill="#fff3d6"/><path d="M130 570Q160 556 206 566M126 578Q160 568 212 574" stroke="#e0b46a" stroke-width="3" fill="none"/>' + shadow(166, 592, 54, 6, 0.3));
  return s.out();
};


/* I3 拍照 */
out.photo = () => {
  const s = Scene(); const R = rng(93);
  wall(s, 'sky', '#79b6e0', '#fbe3b8'); wall(s, 'stone', '#cfc5b2', '#a79c86');
  s.def(rad('sun', 0.5, 0.5, 0.5, [[0, '#fff4c8', 1], [0.4, '#ffe6a0', 0.5], [1, '#ffd890', 0]]));
  s.def(lin('far', 0, 0, 0, 1, [[0, '#b7c9d6'], [1, '#d9dfe0']]));
  s.def(lin('mid', 0, 0, 0, 1, [[0, '#7fa38f'], [1, '#9db8a0']]));
  s.def(lin('near', 0, 0, 0, 1, [[0, '#4f7f56'], [1, '#6a9a58']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  s.add('<circle cx="470" cy="250" r="190" fill="url(#sun)"/><circle cx="470" cy="250" r="34" fill="#fffbe6"/>');
  s.add('<g filter="url(#b8)" opacity="0.8"><ellipse cx="160" cy="110" rx="120" ry="22" fill="#fff"/><ellipse cx="640" cy="150" rx="130" ry="20" fill="#fff4e0"/></g>');
  // 遠山、近山
  s.add('<path d="M0 300Q100 230 200 290Q300 200 400 280Q520 190 640 270Q720 230 800 280V420H0Z" fill="url(#far)"/>');
  s.add('<path d="M0 340Q120 280 260 340Q400 260 560 340Q680 290 800 330V440H0Z" fill="url(#mid)"/>');
  // 山下城市
  for (let i = 0; i < 26; i++) { const x = 30 + i * 28 + R() * 10, h = 14 + R() * 40, w = 14 + R() * 12; s.add(`<rect x="${x.toFixed(0)}" y="${(400 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${['#e5dccb', '#cfd8dc', '#e8d3b0'][i % 3]}" opacity="0.9"/>`); }
  s.add('<rect x="560" y="288" width="12" height="112" fill="#d8dee0"/><rect x="556" y="300" width="20" height="8" fill="#bcc6ca"/><rect x="559" y="324" width="14" height="6" fill="#bcc6ca"/><rect x="558" y="350" width="16" height="6" fill="#bcc6ca"/><path d="M566 270V288" stroke="#bcc6ca" stroke-width="3"/>');
  s.add('<path d="M0 410Q200 380 400 400Q600 380 800 410V470H0Z" fill="url(#near)"/>');
  // 涼亭（左）
  s.add('<g transform="translate(40 330)"><rect x="12" y="40" width="8" height="70" fill="#8a3a2a"/><rect x="92" y="40" width="8" height="70" fill="#8a3a2a"/><path d="M-14 44Q56 -4 126 44L112 50Q56 14 0 50Z" fill="#c4452f"/><path d="M-14 44Q56 -4 126 44" stroke="#e8c34a" stroke-width="3" fill="none"/><rect x="8" y="104" width="96" height="8" fill="#a79c86"/></g>');
  // 觀景台地面與欄杆
  s.add('<rect y="458" width="800" height="142" fill="url(#stone)"/><g stroke="#8d8672" stroke-width="2" opacity="0.5"><path d="M0 520H800M0 570H800"/><path d="M120 458L60 600M300 458L270 600M500 458L520 600M700 458L760 600"/></g>');
  s.add('<rect y="446" width="800" height="14" fill="#7d8a90"/><rect y="400" width="800" height="8" fill="#a8b4ba"/>');
  for (let i = 0; i < 18; i++) s.add(`<rect x="${i * 46 + 10}" y="404" width="6" height="46" fill="#a8b4ba"/>`);
  // 朋友（中景，戴帽子比YA）
  const fx = 585, fy = 300;
  s.add(person(s, { x: fx, y: fy, h: 300, skin: 'tan', hair: '#2a1b14', hairStyle: 'long', top: '#f4d35e', bottom: '#4a6a9a', pose: 'wave', legs: 'stand', shoe: '#f2f2f2', sleeve: 'short' }));
  const s2 = 300 / 7;
  s.add(`<ellipse cx="${fx}" cy="${fy - 0.98 * s2}" rx="${0.95 * s2}" ry="${0.16 * s2}" fill="#e8c27a"/><path d="M${fx - 0.5 * s2} ${fy - 1 * s2}Q${fx} ${fy - 1.75 * s2} ${fx + 0.5 * s2} ${fy - 1 * s2}Z" fill="#f0d08c"/><path d="M${fx - 0.5 * s2} ${fy - 1.05 * s2}H${fx + 0.5 * s2}" stroke="#c9423a" stroke-width="${0.1 * s2}"/>`);
  const hx = fx + 1.2 * s2, hy = fy - 1.4 * s2;
  s.add(`<path d="M${hx - 3} ${hy - 4}L${hx - 9} ${hy - 22}M${hx + 3} ${hy - 4}L${hx + 9} ${hy - 21}" stroke="#c9946a" stroke-width="6" stroke-linecap="round"/>`);
  // 攝影者（前景，側面）
  s.add(fig(s, {
    r: 38, head: [190, 210], neck: [182, 256], hip: [160, 420], dir: 1, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#5aa88f', bottom: '#3c4a64', shoe: '#e8e8e8', tw: 2.9, shadow: [165, 585, 100, 12],
    arms: [{ p: [[184, 272], [236, 330], [276, 238]], front: true }],
    legs: [{ p: [[150, 420], [128, 500], [104, 576]], back: true }, { p: [[166, 420], [186, 500], [190, 578]] }]
  }));
  // 背包
  s.add('<rect x="108" y="262" width="56" height="112" rx="20" fill="#d9574a" transform="rotate(-5 108 262)"/><rect x="118" y="300" width="30" height="34" rx="8" fill="#b0392e"/>');
  // 相機
  s.add('<g transform="translate(262 204)"><rect x="0" y="0" width="52" height="38" rx="7" fill="#2b2f33"/><rect x="6" y="-8" width="20" height="10" rx="3" fill="#2b2f33"/><rect x="44" y="6" width="22" height="26" rx="4" fill="#3a3f44"/><ellipse cx="66" cy="19" rx="5" ry="13" fill="#9ec7e6"/><rect x="6" y="6" width="12" height="8" fill="#c9423a" opacity="0.8"/></g>');
  s.add('<path d="M278 236L272 244" stroke="#ecc7a8" stroke-width="10" stroke-linecap="round"/>');
  // 前景花叢
  s.add('<g filter="url(#b2)"><ellipse cx="740" cy="590" rx="120" ry="50" fill="#4f7f46"/></g>');
  [[690, 556], [730, 540], [770, 560], [710, 580], [760, 584]].forEach(([x, y], i) => s.add(`<circle cx="${x}" cy="${y}" r="9" fill="${['#ff8aa8', '#ffd25a', '#fff'][i % 3]}"/><circle cx="${x}" cy="${y}" r="3" fill="#c9423a"/>`));
  return s.out();
};

/* I4 洗碗 */
out.dishes = () => {
  const s = Scene(); const R = rng(94);
  wall(s, 'wall', '#f3ead6', '#e9dcc0'); wall(s, 'cnt', '#e9ddc6', '#c9b896'); wall(s, 'sky', '#bfe0f0', '#f4efd8');
  s.def(lin('steel', 0, 0, 1, 1, [[0, '#eef2f4'], [0.5, '#aab4ba'], [1, '#d3dadd']]));
  s.def(lin('wd', 0, 0, 0, 1, [[0, '#b98556'], [1, '#8a5c36']]));
  s.def(rad('lt', 0.5, 0, 0.9, [[0, '#fff4d0', 0.6], [1, '#fff4d0', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  // 磁磚牆
  s.add('<g stroke="#d6c8a8" stroke-width="2">' + Array.from({ length: 12 }, (_, i) => `<path d="M0 ${170 + i * 30}H800"/>`).join('') + Array.from({ length: 26 }, (_, i) => `<path d="M${i * 32} 170V420"/>`).join('') + '</g>');
  s.add('<rect y="170" width="800" height="250" fill="#fff" opacity="0.25"/>');
  // 窗
  s.add('<rect x="300" y="40" width="200" height="150" fill="url(#sky)"/><path d="M400 40V190M300 115H500" stroke="#fff" stroke-width="6"/><rect x="300" y="40" width="200" height="150" fill="none" stroke="#a9805a" stroke-width="9"/><rect x="292" y="188" width="216" height="10" fill="#c9a074"/>');
  s.add('<g transform="translate(330 150)"><path d="M0 40L6 38H40L44 40V0H0Z" fill="#c7794a" transform="translate(0 -6)"/><path d="M22 -6Q10 -30 4 -40Q22 -34 24 -6Q34 -34 48 -40Q36 -20 26 -6Z" fill="#4f8f35"/></g>');
  // 左壁掛：鍋鏟與湯勺
  s.add('<path d="M40 60H210" stroke="#7a5a3a" stroke-width="6"/>');
  [[70, 'spoon'], [110, 'spat'], [150, 'ladle']].forEach(([x, k]) => s.add(`<path d="M${x} 62V140" stroke="#8a6a46" stroke-width="5"/>` + (k === 'ladle' ? `<ellipse cx="${x}" cy="150" rx="14" ry="12" fill="#c0c8cc"/>` : k === 'spat' ? `<rect x="${x - 10}" y="136" width="20" height="34" rx="3" fill="#c0c8cc"/>` : `<ellipse cx="${x}" cy="150" rx="11" ry="16" fill="#8a6a46"/>`)));
  // 右側：層架上的碗盤
  s.add('<rect x="590" y="80" width="190" height="10" fill="url(#wd)"/><rect x="590" y="200" width="190" height="10" fill="url(#wd)"/>');
  for (let i = 0; i < 4; i++) s.add(`<g transform="translate(${606 + i * 44} 52)"><path d="M0 0H36Q34 28 18 28Q2 28 0 0Z" fill="${['#f4efe2', '#6fa5c9', '#f4efe2', '#e8b84a'][i]}"/><path d="M0 0H36" stroke="#999" stroke-width="2"/></g>`);
  for (let i = 0; i < 5; i++) s.add(`<ellipse cx="${640 + i * 6}" cy="${196 - i * 6}" rx="40" ry="7" fill="${i % 2 ? '#f4efe2' : '#cfe3ee'}" stroke="#aaa" stroke-width="1"/>`);
  s.add('<g transform="translate(740 158)"><rect x="0" y="0" width="30" height="42" rx="6" fill="#d9574a"/><rect x="4" y="12" width="22" height="14" fill="#fff" opacity="0.7"/></g>');
  // 後面的小孩（擦盤子）
  s.add(person(s, { x: 565, y: 330, h: 300, skin: 'mid', hair: '#222', hairStyle: 'short', top: '#e8a05a', bottom: '#3a3f4a', pose: 'hold', legs: 'none', sleeve: 'short' }));
  s.add('<g transform="translate(533 354)"><ellipse cx="32" cy="0" rx="44" ry="10" fill="#f4efe2" stroke="#bbb" stroke-width="2"/><ellipse cx="32" cy="-2" rx="30" ry="5" fill="#ddd"/></g><path d="M525 346Q555 364 595 346L605 388Q565 400 519 386Z" fill="#fff" opacity="0.92"/><path d="M533 360H591M531 372H597" stroke="#6fa5c9" stroke-width="3" opacity="0.8"/>');
  // 洗碗的媽媽
  s.add(person(s, { x: 330, y: 250, h: 360, skin: 'light', hair: '#3a2418', hairStyle: 'ponytail', top: '#7fb69a', bottom: '#38486a', pose: 'hold', legs: 'none', sleeve: 'short' }));
  // 圍裙
  s.add('<path d="M290 296H370L376 400H284Z" fill="#fff3d6"/><path d="M290 296Q330 312 370 296" stroke="#e0b46a" stroke-width="3" fill="none"/><rect x="310" y="350" width="40" height="26" rx="4" fill="#f0dca8"/>');
  // 流理台（前）
  s.add(shadow(400, 590, 400, 14, 0.3));
  s.add('<rect x="0" y="390" width="800" height="210" fill="url(#cnt)"/><rect x="0" y="380" width="800" height="16" fill="#f4ead2"/><path d="M0 470H800M200 396V600M400 396V600M600 396V600" stroke="#a8946a" stroke-width="3" opacity="0.45"/>');
  [[100, 440], [300, 440], [500, 440], [700, 440]].forEach(([x, y]) => s.add(`<rect x="${x - 14}" y="${y}" width="28" height="6" rx="3" fill="#a8946a"/>`));
  // 水槽
  s.add('<path d="M190 384H470L458 420H202Z" fill="url(#steel)"/><path d="M200 388H460L452 414H208Z" fill="#8fa0a8"/><path d="M208 394Q330 382 452 394L448 410H212Z" fill="#cfe7f2" opacity="0.85"/>');
  // 泡泡
  [[230, 392, 14], [256, 388, 18], [290, 392, 15], [350, 388, 20], [392, 392, 14], [420, 390, 17], [270, 380, 9], [372, 378, 11], [310, 384, 8]].forEach(([x, y, r]) => s.add(`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="0.92"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.25}" fill="#fff"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#bfe0f0" stroke-width="1.5"/>`));
  // 手上的碗與海綿
  s.add('<g transform="translate(296 374)"><path d="M-30 -10H30Q28 24 0 24Q-28 24 -30 -10Z" fill="#6fa5c9"/><ellipse cx="0" cy="-10" rx="30" ry="7" fill="#e8f3f9"/><path d="M-30 -2H30" stroke="#fff" stroke-width="3" opacity="0.5"/></g>');
  s.add('<g><ellipse cx="282" cy="370" rx="9" ry="10" fill="#f6d4ba"/><ellipse cx="352" cy="370" rx="9" ry="10" fill="#f6d4ba"/><rect x="336" y="356" width="28" height="18" rx="5" fill="#f2d44a"/><rect x="336" y="356" width="28" height="6" rx="3" fill="#7fc67a"/></g>');
  s.add('<circle cx="354" cy="352" r="7" fill="#fff" opacity="0.9"/><circle cx="366" cy="346" r="5" fill="#fff" opacity="0.9"/>');
  // 水龍頭
  s.add('<path d="M440 384V330Q440 304 410 304H386" stroke="url(#steel)" stroke-width="12" fill="none" stroke-linecap="round"/><rect x="430" y="364" width="20" height="22" rx="4" fill="#aab4ba"/><path d="M386 308V376" stroke="#9fd4ea" stroke-width="4" opacity="0.8" stroke-dasharray="6 5"/>');
  // 瀝水架、洗碗精、海綿
  s.add('<g transform="translate(640 330)"><rect x="0" y="40" width="130" height="10" rx="3" fill="#aab4ba"/>' + Array.from({ length: 5 }, (_, i) => `<ellipse cx="${20 + i * 24}" cy="20" rx="8" ry="28" fill="#f4efe2" stroke="#bbb" stroke-width="1.5"/><path d="M${20 + i * 24} 40V50" stroke="#aab4ba" stroke-width="3"/>`).join('') + '</g>');
  s.add('<g transform="translate(172 346)"><rect x="0" y="10" width="30" height="46" rx="8" fill="#7fc67a"/><rect x="9" y="0" width="12" height="14" fill="#5a9a56"/><rect x="4" y="26" width="22" height="16" fill="#fff" opacity="0.7"/></g>');
  s.add('<g transform="translate(110 360)"><path d="M0 20L8 54H50L58 20Z" fill="#f4efe2"/><path d="M4 20L10 54" stroke="#ccc" stroke-width="2"/><ellipse cx="29" cy="20" rx="29" ry="7" fill="#e8e0cc"/><path d="M14 18Q20 -10 26 18M30 18Q34 -16 40 18" stroke="#8a6a46" stroke-width="5" fill="none"/></g>');
  return s.out();
};

/* I5 畫畫 */
out.drawing = () => {
  const s = Scene(); const R = rng(95);
  wall(s, 'wall', '#f6efe0', '#ebdfc4'); wall(s, 'floor', '#caa070', '#a8794a'); wall(s, 'sky', '#a9d4ec', '#f6efd9');
  s.def(lin('wd', 0, 0, 0, 1, [[0, '#b98556'], [1, '#8a5c36']]));
  s.def(rad('lt', 0.5, 0.2, 0.9, [[0, '#fff4d0', 0.7], [1, '#fff4d0', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><circle cx="200" cy="100" r="260" fill="url(#lt)"/>');
  // 窗
  s.add('<rect x="60" y="50" width="200" height="190" fill="url(#sky)"/><path d="M60 180Q120 140 180 175Q220 150 260 180V240H60Z" fill="#8fb88a"/><path d="M160 50V240M60 145H260" stroke="#fff" stroke-width="6"/><rect x="60" y="50" width="200" height="190" fill="none" stroke="#a9805a" stroke-width="9"/>');
  // 牆上的畫與層架
  s.add('<rect x="560" y="60" width="90" height="70" fill="#fff" stroke="#8a5c36" stroke-width="6"/><path d="M566 124L596 90L616 108L634 86L646 124Z" fill="#7da582"/><circle cx="622" cy="78" r="8" fill="#f2b84a"/>');
  s.add('<rect x="680" y="76" width="80" height="100" fill="#fff" stroke="#8a5c36" stroke-width="6"/><circle cx="720" cy="120" r="26" fill="#e8708a"/><circle cx="720" cy="120" r="10" fill="#f2d44a"/>');
  s.add('<rect x="320" y="150" width="190" height="10" fill="url(#wd)"/>');
  [['#d9574a', 336], ['#4f86c2', 358], ['#e8c34a', 380], ['#5aa86a', 402]].forEach(([c, x]) => s.add(`<rect x="${x}" y="112" width="18" height="38" rx="3" fill="${c}"/><rect x="${x + 5}" y="104" width="8" height="10" fill="#bbb"/>`));
  s.add('<g transform="translate(440 108)"><rect x="0" y="0" width="30" height="42" rx="4" fill="#e8e0cc" stroke="#aaa" stroke-width="1.5"/>' + [[6, '#d9574a'], [12, '#4f86c2'], [18, '#e8c34a'], [24, '#5aa86a']].map(([x, c]) => `<rect x="${x - 3}" y="-24" width="4" height="30" fill="${c}"/><path d="M${x - 3} -24L${x - 1} -32L${x + 1} -24Z" fill="#333"/>`).join('') + '</g>');
  // 地板
  s.add('<rect y="420" width="800" height="180" fill="url(#floor)"/><rect y="414" width="800" height="10" fill="#f4e9d2"/><g stroke="#8a5f30" stroke-width="2" opacity="0.28">' + Array.from({ length: 6 }, (_, i) => `<path d="M0 ${446 + i * 30}H800"/>`).join('') + '</g>');
  // 畫架 + 畫布（正面）
  const ex = 520;
  s.add(shadow(ex, 584, 150, 14, 0.4));
  s.add(`<path d="M${ex - 110} 586L${ex - 70} 150M${ex + 110} 586L${ex + 70} 150M${ex} 120L${ex + 20} 580" stroke="#a9763f" stroke-width="12" stroke-linecap="round"/><rect x="${ex - 96}" y="440" width="192" height="12" fill="#8a5c36"/>`);
  s.add(`<rect x="${ex - 120}" y="140" width="240" height="300" fill="#fffdf6" stroke="#8a5c36" stroke-width="6"/><rect x="${ex - 120}" y="140" width="240" height="300" fill="#000" opacity="0.04"/>`);
  // 畫布上的畫：山、太陽、房子、花
  s.add(`<g><rect x="${ex - 112}" y="148" width="224" height="170" fill="#bfe3f5"/><circle cx="${ex + 70}" cy="190" r="26" fill="#ffd25a"/><path d="M${ex - 112} 300L${ex - 50} 210L${ex - 10} 262L${ex + 36} 226L${ex + 112} 300V318H${ex - 112}Z" fill="#7da582"/><rect x="${ex - 112}" y="300" width="224" height="132" fill="#6fa85a"/><path d="M${ex - 112} 300Q${ex - 20} 330 ${ex + 112} 300V320H${ex - 112}Z" fill="#8cc25a"/><rect x="${ex - 60}" y="316" width="66" height="50" fill="#e8c27a"/><path d="M${ex - 68} 316L${ex - 27} 280L${ex + 14} 316Z" fill="#d9574a"/><rect x="${ex - 36}" y="336" width="18" height="30" fill="#8a5c36"/><path d="M${ex + 50} 380V340" stroke="#4f8f35" stroke-width="4"/><circle cx="${ex + 50}" cy="334" r="10" fill="#ff8aa8"/><path d="M${ex + 86} 390V356" stroke="#4f8f35" stroke-width="4"/><circle cx="${ex + 86}" cy="350" r="10" fill="#ffd25a"/></g>`);
  s.add(`<path d="M${ex + 40} 396Q${ex + 70} 380 ${ex + 100} 402" stroke="#4f86c2" stroke-width="5" fill="none" stroke-linecap="round"/>`);
  // 畫家（左，手持畫筆，另一手拿調色盤）
  const px = 270, py = 270, ph = 340, ps = ph / 7;
  s.add(person(s, { x: px, y: py, h: ph, skin: 'light', hair: '#3a2418', hairStyle: 'bun', top: '#f4e9d2', bottom: '#38486a', pose: 'wave', legs: 'stand', shoe: '#e8e8e8', sleeve: 'short', glasses: true }));
  // 圍裙
  s.add(`<path d="M${px - 0.8 * ps} ${py + 0.5 * ps}H${px + 0.8 * ps}L${px + 0.9 * ps} ${py + 3.3 * ps}H${px - 0.9 * ps}Z" fill="#d9574a" opacity="0.95"/><path d="M${px - 0.4 * ps} ${py + 0.1 * ps}L${px - 0.5 * ps} ${py + 0.5 * ps}M${px + 0.4 * ps} ${py + 0.1 * ps}L${px + 0.5 * ps} ${py + 0.5 * ps}" stroke="#d9574a" stroke-width="5"/><circle cx="${px - 0.3 * ps}" cy="${py + 1.8 * ps}" r="6" fill="#4f86c2"/><circle cx="${px + 0.3 * ps}" cy="${py + 2.3 * ps}" r="7" fill="#ffd25a"/>`);
  // 手上畫筆（右手高舉朝畫布）
  const hx = px + 1.2 * ps, hy = py - 1.4 * ps;
  s.add(`<path d="M${hx} ${hy}L${hx + 74} ${hy + 30}" stroke="#8a5c36" stroke-width="5" stroke-linecap="round"/><path d="M${hx + 70} ${hy + 28}L${hx + 92} ${hy + 38}" stroke="#d9574a" stroke-width="7" stroke-linecap="round"/>`);
  // 調色盤（左手）
  const lx = px - 0.9 * ps, ly = py + 2.15 * ps;
  s.add(`<g transform="translate(${lx} ${ly}) rotate(-12)"><path d="M-44 -6Q-48 -26 -10 -28Q40 -32 46 -4Q44 20 6 22Q-10 14 -20 22Q-44 22 -44 -6Z" fill="#e8c898" stroke="#a9763f" stroke-width="3"/><circle cx="-20" cy="-12" r="6" fill="#d9574a"/><circle cx="-4" cy="-18" r="6" fill="#4f86c2"/><circle cx="14" cy="-14" r="6" fill="#ffd25a"/><circle cx="28" cy="-4" r="6" fill="#5aa86a"/><circle cx="-24" cy="6" r="4" fill="#fff"/></g><ellipse cx="${lx}" cy="${ly}" rx="${0.24 * ps}" ry="${0.27 * ps}" fill="#f6d4ba"/>`);
  // 小凳子與顏料箱
  s.add('<g transform="translate(370 500)"><ellipse cx="40" cy="82" rx="46" ry="8" fill="#000" opacity="0.25" filter="url(#b4)"/><rect x="0" y="0" width="80" height="14" rx="5" fill="#b98556"/><path d="M8 14L0 80M72 14L80 80" stroke="#8a5c36" stroke-width="7"/></g>');
  s.add('<g transform="translate(636 520)"><rect x="0" y="0" width="120" height="60" rx="6" fill="#8a5c36"/><rect x="0" y="0" width="120" height="14" rx="5" fill="#a9763f"/>' + [['#d9574a', 14], ['#4f86c2', 34], ['#ffd25a', 54], ['#5aa86a', 74], ['#e8708a', 94]].map(([c, x]) => `<rect x="${x}" y="-18" width="12" height="30" rx="3" fill="${c}" transform="rotate(${(x - 54) / 5} ${x} 0)"/>`).join('') + '</g>');
  s.add('<ellipse cx="270" cy="590" rx="100" ry="10" fill="#4f86c2" opacity="0.18"/>');
  return s.out();
};


/* I6 寫毛筆字 */
out.calligraphy = () => {
  const s = Scene(); const R = rng(96);
  wall(s, 'wall', '#efe3c8', '#dcc9a2'); wall(s, 'floor', '#8a5c3a', '#5f3d24'); wall(s, 'desk', '#a9703f', '#7a4a26'); wall(s, 'sky', '#cfe3ec', '#f4eed6');
  s.def(rad('lt', 0.5, 0, 0.9, [[0, '#fff4d0', 0.6], [1, '#fff4d0', 0]]));
  s.def(rad('lan', 0.4, 0.35, 0.9, [[0, '#ff7a5a'], [0.6, '#d93c2a'], [1, '#8f1f18']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/><circle cx="400" cy="60" r="380" fill="url(#lt)"/>');
  // 圓窗
  s.add('<circle cx="140" cy="150" r="90" fill="url(#sky)"/><path d="M60 190Q110 150 150 180Q190 150 230 190V240H60Z" fill="#8fb88a" opacity="0.8"/><path d="M60 150H220M140 70V230" stroke="#6a4a2a" stroke-width="5"/><circle cx="140" cy="150" r="90" fill="none" stroke="#6a4a2a" stroke-width="12"/><g stroke="#4f8f35" stroke-width="5" fill="none"><path d="M210 230Q190 150 224 100"/><path d="M196 190Q176 170 160 176M214 150Q234 130 250 138"/></g>');
  // 掛軸（右）：竹子
  s.add('<g transform="translate(610 36)"><rect x="-4" y="0" width="188" height="8" rx="4" fill="#5a3a22"/><rect x="0" y="8" width="180" height="260" fill="#f6efd8"/><rect x="10" y="18" width="160" height="240" fill="#fffaec" stroke="#cfbf94" stroke-width="2"/><rect x="-6" y="268" width="192" height="10" rx="5" fill="#5a3a22"/><path d="M60 250V50M110 250V80" stroke="#4f7f46" stroke-width="9"/><path d="M60 100H68M60 160H68M60 215H68M110 130H118M110 190H118" stroke="#2f5a30" stroke-width="3"/><path d="M60 70Q100 60 120 90M60 130Q20 120 22 150M110 100Q150 96 160 130M110 160Q70 160 66 190" stroke="#4f7f46" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="132" y="210" width="22" height="22" fill="#c9423a"/><rect x="136" y="214" width="14" height="14" fill="none" stroke="#fff" stroke-width="2"/></g>');
  // 紅燈籠
  s.add('<g><path d="M390 0V28" stroke="#7a1c14" stroke-width="2"/><ellipse cx="390" cy="60" rx="26" ry="32" fill="url(#lan)"/><rect x="376" y="26" width="28" height="8" fill="#d9a53c"/><rect x="376" y="86" width="28" height="8" fill="#d9a53c"/><path d="M390 94V126" stroke="#d9a53c" stroke-width="3"/></g>');
  s.add('<g transform="translate(460 100)"><rect x="0" y="0" width="12" height="130" fill="#6a4a2a" opacity="0"/></g>');
  // 地板
  s.add('<rect y="430" width="800" height="170" fill="url(#floor)"/><rect y="424" width="800" height="10" fill="#6a4a2a"/><g stroke="#3a2412" stroke-width="2" opacity="0.3">' + Array.from({ length: 6 }, (_, i) => `<path d="M0 ${452 + i * 28}H800"/>`).join('') + '</g>');
  // 書架（左下）
  s.add('<g transform="translate(24 270)"><rect x="0" y="0" width="150" height="160" fill="#7a4a26"/><rect x="6" y="6" width="138" height="148" fill="#5a3418"/><rect x="6" y="76" width="138" height="6" fill="#7a4a26"/>' + Array.from({ length: 9 }, (_, i) => `<rect x="${12 + i * 14}" y="${i % 2 ? 22 : 18}" width="11" height="${i % 2 ? 54 : 58}" fill="${['#d9574a', '#e8c34a', '#4f86c2', '#f4efe2', '#5aa86a'][i % 5]}"/>`).join('') + Array.from({ length: 5 }, (_, i) => `<rect x="${14 + i * 24}" y="${90 + (i % 2) * 4}" width="20" height="60" fill="${['#e8dfc8', '#c9b48a', '#e8dfc8', '#d9c9a0', '#b9a070'][i]}" transform="rotate(${(i - 2) * 1.5} ${24 + i * 24} 150)"/>`).join('') + '</g>');
  // 老爺爺（站在桌後）
  s.add(person(s, { x: 410, y: 268, h: 380, skin: 'light', hair: '#cfcfcf', hairStyle: 'gray', top: '#6a7f8e', bottom: '#3a3f4a', pose: 'hold', legs: 'none', glasses: true, collar: false }));
  s.add('<path d="M380 272Q410 302 440 272L446 296L410 316L374 296Z" fill="#5a6f7e"/><path d="M410 302V440" stroke="#4a5f6e" stroke-width="3"/><circle cx="410" cy="340" r="3" fill="#c9b48a"/><circle cx="410" cy="372" r="3" fill="#c9b48a"/>');
  // 孫子（右側看）
  s.add(person(s, { x: 610, y: 358, h: 250, skin: 'mid', hair: '#222', hairStyle: 'short', top: '#e8a05a', bottom: '#3a4a6a', pose: 'down', legs: 'none', sleeve: 'short' }));
  // 書桌（俯視角度較大）
  s.add(shadow(400, 584, 380, 14, 0.4));
  s.add('<path d="M110 424H690L730 520H70Z" fill="url(#desk)"/><path d="M70 520H730V546H70Z" fill="#6a3f1e"/><rect x="100" y="546" width="22" height="44" fill="#6a3f1e"/><rect x="678" y="546" width="22" height="44" fill="#6a3f1e"/>');
  // 氈墊與宣紙
  s.add('<path d="M170 440H630L660 508H140Z" fill="#2f3a46"/><path d="M210 444H590L614 504H186Z" fill="#fffaec"/>');
  s.add('<g transform="translate(400 450) scale(1 0.62)"><text x="0" y="78" font-size="108" font-weight="900" text-anchor="middle" fill="#14110f" font-family="Noto Serif TC, Noto Sans TC, serif">永</text></g>');
  s.add('<rect x="214" y="448" width="58" height="7" fill="#4a3a2a"/><rect x="528" y="448" width="58" height="7" fill="#4a3a2a"/>');
  s.add('<rect x="560" y="486" width="22" height="16" fill="#c9423a" opacity="0.9"/>');
  // 毛筆（握在手中）
  s.add('<path d="M398 372L440 470" stroke="#8a5a2a" stroke-width="7" stroke-linecap="round"/><path d="M440 470L446 484" stroke="#14110f" stroke-width="8" stroke-linecap="round"/><rect x="396" y="366" width="10" height="10" rx="3" fill="#e8c34a" transform="rotate(-14 396 366)"/>');
  // 筆筒、硯台、鎮紙
  s.add('<g transform="translate(668 396)"><path d="M0 8L6 50H44L50 8Z" fill="#3f7f6f"/><ellipse cx="25" cy="8" rx="25" ry="6" fill="#2a5a4e"/><path d="M12 6L6 -40M22 6L24 -46M32 6L40 -38" stroke="#8a5a2a" stroke-width="5" stroke-linecap="round"/><path d="M6 -40L4 -56M24 -46L26 -64M40 -38L44 -54" stroke="#14110f" stroke-width="7" stroke-linecap="round"/></g>');
  s.add('<g transform="translate(96 450)"><path d="M0 0H90L100 24H-8Z" fill="#2b2f33"/><path d="M-8 24H100V40H-8Z" fill="#14181c"/><ellipse cx="46" cy="10" rx="34" ry="7" fill="#0a0c0e"/><rect x="62" y="-10" width="10" height="38" rx="2" fill="#14110f" transform="rotate(70 62 -10)"/></g>');
  return s.out();
};

/* I7 用電腦工作 */
out.laptop = () => {
  const s = Scene(); const R = rng(97);
  wall(s, 'wall', '#eef1f2', '#dfe5e6'); wall(s, 'floor', '#c9a47a', '#a07a50'); wall(s, 'desk', '#c99a62', '#a87a46'); wall(s, 'sky', '#a9d4ec', '#f0efd8');
  s.def(rad('lt', 0.5, 0, 0.9, [[0, '#fff4d0', 0.5], [1, '#fff4d0', 0]]));
  s.def(lin('lid', 0, 0, 1, 1, [[0, '#d7dcdf'], [1, '#a6adb2']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  // 大窗（城市）
  s.add('<rect x="40" y="40" width="330" height="270" fill="url(#sky)"/>');
  [[50, 190, 40], [96, 150, 50], [150, 200, 36], [190, 120, 54], [250, 180, 42], [296, 140, 50], [336, 200, 30]].forEach(([x, y, w], i) => s.add(`<rect x="${x}" y="${y}" width="${w}" height="${310 - y}" fill="${['#b9c4c9', '#cfc7b4', '#a9b8c0'][i % 3]}"/><g fill="#fff" opacity="0.5">${Array.from({ length: 6 }, (_, j) => `<rect x="${x + 6 + (j % 2) * 18}" y="${y + 10 + Math.floor(j / 2) * 22}" width="10" height="12"/>`).join('')}</g>`));
  s.add('<path d="M205 40V310M40 175H370" stroke="#fff" stroke-width="7"/><rect x="40" y="40" width="330" height="270" fill="none" stroke="#8a97a0" stroke-width="10"/><rect x="30" y="308" width="350" height="12" fill="#c5cdd1"/>');
  s.add('<circle cx="300" cy="40" r="240" fill="url(#lt)"/>');
  // 牆：便利貼、時鐘、日曆
  s.add('<circle cx="560" cy="90" r="38" fill="#fff" stroke="#555" stroke-width="5"/><path d="M560 90V66M560 90L578 100" stroke="#333" stroke-width="4" stroke-linecap="round"/><circle cx="560" cy="90" r="3" fill="#333"/>' + Array.from({ length: 12 }, (_, i) => `<path d="M${560 + 30 * Math.sin(i * Math.PI / 6)} ${90 - 30 * Math.cos(i * Math.PI / 6)}l${3 * Math.sin(i * Math.PI / 6)} ${-3 * Math.cos(i * Math.PI / 6)}" stroke="#333" stroke-width="2"/>`).join(''));
  [[640, 60, '#ffe27a', -4], [690, 76, '#ff9fb4', 3], [650, 114, '#9fe0a8', 2], [700, 130, '#9fd3ff', -3]].forEach(([x, y, c, r]) => s.add(`<g transform="rotate(${r} ${x + 20} ${y + 20})"><rect x="${x}" y="${y}" width="40" height="40" fill="${c}"/><path d="M${x + 6} ${y + 12}H${x + 32}M${x + 6} ${y + 22}H${x + 30}M${x + 6} ${y + 32}H${x + 22}" stroke="#555" stroke-width="2" opacity="0.5"/></g>`));
  // 地板、盆栽
  s.add('<rect y="470" width="800" height="130" fill="url(#floor)"/><rect y="464" width="800" height="10" fill="#e8e0d0"/>');
  s.add('<g transform="translate(20 380)"><path d="M0 40L10 90H60L70 40Z" fill="#4f6a8a"/><ellipse cx="35" cy="40" rx="35" ry="8" fill="#3a5270"/>' + [[-30, -50, -30], [0, -90, 0], [30, -50, 30], [14, -70, 14]].map(([dx, dy, rot]) => `<path d="M35 40Q${35 + dx} ${dy + 10} ${35 + dx * 1.3} ${dy}Q${42 + dx} ${dy + 30} 40 40Z" fill="#4f8f35" transform="rotate(${rot} 35 40)"/>`).join('') + '</g>');
  // 人（坐著，在桌後）
  s.add('<rect x="412" y="262" width="120" height="190" rx="30" fill="#3a4a5a"/><rect x="428" y="270" width="88" height="170" rx="22" fill="#4a5d70"/>');
  s.add(person(s, { x: 470, y: 250, h: 420, skin: 'light', hair: '#2a1b14', hairStyle: 'long', top: '#e8c26a', bottom: '#33394a', pose: 'table', legs: 'sit', glasses: true, sleeve: 'long' }));
  s.add('<g transform="translate(0 40)">');
  // 桌子
  s.add(shadow(430, 592, 360, 14, 0.35));
  s.add('<rect x="90" y="400" width="680" height="22" fill="url(#desk)"/><rect x="90" y="420" width="680" height="8" fill="#7a5028"/><rect x="120" y="428" width="18" height="160" fill="#8a5c30"/><rect x="722" y="428" width="18" height="160" fill="#8a5c30"/>');
  // 筆電（背面朝觀眾，螢幕朝人）
  s.add('<path d="M330 410L612 410L640 400L350 400Z" fill="#a6adb2"/>');
  s.add('<path d="M352 400L360 300Q362 294 368 294H574Q580 294 582 300L590 400Z" fill="url(#lid)"/><path d="M360 300Q362 294 368 294H574Q580 294 582 300L584 320H358Z" fill="#fff" opacity="0.25"/>');
  s.add('<circle cx="470" cy="352" r="12" fill="#c9cfd3" opacity="0.7"/>');
  s.add('<path d="M338 408H624L636 420H326Z" fill="#8f979c"/>');
  // 咖啡、滑鼠、筆記本、檯燈
  s.add('<g transform="translate(660 372)"><path d="M0 0H44L40 32Q22 38 4 32Z" fill="#fff"/><ellipse cx="22" cy="0" rx="22" ry="6" fill="#6a3f1e"/><path d="M44 8Q60 8 56 22Q52 28 42 26" stroke="#fff" stroke-width="5" fill="none"/><path d="M14 -10Q8 -26 18 -34M28 -10Q22 -24 32 -32" stroke="#fff" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/><ellipse cx="22" cy="36" rx="34" ry="6" fill="#e8e0d0"/></g>');
  s.add('<g transform="translate(250 398) rotate(-5)"><rect x="0" y="-14" width="70" height="38" rx="3" fill="#2f6a8f"/><rect x="4" y="-12" width="62" height="34" rx="2" fill="#f6f1e2"/><path d="M12 -2H58M12 8H52M12 16H44" stroke="#9aa" stroke-width="2"/><rect x="40" y="-30" width="4" height="40" rx="2" fill="#d9574a" transform="rotate(30 40 -10)"/></g>');
  s.add('<ellipse cx="660" cy="408" rx="0" ry="0"/><g transform="translate(150 360)"><rect x="0" y="36" width="40" height="8" rx="3" fill="#2b2f33"/><path d="M20 36L8 -20L46 -50" stroke="#2b2f33" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M34 -62L66 -44L52 -26Z" fill="#e8c34a"/><path d="M42 -34L74 40H10Z" fill="#fff4d0" opacity="0.25" filter="url(#b4)"/></g>');
  s.add('<ellipse cx="320" cy="412" rx="22" ry="9" fill="#2b2f33"/><ellipse cx="318" cy="410" rx="20" ry="6" fill="#444"/></g>');
  return s.out();
};

/* I8 抱小寶寶 */
out.baby = () => {
  const s = Scene(); const R = rng(98);
  wall(s, 'wall', '#f8eadb', '#efd9bf'); wall(s, 'floor', '#d8b690', '#b88f64'); wall(s, 'sky', '#cfe6f2', '#f8f1dc');
  s.def(rad('lt', 0.5, 0, 0.9, [[0, '#fff4d0', 0.6], [1, '#fff4d0', 0]]));
  s.def(lin('blk', 0, 0, 1, 1, [[0, '#fff3c8'], [1, '#f0d890']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  // 牆上圖案：小星星
  for (let i = 0; i < 18; i++) s.add(`<path d="M${(R() * 780).toFixed(0)} ${(30 + R() * 300).toFixed(0)}l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z" fill="#f2d890" opacity="0.5"/>`);
  // 窗 + 窗簾
  s.add('<rect x="560" y="50" width="190" height="200" fill="url(#sky)"/><path d="M655 50V250M560 150H750" stroke="#fff" stroke-width="6"/><rect x="560" y="50" width="190" height="200" fill="none" stroke="#c9a074" stroke-width="9"/><path d="M540 30Q570 150 556 290H520V30Z" fill="#9fc8d9"/><path d="M770 30Q740 150 754 290H790V30Z" fill="#9fc8d9"/>');
  s.add('<circle cx="640" cy="40" r="220" fill="url(#lt)"/>');
  // 嬰兒床（左後）
  s.add('<g transform="translate(20 230)"><rect x="0" y="40" width="250" height="14" fill="#c9a074"/><rect x="0" y="40" width="10" height="190" fill="#c9a074"/><rect x="240" y="40" width="10" height="190" fill="#c9a074"/><rect x="4" y="150" width="242" height="14" fill="#c9a074"/>' + Array.from({ length: 11 }, (_, i) => `<rect x="${22 + i * 20}" y="54" width="5" height="96" fill="#d9b88c"/>`).join('') + '<rect x="12" y="130" width="226" height="22" rx="8" fill="#fff"/><rect x="12" y="116" width="100" height="26" rx="10" fill="#bfe0ec"/><path d="M130 0V40" stroke="#999" stroke-width="2"/><circle cx="100" cy="-10" r="0"/></g>');
  // 吊飾
  s.add('<g transform="translate(150 200)"><path d="M0 0H100" stroke="#999" stroke-width="3"/>' + [[10, '#ffb3c1'], [50, '#a9dff2'], [90, '#ffe27a']].map(([x, c]) => `<path d="M${x} 0V${34 + (x % 3) * 6}" stroke="#999" stroke-width="1.5"/><circle cx="${x}" cy="${44 + (x % 3) * 6}" r="9" fill="${c}"/>`).join('') + '</g>');
  // 地板、地墊
  s.add('<rect y="440" width="800" height="160" fill="url(#floor)"/><rect y="434" width="800" height="10" fill="#f4e9d2"/>');
  s.add('<ellipse cx="400" cy="560" rx="360" ry="46" fill="#bfe0ec" opacity="0.7"/><ellipse cx="400" cy="560" rx="330" ry="38" fill="#d9eef6" opacity="0.7"/>');
  // 玩具：積木、小熊
  s.add('<g transform="translate(110 520)">' + [['#ff9aa8', 0, 0, 'A'], ['#9ad4f2', 38, 4, 'B'], ['#ffe27a', 18, -34, 'C']].map(([c, x, y]) => `<rect x="${x}" y="${y}" width="36" height="36" rx="4" fill="${c}"/><path d="M${x} ${y}l6 -6h36l-6 6" fill="#fff" opacity="0.4"/>`).join('') + '</g>');
  s.add('<g transform="translate(470 490)">' + shadow(34, 74, 40, 7, 0.3) + '<circle cx="14" cy="8" r="10" fill="#c9965a"/><circle cx="54" cy="8" r="10" fill="#c9965a"/><circle cx="34" cy="28" r="26" fill="#d9a86a"/><ellipse cx="34" cy="38" rx="12" ry="9" fill="#f0d0a0"/><circle cx="26" cy="24" r="3" fill="#333"/><circle cx="42" cy="24" r="3" fill="#333"/><ellipse cx="34" cy="34" rx="4" ry="3" fill="#5a3418"/><ellipse cx="34" cy="68" rx="26" ry="24" fill="#d9a86a"/><ellipse cx="34" cy="68" rx="14" ry="14" fill="#f0d0a0"/></g>');
  s.add('<g transform="translate(560 490)"><rect x="0" y="10" width="24" height="56" rx="8" fill="#fff" stroke="#cfe3ee" stroke-width="2"/><rect x="2" y="30" width="20" height="34" rx="6" fill="#f6f1e2"/><rect x="4" y="0" width="16" height="14" rx="6" fill="#f4a8b8"/><path d="M0 28H24M0 40H24" stroke="#9fd4ea" stroke-width="2"/></g>' + shadow(572, 560, 24, 5, 0.3));
  // 爸爸（右，彎腰逗寶寶）
  s.add(person(s, { x: 650, y: 300, h: 370, skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#8a9fc4', bottom: '#3a3f4a', pose: 'hold', legs: 'stand', shoe: '#e8e8e8', glasses: true }));
  // 媽媽抱寶寶
  const mx = 400, my = 240, mh = 400, ms = mh / 7;
  s.add(person(s, { x: mx, y: my, h: mh, skin: 'light', hair: '#3a2418', hairStyle: 'long', top: '#e89a8a', bottom: '#4a5a8a', pose: 'hold', legs: 'stand', shoe: '#f2f2f2', skirt: false }));
  // 毯子包著的寶寶（橫抱在胸前）
  const bx = mx + 0.2 * ms, by = my + 1.55 * ms;
  s.add(`<g transform="rotate(-18 ${bx} ${by})"><path d="M${bx - 1.7 * ms} ${by + 0.1 * ms}Q${bx - 1.8 * ms} ${by - 0.55 * ms} ${bx - 0.8 * ms} ${by - 0.6 * ms}L${bx + 1.2 * ms} ${by - 0.5 * ms}Q${bx + 1.8 * ms} ${by - 0.2 * ms} ${bx + 1.4 * ms} ${by + 0.45 * ms}Q${bx + 0.4 * ms} ${by + 0.85 * ms} ${bx - 1.0 * ms} ${by + 0.7 * ms}Q${bx - 1.6 * ms} ${by + 0.6 * ms} ${bx - 1.7 * ms} ${by + 0.1 * ms}Z" fill="url(#blk)" stroke="#e0c070" stroke-width="2"/><path d="M${bx - 0.6 * ms} ${by - 0.55 * ms}Q${bx - 0.2 * ms} ${by + 0.2 * ms} ${bx - 0.7 * ms} ${by + 0.7 * ms}M${bx + 0.2 * ms} ${by - 0.5 * ms}Q${bx + 0.6 * ms} ${by + 0.2 * ms} ${bx + 0.3 * ms} ${by + 0.75 * ms}" stroke="#e0c070" stroke-width="2" fill="none" opacity="0.7"/>
    <circle cx="${bx - 1.1 * ms}" cy="${by - 0.38 * ms}" r="${0.52 * ms}" fill="#f6d4ba"/><path d="M${bx - 1.55 * ms} ${by - 0.5 * ms}Q${bx - 1.1 * ms} ${by - 1.0 * ms} ${bx - 0.65 * ms} ${by - 0.52 * ms}Q${bx - 1.1 * ms} ${by - 0.75 * ms} ${bx - 1.55 * ms} ${by - 0.5 * ms}Z" fill="#3a2418"/>
    <path d="M${bx - 1.4 * ms} ${by - 0.4 * ms}q${0.08 * ms} ${-0.07 * ms} ${0.16 * ms} 0M${bx - 0.9 * ms} ${by - 0.4 * ms}q${0.08 * ms} ${-0.07 * ms} ${0.16 * ms} 0" stroke="#2b1d17" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M${bx - 1.2 * ms} ${by - 0.2 * ms}q${0.1 * ms} ${0.1 * ms} ${0.2 * ms} 0" stroke="#c9605a" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="${bx - 1.45 * ms}" cy="${by - 0.25 * ms}" rx="${0.1 * ms}" ry="${0.06 * ms}" fill="#f09a90" opacity="0.6"/><ellipse cx="${bx - 0.78 * ms}" cy="${by - 0.25 * ms}" rx="${0.1 * ms}" ry="${0.06 * ms}" fill="#f09a90" opacity="0.6"/></g>`);
  // 媽媽的手（托住）
  s.add(`<ellipse cx="${mx - 0.4 * ms}" cy="${my + 1.75 * ms}" rx="${0.24 * ms}" ry="${0.26 * ms}" fill="#f6d4ba"/><ellipse cx="${mx + 0.95 * ms}" cy="${my + 1.55 * ms}" rx="${0.24 * ms}" ry="${0.26 * ms}" fill="#f6d4ba"/>`);
  return s.out();
};

/* I9 全家吃晚飯 */
out.familydinner = () => {
  const s = Scene(); const R = rng(99);
  wall(s, 'wall', '#f1dcb8', '#e0c394'); wall(s, 'floor', '#a07a50', '#7a5834'); wall(s, 'tbl', '#c98f56', '#9a6636');
  s.def(rad('lt', 0.5, 0, 0.9, [[0, '#fff0b0', 0.8], [1, '#fff0b0', 0]]));
  s.def(lin('steel', 0, 0, 1, 1, [[0, '#f2f4f5'], [0.5, '#b5bec3'], [1, '#e0e5e7']]));
  s.def(lin('night', 0, 0, 0, 1, [[0, '#26345a'], [1, '#4a5a8a']]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  // 窗（夜晚）
  s.add('<rect x="40" y="60" width="170" height="190" fill="url(#night)"/><path d="M125 60V250M40 155H210" stroke="#e8d9bc" stroke-width="6"/><rect x="40" y="60" width="170" height="190" fill="none" stroke="#8a5c36" stroke-width="9"/><circle cx="170" cy="100" r="14" fill="#fff4c8"/>' + [[60, 190, 30, 60], [100, 170, 26, 80], [150, 200, 30, 50]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#2a3a5e"/><rect x="${x + 6}" y="${y + 8}" width="6" height="8" fill="#ffd36a"/><rect x="${x + 16}" y="${y + 22}" width="6" height="8" fill="#ffd36a"/>`).join(''));
  // 右側：矮櫃 + 電鍋
  s.add('<rect x="600" y="300" width="200" height="140" fill="#8a5c36"/><rect x="600" y="294" width="200" height="10" fill="#b98556"/><path d="M640 300H760M700 304V440" stroke="#5a3a22" stroke-width="2"/>');
  s.add('<g transform="translate(630 220)"><ellipse cx="40" cy="78" rx="46" ry="6" fill="#000" opacity="0.2"/><path d="M0 20Q40 -6 80 20V74H0Z" fill="url(#steel)"/><rect x="0" y="48" width="80" height="26" fill="#b5bec3"/><rect x="0" y="48" width="80" height="4" fill="#fff" opacity="0.5"/><circle cx="40" cy="-2" r="7" fill="#555"/><path d="M-8 52H0M80 52H88" stroke="#333" stroke-width="5" stroke-linecap="round"/><circle cx="56" cy="62" r="5" fill="#e83a2a"/><path d="M30 6Q20 -16 30 -30M50 6Q42 -14 52 -26" stroke="#fff" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round"/></g>');
  s.add('<g transform="translate(740 250)"><rect x="0" y="0" width="30" height="44" rx="5" fill="#c9423a"/><rect x="6" y="10" width="18" height="12" fill="#fff4d0"/></g>');
  // 全家福相框、年曆
  s.add('<rect x="270" y="60" width="130" height="90" fill="#fff8e6" stroke="#8a5c36" stroke-width="7"/><circle cx="310" cy="105" r="10" fill="#f6d4ba"/><circle cx="335" cy="108" r="9" fill="#e8b894"/><circle cx="360" cy="105" r="10" fill="#f6d4ba"/><path d="M296 140Q310 118 324 140ZM322 140Q335 120 348 140ZM348 140Q360 118 374 140Z" fill="#6fa5c9"/>');
  s.add('<g transform="translate(450 70)"><rect x="0" y="0" width="90" height="100" fill="#fff"/><rect x="0" y="0" width="90" height="24" fill="#c9423a"/>' + txt(45, 19, 17, '十 月', '#fff') + '<g fill="#999">' + Array.from({ length: 20 }, (_, i) => `<rect x="${8 + (i % 5) * 15}" y="${34 + Math.floor(i / 5) * 15}" width="9" height="7"/>`).join('') + '</g></g>');
  // 吊燈
  s.add('<path d="M400 0V40" stroke="#333" stroke-width="3"/><path d="M350 90Q400 20 450 90Z" fill="#e8b84a"/><circle cx="400" cy="100" r="190" fill="url(#lt)" filter="url(#b8)"/><ellipse cx="400" cy="92" rx="30" ry="8" fill="#fff4c8"/>');
  // 地板
  s.add('<rect y="440" width="800" height="160" fill="url(#floor)"/><rect y="434" width="800" height="10" fill="#5a3a22"/>');
  // 後排人物（坐在桌後）
  const sit = (x, y, h, o) => s.add(person(s, Object.assign({ x, y, h, pose: 'table', legs: 'none' }, o)));
  sit(210, 300, 330, { skin: 'light', hair: '#cfcfcf', hairStyle: 'gray', top: '#8a6f9a', bottom: '#333', glasses: true });
  sit(330, 296, 350, { skin: 'mid', hair: '#2a1b14', hairStyle: 'ponytail', top: '#e89a8a', bottom: '#333' });
  sit(470, 292, 360, { skin: 'tan', hair: '#1a120e', hairStyle: 'short', top: '#6a8fb4', bottom: '#333' });
  sit(570, 340, 270, { skin: 'mid', hair: '#222', hairStyle: 'short', top: '#f2c14a', bottom: '#333', sleeve: 'short' });
  sit(110, 350, 260, { skin: 'light', hair: '#3a2418', hairStyle: 'ponytail', top: '#7fb69a', bottom: '#333', sleeve: 'short' });
  // 圓桌
  s.add(shadow(400, 586, 380, 16, 0.4));
  s.add('<rect x="380" y="500" width="40" height="86" fill="#6a3f1e"/>');
  s.add('<ellipse cx="400" cy="440" rx="360" ry="104" fill="#7a4a26"/><ellipse cx="400" cy="428" rx="360" ry="104" fill="url(#tbl)"/><ellipse cx="400" cy="428" rx="338" ry="94" fill="none" stroke="#e8c898" stroke-width="2" opacity="0.5"/>');
  s.add('<ellipse cx="400" cy="424" rx="210" ry="58" fill="#e8d6b0" opacity="0.55"/>');
  // 菜：魚、湯、青菜、豆腐
  const plate = (x, y, w, c) => `<ellipse cx="${x}" cy="${y + 5}" rx="${w}" ry="${w * 0.28}" fill="#000" opacity="0.18"/><ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * 0.3}" fill="#fff"/><ellipse cx="${x}" cy="${y}" rx="${w * 0.78}" ry="${w * 0.22}" fill="${c}"/>`;
  s.add(plate(400, 400, 80, '#f4e6c8'));
  s.add('<g transform="translate(400 398)"><path d="M-54 0Q-30 -22 14 -16Q40 -10 52 4Q30 14 -4 14Q-36 14 -54 0Z" fill="#d9a066"/><path d="M52 4L72 -10L72 18Z" fill="#c98a50"/><circle cx="-36" cy="-4" r="3" fill="#333"/><path d="M-20 -12Q-10 4 -14 12M0 -12Q10 4 6 12M20 -8Q30 4 26 10" stroke="#a8702e" stroke-width="2" fill="none"/><path d="M-20 -4H36" stroke="#fff4c8" stroke-width="3" opacity="0.6"/><circle cx="-6" cy="-8" r="4" fill="#5aa86a"/><circle cx="12" cy="-10" r="4" fill="#c9423a"/></g>');
  s.add(plate(268, 432, 62, '#6fb05a'));
  s.add('<g fill="#4f9a3f"><ellipse cx="258" cy="428" rx="14" ry="6"/><ellipse cx="278" cy="432" rx="14" ry="6"/><ellipse cx="266" cy="436" rx="14" ry="5"/></g>');
  s.add(plate(540, 434, 62, '#e8d4a0'));
  s.add('<g fill="#fff4d0">' + [[520, 430], [540, 434], [558, 430], [532, 440], [550, 440]].map(([x, y]) => `<rect x="${x - 8}" y="${y - 5}" width="16" height="10" rx="2"/>`).join('') + '</g><circle cx="530" cy="430" r="3" fill="#c9423a"/><circle cx="552" cy="436" r="3" fill="#5aa86a"/>');
  // 湯鍋
  s.add('<g transform="translate(400 468)"><ellipse cx="0" cy="12" rx="62" ry="12" fill="#000" opacity="0.2"/><path d="M-58 -16H58L50 14Q0 24 -50 14Z" fill="#e8e0d0"/><ellipse cx="0" cy="-16" rx="58" ry="12" fill="#f6efd8"/><ellipse cx="0" cy="-16" rx="48" ry="8" fill="#e8c06a"/><circle cx="-16" cy="-17" r="5" fill="#fff4c8"/><circle cx="14" cy="-15" r="4" fill="#5aa86a"/><circle cx="26" cy="-18" r="3" fill="#c9423a"/><path d="M-20 -26Q-30 -50 -18 -64M12 -26Q4 -48 16 -60" stroke="#fff" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/></g>');
  // 每人的飯碗與筷子
  [[190, 436], [320, 458], [480, 458], [610, 440], [92, 440]].forEach(([x, y], i) => {
    s.add(`<ellipse cx="${x}" cy="${y + 8}" rx="30" ry="7" fill="#000" opacity="0.2"/><path d="M${x - 28} ${y - 14}H${x + 28}Q${x + 24} ${y + 10} ${x} ${y + 12}Q${x - 24} ${y + 10} ${x - 28} ${y - 14}Z" fill="${['#6fa5c9', '#f4efe2', '#d9574a', '#6fa5c9', '#e8b84a'][i]}"/><ellipse cx="${x}" cy="${y - 14}" rx="28" ry="8" fill="#fff"/><path d="M${x - 24} ${y - 16}Q${x} ${y - 36} ${x + 24} ${y - 16}Z" fill="#fff"/>`);
    s.add(`<path d="M${x + 36} ${y + 4}L${x + 70} ${y - 6}M${x + 40} ${y + 8}L${x + 74} ${y - 2}" stroke="#8a4a1e" stroke-width="3" stroke-linecap="round"/>`);
  });
  return s.out();
};

/* I10 趕公車 */
out.runbus = () => {
  const s = Scene(); const R = rng(100);
  wall(s, 'sky', '#9fd0ea', '#f6e8c8'); wall(s, 'road', '#6c7074', '#43474b'); wall(s, 'walk', '#d3c9b4', '#aa9f88');
  s.def(lin('bus', 0, 0, 0, 1, [[0, '#f8f6ee'], [1, '#d9d6c8']]));
  s.def(rad('sun', 0.2, 0.1, 0.8, [[0, '#fff3c4', 0.9], [1, '#fff3c4', 0]]));
  s.def(lin('pole', 0, 0, 1, 0, [[0, '#59605f'], [0.5, '#9aa3a2'], [1, '#444b4a']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="120" cy="30" r="260" fill="url(#sun)"/>');
  const bl = [[0, 100, 150, '#d9c9a8'], [145, 60, 130, '#b9c4c9'], [270, 120, 140, '#e2d3b4'], [405, 80, 120, '#c8b79a'], [520, 110, 150, '#b8c6cc'], [665, 70, 140, '#dccbaa']];
  bl.forEach(([x, y, w, c]) => {
    s.add(`<rect x="${x}" y="${y}" width="${w}" height="${340 - y}" fill="${c}"/><rect x="${x}" y="${y}" width="${w}" height="9" fill="#000" opacity="0.1"/>`);
    for (let r = 0; r < 6; r++) for (let q = 0; q < Math.floor(w / 36); q++) { const wx = x + 10 + q * 36, wy = y + 20 + r * 42; if (wy > 290) continue; s.add(`<rect x="${wx}" y="${wy}" width="24" height="26" fill="#6f8fa6" opacity="0.8"/><path d="M${wx} ${wy + 13}H${wx + 24}" stroke="#4a5358" stroke-width="2"/><rect x="${wx - 3}" y="${wy + 26}" width="30" height="4" fill="#666"/>`); }
  });
  s.add('<rect x="20" y="286" width="84" height="24" fill="#2f6d4f"/>' + txt(62, 304, 16, '藥 局', '#fff') + '<rect x="300" y="268" width="100" height="24" fill="#d6372b"/>' + txt(350, 286, 16, '早 餐 店', '#fff6dc'));
  s.add('<g filter="url(#b2)"><ellipse cx="30" cy="344" rx="70" ry="30" fill="#4f7f46"/><ellipse cx="520" cy="344" rx="90" ry="30" fill="#4f7f46"/></g>');
  s.add('<rect y="340" width="800" height="50" fill="url(#walk)"/><rect y="386" width="800" height="6" fill="#e6dec9"/>');
  s.add('<rect y="392" width="800" height="208" fill="url(#road)"/><path d="M0 566H800" stroke="#f4f4ee" stroke-width="4" opacity="0.7"/>');
  // 公車（側面，車頭朝右，停在站牌）
  const bx = 210, by = 250;
  s.add(shadow(bx + 330, 466, 380, 16, 0.5));
  s.add(`<g><rect x="${bx}" y="${by}" width="520" height="210" rx="26" fill="url(#bus)"/><rect x="${bx}" y="${by + 130}" width="520" height="22" fill="#2f86c2"/><rect x="${bx}" y="${by + 152}" width="520" height="8" fill="#f2b84a"/>
    ${Array.from({ length: 5 }, (_, i) => `<rect x="${bx + 24 + i * 78}" y="${by + 36}" width="64" height="78" rx="8" fill="#7ea6bd"/><path d="M${bx + 30 + i * 78} ${by + 44}L${bx + 54 + i * 78} ${by + 44}L${bx + 36 + i * 78} ${by + 106}L${bx + 30 + i * 78} ${by + 106}Z" fill="#fff" opacity="0.25"/>`).join('')}
    <rect x="${bx + 420}" y="${by + 30}" width="92" height="96" rx="10" fill="#7ea6bd"/>
    <rect x="${bx + 270}" y="${by + 6}" width="120" height="22" rx="4" fill="#14181c"/>${txt(bx + 330, by + 23, 16, '307 板橋', '#ffb43a', 'middle', 700)}
    <circle cx="${bx + 100}" cy="${by + 214}" r="38" fill="#14181c"/><circle cx="${bx + 100}" cy="${by + 214}" r="20" fill="#aab"/><circle cx="${bx + 420}" cy="${by + 214}" r="38" fill="#14181c"/><circle cx="${bx + 420}" cy="${by + 214}" r="20" fill="#aab"/>
    <rect x="${bx + 488}" y="${by + 168}" width="30" height="16" rx="5" fill="#ffd36a"/><rect x="${bx - 4}" y="${by + 90}" width="10" height="16" rx="3" fill="#d9574a"/></g>`);
  // 司機（在前窗）
  s.add(person(s, { x: bx + 466, y: by + 70, h: 190, skin: 'mid', hair: '#222', hairStyle: 'short', top: '#4a6a8a', bottom: '#333', pose: 'hold', legs: 'none', sleeve: 'short' }));
  s.add(`<path d="M${bx + 420} ${by + 30}H${bx + 512}V${by + 126}H${bx + 420}Z" fill="#9fc4d8" opacity="0.28"/>`);
  // 車門（打開的）
  s.add(`<rect x="${bx + 372}" y="${by + 30}" width="44" height="160" rx="6" fill="#2a4a62"/><rect x="${bx + 376}" y="${by + 36}" width="36" height="152" fill="#506a7e"/><path d="M${bx + 394} ${by + 36}V${by + 188}" stroke="#2a4a62" stroke-width="3"/>`);
  // 站牌
  s.add('<rect x="760" y="190" width="12" height="270" fill="url(#pole)"/>' + shadow(766, 460, 24, 5, 0.4) + '<rect x="728" y="130" width="70" height="76" rx="8" fill="#2f6dba"/><circle cx="763" cy="154" r="14" fill="#fff"/>' + txt(763, 160, 18, '公', '#2f6dba') + txt(763, 192, 16, '公車站', '#fff', 'middle', 700));
  // 跑的人（前景，朝右，傾斜）
  const rx = 215, ry = 262, rh = 300;
  s.add(`<g transform="rotate(7 ${rx} ${ry + 280})">` + person(s, { x: rx, y: ry, h: rh, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#5fa8d3', bottom: '#33394a', pose: 'runA', legs: 'run', shoe: '#f2f2f2', sleeve: 'short', smile: false }) + '</g>');
  // 書包（背後）
  s.add(`<g transform="rotate(7 ${rx} ${ry + 280})"><rect x="${rx - 88}" y="${ry + 10}" width="52" height="98" rx="16" fill="#e8a02f" transform="rotate(-6 ${rx - 88} ${ry + 10})"/><rect x="${rx - 80}" y="${ry + 62}" width="36" height="30" rx="8" fill="#c27d14" transform="rotate(-6 ${rx - 80} ${ry + 62})"/></g>`);
  // 手錶與汗珠、速度線
  s.add(`<g stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.8"><path d="M40 330H100M20 380H90M54 430H112M30 470H80"/></g>`);
  s.add(`<path d="M${rx + 20} ${ry - 82}q-6 -14 0 -22q6 8 0 22zM${rx + 44} ${ry - 60}q-5 -12 0 -18q5 7 0 18z" fill="#7fc4ea" opacity="0.9"/>`);
  s.add(`<rect x="${rx + 86}" y="${ry + 33}" width="14" height="10" rx="3" fill="#2b2f33" transform="rotate(20 ${rx + 86} ${ry + 33})"/>`);
  return s.out();
};

module.exports = out;
