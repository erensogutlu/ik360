import { useState, useEffect } from 'react';
import { Target, Star, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../bilesenler/Modal';

const Performans = () => {
  const [performans, setPerformans] = useState([]);
  const [calisanlar, setCalisanlar] = useState([]);
  const [modalAcik, setModalAcik] = useState(false);
  const [form, setForm] = useState({ id: null, calisan_id: '', puan: 5, yorum: '', tarih: '' });
  const token = localStorage.getItem('token');

  const getir = () => {
    fetch('http://localhost:5000/api/performans', { headers: { 'yetki-token': token } })
      .then(res => res.json()).then(setPerformans).catch(console.error);
    fetch('http://localhost:5000/api/calisanlar', { headers: { 'yetki-token': token } })
      .then(res => res.json()).then(setCalisanlar).catch(console.error);
  };
  useEffect(() => { getir(); }, [token]);

  const kaydet = async (e) => {
    e.preventDefault();
    const url = form.id ? `http://localhost:5000/api/performans/${form.id}` : 'http://localhost:5000/api/performans';
    const method = form.id ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'yetki-token': token }, body: JSON.stringify(form) });
    setModalAcik(false);
    getir();
  };

  const sil = async (id) => {
    if(!window.confirm('Emin misiniz?')) return;
    await fetch(`http://localhost:5000/api/performans/${id}`, { method: 'DELETE', headers: { 'yetki-token': token } });
    getir();
  };

  const acYeni = () => {
    setForm({ id: null, calisan_id: '', puan: 5, yorum: '', tarih: new Date().toISOString().split('T')[0] });
    setModalAcik(true);
  };

  return (
    <div>
      <div className="header-actions">
        <h1>Performans Yönetimi</h1>
        <button className="btn flex items-center" style={{ gap: '8px' }} onClick={acYeni}><Plus size={18} /> değerlendirme yap</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Çalışan</th><th>Departman</th><th>Puan</th><th>Yorum</th><th>Tarih</th><th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {performans.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}><Target size={16} style={{display:'inline', marginRight:'8px', color:'var(--text-muted)'}} /> {p.ad} {p.soyad}</td>
                <td>{p.departman_adi || '-'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', color: '#f59e0b' }}>
                    {Array.from({ length: 5 }).map((_, isx) => (
                      <Star key={isx} fill={isx < p.puan ? '#f59e0b' : 'none'} size={18} />
                    ))}
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{p.yorum}</td>
                <td>{new Date(p.tarih).toLocaleDateString('tr-TR')}</td>
                <td>
                  <button className="action-btn edit" onClick={() => { setForm({ ...p, tarih: p.tarih.split('T')[0] }); setModalAcik(true); }}><Edit2 size={16}/></button>
                  <button className="action-btn delete" onClick={() => sil(p.id)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalAcik} onClose={() => setModalAcik(false)} title={form.id ? 'Değerlendirme Düzenle' : 'Yeni Değerlendirme'}>
        <form onSubmit={kaydet}>
          <div className="form-group">
            <label className="label">Çalışan</label>
            <select className="input" required value={form.calisan_id} onChange={e => setForm({...form, calisan_id: e.target.value})}>
              <option value="">Seçiniz</option>
              {calisanlar.map(c => <option key={c.id} value={c.id}>{c.ad} {c.soyad}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Puan (1-5)</label>
            <input type="number" min="1" max="5" className="input" required value={form.puan} onChange={e => setForm({...form, puan: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="label">Yorum</label>
            <textarea className="input" rows="3" required value={form.yorum} onChange={e => setForm({...form, yorum: e.target.value})}></textarea>
          </div>
          <div className="form-group">
            <label className="label">Tarih</label>
            <input type="date" className="input" required value={form.tarih} onChange={e => setForm({...form, tarih: e.target.value})} />
          </div>
          <button type="submit" className="btn w-full mt-4">Kaydet</button>
        </form>
      </Modal>
    </div>
  );
};
export default Performans;
