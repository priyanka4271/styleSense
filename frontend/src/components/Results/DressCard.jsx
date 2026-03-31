import ShoppingButtons from './ShoppingButtons';

const C = { dark:'#1C1A18', mid:'#6B6560', accent:'#C4A882', white:'#FDFCFB', cream2:'#EEE8DF', cream3:'#E5DDD2' };
const serif = { fontFamily:'var(--serif)' };
const upper = { textTransform:'uppercase', letterSpacing:'2px' };

export default function DressCard({ item }) {
  const { name, price, color, rating, category, reason, image } = item;

  return (
    <div style={{
      background: C.white, overflow:'hidden',
      transition:'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(28,26,24,0.08)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Image */}
      <div style={{ position:'relative', height:'300px', background:`linear-gradient(160deg,${C.cream2},${C.cream3})`, display:'flex', alignItems:'center', justifyContent:'center', ...serif, fontSize:'52px', color:'#B5A895', overflow:'hidden' }}>
        {image
          ? <img src={image} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : '✦'
        }
        <div style={{
          position:'absolute', top:'12px', left:'12px',
          background:C.accent, color:C.dark,
          ...upper, fontSize:'9px', padding:'5px 10px', fontWeight:500,
        }}>
          AI Pick
        </div>
        {rating && (
          <div style={{
            position:'absolute', bottom:'12px', right:'12px',
            background:'rgba(28,26,24,0.75)', color:C.white,
            fontSize:'11px', padding:'4px 10px',
          }}>
            {rating} ★
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:'16px' }}>
        <div style={{ ...upper, fontSize:'10px', color:C.accent, marginBottom:'6px' }}>{category || 'Recommended'}</div>
        <h3 style={{ ...serif, fontSize:'20px', fontWeight:400, marginBottom:'4px', lineHeight:1.2 }}>{name}</h3>
        {color && <p style={{ fontSize:'12px', color:C.mid, marginBottom:'8px' }}>{color}</p>}
        {reason && (
          <p style={{ fontSize:'11px', color:C.mid, lineHeight:1.6, marginBottom:'12px', borderLeft:`2px solid ${C.accent}`, paddingLeft:'10px', fontWeight:300 }}>
            {reason}
          </p>
        )}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ ...serif, fontSize:'20px', fontWeight:400 }}>{price}</span>
        </div>
        <ShoppingButtons item={item} />
      </div>
    </div>
  );
}
