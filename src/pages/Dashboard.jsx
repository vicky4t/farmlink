import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';

const statusColors = {
  open: 'badge-green', negotiating: 'badge-orange',
  contracted: 'badge-blue', closed: 'badge-gray',
  pending: 'badge-orange', accepted: 'badge-green',
  rejected: 'badge-red', withdrawn: 'badge-gray',
  active: 'badge-green', fulfilled: 'badge-blue',
  disputed: 'badge-orange', cancelled: 'badge-red',
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ crops: [], offers: [], contracts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const isFarmer = user?.role === 'farmer';
        const [cropsRes, offersRes, contractsRes] = await Promise.all([
          isFarmer ? api.get('/api/crops/my') : Promise.resolve({ data: { crops: [] } }),
          isFarmer ? api.get('/api/offers/received') : api.get('/api/offers/my'),
          api.get('/api/contracts/my'),
        ]);
        setData({
          crops: cropsRes.data.crops || [],
          offers: offersRes.data.offers || [],
          contracts: contractsRes.data.contracts || [],
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchAll();
  }, [user]);

  if (loading) return <Loader text="Loading your dashboard..." />;

  const isFarmer = user?.role === 'farmer';
  const activeContracts = data.contracts.filter(c => c.status === 'active').length;
  const pendingOffers = data.offers.filter(o => o.status === 'pending').length;
  const totalEarnings = data.contracts
    .filter(c => c.status === 'fulfilled' && c.farmer?._id === user?._id)
    .reduce((sum, c) => sum + (c.totalAmount || 0), 0);
  const totalSpent = data.contracts
    .filter(c => c.status === 'fulfilled' && c.buyer?._id === user?._id)
    .reduce((sum, c) => sum + (c.totalAmount || 0), 0);

  return (
    <div className="page-wrap">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            {user?.photo && <img src={user.photo} alt={user.name} style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--green-pale)', objectFit: 'cover' }} />}
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--green-dark)' }}>
                {getGreeting()}, {user?.name?.split(' ')[0]} {isFarmer ? '🌾' : '🏪'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span className={`badge ${isFarmer ? 'badge-green' : 'badge-blue'}`}>{user?.role}</span>
                {user?.location?.state && <span style={{ marginLeft: 8 }}>📍 {user.location.district || ''}{user.location.district ? ', ' : ''}{user.location.state}</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 40 }}>
          {isFarmer ? (
            <>
              <div className="stat-card"><div className="stat-icon">🌾</div><div className="stat-value">{data.crops.length}</div><div className="stat-label">My Crops</div></div>
              <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-value">{activeContracts}</div><div className="stat-label">Active Contracts</div></div>
              <div className="stat-card"><div className="stat-icon">🤝</div><div className="stat-value">{pendingOffers}</div><div className="stat-label">Pending Offers</div></div>
              <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-value" style={{ fontSize: '1.3rem' }}>₹{totalEarnings.toLocaleString('en-IN')}</div><div className="stat-label">Total Earnings</div></div>
            </>
          ) : (
            <>
              <div className="stat-card"><div className="stat-icon">📤</div><div className="stat-value">{data.offers.length}</div><div className="stat-label">Offers Sent</div></div>
              <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-value">{activeContracts}</div><div className="stat-label">Active Contracts</div></div>
              <div className="stat-card"><div className="stat-icon">💸</div><div className="stat-value" style={{ fontSize: '1.3rem' }}>₹{totalSpent.toLocaleString('en-IN')}</div><div className="stat-label">Total Spent</div></div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          {isFarmer && <button className="btn-primary" onClick={() => navigate('/crops/list')}>+ List New Crop</button>}
          <button className="btn-secondary" onClick={() => navigate('/market')}>Browse Marketplace</button>
          <button className="btn-secondary" onClick={() => navigate('/my-offers')}>My Offers</button>
          <button className="btn-secondary" onClick={() => navigate('/my-contracts')}>My Contracts</button>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Left column */}
          <div>
            {isFarmer && (
              <section style={{ marginBottom: 32 }}>
                <div className="section-title">
                  Recent Crops
                  <Link to="/market">View all →</Link>
                </div>
                {data.crops.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>🌱</div>
                    <p>No crops listed yet.</p>
                    <button className="btn-primary btn-sm" style={{ margin: '12px auto 0' }} onClick={() => navigate('/crops/list')}>List Your First Crop</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {data.crops.slice(0, 3).map(crop => (
                      <Link key={crop._id} to={`/crops/${crop._id}`} style={{ textDecoration: 'none' }}>
                        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-dark)', marginBottom: 2 }}>{crop.cropName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{crop.quantity} qtl · ₹{crop.expectedPrice.toLocaleString('en-IN')}/qtl</div>
                          </div>
                          <span className={`badge ${statusColors[crop.status] || 'badge-gray'}`}>{crop.status}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Offers column */}
            <section>
              <div className="section-title">
                {isFarmer ? 'Recent Offers Received' : 'Recent Offers Sent'}
                <Link to="/my-offers">View all →</Link>
              </div>
              {data.offers.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>📬</div>
                  <p>No offers yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {data.offers.slice(0, 3).map(offer => (
                    <div key={offer._id} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-dark)', marginBottom: 2 }}>{offer.crop?.cropName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          ₹{offer.offeredPrice?.toLocaleString('en-IN')}/qtl · {offer.quantity} qtl
                          {isFarmer && offer.buyer ? ` · ${offer.buyer.name}` : ''}
                        </div>
                      </div>
                      <span className={`badge ${statusColors[offer.status] || 'badge-gray'}`}>{offer.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right column: contracts */}
          <div>
            <div className="section-title">
              Active Contracts
              <Link to="/my-contracts">View all →</Link>
            </div>
            {data.contracts.filter(c => c.status === 'active').length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📋</div>
                <p>No active contracts yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.contracts.filter(c => c.status === 'active').slice(0, 3).map(contract => {
                  const counterparty = isFarmer ? contract.buyer : contract.farmer;
                  return (
                    <Link key={contract._id} to="/my-contracts" style={{ textDecoration: 'none' }}>
                      <div className="card" style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{contract.crop?.cropName}</span>
                          <span className="badge badge-green">active</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                          ₹{contract.totalAmount?.toLocaleString('en-IN')} · {contract.quantity} qtl
                        </div>
                        {counterparty && <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{isFarmer ? 'Buyer' : 'Farmer'}: {counterparty.name}</div>}
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <span style={{ fontSize: '0.75rem', color: contract.farmerSigned ? 'var(--green-main)' : 'var(--text-light)' }}>{contract.farmerSigned ? '✅' : '⬜'} Farmer</span>
                          <span style={{ fontSize: '0.75rem', color: contract.buyerSigned ? 'var(--green-main)' : 'var(--text-light)' }}>{contract.buyerSigned ? '✅' : '⬜'} Buyer</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
