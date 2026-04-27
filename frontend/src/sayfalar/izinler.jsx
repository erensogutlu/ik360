import { useState, useEffect } from 'react';
import { CalendarRange, Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '../bilesenler/Modal';

const Izinler = () => {
  const [izinler, setIzinler] = useState([]);
  const [calisanlar, setCalisanlar] = useState([]);
  const [modalAcik, setModalAcik] = useState(false);
  const [form, setForm] = useState({ id: null, calisan_id: '', izin_turu: 'yıllık izin', baslangic_tarihi: '', bitis_tarihi: '', sebep: '', durum: 'bekliyor' });
  const token = localStorage.getItem('token');

  const getir = () => {
    fetch('http://localhost:5000/api/izinler', { headers: { 'yetki-token': token } })
      .then(res => res.json()).then(setIzinler).catch(console.error);
    fetch('http://localhost:5000/api/calisanlar', { headers: { 'yetki-token': token } })
      .then(res => res.json()).then(setCalisanlar).catch(console.error);
  };
  useEffect(() => { getir(); }, [token]);

  const kaydet = async (e) => {
    e.preventDefault();
    const url = form.id ? `http://localhost:5000/api/izinler/${form.id}` : 'http://localhost:5000/api/izinler';
    const method = form.id ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'yetki-token': token }, body: JSON.stringify(form) });
    setModalAcik(false);
    getir();
  };

  const sil = async (id) => {
    if(!window.confirm('Emin misiniz?')) return;
    await fetch(`http://localhost:5000/api/izinler/${id}`, { method: 'DELETE', headers: { 'yetki-token': token } });
    getir();
  };

  const acYeni = () => {
    setForm({ id: null, calisan_id: '', izin_turu: 'yıllık izin', baslangic_tarihi: new Date().toISOString().split('T')[0], bitis_tarihi: new Date().toISOString().split('T')[0], sebep: '', durum: 'bekliyor' });
    setModalAcik(true);
  };

  return (
    <div>
      <div className="header-actions">
        <h1>İzin Talepleri</h1>
        <button className="btn flex items-center" style={{ gap: '8px' }} onClick={acYeni}><Plus size={18} /> yeni talep oluştur</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Çalışan</th><th>İzin Türü</th><th>Başlangıç</th><th>Bitiş</th><th>Durum</th><th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {izinler.map(izin => (
              <tr key={izin.id}>
                <td style={{ fontWeight: 500 }}><CalendarRange size={16} style={{display:'inline', marginRight:'8px', color:'var(--text-muted)'}} /> {izin.ad} {izin.soyad}</td>
                <td>{izin.izin_turu}</td>
                <td>{new Date(izin.baslangic_tarihi).toLocaleDateString('tr-TR')}</td>
                <td>{new Date(izin.bitis_tarihi).toLocaleDateString('tr-TR')}</td>
                <td>
                  <span className={`status-badge status-${izin.durum === 'onaylandi' ? 'onaylandi' : izin.durum === 'reddedildi' ? 'reddedildi' : 'bekliyor'}`}>
                    {izin.durum}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit" onClick={() => { setForm({ ...izin, baslangic_tarihi: izin.baslangic_tarihi.split('T')[0], bitis_tarihi: izin.bitis_tarihi.split('T')[0] }); setModalAcik(true); }}><Edit2 size={16}/></button>
                  <button className="action-btn delete" onClick={() => sil(izin.id)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalAcik} onClose={() => setModalAcik(false)} title={form.id ? 'İzin Düzenle' : 'İzin Talebi'}>
        <form onSubmit={kaydet}>
          <div className="form-group">
            <label className="label">Çalışan</label>
            <select className="input" required value={form.calisan_id} onChange={e => setForm({...form, calisan_id: e.target.value})}>
              <option value="">Seçiniz</option>
              {calisanlar.map(c => <option key={c.id} value={c.id}>{c.ad} {c.soyad}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">İzin Türü</label>
            <select className="input" value={form.izin_turu} onChange={e => setForm({...form, izin_turu: e.target.value})}>
              <option value="yıllık izin">Yıllık İzin</option><option value="mazeret izni">Mazeret İzni</option><option value="hastalık izni">Hastalık İzni</option>
            </select>
          </div>
          <div style={{display:'flex', gap:'12px'}}>
            <div className="form-group flex-1">
              <label className="label">Başlangıç</label><input type="date" className="input" required value={form.baslangic_tarihi} onChange={e => setForm({...form, baslangic_tarihi: e.target.value})} />
            </div>
            <div className="form-group flex-1">
              <label className="label">Bitiş</label><input type="date" className="input" required value={form.bitis_tarihi} onChange={e => setForm({...form, bitis_tarihi: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Sebep / Açıklama</label><textarea className="input" rows="2" value={form.sebep} onChange={e => setForm({...form, sebep: e.target.value})}></textarea>
          </div>
          <div className="form-group">
            <label className="label">Durum</label>
            <select className="input" value={form.durum} onChange={e => setForm({...form, durum: e.target.value})}>
              <option value="bekliyor">Bekliyor</option><option value="onaylandi">Onaylandı</option><option value="reddedildi">Reddedildi</option>
            </select>
          </div>
          <button type="submit" className="btn w-full mt-4">Kaydet</button>
        </form>
      </Modal>
    </div>
  );
};
export default Izinler;
