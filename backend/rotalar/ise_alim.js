const express = require('express');
const kotaKontrolu = require('../kota');
const router = express.Router();
const db = require('../baglanti');
const { dogrula } = require('./auth');

router.get('/', dogrula, async (req, res) => {
  try {
    const listele = await db.sorgu('SELECT * FROM adaylar ORDER BY basvuru_tarihi DESC');
    res.json(listele.rows);
  } catch (hata) {
    res.status(500).json({ mesaj: 'sunucu hatası' });
  }
});

// aday ekle
router.post('/', dogrula, kotaKontrolu('adaylar', 100), async (req, res) => {
  const { ad, soyad, eposta, pozisyon, telefon, durum, basvuru_tarihi } = req.body;
  try {
    const yeni = await db.sorgu(`INSERT INTO adaylar (ad, soyad, eposta, pozisyon, telefon, durum, basvuru_tarihi) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [ad, soyad, eposta, pozisyon, telefon, durum, basvuru_tarihi]);
    res.json(yeni.rows[0]);
  } catch(hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// aday guncelle
router.put('/:id', dogrula, async (req, res) => {
  const { ad, soyad, eposta, pozisyon, telefon, durum, basvuru_tarihi } = req.body;
  try {
    const guncel = await db.sorgu(`UPDATE adaylar SET ad=$1, soyad=$2, eposta=$3, pozisyon=$4, telefon=$5, durum=$6, basvuru_tarihi=$7 WHERE id=$8 RETURNING *`, [ad, soyad, eposta, pozisyon, telefon, durum, basvuru_tarihi, req.params.id]);
    res.json(guncel.rows[0]);
  } catch(hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// aday sil
router.delete('/:id', dogrula, async (req, res) => {
  try {
    await db.sorgu('DELETE FROM adaylar WHERE id=$1', [req.params.id]);
    res.json({mesaj: 'silindi'});
  } catch(hata) { res.status(500).json({ mesaj: 'hata' }); }
});

module.exports = router;
