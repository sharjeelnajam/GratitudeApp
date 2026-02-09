/**
 * Copies Body Awareness assets to short filenames so Android can load them.
 * Run once: node scripts/copy-body-awareness-assets.js
 * Or: npm run copy-body-awareness-assets
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', '10-min-Body-Awareness-Message');

const SOURCES = [
  {
    from: '01 - Dr. Maxine McLean - 10 mins - Body Awareness Message.mp3',
    to: 'body-awareness.mp3',
  },
  {
    from: 'Dr. Maxine McLean - 10 min Body Awareness Message.jpg',
    to: 'cover.jpg',
  },
];

if (!fs.existsSync(ASSETS_DIR)) {
  console.warn('Assets folder not found:', ASSETS_DIR);
  process.exit(1);
}

for (const { from: fromName, to: toName } of SOURCES) {
  const src = path.join(ASSETS_DIR, fromName);
  const dest = path.join(ASSETS_DIR, toName);
  if (!fs.existsSync(src)) {
    console.warn('Source not found:', fromName);
    continue;
  }
  fs.copyFileSync(src, dest);
  console.log('Created', toName);
}

console.log('Done. You can now run the app.');
