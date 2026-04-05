import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import api from './api';

interface User {
  id: string;
  full_name: string;
  email: string;
  country_code?: string;
  city?: string;
  is_complete_login: boolean;
  role: string;
}

interface PaymentStatus {
  hasActivePlan: boolean;
  expiresAt: string | null;
  subscriptionId: string | null;
}

// null = لم يُحدد بعد (جاري التحميل)
// true = يوجد ملف بشرة
// false = لا يوجد ملف بشرة (لكن لا نجبره)
type SkinProfileStatus = null | boolean;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasSkinProfile: SkinProfileStatus;
  skinProfileChecked: boolean;
  paymentStatus: PaymentStatus | null;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;          // ← was Promise<void>
  refreshSkinProfile: () => Promise<boolean>;        // ← was Promise<void>
  refreshPaymentStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  hasSkinProfile: null,
  skinProfileChecked: false,
  paymentStatus: null,
  logout: async () => {},
  refreshUser: async () => null,                     // ← returns null
  refreshSkinProfile: async () => false,             // ← returns false
  refreshPaymentStatus: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSkinProfile, setHasSkinProfile] = useState<SkinProfileStatus>(null);
  const [skinProfileChecked, setSkinProfileChecked] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const initialFetchDone = useRef(false);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const refreshSkinProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/skinprofiles');
      const has = !!data && !!data.skin_type;
      setHasSkinProfile(has);
      setSkinProfileChecked(true);
      return has;
    } catch {
      setHasSkinProfile(false);
      setSkinProfileChecked(true);
      return false;
    }
  }, []);

  const refreshPaymentStatus = useCallback(async () => {
    try {
      const { data } = await api.get('/payments/status');
      setPaymentStatus(data);
    } catch {
      setPaymentStatus({ hasActivePlan: false, expiresAt: null, subscriptionId: null });
    }
  }, []);

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;

    const init = async () => {
      const userData = await refreshUser();
      if (userData) {
        // جلب skin profile وحالة الاشتراك بالتوازي فقط إذا كان المستخدم مسجلاً
        await Promise.allSettled([refreshSkinProfile(), refreshPaymentStatus()]);
      } else {
        // المستخدم غير مسجل — ضبط القيم مباشرة بدون طلبات إضافية
        setSkinProfileChecked(true);
      }
      setLoading(false);
    };

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setHasSkinProfile(null);
    setSkinProfileChecked(false);
    setPaymentStatus(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      hasSkinProfile,
      skinProfileChecked,
      paymentStatus,
      logout,
      refreshUser,
      refreshSkinProfile,
      refreshPaymentStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
