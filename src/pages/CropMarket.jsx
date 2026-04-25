import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import CropCard from '../components/CropCard';

const CATEGORIES = ['', 'grain', 'vegetable', 'fruit', 'spice', 'oilseed', 'other'];

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-line" style={{ width: '50%' }} />
    <div className="skeleton skeleton-line" />
    <div className="skeleton skeleton-line" style={{ width: '70%' }} />
  </div>
);

const CropMarket = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ search: '', category: '', state: '', minPrice: '', maxPrice: '' });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  const fetchCrops = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filters.category) params.set('category', filters.category);
      if (filters.state) params.set('state', filters.state);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);

      const { data } = await api.get(`/api/crops?${params}`);
      setCrops(data.crops || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('fetchCrops error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters.category, filters.state, filters.minPrice, filters.maxPrice]);

  useEffect(() => { fetchCrops(); }, [fetchCrops]);
  useEffect(() => { setPage(1); }, [debouncedSearch, filters.category, filters.state, filters.minPrice, filters.maxPrice]);

  const handleFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="page-header">
          <h1>Crop Marketplace</h1>
          <p>{total > 0 ? `${total} crops available from farmers across India` : 'Browse fresh listings from verified farmers'}</p>
        </div>

        {/* Filters */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 32, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 220px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Search</label>
            <input
              className="form-input"
              type="text"
              placeholder="Search crops..."
              value={filters.search}
              onChange={e => handleFilter('search', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: '0 1 160px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Category</label>
            <select className="form-input" value={filters.category} onChange={e => handleFilter('category', e.target.value)} style={{ width: '100%' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c ? c.charAt(0).toUpperCase() + c.slice(1) : 'All Categories'}</option>)}
            </select>
          </div>
          <div style={{ flex: '0 1 150px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>State</label>
            <input className="form-input" type="text" placeholder="e.g. Punjab" value={filters.state} onChange={e => handleFilter('state', e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ flex: '0 1 130px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Min ₹/qtl</label>
            <input className="form-input" type="number" placeholder="0" value={filters.minPrice} onChange={e => handleFilter('minPrice', e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ flex: '0 1 130px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Max ₹/qtl</label>
            <input className="form-input" type="number" placeholder="99999" value={filters.maxPrice} onChange={e => handleFilter('maxPrice', e.target.value)} style={{ width: '100%' }} />
          </div>
          {(filters.search || filters.category || filters.state || filters.minPrice || filters.maxPrice) && (
            <button
              className="btn-secondary btn-sm"
              onClick={() => setFilters({ search: '', category: '', state: '', minPrice: '', maxPrice: '' })}
            >
              Clear
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid-3">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : crops.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌾</div>
            <h3>No crops found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid-3">
            {crops.map(crop => <CropCard key={crop._id} crop={crop} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            <button className="btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
            <span className="pagination-info">Page {page} of {pages}</span>
            <button className="btn-secondary btn-sm" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropMarket;
