import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const C = {
  dark: '#1C1A18', mid: '#6B6560', accent: '#C4A882', white: '#FDFCFB',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLink = (label, color = C.mid) => ({
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color,
    fontWeight: 500,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: 'var(--sans)',
    padding: '4px 0',
    transition: 'color 0.15s',
  });

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: C.white,
      borderBottom: '0.5px solid #D9D2C8',
      padding: '0 48px', height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: scrolled ? '0 2px 20px rgba(28,26,24,0.06)' : 'none',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Logo */}
      <Link to="/" style={{
        fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 400,
        letterSpacing: '4px', textTransform: 'uppercase', color: C.dark,
      }}>
        StyleSense
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <button style={navLink('New')}        onClick={() => navigate('/')}>New</button>
        <button style={navLink('Collections')} onClick={() => goToSection('categories')}>Collections</button>
        <Link   to="/color-guide" style={navLink('Lookbook')}>Lookbook</Link>
        <button style={navLink('About')}      onClick={() => goToSection('instagram')}>About</button>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ color: C.mid, fontSize: '15px', cursor: 'pointer' }} title="Wishlist">♡</span>
        <span style={{ color: C.mid, fontSize: '15px', cursor: 'pointer' }} title="Search">⌕</span>
        <Link to="/quiz">
          <button style={{
            background: C.dark, color: C.white, border: 'none',
            padding: '10px 20px',
            fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
            fontWeight: 500, fontFamily: 'var(--sans)',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = '#2e2b27'}
          onMouseLeave={e => e.target.style.background = C.dark}
          >
            Style Quiz
          </button>
        </Link>
      </div>
    </nav>
  );
}
