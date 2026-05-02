// @ts-nocheck
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';
import ShareSheet from '../components/ShareSheet';
import { supabase } from '../lib/supabase';

interface MyProfileProps {
  user: any;
  onSignInClick: () => void;
}

const DUMMY_BIDS = [
  { id: 'b1', title: 'Match-Worn 2023 World Cup Jersey - Signed', lot: '#0847', seller: 'Virat Kohli', sellerInitials: 'VK', sellerBg: '#1e3a8a', myBid: 86000, currentBid: 92000, status: 'outbid', bidCount: 31 },
  { id: 'b2', title: 'Cartier Diamond Necklace - Cannes 2018', lot: '#CRT-DP18', seller: 'Deepika Padukone', sellerInitials: 'DP', sellerBg: '#9f1239', myBid: 890000, currentBid: 890000, status: 'winning', bidCount: 54 },
  { id: 'b3', title: 'Custom Red Stratocaster Guitar - Studio Sessions', lot: '#0880', seller: 'A.R. Rahman', sellerInitials: 'AR', sellerBg: '#4c1d95', myBid: 560000, currentBid: 580000, status: 'outbid', bidCount: 82 },
  { id: 'b4', title: 'Signed Custom Performance Jacket - Sanak Tour', lot: '#0872', seller: 'Badshah', sellerInitials: 'BD', sellerBg: '#5b21b6', myBid: 42000, currentBid: 42000, status: 'winning', bidCount: 22 },
  { id: 'b5', title: 'IPL 2023 Match-Used Cricket Bat', lot: '#0848', seller: 'Hardik Pandya', sellerInitials: 'HP', sellerBg: '#1e3a8a', myBid: 125000, currentBid: 125000, status: 'live', bidCount: 35 },
];

const DUMMY_WON = [
  { id: 'w1', title: "Singham (2011) Director's Chair", lot: '#FILM-RS01', seller: 'Rohit Shetty', sellerInitials: 'RS', sellerBg: '#881337', finalPrice: 475000, wonDate: '2 weeks ago' },
  { id: 'w2', title: 'Signed Helmet - IPL Final 2023', lot: '#0862', seller: 'MS Dhoni', sellerInitials: 'MS', sellerBg: '#1d4ed8', finalPrice: 112000, wonDate: '1 month ago' },
];

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function MyProfile({ user, onSignInClick }: MyProfileProps) {
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'activity' | 'won'>('activity');
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ walletBalance: 0, activeBids: 0, auctionsWon: 0 });

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchProfile = async () => {
      setLoading(true);
      const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
      if (profile) { setBio(profile.bio || ''); setBioDraft(profile.bio || ''); setStats(s => ({ ...s, walletBalance: profile.wallet_balance || 0 })); }
      const { data: activeBidsData } = await supabase.from('bids').select('listing_id, listings!inner(status)').eq('bidder_id', user.id).eq('listings.status', 'live');
      const { data: wonData } = await supabase.from('bids').select('listing_id, listings!inner(status, current_bid)').eq('bidder_id', user.id).eq('listings.status', 'ended');
      const wonCount = wonData ? wonData.filter(b => b.listings?.current_bid === b.amount).length : 0;
      setStats(s => ({ ...s, activeBids: activeBidsData?.length || 0, auctionsWon: wonCount }));
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const saveBio = async () => {
    setBio(bioDraft); setEditingBio(false);
    if (user) await supabase.from('user_profiles').upsert({ id: user.id, bio: bioDraft }, { onConflict: 'id' });
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  if (!user) {
    return (
      <AccountLayout user={user} onSignInClick={onSignInClick} title="My Profile">
        <div style={{ textAlign: 'center', padding: 40 }}>
          <IIcon icon="solar:user-circle-linear" width="48" className="mx-auto mb-4 text-neutral-600" />
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Sign in to view your profile</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>You need to be logged in to manage your account.</p>
          <button onClick={onSignInClick} style={{ padding: '10px 28px', background: '#fff', color: '#000', border: 'none', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', cursor: 'pointer' }}>Sign In Now</button>
        </div>
      </AccountLayout>
    );
  }

  const initials = (user.user_metadata?.full_name || 'U').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const memberYear = user?.created_at ? new Date(user.created_at).getFullYear() : '2024';

  if (loading) {
    return (
      <AccountLayout user={user} onSignInClick={onSignInClick} title="My Profile">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </AccountLayout>
    );
  }

  const TAB_STYLE = (active: boolean) => ({
    padding: '10px 20px', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer',
    color: active ? '#fff' : 'rgba(255,255,255,0.35)', borderBottom: active ? '2px solid #fff' : '2px solid transparent',
    transition: 'color 0.15s, border-color 0.15s', letterSpacing: '-0.1px',
  });

  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="My Profile">
      <div>

          {/* ── Profile Header ─────────────────────────────── */}
          <div style={{ padding: '40px 40px 32px', borderBottom: '1px solid var(--hh-line)', display: 'flex', alignItems: 'flex-start', gap: 28 }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', border: '3px solid rgba(255,255,255,0.08)' }}>
                {initials}
              </div>
              <button onClick={() => alert('Photo upload coming soon!')} style={{ position: 'absolute', bottom: -2, right: -2, width: 26, height: 26, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} title="Change photo">
                <IIcon icon="solar:camera-linear" width="12" className="text-black" />
              </button>
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.4px' }}>
                  {user.user_metadata?.full_name || 'Guest User'}
                </h1>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>

              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 5 }}>{user.email}</p>

              {/* Bio */}
              {editingBio ? (
                <div style={{ marginTop: 12 }}>
                  <textarea value={bioDraft} onChange={e => setBioDraft(e.target.value)} rows={2} maxLength={180} autoFocus style={{ width: '100%', maxWidth: 440, background: '#111', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '8px 12px', fontSize: 13, color: '#fff', outline: 'none', resize: 'none', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <button onClick={saveBio} style={{ padding: '5px 14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 3 }}>Save</button>
                    <button onClick={() => { setBioDraft(bio); setEditingBio(false); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 10, cursor: 'pointer' }}>Cancel</button>
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{bioDraft.length}/180</span>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }} className="group/bio">
                  <p onClick={() => setEditingBio(true)} style={{ fontSize: 13, color: bio ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)', lineHeight: 1.65, maxWidth: 440, cursor: 'pointer', fontStyle: bio ? 'normal' : 'italic' }}>
                    {bio ? `"${bio}"` : 'Add a short bio — click here to write one'}
                  </p>
                  <button onClick={() => setEditingBio(true)} style={{ background: 'none', border: 'none', color: 'rgba(59,130,246,0.6)', cursor: 'pointer', flexShrink: 0, marginTop: 2 }}>
                    <IIcon icon="solar:pen-linear" width="13" />
                  </button>
                </div>
              )}

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 32, marginTop: 18 }}>
                {[
                  { label: 'Following', value: '12' },
                  { label: 'Auctions Won', value: String(stats.auctionsWon || DUMMY_WON.length) },
                  { label: 'Active Bids', value: String(stats.activeBids || DUMMY_BIDS.filter(b => b.status !== 'outbid').length) },
                  { label: 'Member Since', value: String(memberYear) },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 3, fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', color: '#60a5fa' }}>
                  <IIcon icon="solar:shield-check-bold" width="12" /> Verified Bidder
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.4)' }}>
                  <IIcon icon="solar:map-point-linear" width="11" /> {user.user_metadata?.country || 'India'}
                </span>
                {user.user_metadata?.kyc_completed && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 3, fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', color: '#34d399' }}>
                    <IIcon icon="solar:document-text-linear" width="11" /> KYC Verified
                  </span>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 'auto', alignSelf: 'flex-start' }}>
              <Link to="/settings" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#fff', color: '#000', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IIcon icon="solar:pen-linear" width="13" /> Edit Profile
                </button>
              </Link>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShareOpen(s => !s)} style={{ padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.14)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IIcon icon="solar:share-linear" width="13" /> {copied ? 'Copied!' : 'Share'}
                </button>
                {shareOpen && <ShareSheet url={window.location.href} onClose={() => setShareOpen(false)} className="absolute top-12 right-0 z-50" />}
              </div>
            </div>
          </div>

          {/* ── Tabs ───────────────────────────────────────── */}
          <div style={{ borderBottom: '1px solid var(--hh-line)', display: 'flex', paddingLeft: 28 }}>
            <button style={TAB_STYLE(tab === 'activity')} onClick={() => setTab('activity')}>
              Activity
              <span style={{ marginLeft: 6, fontSize: 10, background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '1px 6px', color: 'rgba(255,255,255,0.6)' }}>{DUMMY_BIDS.length}</span>
            </button>
            <button style={TAB_STYLE(tab === 'won')} onClick={() => setTab('won')}>
              Won
              <span style={{ marginLeft: 6, fontSize: 10, background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '1px 6px', color: 'rgba(255,255,255,0.6)' }}>{DUMMY_WON.length}</span>
            </button>
          </div>

          {/* ── Activity Tab ──────────────────────────────── */}
          {tab === 'activity' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, padding: '20px 32px' }}>
              {DUMMY_BIDS.map(bid => (
                <div key={bid.id} style={{ border: '1px solid var(--hh-line)', borderRadius: 12, overflow: 'hidden', background: '#0d0d0d', transition: 'border-color 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--hh-line)')}>
                  {/* Seller header */}
                  <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: bid.sellerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{bid.sellerInitials}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{bid.seller}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Lot {bid.lot}</div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
                      ...(bid.status === 'winning' ? { color: '#34d399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }
                        : bid.status === 'outbid' ? { color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }
                        : { color: '#60a5fa', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' })
                    }}>
                      {bid.status === 'winning' && '● '}
                      {bid.status === 'winning' ? 'Winning' : bid.status === 'outbid' ? 'Outbid' : 'Live'}
                    </span>
                  </div>

                  {/* Media placeholder */}
                  <div style={{ width: '100%', aspectRatio: '16/9', background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: 'rgba(255,255,255,0.06)', letterSpacing: '-1px' }}>
                    {bid.sellerInitials}
                  </div>

                  {/* Title */}
                  <div style={{ padding: '12px 16px 8px', fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{bid.title}</div>

                  {/* Bid info */}
                  <div style={{ padding: '0 16px 14px', display: 'flex', gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Your Bid</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{fmt(bid.myBid)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Current Bid</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: bid.currentBid > bid.myBid ? '#f87171' : '#34d399' }}>{fmt(bid.currentBid)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Bids</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{bid.bidCount}</div>
                    </div>
                  </div>

                  {/* Action */}
                  <div style={{ padding: '0 16px 14px' }}>
                    <Link to="/auctions/live" style={{ textDecoration: 'none' }}>
                      <button style={{ width: '100%', padding: '9px 0', background: bid.status === 'outbid' ? '#fff' : 'rgba(255,255,255,0.06)', color: bid.status === 'outbid' ? '#000' : 'rgba(255,255,255,0.7)', border: bid.status === 'outbid' ? 'none' : '1px solid rgba(255,255,255,0.1)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 6, transition: 'all 0.2s' }}>
                        {bid.status === 'outbid' ? 'Bid Again' : 'View Lot'}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Won Tab ────────────────────────────────────── */}
          {tab === 'won' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, padding: '20px 32px' }}>
              {DUMMY_WON.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '60px 28px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No auctions won yet.</div>
              ) : DUMMY_WON.map(item => (
                <div key={item.id} style={{ border: '1px solid var(--hh-line)', borderRadius: 12, overflow: 'hidden', background: '#0d0d0d', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--hh-line)')}>
                  {/* Seller */}
                  <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: item.sellerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>{item.sellerInitials}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{item.seller}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Lot {item.lot}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                      🏆 Won
                    </span>
                  </div>

                  {/* Media */}
                  <div style={{ width: '100%', aspectRatio: '16/9', background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: 'rgba(255,255,255,0.06)' }}>
                    {item.sellerInitials}
                  </div>

                  <div style={{ padding: '12px 16px 8px', fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{item.title}</div>

                  <div style={{ padding: '0 16px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Final Price</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#fbbf24' }}>{fmt(item.finalPrice)}</div>
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{item.wonDate}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </AccountLayout>
  );
}
