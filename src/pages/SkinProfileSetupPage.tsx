import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import { Droplets, ChevronRight, SkipForward } from 'lucide-react';

const SKIN_TYPES = [
  { value: 'dry',         label: 'جافة 🌵',    en: 'Dry' },
  { value: 'oily',        label: 'دهنية 🛢️',   en: 'Oily' },
  { value: 'combination', label: 'مختلطة 🌗',  en: 'Combination' },
  { value: 'normal',      label: 'عادية ✨',    en: 'Normal' },
  { value: 'sensitive',   label: 'حساسة 🌸',   en: 'Sensitive' },
];

// ✅ تم التحقق من هذه القيم مع قاعدة البيانات — أزلنا 'oiliness' وأضفنا القيم الصحيحة
const CONCERNS_LIST = [
  { value: 'acne',          label: 'حبوب / أكني',      emoji: '🔴' },
  { value: 'dryness',       label: 'جفاف',              emoji: '🌵' },
  { value: 'pigmentation',  label: 'تصبغات / بقع',     emoji: '🌑' },
  { value: 'wrinkles',      label: 'تجاعيد',            emoji: '〰️' },
  { value: 'sensitivity',   label: 'حساسية',            emoji: '🌸' },
  { value: 'pores',         label: 'مسام واسعة',        emoji: '⭕' },
  { value: 'dark_circles',  label: 'هالات داكنة',       emoji: '👁️' },
  { value: 'uneven_texture', label: 'ملمس غير متساوٍ', emoji: '✋' },
];

const STEPS = ['نوع بشرتك', 'مخاوف البشرة', 'الحساسيات'];

const SkinProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshSkinProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    skin_type: '',
    concerns: [] as string[],
    allergies: [] as string[],
    notes: '',
  });
  const [allergyInput, setAllergyInput] = useState('');

  const toggleConcern = (c: string) => {
    setForm(f => ({
      ...f,
      concerns: f.concerns.includes(c) ? f.concerns.filter(x => x !== c) : [...f.concerns, c],
    }));
  };

  const addAllergy = () => {
    const val = allergyInput.trim();
    if (!val) return;
    if (form.allergies.includes(val)) return;
    setForm(f => ({ ...f, allergies: [...f.allergies, val] }));
    setAllergyInput('');
  };

  const removeAllergy = (a: string) => setForm(f => ({ ...f, allergies: f.allergies.filter(x => x !== a) }));

  const canNext = () => {
    if (step === 0) return !!form.skin_type;
    return true;
  };

  const handleSkip = () => {
    // ✅ يمكن تخطي إعداد البشرة في أي وقت
    navigate('/app', { replace: true });
  };

  const handleFinish = async () => {
    if (!form.skin_type) return;
    setSaving(true);
    try {
      await api.post('/skinprofiles', {
        skin_type: form.skin_type,
        concerns: form.concerns,
        allergies: form.allergies,
        notes: form.notes,
      });
      // تحديث حالة skinProfile في الـ context
      await refreshSkinProfile();
      navigate('/app', { replace: true });
    } catch {
      alert('حدث خطأ، يرجى المحاولة مجدداً');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Skip button — top right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 10px',
              borderRadius: 8,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--warm-gray)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            <SkipForward size={14} /> تخطي
          </button>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--rose-light), var(--rose-deep))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Droplets size={28} color="white" />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 6 }}>إعداد ملف البشرة</h2>
          <p style={{ color: 'var(--warm-gray)', fontSize: 14 }}>
            نحتاج معرفة بشرتك لنقدم لك توصيات دقيقة
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>
            يمكنك تخطي هذه الخطوة وإعداده لاحقاً من الملف الشخصي
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{
                height: 4, borderRadius: 2,
                background: i <= step ? 'var(--rose-deep)' : 'var(--blush)',
                transition: 'background 0.3s',
              }} />
              <p style={{
                fontSize: 10,
                color: i === step ? 'var(--rose-deep)' : 'var(--muted)',
                marginTop: 4,
                textAlign: 'center',
              }}>
                {s}
              </p>
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 24px',
          boxShadow: 'var(--shadow)',
          animation: 'fadeIn 0.4s ease',
        }}>

          {/* STEP 0 — نوع البشرة */}
          {step === 0 && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>ما نوع بشرتك؟</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>اختر النوع الأقرب لوصف بشرتك</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SKIN_TYPES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setForm(f => ({ ...f, skin_type: t.value }))}
                    style={{
                      padding: '14px 18px',
                      borderRadius: 12,
                      border: '2px solid',
                      borderColor: form.skin_type === t.value ? 'var(--rose-deep)' : 'var(--blush)',
                      background: form.skin_type === t.value ? 'var(--blush)' : 'var(--white)',
                      cursor: 'pointer',
                      textAlign: 'right',
                      fontSize: 15,
                      fontWeight: form.skin_type === t.value ? 600 : 400,
                      color: form.skin_type === t.value ? 'var(--rose-deep)' : 'var(--charcoal)',
                      transition: 'all 0.15s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{t.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{t.en}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — مخاوف البشرة */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>ما مخاوف بشرتك؟</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
                يمكنك اختيار أكثر من واحدة — أو تخطي هذه الخطوة
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {CONCERNS_LIST.map(c => (
                  <button
                    key={c.value}
                    onClick={() => toggleConcern(c.value)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      border: '1.5px solid',
                      borderColor: form.concerns.includes(c.value) ? 'var(--rose-deep)' : 'var(--blush)',
                      background: form.concerns.includes(c.value) ? 'var(--blush)' : 'var(--white)',
                      color: form.concerns.includes(c.value) ? 'var(--rose-deep)' : 'var(--warm-gray)',
                      fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s',
                      textAlign: 'right',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span>{c.emoji}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
              {form.concerns.length === 0 && (
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 16, textAlign: 'center' }}>
                  يمكنك المتابعة بدون اختيار إذا لم تكن متأكداً
                </p>
              )}
            </div>
          )}

          {/* STEP 2 — حساسيات وملاحظات */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>حساسيات وملاحظات</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
                اختياري — يساعدنا في تجنب المكونات الضارة لك
              </p>

              {/* Allergies */}
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--warm-gray)', display: 'block', marginBottom: 8 }}>
                الحساسيات (اكتب واضغط إضافة)
              </label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input
                  value={allergyInput}
                  onChange={e => setAllergyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addAllergy()}
                  placeholder="مثال: Retinol، Benzoyl Peroxide"
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: 10,
                    border: '1.5px solid var(--blush)', background: 'var(--cream)',
                    fontSize: 13, color: 'var(--charcoal)',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={addAllergy}
                  style={{
                    padding: '10px 16px', borderRadius: 10,
                    background: 'var(--rose-deep)', color: 'white',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  إضافة
                </button>
              </div>
              {form.allergies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {form.allergies.map(a => (
                    <span key={a} style={{
                      background: 'var(--blush)', borderRadius: 20, padding: '4px 12px',
                      fontSize: 12, color: 'var(--rose-deep)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }} onClick={() => removeAllergy(a)}>
                      {a} <span style={{ opacity: 0.6 }}>✕</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Notes */}
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--warm-gray)', display: 'block', marginBottom: 8 }}>
                ملاحظات إضافية <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(اختياري)</span>
              </label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="أي معلومات إضافية تود إخبار الطبيبة عنها..."
                rows={3}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  border: '1.5px solid var(--blush)', background: 'var(--cream)',
                  fontSize: 13, color: 'var(--charcoal)', resize: 'none',
                  boxSizing: 'border-box', outline: 'none',
                }}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: 'var(--white)', color: 'var(--charcoal)',
                fontSize: 15, fontWeight: 500, border: '1.5px solid var(--blush)',
                cursor: 'pointer',
              }}
            >
              رجوع
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: canNext() ? 'var(--rose-deep)' : 'var(--blush)',
                color: canNext() ? 'white' : 'var(--muted)',
                fontSize: 15, fontWeight: 600,
                cursor: canNext() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
                border: 'none',
              }}
            >
              التالي <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving || !form.skin_type}
              style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: 'var(--rose-deep)', color: 'white',
                fontSize: 15, fontWeight: 600,
                opacity: saving ? 0.7 : 1,
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                border: 'none',
              }}
            >
              {saving ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  حفظ...
                </>
              ) : '🎉 إنهاء الإعداد'}
            </button>
          )}
        </div>

        {/* Skip link at bottom */}
        <button
          onClick={handleSkip}
          style={{
            display: 'block', width: '100%', background: 'none', border: 'none',
            textAlign: 'center', marginTop: 16, fontSize: 13,
            color: 'var(--muted)', cursor: 'pointer',
            textDecoration: 'underline', padding: '4px',
          }}
        >
          تخطي الآن وإعداده لاحقاً من الملف الشخصي
        </button>
      </div>
    </div>
  );
};

export default SkinProfileSetupPage;
