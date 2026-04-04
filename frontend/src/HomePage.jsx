import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const C = {
  cream: '#F7F3EE', cream2: '#EEE8DF', cream3: '#E5DDD2',
  dark: '#1C1A18', mid: '#6B6560', accent: '#C4A882', white: '#FDFCFB',
};
const serif = { fontFamily: 'var(--serif)' };
const upper = { textTransform: 'uppercase', letterSpacing: '2px' };

const BG_IMAGE = 'https://static.vecteezy.com/system/resources/thumbnails/035/701/136/small/set-of-fashion-clothes-for-women-casual-garments-and-accessories-for-spring-and-summer-jacket-bags-shoes-trousers-dress-hats-flying-flat-illustrations-isolated-on-white-background-vector.jpg';

const IMAGES = {
  hero:    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&q=80',
  sarees:  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
  kurtis:  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
  dresses: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80',
  coords:  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
  ig: [
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80',
    'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=400&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
  ],
};

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
      padding: '28px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.white, maxWidth: '480px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <img src={item.image} alt={item.name}
          style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
        <div style={{ padding: '28px' }}>
          <div style={{ ...upper, fontSize: '13px', color: C.accent, marginBottom: '8px' }}>{item.category}</div>
          <h2 style={{ ...serif, fontSize: '32px', fontWeight: 400, marginBottom: '10px' }}>{item.name}</h2>
          <p style={{ fontSize: '16px', color: C.mid, marginBottom: '10px' }}>{item.color}</p>
          <p style={{ fontSize: '15px', color: C.mid, lineHeight: 1.7, marginBottom: '18px',
            borderLeft: `2px solid ${C.accent}`, paddingLeft: '12px' }}>{item.reason}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
            <span style={{ ...serif, fontSize: '28px' }}>{item.price}</span>
            <span style={{ fontSize: '15px', color: C.mid }}>{item.rating} ★</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <a href={`https://www.myntra.com/${item.category.toLowerCase()}?rawQuery=${query}`} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
              <button style={{ width: '100%', padding: '13px', background: '#FF3F6C', color: '#fff', border: 'none', ...upper, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Myntra</button>
            </a>
            <a href={`https://www.flipkart.com/search?q=${query}`} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
              <button style={{ width: '100%', padding: '13px', background: '#F7C600', color: C.dark, border: 'none', ...upper, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Flipkart</button>
            </a>
            <a href={`https://www.amazon.in/s?k=${query}&i=apparel`} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
              <button style={{ width: '100%', padding: '13px', background: '#FF9900', color: '#fff', border: 'none', ...upper, fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Amazon</button>
            </a>
          </div>
          <p style={{ fontSize: '13px', color: C.mid, textAlign: 'center' }}>Prices & availability on partner sites</p>
          <button onClick={onClose} style={{ marginTop: '18px', width: '100%', padding: '15px', background: 'transparent', color: C.mid, border: `0.5px solid #D9D2C8`, ...upper, fontSize: '13px', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ── HERO ── */
function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '620px', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>

      {/* Left panel */}
      <div style={{ position: 'relative', padding: '80px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: `url(${BG_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.10 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: C.cream, opacity: 0.85 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ ...upper, fontSize: '13px', color: C.accent, fontWeight: 600, marginBottom: '22px', letterSpacing: '3px' }}>
            New Season — 2026
          </p>
          <h1 style={{ ...serif, fontSize: '90px', fontWeight: 300, lineHeight: 1.05, marginBottom: '28px', color: C.dark }}>
            Dress for<br />
            <em style={{ fontStyle: 'italic', color: C.accent }}>who you</em><br />
            truly are
          </h1>
          <p style={{ fontSize: '19px', color: C.mid, lineHeight: 1.85, maxWidth: '380px', marginBottom: '42px', fontWeight: 300 }}>
            AI-powered style recommendations tailored to your skin tone, body type &amp; personal taste.
          </p>
          <div style={{ display: 'flex', gap: '14px' }}>
            <Link to="/quiz">
              <button style={{ background: C.dark, color: C.white, border: 'none', padding: '20px 42px', ...upper, fontSize: '15px', fontWeight: 600, cursor: 'pointer', letterSpacing: '2px' }}
                onMouseEnter={e => e.target.style.background = '#2e2b27'}
                onMouseLeave={e => e.target.style.background = C.dark}>
                Take the Quiz →
              </button>
            </Link>
            <button style={{ background: 'transparent', color: C.dark, border: `1.5px solid ${C.dark}`, padding: '19px 42px', ...upper, fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
              Explore All
            </button>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={IMAGES.hero} alt="Fashion model" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(247,243,238,0.2), transparent)' }} />
        <div style={{
          position: 'absolute', top: '36px', right: '36px',
          background: C.dark, color: C.white,
          width: '82px', height: '82px', borderRadius: '50%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', ...upper, textAlign: 'center', lineHeight: 1.4,
        }}>
          <span style={{ ...serif, fontSize: '24px', letterSpacing: 0 }}>AI</span>
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
        <div key={t.label} style={{ padding: '28px 24px', textAlign: 'center', borderRight: i < 3 ? '0.5px solid #D9D2C8' : 'none' }}>
          <div style={{ fontSize: '26px', color: C.accent, marginBottom: '8px' }}>{t.icon}</div>
          <div style={{ ...upper, fontSize: '14px', fontWeight: 600 }}>{t.label}</div>
          <div style={{ fontSize: '15px', color: C.mid, marginTop: '4px' }}>{t.sub}</div>
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
    <section style={{ position: 'relative', background: C.dark, color: C.white, padding: '80px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: `url(${BG_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.05 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ ...upper, fontSize: '13px', color: C.accent, fontWeight: 600, marginBottom: '20px', letterSpacing: '3px' }}>Personalized For You</p>
        <h2 style={{ ...serif, fontSize: '62px', fontWeight: 300, lineHeight: 1.1, marginBottom: '22px' }}>
          Your skin tone,<br /><em style={{ fontStyle: 'italic' }}>your style,</em><br />your wardrobe.
        </h2>
        <p style={{ fontSize: '18px', color: '#B8B2AA', lineHeight: 1.85, fontWeight: 300 }}>
          Answer a few questions and let our AI recommend outfits that actually suit you.
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {steps.map(s => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '0.5px solid #3A3731', display: 'flex', alignItems: 'center', justifyContent: 'center', ...serif, fontSize: '20px', color: C.accent, flexShrink: 0 }}>{s.n}</div>
              <div>
                <div style={{ fontSize: '18px', color: C.white, fontWeight: 400, marginBottom: '4px' }}>{s.title}</div>
                <div style={{ fontSize: '16px', color: '#8C8680', fontWeight: 300 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <Link to="/quiz">
          <button style={{ marginTop: '34px', background: C.accent, color: C.dark, border: 'none', padding: '20px 48px', ...upper, fontSize: '15px', fontWeight: 600, cursor: 'pointer', letterSpacing: '2px' }}
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
    <section id="categories" style={{ padding: '72px 56px', background: C.cream }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '42px' }}>
        <h2 style={{ ...serif, fontSize: '52px', fontWeight: 400 }}>Shop by Category</h2>
        <Link to="/quiz" style={{ ...upper, fontSize: '14px', color: C.mid, borderBottom: `0.5px solid ${C.mid}`, paddingBottom: '2px' }}>View All</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px' }}>
        {CATEGORIES.map(cat => (
          <Link key={cat.name} to={`/quiz?category=${cat.param}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <img src={cat.img} alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
              </div>
              <div style={{ padding: '16px 18px', background: C.cream2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ ...upper, fontSize: '15px', fontWeight: 600 }}>{cat.name}</span>
                <span style={{ fontSize: '20px', color: C.mid }}>↗</span>
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
    <section style={{ padding: '72px 56px', background: C.white }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '42px' }}>
        <h2 style={{ ...serif, fontSize: '52px', fontWeight: 400 }}>Recommended For You</h2>
        <Link to="/quiz" style={{ ...upper, fontSize: '14px', color: C.mid, borderBottom: `0.5px solid ${C.mid}`, paddingBottom: '2px' }}>All Products</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '34px' }}>
        {SAMPLE_PRODUCTS.map(p => (
          <div key={p.id} onClick={() => setModal(p)} style={{ cursor: 'pointer' }}>
            <div style={{ height: '340px', overflow: 'hidden', position: 'relative' }}>
              <img src={p.image} alt={p.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
              <div style={{ position: 'absolute', top: '14px', left: '14px', background: C.accent, color: C.dark, ...upper, fontSize: '12px', padding: '7px 14px', fontWeight: 600 }}>AI Pick</div>
            </div>
            <div style={{ paddingTop: '18px' }}>
              <div style={{ ...upper, fontSize: '13px', color: C.accent, marginBottom: '6px' }}>{p.category}</div>
              <div style={{ ...serif, fontSize: '28px', fontWeight: 400, marginBottom: '6px' }}>{p.name}</div>
              <div style={{ fontSize: '16px', color: C.mid, marginBottom: '10px' }}>{p.color}</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '22px', fontWeight: 600 }}>{p.price}</span>
                <span style={{ fontSize: '15px', color: C.mid }}>{p.rating} ★</span>
              </div>
              <p style={{ fontSize: '15px', color: C.mid, marginTop: '8px', fontStyle: 'italic' }}>Click to shop on Myntra / Flipkart</p>
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
    <section id="instagram" style={{ padding: '72px 56px', background: C.cream2, textAlign: 'center' }}>
      <h2 style={{ ...serif, fontSize: '48px', fontWeight: 300, marginBottom: '12px' }}>Follow our world</h2>
      <p style={{ ...upper, fontSize: '14px', color: C.accent, marginBottom: '40px', letterSpacing: '3px' }}>@stylesense</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px' }}>
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
