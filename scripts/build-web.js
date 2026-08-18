const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

function copyDir(name) {
  const src = path.join(root, name);
  const dest = path.join(dist, name);
  fs.cpSync(src, dest, { recursive: true });
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const dir of ['css', 'js', 'data']) copyDir(dir);
for (const file of ['index.html', 'manifest.json', 'sw.js', 'icon.svg']) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}

console.log('CyberLab web build generado en ./dist');
