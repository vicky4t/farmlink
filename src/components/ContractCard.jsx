const statusColors = {
  active: 'badge-green',
  fulfilled: 'badge-blue',
  disputed: 'badge-orange',
  cancelled: 'badge-red',
};

const ContractCard = ({ contract, userId, onSign, onFulfil, onDispute, loading }) => {
  const isFarmer = contract.farmer?._id === userId || contract.farmer?._id?.toString() === userId;
  const isBuyer = contract.buyer?._id === userId || contract.buyer?._id?.toString() === userId;
  const counterparty = isFarmer ? contract.buyer : contract.farmer;
  const counterLabel = isFarmer ? 'Buyer' : 'Farmer';
  const totalAmt = contract.totalAmount?.toLocaleString('en-IN');
  const harvestDate = contract.harvestDate
    ? new Date(contract.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  const mySignKey = isFarmer ? 'farmerSigned' : 'buyerSigned';
  const alreadySigned = contract[mySignKey];
  const bothSigned = contract.farmerSigned && contract.buyerSigned;

  return (
    <div className="card">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--green-dark)', marginBottom: 4 }}>
            {contract.crop?.cropName || 'Contract'}
          </h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
            {contract.crop?.category}
            {contract.crop?.location?.state ? ` · ${contract.crop.location.state}` : ''}
          </span>
        </div>
        <span className={`badge ${statusColors[contract.status] || 'badge-gray'}`}>{contract.status}</span>
      </div>

      {/* Values */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16, background: 'var(--green-surface)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Price</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--green-dark)' }}>₹{contract.agreedPrice?.toLocaleString('en-IN')}/qtl</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Qty</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--green-dark)' }}>{contract.quantity} qtl</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Total</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--green-dark)' }}>₹{totalAmt}</div>
        </div>
      </div>

      {/* Info row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-mid)' }}>
          <span>📅</span><span>Harvest: {harvestDate}</span>
        </div>
        {counterparty && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-mid)' }}>
            {counterparty.photo ? (
              <img src={counterparty.photo} alt={counterparty.name} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem' }}>{counterparty.name?.[0]}</div>
            )}
            <span>{counterLabel}: {counterparty.name}</span>
          </div>
        )}
      </div>

      {/* Signatures */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: contract.farmerSigned ? 'var(--green-main)' : 'var(--text-light)' }}>
          <span>{contract.farmerSigned ? '✅' : '⬜'}</span> Farmer signed
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: contract.buyerSigned ? 'var(--green-main)' : 'var(--text-light)' }}>
          <span>{contract.buyerSigned ? '✅' : '⬜'}</span> Buyer signed
        </div>
      </div>

      {/* Actions */}
      {contract.status === 'active' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {!alreadySigned && (
            <button className="btn-primary btn-sm" onClick={() => onSign(contract._id)} disabled={loading}>
              ✍️ Sign Contract
            </button>
          )}
          {isFarmer && bothSigned && (
            <button className="btn-primary btn-sm" onClick={() => onFulfil(contract._id)} disabled={loading}>
              ✓ Mark Fulfilled
            </button>
          )}
          <button
            className="btn-secondary btn-sm"
            onClick={() => onDispute(contract._id)}
            disabled={loading}
            style={{ borderColor: 'var(--orange)', color: 'var(--orange)' }}
          >
            ⚠️ Raise Dispute
          </button>
        </div>
      )}
    </div>
  );
};

export default ContractCard;
