const express = require('express');
const router = express.Router();
const db = require('../baglanti');
const { dogrula } = require('./auth');

router.get('/', dogrula, async (req, res) => {
  try {
    // Departmanlara göre çalışan dağılımı
    const depDagilim = await db.sorgu(`
        SELECT d.ad as name, COUNT(c.id)::int as value
        FROM departmanlar d
        JOIN calisanlar c ON d.id = c.departman_id AND c.durum = 'aktif'
        GROUP BY d.id
    `);

    // Başvuru durumlari dağılımı
    const adayDurum = await db.sorgu(`
        SELECT durum as name, COUNT(*)::int as value
        FROM adaylar
        GROUP BY durum
    `);

    // Bordrolar: Aylara göre toplam ödenen net maaş
    const maasAylar = await db.sorgu(`
        SELECT CONCAT(ay, '/', yil) as name, SUM(net_maas)::int as value
        FROM bordrolar
        GROUP BY ay, yil
        ORDER BY yil ASC, ay ASC
    `);

    res.json({
      departman_dagilimi: depDagilim.rows,
      aday_durumlari: adayDurum.rows,
      aylik_maas_gideri: maasAylar.rows
    });
  } catch (hata) {
    console.error('rapor hatası:', hata);
    res.status(500).json({ mesaj: 'sunucu hatası' });
  }
});
module.exports = router;
