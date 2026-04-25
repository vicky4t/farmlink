import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navStyle = {
    position: isLanding ? 'fixed' : 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    background: isLanding && !scrolled
      ? 'rgba(15,35,24,0.6)'
      : 'rgba(255,255,255,0.96)',
    backdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${isLanding && !scrolled ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
    boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
  };

  const linkColor = isLanding && !scrolled ? '#ffffff' : '#3d3d3d';
  const logoColor = isLanding && !scrolled ? '#ffffff' : '#1a3a2a';

  return (
    <nav style={navStyle}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.4rem' }}>🌾</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: logoColor, transition: 'color 0.3s' }}>
            FarmLink
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="nav-desktop">
          <Link to="/market" style={{ color: linkColor, fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.3s' }}>
            Marketplace
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" style={{ color: linkColor, fontSize: '0.9rem', fontWeight: 500 }}>Dashboard</Link>
              <Link to="/my-offers" style={{ color: linkColor, fontSize: '0.9rem', fontWeight: 500 }}>Offers</Link>
              <Link to="/my-contracts" style={{ color: linkColor, fontSize: '0.9rem', fontWeight: 500 }}>Contracts</Link>
              {user?.role === 'farmer' && (
                <Link to="/crops/list" style={{ color: linkColor, fontSize: '0.9rem', fontWeight: 500 }}>List Crop</Link>
              )}
            </>
          )}
        </div>

        {/* Auth area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {user?.photo ? (
                  <img src={user.photo} alt={user.name} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--green-main)', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                    {user?.name?.[0] || 'U'}
                  </div>
                )}
                <span style={{ color: linkColor, fontSize: '0.875rem', fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                style={{ background: 'transparent', border: `1.5px solid ${isLanding && !scrolled ? 'rgba(255,255,255,0.5)' : 'var(--border)'}`, color: linkColor, padding: '7px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/signup"
              style={{ background: 'var(--green-main)', color: 'white', padding: '9px 22px', borderRadius: 'var(--radius)', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(56,161,105,0.3)', transition: 'all 0.2s' }}
            >
              🌾 Get Started
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'transparent', border: 'none', color: linkColor, fontSize: '1.4rem', cursor: 'pointer', display: 'none' }}
            className="hamburger"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'white', borderTop: '1px solid var(--border)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Link to="/market" style={{ color: 'var(--text-mid)', fontWeight: 500 }}>Marketplace</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" style={{ color: 'var(--text-mid)', fontWeight: 500 }}>Dashboard</Link>
              <Link to="/my-offers" style={{ color: 'var(--text-mid)', fontWeight: 500 }}>Offers</Link>
              <Link to="/my-contracts" style={{ color: 'var(--text-mid)', fontWeight: 500 }}>Contracts</Link>
              {user?.role === 'farmer' && <Link to="/crops/list" style={{ color: 'var(--text-mid)', fontWeight: 500 }}>List Crop</Link>}
              <Link to="/profile" style={{ color: 'var(--text-mid)', fontWeight: 500 }}>Profile</Link>
              <button onClick={handleLogout} style={{ textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--red)', fontWeight: 500, cursor: 'pointer', padding: 0 }}>Logout</button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
