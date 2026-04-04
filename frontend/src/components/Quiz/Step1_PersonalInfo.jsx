import { useState } from 'react';

const C = { dark: '#1C1A18', mid: '#6B6560', accent: '#C4A882', white: '#FDFCFB' };
const upper = { textTransform: 'uppercase', letterSpacing: '2px' };
const serif = { fontFamily: 'var(--serif)' };

export default function Step1_PersonalInfo({ onNext, data }) {
  const [form, setForm] = useState({ name: data.name || '', age: data.age || '', gender: data.gender || '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim() && form.age && form.gender;

  const input = {
    width: '100%', padding: '12px 16px',
    border: '0.5px solid #D9D2C8', background: C.white,
    fontSize: '14px', color: C.dark, outline: 'none',
    fontFamily: 'var(--sans)', transition: 'border-color 0.15s',
  };

  return (
    <div className="fade-up">
      <h2 style={{ ...serif, fontSize: '38px', fontWeight: 300, marginBottom: '8px' }}>
        Let's get to<br /><em style={{ fontStyle: 'italic', color: C.accent }}>know you</em>
      </h2>
      <p style={{ fontSize: '13px', color: C.mid, marginBottom: '40px', fontWeight: 300, lineHeight: 1.7 }}>
        A few basics help us personalise your experience.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ ...upper, fontSize: '10px', color: C.mid, fontWeight: 500, display: 'block', marginBottom: '8px' }}>Your Name</label>
          <input style={input} placeholder="e.g. Priya" value={form.name}
            onChange={e => set('name', e.target.value)}
            onFocus={e => e.target.style.borderColor = C.dark}
            onBlur={e => e.target.style.borderColor = '#D9D2C8'} />
        </div>
        <div>
          <label style={{ ...upper, fontSize: '10px', color: C.mid, fontWeight: 500, display: 'block', marginBottom: '8px' }}>Age</label>
          <input style={input} type="number" placeholder="e.g. 25" value={form.age}
            onChange={e => set('age', e.target.value)}
            onFocus={e => e.target.style.borderColor = C.dark}
            onBlur={e => e.target.style.borderColor = '#D9D2C8'} />
        </div>
        <div>
          <label style={{ ...upper, fontSize: '10px', color: C.mid, fontWeight: 500, display: 'block', marginBottom: '12px' }}>I dress as</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Women', 'Men', 'Non-binary'].map(g => (
              <button key={g} onClick={() => set('gender', g)} style={{
                flex: 1, padding: '12px', fontFamily: 'var(--sans)',
                border: `0.5px solid ${form.gender === g ? C.dark : '#D9D2C8'}`,
                background: form.gender === g ? C.dark : C.white,
                color: form.gender === g ? C.white : C.mid,
                ...upper, fontSize: '10px', fontWeight: 500, transition: 'all 0.15s',
              }}>{g}</button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => onNext(form)} disabled={!valid} style={{
        marginTop: '40px', width: '100%', padding: '16px',
        background: valid ? C.dark : '#D9D2C8',
        color: valid ? C.white : '#A09A94', border: 'none',
        ...upper, fontSize: '11px', fontWeight: 500,
        cursor: valid ? 'pointer' : 'not-allowed', transition: 'background 0.15s',
        fontFamily: 'var(--sans)',
      }}>Continue →</button>
    </div>
  );
}
