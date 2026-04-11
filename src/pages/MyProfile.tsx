// @ts-nocheck
import { useState, useEffect } from 'react';
import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';
import { MyProfileSkeleton } from '../components/SkeletonScreens';

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
 {saved || placeholder || '—'}
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
function Panel({ title, icon, children }: any) {
 return (
 <section className="bg-[#0d0d0d] border border-white/5 rounded-xl p-6 relative overflow-hidden hover:border-white/10 transition-colors">
 <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5 relative z-10">
 <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
 {title}
 </h3>
 </div>
 <div className="relative z-10">{children}</div>
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

/* ── Main ──────────────────────────────────────── */
export default function MyProfile({ user, onSignInClick }: MyProfileProps) {
 const [bio, setBio] = useState('Passionate collector of authentic celebrity memorabilia and rare sporting artefacts. Always hunting for the next great find. 🏆');
 const [editingBio, setEditingBio] = useState(false);
 const [bioDraft, setBioDraft] = useState(bio);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const t = setTimeout(() => setLoading(false), 1000);
 return () => clearTimeout(t);
 }, []);

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
 <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none translate-x-1/4 -translate-y-1/4">
 <IIcon icon="solar:crown-bold" width="220" />
 </div>

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

 {/* Bio / Thoughts */}
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
 <button onClick={() => { setBio(bioDraft); setEditingBio(false); }} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-[10px] uppercase tracking-wider rounded-sm transition-colors">Save</button>
 <button onClick={() => { setBioDraft(bio); setEditingBio(false); }} className="text-[10px] text-neutral-500 hover:text-white transition-colors">Cancel</button>
 <span className="ml-auto text-[10px] text-neutral-600">{bioDraft.length}/180</span>
 </div>
 </div>
 ) : (
 <div className="flex items-start gap-2 group/bio">
 <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-md">"{bio}"</p>
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
 <IIcon icon="solar:calendar-linear" width="12" /> Member since 2024
 </div>
 <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[10px] font-semibold tracking-wide text-neutral-400">
 <IIcon icon="solar:map-point-linear" width="12" /> {user.user_metadata?.country || 'India'}
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* ── KPI Grid ── */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 <KpiCard icon="solar:wallet-bold" label="Wallet Balance" value="₹50,000" color="#3b82f6" />
 <KpiCard icon="solar:gavel-bold" label="Active Bids" value="3 Live" color="#4ade80" />
 <KpiCard icon="solar:heart-bold" label="Watchlist" value="12 Items" color="#f472b6" />
 <KpiCard icon="solar:box-bold" label="Collection" value="4 Won" color="#a78bfa" />
 </div>

 {/* ── Detail Panels ── */}
 <div className="grid md:grid-cols-2 gap-5 items-start">

 {/* Left */}
 <div className="space-y-5">
 <Panel title="Personal Details" icon="solar:user-id-bold">
 <div>
 <EditableRow label="Full Name" value={user.user_metadata?.full_name} placeholder="Enter your full name" />
 <EditableRow label="Phone Number" value={user.user_metadata?.phone} placeholder="+91 98765 43210" type="tel" verified={user.user_metadata?.phone_verified} />
 <EditableRow label="Email Address" value={user.email} placeholder="Your email" verified={true} />
 <EditableRow label="Date of Birth" value={user.user_metadata?.dob} placeholder="DD / MM / YYYY" type="date" />
 </div>
 </Panel>

 <Panel title="Shipping Address" icon="solar:map-bold">
 <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 mb-4">
 <div className="flex justify-between items-start mb-3">
 <span className="text-[10px] font-semibold tracking-wide text-white/90 font-semibold bg-white/10 px-2 py-0.5 rounded-sm">Default Home</span>
 </div>
 <div className="space-y-0">
 <EditableRow label="Address Line 1" value="123 Marine Drive, Seaface Tower" placeholder="Plot / Building, Street" />
 <EditableRow label="Address Line 2" value="Apt 4B" placeholder="Flat, Floor, Landmark" />
 <EditableRow label="City / State / PIN" value="Mumbai, Maharashtra 400021" placeholder="City, State, PIN" />
 </div>
 </div>
 <button className="w-full py-3 border border-dashed border-white/20 text-[10px] font-semibold tracking-wide text-neutral-400 hover:border-white/40 hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2">
 <IIcon icon="solar:add-circle-linear" width="16" /> Add New Address
 </button>
 </Panel>
 </div>

 {/* Right */}
 <div className="space-y-5">
 <Panel title="Payment Methods" icon="solar:card-bold">
 {/* Card */}
 <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-lg p-5 border border-white/10 relative overflow-hidden mb-4">
 <div className="absolute top-0 right-0 p-4 opacity-50">
 <IIcon icon="logos:visa" width="38" />
 </div>
 <IIcon icon="solar:sim-card-bold" width="30" className="text-white/60 mb-4 opacity-80" />
 <p className="text-lg font-medium tracking-widest text-white/90 mb-2">•••• •••• •••• 4242</p>
 <div className="flex justify-between items-center text-xs text-neutral-400">
 <span>{user.user_metadata?.full_name?.toUpperCase() || 'USER'}</span>
 <span>12/28</span>
 </div>
 </div>

 {/* UPI Section */}
 <div className="bg-white/[0.03] border border-white/5 rounded-lg p-4 mb-4">
 <div className="flex items-center gap-2 mb-3">
 <div className="w-6 h-6 rounded-sm bg-[#5F259F]/20 border border-[#5F259F]/30 flex items-center justify-center">
 <IIcon icon="solar:smartphone-bold" width="13" className="text-[#9b59ff]" />
 </div>
 <span className="text-[10px] font-semibold tracking-wide text-neutral-400 font-semibold">UPI ID</span>
 </div>
 <EditableRow label="Your UPI ID" value={user.user_metadata?.upi_id} placeholder="yourname@upi" />
 </div>

 <button className="w-full py-3 border border-dashed border-white/20 text-[10px] font-semibold tracking-wide text-neutral-400 hover:border-white/40 hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2">
 <IIcon icon="solar:add-circle-linear" width="16" /> Add Payment Method
 </button>
 </Panel>

 <Panel title="Account Security" icon="solar:lock-keyhole-bold">
 <div className="space-y-0">
 <EditableRow label="Password" value="••••••••••••" placeholder="New password" type="password" />

 {/* 2FA */}
 <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
 <div>
 <p className="text-[10px] font-semibold tracking-wide text-neutral-500 mb-1">Two-Factor Auth</p>
 <p className="text-sm font-medium text-white/90">Authenticator App</p>
 </div>
 <div className="w-10 h-5 bg-green-500/20 rounded-full relative cursor-pointer border border-green-500/50">
 <div className="w-4 h-4 bg-green-400 rounded-full absolute right-0.5 top-0.5 shadow-md" />
 </div>
 </div>

 <div className="pt-3 space-y-0">
 <EditableRow label="Connected Account" value="Google Signed-In" placeholder="—" />
 <EditableRow label="Last Active" value="Today, 14:23 IST" placeholder="—" />
 </div>
 </div>
 <button className="text-[10px] font-semibold tracking-wide text-neutral-400 hover:text-white transition-colors underline underline-offset-4 mt-3">
 View all security events
 </button>
 </Panel>

 <Panel title="Notification Preferences" icon="solar:bell-bold">
 <div className="space-y-5">
 <ToggleRow title="Auction Outbid Alerts" desc="Get notified immediately if someone outbids you." defaultActive={true} />
 <ToggleRow title="Winning Confirmation" desc="Receive a summary when you win an auction." defaultActive={true} />
 <ToggleRow title="Item Recommendations" desc="Curated lots based on your watch history." defaultActive={false} />
 <ToggleRow title="Platform Newsletter" desc="Wregals exclusive events and platform updates." defaultActive={true} />
 </div>
 </Panel>
 </div>
 </div>
 </div>
 </AccountLayout>
 );
}
