import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { navigate('/'); return; }

    login(token);

    api.get('/api/auth/me')
      .then(({ data }) => {
        if (!data.user.role || data.user.role === 'farmer' && !data.user.phone) {
          // First time: no role chosen beyond default
          navigate('/select-role');
        } else {
          navigate('/dashboard');
        }
      })
      .catch(() => navigate('/'));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', gap: 20 }}>
      <div className="spinner" style={{ width: 52, height: 52, borderWidth: 4 }} />
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--green-dark)' }}>Logging you in...</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Please wait a moment</p>
    </div>
  );
};

export default AuthCallback;
