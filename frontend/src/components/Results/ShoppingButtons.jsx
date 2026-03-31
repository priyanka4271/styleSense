const C = { dark:'#1C1A18', mid:'#6B6560', accent:'#C4A882', white:'#FDFCFB' };
const upper = { textTransform:'uppercase', letterSpacing:'2px' };

export default function ShoppingButtons({ item }) {
  const addToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.find(i => i.name === item.name)) {
      wishlist.push(item);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    alert(`${item.name} added to wishlist ♡`);
  };

  return (
    <div style={{ display:'flex', gap:'8px', marginTop:'14px' }}>
      <button onClick={addToWishlist} style={{
        flex:1, padding:'10px',
        border:`0.5px solid #D9D2C8`, background:C.white, color:C.mid,
        ...upper, fontSize:'10px', fontWeight:500,
        cursor:'pointer', transition:'all 0.15s',
      }}
      onMouseEnter={e => { e.target.style.borderColor = C.dark; e.target.style.color = C.dark; }}
      onMouseLeave={e => { e.target.style.borderColor = '#D9D2C8'; e.target.style.color = C.mid; }}
      >
        ♡ Save
      </button>
      <button style={{
        flex:2, padding:'10px',
        background:C.dark, color:C.white, border:'none',
        ...upper, fontSize:'10px', fontWeight:500,
        cursor:'pointer', transition:'background 0.15s',
      }}
      onMouseEnter={e => e.target.style.background = '#2e2b27'}
      onMouseLeave={e => e.target.style.background = C.dark}
      >
        Add to Cart
      </button>
    </div>
  );
}
