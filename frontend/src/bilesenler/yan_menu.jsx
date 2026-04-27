import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, CalendarRange, Network, UserPlus, Banknote, Target, Clock, BarChart3, Menu, X } from 'lucide-react';

const YanMenu = () => {
  const [menuAcik, setMenuAcik] = useState(false);
  const yonlendir = useNavigate();
  const kullaniciVerisi = localStorage.getItem('kullanici');
  const kullanici = kullaniciVerisi ? JSON.parse(kullaniciVerisi) : null;

  const cikisYap = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('kullanici');
    yonlendir('/giris');
  };

  const toggleMenu = () => setMenuAcik(!menuAcik);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-text" style={{ fontSize: '2rem' }}>ik360.</span>
        </div>
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {menuAcik ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`sidebar-content ${menuAcik ? 'open' : ''}`}>
        <nav className="menu-list">
          <NavLink to="/" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} end onClick={() => setMenuAcik(false)}>
            <LayoutDashboard size={20} />
            <span>Kontrol Paneli</span>
          </NavLink>
          <NavLink to="/calisanlar" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={() => setMenuAcik(false)}>
            <Users size={20} />
            <span>Çalışanlar</span>
          </NavLink>
          <NavLink to="/departmanlar" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={() => setMenuAcik(false)}>
            <Network size={20} />
            <span>Departmanlar</span>
          </NavLink>
          <NavLink to="/ise-alim" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={() => setMenuAcik(false)}>
            <UserPlus size={20} />
            <span>İşe Alım</span>
          </NavLink>
          <NavLink to="/zaman-takibi" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={() => setMenuAcik(false)}>
            <Clock size={20} />
            <span>Zaman Takibi</span>
          </NavLink>
          <NavLink to="/izinler" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={() => setMenuAcik(false)}>
            <CalendarRange size={20} />
            <span>İzin Talepleri</span>
          </NavLink>
          <NavLink to="/performans" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={() => setMenuAcik(false)}>
            <Target size={20} />
            <span>Performans</span>
          </NavLink>
          <NavLink to="/bordro" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={() => setMenuAcik(false)}>
            <Banknote size={20} />
            <span>Maaş ve Bordro</span>
          </NavLink>
          <NavLink to="/raporlar" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`} onClick={() => setMenuAcik(false)}>
            <BarChart3 size={20} />
            <span>Raporlar</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Hoşgeldin, <br/><strong style={{ color: 'var(--text-main)' }}>{kullanici?.ad_soyad}</strong>
          </div>
          <button onClick={cikisYap} className="btn btn-danger w-full flex items-center justify-center" style={{ gap: '8px' }}>
            <LogOut size={16} />
            Çıkış Yap
          </button>
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.8rem' }}>
            <a href="https://github.com/erensogutlu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              erensogutlu
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default YanMenu;
