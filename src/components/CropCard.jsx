import { Link } from 'react-router-dom';

const categoryEmoji = { grain: '🌾', vegetable: '🥦', fruit: '🍎', spice: '🌶️', oilseed: '🌻', other: '🌿' };

const statusColors = {
  open: 'badge-green',
  negotiating: 'badge-orange',
  contracted: 'badge-blue',
  closed: 'badge-gray',
};

const CropCard = ({ crop }) => {
  const totalValue = (crop.quantity * crop.expectedPrice).toLocaleString('en-IN');
  const harvestDate = new Date(crop.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Link to={`/crops/${crop._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '2rem', lineHeight: 1 }}>{categoryEmoji[crop.category] || '🌿'}</span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--green-dark)', fontWeight: 600, lineHeight: 1.2 }}>{crop.cropName}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{crop.category}</span>
            </div>
          </div>
          <span className={`badge ${statusColors[crop.status] || 'badge-gray'}`}>{crop.status}</span>
        </div>

        {/* Price */}
        <div style={{ background: 'var(--green-surface)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--green-dark)' }}>
            ₹{crop.expectedPrice.toLocaleString('en-IN')}
            <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', marginLeft: 4 }}>/quintal</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Total: ₹{totalValue}
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.85rem', color: 'var(--text-mid)' }}>
            <span>📦</span><span>{crop.quantity} quintals available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.85rem', color: 'var(--text-mid)' }}>
            <span>📅</span><span>Harvest: {harvestDate}</span>
          </div>
          {(crop.location?.state || crop.location?.district) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.85rem', color: 'var(--text-mid)' }}>
              <span>📍</span>
              <span>{[crop.location.district, crop.location.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Farmer info */}
        {crop.farmer && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {crop.farmer.photo ? (
              <img src={crop.farmer.photo} alt={crop.farmer.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                {crop.farmer.name?.[0]}
              </div>
            )}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{crop.farmer.name}</span>
            {crop.farmer.isVerified && <span style={{ fontSize: '0.7rem', color: 'var(--green-main)', marginLeft: 'auto' }}>✓ Verified</span>}
          </div>
        )}
      </div>
    </Link>
  );
};

export default CropCard;
