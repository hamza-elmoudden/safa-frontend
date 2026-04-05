import React from 'react';
import { API_BASE } from '../api';

const LoginPage: React.FC = () => {
  const handleGoogle = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex',
      background:'linear-gradient(135deg, var(--cream) 0%, var(--blush) 100%)',
    }}>
      {/* Left panel (hidden on mobile) */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'60px 40px',
        background:'linear-gradient(145deg, var(--rose-deep) 0%, var(--rose) 100%)',
        position:'relative', overflow:'hidden',
      }}
      className="login-left">
        <div style={{ position:'absolute', top:-60, right:-60, width:250, height:250, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />

        <div style={{ textAlign:'center', zIndex:1, animation:'fadeIn 0.8s ease' }}>
          <h1 style={{ fontSize:56, fontWeight:300, color:'white', marginBottom:8, fontFamily:'Cormorant Garamond, serif' }}>صفاء</h1>
          <p style={{ fontSize:12, letterSpacing:3, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', marginBottom:40 }}>AI Skincare Specialist</p>

          <img
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop&crop=center"
            alt="Skincare"
            style={{
              width:'100%', maxWidth:320, borderRadius:20,
              boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
              objectFit:'cover',
            }}
          />

          <p style={{ marginTop:32, color:'rgba(255,255,255,0.85)', fontSize:15, lineHeight:1.7, maxWidth:300 }}>
            Your personal AI skincare specialist, available 24/7 in your language.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'40px 5vw',
        minWidth: 0,
      }}>
        <div style={{
          width:'100%', maxWidth:400,
          background:'white', borderRadius:'var(--radius-xl)',
          padding:'40px 36px',
          boxShadow:'var(--shadow-lg)',
          animation:'fadeIn 0.6s ease',
        }}>
          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <h2 style={{ fontSize:32, color:'var(--rose-deep)', marginBottom:6 }}>Welcome</h2>
            <p style={{ fontSize:14, color:'var(--warm-gray)' }}>Sign in to continue to Safa</p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            style={{
              width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:12,
              padding:'14px 20px', borderRadius:12,
              background:'var(--charcoal)', color:'white',
              fontSize:14, fontWeight:500,
              boxShadow:'0 4px 16px rgba(42,37,32,0.2)',
              transition:'all 0.2s',
              marginBottom:20,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(42,37,32,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(42,37,32,0.2)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ textAlign:'center', margin:'20px 0', position:'relative' }}>
            <div style={{ height:1, background:'var(--blush)', position:'absolute', top:'50%', left:0, right:0 }} />
            <span style={{ background:'white', padding:'0 12px', fontSize:12, color:'var(--muted)', position:'relative' }}>
              Secure · Private · Free
            </span>
          </div>

          <p style={{ fontSize:12, color:'var(--muted)', textAlign:'center', lineHeight:1.7 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
            Your skin data is always private.
          </p>
        </div>

        {/* Features summary */}
        <div style={{ marginTop:28, display:'flex', gap:20, flexWrap:'wrap', justifyContent:'center' }}>
          {['AI Chat', 'Skin Analysis', 'Treatment Plans'].map(f => (
            <span key={f} style={{ fontSize:12, color:'var(--warm-gray)', display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--rose)', display:'inline-block' }} />
              {f}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .login-left { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
