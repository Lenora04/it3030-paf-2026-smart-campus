import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Get user info from Google
      const googleUser = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });

      const userData = await loginWithGoogle(googleUser.data);

      if (userData.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    },
    onError: () => alert('Google login failed. Please try again.'),
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎓 Smart Campus</h1>
        <p style={styles.subtitle}>Operations Hub</p>
        <p style={styles.desc}>Sign in to manage bookings, facilities, and maintenance tickets.</p>
        <button style={styles.button} onClick={() => handleGoogleLogin()}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={{ width: 20, marginRight: 10 }}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
  },
  card: {
    background: 'white',
    borderRadius: 16,
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    maxWidth: 400,
    width: '100%',
  },
  title: { fontSize: 32, margin: 0, color: '#1e3a5f' },
  subtitle: { color: '#2d6a9f', fontSize: 16, marginTop: 4 },
  desc: { color: '#666', margin: '24px 0', lineHeight: 1.6 },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: 8,
    background: 'white',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
    transition: 'all 0.2s',
  },
};