import { useState, useEffect } from 'react';
import API_URL from '../api';
import { Clock, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../bilesenler/Modal';

const ZamanTakibi = () => {
  const [zamanLoglari, setZamanLoglari] = useState([]);
  const [calisanlar, setCalisanlar] = useState([]);
  const [modalAcik, setModalAcik] = useState(false);
  const [form, setForm] = useState({ id: null, calisan_id: '', tarih: '', giris_saati: '', cikis_saati: '' });
  const token = localStorage.getItem('token');

  const getir = () => {
    fetch(`${API_URL}/zaman`, { headers: { 'yetki-token': token } })
      .then(res => res.json()).then(setZamanLoglari).catch(console.error);
    fetch(`${API_URL}/calisanlar`, { headers: { 'yetki-token': token } })
      .then(res => res.json()).then(setCalisanlar).catch(console.error);
  };
  useEffect(() => { getir(); }, [token]);

  const kaydet = async (e) => {
    e.preventDefault();
    const url = form.id ? `${API_URL}/zaman/${form.id}` : `${API_URL}/zaman`;
    const method = form.id ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'yetki-token': token }, body: JSON.stringify(form) });
    setModalAcik(false);
    getir();
  };

  const sil = async (id) => {
    if(!window.confirm('Emin misiniz?')) return;
    await fetch(`${API_URL}/zaman/${id}`, { method: 'DELETE', headers: { 'yetki-token': token } });
    getir();
  };

  const acYeni = () => {
    setForm({ id: null, calisan_id: '', tarih: new Date().toISOString().split('T')[0], giris_saati: '09:00:00', cikis_saati: '17:00:00' });
    setModalAcik(true);
  };

  return (
    <div>
      <div className="header-actions">
        <h1>Zaman Takibi</h1>
        <button className="btn flex items-center" style={{ gap: '8px' }} onClick={acYeni}><Plus size={18} /> log ekle</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tarih</th><th>Çalışan</th><th>Giriş Saati</th><th>Çıkış Saati</th><th>Durum</th><th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {zamanLoglari.map(z => (
              <tr key={z.id}>
                <td style={{ fontWeight: 500 }}>{new Date(z.tarih).toLocaleDateString('tr-TR')}</td>
                <td><Clock size={16} style={{display:'inline', marginRight:'8px', color:'var(--text-muted)'}} /> {z.ad} {z.soyad}</td>
                <td style={{ color: 'var(--success)' }}>{z.giris_saati}</td>
                <td style={{ color: 'var(--danger)' }}>{z.cikis_saati || '-'}</td>
                <td><span className="status-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent)' }}>Tamamlandı</span></td>
                <td>
                  <button className="action-btn edit" onClick={() => { setForm({ ...z, tarih: z.tarih.split('T')[0] }); setModalAcik(true); }}><Edit2 size={16}/></button>
                  <button className="action-btn delete" onClick={() => sil(z.id)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalAcik} onClose={() => setModalAcik(false)} title={form.id ? 'Log Düzenle' : 'Log Ekle'}>
        <form onSubmit={kaydet}>
          <div className="form-group">
            <label className="label">Çalışan</label>
            <select className="input" required value={form.calisan_id} onChange={e => setForm({...form, calisan_id: e.target.value})}>
              <option value="">Seçiniz</option>
              {calisanlar.map(c => <option key={c.id} value={c.id}>{c.ad} {c.soyad}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Tarih</label>
            <input type="date" className="input" required value={form.tarih} onChange={e => setForm({...form, tarih: e.target.value})} />
          </div>
          <div style={{display:'flex', gap:'12px'}}>
            <div className="form-group flex-1">
              <label className="label">Giriş Saati</label><input type="time" step="1" className="input" required value={form.giris_saati} onChange={e => setForm({...form, giris_saati: e.target.value})} />
            </div>
            <div className="form-group flex-1">
              <label className="label">Çıkış Saati</label><input type="time" step="1" className="input" required value={form.cikis_saati} onChange={e => setForm({...form, cikis_saati: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn w-full mt-4">Kaydet</button>
        </form>
      </Modal>
    </div>
  );
};
export default ZamanTakibi;
