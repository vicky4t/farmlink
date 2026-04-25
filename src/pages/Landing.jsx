import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect(); }
    }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
};

const Landing = () => {
  const featuresRef = useReveal();
  const howRef = useReveal();
  const testRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(150deg, var(--green-darkest) 0%, #1a3a2a 40%, #2d5a3d 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <div style={{ position: 'absolute', top: '15%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,161,105,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,138,86,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ paddingTop: 100, paddingBottom: 80, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(56,161,105,0.2)', border: '1px solid rgba(56,161,105,0.3)', borderRadius: 999, padding: '6px 16px', marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green-light)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ color: 'var(--green-light)', fontSize: '0.82rem', fontWeight: 500 }}>Live on marketplace</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', color: 'white', lineHeight: 1.1, marginBottom: 24, fontWeight: 600 }}>
              Secure your crops<br />
              <em style={{ color: 'var(--green-light)', fontStyle: 'italic' }}>before you grow</em>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}>
              FarmLink connects Indian farmers with verified buyers through legally-backed contract farming. Fix your price today, grow with confidence tomorrow.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ background: 'var(--green-main)', color: 'white', padding: '14px 28px', borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 20px rgba(56,161,105,0.4)', transition: 'all 0.2s' }}>
                🌾 Get Started Free
              </Link>
              <Link to="/market" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', padding: '14px 28px', borderRadius: 'var(--radius)', fontWeight: 500, fontSize: '1rem', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                Browse Marketplace →
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
              {[['2,400+', 'Farmers'], ['₹12 Cr+', 'Contracts'], ['18', 'States']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', color: 'white', fontWeight: 700 }}>{v}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: mock contract card */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 28, width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contract Preview</span>
                <span style={{ background: 'rgba(56,161,105,0.2)', color: 'var(--green-light)', padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600 }}>● Active</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.3rem', marginBottom: 6 }}>Basmati Rice — 120 qtl</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: 20 }}>Karnal, Haryana · Harvest: Mar 2025</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[['Agreed Price', '₹3,800/qtl'], ['Total Value', '₹4,56,000'], ['Farmer', 'Ranjit Singh ✓'], ['Buyer', 'AgroMart Ltd.']].map(([l, v]) => (
                  <div key={l} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 3, fontWeight: 500 }}>{l}</div>
                    <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 3, background: 'var(--green-main)', borderRadius: 999 }} />
                <div style={{ flex: 1, height: 3, background: 'var(--green-main)', borderRadius: 999 }} />
                <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 999 }} />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textAlign: 'center' }}>2 of 3 steps complete · Both parties signed ✓</p>
            </div>
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } } @media(max-width:768px) { section > .container { grid-template-columns: 1fr !important; } section > .container > div:last-child { display: none !important; } }`}</style>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '100px 0', background: 'var(--cream)' }}>
        <div className="container">
          <div ref={featuresRef} className="reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: 'var(--green-main)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Why FarmLink</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: 'var(--green-dark)' }}>Everything a farmer needs to thrive</h2>
          </div>
          <div className="grid-3">
            {[
              { icon: '🤝', title: 'Guaranteed Buyers', desc: 'Find verified buyers before you sow a single seed. No more uncertainty about who will purchase your harvest.' },
              { icon: '💰', title: 'Fixed Pricing', desc: 'Lock in prices weeks or months in advance. Protect yourself from market volatility and middlemen.' },
              { icon: '📋', title: 'Secure Contracts', desc: 'Digitally signed contracts protect both parties. Clear terms, transparent deals, legal accountability.' },
            ].map((f, i) => (
              <div key={i} className="card reveal" style={{ animationDelay: `${i * 0.1}s`, textAlign: 'center', padding: '36px 28px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--green-dark)', marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '100px 0', background: 'var(--green-surface)' }}>
        <div className="container">
          <div ref={howRef} className="reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ color: 'var(--green-main)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Process</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: 'var(--green-dark)' }}>How FarmLink works</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative' }}>
            {[
              { step: '01', icon: '🌱', title: 'List Your Crop', desc: 'Farmers post their crop details — quantity, expected price, harvest date, and location.' },
              { step: '02', icon: '💬', title: 'Receive Offers', desc: 'Verified buyers browse the marketplace and send competitive offers directly to farmers.' },
              { step: '03', icon: '✅', title: 'Sign & Grow', desc: 'Accept the best offer, sign the digital contract, and grow with complete confidence.' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0 24px', position: 'relative' }}>
                {i < 2 && (
                  <div style={{ position: 'absolute', top: 32, left: '60%', right: '-10%', height: 2, background: 'linear-gradient(90deg, var(--green-pale), var(--green-light))', zIndex: 0 }} />
                )}
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.6rem', position: 'relative', zIndex: 1, boxShadow: '0 4px 16px rgba(56,161,105,0.3)' }}>
                  {s.icon}
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--green-main)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 8 }}>STEP {s.step}</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--green-dark)', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '100px 0', background: 'var(--cream)' }}>
        <div className="container">
          <div ref={testRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--green-dark)' }}>Farmers love FarmLink</h2>
          </div>
          <div className="grid-2">
            {[
              { quote: 'For the first time in 20 years of farming, I knew my price before the season began. FarmLink changed everything for my family.', name: 'Ranjit Singh', location: 'Karnal, Haryana', emoji: '👨‍🌾', crop: 'Basmati Rice Farmer' },
              { quote: 'I sourced 3,000 quintals of wheat directly from verified farmers at fixed prices. Saved ₹8 lakhs versus spot market rates.', name: 'Priya Mehta', location: 'Pune, Maharashtra', emoji: '🏪', crop: 'Agro Commodities Buyer' },
            ].map((t, i) => (
              <div key={i} className="card reveal" style={{ padding: '32px', background: i === 0 ? 'var(--green-dark)' : 'white' }}>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: i === 0 ? 'rgba(255,255,255,0.85)' : 'var(--text-mid)', marginBottom: 24, fontStyle: 'italic', fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '2rem' }}>{t.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 600, color: i === 0 ? 'white' : 'var(--text-dark)', fontSize: '0.95rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: i === 0 ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}>{t.crop} · {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, var(--green-darkest) 0%, #1e4a30 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div ref={ctaRef} className="reveal">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'white', marginBottom: 16 }}>
              Ready to grow with confidence?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 40px' }}>
              Join thousands of farmers and buyers building a more secure agricultural future together.
            </p>
            <Link to="/signup" style={{ background: 'var(--green-main)', color: 'white', padding: '16px 36px', borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 24px rgba(56,161,105,0.4)', transition: 'all 0.2s' }}>
              🌾 Join FarmLink Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
