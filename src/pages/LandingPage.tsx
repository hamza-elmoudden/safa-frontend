import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, Brain, Camera, Activity } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', overflow:'hidden' }}>
      {/* Nav */}
      <nav style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'20px 5vw', background:'transparent',
        position:'sticky', top:0, zIndex:10,
        backdropFilter:'blur(8px)',
      }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:600, color:'var(--rose-deep)', fontFamily:'Cormorant Garamond, serif' }}>صفاء</h1>
          <p style={{ fontSize:10, letterSpacing:2, color:'var(--muted)', textTransform:'uppercase' }}>Skincare AI</p>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            background:'var(--rose-deep)', color:'white',
            padding:'10px 22px', borderRadius:40,
            fontSize:13, fontWeight:500, letterSpacing:0.3,
            transition:'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background='var(--rose)')}
          onMouseLeave={e => (e.currentTarget.style.background='var(--rose-deep)')}
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section style={{ padding:'60px 5vw 80px', textAlign:'center', animation:'fadeIn 0.8s ease forwards' }}>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          background:'var(--blush)', borderRadius:40,
          padding:'7px 18px', marginBottom:28,
          border:'1px solid var(--rose-light)',
        }}>
          <Sparkles size={14} color='var(--rose)' />
          <span style={{ fontSize:12, color:'var(--rose-deep)', fontWeight:500 }}>AI-Powered Skincare Specialist</span>
        </div>

        <h1 style={{
          fontSize:'clamp(42px, 8vw, 80px)',
          fontWeight:300, color:'var(--charcoal)',
          lineHeight:1.1, marginBottom:20,
          fontFamily:'Cormorant Garamond, serif',
        }}>
          Meet <em style={{ color:'var(--rose-deep)', fontStyle:'italic' }}>Safa</em>
          <br />Your Skin's Expert
        </h1>

        <p style={{
          fontSize:'clamp(15px, 2vw, 18px)', color:'var(--warm-gray)',
          maxWidth:520, margin:'0 auto 40px', lineHeight:1.7,
        }}>
          Personalized skincare advice, AI-powered skin analysis, and treatment tracking — all in one elegant app designed for Moroccan skin.
        </p>

        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background:'var(--rose-deep)', color:'white',
              padding:'14px 32px', borderRadius:40,
              fontSize:15, fontWeight:500,
              boxShadow:'0 8px 24px rgba(168,106,91,0.3)',
              transition:'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(168,106,91,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(168,106,91,0.3)'; }}
          >
            Start for Free
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background:'transparent', color:'var(--charcoal)',
              padding:'14px 32px', borderRadius:40, fontSize:15, fontWeight:500,
              border:'1.5px solid var(--rose-light)',
              transition:'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background='var(--blush)')}
            onMouseLeave={e => (e.currentTarget.style.background='transparent')}
          >
            Sign in with Google
          </button>
        </div>
      </section>

      {/* Cake/Hero Image */}
      <section style={{ padding:'0 5vw 80px', display:'flex', justifyContent:'center' }}>
        <div style={{
          width:'100%', maxWidth:700,
          background:'linear-gradient(145deg, var(--blush) 0%, var(--rose-light) 50%, var(--cream) 100%)',
          borderRadius:'var(--radius-xl)',
          padding:'40px 30px',
          boxShadow:'var(--shadow-lg)',
          position:'relative', overflow:'hidden',
          animation:'fadeIn 1s ease 0.2s both',
        }}>
          {/* Decorative circles */}
          <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(201,137,122,0.1)' }} />
          <div style={{ position:'absolute', bottom:-30, left:-30, width:140, height:140, borderRadius:'50%', background:'rgba(138,158,143,0.1)' }} />

          {/* Cake Image Area */}
          <div style={{
            background:'white', borderRadius:'var(--radius)',
            padding:24, marginBottom:24,
            boxShadow:'var(--shadow)',
            display:'flex', flexDirection:'column', alignItems:'center', gap:16,
          }}>
            <img
              src="https://images.unsplash.com/photo-1522069213448-443a614da9b6?w=600&h=300&fit=crop&crop=center"
              alt="Skincare products"
              style={{
                width:'100%', maxHeight:220,
                objectFit:'cover', borderRadius:'var(--radius-sm)',
                display:'block',
              }}
              loading="lazy"
            />
            <div style={{ textAlign:'center' }}>
              <p style={{ fontSize:13, color:'var(--muted)', fontStyle:'italic' }}>
                "Your skin deserves the best care, every day."
              </p>
            </div>
          </div>

          {/* Mock chat bubble */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{
              background:'white', borderRadius:'18px 18px 18px 4px',
              padding:'12px 16px', maxWidth:'85%',
              boxShadow:'var(--shadow)',
            }}>
              <p style={{ fontSize:13, color:'var(--charcoal)' }}>مرحباً! أنا صفاء، متخصصتك في العناية بالبشرة ✨</p>
            </div>
            <div style={{
              background:'var(--rose-deep)', borderRadius:'18px 18px 4px 18px',
              padding:'12px 16px', maxWidth:'85%', marginLeft:'auto',
            }}>
              <p style={{ fontSize:13, color:'white' }}>بشرتي دهنية ومشكلة حب الشباب. كيف أتعامل معها؟</p>
            </div>
            <div style={{
              background:'white', borderRadius:'18px 18px 18px 4px',
              padding:'12px 16px', maxWidth:'85%',
              boxShadow:'var(--shadow)',
            }}>
              <div style={{ display:'flex', gap:5 }}>
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:'60px 5vw 80px', background:'var(--white)' }}>
        <h2 style={{ textAlign:'center', fontSize:'clamp(30px, 5vw, 48px)', marginBottom:50, color:'var(--charcoal)' }}>
          Why choose <em style={{ color:'var(--rose-deep)', fontStyle:'italic' }}>Safa</em>?
        </h2>
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',
          gap:20, maxWidth:900, margin:'0 auto',
        }}>
          {[
            { icon: Brain, title:'Smart AI', desc:'Powered by Claude AI for accurate, personalized skincare advice in Moroccan Darija, Arabic, French, or English.' },
            { icon: Camera, title:'Skin Analysis', desc:'Upload a photo for instant AI-powered skin analysis that detects skin type, concerns, and more.' },
            { icon: Activity, title:'Treatment Tracking', desc:'Monitor your skin progress over time with structured treatment plans and check-in reminders.' },
            { icon: Shield, title:'Safe & Private', desc:'Your skin data is private. We never share or sell your information to third parties.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{
              background:'var(--cream)', borderRadius:'var(--radius)',
              padding:24, animation:'fadeIn 0.6s ease both',
            }}>
              <div style={{
                width:44, height:44, borderRadius:12,
                background:'var(--blush)', display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:16,
              }}>
                <Icon size={20} color='var(--rose-deep)' />
              </div>
              <h3 style={{ fontSize:18, marginBottom:8 }}>{title}</h3>
              <p style={{ fontSize:13, color:'var(--warm-gray)', lineHeight:1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 5vw', textAlign:'center' }}>
        <h2 style={{ fontSize:'clamp(28px, 5vw, 44px)', marginBottom:16 }}>
          Ready for your best skin?
        </h2>
        <p style={{ color:'var(--warm-gray)', marginBottom:32, fontSize:16 }}>Join thousands of users who trust Safa with their skincare.</p>
        <button
          onClick={() => navigate('/login')}
          style={{
            background:'var(--rose-deep)', color:'white',
            padding:'16px 40px', borderRadius:40, fontSize:16, fontWeight:500,
            boxShadow:'0 8px 32px rgba(168,106,91,0.35)',
            transition:'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
        >
          Start Free Today
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding:'28px 5vw', borderTop:'1px solid var(--blush)', textAlign:'center' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20, flexWrap:'wrap', marginBottom:10 }}>
          <a href='/privacy' style={{ fontSize:13, color:'var(--warm-gray)', textDecoration:'none' }}>Privacy Policy</a>
          <span style={{ color:'var(--blush)' }}>·</span>
          <a href='/terms' style={{ fontSize:13, color:'var(--warm-gray)', textDecoration:'none' }}>Terms of Service</a>
          <span style={{ color:'var(--blush)' }}>·</span>
          <a href='mailto:hamzaelmouddane2000@gmail.com' style={{ fontSize:13, color:'var(--warm-gray)', textDecoration:'none' }}>Contact</a>
        </div>
        <p style={{ fontSize:12, color:'var(--muted)' }}>© 2025 Safa AI · صفاء للعناية بالبشرة</p>
      </footer>
    </div>
  );
};

export default LandingPage;
