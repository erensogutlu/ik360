import { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../bilesenler/Modal';

const Departmanlar = () => {
  const [departmanlar, setDepartmanlar] = useState([]);
  const [modalAcik, setModalAcik] = useState(false);
  const [form, setForm] = useState({ id: null, ad: '', aciklama: '' });
  const token = localStorage.getItem('token');

  const getir = () => {
    fetch('http://localhost:5000/api/departmanlar', { headers: { 'yetki-token': token } })
      .then(res => res.json()).then(setDepartmanlar).catch(console.error);
  };
  useEffect(() => { getir(); }, [token]);

  const kaydet = async (e) => {
    e.preventDefault();
    const url = form.id ? `http://localhost:5000/api/departmanlar/${form.id}` : 'http://localhost:5000/api/departmanlar';
    const method = form.id ? 'PUT' : 'POST';
    await fetch(url, {
      method, headers: { 'Content-Type': 'application/json', 'yetki-token': token },
      body: JSON.stringify(form)
    });
    setModalAcik(false);
    getir();
  };

  const sil = async (id) => {
    if(!window.confirm('Emin misiniz? Dikkat: Bu departmana ait çalışan varsa silinemez!')) return;
    await fetch(`http://localhost:5000/api/departmanlar/${id}`, { method: 'DELETE', headers: { 'yetki-token': token } });
    getir();
  };

  return (
    <div>
      <div className="header-actions">
        <h1>Departmanlar</h1>
        <button className="btn flex items-center" style={{ gap: '8px' }} onClick={() => { setForm({id:null, ad:'', aciklama:''}); setModalAcik(true); }}>
          <Plus size={18} /> yeni ekle
        </button>
      </div>

      <div className="dashboard-grid">
        {departmanlar.map(d => (
          <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }} key={d.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="stat-icon" style={{ width: '40px', height: '40px' }}><Building2 size={20} /></div>
                <h3 style={{ fontSize: '1.2rem' }}>{d.ad}</h3>
              </div>
              <div style={{ display: 'flex' }}>
                <button className="action-btn edit" onClick={() => { setForm(d); setModalAcik(true); }}><Edit2 size={16}/></button>
                <button className="action-btn delete" onClick={() => sil(d.id)}><Trash2 size={16}/></button>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>{d.aciklama}</p>
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)', width: '100%', fontSize: '0.9rem' }}>
              <strong style={{ color: 'var(--text-main)' }}>{d.personel_sayisi || 0}</strong> Personel Aktif
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalAcik} onClose={() => setModalAcik(false)} title={form.id ? 'Departman Düzenle' : 'Departman Ekle'}>
        <form onSubmit={kaydet}>
          <div className="form-group">
            <label className="label">Departman Adı</label>
            <input className="input" required value={form.ad} onChange={e => setForm({...form, ad: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="label">Açıklama</label>
            <textarea className="input" rows="3" required value={form.aciklama} onChange={e => setForm({...form, aciklama: e.target.value})}></textarea>
          </div>
          <button type="submit" className="btn w-full mt-4">Kaydet</button>
        </form>
      </Modal>
    </div>
  );
};
export default Departmanlar;
