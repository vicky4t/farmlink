import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (data.success) {
        login(data.token);
        await refreshUser();
        navigate('/select-role');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--green-dark)', marginBottom: 24, textAlign: 'center' }}>Create Account</h2>

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
            {/* Name Field */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 8 }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
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

            {/* Email Field */}
            <div style={{ marginBottom: 16 }}>
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
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
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

            {/* Confirm Password Field */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 8 }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Login Link */}
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
              Already have an account?
            </p>
            <Link
              to="/login"
              style={{
                color: 'var(--green-main)',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--green-dark)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--green-main)'}
            >
              Login here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
