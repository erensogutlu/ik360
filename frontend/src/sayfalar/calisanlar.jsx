import { useState, useEffect } from 'react';
import { Search, MoreVertical, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../bilesenler/Modal';
import API_URL from '../api';

const Calisanlar = () => {
  const [calisanlar, setCalisanlar] = useState([]);
  const [departmanlar, setDepartmanlar] = useState([]);
  const [arama, setArama] = useState('');
  const [modalAcik, setModalAcik] = useState(false);
  const [form, setForm] = useState({ id: null, ad: '', soyad: '', eposta: '', telefon: '', departman_id: '', pozisyon: '', ise_giris_tarihi: '', maas: '', durum: 'aktif' });
  const token = localStorage.getItem('token');

  const getir = () => {
    fetch(`${API_URL}/calisanlar`, { headers: { 'yetki-token': token } })
      .then(res => res.json()).then(setCalisanlar).catch(console.error);
    fetch(`${API_URL}/departmanlar`, { headers: { 'yetki-token': token } })
      .then(res => res.json()).then(setDepartmanlar).catch(console.error);
  };
  useEffect(() => { getir(); }, [token]);

  const kaydet = async (e) => {
    e.preventDefault();
    const url = form.id ? `${API_URL}/calisanlar/${form.id}` : `${API_URL}/calisanlar`;
    const method = form.id ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'yetki-token': token }, body: JSON.stringify(form) });
    setModalAcik(false);
    getir();
  };

  const sil = async (id) => {
    if(!window.confirm('Emin misiniz? Dikkat: Çalışanın tüm performans, maaş ve izin verileri kalıcı silinir!')) return;
    await fetch(`${API_URL}/calisanlar/${id}`, { method: 'DELETE', headers: { 'yetki-token': token } });
    getir();
  };

  const acYeni = () => {
    setForm({ id: null, ad: '', soyad: '', eposta: '', telefon: '', departman_id: '', pozisyon: '', ise_giris_tarihi: new Date().toISOString().split('T')[0], maas: '', durum: 'aktif' });
    setModalAcik(true);
  };

  const filtrelenmisCalisanlar = calisanlar.filter(c => 
    `${c.ad} ${c.soyad}`.toLowerCase().includes(arama.toLowerCase()) || 
    c.eposta.toLowerCase().includes(arama.toLowerCase()) ||
    (c.departman_adi || '').toLowerCase().includes(arama.toLowerCase())
  );

  return (
    <div>
      <div className="header-actions">
        <h1>Çalışanlar</h1>
        <button className="btn flex items-center" style={{ gap: '8px' }} onClick={acYeni}>
          <Plus size={18} /> çalışan ekle
        </button>
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="İsim, E-Posta veya Departman Ara..." 
            style={{ paddingLeft: '44px' }}
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ad Soyad</th><th>E-Posta</th><th>Departman</th><th>Pozisyon</th><th>Durum</th><th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtrelenmisCalisanlar.map(c => (
              <tr key={c.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500 }}>
                  <div className="avatar">{c.ad.charAt(0)}{c.soyad.charAt(0)}</div>
                  {c.ad} {c.soyad}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{c.eposta}</td>
                <td><span className="badge">{c.departman_adi || '-'}</span></td>
                <td>{c.pozisyon}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.durum === 'aktif' ? 'var(--success)' : 'var(--text-muted)' }}></span>
                    <span style={{ color: c.durum === 'aktif' ? 'var(--text-main)' : 'var(--text-muted)' }}>{c.durum}</span>
                  </div>
                </td>
                <td>
                  <button className="action-btn edit" onClick={() => { setForm({ ...c, ise_giris_tarihi: c.ise_giris_tarihi.split('T')[0] }); setModalAcik(true); }}><Edit2 size={16}/></button>
                  <button className="action-btn delete" onClick={() => sil(c.id)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
            {filtrelenmisCalisanlar.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Sonuç bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalAcik} onClose={() => setModalAcik(false)} title={form.id ? 'Çalışan Düzenle' : 'Çalışan Ekle'}>
        <form onSubmit={kaydet}>
          <div style={{display:'flex', gap:'12px'}}>
            <div className="form-group flex-1">
              <label className="label">ad</label><input className="input" required value={form.ad} onChange={e => setForm({...form, ad: e.target.value})} />
            </div>
            <div className="form-group flex-1">
              <label className="label">soyad</label><input className="input" required value={form.soyad} onChange={e => setForm({...form, soyad: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">E-Posta</label><input type="email" className="input" required value={form.eposta} onChange={e => setForm({...form, eposta: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="label">Telefon</label><input className="input" required value={form.telefon} onChange={e => setForm({...form, telefon: e.target.value})} />
          </div>
          <div style={{display:'flex', gap:'12px'}}>
            <div className="form-group flex-1">
              <label className="label">Departman</label>
              <select className="input" required value={form.departman_id} onChange={e => setForm({...form, departman_id: e.target.value})}>
                <option value="">Seçiniz</option>
                {departmanlar.map(d => <option key={d.id} value={d.id}>{d.ad}</option>)}
              </select>
            </div>
            <div className="form-group flex-1">
              <label className="label">Pozisyon</label><input className="input" required value={form.pozisyon} onChange={e => setForm({...form, pozisyon: e.target.value})} />
            </div>
          </div>
          <div style={{display:'flex', gap:'12px'}}>
            <div className="form-group flex-1">
              <label className="label">Maaş (Brüt)</label><input type="number" className="input" required value={form.maas} onChange={e => setForm({...form, maas: e.target.value})} />
            </div>
            <div className="form-group flex-1">
              <label className="label">İşe Giriş</label><input type="date" className="input" required value={form.ise_giris_tarihi} onChange={e => setForm({...form, ise_giris_tarihi: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Durum</label>
            <select className="input" value={form.durum} onChange={e => setForm({...form, durum: e.target.value})}>
              <option value="aktif">Aktif</option><option value="pasif">Pasif</option>
            </select>
          </div>
          <button type="submit" className="btn w-full mt-4">Kaydet</button>
        </form>
      </Modal>
    </div>
  );
};
export default Calisanlar;
