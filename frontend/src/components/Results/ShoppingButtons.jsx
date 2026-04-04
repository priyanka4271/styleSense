const C = { dark: '#1C1A18', mid: '#6B6560', accent: '#C4A882', white: '#FDFCFB' };
const upper = { textTransform: 'uppercase', letterSpacing: '2px' };

const buildShoppingUrls = (item) => {
  const query = encodeURIComponent(`${item.color || ''} ${item.category || ''} ${item.name || ''}`.trim());
  return {
    myntra:   `https://www.myntra.com/${encodeURIComponent((item.category || 'dress').toLowerCase())}?rawQuery=${query}`,
    flipkart: `https://www.flipkart.com/search?q=${query}&otracker=search`,
    amazon:   `https://www.amazon.in/s?k=${query}&i=apparel`,
  };
};

export default function ShoppingButtons({ item }) {
  const urls = buildShoppingUrls(item);

  const addToWishlist = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('ss_wishlist') || '[]');
      if (!wishlist.find(i => i.name === item.name)) {
        wishlist.push(item);
        localStorage.setItem('ss_wishlist', JSON.stringify(wishlist));
      }
      alert(`${item.name} saved to wishlist ♡`);
    } catch { alert('Saved to wishlist ♡'); }
  };

  return (
    <div style={{ marginTop: '14px' }}>
      {/* Wishlist */}
      <button onClick={addToWishlist} style={{
        width: '100%', padding: '10px', marginBottom: '10px',
        border: `0.5px solid #D9D2C8`, background: C.white, color: C.mid,
        ...upper, fontSize: '10px', fontWeight: 500, cursor: 'pointer',
        fontFamily: 'var(--sans)', transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.target.style.borderColor = C.dark; e.target.style.color = C.dark; }}
      onMouseLeave={e => { e.target.style.borderColor = '#D9D2C8'; e.target.style.color = C.mid; }}>
        ♡ Save to Wishlist
      </button>

      {/* Platform buttons */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <a href={urls.myntra} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
          <button style={{
            width: '100%', padding: '11px 6px',
            background: '#FF3F6C', color: '#fff', border: 'none',
            ...upper, fontSize: '9px', fontWeight: 500,
            cursor: 'pointer', fontFamily: 'var(--sans)',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}>
            Myntra
          </button>
        </a>
        <a href={urls.flipkart} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
          <button style={{
            width: '100%', padding: '11px 6px',
            background: '#F7C600', color: C.dark, border: 'none',
            ...upper, fontSize: '9px', fontWeight: 500,
            cursor: 'pointer', fontFamily: 'var(--sans)',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}>
            Flipkart
          </button>
        </a>
        <a href={urls.amazon} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
          <button style={{
            width: '100%', padding: '11px 6px',
            background: '#FF9900', color: '#fff', border: 'none',
            ...upper, fontSize: '9px', fontWeight: 500,
            cursor: 'pointer', fontFamily: 'var(--sans)',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}>
            Amazon
          </button>
        </a>
      </div>
      <p style={{ fontSize: '10px', color: C.mid, textAlign: 'center', marginTop: '8px' }}>
        Prices &amp; availability on partner sites
      </p>
    </div>
  );
}
