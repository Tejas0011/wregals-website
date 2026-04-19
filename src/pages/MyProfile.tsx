// @ts-nocheck
import { useState, useEffect } from 'react';
import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';
import { MyProfileSkeleton } from '../components/SkeletonScreens';
import { supabase } from '../lib/supabase';
import { useRazorpay } from '../hooks/useRazorpay';

interface MyProfileProps {
  user: any;
  onSignInClick: () => void;
}

/* ── Inline editable field ─────────────────────── */
function EditableRow({ label, value, placeholder, type = 'text', verified }: any) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || '');
  const [saved, setSaved] = useState(value || '');

  const save = () => { setSaved(val); setEditing(false); };
  const cancel = () => { setVal(saved); setEditing(false); };

  return (
    <div className="flex flex-col gap-1.5 py-3 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-wide text-neutral-500">{label}</p>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-[10px] text-blue-400/80 hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <IIcon icon="solar:pen-linear" width="12" /> Edit
          </button>
        )}
      </div>
      {editing ? (
        <div className="flex items-center gap-2 mt-1">
          <input
            type={type}
            value={val}
            onChange={e => setVal(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-[#111] border border-white/20 focus:border-white/50 rounded-sm px-3 py-2 text-sm text-white outline-none font-light transition-colors"
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
          />
          <button onClick={save} className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-[10px] uppercase tracking-wider rounded-sm transition-colors">Save</button>
          <button onClick={cancel} className="px-3 py-2 text-[10px] text-neutral-500 hover:text-white transition-colors">✕</button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium ${saved ? 'text-white/90' : 'text-neutral-600 italic'}`}>
            {saved || placeholder || 'n/a'}
          </p>
          {verified && <IIcon icon="solar:verified-check-bold" width="14" className="text-emerald-400" />}
        </div>
      )}
    </div>
  );
}

/* ── Toggle preference row ─────────────────────── */
function ToggleRow({ title, desc, defaultActive }: any) {
  const [active, setActive] = useState(defaultActive);
  return (
    <div className="flex gap-4 items-start">
      <button
        onClick={() => setActive(a => !a)}
        className={`w-9 h-5 rounded-full relative flex-shrink-0 mt-0.5 transition-colors border ${active ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/5 border-white/10'}`}
      >
        <div className={`w-3.5 h-3.5 rounded-full absolute top-0.5 shadow-md transition-all ${active ? 'right-0.5 bg-blue-500' : 'left-0.5 bg-neutral-500'}`} />
      </button>
      <div>
        <p className="text-sm text-white/90 mb-0.5">{title}</p>
        <p className="text-[11px] text-neutral-500 leading-snug">{desc}</p>
      </div>
    </div>
  );
}

/* ── Section panel ─────────────────────────────── */
function Panel({ title, children }: any) {
  return (
    <section className="bg-[#0d0d0d] border border-white/5 rounded-xl p-6 relative overflow-hidden hover:border-white/10 transition-colors flex flex-col">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5 relative z-10">
        <h3 className="text-sm font-semibold text-white/90">{title}</h3>
      </div>
      <div className="relative z-10 flex-1">{children}</div>
    </section>
  );
}

/* ── KPI card ──────────────────────────────────── */
function KpiCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-[#0d0d0d] border border-white/5 p-5 rounded-xl flex items-center justify-between hover:border-white/10 transition-colors group">
      <div>
        <p className="text-[10px] text-neutral-500 tracking-widest uppercase mb-1">{label}</p>
        <p className="text-xl font-semibold tracking-tight text-white">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 transition-transform group-hover:scale-110" style={{ color }}>
        <IIcon icon={icon} width="20" />
      </div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────── */
export default function MyProfile({ user, onSignInClick }: MyProfileProps) {
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingAddress, setAddingAddress] = useState(false);
  const [addingPayment, setAddingPayment] = useState(false);
  const [newUpi, setNewUpi] = useState('');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [fundLoading, setFundLoading] = useState(false);
  const [stats, setStats] = useState({
    walletBalance: 0,
    activeBids: 0,
    auctionsWon: 0,
  });
  const [upiId, setUpiId] = useState('');
  const { openCheckout } = useRazorpay();

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchProfile = async () => {
      setLoading(true);
      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setBio(profile.bio || '');
        setBioDraft(profile.bio || '');
        setUpiId(profile.upi_id || '');
        setStats(s => ({ ...s, walletBalance: profile.wallet_balance || 0 }));
      }

      // Count active bids (bids on live listings)
      const { data: activeBidsData } = await supabase
        .from('bids')
        .select('listing_id, listings!inner(status)')
        .eq('bidder_id', user.id)
        .eq('listings.status', 'live');
      
      // Count auctions won (highest bid on ended listing)
      const { data: wonData } = await supabase
        .from('bids')
        .select('listing_id, listings!inner(status, current_bid)')
        .eq('bidder_id', user.id)
        .eq('listings.status', 'ended');

      const wonCount = wonData ? wonData.filter(b =>
        b.listings?.current_bid === b.amount
      ).length : 0;

      setStats(s => ({
        ...s,
        activeBids: activeBidsData?.length || 0,
        auctionsWon: wonCount,
      }));

      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const saveBio = async () => {
    setBio(bioDraft);
    setEditingBio(false);
    if (user) {
      await supabase.from('user_profiles').upsert({ id: user.id, bio: bioDraft }, { onConflict: 'id' });
    }
  };

  const handleAddFunds = async (amountInRupees: number) => {
    setFundLoading(true);
    try {
      await openCheckout({
        amount: amountInRupees * 100, // Razorpay expects paise
        description: `Add ₹${amountInRupees.toLocaleString('en-IN')} to Wregals Wallet`,
        prefillName: user?.user_metadata?.full_name,
        prefillEmail: user?.email,
        onSuccess: async (response) => {
          // Update wallet balance in Supabase
          const newBalance = stats.walletBalance + amountInRupees;
          await supabase
            .from('user_profiles')
            .upsert({ id: user.id, wallet_balance: newBalance }, { onConflict: 'id' });
          setStats(s => ({ ...s, walletBalance: newBalance }));
          setShowAddFunds(false);
          setCustomAmount('');
        },
        onFailure: (err) => {
          console.error('Payment failed', err);
        },
      });
    } finally {
      setFundLoading(false);
    }
  };

  if (!user) {
    return (
      <AccountLayout user={user} onSignInClick={onSignInClick} title="My Profile">
        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl bg-[#0d0d0d]">
          <IIcon icon="solar:user-circle-linear" width="48" className="mx-auto mb-4 text-neutral-600" />
          <h2 className="font-semibold text-white mb-2 tracking-wide">Sign in to view your profile</h2>
          <p className="text-sm text-neutral-500 mb-6">You need to be logged in to manage your account.</p>
          <button
            onClick={onSignInClick}
            className="px-8 py-3 bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors rounded-sm"
          >
            Sign In Now
          </button>
        </div>
      </AccountLayout>
    );
  }

  const initials = (user.user_metadata?.full_name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <AccountLayout user={user} onSignInClick={onSignInClick} title="My Profile">
        <MyProfileSkeleton />
      </AccountLayout>
    );
  }

  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="My Profile">
      <div className="space-y-5">

        {/* ── Hero Card ── */}
        <section className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-xl p-8 relative overflow-hidden">


          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center overflow-hidden text-white group-hover:border-white/30 transition-colors">
                <span className="text-2xl font-bold tracking-wide">{initials}</span>
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="Change photo">
                <IIcon icon="solar:camera-linear" width="13" />
              </button>
            </div>

            {/* Identity */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h2 className="text-2xl font-[300] tracking-wide text-white">
                  {user.user_metadata?.full_name || 'Guest User'}
                </h2>
                <p className="text-sm mt-0.5 text-neutral-400">{user.email}</p>
              </div>

              {/* Bio */}
              {editingBio ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={bioDraft}
                    onChange={e => setBioDraft(e.target.value)}
                    rows={2}
                    maxLength={180}
                    className="w-full bg-[#111] border border-white/20 focus:border-white/50 rounded-sm px-3 py-2 text-sm text-white outline-none resize-none font-light leading-relaxed"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button onClick={saveBio} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-[10px] uppercase tracking-wider rounded-sm transition-colors">Save</button>
                    <button onClick={() => { setBioDraft(bio); setEditingBio(false); }} className="text-[10px] text-neutral-500 hover:text-white transition-colors">Cancel</button>
                    <span className="ml-auto text-[10px] text-neutral-600">{bioDraft.length}/180</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 group/bio">
                  <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-md">{bio ? `"${bio}"` : <span className="italic text-neutral-600">No bio yet - click to add one</span>}</p>
                  <button onClick={() => setEditingBio(true)} className="opacity-0 group-hover/bio:opacity-100 transition-opacity mt-0.5 text-blue-400/80 hover:text-blue-400">
                    <IIcon icon="solar:pen-linear" width="13" />
                  </button>
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[10px] font-semibold tracking-wide text-blue-400">
                  <IIcon icon="solar:shield-check-bold" width="13" /> Verified Bidder
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[10px] font-semibold tracking-wide text-neutral-400">
                  <IIcon icon="solar:calendar-linear" width="12" /> Member since {user?.created_at ? new Date(user.created_at).getFullYear() : '2024'}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[10px] font-semibold tracking-wide text-neutral-400">
                  <IIcon icon="solar:map-point-linear" width="12" /> {user.user_metadata?.country || 'India'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Wallet - special card with Add Funds */}
          <div className="col-span-2 lg:col-span-1 bg-[#0d0d0d] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors group flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 tracking-widest uppercase mb-1">Wallet Balance</p>
                <p className="text-xl font-semibold tracking-tight text-white">₹{stats.walletBalance.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-blue-400 transition-transform group-hover:scale-110">
                <IIcon icon="solar:wallet-bold" width="20" />
              </div>
            </div>
            <button
              onClick={() => setShowAddFunds(true)}
              className="w-full py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[10px] font-bold tracking-widest uppercase text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <IIcon icon="solar:add-circle-bold" width="12" /> Add Funds
            </button>
          </div>
          <KpiCard icon="solar:hand-money-bold" label="Active Bids" value={`${stats.activeBids} Live`} color="#4ade80" />
          <KpiCard icon="solar:heart-bold" label="Watchlist" value="0" color="#f472b6" />
          <KpiCard icon="solar:box-bold" label="Collection" value={`${stats.auctionsWon} Won`} color="#a78bfa" />
        </div>

        {/* Add Funds Modal */}
        {showAddFunds && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowAddFunds(false)}>
            <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-white">Add Funds to Wallet</h3>
                <button onClick={() => setShowAddFunds(false)} className="text-neutral-500 hover:text-white transition-colors">
                  <IIcon icon="solar:close-circle-linear" width="20" />
                </button>
              </div>
              <p className="text-xs text-neutral-500 mb-4">Select a preset amount or enter a custom value. Funds are available instantly after payment.</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[500, 1000, 2000, 5000, 10000, 25000].map(amt => (
                  <button
                    key={amt}
                    disabled={fundLoading}
                    onClick={() => handleAddFunds(amt)}
                    className="py-2.5 border border-white/10 hover:border-white/30 hover:bg-white/5 text-xs font-semibold text-white transition-colors"
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  placeholder="Custom amount"
                  min="100"
                  className="flex-1 bg-[#0d0d0d] border border-white/10 focus:border-white/30 px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-600"
                />
                <button
                  disabled={fundLoading || !customAmount || Number(customAmount) < 100}
                  onClick={() => handleAddFunds(Number(customAmount))}
                  className="px-4 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider disabled:opacity-40 transition-colors"
                >
                  {fundLoading ? '...' : 'Pay'}
                </button>
              </div>
              <p className="text-[10px] text-neutral-600 mt-3 text-center">Min ₹100 · Secured by Razorpay</p>
            </div>
          </div>
        )}

        {/* ── Detail Panels ── */}
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <Panel title="Personal Details">
              <div>
                <EditableRow label="Full Name" value={user.user_metadata?.full_name} placeholder="Enter your full name" />
                <EditableRow label="Phone Number" value={user.user_metadata?.phone} placeholder="+91 98765 43210" type="tel" verified={user.user_metadata?.phone_verified} />
                <EditableRow label="Email Address" value={user.email} placeholder="Your email" verified={true} />
                <EditableRow label="Date of Birth" value={user.user_metadata?.dob} placeholder="DD / MM / YYYY" type="date" />
              </div>
            </Panel>

            <Panel title="Shipping Address">
              <div className="flex flex-col gap-3 h-full">
                <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-semibold tracking-wide text-white/90 bg-white/10 px-2 py-0.5 rounded-sm">Default Address</span>
                  </div>
                  <div className="space-y-0">
                    <EditableRow label="Address Line 1" value={user.user_metadata?.address_line1 || ''} placeholder="Plot / Building, Street" />
                    <EditableRow label="Address Line 2" value={user.user_metadata?.address_line2 || ''} placeholder="Flat, Floor, Landmark" />
                    <EditableRow label="City / State / PIN" value={user.user_metadata?.city_state_pin || ''} placeholder="City, State, PIN" />
                  </div>
                </div>
                {addingAddress ? (
                  <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4 space-y-2">
                    <p className="text-[10px] font-semibold tracking-wide text-neutral-400 mb-2">New Address</p>
                    <input className="w-full bg-[#111] border border-white/20 focus:border-white/50 rounded-sm px-3 py-2 text-sm text-white outline-none transition-colors" placeholder="Address Line 1" />
                    <input className="w-full bg-[#111] border border-white/20 focus:border-white/50 rounded-sm px-3 py-2 text-sm text-white outline-none transition-colors" placeholder="Address Line 2" />
                    <input className="w-full bg-[#111] border border-white/20 focus:border-white/50 rounded-sm px-3 py-2 text-sm text-white outline-none transition-colors" placeholder="City, State, PIN" />
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setAddingAddress(false)} className="flex-1 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-[10px] uppercase tracking-wider rounded-sm transition-colors">Save</button>
                      <button onClick={() => setAddingAddress(false)} className="px-4 py-2 text-[10px] text-neutral-500 hover:text-white transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingAddress(true)} className="w-full py-3 border border-dashed border-white/20 text-[10px] font-semibold tracking-wide text-neutral-400 hover:border-white/40 hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2 mt-auto">
                    <IIcon icon="solar:add-circle-linear" width="16" /> Add New Address
                  </button>
                )}
              </div>
            </Panel>

            <Panel title="Payment Methods">
              <div className="flex flex-col gap-3 h-full">
                <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-sm bg-[#5F259F]/20 border border-[#5F259F]/30 flex items-center justify-center">
                      <IIcon icon="solar:smartphone-bold" width="13" className="text-[#9b59ff]" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wide text-neutral-400">UPI ID</span>
                  </div>
                  <EditableRow label="Your UPI ID" value={upiId} placeholder="yourname@upi" />
                </div>
                {addingPayment ? (
                  <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4 space-y-2">
                    <p className="text-[10px] font-semibold tracking-wide text-neutral-400 mb-2">New Payment Method</p>
                    <input value={newUpi} onChange={e => setNewUpi(e.target.value)} className="w-full bg-[#111] border border-white/20 focus:border-white/50 rounded-sm px-3 py-2 text-sm text-white outline-none transition-colors" placeholder="UPI ID or Card Number" />
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => { setAddingPayment(false); setNewUpi(''); }} className="flex-1 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-[10px] uppercase tracking-wider rounded-sm transition-colors">Save</button>
                      <button onClick={() => { setAddingPayment(false); setNewUpi(''); }} className="px-4 py-2 text-[10px] text-neutral-500 hover:text-white transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingPayment(true)} className="w-full py-3 border border-dashed border-white/20 text-[10px] font-semibold tracking-wide text-neutral-400 hover:border-white/40 hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2 mt-auto">
                    <IIcon icon="solar:add-circle-linear" width="16" /> Add Payment Method
                  </button>
                )}
              </div>
            </Panel>

            <Panel title="Security & Notifications">
              <div className="flex flex-col gap-3 h-full">
                <div className="space-y-0">
                  <EditableRow label="Password" value="••••••••••••" placeholder="New password" type="password" />
                  <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <div>
                      <p className="text-[10px] font-semibold tracking-wide text-neutral-500 mb-1">Two-Factor Auth</p>
                      <p className="text-sm font-medium text-white/90">Authenticator App</p>
                    </div>
                    <div className="w-10 h-5 bg-green-500/20 rounded-full relative cursor-pointer border border-green-500/50">
                      <div className="w-4 h-4 bg-green-400 rounded-full absolute right-0.5 top-0.5 shadow-md" />
                    </div>
                  </div>
                  <EditableRow label="Connected Account" value="Google Signed-In" placeholder="not set" />
                  <EditableRow label="Last Active" value="Today, 14:23 IST" placeholder="not set" />
                </div>
                <button className="text-[10px] font-semibold tracking-wide text-neutral-400 hover:text-white transition-colors underline underline-offset-4">View all security events</button>
                <div className="border-t border-white/5 pt-3 space-y-3 flex-1">
                  <p className="text-[10px] font-semibold tracking-widest text-neutral-500 uppercase">Notification Preferences</p>
                  <ToggleRow title="Auction Outbid Alerts" desc="Get notified immediately if someone outbids you." defaultActive={true} />
                  <ToggleRow title="Winning Confirmation" desc="Receive a summary when you win an auction." defaultActive={true} />
                  <ToggleRow title="Item Recommendations" desc="Curated lots based on your watch history." defaultActive={false} />
                  <ToggleRow title="Platform Newsletter" desc="Wregals exclusive events and platform updates." defaultActive={true} />
                </div>
              </div>
            </Panel>
        </div>

      </div>
    </AccountLayout>
  );
}
