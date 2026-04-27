const db = require('./baglanti');

const kotaKontrolu = (tabloAdi, maksLimit) => {
  return async (req, res, next) => {
    try {
      const sayim = await db.sorgu(`SELECT COUNT(*) as sayac FROM ${tabloAdi}`);
      if (parseInt(sayim.rows[0].sayac) >= maksLimit) {
        return res.status(403).json({ mesaj: `Sistem demo kapasitesine (${maksLimit}) ulaştı. Yeni veri eklenemez.` });
      }
      next();
    } catch (hata) {
      console.error(hata);
      res.status(500).json({ mesaj: 'Sunucu kota kontrol hatası.' });
    }
  };
};

module.exports = kotaKontrolu;
