import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap');

        :root {
          /* Color Palette: Greens & Creams */
          --color-green-900: #1a3a2a;
          --color-green-800: #224a36;
          --color-green-700: #295c43;
          --color-green-600: #2f7a55;
          --color-green-500: #38a169;
          --color-green-400: #4db87f;
          --color-green-300: #74d49e;
          --color-green-200: #a3e8c2;
          --color-green-100: #e6f7ee;
          --color-green-50:  #f0fdf4;
          --color-cream:     #fafaf8;
          --color-white:     #ffffff;
          
          --color-text-main: #1a3a2a;
          --color-text-muted: #4a6b5a;

          /* Typography */
          --font-heading: 'Fraunces', serif;
          --font-body: 'DM Sans', sans-serif;

          /* Borders & Shadows */
          --radius-button: 50px;
          --radius-card: 24px;
          --radius-card-large: 32px;
          --shadow-soft: 0 10px 40px -10px rgba(26, 58, 42, 0.08);
          --shadow-hover: 0 20px 40px -10px rgba(26, 58, 42, 0.15);
          --shadow-card: 0 4px 20px rgba(26, 58, 42, 0.05);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: var(--font-body);
          background-color: var(--color-cream);
          color: var(--color-text-main);
          line-height: 1.6;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        img {
          max-width: 100%;
          display: block;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        /* Utility */
        .container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Typography Utilities */
        h1, h2, h3, h4 {
          font-family: var(--font-heading);
          font-weight: 600;
          color: var(--color-green-900);
          line-height: 1.2;
        }

        p {
          color: var(--color-text-muted);
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 32px;
          border-radius: var(--radius-button);
          font-weight: 600;
          font-family: var(--font-body);
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          font-size: 1.05rem;
        }

        .btn-primary {
          background-color: var(--color-green-600);
          color: var(--color-white);
          box-shadow: 0 4px 14px rgba(47, 122, 85, 0.25);
        }

        .btn-primary:hover {
          background-color: var(--color-green-700);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(47, 122, 85, 0.3);
        }

        .btn-secondary {
          background-color: transparent;
          color: var(--color-green-700);
          border: 2px solid var(--color-green-200);
        }

        .btn-secondary:hover {
          background-color: var(--color-green-50);
          border-color: var(--color-green-400);
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background: rgba(250, 250, 248, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(56, 161, 105, 0.1);
          padding: 16px 0;
          transition: all 0.3s ease;
        }

        .navbar .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.6rem;
          color: var(--color-green-900);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .logo-leaf {
          color: var(--color-green-500);
        }

        .nav-links {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .nav-link {
          font-weight: 500;
          color: var(--color-text-muted);
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: var(--color-green-600);
        }

        /* Hero Section */
        .hero {
          padding: 160px 0 100px;
          background: radial-gradient(circle at top right, var(--color-green-100) 0%, var(--color-cream) 50%);
          position: relative;
          overflow: hidden;
        }

        .hero-bg-shape {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: var(--color-green-100);
          filter: blur(100px);
          opacity: 0.6;
          z-index: 0;
        }

        .hero .container {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
          align-items: center;
        }

        .hero-content h1 {
          font-size: 4rem;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
          color: var(--color-green-900);
        }

        .hero-content p {
          font-size: 1.25rem;
          margin-bottom: 48px;
          max-width: 520px;
          color: var(--color-text-muted);
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 56px;
        }

        .hero-stats {
          display: flex;
          gap: 40px;
          border-top: 1px solid rgba(56, 161, 105, 0.15);
          padding-top: 32px;
        }

        .stat-item h4 {
          font-size: 1.8rem;
          margin-bottom: 4px;
          color: var(--color-green-900);
        }

        .stat-item p {
          font-size: 0.9rem;
          margin: 0;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Hero Illustration Card */
        .hero-illustration {
          position: relative;
          display: flex;
          justify-content: center;
          padding: 20px;
        }

        .mock-card {
          background: var(--color-white);
          border-radius: var(--radius-card-large);
          padding: 32px;
          width: 100%;
          max-width: 380px;
          box-shadow: var(--shadow-soft);
          border: 1px solid rgba(56, 161, 105, 0.08);
          position: relative;
          z-index: 1;
        }

        .mock-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .mock-avatar {
          width: 56px;
          height: 56px;
          background: var(--color-green-100);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
        }

        .mock-header-text h4 {
          font-family: var(--font-body);
          font-size: 1.15rem;
          margin-bottom: 2px;
          color: var(--color-green-900);
        }

        .mock-header-text p {
          font-size: 0.9rem;
          margin: 0;
          color: var(--color-text-muted);
        }

        .mock-details {
          background: var(--color-green-50);
          border-radius: var(--radius-card);
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid rgba(56, 161, 105, 0.05);
        }

        .mock-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          font-size: 0.95rem;
        }

        .mock-row:last-child {
          margin-bottom: 0;
        }

        .mock-label {
          color: var(--color-text-muted);
        }

        .mock-value {
          font-weight: 500;
          color: var(--color-green-900);
        }
        
        .mock-value.highlight {
          color: var(--color-green-600);
          font-weight: 700;
        }

        .mock-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px dashed var(--color-green-200);
        }
        
        .mock-footer-icon {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: var(--color-green-100);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .mock-footer-text p {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-green-800);
        }
        
        .mock-footer-text span {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        /* Floating Badges */
        .badge {
          position: absolute;
          background: var(--color-white);
          padding: 12px 20px;
          border-radius: var(--radius-button);
          box-shadow: var(--shadow-card);
          border: 1px solid rgba(56, 161, 105, 0.1);
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--color-green-900);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 2;
          animation: float 4s ease-in-out infinite;
        }

        .badge-1 {
          top: -10px;
          right: -20px;
          animation-delay: 0s;
        }

        .badge-2 {
          bottom: 20px;
          left: -30px;
          animation-delay: 2s;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }

        /* Section Global */
        .section {
          padding: 120px 0;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 64px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-header h2 {
          font-size: 2.8rem;
          margin-bottom: 20px;
        }

        .section-header p {
          font-size: 1.15rem;
        }

        /* Features Section */
        .features {
          background: var(--color-white);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .feature-card {
          background: var(--color-cream);
          padding: 40px 32px;
          border-radius: var(--radius-card);
          position: relative;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          border: 1px solid rgba(56, 161, 105, 0.08);
        }

        .feature-card::before {
          content: "";
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          height: 4px;
          background: linear-gradient(90deg, var(--color-green-400), var(--color-green-600));
          border-radius: var(--radius-card) var(--radius-card) 0 0;
          opacity: 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: all 0.4s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-hover);
          background: var(--color-white);
        }

        .feature-card:hover::before {
          opacity: 1;
          transform: scaleX(1);
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          background: var(--color-green-100);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 24px;
          color: var(--color-green-700);
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          background: var(--color-green-600);
          color: var(--color-white);
        }

        .feature-card h3 {
          font-size: 1.4rem;
          margin-bottom: 16px;
        }

        .feature-card p {
          font-size: 1.05rem;
          margin: 0;
        }

        /* How It Works Section */
        .how-it-works {
          background-color: var(--color-green-900);
          color: var(--color-white);
          position: relative;
          overflow: hidden;
        }
        
        .how-it-works .section-header h2 {
          color: var(--color-white);
        }

        .how-it-works .section-header p {
          color: var(--color-green-100);
          opacity: 0.8;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          position: relative;
        }

        .steps-grid::before {
          content: "";
          position: absolute;
          top: 44px;
          left: 15%;
          right: 15%;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 0;
        }

        .step-card {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 0 16px;
        }

        .step-icon-wrapper {
          width: 88px;
          height: 88px;
          background: var(--color-green-800);
          border: 2px solid var(--color-green-600);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          margin: 0 auto 24px;
          box-shadow: 0 0 0 10px var(--color-green-900);
          transition: transform 0.3s ease;
        }

        .step-card:hover .step-icon-wrapper {
          transform: scale(1.1);
          background: var(--color-green-700);
        }

        .step-card h3 {
          color: var(--color-white);
          font-size: 1.4rem;
          margin-bottom: 16px;
        }

        .step-card p {
          color: var(--color-green-100);
          opacity: 0.8;
          font-size: 1.05rem;
        }

        /* Testimonials Section */
        .testimonials {
          background: var(--color-cream);
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        .testimonial-card {
          background: var(--color-white);
          padding: 48px;
          border-radius: var(--radius-card-large);
          box-shadow: var(--shadow-card);
          border: 1px solid rgba(56, 161, 105, 0.05);
          transition: transform 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-soft);
        }

        .testimonial-stars {
          color: #FBBF24;
          font-size: 1.4rem;
          margin-bottom: 24px;
          letter-spacing: 2px;
        }

        .testimonial-quote {
          font-size: 1.15rem;
          font-style: italic;
          color: var(--color-text-main);
          margin-bottom: 32px;
          line-height: 1.8;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .author-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-green-100);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }

        .author-info h4 {
          font-family: var(--font-body);
          font-size: 1.1rem;
          margin-bottom: 2px;
        }

        .author-info p {
          font-size: 0.9rem;
          margin: 0;
        }

        /* CTA Section */
        .cta {
          padding: 80px 0 120px;
        }

        .cta-card {
          background: linear-gradient(135deg, var(--color-green-800), var(--color-green-600));
          border-radius: var(--radius-card-large);
          padding: 80px 40px;
          text-align: center;
          color: var(--color-white);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-hover);
        }

        .cta-card::before, .cta-card::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
        }

        .cta-card::before {
          width: 400px; height: 400px;
          top: -150px; left: -100px;
        }

        .cta-card::after {
          width: 500px; height: 500px;
          bottom: -200px; right: -150px;
        }

        .cta-card h2 {
          color: var(--color-white);
          font-size: 3rem;
          margin-bottom: 20px;
          position: relative; z-index: 1;
        }

        .cta-card p {
          color: var(--color-green-50);
          font-size: 1.15rem;
          margin-bottom: 48px;
          position: relative; z-index: 1;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-card .btn-primary {
          background: var(--color-white);
          color: var(--color-green-800);
          font-weight: 700;
          font-size: 1.1rem;
          padding: 18px 48px;
          position: relative; z-index: 1;
        }

        .cta-card .btn-primary:hover {
          background: var(--color-green-50);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        }

        /* Footer */
        .footer {
          background: var(--color-white);
          padding: 48px 0;
          border-top: 1px solid rgba(56, 161, 105, 0.1);
        }

        .footer .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-links {
          display: flex;
          gap: 32px;
        }

        .footer-links a {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: var(--color-green-600);
        }

        .footer-tagline {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        /* Scroll Reveal Animations */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }

        /* Responsive Breakpoints */
        @media (max-width: 1100px) {
          .hero-content h1 { font-size: 3.2rem; }
          .badge-1 { right: 0px; top: -20px; }
          .badge-2 { left: -10px; bottom: 10px; }
        }

        @media (max-width: 768px) {
          .hero .container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .hero-content p { margin: 0 auto 32px; }
          .hero-buttons { justify-content: center; }
          .hero-stats { justify-content: center; flex-wrap: wrap; }
          
          .hero-illustration { margin-top: 40px; }
          .badge-1 { right: 10%; top: -15px; }
          .badge-2 { left: 10%; bottom: 15px; }

          .features-grid, .steps-grid, .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .steps-grid::before { display: none; }
          
          .cta-card h2 { font-size: 2.2rem; }
          
          .footer .container {
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .section { padding: 80px 0; }
          .hero { padding: 120px 0 80px; }
          .hero-content h1 { font-size: 2.4rem; }
          .hero-stats { flex-direction: column; gap: 24px; }
          
          .nav-links { display: none; }
          
          .cta-card { padding: 48px 24px; }
          .cta-card h2 { font-size: 2rem; }
          
          .badge { padding: 8px 16px; font-size: 0.85rem; }
          .badge-1 { right: 0; }
          .badge-2 { left: 0; }
        }
      `}</style>

      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
};

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          farm<span className="logo-leaf">link</span>
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <a href="#testimonials" className="nav-link">Testimonials</a>
        </div>
        <button className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
          Get Started
        </button>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { ref, isVisible } = useScrollReveal();
  
  return (
    <section className="hero">
      <div className="hero-bg-shape"></div>
      <div className="container">
        <div className={`hero-content reveal ${isVisible ? 'active' : ''}`} ref={ref}>
          <h1>Secure your crops before you grow</h1>
          <p>
            Connect directly with verified buyers, lock in your price before sowing season, and eliminate harvest-time uncertainty — all in one platform.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Login</button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <h4>2,400+</h4>
              <p>Farmers</p>
            </div>
            <div className="stat-item">
              <h4>₹18Cr+</h4>
              <p>Contracts Secured</p>
            </div>
            <div className="stat-item">
              <h4>98%</h4>
              <p>Fulfilment Rate</p>
            </div>
          </div>
        </div>
        
        <div className={`hero-illustration reveal delay-200 ${isVisible ? 'active' : ''}`}>
          <div className="badge badge-1">✅ Price Locked</div>
          <div className="badge badge-2">📄 Contract Signed</div>
          
          <div className="mock-card">
            <div className="mock-header">
              <div className="mock-avatar">👨🏽‍🌾</div>
              <div className="mock-header-text">
                <h4>Rajan K.</h4>
                <p>Rice Farmer · Palakkad</p>
              </div>
            </div>
            
            <div className="mock-details">
              <div className="mock-row">
                <span className="mock-label">Crop</span>
                <span className="mock-value">Basmati Rice · 20 tonnes</span>
              </div>
              <div className="mock-row">
                <span className="mock-label">Fixed Price</span>
                <span className="mock-value highlight">₹2,200 / qtl</span>
              </div>
              <div className="mock-row">
                <span className="mock-label">Harvest</span>
                <span className="mock-value">Dec 2025</span>
              </div>
              <div className="mock-row">
                <span className="mock-label">Status</span>
                <span className="mock-value highlight">✓ Secured</span>
              </div>
            </div>
            
            <div className="mock-footer">
              <div className="mock-footer-icon">🏢</div>
              <div className="mock-footer-text">
                <p>FreshMart Co.</p>
                <span>Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section features" id="features">
      <div className="container">
        <div className={`section-header reveal ${isVisible ? 'active' : ''}`} ref={ref}>
          <h2>Why choose farmlink?</h2>
          <p>We provide the tools and security you need to farm with peace of mind.</p>
        </div>
        
        <div className="features-grid">
          <div className={`feature-card reveal delay-100 ${isVisible ? 'active' : ''}`}>
            <div className="feature-icon">🤝</div>
            <h3>Guaranteed Buyers</h3>
            <p>Get matched with verified buyers before sowing season. No more hunting for a market after harvest.</p>
          </div>
          <div className={`feature-card reveal delay-200 ${isVisible ? 'active' : ''}`}>
            <div className="feature-icon">₹</div>
            <h3>Fixed Pricing</h3>
            <p>Lock in your selling price upfront. Protect yourself from market volatility and fluctuating mandi rates.</p>
          </div>
          <div className={`feature-card reveal delay-300 ${isVisible ? 'active' : ''}`}>
            <div className="feature-icon">🛡️</div>
            <h3>Secure Contracts</h3>
            <p>Legally backed digital contracts protect both parties. Dispute resolution is built right in.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section how-it-works" id="how-it-works">
      <div className="container">
        <div className={`section-header reveal ${isVisible ? 'active' : ''}`} ref={ref}>
          <h2>How It Works</h2>
          <p>Secure your harvest in three simple steps.</p>
        </div>
        
        <div className="steps-grid">
          <div className={`step-card reveal delay-100 ${isVisible ? 'active' : ''}`}>
            <div className="step-icon-wrapper">🌱</div>
            <h3>List your crop</h3>
            <p>Tell us what you're growing, how much, and your expected harvest window. Takes 2 minutes.</p>
          </div>
          <div className={`step-card reveal delay-200 ${isVisible ? 'active' : ''}`}>
            <div className="step-icon-wrapper">📬</div>
            <h3>Receive offers</h3>
            <p>Verified buyers browse and send you contract offers directly. You stay in control.</p>
          </div>
          <div className={`step-card reveal delay-300 ${isVisible ? 'active' : ''}`}>
            <div className="step-icon-wrapper">✍️</div>
            <h3>Secure your contract</h3>
            <p>Review, negotiate, and e-sign — all inside farmlink. Start farming with confidence.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section testimonials" id="testimonials">
      <div className="container">
        <div className={`section-header reveal ${isVisible ? 'active' : ''}`} ref={ref}>
          <h2>Trusted by farmers and buyers</h2>
          <p>See what our community has to say about farmlink.</p>
        </div>
        
        <div className="testimonials-grid">
          <div className={`testimonial-card reveal delay-100 ${isVisible ? 'active' : ''}`}>
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-quote">
              "Before farmlink, I used to pray every season that prices wouldn't crash. Now I know exactly what I'll earn."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">🍅</div>
              <div className="author-info">
                <h4>Murugesan A.</h4>
                <p>Tomato Farmer · Coimbatore</p>
              </div>
            </div>
          </div>
          
          <div className={`testimonial-card reveal delay-200 ${isVisible ? 'active' : ''}`}>
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-quote">
              "We source from 200+ farmers through farmlink. The contract system is reliable and quality has been consistently excellent."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">👩🏻‍💼</div>
              <div className="author-info">
                <h4>Priya Menon</h4>
                <p>Procurement Lead · FreshCo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="section cta">
      <div className="container">
        <div className={`cta-card reveal ${isVisible ? 'active' : ''}`} ref={ref}>
          <h2>Start securing your harvest today</h2>
          <p>Free forever for smallholder farmers. No commission until your contract is fulfilled.</p>
          <button className="btn btn-primary">Sign Up Now — It's Free</button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="logo">
          farm<span className="logo-leaf">link</span>
        </div>
        <p className="footer-tagline">Made with 🌱 for Indian farmers</p>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </div>
      </div>
    </footer>
  );
};

// Custom Hook for Scroll Reveal Animation
const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return { ref, isVisible };
};

export default App;