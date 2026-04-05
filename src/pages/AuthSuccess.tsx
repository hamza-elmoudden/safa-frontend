import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser, refreshSkinProfile } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const handleSuccess = async () => {
      try {
        // 1. جلب بيانات المستخدم
        await refreshUser();

        // 2. تحقق من وجود skinProfile
        const hasSkin = await refreshSkinProfile();

        // 3. إذا لم يكمل ملف البشرة → وجّهه لصفحة الإعداد (اختياري)
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
