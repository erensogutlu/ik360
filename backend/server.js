const express = require('express');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 5000;

// güvenlik: http header koruması
app.use(helmet());

// güvenlik: flood / spam engeli (ip bazlı limit)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // 100 istek limiti
  message: { mesaj: "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin." }
});
app.use('/api', limiter);

// ara yazılımlar
app.use(cors());
// güvenlik: paket boyutu limitleme (10kb üstü engellenir)
app.use(express.json({ limit: '10kb' }));

// rotalar
const { router: authRotasi } = require('./rotalar/auth');
const calisanlarRotasi = require('./rotalar/calisanlar');
const departmanlarRotasi = require('./rotalar/departmanlar');
const izinlerRotasi = require('./rotalar/izinler');
const iseAlimRotasi = require('./rotalar/ise_alim');
const bordroRotasi = require('./rotalar/bordro');
const performansRotasi = require('./rotalar/performans');
const zamanTakibiRotasi = require('./rotalar/zaman_takibi');
const raporlarRotasi = require('./rotalar/raporlar');

app.use('/api/auth', authRotasi);
app.use('/api/calisanlar', calisanlarRotasi);
app.use('/api/departmanlar', departmanlarRotasi);
app.use('/api/izinler', izinlerRotasi);
app.use('/api/ise-alim', iseAlimRotasi);
app.use('/api/bordro', bordroRotasi);
app.use('/api/performans', performansRotasi);
app.use('/api/zaman', zamanTakibiRotasi);
app.use('/api/raporlar', raporlarRotasi);

app.get('/', (req, res) => {
  res.json({ mesaj: 'ik360 api çalışıyor' });
});

app.listen(port, () => {
  console.log(`sunucu ${port} portunda çalışıyor.`);
});
