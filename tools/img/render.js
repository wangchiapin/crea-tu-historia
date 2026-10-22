const fs = require('fs'); const path = require('path');
const names = process.argv.slice(2);
const mods = [require('./scenes-a'), (() => { try { return require('./scenes-b'); } catch (e) { return {}; } })()];
const all = Object.assign({}, ...mods);
const outDir = path.join(__dirname, '..', '..', 'images');
(names.length ? names : Object.keys(all)).forEach((n) => { fs.writeFileSync(path.join(outDir, n + '.svg'), all[n]()); console.log('wrote', n); });
