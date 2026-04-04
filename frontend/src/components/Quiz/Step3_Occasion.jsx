import { useState } from 'react';

const C = { dark: '#1C1A18', mid: '#6B6560', accent: '#C4A882', white: '#FDFCFB' };
const upper = { textTransform: 'uppercase', letterSpacing: '2px' };
const serif = { fontFamily: 'var(--serif)' };

const OCCASIONS = [
  { id: 'wedding',  label: 'Wedding',    icon: '✦', desc: 'Ceremonies & receptions' },
  { id: 'festive',  label: 'Festive',    icon: '◈', desc: 'Diwali, Eid, Holi & more' },
  { id: 'work',     label: 'Work',       icon: '⊕', desc: 'Office & business' },
  { id: 'casual',   label: 'Casual',     icon: '◉', desc: 'Daily wear & outings' },
  { id: 'party',    label: 'Party',      icon: '⊛', desc: 'Nights out & events' },
  { id: 'travel',   label: 'Travel',     icon: '○', desc: 'Comfortable & versatile' },
];

export default function Step3_Occasion({ onNext, onBack, data }) {
  const [selected, setSelected] = useState(data.occasions || []);
  const toggle = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <div className="fade-up">
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.mid, ...upper, fontSize: '10px', marginBottom: '24px', padding: 0, cursor: 'pointer', fontFamily: 'var(--sans)' }}>← Back</button>

      <h2 style={{ ...serif, fontSize: '38px', fontWeight: 300, marginBottom: '8px' }}>
        Where are you<br /><em style={{ fontStyle: 'italic', color: C.accent }}>headed?</em>
      </h2>
      <p style={{ fontSize: '13px', color: C.mid, marginBottom: '36px', fontWeight: 300, lineHeight: 1.7 }}>
        Select all that apply — we'll curate looks for every moment.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '36px' }}>
        {OCCASIONS.map(o => {
          const active = selected.includes(o.id);
          return (
            <button key={o.id} onClick={() => toggle(o.id)} style={{
              padding: '18px 16px', fontFamily: 'var(--sans)',
              border: `0.5px solid ${active ? C.dark : '#D9D2C8'}`,
              background: active ? C.dark : C.white,
              color: active ? C.white : C.dark,
              textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: '22px', marginBottom: '8px', color: active ? C.accent : '#B5A895' }}>{o.icon}</div>
              <div style={{ ...upper, fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>{o.label}</div>
              <div style={{ fontSize: '11px', color: active ? '#B8B2AA' : C.mid, fontWeight: 300 }}>{o.desc}</div>
            </button>
          );
        })}
      </div>

      <button onClick={() => onNext({ occasions: selected })} disabled={selected.length === 0} style={{
        width: '100%', padding: '16px',
        background: selected.length ? C.dark : '#D9D2C8',
        color: selected.length ? C.white : '#A09A94', border: 'none',
        ...upper, fontSize: '11px', fontWeight: 500, fontFamily: 'var(--sans)',
        cursor: selected.length ? 'pointer' : 'not-allowed', transition: 'background 0.15s',
      }}>Continue →</button>
    </div>
  );
}
