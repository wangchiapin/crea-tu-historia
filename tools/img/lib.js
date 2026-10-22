// 小工具：產生 SVG 的共用函式（畫圖用，不會被網頁載入）
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const stopsOf = (st) => st.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('');
const lin = (i, x1, y1, x2, y2, st) => `<linearGradient id="${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stopsOf(st)}</linearGradient>`;
const rad = (i, cx, cy, r, st) => `<radialGradient id="${i}" cx="${cx}" cy="${cy}" r="${r}">${stopsOf(st)}</radialGradient>`;

function Scene() {
  const defs = [
    '<filter id="b2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>',
    '<filter id="b4" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>',
    '<filter id="b8" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>',
    '<filter id="b16" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>',
    '<filter id="b30" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="30"/></filter>',
    '<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/></filter>',
    rad('vig', 0.5, 0.5, 0.75, [[0.55, '#000', 0], [1, '#000', 0.28]]),
  ];
  const body = [];
  let n = 0;
  const api = {
    def: (s) => { defs.push(s); },
    add: (s) => { body.push(s); },
    uid: (p) => p + (++n),
    out() {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">\n<defs>\n${defs.join('\n')}\n</defs>\n${body.join('\n')}\n<rect width="800" height="600" fill="url(#vig)"/>\n<rect width="800" height="600" filter="url(#grain)" opacity="0.07"/>\n</svg>\n`;
    },
  };
  return api;
}

// 柔和陰影橢圓
const shadow = (cx, cy, rx, ry, o = 0.35) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="${o}" filter="url(#b4)"/>`;

/* ---------- 人物 ----------
   opts: x（脖子中心 x）, y（脖子底部 y）, h（全身高度，用來算比例，坐姿也用站姿高度當基準）
   skin, hair, hairStyle(short|long|bun|ponytail), top, sleeve(長度 long|short), bottom, shoe, pose, legs(none|stand|walk|run|sit), dress
*/
const SKINS = { light: ['#f6d4ba', '#e8b894', '#cf9871'], mid: ['#eec19a', '#dba478', '#be8458'], tan: ['#d9a77c', '#c08a60', '#9c6a44'] };
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const m = (v) => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)));
  return '#' + [m(r), m(g), m(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
}
function person(sc, o) {
  const s = o.h / 7, x = o.x, y = o.y;
  const k = sc.uid('p');
  const sk = SKINS[o.skin || 'light'];
  const top = o.top || '#5f7fa6', bot = o.bottom || '#33394a', hair = o.hair || '#2a1b14';
  sc.def(rad(k + 'sk', 0.42, 0.38, 0.8, [[0, sk[0]], [0.65, sk[1]], [1, sk[2]]]));
  sc.def(lin(k + 'tp', 0, 0, 1, 1, [[0, shade(top, 0.18)], [0.55, top], [1, shade(top, -0.3)]]));
  sc.def(lin(k + 'bt', 0, 0, 1, 0, [[0, shade(bot, 0.12)], [1, shade(bot, -0.3)]]));
  sc.def(lin(k + 'hr', 0, 0, 1, 1, [[0, shade(hair, 0.25)], [0.5, hair], [1, shade(hair, -0.4)]]));
  const P = (px, py) => `${(x + px * s).toFixed(1)} ${(y + py * s).toFixed(1)}`;
  const parts = [];
  const hipY = 2.25, legLen = 3.75;
  // 地面影子
  if (o.legs && o.legs !== 'sit') parts.push(shadow(x, y + (hipY + legLen) * s + 4, 1.6 * s, 0.28 * s, 0.4));
  // 長髮（後面那層）
  if (o.hairStyle === 'long') parts.push(`<path d="M${P(-0.55, -1.1)} C${P(-0.7, -0.2)} ${P(-0.8, 0.9)} ${P(-0.7, 1.55)} L${P(0.7, 1.55)} C${P(0.8, 0.9)} ${P(0.7, -0.2)} ${P(0.55, -1.1)}Z" fill="url(#${k}hr)"/>`);
  // 腿
  const L = o.legs || 'stand';
  const legStroke = (a, b, c, col, w) => `<path d="M${P(...a)} L${P(...b)} L${P(...c)}" stroke="${col}" stroke-width="${(w * s).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  const shoe = o.shoe || '#2a2a2e';
  const foot = (fx, fy, dir = 1) => `<ellipse cx="${(x + fx * s).toFixed(1)}" cy="${(y + fy * s).toFixed(1)}" rx="${(0.5 * s).toFixed(1)}" ry="${(0.22 * s).toFixed(1)}" fill="${shoe}" transform="rotate(${dir * -4} ${(x + fx * s).toFixed(1)} ${(y + fy * s).toFixed(1)})"/>`;
  const skinLeg = o.dress || o.skirt;
  const legCol = skinLeg ? `url(#${k}sk)` : `url(#${k}bt)`;
  const endY = hipY + legLen;
  if (L === 'stand') {
    const solid = skinLeg ? sk[1] : shade(bot, -0.12);
    parts.push(legStroke([-0.38, hipY], [-0.42, hipY + 1.9], [-0.42, endY - 0.1], solid, 0.62));
    parts.push(legStroke([0.38, hipY], [0.42, hipY + 1.9], [0.42, endY - 0.1], skinLeg ? sk[0] : bot, 0.62));
    parts.push(foot(-0.45, endY + 0.08, -1), foot(0.45, endY + 0.08, 1));
  } else if (L === 'walk') {
    parts.push(legStroke([-0.38, hipY], [-0.65, hipY + 1.9], [-1.0, endY - 0.2], shade(bot, -0.15), 0.6));
    parts.push(legStroke([0.38, hipY], [0.55, hipY + 1.9], [0.85, endY - 0.1], bot, 0.6));
    parts.push(foot(-1.15, endY - 0.1, -1), foot(1.0, endY + 0.05, 1));
  } else if (L === 'run') {
    parts.push(legStroke([-0.38, hipY], [-0.9, hipY + 1.2], [-1.9, hipY + 1.9], shade(bot, -0.15), 0.6));
    parts.push(legStroke([0.38, hipY], [1.15, hipY + 1.1], [0.95, endY - 0.2], bot, 0.6));
    parts.push(foot(-2.1, hipY + 2.05, -1), foot(1.05, endY + 0.05, 1));
  } else if (L === 'sit') {
    parts.push(legStroke([-0.38, hipY], [-0.55, hipY + 0.55], [-0.55, hipY + 2.5], shade(bot, -0.12), 0.64));
    parts.push(legStroke([0.38, hipY], [0.55, hipY + 0.55], [0.55, hipY + 2.5], bot, 0.64));
    parts.push(foot(-0.55, hipY + 2.65, -1), foot(0.55, hipY + 2.65, 1));
  }
  // 洋裝/裙子
  if (o.dress || o.skirt) {
    const hem = o.dress ? 3.9 : 3.3;
    parts.push(`<path d="M${P(-0.8, 2.0)} L${P(-1.15, hem)} Q${P(0, hem + 0.2)} ${P(1.15, hem)} L${P(0.8, 2.0)}Z" fill="url(#${k}tp)"/>`);
  }
  // 脖子
  parts.push(`<path d="M${P(-0.17, -0.3)} L${P(-0.19, 0.12)} Q${P(0, 0.34)} ${P(0.19, 0.12)} L${P(0.17, -0.3)}Z" fill="${sk[2]}"/>`);
  // 手臂：先畫遠側（左），再身體，再近側（右）
  const sl = o.sleeve === 'short' ? 0.55 : 1;
  const armCol = o.armCol || top;
  const pose = o.pose || 'down';
  const A = {
    down: { l: [[-0.82, 0.3], [-1.0, 1.3], [-0.9, 2.15]], r: [[0.82, 0.3], [1.0, 1.3], [0.9, 2.15]] },
    hold: { l: [[-0.82, 0.3], [-1.0, 1.3], [-0.3, 1.55]], r: [[0.82, 0.3], [1.0, 1.3], [0.3, 1.55]] },
    phone: { l: [[-0.82, 0.3], [-1.0, 1.3], [-0.9, 2.15]], r: [[0.82, 0.3], [1.25, 1.2], [0.5, -0.55]] },
    wave: { l: [[-0.82, 0.3], [-1.0, 1.3], [-0.9, 2.15]], r: [[0.82, 0.3], [1.35, -0.2], [1.2, -1.4]] },
    runA: { l: [[-0.82, 0.3], [-1.45, 1.1], [-0.85, 1.65]], r: [[0.82, 0.3], [1.4, 1.0], [1.95, 0.35]] },
    table: { l: [[-0.82, 0.3], [-1.15, 1.4], [-0.55, 2.35]], r: [[0.82, 0.3], [1.15, 1.4], [0.55, 2.35]] },
    sit: { l: [[-0.82, 0.3], [-1.05, 1.4], [-0.6, 2.2]], r: [[0.82, 0.3], [1.05, 1.4], [0.6, 2.2]] },
  }[pose];
  const arm = (pts, col, w) => {
    const upper = `<path d="M${P(...pts[0])} L${P(...pts[1])}" stroke="${col}" stroke-width="${(0.5 * s).toFixed(1)}" stroke-linecap="round" fill="none"/>`;
    const e1 = sl >= 1 ? 1 : 0;
    const fore = `<path d="M${P(...pts[1])} L${P(...pts[2])}" stroke="${e1 ? col : sk[1]}" stroke-width="${(0.42 * s).toFixed(1)}" stroke-linecap="round" fill="none"/>`;
    const hand = `<ellipse cx="${(x + pts[2][0] * s).toFixed(1)}" cy="${(y + pts[2][1] * s).toFixed(1)}" rx="${(0.22 * s).toFixed(1)}" ry="${(0.25 * s).toFixed(1)}" fill="url(#${k}sk)"/>`;
    return upper + fore + hand;
  };
  parts.push(arm(A.l, shade(armCol, -0.2)));
  // 身體
  const torsoEnd = o.dress ? 2.5 : 2.4;
  parts.push(`<path d="M${P(-0.92, 0.4)} C${P(-0.92, 0.05)} ${P(-0.5, -0.02)} ${P(-0.2, -0.02)} L${P(0.2, -0.02)} C${P(0.5, -0.02)} ${P(0.92, 0.05)} ${P(0.92, 0.4)} L${P(0.8, torsoEnd)} L${P(-0.8, torsoEnd)}Z" fill="url(#${k}tp)"/>`);
  if (!o.dress) parts.push(`<path d="M${P(-0.8, 2.15)} L${P(0.8, 2.15)} L${P(0.78, 2.4)} L${P(-0.78, 2.4)}Z" fill="url(#${k}bt)"/>`);
  // 衣領
  if (o.collar !== false) parts.push(`<path d="M${P(-0.3, -0.02)} Q${P(0, 0.42)} ${P(0.3, -0.02)}" stroke="${shade(top, -0.35)}" stroke-width="${(0.07 * s).toFixed(1)}" fill="none" opacity="0.7"/>`);
  // 身體右側暗部
  parts.push(`<path d="M${P(0.45, 0.02)} C${P(0.8, 0.05)} ${P(0.92, 0.15)} ${P(0.92, 0.4)} L${P(0.8, torsoEnd)} L${P(0.35, torsoEnd)}Z" fill="#000" opacity="0.13"/>`);
  parts.push(arm(A.r, armCol));
  // 頭
  const hc = [0, -0.64];
  const hp = (px, py) => P(hc[0] + px, hc[1] + py);
  parts.push(`<ellipse cx="${(x - 0.43 * s).toFixed(1)}" cy="${(y - 0.62 * s).toFixed(1)}" rx="${(0.07 * s).toFixed(1)}" ry="${(0.14 * s).toFixed(1)}" fill="${sk[1]}"/><ellipse cx="${(x + 0.43 * s).toFixed(1)}" cy="${(y - 0.62 * s).toFixed(1)}" rx="${(0.07 * s).toFixed(1)}" ry="${(0.14 * s).toFixed(1)}" fill="${sk[2]}"/>`);
  parts.push(`<ellipse cx="${x.toFixed(1)}" cy="${(y + hc[1] * s).toFixed(1)}" rx="${(0.43 * s).toFixed(1)}" ry="${(0.54 * s).toFixed(1)}" fill="url(#${k}sk)"/>`);
  // 臉部
  const ex = 0.17 * s, ey = y + (hc[1] + 0.02) * s;
  const eyeR = Math.max(1, 0.034 * s);
  parts.push(`<ellipse cx="${(x - ex).toFixed(1)}" cy="${ey.toFixed(1)}" rx="${(eyeR * 1.4).toFixed(1)}" ry="${eyeR.toFixed(1)}" fill="#2b1d17"/><ellipse cx="${(x + ex).toFixed(1)}" cy="${ey.toFixed(1)}" rx="${(eyeR * 1.4).toFixed(1)}" ry="${eyeR.toFixed(1)}" fill="#2b1d17"/>`);
  parts.push(`<path d="M${(x - ex - 0.09 * s).toFixed(1)} ${(ey - 0.1 * s).toFixed(1)} Q${(x - ex).toFixed(1)} ${(ey - 0.15 * s).toFixed(1)} ${(x - ex + 0.1 * s).toFixed(1)} ${(ey - 0.09 * s).toFixed(1)} M${(x + ex - 0.1 * s).toFixed(1)} ${(ey - 0.09 * s).toFixed(1)} Q${(x + ex).toFixed(1)} ${(ey - 0.15 * s).toFixed(1)} ${(x + ex + 0.09 * s).toFixed(1)} ${(ey - 0.1 * s).toFixed(1)}" stroke="${shade(hair, 0.1)}" stroke-width="${Math.max(0.8, 0.03 * s).toFixed(1)}" fill="none"/>`);
  parts.push(`<path d="M${x.toFixed(1)} ${(ey + 0.04 * s).toFixed(1)} L${(x - 0.03 * s).toFixed(1)} ${(ey + 0.2 * s).toFixed(1)} Q${x.toFixed(1)} ${(ey + 0.23 * s).toFixed(1)} ${(x + 0.05 * s).toFixed(1)} ${(ey + 0.2 * s).toFixed(1)}" stroke="${sk[2]}" stroke-width="${Math.max(0.8, 0.025 * s).toFixed(1)}" fill="none" opacity="0.8"/>`);
  parts.push(`<path d="M${(x - 0.11 * s).toFixed(1)} ${(ey + 0.33 * s).toFixed(1)} Q${x.toFixed(1)} ${(ey + (o.smile === false ? 0.33 : 0.4) * s).toFixed(1)} ${(x + 0.11 * s).toFixed(1)} ${(ey + 0.33 * s).toFixed(1)}" stroke="#9a4d44" stroke-width="${Math.max(0.9, 0.035 * s).toFixed(1)}" stroke-linecap="round" fill="none"/>`);
  parts.push(`<ellipse cx="${(x - 0.27 * s).toFixed(1)}" cy="${(ey + 0.22 * s).toFixed(1)}" rx="${(0.1 * s).toFixed(1)}" ry="${(0.06 * s).toFixed(1)}" fill="#e58b80" opacity="0.28"/><ellipse cx="${(x + 0.27 * s).toFixed(1)}" cy="${(ey + 0.22 * s).toFixed(1)}" rx="${(0.1 * s).toFixed(1)}" ry="${(0.06 * s).toFixed(1)}" fill="#e58b80" opacity="0.28"/>`);
  // 頭髮（前面）
  const hs = o.hairStyle || 'short';
  if (hs === 'short') {
    parts.push(`<path d="M${hp(-0.46, 0.02)} C${hp(-0.5, -0.5)} ${hp(-0.25, -0.62)} ${hp(0.0, -0.62)} C${hp(0.3, -0.62)} ${hp(0.5, -0.5)} ${hp(0.46, 0.02)} C${hp(0.42, -0.25)} ${hp(0.3, -0.36)} ${hp(0.05, -0.34)} C${hp(-0.2, -0.36)} ${hp(-0.38, -0.28)} ${hp(-0.46, 0.02)}Z" fill="url(#${k}hr)"/>`);
  } else if (hs === 'long' || hs === 'ponytail') {
    parts.push(`<path d="M${hp(-0.46, 0.15)} C${hp(-0.52, -0.5)} ${hp(-0.25, -0.64)} ${hp(0.0, -0.64)} C${hp(0.3, -0.64)} ${hp(0.52, -0.5)} ${hp(0.46, 0.15)} C${hp(0.44, -0.2)} ${hp(0.28, -0.3)} ${hp(0.0, -0.4)} C${hp(-0.25, -0.3)} ${hp(-0.42, -0.2)} ${hp(-0.46, 0.15)}Z" fill="url(#${k}hr)"/>`);
    if (hs === 'ponytail') parts.push(`<path d="M${hp(0.36, -0.4)} C${hp(0.75, -0.45)} ${hp(0.85, 0.1)} ${hp(0.7, 0.9)} C${hp(0.6, 0.2)} ${hp(0.5, -0.1)} ${hp(0.34, -0.25)}Z" fill="url(#${k}hr)"/>`);
  } else if (hs === 'bun') {
    parts.push(`<circle cx="${x.toFixed(1)}" cy="${(y + (hc[1] - 0.68) * s).toFixed(1)}" r="${(0.22 * s).toFixed(1)}" fill="url(#${k}hr)"/>`);
    parts.push(`<path d="M${hp(-0.46, 0.05)} C${hp(-0.5, -0.5)} ${hp(-0.25, -0.62)} ${hp(0.0, -0.62)} C${hp(0.3, -0.62)} ${hp(0.5, -0.5)} ${hp(0.46, 0.05)} C${hp(0.4, -0.28)} ${hp(0.2, -0.4)} ${hp(0.0, -0.4)} C${hp(-0.2, -0.4)} ${hp(-0.4, -0.28)} ${hp(-0.46, 0.05)}Z" fill="url(#${k}hr)"/>`);
  } else if (hs === 'gray') {
    parts.push(`<path d="M${hp(-0.46, 0.02)} C${hp(-0.5, -0.5)} ${hp(-0.25, -0.62)} ${hp(0.0, -0.62)} C${hp(0.3, -0.62)} ${hp(0.5, -0.5)} ${hp(0.46, 0.02)} C${hp(0.4, -0.3)} ${hp(0.1, -0.5)} ${hp(-0.1, -0.44)} C${hp(-0.3, -0.4)} ${hp(-0.42, -0.2)} ${hp(-0.46, 0.02)}Z" fill="url(#${k}hr)"/>`);
  }
  if (o.glasses) parts.push(`<g fill="none" stroke="#2b2b2b" stroke-width="${Math.max(0.8, 0.03 * s).toFixed(1)}"><circle cx="${(x - ex).toFixed(1)}" cy="${ey.toFixed(1)}" r="${(0.14 * s).toFixed(1)}"/><circle cx="${(x + ex).toFixed(1)}" cy="${ey.toFixed(1)}" r="${(0.14 * s).toFixed(1)}"/><path d="M${(x - ex + 0.14 * s).toFixed(1)} ${ey.toFixed(1)} L${(x + ex - 0.14 * s).toFixed(1)} ${ey.toFixed(1)}"/></g>`);
  return parts.join('\n');
}

module.exports = { rng, lin, rad, Scene, shadow, person, shade, SKINS };
