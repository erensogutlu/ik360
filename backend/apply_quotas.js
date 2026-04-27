const fs = require('fs');
const path = require('path');

const targets = [
  { file: 'calisanlar.js', table: 'calisanlar', limit: 100 },
  { file: 'departmanlar.js', table: 'departmanlar', limit: 20 },
  { file: 'ise_alim.js', table: 'adaylar', limit: 100 },
  { file: 'bordro.js', table: 'bordrolar', limit: 300 },
  { file: 'performans.js', table: 'performans_degerlendirmeleri', limit: 300 },
  { file: 'zaman_takibi.js', table: 'zaman_loglari', limit: 500 },
  { file: 'izinler.js', table: 'izinler', limit: 200 }
];

targets.forEach(t => {
  const fPath = path.join(__dirname, 'rotalar', t.file);
  let content = fs.readFileSync(fPath, 'utf8');
  
  if (!content.includes('kotaKontrolu')) {
    content = content.replace("const router = require('express').Router();", "const router = require('express').Router();\nconst kotaKontrolu = require('../kota');");
    
    // Replace the exact router.post line
    content = content.replace(
      "router.post('/', dogrula, async",
      `router.post('/', dogrula, kotaKontrolu('${t.table}', ${t.limit}), async`
    );
    
    fs.writeFileSync(fPath, content);
  }
});
console.log('Quotas applied');
