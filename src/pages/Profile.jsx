import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Toast = ({ msg, type, onClose }) => (
  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: type === 'success' ? 'var(--green-dark)' : 'var(--red)', color: 'white', padding: '14px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 280, animation: 'toastIn 0.3s ease' }}>
    <span>{msg}</span>
    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 'auto' }}>✕</button>
  </div>
);

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ phone: '', state: '', district: '', village: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        phone: user.phone || '',
        state: user.location?.state || '',
        district: user.location?.district || '',
        village: user.location?.village || '',
      });
    }
  }, [user]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/update-profile', form);
      await refreshUser();
      showToast('✅ Profile updated successfully!');
    } catch (err) {
      console.error('updateProfile error:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="page-wrap">
      <div className="container">
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="page-header">
            <h1>My Profile</h1>
            <p>Manage your account information and location details.</p>
          </div>

          {/* Profile card */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {user.photo ? (
                <img src={user.photo} alt={user.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--green-pale)' }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-main), var(--green-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.8rem', fontWeight: 700 }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--green-dark)', marginBottom: 6 }}>{user.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 8 }}>{user.email}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className={`badge ${user.role === 'farmer' ? 'badge-green' : 'badge-blue'}`}>
                    {user.role === 'farmer' ? '🧑‍🌾' : '🏪'} {user.role}
                  </span>
                  {user.isVerified && (
                    <span className="badge badge-green">✓ Verified</span>
                  )}
                  <span className="badge badge-gray">Joined {joinedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--green-dark)', marginBottom: 20 }}>Edit Information</h3>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-input" type="text" value={user.name} disabled style={{ background: '#f8f8f8', cursor: 'not-allowed', color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Name is synced from your Google account.</span>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input className="form-input" type="email" value={user.email} disabled style={{ background: '#f8f8f8', cursor: 'not-allowed', color: 'var(--text-muted)' }} />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>

              <div className="divider" />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 16 }}>📍 Location</h4>

              <div className="form-group">
                <label>State</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={form.state}
                  onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>District</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Pune"
                    value={form.district}
                    onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Village / Town</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Khed"
                    value={form.village}
                    onChange={e => setForm(f => ({ ...f, village: e.target.value }))}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                {loading ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </form>
          </div>

          {/* Danger zone */}
          <div className="card" style={{ marginTop: 24, border: '1px solid #fed7d7' }}>
            <h4 style={{ color: 'var(--red)', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>Account</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 12 }}>
              Your account is linked to Google OAuth. To completely remove your account, please contact support.
            </p>
            <a href="http://localhost:5000/api/auth/logout" style={{ color: 'var(--red)', fontSize: '0.875rem', fontWeight: 500 }}>
              Sign out from all devices →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
