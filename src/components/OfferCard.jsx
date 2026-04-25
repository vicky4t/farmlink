const statusColors = {
  pending: 'badge-orange',
  accepted: 'badge-green',
  rejected: 'badge-red',
  withdrawn: 'badge-gray',
};

const OfferCard = ({ offer, viewAs, onAccept, onReject, onWithdraw, loading }) => {
  const totalDeal = (offer.quantity * offer.offeredPrice).toLocaleString('en-IN');
  const expiryDate = offer.expiresAt
    ? new Date(offer.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--green-dark)', marginBottom: 4 }}>
            {offer.crop?.cropName || 'Crop'}
          </h3>
          {viewAs === 'farmer' && offer.buyer && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {offer.buyer.photo ? (
                <img src={offer.buyer.photo} alt={offer.buyer.name} style={{ width: 22, height: 22, borderRadius: '50%' }} />
              ) : (
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem' }}>{offer.buyer.name?.[0]}</div>
              )}
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>by {offer.buyer.name}</span>
            </div>
          )}
          {viewAs === 'buyer' && offer.farmer && (
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Farmer: {offer.farmer.name}</span>
          )}
        </div>
        <span className={`badge ${statusColors[offer.status] || 'badge-gray'}`}>{offer.status}</span>
      </div>

      {/* Price info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, background: 'var(--green-surface)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Offered</div>
          <div style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--green-dark)' }}>₹{offer.offeredPrice?.toLocaleString('en-IN')}/qtl</div>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Quantity</div>
          <div style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--green-dark)' }}>{offer.quantity} qtl</div>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Total Deal</div>
          <div style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--green-dark)' }}>₹{totalDeal}</div>
        </div>
      </div>

      {offer.message && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', background: '#f9f9f7', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: 14, fontStyle: 'italic', borderLeft: '3px solid var(--green-pale)' }}>
          "{offer.message}"
        </p>
      )}

      {expiryDate && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: 14 }}>Expires: {expiryDate}</p>
      )}

      {/* Actions */}
      {offer.status === 'pending' && (
        <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
          {viewAs === 'farmer' && (
            <>
              <button
                className="btn-primary btn-sm"
                onClick={() => onAccept(offer._id)}
                disabled={loading}
                style={{ flex: 1 }}
              >
                ✓ Accept
              </button>
              <button
                className="btn-danger btn-sm"
                onClick={() => onReject(offer._id)}
                disabled={loading}
                style={{ flex: 1 }}
              >
                ✗ Reject
              </button>
            </>
          )}
          {viewAs === 'buyer' && (
            <button
              className="btn-secondary btn-sm"
              onClick={() => onWithdraw(offer._id)}
              disabled={loading}
            >
              Withdraw Offer
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OfferCard;
