import React, { useState } from 'react';
import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';

interface SettingsProps {
  user: any;
  onSignInClick: () => void;
}

export default function Settings({ user, onSignInClick }: SettingsProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="Settings">
      <div className="space-y-6">
        
        {/* Profile Settings */}
        <section
          className="border rounded-xl p-7 space-y-5"
          style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
              <IIcon icon="lucide:user" width="16" />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--hh-w1)' }}>Profile Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--hh-w3)' }}>Full Name</label>
              <input 
                type="text" 
                defaultValue={user?.user_metadata?.full_name || ''}
                className="w-full bg-transparent border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D4AF37]"
                style={{ borderColor: 'var(--hh-line)', color: 'var(--hh-w1)' }}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--hh-w3)' }}>Phone Number</label>
              <input 
                type="tel" 
                defaultValue={user?.user_metadata?.phone || ''}
                className="w-full bg-transparent border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D4AF37]"
                style={{ borderColor: 'var(--hh-line)', color: 'var(--hh-w1)' }}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button className="px-6 py-2.5 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#c49f2e] transition-colors rounded-sm">
              Save Changes
            </button>
          </div>
        </section>

        {/* Notification Preferences */}
        <section
          className="border rounded-xl p-7 space-y-6"
          style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
              <IIcon icon="lucide:bell" width="16" />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--hh-w1)' }}>Notification Preferences</h2>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--hh-w1)' }}>Email Alerts</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--hh-w3)' }}>Receive updates about your bids and watched auctions.</p>
              </div>
              <button 
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${emailAlerts ? 'bg-[#D4AF37]' : 'bg-neutral-700'}`}
              >
                <span className={`w-3.5 h-3.5 bg-white rounded-full absolute transition-transform ${emailAlerts ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--hh-w1)' }}>SMS Notifications</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--hh-w3)' }}>Get text messages for outbid alerts.</p>
              </div>
              <button 
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${smsAlerts ? 'bg-[#D4AF37]' : 'bg-neutral-700'}`}
              >
                <span className={`w-3.5 h-3.5 bg-white rounded-full absolute transition-transform ${smsAlerts ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--hh-w1)' }}>Marketing Emails</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--hh-w3)' }}>Receive news, special offers, and curated collections.</p>
              </div>
              <button 
                onClick={() => setMarketingEmails(!marketingEmails)}
                className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${marketingEmails ? 'bg-[#D4AF37]' : 'bg-neutral-700'}`}
              >
                <span className={`w-3.5 h-3.5 bg-white rounded-full absolute transition-transform ${marketingEmails ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Security */}
        <section
          className="border rounded-xl p-7 space-y-5"
          style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
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
              <button className="px-5 py-2 border text-[10px] uppercase tracking-widest font-semibold transition-all rounded-sm hover:bg-white hover:text-black" style={{ borderColor: 'var(--hh-line2)', color: 'var(--hh-w1)' }}>
                Update Password
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--hh-line)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--hh-w1)' }}>Two-Factor Authentication</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--hh-w3)' }}>Add an extra layer of security to your account.</p>
              </div>
              <button className="px-5 py-2 border text-[10px] uppercase tracking-widest font-semibold transition-all rounded-sm hover:bg-white hover:text-black" style={{ borderColor: 'var(--hh-line2)', color: 'var(--hh-w1)' }}>
                Enable 2FA
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section
          className="border rounded-xl p-7 space-y-4"
          style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
              <IIcon icon="lucide:alert-triangle" width="16" />
            </div>
            <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
          </div>
          
          <p className="text-sm" style={{ color: 'var(--hh-w3)' }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <div className="pt-2">
            <button className="px-6 py-2.5 border border-red-500/30 text-red-500 text-xs uppercase tracking-widest font-semibold hover:bg-red-500 hover:text-white transition-colors rounded-sm">
              Delete Account
            </button>
          </div>
        </section>

      </div>
    </AccountLayout>
  );
}
