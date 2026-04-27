import { useState, useEffect } from 'react';
import { Users, Building2, CalendarClock, Briefcase } from 'lucide-react';

const KontrolPaneli = () => {
  const [istatistik, setIstatistik] = useState({ toplam_calisan: 0, toplam_departman: 0, bekleyen_izin: 0 });
  const [sonCalisanlar, setSonCalisanlar] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // İstatistik verilerini çek
    fetch('http://localhost:5000/api/calisanlar/istatistik', {
      headers: { 'yetki-token': token }
    })
      .then(res => res.json())
      .then(veri => setIstatistik(veri))
      .catch(hata => console.error('veri çekilemedi', hata));

    // Son işe alınanları çek
    fetch('http://localhost:5000/api/calisanlar', {
      headers: { 'yetki-token': token }
    })
      .then(res => res.json())
      .then(veri => setSonCalisanlar(veri.slice(0, 5)))
      .catch(hata => console.error('çalışanlar çekilemedi', hata));

  }, [token]);

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Kontrol Paneli</h1>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users size={28} /></div>
          <div className="stat-info">
            <span>Toplam Çalışan (aktif)</span>
            <h3>{istatistik.toplam_calisan}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Building2 size={28} /></div>
          <div className="stat-info">
            <span>Departman Sayısı</span>
            <h3>{istatistik.toplam_departman}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <CalendarClock size={28} />
          </div>
          <div className="stat-info">
            <span>Bekleyen İzin Talebi</span>
            <h3>{istatistik.bekleyen_izin}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Briefcase size={28} />
          </div>
          <div className="stat-info">
            <span>Aktif Açık Pozisyon</span>
            <h3>3</h3>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Yeni Katılan Ekip Arkadaşları</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Departman</th>
                <th>İşe Giriş Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {sonCalisanlar.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.ad} {c.soyad}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.departman_adi}</td>
                  <td>{new Date(c.ise_giris_tarihi).toLocaleDateString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default KontrolPaneli;
