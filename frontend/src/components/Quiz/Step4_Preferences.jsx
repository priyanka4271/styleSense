import { useState } from 'react';

const C = { dark:'#1C1A18', mid:'#6B6560', accent:'#C4A882', white:'#FDFCFB', cream:'#F7F3EE' };
const serif = { fontFamily:'var(--serif)' };
const upper = { textTransform:'uppercase', letterSpacing:'2px' };

const styleVibes = ['Traditional', 'Fusion', 'Western', 'Minimal', 'Bold & Bright', 'Pastel & Soft'];
const budgets    = [
  { id:'budget',   label:'Under ₹1,000' },
  { id:'mid',      label:'₹1,000 – ₹5,000' },
  { id:'premium',  label:'₹5,000 – ₹15,000' },
  { id:'luxury',   label:'Above ₹15,000' },
];

export default function Step4_Preferences({ onNext, onBack, data, loading }) {
  const [vibes,  setVibes]  = useState(data.vibes  || []);
  const [budget, setBudget] = useState(data.budget  || '');

  const toggleVibe = (v) => setVibes(prev =>
    prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
  );

  const valid = vibes.length > 0 && budget;

  return (
    <div>
      <button onClick={onBack} style={{ background:'none', border:'none', color:C.mid, ...upper, fontSize:'10px', marginBottom:'24px', padding:0, cursor:'pointer' }}>
        ← Back
      </button>
      <h2 style={{ ...serif, fontSize:'38px', fontWeight:300, marginBottom:'8px' }}>
        Your style<br /><em style={{ fontStyle:'italic', color:C.accent }}>preferences</em>
      </h2>
      <p style={{ fontSize:'13px', color:C.mid, marginBottom:'36px', fontWeight:300, lineHeight:1.7 }}>
        Last step! Tell us your vibe and budget.
      </p>

      {/* Style vibes */}
      <div style={{ marginBottom:'32px' }}>
        <label style={{ ...upper, fontSize:'10px', color:C.mid, fontWeight:500, display:'block', marginBottom:'14px' }}>
          Your style vibe (pick any)
        </label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
          {styleVibes.map(v => {
            const active = vibes.includes(v);
            return (
              <button key={v} onClick={() => toggleVibe(v)} style={{
                padding:'8px 16px', border:`0.5px solid ${active ? C.dark : '#D9D2C8'}`,
                background: active ? C.dark : C.white,
                color: active ? C.white : C.mid,
                fontSize:'12px', fontWeight: active ? 500 : 400,
                cursor:'pointer', transition:'all 0.15s',
              }}>
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget */}
      <div style={{ marginBottom:'40px' }}>
        <label style={{ ...upper, fontSize:'10px', color:C.mid, fontWeight:500, display:'block', marginBottom:'14px' }}>
          Budget range
        </label>
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {budgets.map(b => (
            <button key={b.id} onClick={() => setBudget(b.id)} style={{
              padding:'12px 16px', textAlign:'left',
              border:`0.5px solid ${budget===b.id ? C.dark : '#D9D2C8'}`,
              background: budget===b.id ? C.dark : C.white,
              color: budget===b.id ? C.white : C.dark,
              fontSize:'13px', display:'flex', justifyContent:'space-between', alignItems:'center',
              cursor:'pointer', transition:'all 0.15s',
            }}>
              <span>{b.label}</span>
              {budget===b.id && <span style={{ color:C.accent }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onNext({ vibes, budget })} disabled={!valid || loading}
        style={{
          width:'100%', padding:'16px',
          background: valid ? C.dark : '#D9D2C8',
          color: valid ? C.white : '#A09A94', border:'none',
          ...upper, fontSize:'11px', fontWeight:500,
          cursor: valid ? 'pointer' : 'not-allowed', transition:'background 0.15s',
        }}
      >
        {loading ? 'Finding your matches...' : 'Get My Recommendations →'}
      </button>
    </div>
  );
}
