import { useState } from 'react';

const C = { dark:'#1C1A18', mid:'#6B6560', accent:'#C4A882', white:'#FDFCFB' };
const serif = { fontFamily:'var(--serif)' };
const upper = { textTransform:'uppercase', letterSpacing:'2px' };

const skinTones = [
  { id:'fair',     label:'Fair',     hex:'#F5DEB3', desc:'Light, sometimes pinkish' },
  { id:'wheatish', label:'Wheatish', hex:'#C8A882', desc:'Warm golden-beige' },
  { id:'medium',   label:'Medium',   hex:'#A0724A', desc:'Medium brown' },
  { id:'dusky',    label:'Dusky',    hex:'#7A4A2A', desc:'Deep warm brown' },
  { id:'dark',     label:'Dark',     hex:'#4A2A14', desc:'Rich deep brown' },
];

export default function Step2_SkinTone({ onNext, onBack, data }) {
  const [selected, setSelected] = useState(data.skinTone || '');
  const [photoMode, setPhotoMode] = useState(false);

  return (
    <div>
      <button onClick={onBack} style={{ background:'none', border:'none', color:C.mid, ...upper, fontSize:'10px', marginBottom:'24px', padding:0, cursor:'pointer' }}>
        ← Back
      </button>
      <h2 style={{ ...serif, fontSize:'38px', fontWeight:300, marginBottom:'8px' }}>
        Your skin<br /><em style={{ fontStyle:'italic', color:C.accent }}>tone</em>
      </h2>
      <p style={{ fontSize:'13px', color:C.mid, marginBottom:'36px', fontWeight:300, lineHeight:1.7 }}>
        This helps us match colours that naturally complement you.
      </p>

      {/* Tone swatches */}
      <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'28px' }}>
        {skinTones.map(t => (
          <button key={t.id} onClick={() => setSelected(t.id)} style={{
            display:'flex', alignItems:'center', gap:'16px',
            padding:'14px 16px',
            border:`0.5px solid ${selected===t.id ? C.dark : '#D9D2C8'}`,
            background: selected===t.id ? '#F7F3EE' : C.white,
            cursor:'pointer', textAlign:'left', transition:'all 0.15s',
          }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:t.hex, flexShrink:0 }} />
            <div>
              <div style={{ ...upper, fontSize:'11px', fontWeight:500, color:C.dark }}>{t.label}</div>
              <div style={{ fontSize:'12px', color:C.mid, marginTop:'2px' }}>{t.desc}</div>
            </div>
            {selected===t.id && <span style={{ marginLeft:'auto', color:C.accent, fontSize:'18px' }}>✓</span>}
          </button>
        ))}
      </div>

      {/* AI detect option */}
      <div style={{ borderTop:`0.5px solid #D9D2C8`, paddingTop:'20px', marginBottom:'32px' }}>
        <p style={{ fontSize:'12px', color:C.mid, marginBottom:'12px' }}>Or let AI detect your skin tone:</p>
        <label style={{
          display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px',
          border:`0.5px solid #D9D2C8`, background:C.white, cursor:'pointer',
          fontSize:'13px', color:C.mid,
        }}>
          <span style={{ fontSize:'18px', color:C.accent }}>◈</span>
          Upload a photo for AI detection
          <input type="file" accept="image/*" style={{ display:'none' }} onChange={() => {}} />
        </label>
      </div>

      <button
        onClick={() => onNext({ skinTone: selected })} disabled={!selected}
        style={{
          width:'100%', padding:'16px',
          background: selected ? C.dark : '#D9D2C8',
          color: selected ? C.white : '#A09A94', border:'none',
          ...upper, fontSize:'11px', fontWeight:500,
          cursor: selected ? 'pointer' : 'not-allowed', transition:'background 0.15s',
        }}
      >
        Continue →
      </button>
    </div>
  );
}
