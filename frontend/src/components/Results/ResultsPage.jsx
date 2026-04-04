import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import DressCard from './DressCard';

const C = { cream: '#F7F3EE', cream2: '#EEE8DF', dark: '#1C1A18', mid: '#6B6560', accent: '#C4A882', white: '#FDFCFB' };
const upper = { textTransform: 'uppercase', letterSpacing: '2px' };
const serif = { fontFamily: 'var(--serif)' };

const SKIN_TONE_HEX = {
  fair: '#F5DEB3', wheatish: '#C8A882', medium: '#A0724A', dusky: '#7A4A2A', dark: '#4A2A14',
};
const FILTERS = ['All', 'Sarees', 'Kurtis', 'Dresses', 'Co-ords'];

export default function ResultsPage() {
  const location                = useLocation();
  const { results = [], userData = {} } = location.state || {};
  const [activeFilter, setFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? results
    : results.filter(r => r.category?.toLowerCase() === activeFilter.toLowerCase()
        || r.category?.toLowerCase().includes(activeFilter.toLowerCase().replace('-', '')));

  const skinHex   = SKIN_TONE_HEX[userData.skinTone] || null;
  const skinLabel = userData.skinTone ? userData.skinTone.charAt(0).toUpperCase() + userData.skinTone.slice(1) : '';

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: C.cream }}>

      {/* Header */}
      <div style={{ background: C.white, borderBottom: '0.5px solid #D9D2C8', padding: '48px 48px 32px' }}>
        <p style={{ ...upper, fontSize: '10px', color: C.accent, fontWeight: 500, marginBottom: '12px' }}>Your Curated Edit</p>
        <h1 style={{ ...serif, fontSize: '52px', fontWeight: 300, lineHeight: 1.1, marginBottom: '16px' }}>
          {userData.name ? `${userData.name}'s` : 'Your'}<br />
          <em style={{ fontStyle: 'italic', color: C.accent }}>perfect looks</em>
        </h1>

        {/* Meta badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {skinHex && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: skinHex, border: '0.5px solid rgba(0,0,0,0.1)' }} />
              <span style={{ fontSize: '12px', color: C.mid }}>{skinLabel} skin tone</span>
            </div>
          )}
          {userData.occasions?.length > 0 && (
            <>
              <span style={{ color: '#D9D2C8' }}>·</span>
              <span style={{ fontSize: '12px', color: C.mid }}>
                {userData.occasions.map(o => o.charAt(0).toUpperCase() + o.slice(1)).join(', ')}
              </span>
            </>
          )}
          {userData.budget && (
            <>
              <span style={{ color: '#D9D2C8' }}>·</span>
              <span style={{ fontSize: '12px', color: C.mid }}>{userData.budget} budget</span>
            </>
          )}
          <span style={{ ...upper, fontSize: '10px', color: C.accent, marginLeft: 'auto' }}>
            {results.length} outfits found
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ background: C.white, borderBottom: '0.5px solid #D9D2C8', padding: '0 48px', display: 'flex', gap: '0' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '16px 20px', background: 'none', border: 'none',
            borderBottom: activeFilter === f ? `2px solid ${C.dark}` : '2px solid transparent',
            ...upper, fontSize: '10px', fontWeight: 500,
            color: activeFilter === f ? C.dark : C.mid,
            cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--sans)',
          }}>{f}</button>
        ))}
      </div>

      {/* Results Grid */}
      <div style={{ padding: '48px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ ...serif, fontSize: '48px', color: C.accent, marginBottom: '16px' }}>✦</div>
            <h2 style={{ ...serif, fontSize: '28px', fontWeight: 300, marginBottom: '12px' }}>No results in this category</h2>
            <button onClick={() => setFilter('All')} style={{
              background: C.dark, color: C.white, border: 'none',
              padding: '14px 28px', ...upper, fontSize: '11px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--sans)',
            }}>Show All</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {filtered.map((item, i) => (
              <DressCard key={i} item={item} userSkinTone={userData.skinTone} />
            ))}
          </div>
        )}

        {/* Retake Quiz */}
        <div style={{ textAlign: 'center', marginTop: '56px', paddingTop: '40px', borderTop: '0.5px solid #D9D2C8' }}>
          <p style={{ fontSize: '13px', color: C.mid, marginBottom: '20px' }}>Want different recommendations?</p>
          <Link to="/quiz">
            <button style={{
              background: 'transparent', color: C.dark,
              border: `0.5px solid ${C.dark}`, padding: '13px 28px',
              ...upper, fontSize: '11px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--sans)',
            }}>Retake Quiz</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
