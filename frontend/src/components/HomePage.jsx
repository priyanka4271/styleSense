import { Link } from 'react-router-dom';

/* ── inline style tokens ── */
const C = {
  cream: '#F7F3EE', cream2: '#EEE8DF', cream3: '#E5DDD2',
  dark: '#1C1A18', mid: '#6B6560', light: '#B8B2AA',
  accent: '#C4A882', white: '#FDFCFB',
};

const serif = { fontFamily: 'var(--serif)' };
const sans  = { fontFamily: 'var(--sans)' };
const upper = { textTransform: 'uppercase', letterSpacing: '2px' };

/* ══════════════════════════════
   HERO
══════════════════════════════ */
function Hero() {
  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '520px', background: C.cream }}>
      {/* Left */}
      <div style={{ padding: '72px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ ...upper, fontSize: '10px', color: C.accent, fontWeight: 500, marginBottom: '20px' }}>
          New Season — 2026
        </p>
        <h1 style={{ ...serif, fontSize: '62px', fontWeight: 300, lineHeight: 1.08, marginBottom: '24px', color: C.dark }}>
          Dress for<br />
          <em style={{ fontStyle: 'italic', color: C.accent }}>who you</em><br />
          truly are
        </h1>
        <p style={{ fontSize: '13px', color: C.mid, lineHeight: 1.75, maxWidth: '300px', marginBottom: '36px', fontWeight: 300 }}>
          AI-powered style recommendations tailored to your skin tone, body type &amp; personal taste.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/quiz">
            <button style={{
              background: C.dark, color: C.white, border: 'none',
              padding: '14px 28px', ...upper, fontSize: '11px', fontWeight: 500,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.target.style.background = '#2e2b27'}
            onMouseLeave={e => e.target.style.background = C.dark}
            >
              Take the Quiz →
            </button>
          </Link>
          <button style={{
            background: 'transparent', color: C.dark, border: `1px solid ${C.dark}`,
            padding: '13px 28px', ...upper, fontSize: '11px', fontWeight: 500,
          }}>
            Explore All
          </button>
        </div>
      </div>

      {/* Right — image placeholder; replace src with real photo */}
      <div style={{ background: C.cream2, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <div style={{
          width: '280px', height: '440px',
          background: `linear-gradient(180deg, ${C.cream3} 0%, #C8BFB0 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...serif, fontSize: '14px', letterSpacing: '2px', color: '#8C7F6E',
        }}>
          {/* Replace with: <img src="/hero-model.jpg" alt="Model" style={{width:'100%',height:'100%',objectFit:'cover'}} /> */}
          Your Model Photo
        </div>
        <div style={{
          position: 'absolute', top: '32px', right: '32px',
          background: C.dark, color: C.white,
          width: '68px', height: '68px', borderRadius: '50%',
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

/* ══════════════════════════════
   TRUST BAR
══════════════════════════════ */
const trustItems = [
  { icon: '⊙', label: 'Free Shipping', sub: 'On all orders' },
  { icon: '◈', label: 'AI Matched',    sub: 'Skin tone aware' },
  { icon: '⊕', label: 'Easy Returns',  sub: '30 day policy' },
  { icon: '◎', label: 'Secure Pay',    sub: '100% safe' },
];

function TrustBar() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: C.white, borderTop: `0.5px solid #D9D2C8`, borderBottom: `0.5px solid #D9D2C8` }}>
      {trustItems.map((t, i) => (
        <div key={t.label} style={{ padding: '22px 24px', textAlign: 'center', borderRight: i < 3 ? `0.5px solid #D9D2C8` : 'none' }}>
          <div style={{ fontSize: '18px', color: C.accent, marginBottom: '6px' }}>{t.icon}</div>
          <div style={{ ...upper, fontSize: '10px', fontWeight: 500, color: C.dark }}>{t.label}</div>
          <div style={{ fontSize: '11px', color: C.mid, marginTop: '2px' }}>{t.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════
   QUIZ CTA
══════════════════════════════ */
const steps = [
  { n: '1', title: 'Upload your photo',     desc: 'AI detects your skin tone automatically' },
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
          Answer a few questions and let our AI recommend outfits that actually suit you — not just what's trending.
        </p>
      </div>
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {steps.map(s => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                border: `0.5px solid #3A3731`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
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
            border: 'none', padding: '14px 32px',
            ...upper, fontSize: '11px', fontWeight: 500,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.target.style.background = '#b09470'}
          onMouseLeave={e => e.target.style.background = C.accent}
          >
            Start My Style Quiz →
          </button>
        </Link>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   CATEGORIES
══════════════════════════════ */
const categories = [
  { name: 'Sarees',  icon: '✦' },
  { name: 'Kurtis',  icon: '◈' },
  { name: 'Dresses', icon: '⊛' },
  { name: 'Co-ords', icon: '◉' },
];

function Categories() {
  return (
    <section style={{ padding: '64px 48px', background: C.cream }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '36px' }}>
        <h2 style={{ ...serif, fontSize: '34px', fontWeight: 400 }}>Shop by Category</h2>
        <a href="#" style={{ ...upper, fontSize: '10px', color: C.mid, borderBottom: `0.5px solid ${C.mid}`, paddingBottom: '2px' }}>View All</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
        {categories.map(cat => (
          <div key={cat.name} style={{ background: C.cream2, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Replace icon div with <img> when you have category images */}
            <div style={{
              height: '190px', background: `linear-gradient(160deg, ${C.cream3}, #C8BFB0)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              ...serif, fontSize: '44px', color: '#8C7F6E',
            }}>
              {cat.icon}
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ ...upper, fontSize: '11px', fontWeight: 500 }}>{cat.name}</span>
              <span style={{ fontSize: '16px', color: C.mid }}>↗</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════
   FEATURED PRODUCTS
══════════════════════════════ */
const sampleProducts = [
  { id: 1, name: 'Contemporary Gold Saree',  sub: 'Wedding · Wheatish Skin Match', price: '₹1,007', rating: '4.4', badge: 'AI Pick',  badgeType: 'new', icon: '✦' },
  { id: 2, name: 'Luxe Gold Co-ord Set',     sub: 'Festive · Perfect Color Match',  price: '₹4,755', rating: '3.9', badge: null,       badgeType: null,  icon: '◈' },
  { id: 3, name: 'Contemporary Gold Kurti',  sub: 'Casual · Skin Tone Curated',     price: '₹1,090', rating: '4.6', badge: '40% Off',  badgeType: 'sale', icon: '⊕' },
];

function FeaturedProducts() {
  return (
    <section style={{ padding: '64px 48px', background: C.white }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '36px' }}>
        <h2 style={{ ...serif, fontSize: '34px', fontWeight: 400 }}>Recommended For You</h2>
        <a href="#" style={{ ...upper, fontSize: '10px', color: C.mid, borderBottom: `0.5px solid ${C.mid}`, paddingBottom: '2px' }}>All Products</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '28px' }}>
        {sampleProducts.map(p => (
          <div key={p.id} style={{ cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.querySelector('.prod-img').style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.querySelector('.prod-img').style.transform = 'scale(1)'}
          >
            <div style={{ overflow: 'hidden', position: 'relative' }}>
              <div className="prod-img" style={{
                height: '280px',
                background: `linear-gradient(160deg, ${C.cream2}, ${C.cream3})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...serif, fontSize: '52px', color: '#B5A895',
                transition: 'transform 0.3s ease',
              }}>
                {p.icon}
                {/* Replace with: <img src={p.image} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> */}
              </div>
              {p.badge && (
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                  background: p.badgeType === 'new' ? C.accent : C.dark,
                  color: p.badgeType === 'new' ? C.dark : C.white,
                  ...upper, fontSize: '9px', padding: '5px 10px', fontWeight: 500,
                }}>
                  {p.badge}
                </div>
              )}
            </div>
            <div style={{ paddingTop: '14px' }}>
              <div style={{ ...serif, fontSize: '18px', fontWeight: 400, marginBottom: '4px' }}>{p.name}</div>
              <div style={{ ...upper, fontSize: '10px', color: C.mid, marginBottom: '10px' }}>{p.sub}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{p.price}</span>
                <span style={{ fontSize: '11px', color: C.mid }}>{p.rating} ★</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════
   INSTAGRAM SECTION
══════════════════════════════ */
function Instagram() {
  const tiles = ['✦', '◈', '⊛', '◉', '⊕', '✧'];
  return (
    <section style={{ padding: '64px 48px', background: C.cream2, textAlign: 'center' }}>
      <h2 style={{ ...serif, fontSize: '30px', fontWeight: 300, marginBottom: '8px' }}>Follow our world</h2>
      <p style={{ ...upper, fontSize: '10px', color: C.accent, marginBottom: '36px' }}>@stylesense</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '8px' }}>
        {tiles.map((t, i) => (
          <div key={i} style={{
            aspectRatio: '1',
            background: `linear-gradient(160deg, ${C.cream3}, #C4B9A8)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...serif, fontSize: '24px', color: '#A89888', cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {t}
            {/* Replace with: <img src={`/ig/${i}.jpg`} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> */}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════
   PAGE EXPORT
══════════════════════════════ */
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
