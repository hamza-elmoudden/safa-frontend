import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Plus, Activity, ChevronRight, X, Camera } from 'lucide-react';

interface Treatment {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  concern_type: string;
  areas_treated: string;
  duration_days: number;
  improvement_pct?: number | null;
  initial_photo_url?: string;
  started_at: string;
  next_checkin_at?: string | null;
}

const STATUS_COLOR: Record<string, string> = {
  active: '#4caf50',
  completed: 'var(--rose-deep)',
  paused: '#ff9800',
  cancelled: '#9e9e9e',
};

const AREAS = ['Face', 'Neck', 'Back', 'Scalp', 'Hair', 'Nails'];

const TreatmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [areas_treated, setAreasTreated] = useState<string>('Face');

  const load = () => {
    setLoading(true);
    api.get('/treatment/all').then(r => setTreatments(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await api.post('/treatment', { areas_treated });
      setShowModal(false);
      setAreasTreated('Face');
      load();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create treatment');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)' }}>My Treatments</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>Track your skin progress over time</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--rose-deep)', color: 'white',
            padding: '10px 18px', borderRadius: 30,
            fontSize: 13, fontWeight: 500,
            boxShadow: '0 4px 16px rgba(168,106,91,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={16} /> New Plan
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 90, borderRadius: 'var(--radius)', background: 'linear-gradient(90deg,var(--blush) 25%,var(--rose-light) 50%,var(--blush) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          ))}
        </div>
      ) : treatments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1.5px dashed var(--rose-light)' }}>
          <Activity size={40} color='var(--rose-light)' style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 20, marginBottom: 8 }}>No treatment plans yet</h3>
          <p style={{ fontSize: 14, color: 'var(--warm-gray)', marginBottom: 24 }}>Start your first treatment plan and track your skin's journey.</p>
          <button onClick={() => setShowModal(true)} style={{ background: 'var(--rose-deep)', color: 'white', padding: '12px 28px', borderRadius: 30, fontSize: 14, fontWeight: 500 }}>
            Create First Plan
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {treatments.map(t => (
            <div
              key={t.id}
              onClick={() => navigate(`/app/treatments/${t.id}/chat`)}
              style={{
                background: 'var(--white)', borderRadius: 'var(--radius)',
                padding: '16px 20px', cursor: 'pointer',
                boxShadow: 'var(--shadow)', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 16,
                animation: 'fadeIn 0.4s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 14, flexShrink: 0, overflow: 'hidden', background: 'var(--blush)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {t.initial_photo_url ? (
                  <img src={t.initial_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                ) : (
                  <Camera size={22} color='var(--muted)' />
                )}
              </div>

              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <p style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title || 'Untitled Plan'}</p>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: STATUS_COLOR[t.status] + '20', color: STATUS_COLOR[t.status], textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0 }}>
                    {t.status}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {t.areas_treated} · {t.duration_days} days
                </p>
                {t.next_checkin_at && (
                  <p style={{ fontSize: 11, color: 'var(--sage)', marginTop: 2 }}>
                    Next check-in: {new Date(t.next_checkin_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {t.improvement_pct !== null && t.improvement_pct !== undefined && (
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--sage)' }}>{Number(t.improvement_pct).toFixed(0)}%</p>
                  <p style={{ fontSize: 10, color: 'var(--muted)' }}>improved</p>
                </div>
              )}
              <ChevronRight size={16} color='var(--muted)' style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(42,37,32,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{ background: 'var(--white)', borderRadius: '24px', padding: '28px 24px 40px', width: '100%', maxWidth: 480, animation: 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontSize: 22 }}>New Treatment Plan</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'var(--blush)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} color='var(--charcoal)' />
              </button>
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--warm-gray)', display: 'block', marginBottom: 10 }}>Area Treated</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {AREAS.map(a => (
                  <button
                    key={a}
                    onClick={() => setAreasTreated(a)}
                    style={{
                      padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                      border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s',
                      borderColor: areas_treated === a ? 'var(--rose-deep)' : 'var(--blush)',
                      background: areas_treated === a ? 'var(--rose-deep)' : 'var(--white)',
                      color: areas_treated === a ? 'white' : 'var(--warm-gray)',
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={creating}
              style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'var(--rose-deep)', color: 'white', fontSize: 15, fontWeight: 600, opacity: creating ? 0.6 : 1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            >
              {creating ? (
                <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Creating…</>
              ) : 'Start Treatment Plan'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TreatmentsPage;
