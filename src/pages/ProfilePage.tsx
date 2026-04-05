import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import api from '../api';
import { Edit2, Save, X, Droplets, MapPin, Globe } from 'lucide-react';

const SKIN_TYPES = ['dry','oily','combination','normal','sensitive'];
const CONCERNS_LIST = [
  { value: 'acne',           label: 'Acne' },
  { value: 'dryness',        label: 'Dryness' },
  { value: 'pigmentation',   label: 'Pigmentation' },
  { value: 'wrinkles',       label: 'Wrinkles' },
  { value: 'sensitivity',    label: 'Sensitivity' },
  { value: 'pores',          label: 'Pores' },
  { value: 'dark_circles',   label: 'Dark Circles' },
  { value: 'uneven_texture', label: 'Uneven Texture' },
];

const COUNTRIES = [
  { code: 'MA', name: 'Morocco' },{ code: 'DZ', name: 'Algeria' },{ code: 'TN', name: 'Tunisia' },
  { code: 'EG', name: 'Egypt' },{ code: 'SA', name: 'Saudi Arabia' },{ code: 'AE', name: 'UAE' },
  { code: 'QA', name: 'Qatar' },{ code: 'KW', name: 'Kuwait' },{ code: 'JO', name: 'Jordan' },
  { code: 'LB', name: 'Lebanon' },{ code: 'FR', name: 'France' },{ code: 'DE', name: 'Germany' },
  { code: 'GB', name: 'United Kingdom' },{ code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },{ code: 'AU', name: 'Australia' },{ code: 'OTHER', name: 'Other' },
];

interface SkinProfile {
  skin_type: string; concerns: string[]; allergies: string[]; notes: string;
}

const ProfilePage: React.FC = () => {
  const { user, refreshUser, refreshSkinProfile } = useAuth();
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const [editUser, setEditUser] = useState(false);
  const [editSkin, setEditSkin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<'user' | 'skin' | null>(null);

  // ✅ FIX: displayInfo updates immediately after save — no waiting on AuthContext re-fetch
  const [displayInfo, setDisplayInfo] = useState({ full_name: '', city: '', country_code: '' });
  const [userForm, setUserForm] = useState({ full_name: '', city: '', country_code: '' });
  const [skinForm, setSkinForm] = useState<SkinProfile>({ skin_type: 'normal', concerns: [], allergies: [], notes: '' });
  const [allergyInput, setAllergyInput] = useState('');

  useEffect(() => {
    if (user) {
      const info = { full_name: user.full_name || '', city: (user as any).city || '', country_code: (user as any).country_code || '' };
      setDisplayInfo(info);
      setUserForm(info);
    }
    api.get('/skinprofiles').then(r => { setSkinProfile(r.data); if (r.data) setSkinForm(r.data); }).catch(() => {});
  }, [user]);

  const saveUser = async () => {
    setSaving(true);
    try {
      await api.patch('/users', userForm);
      setDisplayInfo({ ...userForm }); // ✅ immediate local update
      await refreshUser();
      setEditUser(false);
      setSaveSuccess('user'); setTimeout(() => setSaveSuccess(null), 3000);
    } catch {} setSaving(false);
  };

  const saveSkin = async () => {
    setSaving(true);
    try {
      skinProfile ? await api.put('/skinprofiles', skinForm) : await api.post('/skinprofiles', skinForm);
      setSkinProfile({ ...skinForm });
      await refreshSkinProfile();
      setEditSkin(false);
      setSaveSuccess('skin'); setTimeout(() => setSaveSuccess(null), 3000);
    } catch {} setSaving(false);
  };

  const toggleConcern = (c: string) => setSkinForm(f => ({ ...f, concerns: f.concerns.includes(c) ? f.concerns.filter(x => x !== c) : [...f.concerns, c] }));
  const addAllergy = () => { if (allergyInput.trim() && !skinForm.allergies.includes(allergyInput.trim())) { setSkinForm(f => ({ ...f, allergies: [...f.allergies, allergyInput.trim()] })); setAllergyInput(''); } };
  const removeAllergy = (a: string) => setSkinForm(f => ({ ...f, allergies: f.allergies.filter(x => x !== a) }));
  const countryName = (code: string) => COUNTRIES.find(c => c.code === code)?.name || code;

  const inp: React.CSSProperties = { width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid var(--blush)', background:'var(--cream)', fontSize:14, color:'var(--charcoal)', outline:'none', boxSizing:'border-box' };
  const cardStyle: React.CSSProperties = { background:'var(--white)', borderRadius:'var(--radius-xl)', padding:'24px', marginBottom:20, boxShadow:'var(--shadow)', animation:'fadeIn 0.4s ease' };

  return (
    <div style={{ padding:'24px 20px', maxWidth:680, margin:'0 auto' }}>
      <h2 style={{ fontSize:'clamp(22px,4vw,32px)', marginBottom:28 }}>My Profile</h2>

      {saveSuccess && (
        <div style={{ background:'#e8f5e9', border:'1px solid #a5d6a7', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:13, color:'#2e7d32', animation:'fadeIn 0.3s ease' }}>
          ✅ {saveSuccess === 'user' ? 'Profile updated successfully' : 'Skin profile saved'}
        </div>
      )}

      {/* ── User Card ── */}
      <div style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
          <div style={{ width:64, height:64, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg, var(--rose-light), var(--rose-deep))', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:26, fontFamily:'Cormorant Garamond, serif', fontWeight:600 }}>
            {displayInfo.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:600, fontSize:17 }}>{displayInfo.full_name || user?.full_name}</p>
            <p style={{ fontSize:13, color:'var(--muted)' }}>{user?.email}</p>
            {(displayInfo.city || displayInfo.country_code) && !editUser && (
              <p style={{ fontSize:12, color:'var(--warm-gray)', marginTop:3, display:'flex', alignItems:'center', gap:4 }}>
                <MapPin size={11}/> {[displayInfo.city, displayInfo.country_code ? countryName(displayInfo.country_code) : ''].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          <button onClick={() => { setEditUser(!editUser); setUserForm({...displayInfo}); }}
            style={{ background:'var(--blush)', border:'none', borderRadius:8, padding:'8px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13, color:'var(--rose-deep)', fontWeight:500 }}>
            {editUser ? <><X size={14}/> Cancel</> : <><Edit2 size={14}/> Edit</>}
          </button>
        </div>

        {editUser ? (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { label:'Full Name', key:'full_name', placeholder:'Your full name', type:'text' },
              { label:'City', key:'city', placeholder:'e.g. Casablanca', type:'text' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize:12, fontWeight:500, color:'var(--warm-gray)', display:'block', marginBottom:5 }}>{label}</label>
                <input value={(userForm as any)[key]} onChange={e => setUserForm(f => ({...f, [key]: e.target.value}))} placeholder={placeholder} style={inp} />
              </div>
            ))}
            <div>
              <label style={{ fontSize:12, fontWeight:500, color:'var(--warm-gray)', display:'block', marginBottom:5 }}><Globe size={11} style={{ marginLeft:3 }}/> Country</label>
              <select value={userForm.country_code} onChange={e => setUserForm(f => ({...f, country_code: e.target.value}))} style={{ ...inp, cursor:'pointer' }}>
                <option value="">Select country…</option>
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <button onClick={saveUser} disabled={saving}
              style={{ background:'var(--rose-deep)', color:'white', padding:'12px', borderRadius:10, fontWeight:600, fontSize:14, border:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:saving?0.7:1, cursor:saving?'not-allowed':'pointer' }}>
              {saving ? <div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} /> : <Save size={16}/>}
              Save Changes
            </button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { label:'City',    value: displayInfo.city || '—',    icon:'📍' },
              { label:'Country', value: displayInfo.country_code ? countryName(displayInfo.country_code) : '—', icon:'🌍' },
              { label:'Account', value: (user as any)?.google_provider ? 'Google' : 'Email', icon:'🔑' },
              { label:'Role',    value: user?.role || 'user',        icon:'👤' },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ background:'var(--cream)', borderRadius:10, padding:'12px 14px' }}>
                <p style={{ fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:4 }}>{icon} {label}</p>
                <p style={{ fontSize:14, fontWeight:500, color:'var(--charcoal)' }}>{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Skin Profile Card ── */}
      <div style={{ ...cardStyle, marginBottom:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:'var(--blush)',display:'flex',alignItems:'center',justifyContent:'center' }}><Droplets size={18} color="var(--rose-deep)"/></div>
            <div>
              <p style={{ fontWeight:600, fontSize:16 }}>Skin Profile</p>
              <p style={{ fontSize:12, color:'var(--muted)' }}>{skinProfile ? 'Your personalized data' : 'Not set up yet'}</p>
            </div>
          </div>
          <button onClick={() => setEditSkin(!editSkin)}
            style={{ background:'var(--blush)', border:'none', borderRadius:8, padding:'8px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13, color:'var(--rose-deep)', fontWeight:500 }}>
            {editSkin ? <><X size={14}/> Cancel</> : <><Edit2 size={14}/> {skinProfile ? 'Edit' : 'Setup'}</>}
          </button>
        </div>

        {editSkin ? (
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:500, color:'var(--warm-gray)', display:'block', marginBottom:8 }}>Skin Type</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {SKIN_TYPES.map(s => (
                  <button key={s} onClick={() => setSkinForm(f => ({...f, skin_type:s}))}
                    style={{ padding:'7px 16px', borderRadius:20, fontSize:12, fontWeight:500, border:'1.5px solid', cursor:'pointer', transition:'all 0.15s', borderColor:skinForm.skin_type===s?'var(--rose-deep)':'var(--blush)', background:skinForm.skin_type===s?'var(--rose-deep)':'var(--white)', color:skinForm.skin_type===s?'white':'var(--warm-gray)' }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:500, color:'var(--warm-gray)', display:'block', marginBottom:8 }}>Concerns</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {CONCERNS_LIST.map(c => (
                  <button key={c.value} onClick={() => toggleConcern(c.value)}
                    style={{ padding:'7px 14px', borderRadius:20, fontSize:12, fontWeight:500, border:'1.5px solid', cursor:'pointer', transition:'all 0.15s', borderColor:skinForm.concerns.includes(c.value)?'var(--rose-deep)':'var(--blush)', background:skinForm.concerns.includes(c.value)?'var(--blush)':'var(--white)', color:skinForm.concerns.includes(c.value)?'var(--rose-deep)':'var(--warm-gray)' }}>{c.label}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:500, color:'var(--warm-gray)', display:'block', marginBottom:8 }}>Allergies</label>
              <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                <input value={allergyInput} onChange={e => setAllergyInput(e.target.value)} onKeyDown={e => e.key==='Enter' && addAllergy()} placeholder="e.g. retinol, fragrance…" style={{ ...inp, flex:1 }}/>
                <button onClick={addAllergy} style={{ padding:'10px 14px', background:'var(--rose-deep)', color:'white', border:'none', borderRadius:10, fontSize:13, cursor:'pointer' }}>Add</button>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {skinForm.allergies.map(a => (
                  <span key={a} style={{ background:'var(--blush)', borderRadius:20, padding:'4px 12px', fontSize:12, display:'flex', alignItems:'center', gap:6, color:'var(--rose-deep)' }}>
                    {a}<button onClick={() => removeAllergy(a)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--rose)', padding:0 }}><X size={11}/></button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:500, color:'var(--warm-gray)', display:'block', marginBottom:6 }}>Notes</label>
              <textarea value={skinForm.notes} onChange={e => setSkinForm(f => ({...f, notes:e.target.value}))} placeholder="Any additional notes about your skin…" rows={3} style={{ ...inp, resize:'vertical' }}/>
            </div>
            <button onClick={saveSkin} disabled={saving}
              style={{ background:'var(--rose-deep)', color:'white', padding:'12px', borderRadius:10, fontWeight:600, fontSize:14, border:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:saving?0.7:1, cursor:saving?'not-allowed':'pointer' }}>
              {saving ? <div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} /> : <Save size={16}/>}
              Save Skin Profile
            </button>
          </div>
        ) : skinProfile ? (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div style={{ background:'var(--cream)', borderRadius:10, padding:'12px 14px' }}>
                <p style={{ fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:3 }}>Skin Type</p>
                <p style={{ fontSize:14, fontWeight:600, color:'var(--rose-deep)', textTransform:'capitalize' }}>{skinProfile.skin_type}</p>
              </div>
              <div style={{ background:'var(--cream)', borderRadius:10, padding:'12px 14px' }}>
                <p style={{ fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:3 }}>Concerns</p>
                <p style={{ fontSize:13, fontWeight:500, color:'var(--charcoal)' }}>{skinProfile.concerns.length > 0 ? skinProfile.concerns.join(', ') : '—'}</p>
              </div>
            </div>
            {skinProfile.allergies.length > 0 && (
              <div style={{ background:'#fff5f5', borderRadius:10, padding:'12px 14px', border:'1px solid #ffd0d0' }}>
                <p style={{ fontSize:11, color:'#c0392b', textTransform:'uppercase', letterSpacing:0.5, marginBottom:6 }}>⚠️ Allergies</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>{skinProfile.allergies.map(a => <span key={a} style={{ background:'#ffd0d0', borderRadius:20, padding:'3px 10px', fontSize:12, color:'#c0392b' }}>{a}</span>)}</div>
              </div>
            )}
            {skinProfile.notes && (
              <div style={{ background:'var(--cream)', borderRadius:10, padding:'12px 14px' }}>
                <p style={{ fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:3 }}>Notes</p>
                <p style={{ fontSize:13, color:'var(--warm-gray)' }}>{skinProfile.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'24px', color:'var(--muted)' }}>
            <p style={{ fontSize:14 }}>Set up your skin profile so Safa can give personalized advice.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
