import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Giris from './sayfalar/giris';
import KontrolPaneli from './sayfalar/kontrol_paneli';
import Calisanlar from './sayfalar/calisanlar';
import Departmanlar from './sayfalar/departmanlar';
import Izinler from './sayfalar/izinler';
import IseAlim from './sayfalar/ise_alim';
import Bordro from './sayfalar/bordro';
import Performans from './sayfalar/performans';
import ZamanTakibi from './sayfalar/zaman_takibi';
import Raporlar from './sayfalar/raporlar';
import YanMenu from './bilesenler/yan_menu';

// korumalı rota bileşeni
const KorumaliRota = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/giris" />;
  
  return (
    <div className="app-layout">
      <YanMenu />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/giris" element={<Giris />} />
        <Route path="/" element={<KorumaliRota><KontrolPaneli /></KorumaliRota>} />
        <Route path="/calisanlar" element={<KorumaliRota><Calisanlar /></KorumaliRota>} />
        <Route path="/departmanlar" element={<KorumaliRota><Departmanlar /></KorumaliRota>} />
        <Route path="/izinler" element={<KorumaliRota><Izinler /></KorumaliRota>} />
        <Route path="/ise-alim" element={<KorumaliRota><IseAlim /></KorumaliRota>} />
        <Route path="/bordro" element={<KorumaliRota><Bordro /></KorumaliRota>} />
        <Route path="/performans" element={<KorumaliRota><Performans /></KorumaliRota>} />
        <Route path="/zaman-takibi" element={<KorumaliRota><ZamanTakibi /></KorumaliRota>} />
        <Route path="/raporlar" element={<KorumaliRota><Raporlar /></KorumaliRota>} />
      </Routes>
    </Router>
  );
}

export default App;
