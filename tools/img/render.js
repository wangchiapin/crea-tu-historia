const fs = require('fs'); const path = require('path');
const names = process.argv.slice(2);
const mods = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'].map((k) => { try { return require('./scenes-' + k); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; return {}; } });
const all = Object.assign({}, ...mods);
const outDir = path.join(__dirname, '..', '..', 'images');
(names.length ? names : Object.keys(all)).forEach((n) => { fs.writeFileSync(path.join(outDir, n + '.svg'), all[n]()); console.log('wrote', n); });
