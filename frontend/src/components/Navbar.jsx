import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'var(--white)',
    borderBottom: '0.5px solid #D9D2C8',
    padding: '0 48px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'box-shadow 0.2s',
  },
  navScrolled: {
    boxShadow: '0 2px 20px rgba(28,26,24,0.06)',
  },
  logo: {
    fontFamily: 'var(--serif)',
    fontSize: '20px',
    fontWeight: 400,
    letterSpacing: '4px',
    textTransform: 'uppercase',
    color: 'var(--dark)',
  },
  links: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  },
  link: {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--mid)',
    fontWeight: 500,
    transition: 'color 0.15s',
    padding: '4px 0',
    borderBottom: '0.5px solid transparent',
  },
  linkActive: {
    color: 'var(--dark)',
    borderBottomColor: 'var(--dark)',
  },
  quizBtn: {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontWeight: 500,
    background: 'var(--dark)',
    color: 'var(--white)',
    border: 'none',
    padding: '10px 20px',
    transition: 'background 0.15s',
  },
  icons: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    color: 'var(--mid)',
    fontSize: '15px',
  },
};

const navLinks = [
  { label: 'New',        to: '/' },
  { label: 'Collections', to: '/' },
  { label: 'Lookbook',   to: '/' },
  { label: 'About',      to: '/' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
      <Link to="/" style={styles.logo}>StyleSense</Link>

      <div style={styles.links}>
        {navLinks.map(l => (
          <Link
            key={l.label}
            to={l.to}
            style={{
              ...styles.link,
              ...(location.pathname === l.to && l.to !== '/' ? styles.linkActive : {}),
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={styles.icons}>
          <span title="Search" style={{ cursor: 'pointer' }}>⌕</span>
          <span title="Wishlist" style={{ cursor: 'pointer' }}>♡</span>
          <span title="Cart" style={{ cursor: 'pointer' }}>◻</span>
        </div>
        <Link to="/quiz">
          <button style={styles.quizBtn}>Style Quiz</button>
        </Link>
      </div>
    </nav>
  );
}
