import { useState, useEffect } from 'react';
import { Banknote, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../bilesenler/Modal';

const Bordro = () => {
  const [bordrolar, setBordrolar] = useState([]);
  const [calisanlar, setCalisanlar] = useState([]);
  const [modalAcik, setModalAcik] = useState(false);
  const [form, setForm] = useState({ id: null, calisan_id: '', ay: '', yil: 2026, brut_maas: '', net_maas: '', kesintiler: 0, durum: 'ödendi' });
  const token = localStorage.getItem('token');

  const getir = () => {
    fetch('http://localhost:5000/api/bordro', { headers: { 'yetki-token': token } })
      .then(res => res.json()).then(setBordrolar).catch(console.error);
    fetch('http://localhost:5000/api/calisanlar', { headers: { 'yetki-token': token } })
      .then(res => res.json()).then(setCalisanlar).catch(console.error);
  };
  useEffect(() => { getir(); }, [token]);

  const kaydet = async (e) => {
    e.preventDefault();
    const url = form.id ? `http://localhost:5000/api/bordro/${form.id}` : 'http://localhost:5000/api/bordro';
    const method = form.id ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'yetki-token': token }, body: JSON.stringify(form) });
    setModalAcik(false);
    getir();
  };

  const sil = async (id) => {
    if(!window.confirm('Emin misiniz?')) return;
    await fetch(`http://localhost:5000/api/bordro/${id}`, { method: 'DELETE', headers: { 'yetki-token': token } });
    getir();
  };

  const acYeni = () => {
    setForm({ id: null, calisan_id: '', ay: new Date().getMonth() + 1, yil: new Date().getFullYear(), brut_maas: '', net_maas: '', kesintiler: 0, durum: 'ödendi' });
    setModalAcik(true);
  };

  return (
    <div>
      <div className="header-actions">
        <h1>Maaş ve Bordro</h1>
        <button className="btn flex items-center" style={{ gap: '8px' }} onClick={acYeni}><Plus size={18} /> yeni bordro</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Çalışan</th><th>Dönem</th><th>Brüt Maaş</th><th>Kesintiler</th><th>Net Maaş</th><th>Durum</th><th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {bordrolar.map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 500 }}><Banknote size={16} style={{display:'inline', marginRight:'8px', color:'var(--text-muted)'}} /> {b.ad} {b.soyad}</td>
                <td>{b.ay} / {b.yil}</td>
                <td>{parseInt(b.brut_maas).toLocaleString('tr-TR')} ₺</td>
                <td style={{ color: 'var(--danger)' }}>-{parseInt(b.kesintiler).toLocaleString('tr-TR')} ₺</td>
                <td style={{ color: 'var(--success)', fontWeight: 'bold' }}>{parseInt(b.net_maas).toLocaleString('tr-TR')} ₺</td>
                <td><span className="status-badge status-onaylandi">{b.durum}</span></td>
                <td>
                  <button className="action-btn edit" onClick={() => { setForm(b); setModalAcik(true); }}><Edit2 size={16}/></button>
                  <button className="action-btn delete" onClick={() => sil(b.id)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalAcik} onClose={() => setModalAcik(false)} title={form.id ? 'Bordro Düzenle' : 'Bordro Ekle'}>
        <form onSubmit={kaydet}>
          <div className="form-group">
            <label className="label">Çalışan</label>
            <select className="input" required value={form.calisan_id} onChange={e => setForm({...form, calisan_id: e.target.value})}>
              <option value="">Seçiniz</option>
              {calisanlar.map(c => <option key={c.id} value={c.id}>{c.ad} {c.soyad}</option>)}
            </select>
          </div>
          <div style={{display:'flex', gap:'12px'}}>
            <div className="form-group flex-1">
              <label className="label">Ay</label><input type="number" className="input" required value={form.ay} onChange={e => setForm({...form, ay: e.target.value})} />
            </div>
            <div className="form-group flex-1">
              <label className="label">Yıl</label><input type="number" className="input" required value={form.yil} onChange={e => setForm({...form, yil: e.target.value})} />
            </div>
          </div>
          <div style={{display:'flex', gap:'12px'}}>
            <div className="form-group flex-1">
              <label className="label">Brüt Maaş</label>
              <input type="number" className="input" required value={form.brut_maas} onChange={e => {
                const b = parseFloat(e.target.value) || 0; const k = parseFloat(form.kesintiler) || 0;
                setForm({...form, brut_maas: b, net_maas: b - k});
              }} />
            </div>
            <div className="form-group flex-1">
              <label className="label">Kesintiler</label>
              <input type="number" className="input" required value={form.kesintiler} onChange={e => {
                const k = parseFloat(e.target.value) || 0; const b = parseFloat(form.brut_maas) || 0;
                setForm({...form, kesintiler: k, net_maas: b - k});
              }} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Net Maaş (Otomatik)</label><input type="number" className="input" disabled value={form.net_maas} />
          </div>
          <div className="form-group">
            <label className="label">Durum</label>
            <select className="input" value={form.durum} onChange={e => setForm({...form, durum: e.target.value})}>
              <option value="beklemede">Beklemede</option><option value="ödendi">Ödendi</option>
            </select>
          </div>
          <button type="submit" className="btn w-full mt-4">Kaydet</button>
        </form>
      </Modal>
    </div>
  );
};
export default Bordro;
