import { Link } from 'react-router-dom';

const C = { cream: '#F7F3EE', cream2: '#EEE8DF', dark: '#1C1A18', mid: '#6B6560', accent: '#C4A882', white: '#FDFCFB' };
const upper = { textTransform: 'uppercase', letterSpacing: '2px' };
const serif = { fontFamily: 'var(--serif)' };

const GUIDE = [
  {
    id: 'fair', label: 'Fair', hex: '#F5DEB3', desc: 'Light with pink or neutral undertones',
    colors: [
      { name: 'Baby Pink',  hex: '#F4A7B9' },
      { name: 'Mint',       hex: '#B5EAD7' },
      { name: 'Lavender',   hex: '#C9B1E8' },
      { name: 'Powder Blue',hex: '#AED6F1' },
      { name: 'Peach',      hex: '#FFDAB9' },
    ],
    tip: 'Pastels and soft neutrals enhance fair skin without washing it out.',
  },
  {
    id: 'wheatish', label: 'Wheatish', hex: '#C8A882', desc: 'Warm golden-beige undertone',
    colors: [
      { name: 'Gold',   hex: '#FFD700' },
      { name: 'Rust',   hex: '#B7410E' },
      { name: 'Olive',  hex: '#808000' },
      { name: 'Coral',  hex: '#FF7F50' },
      { name: 'Mustard',hex: '#FFDB58' },
    ],
    tip: 'Earthy and warm tones bring out the natural golden glow in wheatish skin.',
  },
  {
    id: 'medium', label: 'Medium', hex: '#A0724A', desc: 'Medium warm brown undertone',
    colors: [
      { name: 'Royal Blue', hex: '#4169E1' },
      { name: 'Burgundy',   hex: '#800020' },
      { name: 'Emerald',    hex: '#50C878' },
      { name: 'Purple',     hex: '#800080' },
      { name: 'Teal',       hex: '#008080' },
    ],
    tip: 'Jewel tones pop beautifully against medium skin, creating stunning contrast.',
  },
  {
    id: 'dusky', label: 'Dusky', hex: '#7A4A2A', desc: 'Deep warm brown with rich undertones',
    colors: [
      { name: 'Bright White', hex: '#FFFFFF' },
      { name: 'Hot Pink',     hex: '#FF69B4' },
      { name: 'Electric Blue',hex: '#7DF9FF' },
      { name: 'Neon Yellow',  hex: '#FFFF00' },
      { name: 'Lime',         hex: '#32CD32' },
    ],
    tip: 'Bold brights and stark whites create striking contrast against dusky skin.',
  },
  {
    id: 'dark', label: 'Dark', hex: '#4A2A14', desc: 'Rich deep brown with warm undertones',
    colors: [
      { name: 'Gold',      hex: '#FFD700' },
      { name: 'Bright Red',hex: '#FF0000' },
      { name: 'Cobalt',    hex: '#0047AB' },
      { name: 'Lime',      hex: '#32CD32' },
      { name: 'Silver',    hex: '#C0C0C0' },
    ],
    tip: 'Metallics and vibrant jewel tones create stunning looks on rich dark skin.',
  },
];

export default function ColorGuide() {
  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: C.cream }}>

      {/* Hero Header */}
      <div style={{ background: C.dark, color: C.white, padding: '72px 48px', textAlign: 'center' }}>
        <p style={{ ...upper, fontSize: '10px', color: C.accent, fontWeight: 500, marginBottom: '16px' }}>Style Intelligence</p>
        <h1 style={{ ...serif, fontSize: '56px', fontWeight: 300, lineHeight: 1.1, marginBottom: '16px' }}>
          Colour &<br /><em style={{ fontStyle: 'italic', color: C.accent }}>skin tone</em><br />guide
        </h1>
        <p style={{ fontSize: '13px', color: '#B8B2AA', maxWidth: '480px', margin: '0 auto', lineHeight: 1.75, fontWeight: 300 }}>
          Discover which colours naturally complement your unique skin tone and make you shine.
        </p>
      </div>

      {/* Cards */}
      <div style={{ padding: '64px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
          {GUIDE.map(tone => (
            <div key={tone.id} style={{
              background: C.white, border: '0.5px solid #D9D2C8', overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(28,26,24,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

              {/* Card header */}
              <div style={{ padding: '28px 24px 20px', display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '0.5px solid #EEE8DF' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: tone.hex, flexShrink: 0,
                  border: '3px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                }} />
                <div>
                  <h2 style={{ ...serif, fontSize: '26px', fontWeight: 400, marginBottom: '4px' }}>{tone.label}</h2>
                  <p style={{ fontSize: '12px', color: C.mid }}>{tone.desc}</p>
                </div>
              </div>

              {/* Matching colors */}
              <div style={{ padding: '20px 24px' }}>
                <p style={{ ...upper, fontSize: '10px', color: C.mid, fontWeight: 500, marginBottom: '14px' }}>Best colours for you</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  {tone.colors.map(col => (
                    <div key={col.name} title={col.name} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{
                        width: '100%', aspectRatio: '1', borderRadius: '50%',
                        background: col.hex,
                        border: col.hex === '#FFFFFF' ? '0.5px solid #D9D2C8' : 'none',
                        marginBottom: '6px',
                      }} />
                      <span style={{ fontSize: '9px', color: C.mid, ...upper, letterSpacing: '1px', lineHeight: 1.3, display: 'block' }}>
                        {col.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tip */}
                <p style={{
                  fontSize: '12px', color: C.mid, lineHeight: 1.6,
                  borderLeft: `2px solid ${C.accent}`, paddingLeft: '12px',
                  fontStyle: 'italic', marginBottom: '20px',
                }}>
                  {tone.tip}
                </p>

                {/* CTA */}
                <Link to={`/quiz?skinTone=${tone.id}`}>
                  <button style={{
                    width: '100%', padding: '13px',
                    background: C.dark, color: C.white, border: 'none',
                    ...upper, fontSize: '10px', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'var(--sans)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.background = '#2e2b27'}
                  onMouseLeave={e => e.target.style.background = C.dark}>
                    Shop These Colours →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
