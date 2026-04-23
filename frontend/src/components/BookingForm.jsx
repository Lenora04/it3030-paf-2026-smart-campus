import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const STUDENT_ALLOWED_TYPES = ['LAB', 'MEETING_ROOM'];

export default function BookingForm({ userEmail, userName, userRole, preSelected, onSuccess }) {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceId: '',
    resourceName: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: 1,
  });
  const [loading, setLoading] = useState(false);
  const [resourcesLoading, setResourcesLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/resources?status=ACTIVE')
      .then(res => {
        let data = res.data;
        if (userRole === 'USER') {
          data = data.filter(r => STUDENT_ALLOWED_TYPES.includes(r.type));
        }
        setResources(data);
      })
      .catch(() => toast.error('Could not load resources from server'))
      .finally(() => setResourcesLoading(false));
  }, [userRole]);

  useEffect(() => {
    if (preSelected?.resource?.id) {
      setForm(f => ({
        ...f,
        resourceId: preSelected.resource.id,
        resourceName: preSelected.resource.name,
        startTime: preSelected.slot?.start || '',
        endTime: preSelected.slot?.end || '',
      }));
    }
  }, [preSelected]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleResourceSelect = (e) => {
    const selected = resources.find(r => r.id === Number(e.target.value));
    if (selected) setForm({ ...form, resourceId: selected.id, resourceName: selected.name });
  };

  const handleSubmit = async () => {
    if (!form.resourceId || !form.startTime || !form.endTime || !form.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.endTime <= form.startTime) {
      toast.error('End time must be after start time');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/bookings?userEmail=${userEmail}&userName=${encodeURIComponent(userName)}`,
        {
          resourceId: Number(form.resourceId),
          resourceName: form.resourceName,
          startTime: form.startTime,
          endTime: form.endTime,
          purpose: form.purpose,
          expectedAttendees: Number(form.expectedAttendees),
        }
      );
      toast.success('✅ Booking request submitted! Waiting for approval.');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={formCard}>
      <h2 style={{ margin: '0 0 8px', fontSize: 18, color: '#1e3a5f', textAlign: 'left' }}>
        Request a Booking
      </h2>

      {userRole === 'USER' && (
        <div style={infoBox}>
          ℹ️ As a student, you can book <strong>Labs</strong> and <strong>Meeting Rooms</strong> only.
        </div>
      )}

      <div style={fg}>
        <label style={ls}>Select Resource *</label>
        {resourcesLoading ? (
          <p style={{ color: '#9ca3af', fontSize: 14 }}>Loading resources...</p>
        ) : (
          <select value={form.resourceId} onChange={handleResourceSelect} style={is}>
            <option value="">-- Select a resource --</option>
            {resources.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.type?.replace(/_/g, ' ')} — {r.location}{r.capacity ? ` — Cap: ${r.capacity}` : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      <div style={fg}>
        <label style={ls}>Start Date & Time *</label>
        <input name="startTime" type="datetime-local" value={form.startTime}
          onChange={handleChange} style={{ ...is, colorScheme: 'light' }} />
      </div>

      <div style={fg}>
        <label style={ls}>End Date & Time *</label>
        <input name="endTime" type="datetime-local" value={form.endTime}
          onChange={handleChange} style={{ ...is, colorScheme: 'light' }} />
      </div>

      <div style={fg}>
        <label style={ls}>Purpose *</label>
        <input name="purpose" placeholder="e.g. Group project meeting"
          value={form.purpose} onChange={handleChange} style={is} />
      </div>

      <div style={fg}>
        <label style={ls}>Expected Attendees</label>
        <input name="expectedAttendees" type="number" min="1"
          value={form.expectedAttendees} onChange={handleChange} style={is} />
      </div>

      <button onClick={handleSubmit} disabled={loading} style={{
        padding: '11px 24px', background: loading ? '#9ca3af' : '#1e3a5f',
        color: 'white', border: 'none', borderRadius: 8, fontSize: 14,
        fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', width: 'fit-content',
      }}>
        {loading ? 'Submitting...' : 'Submit Booking Request'}
      </button>
    </div>
  );
}

const formCard = { background: 'white', borderRadius: 14, padding: '28px 32px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 16 };
const fg = { display: 'flex', flexDirection: 'column', gap: 5 };
const ls = { fontWeight: 600, fontSize: 13, color: '#374151', textAlign: 'left' };
const is = { padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', color: '#111827', background: 'white', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' };
const infoBox = { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1d4ed8' };