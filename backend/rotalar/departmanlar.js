const express = require('express');
const kotaKontrolu = require('../kota');
const router = express.Router();
const db = require('../baglanti');
const { dogrula } = require('./auth');

// List
router.get('/', dogrula, async (req, res) => {
  try {
    const liste = await db.sorgu(`
      SELECT d.*, COUNT(c.id) as personel_sayisi
      FROM departmanlar d
      LEFT JOIN calisanlar c ON d.id = c.departman_id AND c.durum = 'aktif'
      GROUP BY d.id
      ORDER BY bTrim(d.ad) ASC
    `);
    res.json(liste.rows);
  } catch (hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// Create
router.post('/', dogrula, kotaKontrolu('departmanlar', 20), async (req, res) => {
  try {
    const yeni = await db.sorgu('INSERT INTO departmanlar (ad, aciklama) VALUES ($1, $2) RETURNING *', [req.body.ad, req.body.aciklama]);
    res.json(yeni.rows[0]);
  } catch(hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// Update
router.put('/:id', dogrula, async (req, res) => {
  try {
    const guncel = await db.sorgu('UPDATE departmanlar SET ad=$1, aciklama=$2 WHERE id=$3 RETURNING *', [req.body.ad, req.body.aciklama, req.params.id]);
    res.json(guncel.rows[0]);
  } catch(hata) { res.status(500).json({ mesaj: 'hata' }); }
});

// Delete
router.delete('/:id', dogrula, async (req, res) => {
  try {
    await db.sorgu('DELETE FROM departmanlar WHERE id=$1', [req.params.id]);
    res.json({ mesaj: 'silindi' });
  } catch(hata) { res.status(500).json({ mesaj: 'silme hatası (bu departmana ait çalışan olabilir)' }); }
});

module.exports = router;
