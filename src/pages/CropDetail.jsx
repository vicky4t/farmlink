import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';

const categoryEmoji = { grain: '🌾', vegetable: '🥦', fruit: '🍎', spice: '🌶️', oilseed: '🌻', other: '🌿' };

const Toast = ({ msg, type, onClose }) => (
  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: type === 'success' ? 'var(--green-dark)' : 'var(--red)', color: 'white', padding: '14px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 280, animation: 'toastIn 0.3s ease' }}>
  <span>{msg}</span>
  <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 'auto', fontSize: '1.1rem' }}>✕</button>
  </div>
);

const CropDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [offerForm, setOfferForm] = useState({ offeredPrice: '', quantity: '', message: '' });
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError, setOfferError] = useState('');

  useEffect(() => {
    api.get(`/api/crops/${id}`)
      .then(({ data }) => setCrop(data.crop))
      .catch(err => { console.error('getCrop error:', err); })
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    setOfferError('');
    if (!offerForm.offeredPrice || !offerForm.quantity) {
      setOfferError('Price and quantity are required.');
      return;
    }
    if (Number(offerForm.quantity) > crop.quantity) {
      setOfferError(`Quantity cannot exceed available ${crop.quantity} quintals.`);
      return;
    }
    setOfferLoading(true);
    try {
      await api.post('/api/offers', {
        cropId: crop._id,
        offeredPrice: Number(offerForm.offeredPrice),
        quantity: Number(offerForm.quantity),
        message: offerForm.message,
      });
      showToast('✅ Offer sent successfully!');
      setOfferForm({ offeredPrice: '', quantity: '', message: '' });
    } catch (err) {
      console.error('createOffer error:', err);
      setOfferError(err.response?.data?.message || 'Failed to send offer. Please try again.');
    } finally {
      setOfferLoading(false);
    }
  };

  if (loading) return <Loader text="Loading crop details..." />;
  if (!crop) return (
    <div className="page-wrap"><div className="container">
      <div className="empty-state"><div className="empty-icon">🌾</div><h3>Crop not found</h3><p>This listing may have been removed.</p></div>
    </div></div>
  );

  const isOwner = user && crop.farmer?._id?.toString() === user._id?.toString();
  const isBuyer = user?.role === 'buyer';
  const totalValue = (crop.quantity * crop.expectedPrice).toLocaleString('en-IN');
  const offerTotal = offerForm.offeredPrice && offerForm.quantity
    ? (Number(offerForm.offeredPrice) * Number(offerForm.quantity)).toLocaleString('en-IN')
    : null;
  const harvestDate = new Date(crop.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="page-wrap">
      <div className="container">
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', marginBottom: 24, padding: 0 }}>
          ← Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
          {/* Main content */}
          <div>
            {/* Header card */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: '3rem', lineHeight: 1 }}>{categoryEmoji[crop.category] || '🌿'}</span>
                  <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--green-dark)', lineHeight: 1.1, marginBottom: 4 }}>{crop.cropName}</h1>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{crop.category}</span>
                  </div>
                </div>
                <span className={`badge ${crop.status === 'open' ? 'badge-green' : crop.status === 'negotiating' ? 'badge-orange' : crop.status === 'contracted' ? 'badge-blue' : 'badge-gray'}`}>
                  {crop.status}
                </span>
              </div>

              {/* Price highlight */}
              <div style={{ background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 20, color: 'white' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.7, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Expected Price</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>₹{crop.expectedPrice.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.65 }}>per quintal</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.7, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Quantity</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>{crop.quantity}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.65 }}>quintals</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.7, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Total Value</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>₹{totalValue}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.65 }}>estimated</div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--green-surface)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '1.2rem' }}>📅</span>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Harvest Date</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{harvestDate}</div>
                  </div>
                </div>
                {(crop.location?.state || crop.location?.district) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--green-surface)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '1.2rem' }}>📍</span>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Location</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{[crop.location.district, crop.location.state].filter(Boolean).join(', ')}</div>
                    </div>
                  </div>
                )}
              </div>

              {crop.description && (
                <>
                  <div className="divider" />
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 8 }}>Description</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>{crop.description}</p>
                  </div>
                </>
              )}

              {/* Owner actions */}
              {isOwner && (
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                  <button className="btn-secondary btn-sm" onClick={() => navigate(`/crops/list?edit=${crop._id}`)}>✏️ Edit Listing</button>
                </div>
              )}
            </div>

            {/* Farmer info */}
            {crop.farmer && (
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {crop.farmer.photo ? (
                  <img src={crop.farmer.photo} alt={crop.farmer.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--green-pale)' }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.3rem', fontWeight: 700 }}>{crop.farmer.name?.[0]}</div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{crop.farmer.name}</span>
                    {crop.farmer.isVerified && <span style={{ background: 'var(--green-pale)', color: 'var(--green-dark)', padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 600 }}>✓ Verified</span>}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {[crop.farmer.location?.village, crop.farmer.location?.district, crop.farmer.location?.state].filter(Boolean).join(', ') || 'Farmer'}
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', background: 'var(--green-bg)', color: 'var(--green-main)', padding: '4px 12px', borderRadius: 999, fontWeight: 600 }}>🧑‍🌾 Farmer</span>
              </div>
            )}
          </div>

          {/* Sidebar: offer form */}
          <div style={{ position: 'sticky', top: 90 }}>
            {isBuyer && !isOwner && (crop.status === 'open' || crop.status === 'negotiating') ? (
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--green-dark)', marginBottom: 4 }}>Make an Offer</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>Listed at ₹{crop.expectedPrice.toLocaleString('en-IN')}/qtl · {crop.quantity} qtl available</p>

                {offerError && <div className="error-msg">{offerError}</div>}

                <form onSubmit={handleOfferSubmit}>
                  <div className="form-group">
                    <label>Your Offered Price (₹/quintal)</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder={crop.expectedPrice}
                      value={offerForm.offeredPrice}
                      onChange={e => setOfferForm(f => ({ ...f, offeredPrice: e.target.value }))}
                      required min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity (quintals)</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder={`Max ${crop.quantity}`}
                      value={offerForm.quantity}
                      onChange={e => setOfferForm(f => ({ ...f, quantity: e.target.value }))}
                      required min="1" max={crop.quantity}
                    />
                  </div>
                  {offerTotal && (
                    <div style={{ background: 'var(--green-bg)', border: '1px solid var(--green-pale)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 16, fontSize: '0.875rem', color: 'var(--green-dark)', fontWeight: 600 }}>
                      Total Deal Value: ₹{offerTotal}
                    </div>
                  )}
                  <div className="form-group">
                    <label>Message (optional)</label>
                    <textarea
                      className="form-input"
                      placeholder="Introduce yourself or add any notes..."
                      value={offerForm.message}
                      onChange={e => setOfferForm(f => ({ ...f, message: e.target.value }))}
                      rows={3} maxLength={300}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={offerLoading} style={{ width: '100%', justifyContent: 'center' }}>
                    {offerLoading ? 'Sending...' : '📤 Send Offer'}
                  </button>
                </form>
              </div>
            ) : isOwner ? (
              <div className="card" style={{ textAlign: 'center', background: 'var(--green-surface)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>👑</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>This is your listing.</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 4 }}>Visit <strong>My Offers</strong> to see incoming bids.</p>
              </div>
            ) : !isAuthenticated ? (
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔒</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 8, color: 'var(--green-dark)' }}>Login to make an offer</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 20 }}>Sign in with Google to start buying crops directly from farmers.</p>
                <a href="http://localhost:5000/api/auth/google" className="btn-primary" style={{ display: 'flex', justifyContent: 'center' }}>Sign in with Google</a>
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', background: 'var(--green-surface)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>ℹ️</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {crop.status === 'contracted' ? 'This crop has been contracted.' : 'This crop is no longer available for offers.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.container > div[style*="grid-template-columns"]{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
};

export default CropDetail;
