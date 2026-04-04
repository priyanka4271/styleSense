import ShoppingButtons from './ShoppingButtons';

const C = { dark: '#1C1A18', mid: '#6B6560', accent: '#C4A882', white: '#FDFCFB', cream2: '#EEE8DF', cream3: '#E5DDD2' };
const upper = { textTransform: 'uppercase', letterSpacing: '2px' };
const serif = { fontFamily: 'var(--serif)' };

const SKIN_TONE_COLORS = {
  fair: '#F5DEB3', wheatish: '#C8A882', medium: '#A0724A', dusky: '#7A4A2A', dark: '#4A2A14',
};

const FALLBACK_IMAGES = {
  sarees:  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
  kurtis:  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
  dresses: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80',
  coords:  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
  default: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
};

function getFallback(category = '') {
  const key = category.toLowerCase().replace('-', '').replace(' ', '');
  return FALLBACK_IMAGES[key] || FALLBACK_IMAGES.default;
}

export default function DressCard({ item, userSkinTone }) {
  const imgSrc    = item.image || getFallback(item.category);
  const skinColor = SKIN_TONE_COLORS[userSkinTone] || null;

  return (
    <div style={{
      background: C.white, overflow: 'hidden',
      border: '0.5px solid #EEE8DF',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(28,26,24,0.08)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
        <img src={imgSrc} alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          onError={e => { e.target.src = FALLBACK_IMAGES.default; }} />

        {/* AI Pick badge */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: C.accent, color: C.dark,
          ...upper, fontSize: '9px', padding: '5px 10px', fontWeight: 500,
        }}>AI Pick</div>

        {/* Rating */}
        {item.rating && (
          <div style={{
            position: 'absolute', bottom: '12px', right: '12px',
            background: 'rgba(28,26,24,0.75)', color: C.white,
            fontSize: '11px', padding: '4px 10px',
          }}>{item.rating} ★</div>
        )}

        {/* Skin tone match dot */}
        {skinColor && (
          <div title={`Matched for ${userSkinTone} skin tone`} style={{
            position: 'absolute', bottom: '12px', left: '12px',
            width: '24px', height: '24px', borderRadius: '50%',
            background: skinColor, border: '2px solid white',
          }} />
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px' }}>
        <div style={{ ...upper, fontSize: '10px', color: C.accent, marginBottom: '6px' }}>{item.category}</div>
        <h3 style={{ ...serif, fontSize: '20px', fontWeight: 400, marginBottom: '4px', lineHeight: 1.2 }}>{item.name}</h3>
        {item.color && <p style={{ fontSize: '12px', color: C.mid, marginBottom: '8px' }}>{item.color}</p>}
        {item.reason && (
          <p style={{
            fontSize: '11px', color: C.mid, lineHeight: 1.6, marginBottom: '12px',
            borderLeft: `2px solid ${C.accent}`, paddingLeft: '10px', fontStyle: 'italic',
          }}>{item.reason}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ ...serif, fontSize: '20px', fontWeight: 400 }}>{item.price}</span>
        </div>
        <ShoppingButtons item={item} />
      </div>
    </div>
  );
}
