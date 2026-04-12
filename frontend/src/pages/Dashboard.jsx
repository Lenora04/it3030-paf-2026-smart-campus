import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';
import { Bell, Calendar, Wrench, BookOpen, ChevronRight } from 'lucide-react';

const quickLinks = [
  { icon: <Calendar size={22} color="#2563eb" />, label: 'My Bookings',
    desc: 'View and manage your room & equipment bookings', color: '#eff6ff', border: '#bfdbfe' },
  { icon: <Wrench size={22} color="#d97706" />, label: 'Maintenance Tickets',
    desc: 'Report faults and track repair progress', color: '#fffbeb', border: '#fde68a' },
  { icon: <BookOpen size={22} color="#16a34a" />, label: 'Browse Resources',
    desc: 'Find available lecture halls, labs and equipment', color: '#f0fdf4', border: '#bbf7d0' },
  { icon: <Bell size={22} color="#7c3aed" />, label: 'Notifications',
    desc: 'View all your alerts and updates', color: '#f5f3ff', border: '#ddd6fe', route: '/notifications' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Navbar */}
      <div style={navStyle}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#1e3a5f' }}>
          🎓 Smart Campus
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user?.role === 'ADMIN' && (
            <button onClick={() => navigate('/admin/dashboard')} style={adminBtn}>
              Admin Panel
            </button>
          )}
          <NotificationBell />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}&background=1e3a5f&color=fff`}
              alt="avatar" style={{ borderRadius: '50%', width: 36, height: 36 }} />
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={logout} style={logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Hero banner */}
      <div style={heroBanner}>
        <div style={{ maxWidth: 700 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'white' }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>
            Welcome to the Smart Campus Operations Hub. Manage your bookings, report issues, and stay updated.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Quick links */}
        <h3 style={{ margin: '0 0 16px', color: '#374151', fontSize: 16, fontWeight: 600 }}>
          Quick Access
        </h3>
        <div style={gridStyle}>
          {quickLinks.map((item) => (
            <div key={item.label}
              onClick={() => item.route && navigate(item.route)}
              style={{
                ...cardStyle,
                background: item.color,
                border: `1.5px solid ${item.border}`,
                cursor: item.route ? 'pointer' : 'default',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={iconBox}>{item.icon}</div>
                {item.route && <ChevronRight size={16} color="#9ca3af" />}
              </div>
              <h4 style={{ margin: '12px 0 4px', fontSize: 15, color: '#111827' }}>{item.label}</h4>
              <p style={{ margin: 0, fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Info section */}
        <div style={infoRow}>
          <div style={infoCard}>
            <h4 style={{ margin: '0 0 12px', color: '#1e3a5f', fontSize: 15 }}>📋 How it works</h4>
            <ul style={{ margin: 0, paddingLeft: 18, color: '#4b5563', fontSize: 13, lineHeight: 2 }}>
              <li>Browse available resources and make a booking request</li>
              <li>Admin reviews and approves or rejects your request</li>
              <li>You'll be notified of any status changes instantly</li>
              <li>Report maintenance issues with photo evidence</li>
            </ul>
          </div>
          <div style={infoCard}>
            <h4 style={{ margin: '0 0 12px', color: '#1e3a5f', fontSize: 15 }}>🏫 Campus Resources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Lecture Halls', icon: '🏛️' },
                { label: 'Computer Labs', icon: '💻' },
                { label: 'Meeting Rooms', icon: '🤝' },
                { label: 'Equipment (Projectors, Cameras)', icon: '📷' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', background: '#f8fafc', borderRadius: 8 }}>
                  <span>{r.icon}</span>
                  <span style={{ fontSize: 13, color: '#374151' }}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const navStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '12px 40px', background: 'white',
  boxShadow: '0 1px 4px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 30,
};
const heroBanner = {
  background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
  padding: '40px 64px', marginBottom: 0,
};
const gridStyle = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: 16, marginBottom: 32,
};
const cardStyle = {
  borderRadius: 12, padding: '20px', transition: 'transform 0.15s, box-shadow 0.15s',
};
const iconBox = {
  width: 44, height: 44, borderRadius: 10, background: 'white',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
};
const infoRow = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
};
const infoCard = {
  background: 'white', borderRadius: 12, padding: 24,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};
const adminBtn = {
  padding: '6px 14px', background: '#dc2626', color: 'white',
  border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
};
const logoutBtn = {
  padding: '6px 14px', background: '#1e3a5f', color: 'white',
  border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13,
};