const express = require('express');
const kotaKontrolu = require('../kota');
const router = express.Router();
const db = require('../baglanti');
const { dogrula } = require('./auth');

router.get('/', dogrula, async (req, res) => {
  try {
    const listele = await db.sorgu(`
      SELECT z.*, c.ad, c.soyad
      FROM zaman_loglari z
      JOIN calisanlar c ON z.calisan_id = c.id
      ORDER BY z.tarih DESC, z.giris_saati DESC
    `);
    res.json(listele.rows);
  } catch (hata) {
    res.status(500).json({ mesaj: 'sunucu hatası' });
  }
});

// ekle
router.post('/', dogrula, kotaKontrolu('zaman_loglari', 500), async (req, res) => {
  const { calisan_id, tarih, giris_saati, cikis_saati } = req.body;
  try {
    const yeni = await db.sorgu(`INSERT INTO zaman_loglari (calisan_id, tarih, giris_saati, cikis_saati) VALUES ($1, $2, $3, $4) RETURNING *`, [calisan_id, tarih, giris_saati, cikis_saati]);
    res.json(yeni.rows[0]);
  } catch (hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// güncelle
router.put('/:id', dogrula, async (req, res) => {
  const { calisan_id, tarih, giris_saati, cikis_saati } = req.body;
  try {
    const guncel = await db.sorgu(`UPDATE zaman_loglari SET calisan_id=$1, tarih=$2, giris_saati=$3, cikis_saati=$4 WHERE id=$5 RETURNING *`, [calisan_id, tarih, giris_saati, cikis_saati, req.params.id]);
    res.json(guncel.rows[0]);
  } catch (hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// sil
router.delete('/:id', dogrula, async (req, res) => {
  try {
    await db.sorgu('DELETE FROM zaman_loglari WHERE id=$1', [req.params.id]);
    res.json({ mesaj: 'silindi' });
  } catch (hata) { res.status(500).json({ mesaj: 'hata' }); }
});

module.exports = router;
