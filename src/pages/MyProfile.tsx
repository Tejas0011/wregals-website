import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';

interface MyProfileProps {
  user: any;
  onSignInClick: () => void;
}

function KpiCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-[#0d0d0d] border border-white/5 p-5 rounded-xl flex items-center justify-between hover:border-white/10 transition-colors group">
      <div>
        <p className="text-[10px] text-neutral-500 tracking-widest uppercase mb-1">{label}</p>
        <p className="text-xl font-mono text-white font-light">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 transition-transform group-hover:scale-110" style={{ color }}>
        <IIcon icon={icon} width="20" />
      </div>
    </div>
  );
}

function Panel({ title, icon, children, actionLabel }: any) {
  return (
    <section className="bg-[#0d0d0d] border border-white/5 rounded-xl p-6 space-y-6 hover:border-white/10 transition-colors mb-5 relative overflow-hidden">
      {/* Decorative gradient flare */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex items-center justify-between border-b border-white/5 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <IIcon icon={icon} width="18" className="text-[#D4AF37]" />
          <h3 className="text-[11px] uppercase tracking-[0.15em] font-semibold text-white/90">{title}</h3>
        </div>
        {actionLabel && (
          <button className="text-[10px] uppercase tracking-widest text-[#D4AF37] hover:text-[#e4c256] transition-colors">
            {actionLabel}
          </button>
        )}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

function DetailRow({ label, value, sub, verified }: any) {
  return (
    <div className="flex flex-col gap-1.5 pb-3">
      <p className="text-[10px] uppercase tracking-widest text-neutral-500">{label}</p>
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white/90">{value}</p>
          {verified && (
            <IIcon icon="solar:verified-check-bold" width="14" className="text-emerald-400" />
          )}
        </div>
        {sub && <span className="text-[10px] text-neutral-500">{sub}</span>}
      </div>
    </div>
  );
}

export default function MyProfile({ user, onSignInClick }: MyProfileProps) {
  if (!user) {
    return (
      <AccountLayout user={user} onSignInClick={onSignInClick} title="My Profile">
        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl bg-[#0d0d0d]">
          <IIcon icon="solar:user-circle-linear" width="48" className="mx-auto mb-4 text-neutral-600" />
          <h2 className="font-semibold text-white mb-2 tracking-wide">Sign in to view your profile</h2>
          <p className="text-sm text-neutral-500 mb-6">You need to be logged in to manage your account and settings.</p>
          <button
            onClick={onSignInClick}
            className="px-8 py-3 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-bold hover:bg-[#ebd074] transition-colors rounded-sm"
          >
            Sign In Now
          </button>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="My Profile">
      <div className="space-y-6">
        
        {/* ── 1. Profile Context Card ── */}
        <section className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-xl p-8 relative overflow-hidden">
          {/* Subtle background monogram */}
          <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none transform translate-x-1/4 -translate-y-1/4">
            <IIcon icon="solar:crown-bold" width="240" />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37]/30 flex items-center justify-center overflow-hidden text-[#D4AF37] group-hover:border-[#D4AF37]/60 transition-colors">
                <IIcon icon="solar:user-rounded-bold" width="64" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <IIcon icon="solar:camera-linear" width="14" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-2xl font-[300] tracking-wide text-white">
                  {user.user_metadata?.full_name || 'Guest User'}
                </h2>
                <p className="text-sm mt-1 text-neutral-400 font-mono">{user.email}</p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-[#D4AF37]">
                  <IIcon icon="solar:shield-check-bold" width="14" />
                  Verified Bidder
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-neutral-400">
                  <IIcon icon="solar:calendar-linear" width="12" />
                  Member since 2024
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-neutral-400">
                  <IIcon icon="solar:map-point-linear" width="12" />
                  {user.user_metadata?.country || 'Global'}
                </div>
              </div>
            </div>

            <button className="px-6 py-2.5 border border-white/20 rounded-sm text-[10px] uppercase tracking-widest font-semibold hover:bg-white hover:text-black transition-colors self-center md:self-start">
              Edit Profile
            </button>
          </div>
        </section>

        {/* ── 2. KPI Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon="solar:wallet-bold" label="Wallet Balance" value="₹50,000" color="#4ade80" />
          <KpiCard icon="solar:gavel-bold" label="Active Bids" value="3 Live" color="#D4AF37" />
          <KpiCard icon="solar:heart-bold" label="Watchlist" value="12 Items" color="#f43f5e" />
          <KpiCard icon="solar:box-bold" label="Collection" value="4 Won" color="#60a5fa" />
        </div>

        {/* ── 3. Detail Panels (Masonry-like layout via columns) ── */}
        <div className="grid md:grid-cols-2 gap-5 items-start">
          
          {/* Left Column */}
          <div className="space-y-5">
            <Panel title="Personal Details" icon="solar:user-id-bold" actionLabel="Update">
              <div className="space-y-2">
                <DetailRow label="Full Name" value={user.user_metadata?.full_name || '—'} />
                <DetailRow label="Phone Number" value={user.user_metadata?.phone || '—'} verified={user.user_metadata?.phone_verified} />
                <DetailRow label="Email Address" value={user.email} verified={true} />
                <DetailRow label="Date of Birth" value="Not provided" sub="Add to receive birthday drops" />
              </div>
            </Panel>

            <Panel title="Shipping Address" icon="solar:map-bold" actionLabel="Manage">
              <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-white/90 font-semibold bg-white/10 px-2 py-0.5 rounded-sm">Default Home</span>
                  <IIcon icon="solar:pen-linear" width="14" className="text-neutral-500 cursor-pointer hover:text-white" />
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed font-light">
                  {user.user_metadata?.full_name || 'User'}<br/>
                  123 Marine Drive, Seaface Tower<br/>
                  Apt 4B<br/>
                  Mumbai, Maharashtra 400021<br/>
                  India
                </p>
                <p className="text-xs text-neutral-500 mt-3 font-mono">Ph: {user.user_metadata?.phone || '+91 98765 43210'}</p>
              </div>
              <button className="w-full mt-4 py-3 border border-dashed border-white/20 text-[10px] uppercase tracking-widest text-neutral-400 hover:border-white/40 hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2">
                <IIcon icon="solar:add-circle-linear" width="16" />
                Add New Address
              </button>
            </Panel>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <Panel title="Payment Methods" icon="solar:card-bold" actionLabel="Manage">
              <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-lg p-5 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <IIcon icon="logos:visa" width="40" />
                </div>
                <IIcon icon="solar:sim-card-bold" width="32" className="text-[#D4AF37] mb-4 opacity-80" />
                <p className="font-mono text-lg tracking-widest text-white/90 mb-2">•••• •••• •••• 4242</p>
                <div className="flex justify-between items-center text-xs text-neutral-400 font-mono">
                  <span>{user.user_metadata?.full_name?.toUpperCase() || 'USER'}</span>
                  <span>12/28</span>
                </div>
              </div>
              <button className="w-full mt-4 py-3 border border-dashed border-white/20 text-[10px] uppercase tracking-widest text-neutral-400 hover:border-white/40 hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2">
                <IIcon icon="solar:add-circle-linear" width="16" />
                Add Payment Method
              </button>
            </Panel>

            <Panel title="Account Security" icon="solar:lock-keyhole-bold">
              <div className="space-y-2">
                <DetailRow label="Password" value="••••••••••••" sub="Last changed 3 months ago" />
                
                {/* 2FA Toggle Row */}
                <div className="flex items-center justify-between pt-2 pb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Two-Factor Auth</p>
                    <p className="text-sm font-medium text-white/90">Authenticator App</p>
                  </div>
                  <div className="w-10 h-5 bg-green-500/20 rounded-full relative cursor-pointer border border-green-500/50">
                    <div className="w-4 h-4 bg-green-400 rounded-full absolute right-0.5 top-0.5 shadow-md"></div>
                  </div>
                </div>

                <DetailRow label="Connected Accounts" value="Google Signed-In" />
                <DetailRow label="Last Active" value="Today, 14:23 IST" sub="Mumbai, IN (103.45.2.1)" />
              </div>
              <button className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors underline underline-offset-4 mt-2">
                View all security events
              </button>
            </Panel>

            <Panel title="Preferences" icon="solar:settings-bold">
              <div className="space-y-5">
                {[
                  { title: 'Auction Outbid Alerts', desc: 'Get notified immediately if someone outbids you.', active: true },
                  { title: 'Item Recommendations', desc: 'Curated lots based on your watch history.', active: false },
                  { title: 'Platform Newsletter', desc: 'Wregals exclusive events and platform updates.', active: true }
                ].map((pref, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`w-9 h-5 rounded-full relative cursor-pointer flex-shrink-0 mt-0.5 transition-colors border ${pref.active ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50' : 'bg-white/5 border-white/10'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full absolute top-0.5 shadow-md transition-all ${pref.active ? 'right-0.5 bg-[#D4AF37]' : 'left-0.5 bg-neutral-500'}`}></div>
                    </div>
                    <div>
                      <p className="text-sm text-white/90 mb-0.5">{pref.title}</p>
                      <p className="text-[11px] text-neutral-500 leading-snug">{pref.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
