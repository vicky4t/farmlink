import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: 'var(--green-darkest)', color: 'rgba(255,255,255,0.7)', padding: '48px 0 24px' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: '1.2rem' }}>🌾</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>FarmLink</span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>Connecting Indian farmers and buyers through secure contract farming.</p>
        </div>
        <div>
          <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-body)' }}>Platform</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/market" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }}>Marketplace</Link>
            <Link to="/dashboard" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Dashboard</Link>
            <Link to="/my-contracts" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Contracts</Link>
          </div>
        </div>
        <div>
          <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-body)' }}>For Farmers</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/crops/list" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>List Your Crop</Link>
            <Link to="/my-offers" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>View Offers</Link>
          </div>
        </div>
        <div>
          <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-body)' }}>For Buyers</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/market" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Browse Crops</Link>
            <Link to="/my-offers" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>My Offers</Link>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: '0.8rem' }}>© 2025 FarmLink. Built for Indian farmers. 🇮🇳</p>
        <p style={{ fontSize: '0.8rem' }}>Empowering agriculture through technology</p>
      </div>
    </div>
  </footer>
);

export default Footer;
