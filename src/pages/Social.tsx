// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IIcon from '../components/IIcon';
import ShareSheet from '../components/ShareSheet';
import Logo from '../components/Logo';
import LeftSidebar from '../components/LeftSidebar';

import RightSidebar from '../components/RightSidebar';
import { HomeFeedSkeleton } from '../components/SkeletonScreens';
const POSTS_FYP = [
 {
 id: 'p1', creatorId: 'vk', name: 'Virat Kohli', handle: '@viratkohli', initials: 'VK', role: 'Cricketer', time: '2h',
 text:"The jersey I wore in the 2011 World Cup final is going live on WREGALS next week. This one is personal. More than any trophy, it reminds me of what we built together as a team. Verified provenance, original match tag still intact.",
 image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2005&auto=format&fit=crop',
 auctionCard: { lotTitle: '2011 World Cup Final Match Jersey', lotNum: 'Lot #WC2011-07', bid: '₹32,00,000', time: '6 days', status: 'upcoming' },
 likes: 4812, reshares: 634,
 },
 {
 id: 'p2', creatorId: 'dp', name: 'Deepika Padukone', handle: '@deepikapadukone', initials: 'DP', role: 'Actor & Collector', time: '5h',
 text:"The Cartier necklace I wore to the Cannes premiere in 2018 has been authenticated by Cartier Geneva. Every piece I list has a story - this one carries four years of memory. Opening reserve: ₹85L.",
 image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop',
 auctionCard: { lotTitle: 'Cartier Diamond Necklace - Cannes 2018', lotNum: 'Lot #CRT-DP18', bid: '₹87,50,000', time: '2d 14h', status: 'live' },
 likes: 9231, reshares: 1102,
 },
 {
 id: 'p3', creatorId: 'rs', name: 'Rohit Shetty', handle: '@rohitshetty', initials: 'RS', role: 'Film Director', time: '1d',
 text:"30 years behind the camera. This director's chair from the sets of Singham (2011) sat in my Mumbai office until today. The leather is original, the plaque is hand-engraved. Now it belongs to a collector who truly values cinema.",
 image: null,
 auctionCard: { lotTitle:"Singham (2011) Director's Chair", lotNum: 'Lot #FILM-RS01', bid: '₹4,75,000', time: 'Ended', status: 'sold' },
 likes: 3104, reshares: 289,
 },
 {
 id: 'p4', creatorId: 'vk', name: 'Virat Kohli', handle: '@viratkohli', initials: 'VK', role: 'Cricketer', time: '2d',
 text:"I get asked all the time - why auction instead of donate? Because auction creates a transaction with meaning. The buyer knows the value. The price becomes part of the legacy. That's what WREGALS is built for.",
 image: null, auctionCard: null,
 likes: 6644, reshares: 882,
 },
 {
 id: 'p5', creatorId: 'dp', name: 'Deepika Padukone', handle: '@deepikapadukone', initials: 'DP', role: 'Actor & Collector', time: '3d',
 text:"Behind the scenes from our verification session with the WREGALS provenance team. Every detail - stitching, clasp, hallmark - documented and uploaded to the lot record. This is what authentic looks like.",
 image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1974&auto=format&fit=crop',
 auctionCard: null,
 likes: 5503, reshares: 477,
 },
];

const POSTS_FOLLOWING = POSTS_FYP.filter(p => ['p1', 'p4'].includes(p.id));

/* ─── Auction mini-card ───────────────────────────────────────────────── */
function AuctionCard({ card }) {
 const isLive = card.status === 'live';
 const isSold = card.status === 'sold';
 return (
 <div className="mt-3 border border-white/20 overflow-hidden bg-[#0D0D0D]">
 <div className="h-px bg-gradient-to-r from-[#3b82f6]/50 to-transparent" />
 <div className="px-4 py-3 flex items-center justify-between gap-3">
 <div className="min-w-0 flex-1">
 <div className="flex items-center gap-2 mb-1">
 {isLive && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />}
 <span className={`text-[9px] font-semibold tracking-wide font-semibold ${isLive ? 'text-red-400' : isSold ? 'text-neutral-500' : 'text-blue-400'}`}>
 {isLive ? 'Live' : isSold ? 'Sold' : 'Upcoming'}
 </span>
 <span className="text-[9px] text-neutral-600">{card.lotNum}</span>
 </div>
 <p className="text-sm font-medium text-white truncate mb-1">{card.lotTitle}</p>
 <div className="flex gap-4">
 <div><p className="text-[9px] text-neutral-600 uppercase">{isSold ? 'Final' : 'Bid'}</p><p className="text-xs text-white">{card.bid}</p></div>
 {!isSold && <div><p className="text-[9px] text-neutral-600 uppercase">{isLive ? 'Ends' : 'Opens'}</p><p className="text-xs text-white">{card.time}</p></div>}
 </div>
 </div>
 {!isSold && (
 <Link to={isLive ? '/auctions/live' : '/auctions/upcoming'} className="flex-shrink-0 text-[10px] font-semibold tracking-wide border border-white/40 text-white px-3 py-1.5 hover:bg-white/10 transition-colors rounded-sm whitespace-nowrap">
 View Lot
 </Link>
 )}
 </div>
 </div>
 );
}

/* ─── Post card ───────────────────────────────────────────────────────── */
function PostCard({ post, liked, reshared, shareOpen, isFollowed, onFollow, onLike, onReshare, onShare }) {
 const [lc, setLc] = useState(post.likes);
 const [rc, setRc] = useState(post.reshares);
 const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

 return (
 <article className="flex flex-col gap-3 px-5 py-5 bg-[#0E0E0E] rounded-xl border border-white/10 hover:border-white/20 transition-colors cursor-pointer mb-6 mx-6">
 {/* Header */}
 <div className="flex gap-3">
 <Link to={`/celebrity/${post.creatorId}`} className="flex-shrink-0 w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:opacity-80 transition-opacity" onClick={e => e.stopPropagation()}>
 <span className="text-xs font-bold text-blue-400">{post.initials}</span>
 </Link>

 <div className="flex-1 min-w-0 flex flex-col justify-center">
 {/* Name row */}
 <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
 <Link to={`/celebrity/${post.creatorId}`} className="text-sm font-bold text-white hover:underline" onClick={e => e.stopPropagation()}>{post.name}</Link>
 <IIcon icon="solar:verified-check-bold" width="14" class="text-blue-400" />
 </div>
 <div className="flex items-center gap-1.5">
 <span className="text-xs text-neutral-500">{post.handle}</span>
 <span className="text-neutral-700 text-xs">·</span>
 <span className="text-xs text-neutral-500">{post.time}</span>
 </div>
 </div>
 <div className="flex items-center gap-3">
  <button onClick={(e) => { e.stopPropagation(); onFollow(post.creatorId); }}
  className={`text-[11px] font-bold px-4 py-1.5 border transition-all flex-shrink-0 tracking-wide rounded-full ${isFollowed ? 'border-white/20 text-white hover:border-red-400/50 hover:text-red-400' : 'bg-white text-black hover:bg-neutral-200 border-white'}`}>
  {isFollowed ? 'Following' : 'Follow'}
  </button>
  <button className="text-neutral-500 hover:text-white px-2">···</button>
 </div>
 </div>

 {/* Text */}
 <p className="text-sm text-neutral-200 leading-relaxed mt-2.5 mb-2">{post.text}</p>

 {/* Image */}
 {post.image && (
 <div className="w-full rounded-lg overflow-hidden border border-white/5 bg-[#111] mb-2 mt-2">
 <img src={post.image} alt="" className="w-full h-auto object-contain max-h-[500px]" />
 </div>
 )}

 {/* Auction card */}
 {post.auctionCard && <div className="mt-2 mb-2"><AuctionCard card={post.auctionCard} /></div>}

 {/* Actions */}
 <div className="flex items-center gap-6 mt-3 pt-3 border-t border-white/5">
 {/* Like */}
 <button onClick={(e) => { e.stopPropagation(); setLc(l => liked ? l - 1 : l + 1); onLike(post.id); }}
 className="flex items-center gap-2 text-xs font-bold group transition-colors text-neutral-500 hover:text-white">
 <svg viewBox="0 0 24 24" fill={liked ? '#ffffff' : 'none'} stroke={liked ? '#ffffff' : 'currentColor'} width="18" height="18" style={{ transition: 'fill 0.18s, stroke 0.18s' }}>
 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
 </svg>
 <span>{fmt(lc)}</span>
 </button>

 {/* Share */}
 <div className="relative">
 <button onClick={() => onShare(post.id)}
 className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-sky-400 group transition-colors">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
 <span>Share</span>
 </button>
 {shareOpen === post.id && <ShareSheet url={`https://wregals.com/social/${post.id}`} onClose={() => onShare(null)} className="absolute bottom-10 right-0" />}
 </div>
 </div>
 </article>
 );
}

/* ─── Main ────────────────────────────────────────────────────────────── */
interface SocialProps { user: any; onSignInClick: () => void; }

export default function Social({ user, onSignInClick }: SocialProps) {
 const [tab, setTab] = useState<'foryou' | 'following'>('foryou');
 const [liked, setLiked] = useState<Set<string>>(new Set());
 const [reshared, setReshared] = useState<Set<string>>(new Set());
 const [shareOpen, setShareOpen] = useState<string | null>(null);
 const [followed, setFollowed] = useState<Set<string>>(new Set());
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate();

 useEffect(() => {
   const t = setTimeout(() => setLoading(false), 1200);
   return () => clearTimeout(t);
 }, []);
 const toggleLike = (id: string) => setLiked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
 const toggleReshare = (id: string) => setReshared(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
 const toggleFollow = (id: string) => setFollowed(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
 const toggleShare = (id: string | null) => setShareOpen(p => p === id ? null : id);

 const posts = tab === 'foryou' ? POSTS_FYP : POSTS_FOLLOWING;


  if (loading) return <HomeFeedSkeleton />;

  return (
    <section className="hh-root">
      {/* ─── 3-COLUMN LAYOUT ─────────────────────── */}
      <div className="hh-layout">
        {/* ── LEFT SIDEBAR ── */}
        <LeftSidebar />

        {/* ── CENTER FEED ── */}
        <div className="hh-feed">
  {/* Sticky header */}
  <div className="sticky top-[120px] z-30 bg-[#111111]/90 backdrop-blur-md mb-6 rounded-xl overflow-hidden shadow-lg mx-6 mt-6 border border-white/10">
    <div className="flex">
      {[{ id: 'foryou', label: 'For You' }, { id: 'following', label: 'Following' }].map(t => (
        <button key={t.id} onClick={() => setTab(t.id as any)}
          className={`flex-1 h-14 text-sm font-bold transition-colors relative ${tab === t.id ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>
          {t.label}
          {tab === t.id && <span className="absolute bottom-0 left-8 right-8 h-0.5 bg-white rounded-t-full" />}
        </button>
      ))}
    </div>
  </div>

 {/* Posts */}
 <div>
 {posts.map(post => (
 <PostCard key={post.id} post={post}
 liked={liked.has(post.id)} reshared={reshared.has(post.id)} shareOpen={shareOpen}
 isFollowed={followed.has(post.creatorId)}
 onFollow={toggleFollow}
 onLike={toggleLike} onReshare={toggleReshare} onShare={toggleShare} />
 ))}
 {posts.length === 0 && (
 <div className="flex flex-col items-center justify-center py-24 text-center px-8">
 <IIcon icon="solar:user-plus-linear" width="40" class="text-neutral-700 mb-4" />
 <p className="text-lg font-bold text-white mb-1">Follow creators to see their broadcasts</p>
 <p className="text-sm text-neutral-600">Follow verified creators from the sidebar to build your personalised feed.</p>
 </div>
 )}
 </div>
 
  {/* Footer removed for infinite scroll */}
  </div>

  {/* ── RIGHT SIDEBAR ── */}
  <div className="hh-rsidebar">
    <RightSidebar followed={followed} toggleFollow={toggleFollow} />
  </div>

  </div>
  </section>
  );
}
