const db = require('./baglanti');
const bcrypt = require('bcryptjs');

async function kurulumYap() {
  try {
    console.log("eski tablolar temizleniyor...");
    await db.sorgu('DROP TABLE IF EXISTS zaman_loglari, performans_degerlendirmeleri, bordrolar, adaylar, izinler, calisanlar, departmanlar, kullanicilar CASCADE;');

    // kullanıcılar tablosu (auth)
    await db.sorgu(`
      CREATE TABLE kullanicilar (
        id SERIAL PRIMARY KEY,
        ad_soyad VARCHAR(100) NOT NULL,
        eposta VARCHAR(100) UNIQUE NOT NULL,
        sifre VARCHAR(255) NOT NULL,
        rol VARCHAR(50) DEFAULT 'admin',
        olusturulma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // departmanlar tablosu
    await db.sorgu(`
      CREATE TABLE departmanlar (
        id SERIAL PRIMARY KEY,
        ad VARCHAR(100) NOT NULL,
        aciklama TEXT,
        olusturulma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // çalışanlar tablosu
    await db.sorgu(`
      CREATE TABLE calisanlar (
        id SERIAL PRIMARY KEY,
        ad VARCHAR(50) NOT NULL,
        soyad VARCHAR(50) NOT NULL,
        eposta VARCHAR(100) UNIQUE NOT NULL,
        telefon VARCHAR(20),
        departman_id INTEGER REFERENCES departmanlar(id),
        pozisyon VARCHAR(100),
        ise_giris_tarihi DATE,
        maas DECIMAL(10,2),
        durum VARCHAR(20) DEFAULT 'aktif',
        olusturulma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // izinler tablosu
    await db.sorgu(`
      CREATE TABLE izinler (
        id SERIAL PRIMARY KEY,
        calisan_id INTEGER REFERENCES calisanlar(id),
        izin_turu VARCHAR(50) NOT NULL,
        baslangic_tarihi DATE NOT NULL,
        bitis_tarihi DATE NOT NULL,
        sebep TEXT,
        durum VARCHAR(20) DEFAULT 'bekliyor',
        talep_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Gelişmiş Modül Tabloları
    // İşe Alım
    await db.sorgu(`
      CREATE TABLE adaylar (
        id SERIAL PRIMARY KEY,
        ad VARCHAR(50) NOT NULL,
        soyad VARCHAR(50) NOT NULL,
        eposta VARCHAR(100) NOT NULL,
        pozisyon VARCHAR(100) NOT NULL,
        telefon VARCHAR(20),
        durum VARCHAR(20) DEFAULT 'başvurdu', /* başvurdu, mülakat, teklif, reddedildi */
        basvuru_tarihi DATE NOT NULL
      );
    `);

    // Bordrolar
    await db.sorgu(`
      CREATE TABLE bordrolar (
        id SERIAL PRIMARY KEY,
        calisan_id INTEGER REFERENCES calisanlar(id),
        ay INTEGER NOT NULL,
        yil INTEGER NOT NULL,
        brut_maas DECIMAL(10,2) NOT NULL,
        net_maas DECIMAL(10,2) NOT NULL,
        kesintiler DECIMAL(10,2) DEFAULT 0,
        durum VARCHAR(20) DEFAULT 'ödendi', /* beklemede, ödendi */
        olusturulma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Performans Yönetimi
    await db.sorgu(`
      CREATE TABLE performans_degerlendirmeleri (
        id SERIAL PRIMARY KEY,
        calisan_id INTEGER REFERENCES calisanlar(id),
        puan INTEGER NOT NULL CHECK (puan >= 1 AND puan <= 5),
        yorum TEXT,
        tarih DATE NOT NULL
      );
    `);

    // Zaman Takibi
    await db.sorgu(`
      CREATE TABLE zaman_loglari (
        id SERIAL PRIMARY KEY,
        calisan_id INTEGER REFERENCES calisanlar(id),
        tarih DATE NOT NULL,
        giris_saati TIME NOT NULL,
        cikis_saati TIME
      );
    `);
    
    await db.sorgu(`ALTER TABLE zaman_loglari ADD UNIQUE(calisan_id, tarih);`);

    console.log("yeni tablolar başarıyla oluşturuldu.");

    // Admin kullanıcı
    const sifreHash = await bcrypt.hash('admin123', 10);
    await db.sorgu(
      'INSERT INTO kullanicilar (ad_soyad, eposta, sifre, rol) VALUES ($1, $2, $3, $4)',
      ['sistem yöneticisi', 'admin@ik360.com', sifreHash, 'admin']
    );
    console.log("admin eklendi.");

    // Departmanlar
    const departmanlarEkle = await db.sorgu(`
      INSERT INTO departmanlar (ad, aciklama) VALUES 
      ('insan kaynakları', 'personel ve işe alım departmanı'),
      ('yazılım', 'arge ve frontend/backend geliştirme takımı'),
      ('pazarlama', 'dijital pazarlama ve sosyal medya'),
      ('satış', 'kurumsal a ve b2b satış operasyonları'),
      ('finans', 'muhasebe, bütçeleme ve finans'),
      ('tasarım', 'ui/ux ve grafik tasarım departmanı')
      RETURNING id, ad;
    `);
    const departmanListesi = departmanlarEkle.rows;

    // Çalışanlar
    const isimler = ['ahmet', 'ayşe', 'mehmet', 'fatma', 'can', 'elif', 'ali', 'zeynep', 'deniz', 'burak', 'ceren', 'murat', 'emre', 'özge', 'mert', 'eda', 'onur', 'gizem', 'taylan', 'selin'];
    const soyisimler = ['yılmaz', 'kaya', 'demir', 'şahin', 'çelik', 'yıldız', 'doğan', 'kılıç', 'arslan', 'özdemir', 'polat', 'can', 'aydın', 'koç', 'şen'];
    const pozisyonlar = ['uzman', 'kıdemli uzman', 'takım lideri', 'asistan', 'yönetici', 'direktör', 'müdür yardımcısı'];
    
    // Rastgele tarih (-x gün)
    const oncekiTarih = (gunFarki) => {
      const d = new Date();
      d.setDate(d.getDate() - gunFarki);
      return d.toISOString().split('T')[0];
    };

    console.log("sahte çalışanlar ekleniyor...");
    const eklenecekCalisanlar = [];
    const calisanMaasMap = {};

    for (let i = 0; i < 30; i++) {
        const ad = isimler[Math.floor(Math.random() * isimler.length)];
        const soyad = soyisimler[Math.floor(Math.random() * soyisimler.length)];
        const eposta = `${ad}.${soyad}${Math.floor(Math.random() * 1000)}@ik360.com`.replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c');
        const telefon = `05${Math.floor(10000000 + Math.random() * 90000000)}`;
        const departman_id = departmanListesi[Math.floor(Math.random() * departmanListesi.length)].id;
        const pozisyon = pozisyonlar[Math.floor(Math.random() * pozisyonlar.length)];
        const maas = Math.floor(25000 + Math.random() * 75000);
        const tarih = oncekiTarih(Math.floor(Math.random() * 1000 + 100)); // 100-1100 gün önce
        const durum = Math.random() > 0.1 ? 'aktif' : 'pasif';

        eklenecekCalisanlar.push(db.sorgu(
            'INSERT INTO calisanlar (ad, soyad, eposta, telefon, departman_id, pozisyon, ise_giris_tarihi, maas, durum) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
            [ad, soyad, eposta, telefon, departman_id, pozisyon, tarih, maas, durum]
        ));
    }
    const calisanSonuclari = await Promise.all(eklenecekCalisanlar);
    const calisanIdleri = calisanSonuclari.map((s, idx) => {
      const id = s.rows[0].id;
      // İleride bordro için lazım olacak
      calisanMaasMap[id] = 25000 + (idx * 1500) % 50000; // basit rastgelelik
      return id;
    });

    // İzinler veri üretimi
    console.log("sahte modül verileri oluşturuluyor...");
    for (let i = 0; i < 20; i++) {
        const c_id = calisanIdleri[Math.floor(Math.random() * calisanIdleri.length)];
        await db.sorgu(
            'INSERT INTO izinler (calisan_id, izin_turu, baslangic_tarihi, bitis_tarihi, sebep, durum) VALUES ($1, $2, $3, $4, $5, $6)',
            [c_id, 'yıllık izin', oncekiTarih(Math.floor(Math.random() * 30)), oncekiTarih(Math.floor(Math.random() * 20 - 15)), 'sahte veri', 'onaylandi']
        );
    }

    // Adaylar (İşe Alım)
    const adayDurumlari = ['başvurdu', 'mülakat', 'teklif verdi', 'reddedildi'];
    const adayPozisyonlari = ['frontend geliştirici', 'backend geliştirici', 'ik uzmanı', 'satış danışmanı', 'grafik tasarımcı'];
    for(let i=0; i<15; i++) {
        await db.sorgu(
            'INSERT INTO adaylar (ad, soyad, eposta, pozisyon, telefon, durum, basvuru_tarihi) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [isimler[Math.floor(Math.random()*isimler.length)], soyisimler[Math.floor(Math.random()*soyisimler.length)], `aday${i}@mail.com`, adayPozisyonlari[Math.floor(Math.random()*adayPozisyonlari.length)], `055500011${i}`, adayDurumlari[Math.floor(Math.random()*adayDurumlari.length)], oncekiTarih(Math.floor(Math.random()*30))]
        );
    }

    // Bordrolar (Maaş) - Son 3 ay için 
    const aylar = [3, 4, 5]; // Mart, Nisan, Mayıs (varsayım)
    for(const c_id of calisanIdleri) {
      if(Math.random() > 0.2) { // bazılarının bordrosu olsun
        for(const ay of aylar) {
            const brut = calisanMaasMap[c_id] || 40000;
            const kesinti = brut * 0.25;
            const net = brut - kesinti;
            await db.sorgu(
                'INSERT INTO bordrolar (calisan_id, ay, yil, brut_maas, net_maas, kesintiler, durum) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [c_id, ay, 2026, brut, net, kesinti, 'ödendi']
            );
        }
      }
    }

    // Performans (Geçen yılki ve bu yılki)
    for(let i=0; i<30; i++) {
        const c_id = calisanIdleri[Math.floor(Math.random() * calisanIdleri.length)];
        const puan = Math.floor(Math.random() * 3) + 3; // 3,4,5
        await db.sorgu(
            'INSERT INTO performans_degerlendirmeleri (calisan_id, puan, yorum, tarih) VALUES ($1, $2, $3, $4)',
            [c_id, puan, 'genel performans hedefleri beklentileri karşıladı/aştı.', oncekiTarih(Math.floor(Math.random()*100))]
        );
    }

    // Zaman Takibi (Son 5 gün)
    for(const c_id of calisanIdleri) {
        for(let gun=1; gun<=5; gun++) {
            if(Math.random() > 0.1) { // 10% gelmeme payı
                const giris = `0${8 + Math.floor(Math.random()*2)}:${10 + Math.floor(Math.random()*40)}:00`;
                const cikis = `${17 + Math.floor(Math.random()*2)}:${10 + Math.floor(Math.random()*40)}:00`;
                await db.sorgu(
                    'INSERT INTO zaman_loglari (calisan_id, tarih, giris_saati, cikis_saati) VALUES ($1, $2, $3, $4) ON CONFLICT (calisan_id, tarih) DO NOTHING',
                    [c_id, oncekiTarih(gun), giris, cikis]
                );
            }
        }
    }

    console.log("yeni devasa veri seti başaryıla oluşturuldu.");
    process.exit(0);
  } catch (hata) {
    console.error("kurulum sırasında hata:", hata);
    process.exit(1);
  }
}

kurulumYap();
