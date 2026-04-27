const express = require('express');
const kotaKontrolu = require('../kota');
const router = express.Router();
const db = require('../baglanti');
const { dogrula } = require('./auth');

router.get('/', dogrula, async (req, res) => {
  try {
    const listele = await db.sorgu(`
      SELECT b.*, c.ad, c.soyad 
      FROM bordrolar b
      JOIN calisanlar c ON b.calisan_id = c.id
      ORDER BY b.yil DESC, b.ay DESC, c.ad ASC
    `);
    res.json(listele.rows);
  } catch (hata) {
    res.status(500).json({ mesaj: 'sunucu hatası' });
  }
});

// bordro ekle
router.post('/', dogrula, kotaKontrolu('bordrolar', 300), async (req, res) => {
  const { calisan_id, ay, yil, brut_maas, net_maas, kesintiler, durum } = req.body;
  try {
    const yeni = await db.sorgu(`INSERT INTO bordrolar (calisan_id, ay, yil, brut_maas, net_maas, kesintiler, durum) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [calisan_id, ay, yil, brut_maas, net_maas, kesintiler, durum]);
    res.json(yeni.rows[0]);
  } catch(hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// bordro guncelle
router.put('/:id', dogrula, async (req, res) => {
  const { calisan_id, ay, yil, brut_maas, net_maas, kesintiler, durum } = req.body;
  try {
    const guncel = await db.sorgu(`UPDATE bordrolar SET calisan_id=$1, ay=$2, yil=$3, brut_maas=$4, net_maas=$5, kesintiler=$6, durum=$7 WHERE id=$8 RETURNING *`, [calisan_id, ay, yil, brut_maas, net_maas, kesintiler, durum, req.params.id]);
    res.json(guncel.rows[0]);
  } catch(hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// bordro sil
router.delete('/:id', dogrula, async (req, res) => {
  try {
    await db.sorgu('DELETE FROM bordrolar WHERE id=$1', [req.params.id]);
    res.json({mesaj: 'silindi'});
  } catch(hata) { res.status(500).json({ mesaj: 'hata' }); }
});

module.exports = router;
