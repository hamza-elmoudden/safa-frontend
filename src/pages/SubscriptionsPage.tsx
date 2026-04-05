import React, { useEffect, useState } from 'react';
import api from '../api';
import { Check, Sparkles, Crown, Star } from 'lucide-react';

interface Plan {
  id: string;
  name: 'free' | 'premium' | 'vip';
  price_mad: number;
  limit_photo_treatment: number;
  treatment_plans: number;
  limit_photo_check: number;
  progress_tracking: boolean;
  vip_consultation: boolean;
  features: Record<string, any>;
  is_active: boolean;
}

interface ActiveSub {
  subscription?: Plan;
  expires_at?: string;
}

const PLAN_META: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  free:    { icon: Star,     color:'var(--warm-gray)', bg:'var(--blush)',  label:'Free' },
  premium: { icon: Sparkles, color:'var(--rose-deep)', bg:'#fff0ed',       label:'Premium' },
  vip:     { icon: Crown,    color:'#b8860b',           bg:'#fffbeb',       label:'VIP' },
};

const SubscriptionsPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activeSub, setActiveSub] = useState<ActiveSub | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/subscriptions').catch(() => ({ data: [] })),
      api.get('/subscriptions/my').catch(() => ({ data: null })),
    ]).then(([plansRes, myRes]) => {
      setPlans(plansRes.data || []);
      setActiveSub(myRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId);
    try {
      await api.post('/subscriptions/subscribe', { subscription_id: planId, method: 'card' });
      const { data } = await api.get('/subscriptions/my');
      setActiveSub(data);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(null);
    }
  };

  const currentPlanName = activeSub?.subscription?.name;

  return (
    <div style={{ padding:'24px 20px', maxWidth:900, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:40, animation:'fadeIn 0.5s ease' }}>
        <h2 style={{ fontSize:'clamp(26px,5vw,40px)', marginBottom:8 }}>Choose Your Plan</h2>
        <p style={{ fontSize:15, color:'var(--warm-gray)' }}>Unlock the full power of Safa AI for your skin</p>
        {activeSub?.subscription && (
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            marginTop:16, background:'var(--blush)', borderRadius:30,
            padding:'8px 20px', border:'1px solid var(--rose-light)',
          }}>
            <span style={{ fontSize:13, color:'var(--rose-deep)', fontWeight:500 }}>
              Current plan: <strong style={{ textTransform:'capitalize' }}>{activeSub.subscription.name}</strong>
              {activeSub.expires_at && ` · expires ${new Date(activeSub.expires_at).toLocaleDateString()}`}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height:380, borderRadius:'var(--radius-xl)', background:'linear-gradient(90deg,var(--blush) 25%,var(--rose-light) 50%,var(--blush) 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
          {plans.map((plan, i) => {
            const meta = PLAN_META[plan.name] || PLAN_META.free;
            const Icon = meta.icon;
            const isCurrent = currentPlanName === plan.name;
            const isPremium = plan.name === 'premium';

            return (
              <div
                key={plan.id}
                style={{
                  background: isPremium ? 'var(--rose-deep)' : 'var(--white)',
                  borderRadius:'var(--radius-xl)',
                  padding:'28px 24px',
                  boxShadow: isPremium ? '0 16px 48px rgba(168,106,91,0.35)' : 'var(--shadow)',
                  border: isCurrent ? '2.5px solid var(--rose)' : isPremium ? 'none' : '1px solid var(--blush)',
                  position:'relative', overflow:'hidden',
                  animation:`fadeIn ${0.3+i*0.1}s ease both`,
                  transform: isPremium ? 'scale(1.03)' : 'scale(1)',
                  transition:'transform 0.2s',
                }}
                onMouseEnter={e => { if (!isPremium) e.currentTarget.style.transform='translateY(-4px)'; }}
                onMouseLeave={e => { if (!isPremium) e.currentTarget.style.transform='translateY(0)'; }}
              >
                {isPremium && (
                  <div style={{
                    position:'absolute', top:16, right:-20,
                    background:'rgba(255,255,255,0.2)', color:'white',
                    fontSize:10, fontWeight:700, padding:'4px 30px', transform:'rotate(45deg)',
                    letterSpacing:1,
                  }}>POPULAR</div>
                )}
                {isCurrent && (
                  <div style={{
                    position:'absolute', top:14, left:14,
                    background:'var(--sage)', color:'white',
                    fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20,
                    letterSpacing:0.5,
                  }}>ACTIVE</div>
                )}

                {/* Icon & Name */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, marginTop: isCurrent ? 20 : 0 }}>
                  <div style={{
                    width:44, height:44, borderRadius:12,
                    background: isPremium ? 'rgba(255,255,255,0.2)' : meta.bg,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon size={22} color={isPremium ? 'white' : meta.color} />
                  </div>
                  <div>
                    <p style={{ fontWeight:700, fontSize:18, color: isPremium ? 'white' : 'var(--charcoal)', fontFamily:'Cormorant Garamond, serif' }}>{meta.label}</p>
                    <p style={{ fontSize:12, color: isPremium ? 'rgba(255,255,255,0.7)' : 'var(--muted)' }}>
                      {plan.name === 'free' ? 'Get started' : plan.name === 'premium' ? 'Most popular' : 'Full access'}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom:24 }}>
                  <span style={{ fontSize:38, fontWeight:700, color: isPremium ? 'white' : 'var(--charcoal)', fontFamily:'Cormorant Garamond, serif' }}>
                    {plan.price_mad === 0 ? 'Free' : `${plan.price_mad}`}
                  </span>
                  {plan.price_mad > 0 && (
                    <span style={{ fontSize:14, color: isPremium ? 'rgba(255,255,255,0.7)' : 'var(--muted)', marginLeft:4 }}>MAD/mo</span>
                  )}
                </div>

                {/* Features */}
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
                  {[
                    { label:`${plan.treatment_plans} treatment plan${plan.treatment_plans > 1 ? 's' : ''}`, included:true },
                    { label:`${plan.limit_photo_treatment} photos/treatment`, included:true },
                    { label:`${plan.limit_photo_check} photos/check-in`, included:true },
                    { label:'Progress tracking', included:plan.progress_tracking },
                    { label:'VIP consultation', included:plan.vip_consultation },
                  ].map(({ label, included }) => (
                    <div key={label} style={{ display:'flex', alignItems:'center', gap:10, opacity: included ? 1 : 0.45 }}>
                      <div style={{
                        width:20, height:20, borderRadius:'50%',
                        background: included ? (isPremium ? 'rgba(255,255,255,0.25)' : 'var(--blush)') : 'transparent',
                        border: included ? 'none' : `1.5px solid ${isPremium ? 'rgba(255,255,255,0.3)' : 'var(--blush)'}`,
                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                      }}>
                        {included && <Check size={12} color={isPremium ? 'white' : 'var(--rose-deep)'} strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize:13, color: isPremium ? (included ? 'white' : 'rgba(255,255,255,0.5)') : (included ? 'var(--charcoal)' : 'var(--muted)') }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => !isCurrent && handleSubscribe(plan.id)}
                  disabled={isCurrent || subscribing === plan.id}
                  style={{
                    width:'100%', padding:'13px', borderRadius:12,
                    fontSize:14, fontWeight:600,
                    background: isCurrent ? 'var(--sage)' : isPremium ? 'white' : 'var(--rose-deep)',
                    color: isCurrent ? 'white' : isPremium ? 'var(--rose-deep)' : 'white',
                    opacity: (isCurrent || (!plan.price_mad && !isCurrent)) ? 0.85 : 1,
                    transition:'all 0.2s', cursor: isCurrent ? 'default' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  }}
                  onMouseEnter={e => { if (!isCurrent && !isPremium) e.currentTarget.style.transform='translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
                >
                  {subscribing === plan.id ? (
                    <div style={{ width:16,height:16,border:'2px solid rgba(0,0,0,0.2)',borderTopColor:'currentColor',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
                  ) : isCurrent ? 'Current Plan' : plan.price_mad === 0 ? 'Get Started' : `Subscribe · ${plan.price_mad} MAD`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ textAlign:'center', fontSize:12, color:'var(--muted)', marginTop:32 }}>
        All prices in Moroccan Dirhams (MAD) · Cancel anytime · Secure payment
      </p>
    </div>
  );
};

export default SubscriptionsPage;
