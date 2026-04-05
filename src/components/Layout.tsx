import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { MessageCircle, Sparkles, Activity, User, CreditCard, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: Sparkles, end: true },
  { to: '/app/chat', label: 'Chat with Safa', icon: MessageCircle },
  { to: '/app/treatments', label: 'My Treatments', icon: Activity },
  { to: '/app/profile', label: 'Profile', icon: User },
  { to: '/app/subscriptions', label: 'Subscriptions', icon: CreditCard },
];

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--cream)' }}>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(42,37,32,0.4)', zIndex:40, backdropFilter:'blur(2px)' }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'var(--white)',
        borderRight: '1px solid var(--blush)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        zIndex: 50,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        boxShadow: open ? 'var(--shadow-lg)' : 'none',
      }}
      className="sidebar">
        {/* Logo */}
        <div style={{ padding:'28px 24px 20px', borderBottom:'1px solid var(--blush)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <h1 style={{ fontSize:26, fontWeight:600, color:'var(--rose-deep)', letterSpacing:'-0.5px' }}>صفاء</h1>
              <p style={{ fontSize:11, color:'var(--muted)', letterSpacing:2, textTransform:'uppercase' }}>Skincare AI</p>
            </div>
            <button onClick={() => setOpen(false)} style={{ background:'none', color:'var(--muted)', padding:4 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* User */}
        <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--blush)', background:'var(--blush)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              width:40, height:40, borderRadius:'50%',
              background:'linear-gradient(135deg, var(--rose-light), var(--rose))',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'white', fontWeight:600, fontSize:16
            }}>
              {user?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow:'hidden' }}>
              <p style={{ fontWeight:500, fontSize:14, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.full_name || 'User'}</p>
              <p style={{ fontSize:12, color:'var(--muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'12px 12px', overflowY:'auto' }}>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:12,
                padding:'11px 14px', borderRadius:'var(--radius-sm)',
                marginBottom:2, fontSize:14, fontWeight:500,
                color: isActive ? 'var(--rose-deep)' : 'var(--warm-gray)',
                background: isActive ? 'var(--blush)' : 'transparent',
                transition:'all 0.2s',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding:'12px 12px', borderTop:'1px solid var(--blush)' }}>
          <button
            onClick={logout}
            style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'11px 14px', borderRadius:'var(--radius-sm)',
              width:'100%', fontSize:14, fontWeight:500,
              color:'var(--warm-gray)', background:'none',
              transition:'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background='var(--blush)')}
            onMouseLeave={e => (e.currentTarget.style.background='none')}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        {/* Top bar mobile */}
        <header style={{
          display:'flex', alignItems:'center', gap:14,
          padding:'14px 20px',
          background:'var(--white)',
          borderBottom:'1px solid var(--blush)',
          position:'sticky', top:0, zIndex:30,
        }}>
          <button
            onClick={() => setOpen(true)}
            style={{ background:'none', color:'var(--charcoal)', padding:4 }}
          >
            <Menu size={22} />
          </button>
          <div>
            <h1 style={{ fontSize:20, fontWeight:600, color:'var(--rose-deep)' }}>صفاء</h1>
          </div>
          <div style={{ marginLeft:'auto' }}>
            <div
              onClick={() => navigate('/app/profile')}
              style={{
                width:34, height:34, borderRadius:'50%',
                background:'linear-gradient(135deg, var(--rose-light), var(--rose))',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'white', fontWeight:600, fontSize:14, cursor:'pointer',
              }}
            >
              {user?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main style={{ flex:1, overflowY:'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .sidebar {
            transform: translateX(0) !important;
            box-shadow: none !important;
            position: sticky !important;
            height: 100vh !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
