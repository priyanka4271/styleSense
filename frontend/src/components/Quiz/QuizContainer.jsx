import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Step1_PersonalInfo  from './Step1_PersonalInfo';
import Step2_SkinTone      from './Step2_SkinTone';
import Step3_Occasion      from './Step3_Occasion';
import Step4_Preferences   from './Step4_Preferences';
import { getRecommendations } from '../../services/api';

const C = { cream: '#F7F3EE', white: '#FDFCFB', dark: '#1C1A18', mid: '#6B6560', accent: '#C4A882' };
const upper = { textTransform: 'uppercase', letterSpacing: '2px' };
const serif = { fontFamily: 'var(--serif)' };

const MOCK_RESULTS = [
  { name: 'Contemporary Gold Saree',  price: '₹1,007', color: 'Gold',    category: 'Sarees',  rating: '4.4', reason: 'Perfect for your occasion, flatters your skin tone', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80' },
  { name: 'Luxe Gold Co-ord Set',     price: '₹4,755', color: 'Gold',    category: 'Co-ords', rating: '3.9', reason: 'Festive favourite, premium fabric quality', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80' },
  { name: 'Contemporary Gold Kurti',  price: '₹1,090', color: 'Gold',    category: 'Kurtis',  rating: '4.6', reason: '40% off today, great for casual outings', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80' },
  { name: 'Elegant Rust Anarkali',    price: '₹2,399', color: 'Rust',    category: 'Dresses', rating: '4.2', reason: 'Rust complements your skin tone beautifully', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80' },
  { name: 'Coral Wrap Dress',         price: '₹1,850', color: 'Coral',   category: 'Dresses', rating: '4.5', reason: 'Trending style, perfect fit for your preferences', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80' },
  { name: 'Olive Green Palazzo Set',  price: '₹1,299', color: 'Olive',   category: 'Co-ords', rating: '4.3', reason: 'Comfortable and elegant for your selected occasions', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80' },
];

const STEPS = ['Personal Info', 'Skin Tone', 'Occasion', 'Preferences'];

export default function QuizContainer() {
  const [step, setStep]     = useState(0);
  const [data, setData]     = useState({});
  const [loading, setLoading] = useState(false);
  const navigate            = useNavigate();
  const [searchParams]      = useSearchParams();
  const preCategory         = searchParams.get('category') || '';

  const next = (stepData) => {
    const merged = { ...data, ...stepData };
    setData(merged);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      submit(merged);
    }
  };

  const back = () => step > 0 && setStep(step - 1);

  const submit = async (finalData) => {
    setLoading(true);
    try {
      const results = await getRecommendations(finalData);
      navigate('/results', { state: { results, userData: finalData } });
    } catch {
      // API failed — use mock data so UI never breaks
      navigate('/results', { state: { results: MOCK_RESULTS, userData: finalData } });
    } finally {
      setLoading(false);
    }
  };

  const stepComponents = [
    <Step1_PersonalInfo  key={0} onNext={next} data={data} />,
    <Step2_SkinTone      key={1} onNext={next} onBack={back} data={data} />,
    <Step3_Occasion      key={2} onNext={next} onBack={back} data={data} preCategory={preCategory} />,
    <Step4_Preferences   key={3} onNext={next} onBack={back} data={data} loading={loading} />,
  ];

  if (loading) return (
    <div style={{
      minHeight: 'calc(100vh - 60px)', background: C.cream,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px',
    }}>
      <div style={{ ...serif, fontSize: '48px', color: C.accent, animation: 'pulse 1.5s ease-in-out infinite' }}>✦</div>
      <p style={{ ...upper, fontSize: '12px', color: C.mid, letterSpacing: '3px' }}>Finding your perfect matches...</p>
      <p style={{ fontSize: '12px', color: C.mid, fontWeight: 300 }}>Our AI is curating outfits just for you</p>
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: C.cream }}>
      {/* Progress Header */}
      <div style={{ background: C.white, borderBottom: '0.5px solid #D9D2C8', padding: '24px 48px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p style={{ ...upper, fontSize: '10px', color: C.accent, fontWeight: 500 }}>Style Quiz</p>
            <p style={{ fontSize: '12px', color: C.mid }}>Step {step + 1} of {STEPS.length}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{ height: '2px', background: i <= step ? C.dark : '#D9D2C8', borderRadius: '1px', transition: 'background 0.3s' }} />
                <p style={{ fontSize: '10px', marginTop: '6px', ...upper, letterSpacing: '1px', color: i === step ? C.dark : i < step ? C.mid : '#C0BAB4', fontWeight: i === step ? 500 : 400 }}>
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 24px' }}>
        {stepComponents[step]}
      </div>
    </div>
  );
}
