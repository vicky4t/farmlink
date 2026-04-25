import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CATEGORIES = ['grain', 'vegetable', 'fruit', 'spice', 'oilseed', 'other'];

const Toast = ({ msg, type }) => (
  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: type === 'success' ? 'var(--green-dark)' : 'var(--red)', color: 'white', padding: '14px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 10, minWidth: 280, animation: 'toastIn 0.3s ease' }}>
    {msg}
  </div>
);

const ListCrop = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ cropName: '', category: '', quantity: '', expectedPrice: '', harvestDate: '', state: '', district: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  if (user?.role !== 'farmer') {
    return (
      <div className="page-wrap"><div className="container">
        <div className="empty-state">
          <div className="empty-icon">🚫</div>
          <h3>Farmers Only</h3>
          <p>Only farmers can list crops on FarmLink.</p>
        </div>
      </div></div>
    );
  }

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    if (!form.cropName.trim()) return 'Crop name is required.';
    if (!form.category) return 'Please select a category.';
    if (!form.quantity || Number(form.quantity) <= 0) return 'Quantity must be greater than 0.';
    if (!form.expectedPrice || Number(form.expectedPrice) <= 0) return 'Expected price must be greater than 0.';
    if (!form.harvestDate) return 'Harvest date is required.';
    if (new Date(form.harvestDate) <= new Date()) return 'Harvest date must be in the future.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');
    setLoading(true);

    try {
      await api.post('/api/crops', {
        cropName: form.cropName.trim(),
        category: form.category,
        quantity: Number(form.quantity),
        expectedPrice: Number(form.expectedPrice),
        harvestDate: form.harvestDate,
        state: form.state.trim(),
        district: form.district.trim(),
        description: form.description.trim(),
      });
      setToast({ msg: '✅ Crop listed successfully! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (err) {
      console.error('listCrop error:', err);
      setError(err.response?.data?.message || 'Failed to list crop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const estimatedValue = form.quantity && form.expectedPrice
    ? (Number(form.quantity) * Number(form.expectedPrice)).toLocaleString('en-IN')
    : null;

  return (
    <div className="page-wrap">
      <div className="container">
        {toast && <Toast msg={toast.msg} type={toast.type} />}

        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div className="page-header">
            <h1>List Your Crop</h1>
            <p>Fill in the details below. Buyers will be able to discover and offer on your listing.</p>
          </div>

          <div className="card">
            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Crop Name + Category */}
              <div className="grid-2">
                <div className="form-group">
                  <label>Crop Name *</label>
                  <input className="form-input" type="text" placeholder="e.g. Basmati Rice, Alphonso Mango" value={form.cropName} onChange={e => handleChange('cropName', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select className="form-input" value={form.category} onChange={e => handleChange('category', e.target.value)} required>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              {/* Quantity + Price */}
              <div className="grid-2">
                <div className="form-group">
                  <label>Quantity (quintals) *</label>
                  <input className="form-input" type="number" placeholder="e.g. 100" min="1" value={form.quantity} onChange={e => handleChange('quantity', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Expected Price (₹/quintal) *</label>
                  <input className="form-input" type="number" placeholder="e.g. 2500" min="1" value={form.expectedPrice} onChange={e => handleChange('expectedPrice', e.target.value)} required />
                </div>
              </div>

              {estimatedValue && (
                <div style={{ background: 'var(--green-bg)', border: '1px solid var(--green-pale)', borderRadius: 'var(--radius-sm)', padding: '10px 16px', marginBottom: 20, fontSize: '0.875rem', color: 'var(--green-dark)', fontWeight: 600 }}>
                  📊 Estimated Total Value: ₹{estimatedValue}
                </div>
              )}

              {/* Harvest Date */}
              <div className="form-group">
                <label>Expected Harvest Date *</label>
                <input className="form-input" type="date" value={form.harvestDate} min={new Date().toISOString().split('T')[0]} onChange={e => handleChange('harvestDate', e.target.value)} required />
              </div>

              {/* Location */}
              <div className="grid-2">
                <div className="form-group">
                  <label>State</label>
                  <input className="form-input" type="text" placeholder="e.g. Punjab" value={form.state} onChange={e => handleChange('state', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>District</label>
                  <input className="form-input" type="text" placeholder="e.g. Amritsar" value={form.district} onChange={e => handleChange('district', e.target.value)} />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(optional, max 500 characters)</span></label>
                <textarea
                  className="form-input"
                  placeholder="Describe your crop quality, farming practices, irrigation method, certifications..."
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                  maxLength={500}
                  rows={4}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'right' }}>{form.description.length}/500</span>
              </div>

              <div className="divider" />

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn-secondary" onClick={() => navigate(-1)} style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                  {loading ? '⏳ Listing...' : '🌾 List My Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCrop;
