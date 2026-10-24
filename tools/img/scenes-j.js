const { rng, lin, rad, Scene, shadow, person, shade } = require('./lib');
const out = {};

const f1 = (n) => (+n).toFixed(1);
const clouds = (s, list, o = 0.85) => s.add(`<g opacity="${o}" filter="url(#b8)">${list.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff"/>`).join('')}</g>`);
// 背面的人（登山客 / 小孩），x,y = 腳底中心
function backFigure(s, x, y, h, o = {}) {
  const k = s.uid('bf'); const u = h / 100;
  const top = o.top || '#d9553b', pant = o.pant || '#33405a', hair = o.hair || '#2a1b14', skin = o.skin || '#e0a67c';
  s.def(lin(k + 't', 0, 0, 1, 1, [[0, shade(top, 0.2)], [1, shade(top, -0.3)]]));
  s.def(lin(k + 'p', 0, 0, 1, 0, [[0, shade(pant, 0.1)], [1, shade(pant, -0.3)]]));
  const P = [];
  P.push(shadow(x, y + 2, 26 * u, 4 * u, 0.35));
  const sp = o.child ? 0.9 : 1;
  P.push(`<path d="M${f1(x - 9 * u)} ${f1(y - 44 * u)}L${f1(x - 11 * u)} ${f1(y - 2 * u)}" stroke="${shade(pant, -0.15)}" stroke-width="${f1(11 * u)}" stroke-linecap="round"/>`);
  P.push(`<path d="M${f1(x + 9 * u)} ${f1(y - 44 * u)}L${f1(x + 11 * u)} ${f1(y - 2 * u)}" stroke="${pant}" stroke-width="${f1(11 * u)}" stroke-linecap="round"/>`);
  P.push(`<ellipse cx="${f1(x - 11 * u)}" cy="${f1(y)}" rx="${f1(8 * u)}" ry="${f1(4 * u)}" fill="#2a2a2e"/><ellipse cx="${f1(x + 11 * u)}" cy="${f1(y)}" rx="${f1(8 * u)}" ry="${f1(4 * u)}" fill="#2a2a2e"/>`);
  // 手臂（下垂或舉起）
  if (o.armUp) P.push(`<path d="M${f1(x + 17 * u)} ${f1(y - 78 * u)}L${f1(x + 30 * u)} ${f1(y - 98 * u)}L${f1(x + 34 * u)} ${f1(y - 112 * u)}" stroke="${shade(top, -0.15)}" stroke-width="${f1(8 * u)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="${f1(x + 34 * u)}" cy="${f1(y - 114 * u)}" r="${f1(4.5 * u)}" fill="${skin}"/>`);
  P.push(`<path d="M${f1(x - 17 * u)} ${f1(y - 78 * u)}L${f1(x - 20 * u)} ${f1(y - 52 * u)}" stroke="${shade(top, -0.2)}" stroke-width="${f1(8 * u)}" stroke-linecap="round"/><circle cx="${f1(x - 20 * u)}" cy="${f1(y - 48 * u)}" r="${f1(4.5 * u)}" fill="${skin}"/>`);
  // 身體
  P.push(`<path d="M${f1(x - 18 * u)} ${f1(y - 80 * u)}Q${f1(x)} ${f1(y - 88 * u)} ${f1(x + 18 * u)} ${f1(y - 80 * u)}L${f1(x + 15 * u)} ${f1(y - 42 * u)}L${f1(x - 15 * u)} ${f1(y - 42 * u)}Z" fill="url(#${k}t)"/>`);
  if (!o.armUp) P.push(`<path d="M${f1(x + 17 * u)} ${f1(y - 78 * u)}L${f1(x + 20 * u)} ${f1(y - 52 * u)}" stroke="${top}" stroke-width="${f1(8 * u)}" stroke-linecap="round"/><circle cx="${f1(x + 20 * u)}" cy="${f1(y - 48 * u)}" r="${f1(4.5 * u)}" fill="${skin}"/>`);
  if (o.pack) P.push(`<rect x="${f1(x - 15 * u)}" y="${f1(y - 84 * u)}" width="${f1(30 * u)}" height="${f1(40 * u)}" rx="${f1(8 * u)}" fill="${o.pack}"/><rect x="${f1(x - 15 * u)}" y="${f1(y - 84 * u)}" width="${f1(30 * u)}" height="${f1(8 * u)}" rx="${f1(4 * u)}" fill="#fff" opacity="0.2"/><path d="M${f1(x - 15 * u)} ${f1(y - 58 * u)}H${f1(x + 15 * u)}" stroke="#000" opacity="0.2" stroke-width="1.5"/>`);
  // 脖子頭
  P.push(`<rect x="${f1(x - 4 * u)}" y="${f1(y - 90 * u)}" width="${f1(8 * u)}" height="${f1(8 * u)}" fill="${shade(skin, -0.15)}"/>`);
  const hr = (o.child ? 12 : 10.5) * u;
  P.push(`<circle cx="${f1(x)}" cy="${f1(y - 97 * u)}" r="${f1(hr)}" fill="${hair}"/>`);
  if (o.hat === 'cap') P.push(`<path d="M${f1(x - hr)} ${f1(y - 99 * u)}Q${f1(x)} ${f1(y - 117 * u)} ${f1(x + hr)} ${f1(y - 99 * u)}Z" fill="${o.hatCol || '#2f6f9f'}"/>`);
  if (o.hat === 'beanie') P.push(`<path d="M${f1(x - hr - 1)} ${f1(y - 98 * u)}Q${f1(x)} ${f1(y - 124 * u)} ${f1(x + hr + 1)} ${f1(y - 98 * u)}Z" fill="${o.hatCol || '#e8b84a'}"/><circle cx="${f1(x)}" cy="${f1(y - 114 * u)}" r="${f1(3 * u)}" fill="#fff"/>`);
  return P.join('');
}

/* J1 貓 */
out.cat = () => {
  const s = Scene(); const R = rng(101);
  s.def(lin('wall', 0, 0, 0, 1, [[0, '#f0e4d0'], [1, '#d8c6a6']]));
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#8fc6ea'], [1, '#eef3e8']]));
  s.def(lin('hill', 0, 0, 0, 1, [[0, '#6d9a62'], [1, '#a8c58f']]));
  s.def(lin('hill2', 0, 0, 0, 1, [[0, '#8fb0a6'], [1, '#c3d6c9']]));
  s.def(lin('wood', 0, 0, 0, 1, [[0, '#c99a62'], [1, '#9a6c3e']]));
  s.def(lin('woodT', 0, 0, 0, 1, [[0, '#dcb07a'], [1, '#c79a64']]));
  s.def(lin('cush', 0, 0, 0, 1, [[0, '#8fb0c8'], [1, '#6a8ca8']]));
  s.def(lin('cat', 0, 0, 1, 1, [[0, '#e9a05a'], [0.6, '#d68339'], [1, '#b8651f']]));
  s.def(lin('curt', 0, 0, 1, 0, [[0, '#f6efe0'], [0.5, '#fffaf0'], [1, '#e5d8bf']]));
  s.def(rad('glow', 0.5, 0.5, 0.5, [[0, '#fff6d0', 0.7], [1, '#fff6d0', 0]]));
  s.add('<rect width="800" height="600" fill="url(#wall)"/>');
  // 窗外
  s.add('<rect x="110" y="40" width="580" height="400" fill="url(#sky)"/>');
  s.add('<g clip-path="url(#wc)">');
  s.def('<clipPath id="wc"><rect x="110" y="40" width="580" height="400"/></clipPath>');
  clouds(s, [[240, 100, 90, 18], [520, 80, 110, 20], [620, 150, 60, 12]], 0.9);
  s.add('<path d="M100 300L220 230L330 280L450 200L580 270L700 220V440H100Z" fill="url(#hill2)"/>');
  s.add('<path d="M100 340Q250 270 400 330T700 310V440H100Z" fill="url(#hill)"/>');
  // 遠方公寓
  [[150, 290, 46, 90, '#e2d3b8'], [200, 270, 40, 110, '#c9d2d6'], [560, 280, 50, 100, '#d9c8aa'], [612, 300, 44, 80, '#cdd6d4']].forEach(([x, y, w, h, c]) => {
    s.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`);
    for (let r = 0; r < 4; r++) for (let q = 0; q < 2; q++) s.add(`<rect x="${x + 7 + q * 20}" y="${y + 10 + r * 20}" width="12" height="12" fill="#7a97a8" opacity="0.8"/>`);
  });
  // 樹
  s.add('<path d="M470 400L474 330" stroke="#6a4a2c" stroke-width="8"/>');
  [[470, 310, 50], [440, 330, 36], [505, 335, 36]].forEach(([x, y, r]) => s.add(`<circle cx="${x}" cy="${y}" r="${r}" fill="#4f8a3f"/><circle cx="${x - 10}" cy="${y - 10}" r="${r * 0.6}" fill="#6fa853" opacity="0.7"/>`));
  s.add('<circle cx="560" cy="60" r="200" fill="url(#glow)"/>');
  s.add('</g>');
  // 窗框
  s.add('<g fill="none" stroke="#fbf7ee" stroke-width="14"><rect x="110" y="40" width="580" height="400"/><path d="M400 40V440M110 235H690"/></g><g fill="none" stroke="#cdbfa4" stroke-width="2"><rect x="103" y="33" width="594" height="414"/></g>');
  // 窗簾
  s.add('<path d="M40 20H170L160 240Q150 380 170 470L40 470Z" fill="url(#curt)"/><path d="M630 20H770V470L630 470Q650 380 640 240Z" fill="url(#curt)"/>');
  s.add('<g stroke="#bfae8c" stroke-width="2" opacity="0.5" fill="none"><path d="M70 20Q66 250 72 470M100 20Q96 250 104 470M130 20Q126 250 140 470M670 20Q674 250 668 470M705 20Q710 250 702 470M740 20Q744 250 740 470"/></g>');
  s.add('<rect x="30" y="14" width="760" height="12" rx="6" fill="#7a5a3a"/>');
  s.add('<path d="M40 330Q110 350 168 320L168 350Q110 372 40 358Z" fill="#c9a45e"/><path d="M632 320Q690 350 770 330L770 358Q690 372 632 350Z" fill="#c9a45e"/>');
  // 窗台
  s.add('<path d="M40 438H760L790 480H10Z" fill="url(#woodT)"/><rect x="10" y="480" width="780" height="40" fill="url(#wood)"/><path d="M10 480H790" stroke="#e8c898" stroke-width="3"/>');
  s.add('<g stroke="#7a4f2a" stroke-width="1.5" opacity="0.35"><path d="M60 452H740M40 464H760"/></g>');
  s.add('<rect y="520" width="800" height="80" fill="#d2bf9e"/><rect y="520" width="800" height="26" fill="#000" opacity="0.14" filter="url(#b8)"/>');
  // 盆栽
  s.add(shadow(190, 462, 52, 8, 0.35));
  s.add('<path d="M148 410H234L224 462H158Z" fill="#c4683f"/><rect x="144" y="402" width="94" height="14" rx="4" fill="#d9794c"/><path d="M158 416L162 462" stroke="#fff" opacity="0.18" stroke-width="6"/>');
  [[-40, -110, '#3f8a4a'], [-18, -140, '#58a35a'], [6, -150, '#3f8a4a'], [28, -120, '#58a35a'], [48, -90, '#3f8a4a']].forEach(([dx, dy, c]) => s.add(`<path d="M191 404Q${191 + dx * 0.4} ${404 + dy * 0.7} ${191 + dx} ${404 + dy}Q${191 + dx * 0.9 + 16} ${404 + dy * 0.6} 191 404Z" fill="${c}"/>`));
  // 墊子與貓
  s.add(shadow(410, 468, 200, 12, 0.35));
  s.add('<path d="M215 452Q215 422 250 424H575Q610 424 610 452Q610 472 575 474H250Q215 474 215 452Z" fill="url(#cush)"/><path d="M240 430H580" stroke="#fff" opacity="0.3" stroke-width="3"/><circle cx="412" cy="450" r="4" fill="#4f6f8a"/>');
  const body = 'M255 440C236 390 280 340 350 332C420 322 500 328 545 362C578 388 580 428 565 446L270 450Z';
  s.def(`<clipPath id="bc"><path d="${body}"/></clipPath>`);
  s.add(`<path d="${body}" fill="url(#cat)"/>`);
  s.add('<g clip-path="url(#bc)" fill="none" stroke="#9a4f16" stroke-width="9" stroke-linecap="round" opacity="0.55"><path d="M300 345Q312 380 300 430M345 332Q362 380 350 440M395 326Q412 375 400 440M445 326Q460 370 452 420M490 335Q505 362 500 395"/></g>');
  s.add('<path d="M270 372Q330 332 420 332Q500 332 540 360" stroke="#ffd9a0" stroke-width="5" fill="none" opacity="0.7" stroke-linecap="round"/>');
  // 尾巴（繞在身體前面）
  s.add('<path d="M262 436C285 478 380 478 450 452" stroke="#c9742b" stroke-width="26" stroke-linecap="round" fill="none"/><path d="M262 436C285 478 380 478 450 452" stroke="#9a4f16" stroke-width="26" stroke-linecap="round" fill="none" stroke-dasharray="10 22" opacity="0.5"/><path d="M262 436C285 478 380 478 450 452" stroke="#f0b070" stroke-width="5" stroke-linecap="round" fill="none" transform="translate(0 -7)" opacity="0.6"/>');
  s.add('<circle cx="452" cy="452" r="13" fill="#f4e6cf"/>');
  // 頭
  s.add('<path d="M463 380L458 340L505 366Z" fill="#c9742b"/><path d="M468 372L464 350L494 366Z" fill="#f2a6a0"/><path d="M548 376L545 336L498 364Z" fill="#c9742b"/><path d="M542 370L540 350L510 366Z" fill="#f2a6a0"/>');
  s.def(rad('hd', 0.4, 0.35, 0.8, [[0, '#efaa63'], [1, '#c9742b']]));
  s.add('<ellipse cx="503" cy="402" rx="52" ry="44" fill="url(#hd)"/>');
  s.add('<g stroke="#9a4f16" stroke-width="5" stroke-linecap="round" opacity="0.55" fill="none"><path d="M503 362V376M488 364L490 376M518 364L516 376M452 396Q462 398 468 400M452 410Q462 408 468 410M554 396Q544 398 538 400M554 410Q544 408 538 410"/></g>');
  s.add('<ellipse cx="503" cy="418" rx="26" ry="18" fill="#f8ead2"/>');
  s.add('<path d="M475 400Q484 394 493 400M513 400Q522 394 531 400" stroke="#4a2a14" stroke-width="3.2" fill="none" stroke-linecap="round"/>');
  s.add('<path d="M499 410L507 410L503 416Z" fill="#e58a8a"/><path d="M503 416Q499 424 493 422M503 416Q507 424 513 422" stroke="#7a4a3a" stroke-width="1.8" fill="none"/>');
  s.add('<g stroke="#fff" stroke-width="1.4" opacity="0.85"><path d="M478 418L452 412M478 422L452 428M528 418L554 412M528 422L554 428"/></g>');
  s.add('<ellipse cx="472" cy="424" rx="8" ry="5" fill="#f2a6a0" opacity="0.4"/><ellipse cx="534" cy="424" rx="8" ry="5" fill="#f2a6a0" opacity="0.4"/>');
  // 前爪
  s.add('<ellipse cx="478" cy="446" rx="24" ry="12" fill="#f8ead2"/><ellipse cx="528" cy="446" rx="24" ry="12" fill="#f8ead2"/><path d="M470 452V440M482 452V440M520 452V440M532 452V440" stroke="#c9b595" stroke-width="1.5"/>');
  // 陽光暖色
  s.add('<rect width="800" height="600" fill="#ffd9a0" opacity="0.06"/>');
  return s.out();
};

/* J2 小狗 */
out.puppy = () => {
  const s = Scene(); const R = rng(102);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#8cc8f0'], [1, '#e9f3e4']]));
  s.def(lin('gr', 0, 0, 0, 1, [[0, '#8dc060'], [1, '#5d9640']]));
  s.def(lin('gr2', 0, 0, 0, 1, [[0, '#9bcb6c'], [1, '#76ad4c']]));
  s.def(lin('fn', 0, 0, 0, 1, [[0, '#f1e8d6'], [1, '#d3c6a8']]));
  s.def(rad('leaf', 0.35, 0.3, 0.9, [[0, '#8cc25a'], [0.6, '#4f8f35'], [1, '#2e6224']]));
  s.def(lin('dog', 0, 0, 1, 1, [[0, '#f2c883'], [0.6, '#dba458'], [1, '#bb7f35']]));
  s.def(lin('dogL', 0, 0, 1, 0, [[0, '#f6d49a'], [1, '#e0aa62']]));
  s.def(rad('ball', 0.35, 0.3, 0.8, [[0, '#ff7a63'], [0.7, '#e03d34'], [1, '#a82620']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  clouds(s, [[160, 80, 110, 22], [560, 60, 130, 22], [680, 120, 70, 14]]);
  s.add('<g filter="url(#b2)"><ellipse cx="80" cy="330" rx="140" ry="70" fill="#7aa95f"/><ellipse cx="720" cy="335" rx="170" ry="70" fill="#7aa95f"/></g>');
  // 大樹（左）
  s.add('<path d="M130 380Q136 280 126 190L158 190Q150 290 170 380Z" fill="#6a4a2c"/>');
  [[120, 170, 80], [200, 150, 74], [150, 100, 70], [60, 190, 60], [230, 210, 55]].forEach(([x, y, r]) => s.add(`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#leaf)"/>`));
  s.add('<rect y="330" width="800" height="270" fill="url(#gr)"/>');
  // 白色柵欄
  s.add('<rect y="318" width="800" height="12" fill="#e5dcc6"/><rect y="352" width="800" height="10" fill="#e5dcc6"/>');
  for (let i = 0; i < 20; i++) s.add(`<path d="M${i * 44 + 8} 372V316L${i * 44 + 22} 306L${i * 44 + 36} 316V372Z" fill="url(#fn)"/>`);
  s.add('<rect y="368" width="800" height="14" fill="#000" opacity="0.1" filter="url(#b2)"/>');
  // 草地層次
  s.add('<path d="M0 400Q200 380 420 400T800 392V600H0Z" fill="url(#gr2)"/>');
  for (let i = 0; i < 160; i++) { const x = R() * 800, y = 395 + R() * 205, h = 6 + (y - 395) / 12; s.add(`<path d="M${x.toFixed(0)} ${y.toFixed(0)}l${(R() * 6 - 3).toFixed(1)} -${h.toFixed(0)}" stroke="${R() < 0.5 ? '#4d8a35' : '#a5d070'}" stroke-width="1.6" opacity="0.7"/>`); }
  // 小花
  for (let i = 0; i < 30; i++) { const x = R() * 800, y = 410 + R() * 190; const c = ['#fff', '#ffd84a', '#f58ab0'][i % 3]; s.add(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(2 + (y - 400) / 60).toFixed(1)}" fill="${c}"/>`); }
  // 小狗
  const DX = 0;
  s.add(shadow(400, 510, 190, 18, 0.4));
  // 尾巴
  s.add('<path d="M262 395C230 380 214 340 232 310" stroke="#c98d44" stroke-width="22" stroke-linecap="round" fill="none"/><path d="M262 395C230 380 214 340 232 310" stroke="#f0c47e" stroke-width="7" stroke-linecap="round" fill="none" transform="translate(-3 -2)" opacity="0.7"/>');
  // 後遠腿
  s.add('<path d="M318 450L330 505" stroke="#c98d44" stroke-width="26" stroke-linecap="round"/><ellipse cx="335" cy="508" rx="22" ry="10" fill="#e7b872"/>');
  // 前遠腿
  s.add('<path d="M452 440L470 505" stroke="#c98d44" stroke-width="24" stroke-linecap="round"/><ellipse cx="478" cy="508" rx="22" ry="10" fill="#e7b872"/>');
  // 身體
  s.add('<path d="M248 420C244 362 320 336 394 346C456 354 480 384 474 430C468 478 420 486 352 486C288 486 252 470 248 420Z" fill="url(#dog)"/>');
  s.add('<path d="M270 372C320 342 410 340 450 366" stroke="#ffe3b0" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.6"/>');
  s.add('<path d="M300 480C330 490 410 490 460 470" stroke="#a96a28" stroke-width="10" fill="none" opacity="0.25" stroke-linecap="round"/>');
  s.add('<ellipse cx="420" cy="440" rx="50" ry="36" fill="#f6e2bb" opacity="0.8"/>');
  // 後近腿
  s.add('<ellipse cx="305" cy="438" rx="52" ry="44" fill="url(#dog)"/><path d="M300 470L296 510" stroke="#dba458" stroke-width="28" stroke-linecap="round"/><ellipse cx="296" cy="512" rx="26" ry="11" fill="#f3d6a2"/><path d="M288 514V506M298 515V506M308 514V506" stroke="#b98a52" stroke-width="1.5"/>');
  // 前近腿（抬起，朝球）
  s.add('<path d="M440 440L498 478" stroke="#dba458" stroke-width="26" stroke-linecap="round"/><ellipse cx="512" cy="488" rx="22" ry="12" fill="#f3d6a2" transform="rotate(30 512 488)"/>');
  // 項圈
  s.add('<path d="M452 346Q474 378 462 410" stroke="#d9453b" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="470" cy="402" r="9" fill="#f2c94c"/><circle cx="470" cy="402" r="4" fill="#d6a428"/>');
  // 頭
  s.add('<ellipse cx="494" cy="338" rx="56" ry="52" fill="url(#dog)"/>');
  s.add('<ellipse cx="545" cy="362" rx="42" ry="30" fill="url(#dogL)" transform="rotate(14 545 362)"/>');
  s.add('<ellipse cx="548" cy="380" rx="26" ry="14" fill="#f6e2bb" transform="rotate(14 548 380)" opacity="0.6"/>');
  s.add('<path d="M526 372Q548 392 572 380" stroke="#6a3a22" stroke-width="3" fill="none" stroke-linecap="round"/>');
  s.add('<path d="M538 382Q552 410 568 392Q566 384 560 384Z" fill="#f08a8a"/><path d="M552 388Q553 398 558 396" stroke="#d86a6a" stroke-width="2" fill="none"/>');
  s.add('<ellipse cx="580" cy="358" rx="12" ry="9" fill="#2a1a14" transform="rotate(14 580 358)"/><ellipse cx="577" cy="355" rx="4" ry="2.4" fill="#fff" opacity="0.6"/>');
  s.add('<circle cx="522" cy="326" r="9.5" fill="#2a1a14"/><circle cx="525" cy="323" r="3.2" fill="#fff"/><circle cx="520" cy="329" r="1.4" fill="#fff"/><path d="M510 308Q522 302 534 308" stroke="#b98a52" stroke-width="3" fill="none" stroke-linecap="round"/>');
  s.add('<ellipse cx="500" cy="352" rx="8" ry="5" fill="#f2a6a0" opacity="0.4"/>');
  // 耳朵（垂耳）
  s.add('<path d="M462 300C436 306 426 350 444 394C466 396 482 366 484 334C484 314 476 302 462 300Z" fill="#a8672a"/><path d="M466 310C450 316 444 346 454 376" stroke="#c98a48" stroke-width="5" fill="none" opacity="0.6" stroke-linecap="round"/>');
  s.add('<path d="M528 290C548 276 566 288 560 310C550 300 540 296 528 290Z" fill="#b9792f"/>');
  // 球
  s.add(shadow(610, 520, 40, 8, 0.4));
  s.add('<circle cx="610" cy="486" r="34" fill="url(#ball)"/><path d="M580 470Q610 450 640 470M578 500Q612 520 642 498" stroke="#fff" stroke-width="7" fill="none" opacity="0.85"/><path d="M610 452V520" stroke="#ffd84a" stroke-width="6" opacity="0.9"/><ellipse cx="598" cy="472" rx="9" ry="6" fill="#fff" opacity="0.5"/>');
  // 前景草
  for (let i = 0; i < 50; i++) { const x = R() * 800, y = 560 + R() * 40; s.add(`<path d="M${x.toFixed(0)} 600Q${(x + R() * 10 - 5).toFixed(0)} ${y.toFixed(0)} ${(x + R() * 16 - 8).toFixed(0)} ${(y - 18).toFixed(0)}" stroke="${R() < 0.5 ? '#3f7a2c' : '#5f9a3e'}" stroke-width="3" fill="none"/>`); }
  return s.out();
};

/* J3 小鳥 */
out.birds = () => {
  const s = Scene(); const R = rng(103);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#9fd0ef'], [0.6, '#dff0f2'], [1, '#fbe9dc']]));
  s.def(lin('br', 0, 0, 0, 1, [[0, '#8a6a4a'], [1, '#55392a']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  clouds(s, [[200, 90, 130, 24], [620, 130, 110, 20]], 0.8);
  // 遠景虛化綠葉與光斑
  s.add('<g filter="url(#b16)" opacity="0.8"><circle cx="90" cy="480" r="120" fill="#7fb36a"/><circle cx="260" cy="560" r="110" fill="#9cc77c"/><circle cx="640" cy="520" r="140" fill="#82b86c"/><circle cx="780" cy="420" r="100" fill="#a5cf86"/></g>');
  for (let i = 0; i < 14; i++) s.add(`<circle cx="${(R() * 800).toFixed(0)}" cy="${(R() * 260 + 20).toFixed(0)}" r="${(10 + R() * 22).toFixed(0)}" fill="#fff" opacity="${(0.15 + R() * 0.2).toFixed(2)}" filter="url(#b4)"/>`);
  // 樹枝（斜向，右側延伸）
  const branch = 'M-20 470C120 450 260 420 420 408C560 396 680 360 830 300';
  s.add(`<path d="${branch}" stroke="#3d281c" stroke-width="30" stroke-linecap="round" fill="none" opacity="0.4" transform="translate(0 6)" filter="url(#b4)"/>`);
  s.add(`<path d="${branch}" stroke="url(#br)" stroke-width="26" stroke-linecap="round" fill="none"/>`);
  s.add(`<path d="${branch}" stroke="#b08c66" stroke-width="5" stroke-linecap="round" fill="none" transform="translate(0 -8)" opacity="0.6"/>`);
  s.add('<path d="M300 424C320 480 310 520 280 560" stroke="#55392a" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M560 380C600 430 640 450 690 460" stroke="#55392a" stroke-width="8" stroke-linecap="round" fill="none"/>');
  // 葉子
  const leaf = (x, y, a, sc, c) => s.add(`<g transform="translate(${x} ${y}) rotate(${a}) scale(${sc})"><path d="M0 0C14 -20 44 -22 62 0C44 22 14 20 0 0Z" fill="${c}"/><path d="M2 0H56" stroke="#2f6a2f" stroke-width="1.6" opacity="0.5"/></g>`);
  for (let i = 0; i < 22; i++) { const t = R(); const x = 100 + t * 640, y = 460 - t * 150 + (x > 300 ? -(Math.sin(t * 3) * 14) : 0); leaf(x, y, (R() < 0.5 ? -1 : 1) * (40 + R() * 70) + (R() < 0.5 ? 0 : 180), 0.7 + R() * 0.6, ['#58a152', '#6fb85f', '#46904a', '#85c46c'][i % 4]); }
  // 櫻花
  const bloom = (x, y, r) => { let p = ''; for (let i = 0; i < 5; i++) { const a = i * 72 - 90; p += `<ellipse cx="${(x + Math.cos(a * Math.PI / 180) * r * 0.62).toFixed(1)}" cy="${(y + Math.sin(a * Math.PI / 180) * r * 0.62).toFixed(1)}" rx="${(r * 0.52).toFixed(1)}" ry="${(r * 0.45).toFixed(1)}" fill="#f7b7cc" transform="rotate(${a + 90} ${(x + Math.cos(a * Math.PI / 180) * r * 0.62).toFixed(1)} ${(y + Math.sin(a * Math.PI / 180) * r * 0.62).toFixed(1)})"/>`; } return p + `<circle cx="${x}" cy="${y}" r="${(r * 0.22).toFixed(1)}" fill="#e8587f"/><circle cx="${x}" cy="${y}" r="${(r * 0.1).toFixed(1)}" fill="#ffd84a"/>`; };
  [[130, 428, 16], [190, 420, 14], [330, 360, 18], [372, 380, 13], [520, 330, 17], [600, 350, 15], [700, 300, 18], [740, 330, 13], [270, 540, 15], [655, 458, 14], [150, 380, 12]].forEach(([x, y, r]) => s.add(bloom(x, y, r)));
  // 鳥
  const bird = (x, y, sc, flip, c) => {
    const id = s.uid('bd');
    s.def(rad(id + 'b', 0.4, 0.3, 0.9, [[0, c.body[0]], [1, c.body[1]]]));
    s.add(`<g transform="translate(${x} ${y}) scale(${sc * flip} ${sc})">
${shadow(2, 2, 24, 4, 0.25)}
<path d="M-16 -30L-64 -22L-62 -12L-12 -20Z" fill="${c.tail}"/>
<path d="M2 -6V0M10 -6V0" stroke="#7a5a3a" stroke-width="2.6" stroke-linecap="round"/><path d="M-3 0H5M6 0H14" stroke="#7a5a3a" stroke-width="2.4" stroke-linecap="round"/>
<ellipse cx="2" cy="-32" rx="28" ry="24" transform="rotate(-12 2 -32)" fill="url(#${id}b)"/>
<ellipse cx="12" cy="-24" rx="18" ry="14" fill="${c.belly}"/>
<circle cx="22" cy="-56" r="17" fill="url(#${id}b)"/>
<ellipse cx="26" cy="-50" rx="11" ry="8" fill="${c.belly}" opacity="0.85"/>
<path d="M36 -58L50 -53L36 -49Z" fill="${c.beak}"/>
<circle cx="28" cy="-60" r="3.4" fill="#1a1210"/><circle cx="29.2" cy="-61.2" r="1.2" fill="#fff"/>
<circle cx="21" cy="-50" r="4" fill="#ff9a9a" opacity="0.4"/>
<path d="M-18 -38C-4 -52 22 -44 20 -26C4 -20 -14 -24 -18 -38Z" fill="${c.wing}"/>
<path d="M-12 -34C0 -42 14 -38 16 -30" stroke="#fff" stroke-width="1.5" fill="none" opacity="0.4"/>
</g>`);
  };
  bird(250, 428, 1.5, 1, { body: ['#8fb2d4', '#5a7fa6'], belly: '#f6efe0', wing: '#456a92', tail: '#3d5f86', beak: '#e8a02f' });
  bird(410, 410, 1.15, -1, { body: ['#e0a768', '#b97c3c'], belly: '#f7ead2', wing: '#8a5a28', tail: '#7a4a1e', beak: '#7a5a3a' });
  bird(570, 384, 1.0, 1, { body: ['#ffe27a', '#e8b420'], belly: '#fff6c8', wing: '#c99414', tail: '#b88410', beak: '#e8782f' });
  // 飛行的小鳥
  s.add('<path d="M640 120Q660 98 682 118Q664 112 640 120ZM680 118Q702 96 724 114Q704 110 680 118Z" fill="#456a92"/><path d="M130 190Q146 172 164 188Q148 184 130 190ZM162 188Q180 172 196 186Q180 184 162 188Z" fill="#6a7f96" opacity="0.8"/>');
  return s.out();
};

/* J4 森林 */
out.forest = () => {
  const s = Scene(); const R = rng(104);
  s.def(lin('bg', 0, 0, 0, 1, [[0, '#d9ecd0'], [0.5, '#a9cfa0'], [1, '#6e9f66']]));
  s.def(lin('floor', 0, 0, 0, 1, [[0, '#6d9a52'], [1, '#3f6a30']]));
  s.def(lin('path', 0, 0, 0, 1, [[0, '#d9c49a'], [1, '#b39668']]));
  s.def(lin('tr', 0, 0, 1, 0, [[0, '#7a5a3c'], [0.45, '#5e432b'], [1, '#3b2a1c']]));
  s.def(lin('tr2', 0, 0, 1, 0, [[0, '#8b6a48'], [0.5, '#6b4c32'], [1, '#43301f']]));
  s.def(lin('ray', 0, 0, 0, 1, [[0, '#fff7c8', 0.55], [1, '#fff7c8', 0]]));
  s.add('<rect width="800" height="600" fill="url(#bg)"/>');
  // 遠樹與霧
  for (let i = 0; i < 16; i++) { const x = i * 55 + R() * 20, w = 10 + R() * 8; s.add(`<rect x="${x.toFixed(0)}" y="0" width="${w.toFixed(0)}" height="360" fill="#7ea776" opacity="0.5"/>`); }
  s.add('<g filter="url(#b8)" opacity="0.8"><ellipse cx="200" cy="260" rx="260" ry="40" fill="#e8f3df"/><ellipse cx="620" cy="300" rx="260" ry="36" fill="#e8f3df"/></g>');
  // 光束
  [[330, 90], [460, 70], [560, 80], [150, 60]].forEach(([x, w], i) => s.add(`<path d="M${x} 0L${x + w} 0L${x + w * 2.2 - 80} 440L${x - 120 + i * 20} 440Z" fill="url(#ray)" filter="url(#b8)"/>`));
  // 地面
  s.add('<path d="M0 360Q200 340 400 352T800 345V600H0Z" fill="url(#floor)"/>');
  // 中景樹
  [[250, 6, 380, 36], [560, 9, 390, 30], [680, 3, 400, 34]].forEach(([x, , y, w]) => { s.add(`<path d="M${x - w / 2} ${y}L${x - w / 2 + 6} 0H${x + w / 2 - 6}L${x + w / 2} ${y}Z" fill="url(#tr)" opacity="0.85"/>`); s.add(shadow(x, y, w * 0.9, 6, 0.3)); });
  // 小路
  s.add('<path d="M370 352Q420 352 430 352Q520 420 640 520L720 600H150Q300 500 370 352Z" fill="url(#path)"/>');
  s.add('<path d="M370 352Q300 500 150 600" stroke="#8a6f48" stroke-width="3" fill="none" opacity="0.5"/>');
  for (let i = 0; i < 22; i++) { const t = R(); const y = 360 + t * 230; const x = 400 + (t - 0.1) * 40 - t * 20 + (R() - 0.5) * 120 * t; s.add(`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(3 + t * 9).toFixed(1)}" ry="${(1.5 + t * 4).toFixed(1)}" fill="#8a6f48" opacity="0.55"/>`); }
  // 路旁蕨
  const fern = (x, y, sc, c) => { let g = ''; for (let i = 0; i < 9; i++) { const a = -150 + i * 37; const L = (70 + (i % 3) * 14) * sc; const ex = x + Math.cos(a * Math.PI / 180) * L, ey = y + Math.sin(a * Math.PI / 180) * L * 0.9; const mx = (x + ex) / 2 + (i < 4 ? -10 : 10) * sc, my = (y + ey) / 2 - 18 * sc; g += `<path d="M${x} ${y}Q${mx.toFixed(0)} ${my.toFixed(0)} ${ex.toFixed(0)} ${ey.toFixed(0)}" stroke="${c}" stroke-width="${(5 * sc).toFixed(1)}" stroke-linecap="round" fill="none"/>`; g += `<path d="M${x} ${y}Q${mx.toFixed(0)} ${my.toFixed(0)} ${ex.toFixed(0)} ${ey.toFixed(0)}" stroke="#bfe08a" stroke-width="${(1.6 * sc).toFixed(1)}" stroke-linecap="round" fill="none" opacity="0.45"/>`; } s.add(g); };
  fern(330, 440, 1.0, '#3f8a3c'); fern(470, 400, 0.7, '#4d9a46'); fern(600, 490, 1.0, '#3f8a3c'); fern(120, 520, 1.5, '#357a33'); fern(700, 560, 1.6, '#357a33');
  // 登山客（小）
  s.add(backFigure(s, 455, 440, 86, { top: '#e8b84a', pant: '#33405a', pack: '#3a7d9a', hat: 'cap', hatCol: '#d9553b' }));
  // 大石頭
  s.add('<g><ellipse cx="260" cy="470" rx="50" ry="28" fill="#8a8f86"/><ellipse cx="248" cy="458" rx="34" ry="14" fill="#a9afa4"/><ellipse cx="260" cy="470" rx="50" ry="28" fill="#4d6a3a" opacity="0.2"/></g>');
  s.add('<g><ellipse cx="560" cy="440" rx="30" ry="16" fill="#8a8f86"/><ellipse cx="552" cy="433" rx="20" ry="8" fill="#a9afa4"/></g>');
  // 前景大樹（左右）
  s.add('<path d="M-20 600L-10 0H110Q100 300 150 600Z" fill="url(#tr2)"/><path d="M640 600Q690 300 690 0H830V600Z" fill="url(#tr)"/>');
  s.add('<g stroke="#2a1c10" stroke-width="3" opacity="0.35" fill="none"><path d="M30 0Q20 300 50 600M80 0Q74 300 100 600M730 0Q720 300 740 600M780 0Q776 300 790 600"/></g>');
  // 苔蘚與藤
  s.add('<path d="M-10 400Q60 380 110 440Q70 480 -10 470Z" fill="#5a8a3a" opacity="0.8"/><path d="M690 330Q750 320 800 380V470Q740 440 690 400Z" fill="#5a8a3a" opacity="0.8"/>');
  // 樹葉（上方遮蔽）
  const bl = (x, y, a, sc, c) => s.add(`<g transform="translate(${x} ${y}) rotate(${a}) scale(${sc})"><path d="M0 0C30 -34 90 -30 120 0C90 34 30 30 0 0Z" fill="${c}"/><path d="M4 0H112" stroke="#25601f" stroke-width="2" opacity="0.5"/></g>`);
  [[-10, 20, 30, 1.4, '#2f7a34'], [60, 0, 60, 1.2, '#3f8f3e'], [140, -10, 40, 1.1, '#2a6e2f'], [780, 10, 150, 1.5, '#2f7a34'], [700, -5, 120, 1.2, '#3f8f3e'], [620, 5, 130, 1.0, '#2a6e2f'], [20, 90, 20, 1.1, '#3f8f3e'], [790, 100, 170, 1.1, '#3f8f3e']].forEach((a) => bl(...a));
  // 前景蕨與葉
  fern(40, 600, 2.0, '#2c6b2c'); fern(780, 600, 2.1, '#2c6b2c'); fern(160, 600, 1.1, '#3a8a38');
  return s.out();
};

/* J5 瀑布 */
out.waterfall = () => {
  const s = Scene(); const R = rng(105);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#cfe3ea'], [1, '#eef4ee']]));
  s.def(lin('rock', 0, 0, 1, 0, [[0, '#6b7068'], [0.5, '#8a8f84'], [1, '#575c55']]));
  s.def(lin('rock2', 0, 0, 0, 1, [[0, '#7b8076'], [1, '#4c524a']]));
  s.def(lin('fall', 0, 0, 0, 1, [[0, '#f2f8fa'], [1, '#d6e8ee']]));
  s.def(lin('pool', 0, 0, 0, 1, [[0, '#7fc4c0'], [1, '#2f7f86']]));
  s.def(lin('deck', 0, 0, 0, 1, [[0, '#c29866'], [1, '#8a6038']]));
  s.def(rad('leaf', 0.35, 0.3, 0.9, [[0, '#7fbb58'], [0.6, '#3f8a35'], [1, '#235a22']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  // 後山
  s.add('<path d="M0 140Q150 60 300 120T800 90V400H0Z" fill="#8fb4a0" opacity="0.7" filter="url(#b2)"/>');
  // 左右岩壁
  s.add('<path d="M0 0H300L286 120L300 230L280 330L296 420L120 470L0 450Z" fill="url(#rock)"/>');
  s.add('<path d="M800 0H500L516 110L496 220L514 330L494 420L690 470L800 450Z" fill="url(#rock)"/>');
  s.add('<g stroke="#3b3f3a" stroke-width="3" opacity="0.35" fill="none"><path d="M60 40L130 150L90 260L160 380M200 20L240 130L210 250M740 40L670 150L710 260L640 380M600 20L560 130L590 250"/></g>');
  // 苔
  s.add('<path d="M0 150Q80 140 150 190Q100 230 0 240Z" fill="#5f8f45" opacity="0.7"/><path d="M800 160Q720 160 650 210Q700 250 800 250Z" fill="#5f8f45" opacity="0.7"/>');
  // 後方岩壁
  s.add('<rect x="290" y="60" width="220" height="380" fill="url(#rock2)"/>');
  // 瀑布本體
  s.add('<path d="M322 40H478L486 440H314Z" fill="url(#fall)"/>');
  for (let i = 0; i < 16; i++) { const x = 330 + i * 9.6; s.add(`<path d="M${x.toFixed(0)} ${40 + R() * 40}V${300 + R() * 130}" stroke="#fff" stroke-width="${(2 + R() * 3).toFixed(1)}" opacity="${(0.4 + R() * 0.4).toFixed(2)}" stroke-linecap="round"/>`); }
  s.add('<path d="M340 60V430M380 50V440M420 60V430M455 50V440" stroke="#b6d2dc" stroke-width="3" opacity="0.5"/>');
  // 頂部樹
  s.add('<path d="M0 0H800V50Q700 80 600 40Q480 70 400 36Q300 70 200 40Q100 80 0 40Z" fill="#2f6e2f"/>');
  [[60, 30, 60], [180, 40, 56], [300, 28, 54], [520, 30, 56], [650, 36, 62], [760, 28, 54]].forEach(([x, y, r]) => s.add(`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#leaf)"/>`));
  // 池塘
  s.add('<path d="M0 440Q200 420 400 436T800 430V600H0Z" fill="url(#pool)"/>');
  for (let i = 0; i < 40; i++) { const x = R() * 800, y = 450 + R() * 150, w = 10 + R() * 50; s.add(`<path d="M${x.toFixed(0)} ${y.toFixed(0)}h${w.toFixed(0)}" stroke="#fff" stroke-width="1.6" opacity="${(0.2 + R() * 0.3).toFixed(2)}" stroke-linecap="round"/>`); }
  s.add('<ellipse cx="400" cy="446" rx="150" ry="24" fill="#fff" opacity="0.85" filter="url(#b8)"/><ellipse cx="400" cy="440" rx="100" ry="40" fill="#fff" opacity="0.5" filter="url(#b16)"/>');
  // 泡沫
  for (let i = 0; i < 24; i++) s.add(`<circle cx="${(300 + R() * 200).toFixed(0)}" cy="${(436 + R() * 30).toFixed(0)}" r="${(3 + R() * 7).toFixed(0)}" fill="#fff" opacity="0.8"/>`);
  // 水霧與彩虹
  s.add('<path d="M380 400Q500 250 640 360" stroke="#ff7a7a" stroke-width="5" fill="none" opacity="0.28" filter="url(#b2)"/><path d="M384 406Q500 262 632 366" stroke="#ffd84a" stroke-width="5" fill="none" opacity="0.28" filter="url(#b2)"/><path d="M388 412Q500 274 624 372" stroke="#6fc8f0" stroke-width="5" fill="none" opacity="0.28" filter="url(#b2)"/>');
  s.add('<ellipse cx="400" cy="400" rx="170" ry="70" fill="#fff" opacity="0.35" filter="url(#b16)"/>');
  // 池邊石頭
  [[110, 470, 80, 36], [250, 456, 54, 22], [560, 462, 62, 26], [690, 478, 90, 36]].forEach(([x, y, rx, ry]) => s.add(`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#7d8278"/><ellipse cx="${x - rx * 0.2}" cy="${y - ry * 0.35}" rx="${rx * 0.7}" ry="${ry * 0.5}" fill="#a2a89b"/><ellipse cx="${x}" cy="${y + ry * 0.7}" rx="${rx * 1.05}" ry="${ry * 0.3}" fill="#fff" opacity="0.35"/>`));
  // 木棧道與欄杆
  s.add(shadow(180, 590, 190, 14, 0.3));
  s.add('<path d="M0 520H300L380 600H0Z" fill="url(#deck)"/><g stroke="#4a2f18" stroke-width="2" opacity="0.4"><path d="M0 545H322M0 572H350M60 520L40 600M140 520L130 600M220 520L220 600"/></g>');
  s.add('<g stroke="#6a4424" stroke-width="10" stroke-linecap="round"><path d="M10 420V530M120 420V530M230 420V530M330 420V526"/></g><path d="M0 430H340" stroke="#8a5e34" stroke-width="12"/><path d="M0 470H336" stroke="#8a5e34" stroke-width="7"/>');
  s.add(backFigure(s, 178, 522, 120, { top: '#4a8f6a', pant: '#4a4f5e', pack: '#e8b84a', hat: 'cap', hatCol: '#f2f2ee', armUp: true }));
  // 前景葉
  const bl = (x, y, a, sc, c) => s.add(`<g transform="translate(${x} ${y}) rotate(${a}) scale(${sc})"><path d="M0 0C30 -34 90 -30 120 0C90 34 30 30 0 0Z" fill="${c}"/><path d="M4 0H112" stroke="#25601f" stroke-width="2" opacity="0.5"/></g>`);
  [[820, 560, 200, 1.6, '#2f7a34'], [790, 600, 215, 1.4, '#3f8f3e'], [720, 600, 230, 1.3, '#2a6e2f'], [-20, 40, 20, 1.5, '#2f7a34'], [830, 30, 160, 1.4, '#2f7a34']].forEach((a) => bl(...a));
  return s.out();
};

/* J6 山頂日出 */
out.sunrise = () => {
  const s = Scene(); const R = rng(106);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#4a5f9a'], [0.35, '#c58aa8'], [0.62, '#ffb070'], [0.8, '#ffe2a0']]));
  s.def(rad('sun', 0.5, 0.5, 0.5, [[0, '#fffbe0', 1], [0.25, '#ffe6a0', 0.8], [1, '#ffb070', 0]]));
  s.def(lin('sea', 0, 0, 0, 1, [[0, '#ffe3bd'], [0.5, '#f4c2b0'], [1, '#a98fb5']]));
  s.def(lin('far', 0, 0, 0, 1, [[0, '#8a6f9c'], [1, '#c58f9c']]));
  s.def(lin('rk', 0, 0, 1, 1, [[0, '#8a6a58'], [0.5, '#5f4a44'], [1, '#34282b']]));
  s.def(lin('rk2', 0, 0, 1, 0, [[0, '#caa078'], [0.15, '#8a6a58'], [1, '#3a2c2e']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  // 星星（淡）
  for (let i = 0; i < 24; i++) s.add(`<circle cx="${(R() * 800).toFixed(0)}" cy="${(R() * 130).toFixed(0)}" r="${(0.8 + R() * 1.2).toFixed(1)}" fill="#fff" opacity="${(0.3 + R() * 0.4).toFixed(2)}"/>`);
  // 太陽
  s.add('<circle cx="470" cy="340" r="260" fill="url(#sun)"/>');
  s.add('<circle cx="470" cy="340" r="52" fill="#fff6d0"/><circle cx="470" cy="340" r="44" fill="#fffbe8"/>');
  clouds(s, [[150, 180, 140, 16], [640, 150, 160, 14], [420, 230, 120, 10], [720, 260, 100, 10]], 0.6);
  s.add('<g opacity="0.35"><path d="M470 340L200 0M470 340L330 0M470 340L470 0M470 340L620 0M470 340L760 0" stroke="#fff4c8" stroke-width="30" filter="url(#b16)"/></g>');
  // 遠山
  s.add('<path d="M0 380L90 340L170 372L260 330L330 372V420H0Z" fill="url(#far)" opacity="0.8"/><path d="M560 380L650 334L730 366L800 340V420H560Z" fill="url(#far)" opacity="0.8"/>');
  // 雲海
  s.add('<rect y="372" width="800" height="230" fill="url(#sea)"/>');
  const cl = (y, op, n, h) => { for (let i = 0; i < n; i++) { const x = R() * 900 - 50, w = 90 + R() * 150; s.add(`<ellipse cx="${x.toFixed(0)}" cy="${y + R() * 16}" rx="${w.toFixed(0)}" ry="${(h * (0.6 + R() * 0.6)).toFixed(0)}" fill="#fff" opacity="${op}" filter="url(#b8)"/>`); } };
  cl(385, 0.65, 8, 14); cl(425, 0.7, 8, 20); cl(470, 0.75, 7, 26);
  // 雲海中冒出的山頭
  s.add('<path d="M120 440L200 380L280 440Z" fill="#6f5a86" opacity="0.8"/><path d="M600 450L690 390L780 450Z" fill="#6f5a86" opacity="0.8"/>');
  cl(450, 0.8, 6, 20);
  // 山頂岩石
  s.add('<path d="M0 600V470Q60 450 140 462Q260 470 330 520Q380 560 420 600Z" fill="url(#rk2)"/>');
  s.add('<path d="M800 600V500Q760 470 700 480Q620 490 580 540Q560 570 540 600Z" fill="url(#rk)"/>');
  s.add('<path d="M60 462Q120 450 190 470" stroke="#ffd29a" stroke-width="3" fill="none" opacity="0.7"/><path d="M650 484Q700 476 740 484" stroke="#ffd29a" stroke-width="3" fill="none" opacity="0.5"/>');
  // 石標
  s.add('<path d="M230 480L238 440H292L300 480Z" fill="#7a6458"/><path d="M230 480L238 440H252L246 480Z" fill="#c29a78" opacity="0.8"/><rect x="246" y="452" width="40" height="14" fill="#f2e8d4" opacity="0.8"/>');
  // 登山客（背面，看日出）
  s.add(backFigure(s, 330, 560, 190, { top: '#c9553b', pant: '#2f3a52', pack: '#2f6f8f', hat: 'beanie', hatCol: '#e8b84a', armUp: true }));
  // 邊緣暖光
  s.add('<rect width="800" height="600" fill="#ffb070" opacity="0.07"/>');
  return s.out();
};

/* J7 河邊 */
out.riverside = () => {
  const s = Scene(); const R = rng(107);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#9ccbea'], [0.6, '#f4e8d2'], [1, '#fbd8b0']]));
  s.def(lin('wat', 0, 0, 0, 1, [[0, '#a8cfd4'], [0.6, '#6aa0b0'], [1, '#3f7c92']]));
  s.def(lin('gr', 0, 0, 0, 1, [[0, '#8fc064'], [1, '#5b9140']]));
  s.def(lin('walk', 0, 0, 0, 1, [[0, '#d8ccb4'], [1, '#b8aa90']]));
  s.def(rad('leaf', 0.35, 0.3, 0.9, [[0, '#a2d06a'], [0.6, '#5f9a3a'], [1, '#33692a']]));
  s.def(rad('sun', 0.5, 0.5, 0.5, [[0, '#fff2c0', 0.9], [1, '#fff2c0', 0]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="600" cy="230" r="200" fill="url(#sun)"/>');
  clouds(s, [[140, 90, 120, 18], [380, 60, 100, 14], [650, 100, 110, 16]], 0.8);
  // 遠山
  s.add('<path d="M0 260L120 200L220 250L340 190L460 250L580 210L700 250L800 220V290H0Z" fill="#9db8c6" opacity="0.8" filter="url(#b2)"/>');
  // 對岸城市
  [[40, 240, 40, 60, '#d7cbb4'], [90, 226, 36, 74, '#c2ccd0'], [136, 244, 48, 56, '#e2d4b8'], [560, 232, 44, 68, '#cdd5d6'], [610, 246, 50, 54, '#dccfb2'], [666, 224, 40, 76, '#c8d0d2'], [712, 242, 52, 58, '#d9cbae']].forEach(([x, y, w, h, c]) => {
    s.add(`<rect x="${x}" y="${y}" width="${w}" height="${h + 20}" fill="${c}"/>`);
    for (let r = 0; r < Math.floor(h / 16); r++) for (let q = 0; q < Math.floor(w / 14); q++) s.add(`<rect x="${x + 5 + q * 13}" y="${y + 6 + r * 15}" width="7" height="8" fill="#7894a6" opacity="0.7"/>`);
  });
  s.add('<g filter="url(#b2)"><ellipse cx="300" cy="298" rx="120" ry="26" fill="#6f9f55"/><ellipse cx="480" cy="296" rx="100" ry="22" fill="#6f9f55"/></g>');
  // 河
  s.add('<rect y="288" width="800" height="150" fill="url(#wat)"/>');
  // 橋
  s.add('<rect x="120" y="268" width="520" height="14" fill="#cfc7b6"/><rect x="120" y="262" width="520" height="6" fill="#e8e0cf"/>');
  for (let i = 0; i < 6; i++) { const x = 160 + i * 90; s.add(`<rect x="${x}" y="282" width="14" height="30" fill="#b9b19f"/><rect x="${x - 4}" y="310" width="22" height="6" fill="#a59d8b"/><path d="M${x + 7} 316V360" stroke="#fff" opacity="0.35" stroke-width="6" filter="url(#b2)"/>`); }
  s.add('<path d="M120 282Q380 250 640 282" stroke="#fff" stroke-width="0" fill="none"/>');
  // 水面倒影與波紋
  s.add('<ellipse cx="600" cy="330" rx="140" ry="10" fill="#fff6d0" opacity="0.6" filter="url(#b4)"/>');
  for (let i = 0; i < 40; i++) { const x = R() * 800, y = 300 + R() * 135, w = 12 + R() * 60; s.add(`<path d="M${x.toFixed(0)} ${y.toFixed(0)}h${w.toFixed(0)}" stroke="#fff" stroke-width="${(1 + (y - 300) / 80).toFixed(1)}" opacity="${(0.18 + R() * 0.3).toFixed(2)}" stroke-linecap="round"/>`); }
  // 白鷺鷥（水中）
  const egret = (x, y, sc, flip) => s.add(`<g transform="translate(${x} ${y}) scale(${sc * flip} ${sc})">
<ellipse cx="0" cy="2" rx="22" ry="5" fill="#fff" opacity="0.5"/>
<path d="M-4 -34V0M6 -34V-2" stroke="#2a2a2a" stroke-width="2.6" stroke-linecap="round"/>
<path d="M-30 -52C-20 -30 0 -26 18 -38C26 -48 20 -64 4 -62C-12 -62 -24 -64 -30 -52Z" fill="#fbfbf6"/>
<path d="M-26 -52C-18 -40 -4 -38 6 -44" stroke="#dfe3d8" stroke-width="3" fill="none"/>
<path d="M14 -56C26 -66 30 -88 40 -96" stroke="#fbfbf6" stroke-width="7" stroke-linecap="round" fill="none"/>
<circle cx="42" cy="-100" r="8" fill="#fbfbf6"/><path d="M48 -101L72 -96L48 -96Z" fill="#e8a82a"/><circle cx="44" cy="-102" r="1.8" fill="#1a1a1a"/>
<path d="M-26 -58L-44 -64L-34 -52Z" fill="#fff"/>
</g>`);
  egret(250, 405, 1.0, 1); egret(460, 380, 0.65, -1);
  // 對岸草堤
  s.add('<path d="M0 430Q200 420 400 428T800 420V600H0Z" fill="url(#gr)"/>');
  // 柳樹（左）
  s.add('<path d="M96 470Q108 380 92 300L120 300Q116 390 140 470Z" fill="#6a4a2c"/>');
  s.add('<g filter="url(#b2)"><ellipse cx="108" cy="290" rx="100" ry="50" fill="url(#leaf)"/></g>');
  for (let i = 0; i < 28; i++) { const x = 20 + i * 7.5 + R() * 4, y0 = 300 + R() * 30, L = 90 + R() * 90; s.add(`<path d="M${x.toFixed(0)} ${y0.toFixed(0)}Q${(x + (R() - 0.3) * 18).toFixed(0)} ${(y0 + L / 2).toFixed(0)} ${(x + (R() - 0.5) * 14).toFixed(0)} ${(y0 + L).toFixed(0)}" stroke="${R() < 0.5 ? '#6fa845' : '#8cc05a'}" stroke-width="2.4" fill="none" opacity="0.9"/>`); }
  // 步道
  s.add('<path d="M0 500Q260 480 520 496Q700 506 800 500V600H0Z" fill="url(#walk)"/><path d="M0 500Q260 480 520 496Q700 506 800 500" stroke="#f1e8d4" stroke-width="5" fill="none"/>');
  s.add('<path d="M0 548Q400 528 800 548" stroke="#fff" stroke-width="3" stroke-dasharray="40 30" opacity="0.7" fill="none"/>');
  // 草與花
  for (let i = 0; i < 90; i++) { const x = R() * 800, y = 436 + R() * 56; s.add(`<path d="M${x.toFixed(0)} ${y.toFixed(0)}l${(R() * 6 - 3).toFixed(1)} -9" stroke="#3f7a2c" stroke-width="1.8" opacity="0.7"/>`); }
  for (let i = 0; i < 24; i++) s.add(`<circle cx="${(R() * 800).toFixed(0)}" cy="${(440 + R() * 50).toFixed(0)}" r="2.6" fill="${['#fff', '#ffd84a', '#f58ab0'][i % 3]}"/>`);
  // 長椅
  s.add(shadow(570, 500, 90, 8, 0.35));
  s.add('<g><rect x="500" y="440" width="140" height="10" rx="3" fill="#a77a48"/><rect x="500" y="456" width="140" height="10" rx="3" fill="#a77a48"/><rect x="500" y="472" width="140" height="12" rx="3" fill="#c0925c"/><rect x="508" y="480" width="10" height="26" fill="#444"/><rect x="622" y="480" width="10" height="26" fill="#444"/><rect x="506" y="446" width="6" height="40" fill="#444"/><rect x="628" y="446" width="6" height="40" fill="#444"/></g>');
  // 散步的人
  s.add(person(s, { x: 400, y: 380, h: 215, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#e8c26a', bottom: '#3a4f78', pose: 'down', legs: 'walk', sleeve: 'short', shoe: '#f2f2f2' }));
  // 前景蘆草
  for (let i = 0; i < 24; i++) { const x = 640 + R() * 170, h = 90 + R() * 120, lean = (R() - 0.5) * 36; s.add(`<path d="M${x.toFixed(0)} 600Q${(x + lean / 2).toFixed(0)} ${(600 - h / 2).toFixed(0)} ${(x + lean).toFixed(0)} ${(600 - h).toFixed(0)}" stroke="${R() < 0.5 ? '#6f8a3c' : '#8aa04c'}" stroke-width="3" fill="none"/>`); if (R() < 0.35) s.add(`<ellipse cx="${(x + lean).toFixed(0)}" cy="${(600 - h).toFixed(0)}" rx="5" ry="15" fill="#d9c8a0"/>`); }
  return s.out();
};

/* J8 稻田 */
out.ricefield = () => {
  const s = Scene(); const R = rng(108);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#8fc6ea'], [0.6, '#e6f1ea'], [1, '#f6efd8']]));
  s.def(lin('m1', 0, 0, 0, 1, [[0, '#7f9fb0'], [1, '#b8cdc9']]));
  s.def(lin('m2', 0, 0, 0, 1, [[0, '#5f8a70'], [1, '#9bbba0']]));
  s.def(lin('pd', 0, 0, 0, 1, [[0, '#a9d46a'], [1, '#6faa38']]));
  s.def(lin('pd2', 0, 0, 0, 1, [[0, '#8fc84e'], [1, '#4f9a2c']]));
  s.def(lin('ridge', 0, 0, 0, 1, [[0, '#d9c8a0'], [1, '#a99468']]));
  s.def(rad('sun', 0.5, 0.5, 0.5, [[0, '#fff6d4', 0.9], [1, '#fff6d4', 0]]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/><circle cx="620" cy="130" r="180" fill="url(#sun)"/>');
  clouds(s, [[150, 80, 130, 20], [420, 50, 100, 14], [660, 90, 90, 16]], 0.85);
  s.add('<path d="M0 250L100 160L180 215L290 130L400 220L520 150L640 230L760 170L800 200V300H0Z" fill="url(#m1)"/>');
  s.add('<path d="M0 290L130 230L250 280L380 226L520 288L660 240L800 285V330H0Z" fill="url(#m2)" filter="url(#b2)"/>');
  s.add('<g filter="url(#b8)" opacity="0.8"><ellipse cx="200" cy="270" rx="200" ry="22" fill="#fff"/><ellipse cx="620" cy="285" rx="200" ry="20" fill="#fff"/></g>');
  // 遠處農舍與樹
  s.add('<g><rect x="670" y="300" width="50" height="26" fill="#e8dcc0"/><path d="M662 302L695 280L728 302Z" fill="#b5503c"/><rect x="688" y="310" width="14" height="16" fill="#6a4a2c"/></g>');
  [[610, 312, 24], [640, 316, 20], [150, 312, 26], [182, 318, 20]].forEach(([x, y, r]) => s.add(`<circle cx="${x}" cy="${y}" r="${r}" fill="#3f7a35"/><circle cx="${x - 6}" cy="${y - 6}" r="${r * 0.6}" fill="#5f9a48" opacity="0.7"/>`));
  // 梯田層次（由遠到近）
  const bands = [[326, 0.7], [352, 0.8], [384, 0.9], [424, 1], [474, 1.1], [540, 1.2]];
  bands.forEach(([y, k], i) => {
    const y2 = i < bands.length - 1 ? bands[i + 1][0] : 620;
    const amp = 14 + i * 4;
    s.add(`<path d="M0 ${y}Q200 ${y - amp} 400 ${y + 4}T800 ${y - 6}V${y2 + 10}H0Z" fill="url(#${i % 2 ? 'pd2' : 'pd'})"/>`);
    // 田埂
    s.add(`<path d="M0 ${y}Q200 ${y - amp} 400 ${y + 4}T800 ${y - 6}" stroke="#d6c496" stroke-width="${(3 + i * 1.2).toFixed(1)}" fill="none"/><path d="M0 ${y + 3 + i}Q200 ${y - amp + 3 + i} 400 ${y + 7 + i}T800 ${y - 3 + i}" stroke="#7a6a44" stroke-width="${(1.5 + i * 0.5).toFixed(1)}" fill="none" opacity="0.5"/>`);
    // 水光
    s.add(`<ellipse cx="${200 + i * 90}" cy="${y + 10 + i * 5}" rx="${60 + i * 10}" ry="${4 + i}" fill="#fff" opacity="0.18"/>`);
    // 稻株
    const n = 40 + i * 12;
    for (let j = 0; j < n; j++) { const x = R() * 800, yy = y + 6 + R() * (y2 - y - 4), h = 8 + i * 3 + R() * 6; s.add(`<path d="M${x.toFixed(0)} ${yy.toFixed(0)}l${(R() * 4 - 2).toFixed(1)} -${h.toFixed(0)}M${(x + 3).toFixed(0)} ${yy.toFixed(0)}l${(R() * 6 - 3).toFixed(1)} -${(h * 0.8).toFixed(0)}" stroke="${R() < 0.5 ? '#c8e87a' : '#5d9a2e'}" stroke-width="${(1 + i * 0.25).toFixed(1)}" opacity="0.85"/>`); }
  });
  // 田埂小路（由前景延伸至遠方）
  s.add('<path d="M330 330L370 330L560 600H110Z" fill="url(#ridge)" opacity="0.95"/><path d="M330 330L110 600" stroke="#7a6a44" stroke-width="2" opacity="0.5"/><path d="M370 330L560 600" stroke="#7a6a44" stroke-width="2" opacity="0.5"/>');
  for (let i = 0; i < 40; i++) { const t = R(); const y = 340 + t * 250; const xm = 350 + t * 0.9 * (335 - 350 + 140) - t * 40; s.add(`<ellipse cx="${(xm + (R() - 0.5) * 180 * t).toFixed(0)}" cy="${y.toFixed(0)}" rx="${(2 + t * 8).toFixed(1)}" ry="${(1 + t * 3).toFixed(1)}" fill="#8a7a54" opacity="0.5"/>`); }
  // 稻草人
  const sx = 640, sy = 470;
  s.add(shadow(sx + 6, sy + 70, 40, 7, 0.35));
  s.add(`<path d="M${sx} ${sy - 40}V${sy + 70}" stroke="#7a5a38" stroke-width="7" stroke-linecap="round"/><path d="M${sx - 52} ${sy - 12}H${sx + 52}" stroke="#7a5a38" stroke-width="7" stroke-linecap="round"/>`);
  s.add(`<path d="M${sx - 20} ${sy - 18}L${sx - 24} ${sy + 24}H${sx + 24}L${sx + 20} ${sy - 18}Z" fill="#c9553b"/><path d="M${sx - 56} ${sy - 14}H${sx - 20}V${sy + 4}H${sx - 54}ZM${sx + 20} ${sy - 14}H${sx + 56}V${sy + 4}H${sx + 54}Z" fill="#c9553b"/><path d="M${sx - 54} ${sy + 4}l-3 12M${sx - 46} ${sy + 4}l0 14M${sx + 54} ${sy + 4}l3 12M${sx + 46} ${sy + 4}l0 14" stroke="#e8c870" stroke-width="2.5"/>`);
  s.add(`<circle cx="${sx}" cy="${sy - 40}" r="19" fill="#ecd9a8"/><circle cx="${sx - 7}" cy="${sy - 42}" r="2.4" fill="#222"/><circle cx="${sx + 7}" cy="${sy - 42}" r="2.4" fill="#222"/><path d="M${sx - 7} ${sy - 32}Q${sx} ${sy - 27} ${sx + 7} ${sy - 32}" stroke="#7a3a2a" stroke-width="2" fill="none"/>`);
  s.add(`<path d="M${sx - 46} ${sy - 52}Q${sx} ${sy - 96} ${sx + 46} ${sy - 52}Z" fill="#d9b66a"/><path d="M${sx - 30} ${sy - 62}L${sx - 40} ${sy - 54}M${sx} ${sy - 76}V${sy - 56}M${sx + 30} ${sy - 62}L${sx + 40} ${sy - 54}" stroke="#a88540" stroke-width="2"/>`);
  // 農夫（手持稻束、斗笠）
  const fx = 290, fy = 420;
  s.add(person(s, { x: fx, y: fy, h: 300, skin: 'tan', hair: '#2a1b14', hairStyle: 'short', top: '#4f7f9a', bottom: '#4a4034', pose: 'hold', legs: 'stand', shoe: '#3a3a3a', sleeve: 'long' }));
  const hs = 300 / 7;
  s.add(`<path d="M${f1(fx - 1.05 * hs)} ${f1(fy - 0.78 * hs)}Q${fx} ${f1(fy - 1.95 * hs)} ${f1(fx + 1.05 * hs)} ${f1(fy - 0.78 * hs)}Q${fx} ${f1(fy - 0.62 * hs)} ${f1(fx - 1.05 * hs)} ${f1(fy - 0.78 * hs)}Z" fill="#e0c078"/><path d="M${f1(fx - 0.85 * hs)} ${f1(fy - 0.9 * hs)}Q${fx} ${f1(fy - 1.4 * hs)} ${f1(fx + 0.85 * hs)} ${f1(fy - 0.9 * hs)}" stroke="#b8943f" stroke-width="2" fill="none"/><path d="M${f1(fx - 0.4 * hs)} ${f1(fy - 0.7 * hs)}Q${fx} ${f1(fy - 0.5 * hs)} ${f1(fx + 0.4 * hs)} ${f1(fy - 0.7 * hs)}" stroke="#c9553b" stroke-width="2" fill="none"/>`);
  // 手上的稻穗束
  s.add(`<path d="M${fx - 24} ${fy + 12 * hs / 7 + 70}L${fx - 14} ${fy + 86}" stroke="#b8943f" stroke-width="4"/>`);
  for (let i = 0; i < 9; i++) s.add(`<path d="M${fx - 18 + i * 2} ${fy + 96}Q${fx - 26 + i * 6} ${fy + 60} ${fx - 40 + i * 9} ${fy + 38}" stroke="#d9b94a" stroke-width="2.6" fill="none" stroke-linecap="round"/><ellipse cx="${fx - 40 + i * 9}" cy="${fy + 38}" rx="3" ry="7" fill="#e8c850"/>`);
  // 前景稻
  for (let i = 0; i < 70; i++) { const x = R() * 800, h = 40 + R() * 50; s.add(`<path d="M${x.toFixed(0)} 604Q${(x + R() * 16 - 8).toFixed(0)} ${(604 - h / 2).toFixed(0)} ${(x + R() * 30 - 15).toFixed(0)} ${(604 - h).toFixed(0)}" stroke="${R() < 0.5 ? '#6faa38' : '#a9d46a'}" stroke-width="3" fill="none" stroke-linecap="round"/>`); }
  // 白鷺鷥飛
  s.add('<path d="M470 150Q486 134 504 148Q488 146 470 150ZM504 148Q522 134 540 150Q522 144 504 148Z" fill="#fff"/>');
  return s.out();
};

/* J9 花田 */
out.flowerfield = () => {
  const s = Scene(); const R = rng(109);
  s.def(lin('sky', 0, 0, 0, 1, [[0, '#79bdee'], [0.7, '#d5ebf5'], [1, '#f8f1dc']]));
  s.def(lin('m1', 0, 0, 0, 1, [[0, '#7f9fb8'], [1, '#b9cfd2']]));
  s.def(lin('m2', 0, 0, 0, 1, [[0, '#5f8f6a'], [1, '#a2c498']]));
  s.def(lin('gr', 0, 0, 0, 1, [[0, '#7fb653'], [1, '#4d8a35']]));
  s.def(lin('pth', 0, 0, 0, 1, [[0, '#e0d0a8'], [1, '#bda97c']]));
  s.add('<rect width="800" height="600" fill="url(#sky)"/>');
  clouds(s, [[170, 80, 130, 22], [520, 60, 120, 18], [700, 130, 80, 14]], 0.9);
  s.add('<path d="M0 260L110 180L200 230L320 150L450 240L560 190L680 250L800 200V320H0Z" fill="url(#m1)"/>');
  s.add('<path d="M0 300L150 245L290 290L430 240L570 292L700 250L800 290V340H0Z" fill="url(#m2)" filter="url(#b2)"/>');
  s.add('<rect y="318" width="800" height="290" fill="url(#gr)"/>');
  // 花田色帶（遠）
  const bands = [[330, '#f2c8d8'], [346, '#fff'], [364, '#f7a8c4'], [386, '#ffd84a'], [412, '#f58ab0']];
  bands.forEach(([y, c], i) => { const y2 = bands[i + 1] ? bands[i + 1][0] : 440; s.add(`<path d="M0 ${y}Q300 ${y - 8} 800 ${y + 2}V${y2 + 4}H0Z" fill="${c}" opacity="0.55"/>`); });
  // 遠處風車
  s.add('<g transform="translate(120 290)"><path d="M0 0L-6 40H6Z" fill="#f0ece0"/><g stroke="#f4f0e4" stroke-width="4" stroke-linecap="round"><path d="M0 0L-4 -34M0 0L34 8M0 0L-26 22"/></g><circle r="3.5" fill="#d9553b"/></g>');
  // 花朵函數
  const cols = ['#f58ab0', '#fff', '#f7a8c4', '#e8588a', '#ffd84a', '#c26ad8'];
  cols.forEach((c, i) => { let p = ''; for (let k = 0; k < 8; k++) p += `<ellipse cx="0" cy="-0.55" rx="0.3" ry="0.55" fill="${c}" transform="rotate(${k * 45})"/>`; s.def(`<g id="cs${i}">${p}<circle r="0.22" fill="#f6c73a"/></g>`); });
  const cosmos = (x, y, r, c) => `<use href="#cs${Math.max(0, cols.indexOf(c))}" transform="translate(${x} ${y}) scale(${f1(r)})"/>`;
  const stems = [];
  // 中景大量小花
  for (let i = 0; i < 260; i++) { const t = R(); const y = 340 + t * 150; const x = R() * 800; const r = 4 + t * 9; const c = ['#f58ab0', '#fff', '#f7a8c4', '#e8588a', '#ffd84a'][Math.floor(R() * 5)]; s.add(`<path d="M${x.toFixed(0)} ${(y + r * 2.2).toFixed(0)}V${y.toFixed(0)}" stroke="#4f8a35" stroke-width="1.5"/>` + cosmos(+x.toFixed(0), +y.toFixed(0), r, c)); }
  // 前景大花
  const front = (n0, n1) => { for (let i = n0; i < n1; i++) { const side = i % 2 ? 1 : -1; let x = side < 0 ? R() * 800 : R() * 800; const y = 490 + R() * 100; const r = 16 + R() * 18; const c = ['#f58ab0', '#fff', '#f7a8c4', '#e8588a', '#ffd84a', '#c26ad8'][Math.floor(R() * 6)]; s.add(`<path d="M${x.toFixed(0)} 610Q${(x + R() * 20 - 10).toFixed(0)} ${(y + 40).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)}" stroke="#3f7a2c" stroke-width="3.2" fill="none"/><ellipse cx="${(x + 10).toFixed(0)}" cy="${(y + 50).toFixed(0)}" rx="12" ry="4" fill="#4f9a3a" transform="rotate(-20 ${(x + 10).toFixed(0)} ${(y + 50).toFixed(0)})"/>` + cosmos(+x.toFixed(0), +y.toFixed(0), r, c)); } };
  front(0, 30);
  // 小女孩（草帽）
  const px = 430, py = 440;
  s.add(person(s, { x: px, y: py, h: 190, skin: 'light', hair: '#2a1b14', hairStyle: 'ponytail', top: '#ffffff', bottom: '#e8588a', dress: true, legs: 'stand', pose: 'hold', sleeve: 'short', shoe: '#c9553b' }));
  const hs = 190 / 7;
  s.add(`<ellipse cx="${px}" cy="${f1(py - 0.95 * hs)}" rx="${f1(1.15 * hs)}" ry="${f1(0.3 * hs)}" fill="#ecd08a"/><path d="M${f1(px - 0.55 * hs)} ${f1(py - 0.98 * hs)}Q${px} ${f1(py - 1.75 * hs)} ${f1(px + 0.55 * hs)} ${f1(py - 0.98 * hs)}Z" fill="#f2dc9a"/><path d="M${f1(px - 0.55 * hs)} ${f1(py - 1.05 * hs)}H${f1(px + 0.55 * hs)}" stroke="#e8588a" stroke-width="${f1(0.14 * hs)}"/>`);
  // 手上的花束
  s.add(`<circle cx="${px - 4}" cy="${py + 50}" r="9" fill="#f58ab0"/><circle cx="${px + 8}" cy="${py + 46}" r="8" fill="#fff"/><circle cx="${px + 2}" cy="${py + 58}" r="8" fill="#ffd84a"/>`);
  front(30, 60);
  // 蝴蝶與蜜蜂
  const bf = (x, y, sc, c, r) => s.add(`<g transform="translate(${x} ${y}) rotate(${r}) scale(${sc})"><path d="M0 0C-14 -24 -34 -18 -28 -2C-34 12 -14 14 0 2Z" fill="${c}"/><path d="M0 0C14 -24 34 -18 28 -2C34 12 14 14 0 2Z" fill="${c}"/><path d="M-20 -8C-14 -12 -8 -8 -8 -4M20 -8C14 -12 8 -8 8 -4" stroke="#fff" stroke-width="2" fill="none" opacity="0.7"/><rect x="-1.6" y="-8" width="3.2" height="18" rx="1.6" fill="#3a2a22"/><path d="M0 -8L-6 -18M0 -8L6 -18" stroke="#3a2a22" stroke-width="1.4"/></g>`);
  bf(250, 400, 1.4, '#f2a43a', -15); bf(600, 340, 1.0, '#6a9ae0', 12); bf(540, 450, 1.3, '#f2d43a', 20);
  s.add('<g transform="translate(330 380)"><ellipse rx="10" ry="7" fill="#f6c73a"/><path d="M-4 -6V6M3 -6V6" stroke="#2a2a2a" stroke-width="3"/><ellipse cx="-4" cy="-10" rx="8" ry="5" fill="#fff" opacity="0.7"/><ellipse cx="5" cy="-10" rx="8" ry="5" fill="#fff" opacity="0.7"/></g>');
  return s.out();
};

/* J10 水族館 */
out.aquarium = () => {
  const s = Scene(); const R = rng(110);
  s.def(lin('w', 0, 0, 0, 1, [[0, '#4fc0e0'], [0.5, '#1c88c0'], [1, '#0b4f86']]));
  s.def(lin('ray', 0, 0, 0, 1, [[0, '#d0f4ff', 0.5], [1, '#d0f4ff', 0]]));
  s.def(lin('sand', 0, 0, 0, 1, [[0, '#e8d8a8'], [1, '#b8a070']]));
  s.def(lin('hall', 0, 0, 0, 1, [[0, '#0e2438'], [1, '#050e18']]));
  s.def(lin('fl', 0, 0, 0, 1, [[0, '#1c3a52'], [1, '#0a1a28']]));
  s.add('<rect width="800" height="600" fill="#06121c"/>');
  // 水槽
  s.add('<rect x="20" y="20" width="760" height="460" rx="10" fill="url(#w)"/>');
  s.def('<clipPath id="tk"><rect x="20" y="20" width="760" height="460" rx="10"/></clipPath>');
  s.add('<g clip-path="url(#tk)">');
  [[140, 70], [300, 90], [470, 60], [640, 80]].forEach(([x, w], i) => s.add(`<path d="M${x} 20L${x + w} 20L${x + w * 1.8 - 90} 460L${x - 90 + i * 8} 460Z" fill="url(#ray)" filter="url(#b8)"/>`));
  // 遠景岩礁
  s.add('<path d="M20 400Q120 330 230 380Q300 330 380 400V480H20Z" fill="#12608f" opacity="0.8" filter="url(#b2)"/><path d="M560 410Q640 340 720 390Q760 360 780 400V480H560Z" fill="#12608f" opacity="0.8" filter="url(#b2)"/>');
  // 沙地
  s.add('<path d="M20 440Q250 410 420 436T780 428V480H20Z" fill="url(#sand)"/>');
  for (let i = 0; i < 40; i++) s.add(`<ellipse cx="${(30 + R() * 740).toFixed(0)}" cy="${(446 + R() * 30).toFixed(0)}" rx="${(8 + R() * 14).toFixed(0)}" ry="2.5" fill="#fff" opacity="0.2"/>`);
  // 珊瑚與海草
  const kelp = (x, h, c) => s.add(`<path d="M${x} 460Q${x - 20} ${460 - h / 3} ${x} ${460 - h / 2}T${x + 4} ${460 - h}" stroke="${c}" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M${x + 4} 460Q${x - 12} ${460 - h / 3} ${x + 6} ${460 - h / 2}T${x + 10} ${460 - h * 0.8}" stroke="${c}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8"/>`);
  [60, 84, 110, 690, 716, 744].forEach((x, i) => kelp(x, 90 + (i % 3) * 40, i % 2 ? '#3f9a5a' : '#58b86a'));
  const coral = (x, y, c, c2) => { let g = ''; for (let i = 0; i < 7; i++) { const a = -90 + (i - 3) * 22; const L = 50 + (i % 3) * 14; const ex = x + Math.cos(a * Math.PI / 180) * L, ey = y + Math.sin(a * Math.PI / 180) * L; g += `<path d="M${x} ${y}L${ex.toFixed(0)} ${ey.toFixed(0)}" stroke="${c}" stroke-width="12" stroke-linecap="round"/><circle cx="${ex.toFixed(0)}" cy="${ey.toFixed(0)}" r="9" fill="${c2}"/>`; } s.add(g); };
  coral(160, 450, '#e8587f', '#ff9ab8'); coral(630, 452, '#f28a3a', '#ffc080'); coral(300, 456, '#b86ad8', '#e0a4f0');
  s.add('<g><ellipse cx="520" cy="452" rx="44" ry="20" fill="#d9788a"/><path d="M490 446Q500 420 512 446M520 444Q530 410 540 444M545 448Q556 426 566 450" fill="#e898a8"/></g>');
  // 魚
  const fish = (x, y, sc, flip, type) => {
    const id = s.uid('fs');
    let body = '';
    if (type === 'clown') {
      s.def(`<clipPath id="${id}c"><path d="M-30 0C-24 -22 14 -26 30 -4C34 6 20 22 -2 22C-20 22 -30 12 -30 0Z"/></clipPath>`);
      body = `<path d="M-30 -2L-52 -18L-50 22L-30 8Z" fill="#f08a2a"/><path d="M-30 0C-24 -22 14 -26 30 -4C34 6 20 22 -2 22C-20 22 -30 12 -30 0Z" fill="#ff8a2a"/><g clip-path="url(#${id}c)"><rect x="-14" y="-30" width="10" height="60" fill="#fff"/><rect x="12" y="-30" width="8" height="60" fill="#fff"/><path d="M-14 -30V30M-4 -30V30M12 -30V30M20 -30V30" stroke="#222" stroke-width="2"/></g><path d="M-6 -22Q0 -38 14 -26" fill="#f08a2a"/><circle cx="22" cy="-4" r="4.2" fill="#fff"/><circle cx="23" cy="-4" r="2.2" fill="#111"/>`;
    } else if (type === 'tang') {
      body = `<path d="M-34 0L-58 -22L-54 0L-58 22Z" fill="#f2d43a"/><ellipse cx="0" cy="0" rx="38" ry="26" fill="#2f7fe0"/><path d="M-28 -2C-10 -20 14 -14 22 6C8 12 -14 16 -28 -2Z" fill="#12306a" opacity="0.75"/><path d="M-20 -22L10 -34L24 -18Z" fill="#2f7fe0"/><path d="M-12 24L10 36L18 22Z" fill="#2f7fe0"/><ellipse cx="22" cy="2" rx="14" ry="12" fill="#3a8ff0" opacity="0.5"/><circle cx="26" cy="-6" r="4.4" fill="#fff"/><circle cx="27" cy="-6" r="2.4" fill="#111"/><path d="M34 6Q38 8 42 4" stroke="#12306a" stroke-width="2" fill="none"/>`;
    } else if (type === 'yellow') {
      body = `<path d="M-30 0L-48 -14L-44 0L-48 14Z" fill="#f2c82a"/><ellipse cx="0" cy="0" rx="32" ry="30" fill="#ffe040"/><path d="M-16 -34Q0 -48 20 -26L10 -20Z" fill="#ffd020"/><path d="M-10 30Q6 40 22 26Z" fill="#ffd020"/><path d="M16 -24L22 24" stroke="#222" stroke-width="5" opacity="0.8"/><circle cx="26" cy="-6" r="3.6" fill="#111"/><path d="M30 6L44 10L30 14Z" fill="#f2c82a"/>`;
    } else { // 小綠熱帶魚
      body = `<path d="M-26 0L-44 -14L-42 14Z" fill="#58c9a0"/><ellipse cx="0" cy="0" rx="28" ry="15" fill="#8fe0b8"/><path d="M-4 -14L8 -24L18 -12Z" fill="#58c9a0"/><path d="M-10 -12Q-12 0 -10 12M2 -14Q0 0 2 14" stroke="#2f9a78" stroke-width="3" fill="none" opacity="0.7"/><circle cx="16" cy="-3" r="3.2" fill="#111"/>`;
    }
    s.add(`<g transform="translate(${x} ${y}) scale(${sc * flip} ${sc})">${body}<ellipse cx="-2" cy="-12" rx="22" ry="5" fill="#fff" opacity="0.25"/></g>`);
  };
  fish(560, 190, 1.2, -1, 'yellow'); fish(250, 250, 1.1, 1, 'tang'); fish(420, 370, 1.0, -1, 'clown'); fish(330, 400, 0.8, 1, 'clown');
  fish(120, 170, 0.8, 1, 'green'); fish(700, 300, 0.9, -1, 'green'); fish(640, 150, 0.6, 1, 'green');
  // 小魚群
  for (let i = 0; i < 14; i++) { const x = 400 + (R() - 0.5) * 120, y = 120 + (R() - 0.5) * 70; s.add(`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(-1 1)"><path d="M-12 0L-20 -5V5Z" fill="#cfe8f2"/><ellipse rx="10" ry="4.5" fill="#e4f2f8"/><circle cx="6" cy="-1" r="1.2" fill="#123"/></g>`); }
  // 海龜
  s.add(`<g transform="translate(470 270) rotate(-8)">${shadow(0, 70, 80, 8, 0.0)}
<path d="M-60 -14C-90 -34 -104 -50 -88 -62C-72 -50 -56 -34 -44 -20Z" fill="#7aa86a"/>
<path d="M-60 28C-86 52 -98 70 -80 76C-66 64 -50 48 -40 34Z" fill="#6a9a5c"/>
<path d="M62 -16C86 -40 100 -50 112 -40C110 -26 92 -14 72 0Z" fill="#8cb87a"/>
<path d="M60 30C80 54 94 64 106 54C100 42 86 30 70 18Z" fill="#7aa86a"/>
<path d="M66 -4C84 -6 96 -2 106 6C100 16 82 18 66 14Z" fill="#a8cf8a"/>
<circle cx="104" cy="3" r="3" fill="#111"/>
<ellipse cx="0" cy="6" rx="78" ry="46" fill="#7a5a30"/>
<ellipse cx="0" cy="2" rx="72" ry="40" fill="#a47c3c"/>
<g fill="none" stroke="#6a4a22" stroke-width="3"><path d="M-40 -20L-20 -34L10 -34L34 -22L46 6L30 30L-6 38L-34 28L-46 4Z"/><path d="M-20 -34L-14 -6L10 -34M-14 -6L30 30M-14 -6L-34 28M-14 -6L-46 4M-14 -6L-6 38"/></g>
<path d="M-40 -18Q0 -42 46 -16" stroke="#ffe6a0" stroke-width="5" fill="none" opacity="0.4"/>
</g>`);
  // 氣泡
  for (let i = 0; i < 24; i++) { const x = 700 + (R() - 0.5) * 50 - i * 1.2, y = 450 - i * 18 - R() * 8, r = 3 + R() * 7; s.add(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#d8f4ff" opacity="0.28" stroke="#fff" stroke-width="1.2"/><circle cx="${(x - r * 0.3).toFixed(0)}" cy="${(y - r * 0.3).toFixed(0)}" r="${(r * 0.25).toFixed(1)}" fill="#fff" opacity="0.8"/>`); }
  for (let i = 0; i < 10; i++) { const x = 140 + R() * 30, y = 450 - i * 30; s.add(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(2 + R() * 5).toFixed(1)}" fill="#d8f4ff" opacity="0.28" stroke="#fff" stroke-width="1.2"/>`); }
  s.add('</g>');
  // 玻璃反光
  s.add('<path d="M40 30L200 30L90 470H40Z" fill="#fff" opacity="0.08"/><path d="M420 30H470L360 470H310Z" fill="#fff" opacity="0.05"/><rect x="20" y="20" width="760" height="460" rx="10" fill="none" stroke="#cfe8f4" stroke-width="4" opacity="0.7"/>');
  // 水槽下緣與地板
  s.add('<rect x="0" y="480" width="800" height="22" fill="#1a2a38"/><rect x="0" y="480" width="800" height="4" fill="#4a6a82" opacity="0.8"/>');
  s.add('<rect y="502" width="800" height="98" fill="url(#fl)"/>');
  s.add('<ellipse cx="400" cy="520" rx="380" ry="16" fill="#3aa8e0" opacity="0.18" filter="url(#b8)"/>');
  // 小孩（背面，貼近玻璃）
  s.add(backFigure(s, 220, 590, 170, { top: '#f2b84a', pant: '#3a5a8a', hair: '#2a1b14', child: true, armUp: true }));
  s.add(backFigure(s, 330, 592, 130, { top: '#58b8a8', pant: '#5a4a6a', hair: '#4a2a1a', child: true, hat: 'cap', hatCol: '#e8587f' }));
  s.add('<path d="M20 20H0V600H20ZM780 20H800V600H780Z" fill="#050e18" opacity="0.9"/>');
  return s.out();
};

module.exports = out;
