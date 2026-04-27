import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import API_URL from '../api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

const Raporlar = () => {
  const [raporVerisi, setRaporVerisi] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API_URL}/raporlar`, {
      headers: { 'yetki-token': token }
    })
      .then(res => res.json())
      .then(veri => setRaporVerisi(veri))
      .catch(hata => console.error('rapor çekilemedi', hata));
  }, [token]);

  if (!raporVerisi) return <div>yükleniyor...</div>;

  return (
    <div>
      <div className="header-actions">
        <h1>Raporlama ve Analitik</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Departman Dağılımı</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={raporVerisi.departman_dagilimi} cx="50%" cy="50%" outerRadius={100} paddingAngle={5} dataKey="value" label>
                  {raporVerisi.departman_dagilimi.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>İşe Alım Durumları</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={raporVerisi.aday_durumlari}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Aylık Maaş Giderleri (Net)</h3>
        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={raporVerisi.aylik_maas_gideri}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Raporlar;
