// @ts-nocheck
import { useState, useEffect } from 'react';
import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';

interface SettingsProps {
  user: any;
  onSignInClick: () => void;
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-medium flex items-center gap-2 shadow-xl ${type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
      <IIcon icon={type === 'success' ? 'lucide:check' : 'lucide:x'} width="14" />
      {message}
    </div>
  );
}

export default function Settings({ user, onSignInClick }: SettingsProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passStatus, setPassStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  // 2FA state
  const [show2FA, setShow2FA] = useState(false);

  // Delete state
  const [showDelete, setShowDelete] = useState(false);
  const [deleteText, setDeleteText] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wregalsUserSettings') || '{}');
    setFullName(saved.fullName || user?.user_metadata?.full_name || '');
    setPhone(saved.phone || user?.user_metadata?.phone || '');
    setEmailAlerts(saved.emailAlerts !== undefined ? saved.emailAlerts : true);
    setSmsAlerts(saved.smsAlerts || false);
    setMarketingEmails(saved.marketingEmails || false);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveProfile = () => {
    const settings = { fullName, phone, emailAlerts, smsAlerts, marketingEmails };
    localStorage.setItem('wregalsUserSettings', JSON.stringify(settings));
    showToast('Settings saved.', 'success');
  };

  const saveNotifications = () => {
    const existing = JSON.parse(localStorage.getItem('wregalsUserSettings') || '{}');
    localStorage.setItem('wregalsUserSettings', JSON.stringify({ ...existing, emailAlerts, smsAlerts, marketingEmails }));
    showToast('Preferences updated.', 'success');
  };

  const handlePasswordChange = () => {
    if (!oldPass || !newPass) { setPassStatus('error'); return; }
    if (newPass.length < 8) { setPassStatus('error'); return; }
    setPassStatus('loading');
    setTimeout(() => {
      setPassStatus('done');
      setOldPass(''); setNewPass('');
      setTimeout(() => { setShowPasswordForm(false); setPassStatus('idle'); }, 1800);
    }, 1400);
  };

  const handleDeleteAccount = () => {
    if (deleteText !== 'DELETE') return;
    showToast('Account deletion requested. We\'ll send you a confirmation email.', 'success');
    setShowDelete(false);
    setDeleteText('');
  };

  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="Settings">
      <div className="space-y-6">

        {/* Profile Settings */}
        <section className="border rounded-xl p-7 space-y-5" style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/5 text-blue-400 flex items-center justify-center">
              <IIcon icon="lucide:user" width="16" />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--hh-w1)' }}>Profile</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold tracking-wide" style={{ color: 'var(--hh-w3)' }}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-transparent border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500"
                style={{ borderColor: 'var(--hh-line)', color: 'var(--hh-w1)' }}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold tracking-wide" style={{ color: 'var(--hh-w3)' }}>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-transparent border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500"
                style={{ borderColor: 'var(--hh-line)', color: 'var(--hh-w1)' }}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div className="pt-2">
            <button onClick={saveProfile} className="px-6 py-2.5 bg-white text-black text-xs font-semibold tracking-wide hover:bg-neutral-200 transition-colors rounded-sm">
              Save Changes
            </button>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="border rounded-xl p-7 space-y-6" style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/5 text-blue-400 flex items-center justify-center">
              <IIcon icon="lucide:bell" width="16" />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--hh-w1)' }}>Notifications</h2>
          </div>
          <div className="space-y-5">
            {[
              { label: 'Email alerts', desc: 'Get notified about bids, outbids, and auction results.', val: emailAlerts, set: setEmailAlerts },
              { label: 'SMS alerts', desc: 'Text messages when someone outbids you.', val: smsAlerts, set: setSmsAlerts },
              { label: 'Marketing emails', desc: 'Occasional updates on new collections and drops.', val: marketingEmails, set: setMarketingEmails },
            ].map(({ label, desc, val, set }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--hh-w1)' }}>{label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--hh-w3)' }}>{desc}</p>
                </div>
                <button
                  onClick={() => set(!val)}
                  className={`w-10 h-5 rounded-full transition-colors relative flex items-center flex-shrink-0 ${val ? 'bg-white' : 'bg-neutral-700'}`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full absolute transition-transform ${val ? 'translate-x-5 bg-black' : 'translate-x-1 bg-white'}`} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={saveNotifications} className="px-6 py-2.5 bg-white text-black text-xs font-semibold tracking-wide hover:bg-neutral-200 transition-colors rounded-sm">
            Save Preferences
          </button>
        </section>

        {/* Security */}
        <section className="border rounded-xl p-7 space-y-5" style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/5 text-blue-400 flex items-center justify-center">
              <IIcon icon="lucide:shield" width="16" />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--hh-w1)' }}>Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--hh-line)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--hh-w1)' }}>Password</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--hh-w3)' }}>Last changed 3 months ago</p>
              </div>
              <button
                onClick={() => { setShowPasswordForm(!showPasswordForm); setPassStatus('idle'); }}
                className="px-5 py-2 border text-[10px] font-semibold tracking-wide transition-all rounded-sm hover:bg-white hover:text-black"
                style={{ borderColor: 'var(--hh-line2)', color: 'var(--hh-w1)' }}
              >
                {showPasswordForm ? 'Cancel' : 'Update Password'}
              </button>
            </div>

            {showPasswordForm && (
              <div className="space-y-3 py-2">
                <input type="password" value={oldPass} onChange={e => { setOldPass(e.target.value); setPassStatus('idle'); }}
                  placeholder="Current password" className="w-full bg-transparent border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  style={{ borderColor: 'var(--hh-line)', color: 'var(--hh-w1)' }} />
                <input type="password" value={newPass} onChange={e => { setNewPass(e.target.value); setPassStatus('idle'); }}
                  placeholder="New password (min 8 characters)" className="w-full bg-transparent border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  style={{ borderColor: 'var(--hh-line)', color: 'var(--hh-w1)' }} />
                {passStatus === 'error' && <p className="text-xs text-red-400">Both fields are required and the new password needs at least 8 characters.</p>}
                {passStatus === 'done' && <p className="text-xs text-emerald-400">Password updated.</p>}
                <button onClick={handlePasswordChange} disabled={passStatus === 'loading' || passStatus === 'done'}
                  className="px-5 py-2 bg-white text-black text-xs font-semibold rounded-sm hover:bg-neutral-200 transition-colors disabled:opacity-50">
                  {passStatus === 'loading' ? 'Updating...' : passStatus === 'done' ? 'Updated!' : 'Confirm Change'}
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--hh-line)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--hh-w1)' }}>Two-factor authentication</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--hh-w3)' }}>Adds a second step when you log in. Worth setting up.</p>
              </div>
              <button onClick={() => setShow2FA(true)}
                className="px-5 py-2 border text-[10px] font-semibold tracking-wide transition-all rounded-sm hover:bg-white hover:text-black"
                style={{ borderColor: 'var(--hh-line2)', color: 'var(--hh-w1)' }}>
                Set Up 2FA
              </button>
            </div>
          </div>
        </section>

        {/* 2FA Modal */}
        {show2FA && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShow2FA(false)}>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 space-y-5" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">Set Up 2FA</h3>
                <button onClick={() => setShow2FA(false)} className="text-neutral-500 hover:text-white text-xl leading-none">×</button>
              </div>
              <p className="text-sm text-neutral-400">Scan this with Google Authenticator (or any TOTP app) to secure your account with two-factor authentication.</p>
              <div className="bg-white p-4 rounded-xl mx-auto w-40 h-40 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-1 w-full h-full">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-neutral-500 text-center">Manual key: WREGALS-2FA-DEMO-KEY</p>
              <button onClick={() => { showToast('2FA enabled. Keep your recovery codes safe.', 'success'); setShow2FA(false); }}
                className="w-full py-2.5 bg-white text-black text-xs font-semibold rounded-sm hover:bg-neutral-200 transition-colors">
                I've set it up
              </button>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <section className="border rounded-xl p-7 space-y-4" style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
              <IIcon icon="lucide:alert-triangle" width="16" />
            </div>
            <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--hh-w3)' }}>
            Deleting your account is permanent. All bids, wallet history, and saved items will be removed and can't be restored.
          </p>
          {!showDelete ? (
            <button onClick={() => setShowDelete(true)}
              className="px-6 py-2.5 border border-red-500/30 text-red-500 text-xs font-semibold tracking-wide hover:bg-red-500 hover:text-white transition-colors rounded-sm">
              Delete Account
            </button>
          ) : (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-red-400">Type <strong>DELETE</strong> below to confirm you want to delete your account.</p>
              <input
                type="text"
                value={deleteText}
                onChange={e => setDeleteText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full max-w-xs bg-transparent border border-red-500/40 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-500"
                style={{ color: 'var(--hh-w1)' }}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteText !== 'DELETE'}
                  className="px-6 py-2.5 bg-red-600 text-white text-xs font-semibold hover:bg-red-500 transition-colors rounded-sm disabled:opacity-40"
                >
                  Yes, delete my account
                </button>
                <button onClick={() => { setShowDelete(false); setDeleteText(''); }}
                  className="px-5 py-2 border text-xs font-semibold rounded-sm hover:bg-white hover:text-black transition-all"
                  style={{ borderColor: 'var(--hh-line2)', color: 'var(--hh-w1)' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </AccountLayout>
  );
}
