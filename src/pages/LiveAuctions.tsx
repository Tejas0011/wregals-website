// @ts-nocheck
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IIcon from '../components/IIcon';
import LeftSidebar from '../components/LeftSidebar';
import BidModal from '../components/BidModal';
import { LiveAuctionsSkeleton } from '../components/SkeletonScreens';

/* ─── helpers ── */
const pad = (n: number) => String(n).padStart(2, '0');
const fmtSecs = (s: number) =>
 `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
const now = Date.now();
const mins = (n: number) => new Date(now + n * 60 * 1000);
const hrs = (n: number) => new Date(now + n * 60 * 60 * 1000);

const SELLER_IDS: Record<string, string> = {
 'Virat Kohli': 'vk', 'MS Dhoni': 'msd', 'Hardik Pandya': 'hp',
 'Ranveer Singh': 'rs', 'Priyanka Chopra': 'pc', 'Badshah': 'badshah',
 'A.R. Rahman': 'arr', 'Bhuvan Bam': 'bb',
};

/* ─── auction data ── */
const AUCTIONS = [
 {
 id: '1', title: 'Match-Worn 2023 World Cup Jersey — Signed',
 lot: '#0847', provenance: 'Virat Kohli · Authenticated by BCCI',
 category: 'Sports', seller: 'Virat Kohli',
 image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1470&auto=format&fit=crop',
 currentBid: 84000, minIncrement: 1000, bidCount: 23, endsAt: hrs(4), status: 'live',
 secs: 4 * 3600 + 12 * 60 + 39, likes: '1.2K',
 },
 {
 id: '2', title: '2011 World Cup Winning Gloves — Match Worn',
 lot: '#0841', provenance: 'MS Dhoni · Authenticated by BCCI',
 category: 'Sports', seller: 'MS Dhoni',
 image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1470&auto=format&fit=crop',
 currentBid: 240000, minIncrement: 5000, bidCount: 47, endsAt: mins(112), status: 'ending-soon', extended: true,
 secs: 1 * 3600 + 52 * 60 + 14, likes: '3.4K',
 },
 {
 id: '3', title: 'IPL 2023 Match-Used Cricket Bat — Season Signed',
 lot: '#0848', provenance: 'Hardik Pandya · Mumbai Indians',
 category: 'Sports', seller: 'Hardik Pandya',
 image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1473&auto=format&fit=crop',
 currentBid: 118500, minIncrement: 1500, bidCount: 31, endsAt: hrs(3), status: 'reserve-met',
 secs: 3 * 3600 + 55 * 60 + 10, likes: '876',
 },
 {
 id: '4', title: 'Rocky Aur Rani Custom Jacket — Film Set Piece',
 lot: '#0852', provenance: 'Ranveer Singh · Dharma Productions',
 category: 'Cinema', seller: 'Ranveer Singh',
 image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1470&auto=format&fit=crop',
 currentBid: 42000, minIncrement: 1500, bidCount: 12, endsAt: mins(23), status: 'ending-soon',
 secs: 23 * 60 + 7, likes: '512',
 },
 {
 id: '5', title: 'Hand-woven Banarasi Saree — Met Gala Afterparty',
 lot: '#0894', provenance: 'Priyanka Chopra Jonas',
 category: 'Cinema', seller: 'Priyanka Chopra',
 image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1470&auto=format&fit=crop',
 currentBid: 192000, minIncrement: 3000, bidCount: 54, endsAt: hrs(1), status: 'live',
 secs: 1 * 3600 + 5 * 60 + 30, likes: '2.1K',
 },
 {
 id: '6', title: 'Signed Custom Performance Jacket — Sanak Tour',
 lot: '#0872', provenance: 'Badshah · Stage Worn',
 category: 'Musicians & Artists', seller: 'Badshah',
 image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1470&auto=format&fit=crop',
 currentBid: 38900, minIncrement: 1100, bidCount: 19, endsAt: hrs(8), status: 'live',
 secs: 8 * 3600 + 42 * 60 + 10, likes: '743',
 },
];

const FILTER_CATS = ['All', 'Sports', 'Cinema', 'Musicians & Artists'];
const FILTER_STATUS = ['All', 'Live', 'Ending Soon', 'Reserve Met'];
const SORTS = ['Ending Soonest', 'Highest Bid', 'Lowest Bid', 'Most Bids'];

const STATUS_STYLES: Record<string, { dot: string; text: string }> = {
 'live': { dot: 'hh-rdot', text: 'Live' },
 'ending-soon': { dot: 'hh-rdot', text: 'Ending Soon' },
 'reserve-met': { dot: '', text: 'Reserve Met' },
};

function CountdownPill({ endsAt }: { endsAt: Date }) {
 const total = Math.max(0, Math.floor((endsAt.getTime() - Date.now()) / 1000));
 const [secs, setSecs] = useState(total);
 useEffect(() => {
 const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
 return () => clearInterval(id);
 }, []);
 const isUrgent = secs < 3600;
 return (
 <span className={` text-xs tabular-nums font-bold tracking-tight ${isUrgent ? 'text-[var(--hh-amber)]' : 'text-[var(--hh-w1)]'}`}>
 {fmtSecs(secs)}
 </span>
 );
}

interface LiveAuctionsProps {
 user: any;
 walletBalance?: number;
 onSignInClick: () => void;
}

export default function LiveAuctions({ user, walletBalance = 0, onSignInClick }: LiveAuctionsProps) {
 const [category, setCategory] = useState('All');
 const [status, setStatus] = useState('All');
 const [sort, setSort] = useState('Ending Soonest');
 const [bidItem, setBidItem] = useState<(typeof AUCTIONS)[0] | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const t = setTimeout(() => setLoading(false), 1000);
 return () => clearTimeout(t);
 }, []);

 const filtered = useMemo(() => {
 let list = [...AUCTIONS];
 if (category !== 'All') list = list.filter(a => a.category === category);
 if (status !== 'All') {
 const map: Record<string, string[]> = {
 'Live': ['live'], 'Ending Soon': ['ending-soon'], 'Reserve Met': ['reserve-met'],
 };
 list = list.filter(a => map[status]?.includes(a.status));
 }
 if (sort === 'Ending Soonest') list.sort((a, b) => a.endsAt.getTime() - b.endsAt.getTime());
 if (sort === 'Highest Bid') list.sort((a, b) => b.currentBid - a.currentBid);
 if (sort === 'Lowest Bid') list.sort((a, b) => a.currentBid - b.currentBid);
 if (sort === 'Most Bids') list.sort((a, b) => b.bidCount - a.bidCount);
 return list;
 }, [category, status, sort]);

 const liveCount = AUCTIONS.filter(a => a.status !== 'ended').length;

 if (loading) return <LiveAuctionsSkeleton />;

 return (
 <section className="hh-root">
 {/* ─── Use same grid as home page — LHS sidebar + content ─── */}
 <div style={{
 display: 'grid',
 gridTemplateColumns: '270px 1fr',
 maxWidth: '100%',
 padding: 'calc(80px + 28px) 12px 0',
 gap: '0',
 alignItems: 'start',
 }}>
 {/* LHS Sidebar — same as home page */}
 <LeftSidebar />

 {/* Main content area */}
 <div style={{ borderLeft: '1px solid var(--hh-line)', minHeight: '100vh' }}>
 {/* Page header */}
 <div style={{ padding: '16px 28px 20px', borderBottom: '1px solid var(--hh-line)' }}>
 <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
 <div>

 <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--hh-w1)', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: 8 }}>
 <span className="hh-rdot" />
 Live Auctions
 </h1>
 <p style={{ fontSize: 12, color: 'var(--hh-w3)', marginTop: 4 }}>
 <span style={{ color: 'var(--hh-w1)', fontWeight: 600 }}>{liveCount}</span> active lots · Bids updated in real-time
 </p>
 </div>
 </div>
 </div>

 {/* Filter bar */}
 <div style={{
 padding: '12px 28px',
 borderBottom: '1px solid var(--hh-line)',
 display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
 background: 'rgba(12,12,13,.94)', backdropFilter: 'blur(16px)',
 position: 'sticky', top: 80, zIndex: 100,
 }}>
 {/* Category pills */}
 <div style={{ display: 'flex', gap: 4 }}>
 {FILTER_CATS.map(c => (
 <button
 key={c}
 onClick={() => setCategory(c)}
 style={{
 padding: '5px 14px',
 borderRadius: 6,
 fontSize: 12,
 fontWeight: 600,
 border: '1px solid',
 borderColor: category === c ? 'var(--hh-w1)' : 'var(--hh-line)',
 background: category === c ? 'var(--hh-s3)' : 'transparent',
 color: category === c ? 'var(--hh-w1)' : 'var(--hh-w3)',
 cursor: 'pointer', transition: 'all .14s',
 }}
 >{c}</button>
 ))}
 </div>

 {/* Status pills */}
 <div style={{ height: 18, width: 1, background: 'var(--hh-line)' }} />
 <div style={{ display: 'flex', gap: 4 }}>
 {FILTER_STATUS.map(s => (
 <button
 key={s}
 onClick={() => setStatus(s)}
 style={{
 padding: '5px 14px',
 borderRadius: 6,
 fontSize: 12,
 fontWeight: 600,
 border: '1px solid',
 borderColor: status === s ? 'var(--hh-w1)' : 'var(--hh-line)',
 background: status === s ? 'var(--hh-s3)' : 'transparent',
 color: status === s ? 'var(--hh-w1)' : 'var(--hh-w3)',
 cursor: 'pointer', transition: 'all .14s',
 }}
 >{s}</button>
 ))}
 </div>

 {/* Sort */}
 <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
 <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--hh-w4)' }}>Sort:</span>
 <select
 value={sort}
 onChange={e => setSort(e.target.value)}
 style={{
 background: 'var(--hh-s2)', border: '1px solid var(--hh-line)',
 color: 'var(--hh-w2)', fontSize: 12, padding: '5px 10px',
 borderRadius: 6, cursor: 'pointer', outline: 'none',
 }}
 >
 {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
 </select>
 </div>
 </div>

 {/* Results count */}
 <div style={{ padding: '14px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <p style={{ fontSize: 11, color: 'var(--hh-w3)' }}>
 <span style={{ color: 'var(--hh-w1)', fontWeight: 600 }}>{filtered.length}</span> lot{filtered.length !== 1 ? 's' : ''}
 {category !== 'All' ? ` in ${category}` : ''}
 </p>
 </div>

 {/* Auction grid — styled as cards */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', padding: '16px 28px' }}>
 {filtered.length === 0 ? (
 <div style={{ padding: '80px 28px', textAlign: 'center' }}>
 <p style={{ color: 'var(--hh-w3)', fontSize: 13 }}>No auctions match your filters.</p>
 <button
 onClick={() => { setCategory('All'); setStatus('All'); }}
 style={{ color: 'var(--hh-w1)', fontSize: 12, marginTop: 12, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}
 >Clear filters</button>
 </div>
 ) : (
 filtered.map(auction => {
 const initials = auction.seller.split(' ').map(w => w[0]).join('').slice(0, 2);
 const statusStyle = STATUS_STYLES[auction.status] || STATUS_STYLES['live'];

 return (
 <div 
 key={auction.id} 
 className="hh-post" 
 onClick={() => setBidItem(auction)}
 style={{ border: '1px solid var(--hh-line)', borderRadius: '12px', paddingBottom: '16px' }}
 >
 {/* Header — seller info */}
 <div className="hh-p-header">
 <div className="hh-p-seller">
 <Link to={`/celebrity/${SELLER_IDS[auction.seller] || 'vk'}`} onClick={e => e.stopPropagation()} className="hh-p-av" style={{ textDecoration: 'none', cursor: 'pointer' }}>
 {initials}
 </Link>
 <div>
 <div className="hh-p-nm-row">
 <Link to={`/celebrity/${SELLER_IDS[auction.seller] || 'vk'}`} onClick={e => e.stopPropagation()} style={{ textDecoration: 'none' }}>
 <span className="hh-p-name" style={{ cursor: 'pointer' }}>{auction.seller}</span>
 </Link>
 <span className="hh-vtick">✓</span>
 </div>
 <div className="hh-p-handle">{auction.provenance}</div>
 </div>
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <div className="hh-p-tag-row" style={{ marginTop: 0 }}>
 {auction.status === 'ending-soon' ? (
 <span className="hh-ptag hh-ptag-soon">
 <span className="hh-rdot" style={{ width: 4, height: 4 }} />
 {statusStyle.text}
 </span>
 ) : auction.status === 'reserve-met' ? (
 <span className="hh-ptag hh-ptag-cert">✓ {statusStyle.text}</span>
 ) : (
 <span className="hh-ptag hh-ptag-live">
 <span className="hh-rdot" style={{ width: 4, height: 4 }} />
 {statusStyle.text}
 </span>
 )}
 <span className="hh-ptag hh-ptag-cat">{auction.category}</span>
 {auction.isCharity && (
 <span className="hh-ptag hh-ptag-charity">♥ Charity</span>
 )}
 </div>
 <button className="hh-p-more" onClick={e => e.stopPropagation()}>···</button>
 </div>
 </div>

 {/* Media placeholder */}
 <div className="hh-p-media">
 <div className="hh-p-media-ph">{initials}</div>
 <div className="hh-p-media-timer" style={auction.status === 'ending-soon' ? { color: 'var(--hh-amber)' } : {}}>
 <CountdownPill endsAt={auction.endsAt} />
 </div>
 <div className="hh-p-media-lot">{auction.lot}</div>
 </div>

 {/* Title */}
 <div className="hh-p-title">{auction.title}</div>

 {/* Bid card */}
 <div className="hh-p-bid">
 <div className="hh-p-bid-data">
 <div className="hh-bdg">
 <div className="hh-bdl">Current Bid</div>
 <div className="hh-bdv">{fmt(auction.currentBid)}</div>
 <div className="hh-bds">{auction.bidCount} bids</div>
 </div>
 <div className="hh-bdg">
 <div className="hh-bdl">Next Bid</div>
 <div className="hh-bdv hh-bdv-muted">{fmt(auction.currentBid + auction.minIncrement)}</div>
 <div className="hh-bds">Dep: {fmt(Math.ceil((auction.currentBid + auction.minIncrement) * 0.1))}</div>
 </div>
 </div>
 <button className="hh-p-bid-btn" onClick={e => { e.stopPropagation(); setBidItem(auction); }}>
 {auction.status === 'ending-soon' ? 'Bid Now' : 'Place Bid'}
 </button>
 </div>

 {/* Actions */}
 <div className="hh-p-actions" onClick={e => e.stopPropagation()}>
 <button className="hh-pact" onClick={(e) => {
 e.stopPropagation();
 e.currentTarget.classList.toggle('liked');
 const svg = e.currentTarget.querySelector('svg');
 if (svg) {
 const isLiked = e.currentTarget.classList.contains('liked');
 svg.setAttribute('fill', isLiked ? '#fff' : 'none');
 svg.setAttribute('stroke', isLiked ? '#fff' : 'currentColor');
 }
 }}>
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ transition: 'fill 0.18s, stroke 0.18s' }}>
 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
 </svg>
 {auction.likes || '1.2K'}
 </button>
 <button className="hh-pact" onClick={e => e.stopPropagation()}>
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
 Share
 </button>
 </div>
 </div>
 );
 })
 )}
 </div>

 {filtered.length > 0 && (
 <div style={{ padding: '32px 28px 64px', textAlign: 'center' }}>
 <button className="hh-rc-show-more" style={{ fontSize: 11 }}>Load More Lots</button>
 </div>
 )}
 </div>
 </div>

 {/* Bid modal */}
 {bidItem && (
 <BidModal
 isOpen={!!bidItem}
 onClose={() => setBidItem(null)}
 item={bidItem}
 user={user}
 walletBalance={walletBalance}
 />
 )}
 </section>
 );
}
