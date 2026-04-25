import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ContractCard from '../components/ContractCard';
import Loader from '../components/Loader';

const Toast = ({ msg, type, onClose }) => (
  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: type === 'success' ? 'var(--green-dark)' : 'var(--red)', color: 'white', padding: '14px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 280, animation: 'toastIn 0.3s ease' }}>
    <span>{msg}</span>
    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 'auto' }}>✕</button>
  </div>
);

const STATUS_FILTERS = ['all', 'active', 'fulfilled', 'disputed', 'cancelled'];

const MyContracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/contracts/my');
      setContracts(data.contracts || []);
    } catch (err) {
      console.error('fetchContracts error:', err);
      showToast('Failed to load contracts.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContracts(); }, [fetchContracts]);

  const handleSign = async (contractId) => {
    if (!window.confirm('Sign this contract? This action cannot be undone.')) return;
    setActionLoading(true);
    try {
      await api.put(`/api/contracts/${contractId}/sign`);
      showToast('✅ Contract signed successfully!');
      fetchContracts();
    } catch (err) {
      console.error('signContract error:', err);
      showToast(err.response?.data?.message || 'Failed to sign contract.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFulfil = async (contractId) => {
    if (!window.confirm('Mark this contract as fulfilled? This means the crop has been delivered and payment received.')) return;
    setActionLoading(true);
    try {
      await api.put(`/api/contracts/${contractId}/fulfil`);
      showToast('🎉 Contract marked as fulfilled!');
      fetchContracts();
    } catch (err) {
      console.error('fulfilContract error:', err);
      showToast(err.response?.data?.message || 'Failed to fulfil contract.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDispute = async (contractId) => {
    const notes = window.prompt('Please describe the issue briefly (optional):');
    if (notes === null) return; // user cancelled
    setActionLoading(true);
    try {
      await api.put(`/api/contracts/${contractId}/dispute`, { notes });
      showToast('⚠️ Dispute raised. Our team will review it.', 'error');
      fetchContracts();
    } catch (err) {
      console.error('disputeContract error:', err);
      showToast(err.response?.data?.message || 'Failed to raise dispute.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = filter === 'all' ? contracts : contracts.filter(c => c.status === filter);
  const totalValue = contracts
    .filter(c => c.status !== 'cancelled')
    .reduce((sum, c) => sum + (c.totalAmount || 0), 0);

  if (loading) return <Loader text="Loading contracts..." />;

  return (
    <div className="page-wrap">
      <div className="container">
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

        <div className="page-header">
          <h1>My Contracts</h1>
          <p>Manage all your farming contracts in one place.</p>
        </div>

        {/* Summary */}
        {contracts.length > 0 && (
          <div className="grid-4" style={{ marginBottom: 32 }}>
            <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-value">{contracts.length}</div><div className="stat-label">Total</div></div>
            <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value">{contracts.filter(c => c.status === 'active').length}</div><div className="stat-label">Active</div></div>
            <div className="stat-card"><div className="stat-icon">🎉</div><div className="stat-value">{contracts.filter(c => c.status === 'fulfilled').length}</div><div className="stat-label">Fulfilled</div></div>
            <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-value" style={{ fontSize: '1.2rem' }}>₹{totalValue.toLocaleString('en-IN')}</div><div className="stat-label">Total Value</div></div>
          </div>
        )}

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
              {s === 'all' ? `All (${contracts.length})` : `${s} (${contracts.filter(c => c.status === s).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>{filter === 'all' ? 'No contracts yet' : `No ${filter} contracts`}</h3>
            <p>{filter === 'all' ? 'Contracts are created when a farmer accepts a buyer\'s offer.' : `You have no ${filter} contracts right now.`}</p>
          </div>
        ) : (
          <div className="grid-2">
            {filtered.map(contract => (
              <ContractCard
                key={contract._id}
                contract={contract}
                userId={user?._id}
                onSign={handleSign}
                onFulfil={handleFulfil}
                onDispute={handleDispute}
                loading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContracts;
