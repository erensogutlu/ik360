const express = require('express');
const kotaKontrolu = require('../kota');
const router = express.Router();
const db = require('../baglanti');
const { dogrula } = require('./auth');

// tüm izinleri getir (çalışan bilgileriyle birlikte)
router.get('/', dogrula, async (req, res) => {
  try {
    const listele = await db.sorgu(`
      SELECT i.*, c.ad, c.soyad, d.ad as departman_adi 
      FROM izinler i
      JOIN calisanlar c ON i.calisan_id = c.id
      LEFT JOIN departmanlar d ON c.departman_id = d.id
      ORDER BY i.talep_tarihi DESC
    `);
    res.json(listele.rows);
  } catch (hata) {
    console.error('izinler listelenirken hata:', hata);
    res.status(500).json({ mesaj: 'sunucu hatası' });
  }
});

// ekle
router.post('/', dogrula, kotaKontrolu('izinler', 200), async (req, res) => {
  const { calisan_id, izin_turu, baslangic_tarihi, bitis_tarihi, sebep, durum } = req.body;
  try {
    const yeni = await db.sorgu(`INSERT INTO izinler (calisan_id, izin_turu, baslangic_tarihi, bitis_tarihi, sebep, durum) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [calisan_id, izin_turu, baslangic_tarihi, bitis_tarihi, sebep, durum]);
    res.json(yeni.rows[0]);
  } catch(hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// guncelle
router.put('/:id', dogrula, async (req, res) => {
  const { calisan_id, izin_turu, baslangic_tarihi, bitis_tarihi, sebep, durum } = req.body;
  try {
    const guncel = await db.sorgu(`UPDATE izinler SET calisan_id=$1, izin_turu=$2, baslangic_tarihi=$3, bitis_tarihi=$4, sebep=$5, durum=$6 WHERE id=$7 RETURNING *`, [calisan_id, izin_turu, baslangic_tarihi, bitis_tarihi, sebep, durum, req.params.id]);
    res.json(guncel.rows[0]);
  } catch(hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// sil
router.delete('/:id', dogrula, async (req, res) => {
  try {
    await db.sorgu('DELETE FROM izinler WHERE id=$1', [req.params.id]);
    res.json({mesaj: 'silindi'});
  } catch(hata) { res.status(500).json({ mesaj: 'hata' }); }
});

module.exports = router;
