const express = require('express');
const kotaKontrolu = require('../kota');
const router = express.Router();
const db = require('../baglanti');
const { dogrula } = require('./auth');

router.get('/', dogrula, async (req, res) => {
  try {
    const listele = await db.sorgu(`
      SELECT p.*, c.ad, c.soyad, d.ad as departman_adi
      FROM performans_degerlendirmeleri p
      JOIN calisanlar c ON p.calisan_id = c.id
      LEFT JOIN departmanlar d ON c.departman_id = d.id
      ORDER BY p.tarih DESC
    `);
    res.json(listele.rows);
  } catch (hata) {
    res.status(500).json({ mesaj: 'sunucu hatası' });
  }
});

// ekle
router.post('/', dogrula, kotaKontrolu('performans_degerlendirmeleri', 300), async (req, res) => {
  const { calisan_id, puan, yorum, tarih } = req.body;
  try {
    const yeni = await db.sorgu(`INSERT INTO performans_degerlendirmeleri (calisan_id, puan, yorum, tarih) VALUES ($1, $2, $3, $4) RETURNING *`, [calisan_id, parseInt(puan), yorum, tarih]);
    res.json(yeni.rows[0]);
  } catch (hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// güncelle
router.put('/:id', dogrula, async (req, res) => {
  const { calisan_id, puan, yorum, tarih } = req.body;
  try {
    const guncel = await db.sorgu(`UPDATE performans_degerlendirmeleri SET calisan_id=$1, puan=$2, yorum=$3, tarih=$4 WHERE id=$5 RETURNING *`, [calisan_id, parseInt(puan), yorum, tarih, req.params.id]);
    res.json(guncel.rows[0]);
  } catch (hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// sil
router.delete('/:id', dogrula, async (req, res) => {
  try {
    await db.sorgu('DELETE FROM performans_degerlendirmeleri WHERE id=$1', [req.params.id]);
    res.json({ mesaj: 'silindi' });
  } catch (hata) { res.status(500).json({ mesaj: 'hata' }); }
});

module.exports = router;
