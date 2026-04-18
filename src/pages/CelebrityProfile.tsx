// @ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LeftSidebar from '../components/LeftSidebar';
import BidModal from '../components/BidModal';
import { CelebrityProfileSkeleton } from '../components/SkeletonScreens';

// ── Celebrity data ────────────────────────────────────────────
const CELEBRITIES: Record<string, any> = {
  vk: {
    name: 'Virat Kohli', handle: '@virat.kohli',
    initials: 'VK', avatarBg: '#1e3a8a',
    followers: '24.1M', lotsListed: 14, totalBids: 1847,
    bio: 'One of the greatest batsmen of all time, Virat Kohli brings authenticated match-worn gear and personal memorabilia straight to fans through Wregals.',
    posts: [
      { id: 'vkp1', type: 'image', caption: 'World Cup 2023 - what a journey 🏆', likes: 142300, bg: '#1e3a8a' },
      { id: 'vkp2', type: 'video', caption: 'Match-day routine from the dressing room', likes: 98700, bg: '#1e306a' },
      { id: 'vkp3', type: 'image', caption: 'Signed bat for auction - check the link!', likes: 67400, bg: '#172d5c' },
      { id: 'vkp4', type: 'image', caption: 'Training hard for the next series', likes: 54200, bg: '#1e2e50' },
      { id: 'vkp5', type: 'video', caption: 'Behind the scenes - RCB 2022', likes: 43100, bg: '#1c2d4e' },
      { id: 'vkp6', type: 'image', caption: 'Gloves from the 2019 World Cup final', likes: 38900, bg: '#1a2b48' },
    ],
    lots: [
      { id: 'vk1', title: 'Match-Worn 2023 World Cup Jersey - Signed', lot: '#0847', currentBid: 84000, minIncrement: 1000, bidCount: 23, status: 'live' },
      { id: 'vk2', title: 'Signed Training Bat - RCB Season 2022', lot: '#0853', currentBid: 47000, minIncrement: 500, bidCount: 11, status: 'live' },
      { id: 'vk3', title: 'Personal Batting Gloves - Test Series 2023', lot: '#0861', currentBid: 31000, minIncrement: 500, bidCount: 8, status: 'ending-soon' },
    ],
  },
  msd: {
    name: 'MS Dhoni', handle: '@ms.dhoni',
    initials: 'MS', avatarBg: '#1d4ed8',
    followers: '18.7M', lotsListed: 9, totalBids: 2341,
    bio: "MS Dhoni, India's most celebrated captain, auctions rare match-worn equipment and personal memorabilia exclusively through Wregals.",
    posts: [
      { id: 'msdp1', type: 'image', caption: '2011 - a night I will never forget', likes: 201000, bg: '#1d4ed8' },
      { id: 'msdp2', type: 'video', caption: 'Helicopter shot training session', likes: 88200, bg: '#1a44c0' },
      { id: 'msdp3', type: 'image', caption: 'Gloves from the WC final - now on auction', likes: 72100, bg: '#183aa8' },
      { id: 'msdp4', type: 'image', caption: 'CSK forever', likes: 65400, bg: '#163090' },
    ],
    lots: [
      { id: 'msd1', title: '2011 World Cup Winning Gloves - Match Worn', lot: '#0841', currentBid: 240000, minIncrement: 5000, bidCount: 47, status: 'ending-soon' },
      { id: 'msd2', title: 'Signed Helmet - IPL Final 2023', lot: '#0862', currentBid: 95000, minIncrement: 2000, bidCount: 19, status: 'live' },
    ],
  },
  hp: {
    name: 'Hardik Pandya', handle: '@hardik.pandya',
    initials: 'HP', avatarBg: '#1e3a8a',
    followers: '12.2M', lotsListed: 6, totalBids: 892,
    bio: 'Hardik Pandya brings exclusive IPL and international match-used items to collectors through Wregals - authenticated and direct.',
    posts: [
      { id: 'hpp1', type: 'image', caption: 'IPL 2023 - best season yet', likes: 54200, bg: '#1e3a8a' },
      { id: 'hpp2', type: 'video', caption: 'Pre-match warmup at Wankhede', likes: 38100, bg: '#1a3070' },
    ],
    lots: [
      { id: 'hp1', title: 'IPL 2023 Match-Used Cricket Bat - Season Signed', lot: '#0848', currentBid: 118500, minIncrement: 1500, bidCount: 31, status: 'live' },
    ],
  },
  rs: {
    name: 'Ranveer Singh', handle: '@ranveersingh',
    initials: 'RS', avatarBg: '#881337',
    followers: '31.4M', lotsListed: 11, totalBids: 1203,
    bio: 'Ranveer Singh - known for his iconic on-screen style - offers one-of-a-kind film costumes, signed collectibles, and personal fashion pieces.',
    posts: [
      { id: 'rsp1', type: 'image', caption: 'Rocky Aur Rani - behind the scenes', likes: 213000, bg: '#881337' },
      { id: 'rsp2', type: 'video', caption: 'This jacket is now up for auction!', likes: 89000, bg: '#7a1030' },
      { id: 'rsp3', type: 'image', caption: 'Film set vibes with the crew', likes: 64200, bg: '#6b0e28' },
    ],
    lots: [
      { id: 'rs1', title: 'Rocky Aur Rani Custom Jacket - Film Set Piece', lot: '#0852', currentBid: 42000, minIncrement: 1500, bidCount: 12, status: 'ending-soon' },
    ],
  },
  ab: {
    name: 'Alia Bhatt', handle: '@aliaabhatt',
    initials: 'AB', avatarBg: '#9f1239',
    followers: '28.9M', lotsListed: 8, totalBids: 976,
    bio: 'Alia Bhatt shares her most iconic film looks and personal wardrobe pieces with fans through verified Wregals auctions.',
    posts: [
      { id: 'abp1', type: 'image', caption: 'Shooting for the cover - loved every moment', likes: 187000, bg: '#9f1239' },
      { id: 'abp2', type: 'image', caption: 'Ganga - a film I hold closest to heart', likes: 102300, bg: '#8b0f30' },
    ],
    lots: [],
  },
  pc: {
    name: 'Priyanka Chopra', handle: '@priyankachopra',
    initials: 'PC', avatarBg: '#be185d',
    followers: '42.1M', lotsListed: 7, totalBids: 1567,
    bio: 'Global icon Priyanka Chopra Jonas lists exclusive film wardrobe pieces, Met Gala looks, and signed memorabilia through Wregals.',
    posts: [
      { id: 'pcp1', type: 'image', caption: 'Met Gala 2024 - thank you NYC', likes: 341000, bg: '#be185d' },
      { id: 'pcp2', type: 'video', caption: 'This saree has a story - watch to find out', likes: 124000, bg: '#a81652' },
    ],
    lots: [
      { id: 'pc1', title: 'Hand-woven Banarasi Saree - Met Gala Afterparty', lot: '#0894', currentBid: 192000, minIncrement: 3000, bidCount: 54, status: 'live' },
    ],
  },
  amitabh: {
    name: 'Amitabh Bachchan', handle: '@amitabhbachchan',
    initials: 'AB', avatarBg: '#b45309',
    followers: '59.3M', lotsListed: 5, totalBids: 3412,
    bio: 'The legend himself - Amitabh Bachchan shares iconic film props, original scripts, and career memorabilia for devoted collectors.',
    posts: [
      { id: 'amp1', type: 'image', caption: "50 years in cinema - grateful for every frame", likes: 528000, bg: '#b45309' },
      { id: 'amp2', type: 'image', caption: 'Original Don script - now on auction', likes: 213400, bg: '#9a4508' },
    ],
    lots: [
      { id: 'am1', title: 'Original "Don" Movie Script Page - Signed', lot: '#0901', currentBid: 65000, minIncrement: 2000, bidCount: 18, status: 'live' },
    ],
  },
  badshah: {
    name: 'Badshah', handle: '@badboyshah',
    initials: 'BD', avatarBg: '#5b21b6',
    followers: '14.8M', lotsListed: 7, totalBids: 643,
    bio: 'Badshah brings stage-worn jackets, tour collectibles, and signed merch straight to fans and collectors through verified Wregals auctions.',
    posts: [
      { id: 'bdp1', type: 'video', caption: 'Sanak Tour - this jacket was on me the whole night', likes: 98300, bg: '#5b21b6' },
      { id: 'bdp2', type: 'image', caption: 'Studio vibes at 2am', likes: 54100, bg: '#4c1d96' },
    ],
    lots: [
      { id: 'bd1', title: 'Signed Custom Performance Jacket - Sanak Tour', lot: '#0872', currentBid: 38900, minIncrement: 1100, bidCount: 19, status: 'live' },
    ],
  },
  arr: {
    name: 'A.R. Rahman', handle: '@arrahman',
    initials: 'AR', avatarBg: '#4c1d95',
    followers: '22.5M', lotsListed: 4, totalBids: 1124,
    bio: 'Oscar-winning composer A.R. Rahman lists studio instruments, signed scores, and rare performance memorabilia for music lovers.',
    posts: [
      { id: 'arp1', type: 'image', caption: 'This guitar has been with me for 20 years - up for auction', likes: 187200, bg: '#4c1d95' },
      { id: 'arp2', type: 'video', caption: 'Composing at 3am - magic hours', likes: 98700, bg: '#40187e' },
    ],
    lots: [
      { id: 'ar1', title: 'Custom Red Stratocaster Guitar - Studio Sessions', lot: '#0880', currentBid: 550000, minIncrement: 10000, bidCount: 78, status: 'live' },
    ],
  },
  bb: {
    name: 'Bhuvan Bam', handle: '@bhuvan.bam22',
    initials: 'BB', avatarBg: '#065f46',
    followers: '9.7M', lotsListed: 5, totalBids: 532,
    bio: "Bhuvan Bam, India's most-loved YouTuber, lists milestone-moment items and personal collectibles for his dedicated fan community.",
    posts: [
      { id: 'bbp1', type: 'image', caption: '1 million - the beginning of everything', likes: 221000, bg: '#065f46' },
      { id: 'bbp2', type: 'video', caption: 'The golden play button auction is LIVE', likes: 87300, bg: '#054d39' },
    ],
    lots: [
      { id: 'bb1', title: 'First 1M Subscribers Golden Play Button - Signed Custom Shell', lot: '#0921', currentBid: 125000, minIncrement: 3000, bidCount: 45, status: 'ending-soon' },
    ],
  },
  nc: {
    name: 'Neeraj Chopra', handle: '@neeraj____chopra',
    initials: 'NC', avatarBg: '#78350f',
    followers: '7.3M', lotsListed: 3, totalBids: 287,
    bio: 'Olympic gold medalist Neeraj Chopra auctions competition javelins, race bibs, and official Olympics memorabilia through Wregals.',
    posts: [
      { id: 'ncp1', type: 'image', caption: 'Tokyo 2020 - gold for India', likes: 312000, bg: '#78350f' },
    ],
    lots: [],
  },
  pv: {
    name: 'PV Sindhu', handle: '@pvsindhu1',
    initials: 'PV', avatarBg: '#92400e',
    followers: '5.1M', lotsListed: 4, totalBids: 198,
    bio: 'Two-time Olympic medalist PV Sindhu lists her match rackets, signed shuttles, and championship memorabilia through Wregals.',
    posts: [
      { id: 'pvp1', type: 'image', caption: 'Silver at Tokyo - every match a memory', likes: 142000, bg: '#92400e' },
    ],
    lots: [],
  },
};

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
const fmtLikes = (n: number) => n >= 1000 ? (n / 1000).toFixed(0) + 'K' : String(n);

function WatchlistHeart({ lotId, initialLikes = "1.2K" }: { lotId: string, initialLikes?: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      className="hh-pact"
      onClick={e => { e.stopPropagation(); setSaved(s => !s); }}
      style={{ transition: 'color 0.2s' }}
    >
      <svg
        viewBox="0 0 24 24"
        fill={saved ? '#fff' : 'none'}
        stroke={saved ? '#fff' : 'currentColor'}
        style={{ transition: 'fill 0.2s, stroke 0.2s' }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {initialLikes}
    </button>
  );
}

export default function CelebrityProfile() {
  const { id = 'vk' } = useParams();
  const celeb = CELEBRITIES[id] || CELEBRITIES['vk'];

  const [tab, setTab] = useState<'posts' | 'lots'>('posts');
  const [bidItem, setBidItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, [id]);

  const now = Date.now();
  const lotsWithDates = celeb.lots.map((lot: any, i: number) => ({
    ...lot, seller: celeb.name,
    provenance: celeb.handle,
    category: '',
    image: '',
    endsAt: new Date(now + (i + 1) * 3 * 60 * 60 * 1000),
  }));

  const TAB_STYLE = (active: boolean) => ({
    padding: '10px 20px',
    fontSize: 13, fontWeight: 600,
    background: 'none', border: 'none', cursor: 'pointer',
    color: active ? '#fff' : 'rgba(255,255,255,0.35)',
    borderBottom: active ? '2px solid #fff' : '2px solid transparent',
    transition: 'color 0.15s, border-color 0.15s',
    letterSpacing: '-0.1px',
  });

  if (loading) return <CelebrityProfileSkeleton />;

  return (
    <section className="hh-root">
      <div style={{
        display: 'grid',
        gridTemplateColumns: '270px 1fr',
        maxWidth: '100%',
        padding: 'calc(80px + 0px) 12px 0',
        gap: '0',
        alignItems: 'start',
      }}>
        <LeftSidebar />

        <div style={{ borderLeft: '1px solid var(--hh-line)', minHeight: '100vh', paddingBottom: 64 }}>

          {/* ── Profile Header ─────────────────────────────── */}
          <div style={{
            padding: '40px 40px 32px',
            borderBottom: '1px solid var(--hh-line)',
            display: 'flex', alignItems: 'flex-start', gap: 28,
          }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
              background: celeb.avatarBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px',
              border: '3px solid rgba(255,255,255,0.08)',
            }}>
              {celeb.initials}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              {/* Name + tick */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.4px' }}>
                  {celeb.name}
                </h1>
                {/* Simple tick circle */}
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Handle only */}
              <p style={{ fontSize: 12, color: 'var(--hh-w3)', marginTop: 5 }}>
                {celeb.handle}
              </p>

              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 10, lineHeight: 1.65, maxWidth: 540 }}>
                {celeb.bio}
              </p>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 32, marginTop: 18 }}>
                {[
                  { label: 'Followers', value: celeb.followers },
                  { label: 'Lots Listed', value: celeb.lotsListed },
                  { label: 'Total Bids', value: celeb.totalBids.toLocaleString() },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--hh-w4)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button style={{
                padding: '9px 20px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: '#fff', color: '#000', border: 'none', cursor: 'pointer',
              }}>
                Follow
              </button>
              <button style={{
                padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: 'transparent', color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.14)', cursor: 'pointer',
              }}>
                Share
              </button>
            </div>
          </div>

          {/* ── Tabs ───────────────────────────────────────── */}
          <div style={{ borderBottom: '1px solid var(--hh-line)', display: 'flex', paddingLeft: 28 }}>
            <button style={TAB_STYLE(tab === 'posts')} onClick={() => setTab('posts')}>Posts</button>
            <button style={TAB_STYLE(tab === 'lots')} onClick={() => setTab('lots')}>
              Active Lots {celeb.lots.length > 0 && (
                <span style={{
                  marginLeft: 6, fontSize: 10, background: 'rgba(255,255,255,0.12)',
                  borderRadius: 8, padding: '1px 6px', color: 'rgba(255,255,255,0.6)',
                }}>
                  {celeb.lots.length}
                </span>
              )}
            </button>
          </div>

          {/* ── Posts Tab ──────────────────────────────────── */}
          {tab === 'posts' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1,
            }}>
              {celeb.posts.map((post: any) => (
                <div
                  key={post.id}
                  style={{
                    position: 'relative', aspectRatio: '1',
                    background: 'var(--hh-s2)',
                    cursor: 'pointer', overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget.querySelector('.post-overlay') as HTMLElement).style.opacity = '1';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget.querySelector('.post-overlay') as HTMLElement).style.opacity = '0';
                  }}
                >
                  {/* Placeholder gradient */}
                  <div style={{
                    width: '100%', height: '100%',
                    background: `linear-gradient(135deg, #2a2a2a, #141414)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, fontWeight: 800, color: 'rgba(255,255,255,0.15)',
                    letterSpacing: '-1px',
                  }}>
                    {celeb.initials}
                  </div>

                  {/* Video badge */}
                  {post.type === 'video' && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      background: 'rgba(0,0,0,0.6)',
                      borderRadius: 4, padding: '2px 6px',
                      fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.04em',
                    }}>
                      VIDEO
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div
                    className="post-overlay"
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0.55)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'flex-end',
                      padding: '12px',
                      opacity: 0, transition: 'opacity 0.2s',
                    }}
                  >
                    <p style={{
                      fontSize: 11, color: 'rgba(255,255,255,0.85)',
                      textAlign: 'center', lineHeight: 1.45, marginBottom: 8,
                    }}>
                      {post.caption}
                    </p>
                    <div style={{ display: 'flex', gap: 16 }}>
                      {/* Like */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#fff' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {fmtLikes(post.likes)}
                      </div>
                      {/* Share */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#fff', cursor: 'pointer' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                          <polyline points="17 1 21 5 17 9" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <polyline points="7 23 3 19 7 15" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                        Share
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Active Lots Tab ────────────────────────────── */}
          {tab === 'lots' && (
            <div>
              {lotsWithDates.length === 0 ? (
                <div style={{ padding: '60px 28px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                  No active lots at the moment.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, padding: '20px 32px' }}>
                  {lotsWithDates.map((lot: any) => (
                    <div
                      key={lot.id}
                      className="hh-post"
                      onClick={() => setBidItem(lot)}
                      style={{ border: '1px solid var(--hh-line)', borderRadius: 12, paddingBottom: 16, cursor: 'pointer' }}
                    >
                      {/* Seller header */}
                      <div className="hh-p-header">
                        <div className="hh-p-seller">
                          <Link to={`/celebrity/${id}`} onClick={e => e.stopPropagation()} className="hh-p-av" style={{ background: celeb.avatarBg, textDecoration: 'none', cursor: 'pointer' }}>
                            {celeb.initials}
                          </Link>
                          <div>
                            <div className="hh-p-nm-row">
                              <Link to={`/celebrity/${id}`} onClick={e => e.stopPropagation()} style={{ textDecoration: 'none' }}>
                                <span className="hh-p-name" style={{ cursor: 'pointer' }}>{celeb.name}</span>
                              </Link>
                              <span className="hh-vtick">✓</span>
                            </div>
                            <div className="hh-p-handle">{celeb.handle}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="hh-p-tag-row" style={{ marginTop: 0 }}>
                            {lot.status === 'ending-soon' ? (
                              <span className="hh-ptag hh-ptag-soon"><span className="hh-rdot" style={{ width: 4, height: 4 }} />Ending Soon</span>
                            ) : (
                              <span className="hh-ptag hh-ptag-live"><span className="hh-rdot" style={{ width: 4, height: 4 }} />Live</span>
                            )}
                          </div>
                          <button className="hh-p-more" onClick={e => e.stopPropagation()}>···</button>
                        </div>
                      </div>

                      {/* Media */}
                      <div className="hh-p-media">
                        <div className="hh-p-media-ph">{celeb.initials}</div>
                        <div className="hh-p-media-lot">{lot.lot}</div>
                      </div>

                      <div className="hh-p-title">{lot.title}</div>

                      {/* Bid card */}
                      <div className="hh-p-bid">
                        <div className="hh-p-bid-data">
                          <div className="hh-bdg">
                            <div className="hh-bdl">Current Bid</div>
                            <div className="hh-bdv">{fmt(lot.currentBid)}</div>
                            <div className="hh-bds">{lot.bidCount} bids</div>
                          </div>
                          <div className="hh-bdg">
                            <div className="hh-bdl">Next Bid</div>
                            <div className="hh-bdv hh-bdv-muted">{fmt(lot.currentBid + lot.minIncrement)}</div>
                            <div className="hh-bds">Dep: {fmt(Math.ceil((lot.currentBid + lot.minIncrement) * 0.1))}</div>
                          </div>
                        </div>
                        <button className="hh-p-bid-btn" onClick={e => { e.stopPropagation(); setBidItem(lot); }}>
                          {lot.status === 'ending-soon' ? 'Bid Now' : 'Place Bid'}
                        </button>
                      </div>

                      <div className="hh-p-actions" onClick={e => e.stopPropagation()}>
                        <WatchlistHeart lotId={lot.id} />
                        <button className="hh-pact">
                          <svg viewBox="0 0 24 24">
                            <polyline points="17 1 21 5 17 9" />
                            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                            <polyline points="7 23 3 19 7 15" />
                            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                          </svg>
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {bidItem && (
        <BidModal
          isOpen={!!bidItem} onClose={() => setBidItem(null)}
          item={bidItem} user={null} walletBalance={50000}
        />
      )}
    </section>
  );
}
