import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, UserPlus, CheckCircle, XCircle, Clock } from 'lucide-react';
import Modal from '../bilesenler/Modal';
import API_URL from '../api';

const IseAlim = () => {
  const [adaylar, setAdaylar] = useState([]);
  const [modalAcik, setModalAcik] = useState(false);
  const [form, setForm] = useState({ id: null, ad: '', soyad: '', eposta: '', pozisyon: '', telefon: '', durum: 'başvurdu', basvuru_tarihi: '' });
  const token = localStorage.getItem('token');

  const getir = () => {
    fetch(`${API_URL}/ise-alim`, { headers: { 'yetki-token': token } })
      .then(res => res.json()).then(setAdaylar).catch(console.error);
  };
  useEffect(() => { getir(); }, [token]);

  const kaydet = async (e) => {
    e.preventDefault();
    const url = form.id ? `${API_URL}/ise-alim/${form.id}` : `${API_URL}/ise-alim`;
    const method = form.id ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'yetki-token': token }, body: JSON.stringify(form) });
    setModalAcik(false);
    getir();
  };

  const sil = async (id) => {
    if(!window.confirm('Emin misiniz?')) return;
    await fetch(`${API_URL}/ise-alim/${id}`, { method: 'DELETE', headers: { 'yetki-token': token } });
    getir();
  };

  const acYeni = () => {
    setForm({ id: null, ad: '', soyad: '', eposta: '', pozisyon: '', telefon: '', durum: 'başvurdu', basvuru_tarihi: new Date().toISOString().split('T')[0] });
    setModalAcik(true);
  };

  return (
    <div>
      <div className="header-actions">
        <h1>İşe Alım (Adaylar)</h1>
        <button className="btn flex items-center" style={{ gap: '8px' }} onClick={acYeni}><Plus size={18} /> yeni aday</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Aday Adı</th>
              <th>Pozisyon</th>
              <th>E-Posta</th>
              <th>Telefon</th>
              <th>Başvuru</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {adaylar.map(aday => (
              <tr key={aday.id}>
                <td style={{ fontWeight: 500 }}><UserPlus size={16} style={{display:'inline', marginRight:'8px', color:'var(--text-muted)'}} /> {aday.ad} {aday.soyad}</td>
                <td>{aday.pozisyon}</td><td style={{ color: 'var(--text-muted)' }}>{aday.eposta}</td><td>{aday.telefon}</td>
                <td>{new Date(aday.basvuru_tarihi).toLocaleDateString('tr-TR')}</td>
                <td><span className="status-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent)' }}>{aday.durum}</span></td>
                <td>
                  <button className="action-btn edit" onClick={() => { setForm({ ...aday, basvuru_tarihi: aday.basvuru_tarihi.split('T')[0] }); setModalAcik(true); }}><Edit2 size={16}/></button>
                  <button className="action-btn delete" onClick={() => sil(aday.id)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalAcik} onClose={() => setModalAcik(false)} title={form.id ? 'Aday Düzenle' : 'Aday Ekle'}>
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
          <div className="form-group">
            <label className="label">Pozisyon</label><input className="input" required value={form.pozisyon} onChange={e => setForm({...form, pozisyon: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="label">Durum</label>
            <select className="input" value={form.durum} onChange={e => setForm({...form, durum: e.target.value})}>
              <option value="başvurdu">Başvurdu</option><option value="mülakat">Mülakat</option>
              <option value="teklif verdi">Teklif Verdi</option><option value="reddedildi">Reddedildi</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">Tarih</label><input type="date" className="input" required value={form.basvuru_tarihi} onChange={e => setForm({...form, basvuru_tarihi: e.target.value})} />
          </div>
          <button type="submit" className="btn w-full mt-4">Kaydet</button>
        </form>
      </Modal>
    </div>
  );
};
export default IseAlim;
