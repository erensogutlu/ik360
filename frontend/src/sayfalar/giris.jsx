import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Giris = () => {
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');
  const yonlendir = useNavigate();

  const girisYap = async (e) => {
    e.preventDefault();
    setHata('');

    try {
      const yanit = await fetch('http://localhost:5000/api/auth/giris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eposta, sifre })
      });

      const veri = await yanit.json();

      if (yanit.ok) {
        localStorage.setItem('token', veri.token);
        localStorage.setItem('kullanici', JSON.stringify(veri.kullanici));
        yonlendir('/');
      } else {
        setHata(veri.mesaj);
      }
    } catch (hata) {
      setHata('Sunucuya bağlanılamadı.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span className="logo-text" style={{ fontSize: '2.5rem' }}>ik360.</span>
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '400', letterSpacing: 'normal' }}>Platform Girişi</span>
        </h2>
        
        {hata && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
            {hata}
          </div>
        )}

        <form onSubmit={girisYap}>
          <div className="form-group">
            <label className="label">E-Posta</label>
            <input 
              type="email" 
              className="input" 
              value={eposta} 
              onChange={(e) => setEposta(e.target.value)} 
              required 
              placeholder="admin@ik360.com"
            />
          </div>
          <div className="form-group">
            <label className="label">Şifre</label>
            <input 
              type="password" 
              className="input" 
              value={sifre} 
              onChange={(e) => setSifre(e.target.value)} 
              required 
              placeholder="admin123"
            />
          </div>
          <button type="submit" className="btn w-full mt-4" style={{ marginTop: '16px' }}>Giriş Yap</button>
        </form>
        
        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.85rem' }}>
          <a href="https://github.com/erensogutlu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            erensogutlu
          </a>
        </div>
      </div>
    </div>
  );
};

export default Giris;
