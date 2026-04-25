import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const SelectRole = () => {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selected) { setError('Please select a role to continue.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/api/auth/role', { role: selected });
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      console.error('setRole error:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--green-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: 12, fontSize: '2.5rem' }}>🌾</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--green-dark)', marginBottom: 12 }}>What best describes you?</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40, fontSize: '1rem' }}>Choose your role on FarmLink. You can't change this later.</p>

        {error && <div className="error-msg" style={{ textAlign: 'left', marginBottom: 20 }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
          {[
            { role: 'farmer', icon: '🧑‍🌾', title: 'Farmer', desc: 'I grow crops and want to find guaranteed buyers at fixed prices before the harvest.' },
            { role: 'buyer', icon: '🏪', title: 'Buyer', desc: 'I purchase crops in bulk and want to source directly from verified farmers.' },
          ].map(({ role, icon, title, desc }) => (
            <button
              key={role}
              onClick={() => setSelected(role)}
              style={{
                background: 'white',
                border: `2.5px solid ${selected === role ? 'var(--green-main)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '32px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                boxShadow: selected === role ? 'var(--shadow-green)' : 'var(--shadow-sm)',
                transform: selected === role ? 'translateY(-2px)' : 'none',
              }}
            >
              {selected === role && (
                <div style={{ position: 'absolute', top: 14, right: 14, width: 24, height: 24, borderRadius: '50%', background: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>✓</div>
              )}
              <div style={{ fontSize: '3rem', marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--green-dark)', marginBottom: 10 }}>{title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
            </button>
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={handleContinue}
          disabled={loading || !selected}
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
        >
          {loading ? 'Setting up your account...' : 'Continue →'}
        </button>
      </div>
    </div>
  );
};

export default SelectRole;
