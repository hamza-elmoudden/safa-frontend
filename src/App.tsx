import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AuthSuccess from './pages/AuthSuccess';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import TreatmentsPage from './pages/TreatmentsPage';
import TreatmentChatPage from './pages/TreatmentChatPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import SkinProfileSetupPage from './pages/SkinProfileSetupPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import Layout from './components/Layout';

const Spinner = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--cream)',
  }}>
    <div style={{
      width: 36, height: 36,
      border: '3px solid var(--rose-light)',
      borderTopColor: 'var(--rose)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  </div>
);

/**
 * ProtectedRoute: يحمي الصفحات التي تتطلب تسجيل دخول
 * لا يجبر على إنشاء skinProfile — هذا اختياري
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  // ✅ SkinProfile اختياري — لا نعمل redirect إجباري هنا
  return <>{children}</>;
};

/**
 * PublicRoute: يمنع المستخدم المسجل من الوصول لصفحات الدخول
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to="/app" replace />;
  return <>{children}</>;
};

/**
 * SetupRoute: صفحة إعداد البشرة
 * - متاحة فقط للمستخدم المسجل
 * - إذا أكمل الإعداد مسبقاً → وجّهه للـ app
 * - لكن لا نجبر على الوصول إليها (يمكن تخطيها)
 */
const SetupRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, hasSkinProfile, skinProfileChecked } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  // انتظر حتى يتم التحقق من skinProfile قبل أي redirect
  if (!skinProfileChecked) return <Spinner />;

  // إذا أكمل الإعداد مسبقاً → وجّهه للـ app
  if (hasSkinProfile === true) return <Navigate to="/app" replace />;

  return <>{children}</>;
};

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* OAuth callback */}
        <Route path="/auth/success" element={<AuthSuccess />} />

        {/* إعداد ملف البشرة — اختياري وليس إجبارياً */}
        <Route
          path="/setup-skin-profile"
          element={<SetupRoute><SkinProfileSetupPage /></SetupRoute>}
        />

        <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="treatments" element={<TreatmentsPage />} />
          <Route path="treatments/:id/chat" element={<TreatmentChatPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
        </Route>

        {/* Legal pages — public, no auth required */}
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
