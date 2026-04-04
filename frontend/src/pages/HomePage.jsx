import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const C = {
  cream: '#F7F3EE', cream2: '#EEE8DF', cream3: '#E5DDD2',
  dark: '#1C1A18', mid: '#6B6560', accent: '#C4A882', white: '#FDFCFB',
};
const serif = { fontFamily: 'var(--serif)' };
const upper = { textTransform: 'uppercase', letterSpacing: '2px' };

const IMAGES = {
  hero:      'https://sewing.com/wp-content/uploads/2022/11/Gemini_Generated_Image_oa47leoa47leoa47-2-1024x559.png',
  sarees:    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
  kurtis:    'data:image/webp;base64,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',
  dresses:   'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80',
  coords:    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
  ig: [
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80',
    'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=400&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
  ],
}


const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Contemporary Gold Saree',  category: 'Sarees',  color: 'Gold',  price: '₹1,007', rating: '4.4', reason: 'Perfect for weddings, flatters wheatish skin tone', image: IMAGES.sarees },
  { id: 2, name: 'Luxe Gold Co-ord Set',     category: 'Co-ords', color: 'Gold',  price: '₹4,755', rating: '3.9', reason: 'Festive favourite, premium fabric', image: IMAGES.coords },
  { id: 3, name: 'Contemporary Gold Kurti',  category: 'Kurtis',  color: 'Gold',  price: '₹1,090', rating: '4.6', reason: 'Daily wear, skin tone curated, 40% off', image: IMAGES.kurtis },
];

const CATEGORIES = [
  { name: 'Sarees',  param: 'sarees',  img: IMAGES.sarees },
  { name: 'Kurtis',  param: 'kurtis',  img: IMAGES.kurtis },
  { name: 'Dresses', param: 'dresses', img: IMAGES.dresses },
  { name: 'Co-ords', param: 'coords',  img: IMAGES.coords },
];

/* ── Product Modal ── */
function ProductModal({ item, onClose }) {
  if (!item) return null;
  const query = encodeURIComponent(`${item.color} ${item.category} ${item.name}`);
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(28,26,24,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.white, maxWidth: '480px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <img src={item.image} alt={item.name}
          style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
        <div style={{ padding: '24px' }}>
          <div style={{ ...upper, fontSize: '10px', color: C.accent, marginBottom: '6px' }}>{item.category}</div>
          <h2 style={{ ...serif, fontSize: '26px', fontWeight: 400, marginBottom: '8px' }}>{item.name}</h2>
          <p style={{ fontSize: '12px', color: C.mid, marginBottom: '8px' }}>{item.color}</p>
          <p style={{ fontSize: '12px', color: C.mid, lineHeight: 1.6, marginBottom: '16px',
            borderLeft: `2px solid ${C.accent}`, paddingLeft: '10px' }}>{item.reason}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ ...serif, fontSize: '22px' }}>{item.price}</span>
            <span style={{ fontSize: '12px', color: C.mid }}>{item.rating} ★</span>
          </div>
          {/* Shopping buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <a href={`https://www.myntra.com/${item.category.toLowerCase()}?rawQuery=${query}`}
              target="_blank" rel="noreferrer" style={{ flex: 1 }}>
              <button style={{ width: '100%', padding: '10px', background: '#FF3F6C',
                color: '#fff', border: 'none', ...upper, fontSize: '10px', fontWeight: 500 }}>
                Myntra
              </button>
            </a>
            <a href={`https://www.flipkart.com/search?q=${query}`}
              target="_blank" rel="noreferrer" style={{ flex: 1 }}>
              <button style={{ width: '100%', padding: '10px', background: '#F7C600',
                color: C.dark, border: 'none', ...upper, fontSize: '10px', fontWeight: 500 }}>
                Flipkart
              </button>
            </a>
            <a href={`https://www.amazon.in/s?k=${query}&i=apparel`}
              target="_blank" rel="noreferrer" style={{ flex: 1 }}>
              <button style={{ width: '100%', padding: '10px', background: '#FF9900',
                color: '#fff', border: 'none', ...upper, fontSize: '10px', fontWeight: 500 }}>
                Amazon
              </button>
            </a>
          </div>
          <p style={{ fontSize: '10px', color: C.mid, textAlign: 'center' }}>Prices & availability on partner sites</p>
          <button onClick={onClose} style={{
            marginTop: '16px', width: '100%', padding: '12px',
            background: 'transparent', color: C.mid,
            border: `0.5px solid #D9D2C8`, ...upper, fontSize: '10px',
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ── HERO ── */
function Hero() {
  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '520px' }}>
      <div style={{ padding: '72px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: C.cream }}>
        <p style={{ ...upper, fontSize: '10px', color: C.accent, fontWeight: 500, marginBottom: '20px' }}>New Season — 2026</p>
        <h1 style={{ ...serif, fontSize: '62px', fontWeight: 300, lineHeight: 1.08, marginBottom: '24px' }}>
          Dress for<br /><em style={{ fontStyle: 'italic', color: C.accent }}>who you</em><br />truly are
        </h1>
        <p style={{ fontSize: '13px', color: C.mid, lineHeight: 1.75, maxWidth: '300px', marginBottom: '36px', fontWeight: 300 }}>
          AI-powered style recommendations tailored to your skin tone, body type &amp; personal taste.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/quiz">
            <button style={{
              background: C.dark, color: C.white, border: 'none',
              padding: '14px 28px', ...upper, fontSize: '11px', fontWeight: 500,
            }}
            onMouseEnter={e => e.target.style.background = '#2e2b27'}
            onMouseLeave={e => e.target.style.background = C.dark}>
              Take the Quiz →
            </button>
          </Link>
          <button style={{
            background: 'transparent', color: C.dark,
            border: `1px solid ${C.dark}`, padding: '13px 28px',
            ...upper, fontSize: '11px', fontWeight: 500,
          }}>
            Explore All
          </button>
        </div>
      </div>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={IMAGES.hero} alt="Fashion model"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', top: '32px', right: '32px',
          background: C.dark, color: C.white,
          width: '72px', height: '72px', borderRadius: '50%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontSize: '9px', ...upper, textAlign: 'center', lineHeight: 1.4,
        }}>
          <span style={{ ...serif, fontSize: '20px', letterSpacing: 0 }}>AI</span>
          Styled
        </div>
      </div>
    </section>
  );
}

/* ── TRUST BAR ── */
const trustItems = [
  { icon: '⊙', label: 'Free Shipping', sub: 'On all orders' },
  { icon: '◈', label: 'AI Matched',    sub: 'Skin tone aware' },
  { icon: '⊕', label: 'Easy Returns',  sub: '30 day policy' },
  { icon: '◎', label: 'Secure Pay',    sub: '100% safe' },
];
function TrustBar() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: C.white, borderTop: '0.5px solid #D9D2C8', borderBottom: '0.5px solid #D9D2C8' }}>
      {trustItems.map((t, i) => (
        <div key={t.label} style={{ padding: '22px 24px', textAlign: 'center', borderRight: i < 3 ? '0.5px solid #D9D2C8' : 'none' }}>
          <div style={{ fontSize: '18px', color: C.accent, marginBottom: '6px' }}>{t.icon}</div>
          <div style={{ ...upper, fontSize: '10px', fontWeight: 500 }}>{t.label}</div>
          <div style={{ fontSize: '11px', color: C.mid, marginTop: '2px' }}>{t.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ── QUIZ CTA ── */
const steps = [
  { n: '1', title: 'Upload your photo',      desc: 'AI detects your skin tone automatically' },
  { n: '2', title: 'Share your preferences', desc: 'Occasion, style, budget — your call' },
  { n: '3', title: 'Get curated picks',      desc: 'Outfits handpicked by your personal AI stylist' },
];
function QuizCTA() {
  return (
    <section style={{ background: C.dark, color: C.white, padding: '64px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
      <div>
        <p style={{ ...upper, fontSize: '10px', color: C.accent, fontWeight: 500, marginBottom: '16px' }}>Personalized For You</p>
        <h2 style={{ ...serif, fontSize: '44px', fontWeight: 300, lineHeight: 1.15, marginBottom: '16px' }}>
          Your skin tone,<br /><em style={{ fontStyle: 'italic' }}>your style,</em><br />your wardrobe.
        </h2>
        <p style={{ fontSize: '13px', color: '#B8B2AA', lineHeight: 1.75, fontWeight: 300 }}>
          Answer a few questions and let our AI recommend outfits that actually suit you.
        </p>
      </div>
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {steps.map(s => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                border: '0.5px solid #3A3731', display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...serif, fontSize: '16px', color: C.accent, flexShrink: 0,
              }}>{s.n}</div>
              <div>
                <div style={{ fontSize: '13px', color: C.white, fontWeight: 400, marginBottom: '2px' }}>{s.title}</div>
                <div style={{ fontSize: '12px', color: '#8C8680', fontWeight: 300 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <Link to="/quiz">
          <button style={{
            marginTop: '28px', background: C.accent, color: C.dark,
            border: 'none', padding: '14px 32px', ...upper, fontSize: '11px', fontWeight: 500,
          }}
          onMouseEnter={e => e.target.style.background = '#b09470'}
          onMouseLeave={e => e.target.style.background = C.accent}>
            Start My Style Quiz →
          </button>
        </Link>
      </div>
    </section>
  );
}

/* ── CATEGORIES ── */
function Categories() {
  return (
    <section id="categories" style={{ padding: '64px 48px', background: C.cream }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '36px' }}>
        <h2 style={{ ...serif, fontSize: '34px', fontWeight: 400 }}>Shop by Category</h2>
        <Link to="/quiz" style={{ ...upper, fontSize: '10px', color: C.mid, borderBottom: `0.5px solid ${C.mid}`, paddingBottom: '2px' }}>View All</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
        {CATEGORIES.map(cat => (
          <Link key={cat.name} to={`/quiz?category=${cat.param}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img src={cat.img} alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
              </div>
              <div style={{ padding: '14px 16px', background: C.cream2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ ...upper, fontSize: '11px', fontWeight: 500 }}>{cat.name}</span>
                <span style={{ fontSize: '16px', color: C.mid }}>↗</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── FEATURED PRODUCTS ── */
function FeaturedProducts() {
  const [modal, setModal] = useState(null);
  return (
    <section style={{ padding: '64px 48px', background: C.white }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '36px' }}>
        <h2 style={{ ...serif, fontSize: '34px', fontWeight: 400 }}>Recommended For You</h2>
        <Link to="/quiz" style={{ ...upper, fontSize: '10px', color: C.mid, borderBottom: `0.5px solid ${C.mid}`, paddingBottom: '2px' }}>All Products</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '28px' }}>
        {SAMPLE_PRODUCTS.map(p => (
          <div key={p.id} onClick={() => setModal(p)} style={{ cursor: 'pointer' }}>
            <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
              <img src={p.image} alt={p.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
              <div style={{
                position: 'absolute', top: '12px', left: '12px',
                background: C.accent, color: C.dark,
                ...upper, fontSize: '9px', padding: '5px 10px', fontWeight: 500,
              }}>AI Pick</div>
            </div>
            <div style={{ paddingTop: '14px' }}>
              <div style={{ ...upper, fontSize: '10px', color: C.accent, marginBottom: '4px' }}>{p.category}</div>
              <div style={{ ...serif, fontSize: '19px', fontWeight: 400, marginBottom: '4px' }}>{p.name}</div>
              <div style={{ fontSize: '11px', color: C.mid, marginBottom: '8px' }}>{p.color}</div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{p.price}</span>
                <span style={{ fontSize: '11px', color: C.mid }}>{p.rating} ★</span>
              </div>
              <p style={{ fontSize: '11px', color: C.mid, marginTop: '6px', fontStyle: 'italic' }}>Click to shop on Myntra / Flipkart</p>
            </div>
          </div>
        ))}
      </div>
      <ProductModal item={modal} onClose={() => setModal(null)} />
    </section>
  );
}

/* ── INSTAGRAM ── */
function Instagram() {
  return (
    <section id="instagram" style={{ padding: '64px 48px', background: C.cream2, textAlign: 'center' }}>
      <h2 style={{ ...serif, fontSize: '30px', fontWeight: 300, marginBottom: '8px' }}>Follow our world</h2>
      <p style={{ ...upper, fontSize: '10px', color: C.accent, marginBottom: '36px' }}>@stylesense</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '8px' }}>
        {IMAGES.ig.map((src, i) => (
          <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', cursor: 'pointer' }}>
            <img src={src} alt={`Instagram ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s, opacity 0.3s' }}
              onMouseEnter={e => { e.target.style.transform = 'scale(1.08)'; e.target.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.opacity = '1'; }} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <QuizCTA />
      <Categories />
      <FeaturedProducts />
      <Instagram />
    </main>
  );
}
