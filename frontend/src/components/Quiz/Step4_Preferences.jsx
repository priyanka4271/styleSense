import { useState } from 'react';

const C = { dark: '#1C1A18', mid: '#6B6560', accent: '#C4A882', white: '#FDFCFB' };
const upper = { textTransform: 'uppercase', letterSpacing: '2px' };
const serif = { fontFamily: 'var(--serif)' };

const VIBES   = ['Traditional', 'Fusion', 'Western', 'Minimal', 'Bold & Bright', 'Pastel & Soft'];
const BUDGETS = [
  { id: 'budget',  label: 'Under ₹1,000' },
  { id: 'mid',     label: '₹1,000 – ₹5,000' },
  { id: 'premium', label: '₹5,000 – ₹15,000' },
  { id: 'luxury',  label: 'Above ₹15,000' },
];

export default function Step4_Preferences({ onNext, onBack, data, loading }) {
  const [vibes,  setVibes]  = useState(data.vibes  || []);
  const [budget, setBudget] = useState(data.budget  || '');
  const toggleVibe = v => setVibes(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const valid = vibes.length > 0 && budget;

  return (
    <div className="fade-up">
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.mid, ...upper, fontSize: '10px', marginBottom: '24px', padding: 0, cursor: 'pointer', fontFamily: 'var(--sans)' }}>← Back</button>

      <h2 style={{ ...serif, fontSize: '38px', fontWeight: 300, marginBottom: '8px' }}>
        Your style<br /><em style={{ fontStyle: 'italic', color: C.accent }}>preferences</em>
      </h2>
      <p style={{ fontSize: '13px', color: C.mid, marginBottom: '36px', fontWeight: 300, lineHeight: 1.7 }}>
        Last step! Tell us your vibe and budget.
      </p>

      {/* Vibes */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{ ...upper, fontSize: '10px', color: C.mid, fontWeight: 500, display: 'block', marginBottom: '14px' }}>Style vibe (pick any)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {VIBES.map(v => {
            const a = vibes.includes(v);
            return (
              <button key={v} onClick={() => toggleVibe(v)} style={{
                padding: '9px 18px', fontFamily: 'var(--sans)',
                border: `0.5px solid ${a ? C.dark : '#D9D2C8'}`,
                background: a ? C.dark : C.white,
                color: a ? C.white : C.mid,
                fontSize: '12px', fontWeight: a ? 500 : 400,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>{v}</button>
            );
          })}
        </div>
      </div>

      {/* Budget */}
      <div style={{ marginBottom: '40px' }}>
        <label style={{ ...upper, fontSize: '10px', color: C.mid, fontWeight: 500, display: 'block', marginBottom: '14px' }}>Budget range</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {BUDGETS.map(b => (
            <button key={b.id} onClick={() => setBudget(b.id)} style={{
              padding: '13px 16px', textAlign: 'left', fontFamily: 'var(--sans)',
              border: `0.5px solid ${budget === b.id ? C.dark : '#D9D2C8'}`,
              background: budget === b.id ? C.dark : C.white,
              color: budget === b.id ? C.white : C.dark,
              fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <span>{b.label}</span>
              {budget === b.id && <span style={{ color: C.accent }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => onNext({ vibes, budget })} disabled={!valid || loading} style={{
        width: '100%', padding: '16px',
        background: valid ? C.dark : '#D9D2C8',
        color: valid ? C.white : '#A09A94', border: 'none',
        ...upper, fontSize: '11px', fontWeight: 500, fontFamily: 'var(--sans)',
        cursor: valid ? 'pointer' : 'not-allowed', transition: 'background 0.15s',
      }}>
        {loading ? 'Finding your matches...' : 'Get My Recommendations →'}
      </button>
    </div>
  );
}
