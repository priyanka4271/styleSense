import { useState } from 'react';
import { detectSkinTone } from '../../services/api';

const C = { dark: '#1C1A18', mid: '#6B6560', accent: '#C4A882', white: '#FDFCFB', cream: '#F7F3EE' };
const upper = { textTransform: 'uppercase', letterSpacing: '2px' };
const serif = { fontFamily: 'var(--serif)' };

const TONES = [
  { id: 'fair',     label: 'Fair',     hex: '#F5DEB3', desc: 'Light, sometimes pinkish undertone' },
  { id: 'wheatish', label: 'Wheatish', hex: '#C8A882', desc: 'Warm golden-beige undertone' },
  { id: 'medium',   label: 'Medium',   hex: '#A0724A', desc: 'Medium warm brown' },
  { id: 'dusky',    label: 'Dusky',    hex: '#7A4A2A', desc: 'Deep warm brown' },
  { id: 'dark',     label: 'Dark',     hex: '#4A2A14', desc: 'Rich deep brown' },
];

export default function Step2_SkinTone({ onNext, onBack, data }) {
  const [selected,   setSelected]   = useState(data.skinTone || '');
  const [detecting,  setDetecting]  = useState(false);
  const [detectMsg,  setDetectMsg]  = useState('');

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDetecting(true);
    setDetectMsg('Analysing your photo...');
    try {
      const result = await detectSkinTone(file);
      if (result.skinTone) {
        setSelected(result.skinTone);
        setDetectMsg(`Detected: ${result.skinTone} (${Math.round((result.confidence || 0) * 100)}% confidence)`);
      }
    } catch {
      setDetectMsg('Could not detect — please select manually.');
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="fade-up">
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.mid, ...upper, fontSize: '10px', marginBottom: '24px', padding: 0, cursor: 'pointer', fontFamily: 'var(--sans)' }}>← Back</button>

      <h2 style={{ ...serif, fontSize: '38px', fontWeight: 300, marginBottom: '8px' }}>
        Your skin<br /><em style={{ fontStyle: 'italic', color: C.accent }}>tone</em>
      </h2>
      <p style={{ fontSize: '13px', color: C.mid, marginBottom: '36px', fontWeight: 300, lineHeight: 1.7 }}>
        This helps us match colours that naturally complement you.
      </p>

      {/* Tone swatches */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {TONES.map(t => (
          <button key={t.id} onClick={() => setSelected(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '14px 16px', fontFamily: 'var(--sans)',
            border: `0.5px solid ${selected === t.id ? C.dark : '#D9D2C8'}`,
            background: selected === t.id ? C.cream : C.white,
            cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
          }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: t.hex, flexShrink: 0, border: '0.5px solid rgba(0,0,0,0.1)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...upper, fontSize: '11px', fontWeight: 500, color: C.dark }}>{t.label}</div>
              <div style={{ fontSize: '12px', color: C.mid, marginTop: '2px' }}>{t.desc}</div>
            </div>
            {selected === t.id && <span style={{ color: C.accent, fontSize: '18px' }}>✓</span>}
          </button>
        ))}
      </div>

      {/* AI Photo detection */}
      <div style={{ borderTop: '0.5px solid #D9D2C8', paddingTop: '20px', marginBottom: '32px' }}>
        <p style={{ fontSize: '12px', color: C.mid, marginBottom: '12px' }}>Or let AI detect from your photo:</p>
        <label style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
          border: '0.5px solid #D9D2C8', background: C.white, cursor: 'pointer',
          fontSize: '13px', color: detecting ? C.accent : C.mid, transition: 'all 0.15s',
        }}>
          <span style={{ fontSize: '18px', color: C.accent }}>◈</span>
          {detecting ? 'Analysing...' : 'Upload a photo for AI detection'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} disabled={detecting} />
        </label>
        {detectMsg && (
          <p style={{ fontSize: '12px', color: C.accent, marginTop: '8px', fontStyle: 'italic' }}>{detectMsg}</p>
        )}
      </div>

      <button onClick={() => onNext({ skinTone: selected })} disabled={!selected} style={{
        width: '100%', padding: '16px',
        background: selected ? C.dark : '#D9D2C8',
        color: selected ? C.white : '#A09A94', border: 'none',
        ...upper, fontSize: '11px', fontWeight: 500, fontFamily: 'var(--sans)',
        cursor: selected ? 'pointer' : 'not-allowed', transition: 'background 0.15s',
      }}>Continue →</button>
    </div>
  );
}
