import { useLocation, Link } from 'react-router-dom';
import DressCard from './DressCard';

const C = { dark:'#1C1A18', mid:'#6B6560', accent:'#C4A882', white:'#FDFCFB', cream:'#F7F3EE', cream2:'#EEE8DF' };
const serif = { fontFamily:'var(--serif)' };
const upper = { textTransform:'uppercase', letterSpacing:'2px' };

export default function ResultsPage() {
  const location = useLocation();
  const { results = [], userData = {} } = location.state || {};

  const skinLabel = userData.skinTone
    ? userData.skinTone.charAt(0).toUpperCase() + userData.skinTone.slice(1)
    : '';

  return (
    <div style={{ minHeight:'calc(100vh - 60px)', background:C.cream }}>
      {/* Header */}
      <div style={{ background:C.white, borderBottom:`0.5px solid #D9D2C8`, padding:'48px 48px 36px' }}>
        <p style={{ ...upper, fontSize:'10px', color:C.accent, fontWeight:500, marginBottom:'12px' }}>
          Your Curated Edit
        </p>
        <h1 style={{ ...serif, fontSize:'48px', fontWeight:300, lineHeight:1.1, marginBottom:'12px' }}>
          {userData.name ? `${userData.name}'s` : 'Your'}<br />
          <em style={{ fontStyle:'italic', color:C.accent }}>perfect looks</em>
        </h1>
        {skinLabel && (
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginTop:'16px' }}>
            <span style={{ fontSize:'12px', color:C.mid }}>
              Matched for <strong style={{ fontWeight:500 }}>{skinLabel}</strong> skin tone
            </span>
            {userData.occasions?.length > 0 && (
              <>
                <span style={{ color:'#D9D2C8' }}>·</span>
                <span style={{ fontSize:'12px', color:C.mid }}>
                  {userData.occasions.map(o => o.charAt(0).toUpperCase() + o.slice(1)).join(', ')}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div style={{ padding:'48px' }}>
        {results.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ ...serif, fontSize:'48px', color:C.accent, marginBottom:'16px' }}>✦</div>
            <h2 style={{ ...serif, fontSize:'28px', fontWeight:300, marginBottom:'12px' }}>No results found</h2>
            <p style={{ fontSize:'13px', color:C.mid, marginBottom:'28px' }}>Try adjusting your preferences.</p>
            <Link to="/quiz">
              <button style={{
                background:C.dark, color:C.white, border:'none',
                padding:'14px 28px', ...upper, fontSize:'11px', fontWeight:500, cursor:'pointer',
              }}>
                Retake Quiz
              </button>
            </Link>
          </div>
        ) : (
          <>
            <p style={{ fontSize:'13px', color:C.mid, marginBottom:'32px' }}>
              {results.length} outfits curated just for you
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'24px' }}>
              {results.map((item, i) => (
                <DressCard key={i} item={item} />
              ))}
            </div>

            <div style={{ textAlign:'center', marginTop:'56px', paddingTop:'40px', borderTop:`0.5px solid #D9D2C8` }}>
              <p style={{ fontSize:'13px', color:C.mid, marginBottom:'20px' }}>Want different recommendations?</p>
              <Link to="/quiz">
                <button style={{
                  background:'transparent', color:C.dark, border:`0.5px solid ${C.dark}`,
                  padding:'13px 28px', ...upper, fontSize:'11px', fontWeight:500, cursor:'pointer',
                }}>
                  Retake Quiz
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
