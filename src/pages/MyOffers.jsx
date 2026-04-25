import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import OfferCard from '../components/OfferCard';
import Loader from '../components/Loader';

const Toast = ({ msg, type, onClose }) => (
  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: type === 'success' ? 'var(--green-dark)' : 'var(--red)', color: 'white', padding: '14px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 280, animation: 'toastIn 0.3s ease' }}>
    <span>{msg}</span>
    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 'auto' }}>✕</button>
  </div>
);

const MyOffers = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all');

  const isFarmer = user?.role === 'farmer';

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = isFarmer ? '/api/offers/received' : '/api/offers/my';
      const { data } = await api.get(endpoint);
      setOffers(data.offers || []);
    } catch (err) {
      console.error('fetchOffers error:', err);
      showToast('Failed to load offers.', 'error');
    } finally {
      setLoading(false);
    }
  }, [isFarmer]);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const handleAccept = async (offerId) => {
    if (!window.confirm('Accept this offer? A contract will be automatically created.')) return;
    setActionLoading(true);
    try {
      await api.put(`/api/offers/${offerId}/accept`);
      showToast('✅ Offer accepted! Contract created successfully.');
      fetchOffers();
    } catch (err) {
      console.error('acceptOffer error:', err);
      showToast(err.response?.data?.message || 'Failed to accept offer.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (offerId) => {
    if (!window.confirm('Are you sure you want to reject this offer?')) return;
    setActionLoading(true);
    try {
      await api.put(`/api/offers/${offerId}/reject`);
      showToast('Offer rejected.');
      fetchOffers();
    } catch (err) {
      console.error('rejectOffer error:', err);
      showToast(err.response?.data?.message || 'Failed to reject offer.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async (offerId) => {
    if (!window.confirm('Withdraw this offer?')) return;
    setActionLoading(true);
    try {
      await api.put(`/api/offers/${offerId}/withdraw`);
      showToast('Offer withdrawn.');
      fetchOffers();
    } catch (err) {
      console.error('withdrawOffer error:', err);
      showToast(err.response?.data?.message || 'Failed to withdraw offer.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const STATUS_FILTERS = ['all', 'pending', 'accepted', 'rejected', 'withdrawn'];
  const filtered = filter === 'all' ? offers : offers.filter(o => o.status === filter);
  const pendingCount = offers.filter(o => o.status === 'pending').length;

  if (loading) return <Loader text="Loading offers..." />;

  return (
    <div className="page-wrap">
      <div className="container">
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

        <div className="page-header">
          <h1>{isFarmer ? 'Offers Received' : 'My Sent Offers'}</h1>
          <p>
            {isFarmer
              ? `Buyers are interested in your crops. ${pendingCount > 0 ? `${pendingCount} offer${pendingCount > 1 ? 's' : ''} awaiting your response.` : ''}`
              : `Track all offers you've sent to farmers across the marketplace.`}
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '7px 16px',
                borderRadius: 999,
                border: `1.5px solid ${filter === s ? 'var(--green-main)' : 'var(--border)'}`,
                background: filter === s ? 'var(--green-bg)' : 'white',
                color: filter === s ? 'var(--green-dark)' : 'var(--text-muted)',
                fontWeight: filter === s ? 600 : 400,
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}
            >
              {s === 'all' ? `All (${offers.length})` : `${s} (${offers.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📬</div>
            <h3>{filter === 'all' ? 'No offers yet' : `No ${filter} offers`}</h3>
            <p>{isFarmer ? 'List a crop to start receiving offers from buyers.' : 'Browse the marketplace and make your first offer.'}</p>
          </div>
        ) : (
          <div className="grid-2">
            {filtered.map(offer => (
              <OfferCard
                key={offer._id}
                offer={offer}
                viewAs={isFarmer ? 'farmer' : 'buyer'}
                onAccept={handleAccept}
                onReject={handleReject}
                onWithdraw={handleWithdraw}
                loading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOffers;
