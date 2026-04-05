import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Mail, Eye, Database, Share2, Globe, Lock } from 'lucide-react';

const LAST_UPDATED = 'April 3, 2026';
const CONTACT_EMAIL = 'hamzaelmouddane2000@gmail.com';
const APP_NAME = 'Safa · صفاء';

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div style={{
    background: 'var(--white)', borderRadius: 'var(--radius-xl)',
    padding: '24px', marginBottom: 16,
    boxShadow: 'var(--shadow)', animation: 'fadeIn 0.4s ease',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: 'linear-gradient(135deg, var(--rose-light), var(--rose-deep))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--charcoal)' }}>{title}</h3>
    </div>
    <div style={{ fontSize: 14, color: 'var(--warm-gray)', lineHeight: 1.8 }}>
      {children}
    </div>
  </div>
);

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
    <span style={{ color: 'var(--rose-deep)', marginTop: 2, flexShrink: 0 }}>•</span>
    <span>{children}</span>
  </div>
);

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--cream)',
      padding: '0 0 60px 0',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--white)', borderBottom: '1px solid var(--blush)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 12px rgba(42,37,32,0.06)',
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'var(--blush)', border: 'none', borderRadius: 8,
          padding: '8px', cursor: 'pointer', color: 'var(--rose-deep)',
          display: 'flex', alignItems: 'center',
        }}>
          <ArrowRight size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={20} color="var(--rose-deep)" />
          <div>
            <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--charcoal)' }}>Privacy Policy</p>
            <p style={{ fontSize: 11, color: 'var(--muted)' }}>Last updated: {LAST_UPDATED}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 20px 0' }}>

        {/* Hero */}
        <div style={{
          textAlign: 'center', marginBottom: 32,
          background: 'linear-gradient(135deg, var(--blush), var(--rose-light))',
          borderRadius: 'var(--radius-xl)', padding: '32px 24px',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--rose-light), var(--rose-deep))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Shield size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 8 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: 'var(--warm-gray)', maxWidth: 400, margin: '0 auto' }}>
            Your privacy matters. This policy explains how <strong>{APP_NAME}</strong> collects, uses, and protects your personal information.
          </p>
        </div>

        {/* 1. Information We Collect */}
        <Section icon={<Database size={18} color="white" />} title="1. Information We Collect">
          <p style={{ marginBottom: 12 }}>When you use {APP_NAME}, we may collect the following information:</p>
          <Bullet><strong>Name:</strong> Provided during registration or via Google Sign-In.</Bullet>
          <Bullet><strong>Email address:</strong> Used to identify your account and communicate with you.</Bullet>
          <Bullet><strong>Location data (optional):</strong> City and country you provide in your profile.</Bullet>
          <Bullet><strong>Skin profile data:</strong> Skin type, concerns, allergies, and notes you choose to share.</Bullet>
          <Bullet><strong>Chat history:</strong> Conversations with Safa AI to provide personalized skincare advice.</Bullet>
          <Bullet><strong>Usage data:</strong> Pages visited and features used, to improve the app experience.</Bullet>
        </Section>

        {/* 2. How We Use Your Data */}
        <Section icon={<Eye size={18} color="white" />} title="2. How We Use Your Data">
          <p style={{ marginBottom: 12 }}>We use your information solely to provide and improve our service:</p>
          <Bullet>To <strong>create and manage your account</strong> on Safa.</Bullet>
          <Bullet>To <strong>personalize skincare recommendations</strong> based on your skin profile.</Bullet>
          <Bullet>To allow the AI assistant (Safa) to give you <strong>relevant, tailored advice</strong>.</Bullet>
          <Bullet>To <strong>improve the app</strong> through anonymized usage analytics.</Bullet>
          <Bullet>To <strong>communicate</strong> important updates about your account or our service.</Bullet>
        </Section>

        {/* 3. Data Sharing */}
        <Section icon={<Share2 size={18} color="white" />} title="3. Data Sharing & Third Parties">
          <div style={{
            background: 'var(--blush)', borderRadius: 10, padding: '14px 16px',
            marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 18 }}>🔒</span>
            <p style={{ fontWeight: 500, color: 'var(--rose-deep)' }}>
              We do <strong>not sell, rent, or trade</strong> your personal data to third parties.
            </p>
          </div>
          <p style={{ marginBottom: 12 }}>Your data may be shared only in the following limited cases:</p>
          <Bullet><strong>AI service providers:</strong> To process your skincare queries (data is not stored by the AI provider beyond the session).</Bullet>
          <Bullet><strong>Legal requirements:</strong> If required by law, court order, or to protect rights and safety.</Bullet>
          <Bullet>We do not share your skin profile or personal information with advertisers.</Bullet>
        </Section>

        {/* 4. Google OAuth */}
        <Section icon={<Globe size={18} color="white" />} title="4. Google Sign-In (OAuth)">
          <p style={{ marginBottom: 12 }}>
            {APP_NAME} uses <strong>Google OAuth 2.0</strong> to allow you to sign in with your Google account. When you choose this option:
          </p>
          <Bullet>We receive your <strong>name and email address</strong> from Google.</Bullet>
          <Bullet>We do <strong>not</strong> receive or store your Google password.</Bullet>
          <Bullet>We do <strong>not</strong> access your Google Drive, Gmail, or other Google services.</Bullet>
          <Bullet>Your use of Google Sign-In is also subject to <strong>Google's Privacy Policy</strong> (policies.google.com).</Bullet>
          <p style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>
            You can revoke Safa's access to your Google account at any time via Google Account settings → Security → Third-party apps.
          </p>
        </Section>

        {/* 5. Data Security */}
        <Section icon={<Lock size={18} color="white" />} title="5. Data Security">
          <p style={{ marginBottom: 12 }}>We take reasonable measures to protect your data:</p>
          <Bullet>All data is transmitted over <strong>encrypted HTTPS connections</strong>.</Bullet>
          <Bullet>Access tokens are stored securely and expire after a set period.</Bullet>
          <Bullet>Your password (if applicable) is stored as a <strong>hashed value</strong> — never in plain text.</Bullet>
          <p style={{ marginTop: 12, color: 'var(--muted)', fontSize: 13 }}>
            While we take security seriously, no system is 100% secure. Please use a strong, unique password and report any suspicious activity.
          </p>
        </Section>

        {/* 6. Data Retention */}
        <Section icon={<Database size={18} color="white" />} title="6. Data Retention & Deletion">
          <Bullet>Your data is retained as long as your account is active.</Bullet>
          <Bullet>You may request deletion of your account and all associated data at any time by contacting us.</Bullet>
          <Bullet>Upon deletion, your personal information and skin profile will be permanently removed within 30 days.</Bullet>
        </Section>

        {/* 7. Contact */}
        <Section icon={<Mail size={18} color="white" />} title="7. Contact Us">
          <p style={{ marginBottom: 12 }}>
            If you have any questions about this Privacy Policy or how we handle your data, please reach out:
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--blush)', borderRadius: 10, padding: '10px 16px',
            color: 'var(--rose-deep)', fontWeight: 500, fontSize: 14,
            textDecoration: 'none', transition: 'background 0.2s',
          }}>
            <Mail size={16} /> {CONTACT_EMAIL}
          </a>
        </Section>

        {/* Footer note */}
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
          This policy may be updated. Continued use of the app after changes constitutes acceptance of the new policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
