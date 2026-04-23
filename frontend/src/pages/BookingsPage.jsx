import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import MyBookings from '../components/MyBookings';

// Temporary user — will be replaced by Lenora's useAuth() after merge
const TEMP_USER = { 
  email: 'student@test.com', 
  name: 'Test Student', 
  role: 'USER',
  picture: null
};

export default function BookingsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('my');
  const [preSelected, setPreSelected] = useState(null);

  useEffect(() => {
    const resourceId = searchParams.get('resourceId');
    const resourceName = searchParams.get('resourceName');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    if (resourceId && start) {
      setPreSelected({
        resource: { id: Number(resourceId), name: resourceName },
        slot: { start, end }
      });
      setActiveTab('new');
    }
  }, [searchParams]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      <div style={navStyle}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#1e3a5f' }}>
          🎓 Smart Campus
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/admin/bookings')} style={adminBtn}>
            Admin Bookings
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
              {TEMP_USER.name[0]}
            </div>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{TEMP_USER.name}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{TEMP_USER.role}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={heroBanner}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'white' }}>
          📅 Booking Management
        </h1>
        <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
          Book labs and meeting rooms for your activities
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={tabBar}>
          <button style={activeTab === 'my' ? activeTabStyle : inactiveTabStyle}
            onClick={() => setActiveTab('my')}>
            My Bookings
          </button>
          <button style={activeTab === 'new' ? activeTabStyle : inactiveTabStyle}
            onClick={() => { setPreSelected(null); setActiveTab('new'); }}>
            + New Booking
          </button>
        </div>

        {activeTab === 'my' && <MyBookings userEmail={TEMP_USER.email} />}
        {activeTab === 'new' && (
          <BookingForm
            userEmail={TEMP_USER.email}
            userName={TEMP_USER.name}
            userRole={TEMP_USER.role}
            preSelected={preSelected}
            onSuccess={() => setActiveTab('my')}
          />
        )}
      </div>
    </div>
  );
}

const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 30 };
const heroBanner = { background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)', padding: '32px 64px' };
const tabBar = { display: 'flex', gap: 4, marginBottom: 24, background: 'white', borderRadius: 10, padding: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', width: 'fit-content' };
const activeTabStyle = { padding: '8px 20px', border: 'none', background: '#1e3a5f', color: 'white', fontSize: 14, fontWeight: 600, borderRadius: 7, cursor: 'pointer' };
const inactiveTabStyle = { padding: '8px 20px', border: 'none', background: 'none', color: '#6b7280', fontSize: 14, fontWeight: 600, borderRadius: 7, cursor: 'pointer' };
const adminBtn = { padding: '6px 14px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 };