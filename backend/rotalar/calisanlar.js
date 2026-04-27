const express = require('express');
const kotaKontrolu = require('../kota');
const router = express.Router();
const db = require('../baglanti');
const { dogrula } = require('./auth');

// tüm çalışanları getir (özet dashboard verisi dahil)
router.get('/', dogrula, async (req, res) => {
  try {
    const listele = await db.sorgu(`
      SELECT c.*, d.ad as departman_adi 
      FROM calisanlar c 
      LEFT JOIN departmanlar d ON c.departman_id = d.id 
      ORDER BY c.ise_giris_tarihi DESC
    `);
    res.json(listele.rows);
  } catch (hata) {
    console.error('çalışanlar listelenirken hata:', hata);
    res.status(500).json({ mesaj: 'sunucu hatası' });
  }
});

// istatistikleri getir
router.get('/istatistik', dogrula, async (req, res) => {
  try {
    const toplamCalisanSorgu = await db.sorgu('SELECT count(*) FROM calisanlar WHERE durum = \'aktif\'');
    const toplamDepartmanSorgu = await db.sorgu('SELECT count(*) FROM departmanlar');
    const bekleyenIzinSorgu = await db.sorgu('SELECT count(*) FROM izinler WHERE durum = \'bekliyor\'');
    
    res.json({
      toplam_calisan: parseInt(toplamCalisanSorgu.rows[0].count),
      toplam_departman: parseInt(toplamDepartmanSorgu.rows[0].count),
      bekleyen_izin: parseInt(bekleyenIzinSorgu.rows[0].count)
    });
  } catch (hata) {
    res.status(500).json({ mesaj: 'sunucu hatası' });
  }
});

// departmanları ve detayları getir
router.get('/departmanlar', dogrula, async (req, res) => {
  try {
    const liste = await db.sorgu(`
      SELECT d.*, COUNT(c.id) as personel_sayisi
      FROM departmanlar d
      LEFT JOIN calisanlar c ON d.id = c.departman_id AND c.durum = 'aktif'
      GROUP BY d.id
      ORDER BY bTrim(d.ad) ASC
    `);
    res.json(liste.rows);
  } catch (hata) {
    res.status(500).json({ mesaj: 'sunucu hatası' });
  }
});

// calisan ekle
router.post('/', dogrula, kotaKontrolu('calisanlar', 100), async (req, res) => {
  const { ad, soyad, eposta, telefon, departman_id, pozisyon, ise_giris_tarihi, maas, durum } = req.body;
  try {
    const yeni = await db.sorgu(`
      INSERT INTO calisanlar (ad, soyad, eposta, telefon, departman_id, pozisyon, ise_giris_tarihi, maas, durum)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `, [ad, soyad, eposta, telefon, departman_id, pozisyon, ise_giris_tarihi, maas, durum]);
    res.json(yeni.rows[0]);
  } catch (hata) {
    res.status(500).json({ mesaj: 'ekleme hatası' });
  }
});

// calisan guncelle
router.put('/:id', dogrula, async (req, res) => {
  const { ad, soyad, eposta, telefon, departman_id, pozisyon, ise_giris_tarihi, maas, durum } = req.body;
  try {
    const guncel = await db.sorgu(`
      UPDATE calisanlar SET ad=$1, soyad=$2, eposta=$3, telefon=$4, departman_id=$5, pozisyon=$6, ise_giris_tarihi=$7, maas=$8, durum=$9
      WHERE id=$10 RETURNING *
    `, [ad, soyad, eposta, telefon, departman_id, pozisyon, ise_giris_tarihi, maas, durum, req.params.id]);
    res.json(guncel.rows[0]);
  } catch (hata) {
    res.status(500).json({ mesaj: 'güncelleme hatası' });
  }
});

// calisan sil
router.delete('/:id', dogrula, async (req, res) => {
  try {
    const id = req.params.id;
    // bagli verileri sil
    await db.sorgu('DELETE FROM izinler WHERE calisan_id=$1', [id]);
    await db.sorgu('DELETE FROM bordrolar WHERE calisan_id=$1', [id]);
    await db.sorgu('DELETE FROM performans_degerlendirmeleri WHERE calisan_id=$1', [id]);
    await db.sorgu('DELETE FROM zaman_loglari WHERE calisan_id=$1', [id]);
    await db.sorgu('DELETE FROM calisanlar WHERE id=$1', [id]);
    res.json({ mesaj: 'silindi' });
  } catch(hata) {
    res.status(500).json({ mesaj: 'silme hatası' });
  }
});

module.exports = router;
