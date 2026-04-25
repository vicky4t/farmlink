import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', formData);
      if (data.success) {
        login(data.token);
        await refreshUser();
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(150deg, var(--green-darkest) 0%, #1a3a2a 40%, #2d5a3d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🌾</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'white', marginBottom: 8 }}>FarmLink</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Direct contracts for farmers and buyers</p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 24px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--green-dark)', marginBottom: 24, textAlign: 'center' }}>Login</h2>

          {error && (
            <div style={{
              background: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid #f44336',
              color: '#f44336',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: 20,
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--green-main)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--green-main)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                marginBottom: 16,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
              Don't have an account?
            </p>
            <Link
              to="/signup"
              style={{
                color: 'var(--green-main)',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--green-dark)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--green-main)'}
            >
              Create an account →
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div style={{
          marginTop: 24,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.875rem'
        }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>📝 Demo Credentials:</p>
          <p>Email: <code style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>farmer@demo.com</code></p>
          <p>Password: <code style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>demo123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
