import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from '../api';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser, refreshSkinProfile } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const handleSuccess = async () => {
      try {
        // قراءة التوكنات من URL params
        // الباكند يعمل redirect إلى: /auth/success?access_token=...&refresh_token=...
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access_token');

        console.log('access token:',accessToken)
        
        const refreshToken = params.get('refresh_token');

        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }

        if (!accessToken) {
          console.error('No access_token in URL');
          navigate('/login', { replace: true });
          return;
        }

        // جلب بيانات المستخدم
        await refreshUser();

        // تحقق من skinProfile
        const hasSkin = await refreshSkinProfile();

        if (!hasSkin) {
          navigate('/setup-skin-profile', { replace: true });
        } else {
          navigate('/app', { replace: true });
        }
      } catch {
        navigate('/login', { replace: true });
      }
    };

    handleSuccess();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'var(--cream)',
    }}>
      <div style={{
        width: 56, height: 56,
        border: '3px solid var(--rose-light)',
        borderTopColor: 'var(--rose)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginBottom: 20,
      }} />
      <p style={{ color: 'var(--warm-gray)', fontSize: 16, fontWeight: 500 }}>Signing you in…</p>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>Please wait a moment</p>
    </div>
  );
};

export default AuthSuccess;
