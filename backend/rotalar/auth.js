const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../baglanti');

// kullanıcı girişi
router.post('/giris', async (req, res) => {
  const { eposta, sifre } = req.body;

  try {
    const kullaniciSorgu = await db.sorgu('SELECT * FROM kullanicilar WHERE eposta = $1', [eposta]);
    if (kullaniciSorgu.rows.length === 0) {
      return res.status(401).json({ mesaj: 'geçersiz e-posta veya şifre' });
    }

    const kullanici = kullaniciSorgu.rows[0];
    const sifreDogru = await bcrypt.compare(sifre, kullanici.sifre);

    if (!sifreDogru) {
      return res.status(401).json({ mesaj: 'geçersiz e-posta veya şifre' });
    }

    const anahtar = process.env.JWT_GIZLI_ANAHTAR || 'gizliAnahtar';
    const token = jwt.sign(
      { id: kullanici.id, rol: kullanici.rol, ad_soyad: kullanici.ad_soyad },
      anahtar,
      { expiresIn: '1d' }
    );

    res.json({
      mesaj: 'giriş başarılı',
      token,
      kullanici: {
        id: kullanici.id,
        ad_soyad: kullanici.ad_soyad,
        eposta: kullanici.eposta,
        rol: kullanici.rol
      }
    });
  } catch (hata) {
    console.error('giriş hatası:', hata);
    res.status(500).json({ mesaj: 'sunucu hatası' });
  }
});

// token doğrulama ara yazılımı (middleware)
const dogrula = (req, res, next) => {
  const token = req.header('yetki-token');
  if (!token) return res.status(401).json({ mesaj: 'erişim reddedildi, token yok' });

  try {
    const anahtar = process.env.JWT_GIZLI_ANAHTAR || 'gizliAnahtar';
    const dogrulanmis = jwt.verify(token, anahtar);
    req.kullanici = dogrulanmis;
    next();
  } catch (hata) {
    res.status(400).json({ mesaj: 'geçersiz token' });
  }
};

module.exports = { router, dogrula };
