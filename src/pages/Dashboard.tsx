import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from '../api';
import { MessageCircle, Activity, Sparkles, ChevronRight, Sun } from 'lucide-react';

interface Treatment {
  id: string;
  title: string;
  status: string;
  concern_type: string;
  started_at: string;
  improvement_pct?: number;
  initial_photo_url?: string;
}

const Dashboard: React.FC = () => {
  const { user, paymentStatus } = useAuth();
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'صباح الخير';
    if (h < 17) return 'مرحباً';
    return 'مساء الخير';
  };

  useEffect(() => {
    api.get('/treatment/all').then(r => setTreatments(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const active = treatments.filter(t => t.status === 'active');

  return (
    <div style={{ padding:'24px 20px', maxWidth:900, margin:'0 auto' }}>
      {/* Greeting */}
      <div style={{ marginBottom:28, animation:'fadeIn 0.5s ease' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <Sun size={18} color='var(--rose)' />
          <span style={{ fontSize:13, color:'var(--muted)' }}>{new Date().toLocaleDateString('ar-MA', { weekday:'long', day:'numeric', month:'long' })}</span>
        </div>
        <h2 style={{ fontSize:'clamp(22px, 4vw, 34px)', fontWeight:400 }}>
          {greeting()}، <strong style={{ color:'var(--rose-deep)' }}>{user?.full_name?.split(' ')[0] || 'صديقي'}</strong> 👋
        </h2>
        <p style={{ color:'var(--warm-gray)', fontSize:14, marginTop:4 }}>Here's your skincare overview for today.</p>
      </div>


      {/* بانر الاشتراك إذا لم يكن للمستخدم خطة */}
      {paymentStatus && !paymentStatus.hasActivePlan && (
        <div style={{
          background: 'linear-gradient(135deg, var(--rose-deep), #c47a6a)',
          borderRadius: 'var(--radius)',
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          animation: 'fadeIn 0.5s ease',
        }}>
          <div>
            <p style={{ color: 'white', fontWeight: 600, fontSize: 15, marginBottom: 3 }}>
              🌟 لا يوجد اشتراك نشط
            </p>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
              اشترك الآن للوصول الكامل لميزات خطط العلاج
            </p>
          </div>
          <button
            onClick={() => navigate('/app/subscriptions')}
            style={{
              background: 'white', color: 'var(--rose-deep)',
              padding: '9px 18px', borderRadius: 30,
              fontSize: 13, fontWeight: 600, flexShrink: 0,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            اشترك الآن
          </button>
        </div>
      )}

      {/* Quick actions */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',
        gap:14, marginBottom:32,
      }}>
        {[
          { icon: MessageCircle, label:'Chat with Safa', sub:'Ask anything', path:'/app/chat', color:'var(--rose-deep)', bg:'var(--blush)' },
          { icon: Activity, label:'My Treatments', sub:`${active.length} active`, path:'/app/treatments', color:'var(--sage)', bg:'var(--sage-light)' },
          { icon: Sparkles, label:'Skin Profile', sub:'View & edit', path:'/app/profile', color:'#8b7355', bg:'#f0e8da' },
        ].map(({ icon: Icon, label, sub, path, color, bg }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              background:bg, borderRadius:'var(--radius)',
              padding:'20px 18px', textAlign:'left', border:'none',
              cursor:'pointer', transition:'all 0.2s',
              display:'flex', flexDirection:'column', gap:14,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={{ width:40, height:40, borderRadius:10, background:'white', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow)' }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <p style={{ fontWeight:600, fontSize:14, color:'var(--charcoal)' }}>{label}</p>
              <p style={{ fontSize:12, color:'var(--muted)' }}>{sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Active treatments */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <h3 style={{ fontSize:20 }}>Active Treatments</h3>
          <button onClick={() => navigate('/app/treatments')} style={{ background:'none', color:'var(--rose)', fontSize:13, display:'flex', alignItems:'center', gap:4 }}>
            View all <ChevronRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ display:'flex', gap:16 }}>
            {[1,2].map(i => (
              <div key={i} style={{ flex:1, height:120, borderRadius:'var(--radius)', background:'linear-gradient(90deg, var(--blush) 25%, var(--rose-light) 50%, var(--blush) 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />
            ))}
          </div>
        ) : active.length === 0 ? (
          <div style={{
            background:'var(--white)', borderRadius:'var(--radius)', padding:'32px 24px',
            textAlign:'center', border:'1.5px dashed var(--rose-light)',
          }}>
            <Activity size={32} color='var(--rose-light)' style={{ margin:'0 auto 12px' }} />
            <p style={{ color:'var(--warm-gray)', fontSize:14, marginBottom:16 }}>No active treatment plans yet.</p>
            <button
              onClick={() => navigate('/app/treatments')}
              style={{
                background:'var(--rose-deep)', color:'white',
                padding:'10px 22px', borderRadius:30, fontSize:13, fontWeight:500,
              }}
            >
              Start a Treatment
            </button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {active.slice(0, 3).map(t => (
              <div
                key={t.id}
                onClick={() => navigate(`/app/treatments/${t.id}/chat`)}
                style={{
                  background:'var(--white)', borderRadius:'var(--radius)',
                  padding:'16px 20px', cursor:'pointer',
                  boxShadow:'var(--shadow)', transition:'all 0.2s',
                  display:'flex', alignItems:'center', gap:16,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
              >
                {t.initial_photo_url && (
                  <img
                    src={t.initial_photo_url}
                    alt=""
                    style={{ width:52, height:52, borderRadius:12, objectFit:'cover', flexShrink:0 }}
                  />
                )}
                <div style={{ flex:1, overflow:'hidden' }}>
                  <p style={{ fontWeight:500, fontSize:14, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.title}</p>
                  <p style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{t.concern_type} · started {new Date(t.started_at).toLocaleDateString()}</p>
                </div>
                {t.improvement_pct !== undefined && t.improvement_pct !== null && (
                  <div style={{ textAlign:'center', flexShrink:0 }}>
                    <p style={{ fontSize:18, fontWeight:600, color:'var(--sage)' }}>{Number(t.improvement_pct).toFixed(0)}%</p>
                    <p style={{ fontSize:11, color:'var(--muted)' }}>improved</p>
                  </div>
                )}
                <ChevronRight size={16} color='var(--muted)' />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
