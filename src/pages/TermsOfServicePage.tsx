import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Mail, User, AlertTriangle, RefreshCw, Shield, Stethoscope } from 'lucide-react';

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

const TermsOfServicePage: React.FC = () => {
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
          <FileText size={20} color="var(--rose-deep)" />
          <div>
            <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--charcoal)' }}>Terms of Service</p>
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
            <FileText size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 8 }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: 14, color: 'var(--warm-gray)', maxWidth: 420, margin: '0 auto' }}>
            By using <strong>{APP_NAME}</strong>, you agree to these terms. Please read them carefully before using our service.
          </p>
        </div>

        {/* Important medical disclaimer */}
        <div style={{
          background: '#fff8e6', border: '1.5px solid #f5c842',
          borderRadius: 'var(--radius-xl)', padding: '18px 20px',
          marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <Stethoscope size={22} color="#d4900a" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontWeight: 600, color: '#8a5c00', marginBottom: 4, fontSize: 14 }}>Medical Disclaimer</p>
            <p style={{ fontSize: 13, color: '#a07010', lineHeight: 1.7 }}>
              {APP_NAME} provides AI-powered skincare information and suggestions. This is <strong>not medical advice</strong>. Always consult a qualified dermatologist or healthcare professional for medical skin conditions.
            </p>
          </div>
        </div>

        {/* 1. Acceptance */}
        <Section icon={<FileText size={18} color="white" />} title="1. Acceptance of Terms">
          <p style={{ marginBottom: 12 }}>
            By accessing or using {APP_NAME}, you confirm that you:
          </p>
          <Bullet>Are at least <strong>13 years of age</strong> (or the minimum age of digital consent in your country).</Bullet>
          <Bullet>Have read, understood, and agree to be bound by these Terms of Service.</Bullet>
          <Bullet>Agree to our <strong>Privacy Policy</strong>, which is incorporated into these terms.</Bullet>
          <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: 13 }}>
            If you do not agree with any part of these terms, please do not use the service.
          </p>
        </Section>

        {/* 2. Use of the App */}
        <Section icon={<Shield size={18} color="white" />} title="2. Use of the Application">
          <p style={{ marginBottom: 12 }}>You agree to use {APP_NAME} only for lawful purposes. You must <strong>not</strong>:</p>
          <Bullet>Use the app to transmit harmful, offensive, or illegal content.</Bullet>
          <Bullet>Attempt to reverse-engineer, hack, or disrupt the service.</Bullet>
          <Bullet>Misrepresent your identity or impersonate any person or entity.</Bullet>
          <Bullet>Use automated tools (bots, scrapers) to access the service without permission.</Bullet>
          <Bullet>Use the AI assistant for purposes other than personal skincare guidance.</Bullet>
          <p style={{ marginTop: 12 }}>
            <strong>You are responsible</strong> for all activity that occurs through your account. Use the service respectfully and responsibly.
          </p>
        </Section>

        {/* 3. Accounts */}
        <Section icon={<User size={18} color="white" />} title="3. Your Account">
          <Bullet>You are <strong>solely responsible</strong> for maintaining the confidentiality of your account credentials.</Bullet>
          <Bullet>Notify us immediately at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--rose-deep)' }}>{CONTACT_EMAIL}</a> if you suspect unauthorized access to your account.</Bullet>
          <Bullet>We reserve the right to suspend or terminate accounts that violate these terms.</Bullet>
          <Bullet>One person may hold only one account. Creating duplicate accounts is not permitted.</Bullet>
          <Bullet>You may delete your account at any time by contacting us.</Bullet>
        </Section>

        {/* 4. Limitation of Liability */}
        <Section icon={<AlertTriangle size={18} color="white" />} title="4. Limitation of Liability">
          <div style={{ background: 'var(--blush)', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
            <p style={{ fontWeight: 500, color: 'var(--rose-deep)', fontSize: 13 }}>
              {APP_NAME} is provided "as is" without warranties of any kind, express or implied.
            </p>
          </div>
          <Bullet>We are <strong>not liable</strong> for any direct, indirect, incidental, or consequential damages arising from your use of the app.</Bullet>
          <Bullet>We do not guarantee that the AI's skincare recommendations are accurate, complete, or suitable for your specific skin condition.</Bullet>
          <Bullet>We are not responsible for any allergic reactions, skin damage, or other adverse effects resulting from following advice provided by the app.</Bullet>
          <Bullet>Service availability is not guaranteed; the app may experience downtime for maintenance or unforeseen issues.</Bullet>
          <p style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>
            Always consult a dermatologist before making significant changes to your skincare routine, especially if you have a diagnosed skin condition.
          </p>
        </Section>

        {/* 5. Intellectual Property */}
        <Section icon={<Shield size={18} color="white" />} title="5. Intellectual Property">
          <Bullet>All content, branding, design, and code in {APP_NAME} is the property of the app's developers.</Bullet>
          <Bullet>You may not copy, reproduce, or distribute any part of the service without prior written permission.</Bullet>
          <Bullet>Content you submit (e.g., messages, skin notes) remains yours. By submitting it, you grant us a license to use it solely to operate the service.</Bullet>
        </Section>

        {/* 6. Modifications */}
        <Section icon={<RefreshCw size={18} color="white" />} title="6. Modifications to Terms">
          <Bullet>We may update these Terms of Service at any time.</Bullet>
          <Bullet>Changes will be posted on this page with an updated "Last Updated" date.</Bullet>
          <Bullet>Continued use of the app after changes are posted constitutes your acceptance of the updated terms.</Bullet>
          <Bullet>For significant changes, we will make reasonable efforts to notify you via email or in-app notification.</Bullet>
        </Section>

        {/* 7. Contact */}
        <Section icon={<Mail size={18} color="white" />} title="7. Contact Us">
          <p style={{ marginBottom: 12 }}>
            If you have questions about these Terms or wish to report a violation, please contact us:
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--blush)', borderRadius: 10, padding: '10px 16px',
            color: 'var(--rose-deep)', fontWeight: 500, fontSize: 14,
            textDecoration: 'none',
          }}>
            <Mail size={16} /> {CONTACT_EMAIL}
          </a>
        </Section>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
          These terms are governed by applicable law. By using {APP_NAME} you agree to resolve disputes through good-faith negotiation before seeking legal remedies.
        </p>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
