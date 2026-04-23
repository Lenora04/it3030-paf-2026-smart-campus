import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING: '#f59e0b', APPROVED: '#16a34a', REJECTED: '#ef4444', CANCELLED: '#6b7280',
};

const STATUS_BG = {
  PENDING: '#fffbeb', APPROVED: '#f0fdf4', REJECTED: '#fef2f2', CANCELLED: '#f9fafb',
};

export default function MyBookings({ userEmail }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8080/api/bookings/my?userEmail=${userEmail}`)
      .then(res => setBookings(res.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [userEmail]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await axios.delete(`http://localhost:8080/api/bookings/${id}?userEmail=${userEmail}`);
      setBookings(bookings.map(b => b.id === id ? res.data : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const filtered = filter ? bookings.filter(b => b.status === filter) : bookings;

  if (loading) return <div style={emptyState}>Loading your bookings...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: '#1e3a5f' }}>My Bookings</h2>
        <div style={{ display: 'flex', gap: 6 }}>
          {['', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => (
            <button key={s || 'ALL'} onClick={() => setFilter(s)} style={{
              padding: '5px 12px', border: 'none', borderRadius: 6, cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
              background: filter === s ? '#1e3a5f' : 'white',
              color: filter === s ? 'white' : '#6b7280',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              {s || 'ALL'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <div style={emptyState}>📭 No bookings found.</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(b => (
          <div key={b.id} style={{
            background: STATUS_BG[b.status] || 'white',
            borderRadius: 12, padding: '18px 22px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: `1.5px solid ${STATUS_COLORS[b.status]}33`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong style={{ fontSize: 16, color: '#111827' }}>{b.resourceName}</strong>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '4px 10px',
                borderRadius: 20, color: 'white', background: STATUS_COLORS[b.status],
              }}>
                {b.status}
              </span>
            </div>
            <p style={pStyle}>📅 {new Date(b.startTime).toLocaleString()} → {new Date(b.endTime).toLocaleString()}</p>
            <p style={pStyle}>📝 {b.purpose}</p>
            {b.expectedAttendees && <p style={pStyle}>👥 {b.expectedAttendees} attendees</p>}
            {b.adminReason && (
              <p style={{ ...pStyle, fontStyle: 'italic', color: '#9ca3af' }}>
                💬 Admin note: {b.adminReason}
              </p>
            )}
            {b.status === 'APPROVED' && (
              <button onClick={() => handleCancel(b.id)} style={{
                marginTop: 10, padding: '7px 16px', background: '#dc2626',
                color: 'white', border: 'none', borderRadius: 7,
                cursor: 'pointer', fontWeight: 600, fontSize: 13, width: 'fit-content',
              }}>
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const pStyle = { margin: '4px 0', fontSize: 14, color: '#4b5563', textAlign: 'left' };
const emptyState = { textAlign: 'center', color: '#9ca3af', padding: 40, background: 'white', borderRadius: 12, fontSize: 15 };