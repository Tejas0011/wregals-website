// @ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IIcon from '../components/IIcon';
import LeftSidebar from '../components/LeftSidebar';

// ── helpers ──────────────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, '0');
const fmtSecs = (s: number) =>
  `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

// ── Mock listings (same IDs as SellerDashboard) ───────────────────────────────
const SELLER_LISTINGS: Record<string, any> = {
  s1: {
    id: 's1',
    title: 'Match-Worn 2023 World Cup Jersey — Kohli',
    lot: '#L-001',
    category: 'Sports',
    seller: 'Virat Kohli',
    sellerEmail: 'seller@wregals.com',
    provenance: 'Authenticated by BCCI · Certificate of Authenticity Included',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1470&auto=format&fit=crop',
    currentBid: 350000,
    minIncrement: 5000,
    bidCount: 132,
    status: 'Ended',
    likes: 1240,
    shares: 380,
    description: 'This iconic match-worn jersey was donned during the 2023 ICC World Cup. Signed and authenticated directly by Virat Kohli with a certificate of authenticity issued by the BCCI.',
    secsLeft: 0,
    bids: [
      { user: 'R.M***', amount: 350000, time: '2h ago' },
      { user: 'P.K***', amount: 340000, time: '2h 15m ago' },
      { user: 'A.S***', amount: 325000, time: '3h ago' },
      { user: 'N.V***', amount: 300000, time: '4h ago' },
      { user: 'T.N***', amount: 280000, time: '5h ago' },
    ],
  },
  s2: {
    id: 's2',
    title: 'Match-Worn 2023 World Cup Jersey — Kohli Signed',
    lot: '#L-002',
    category: 'Sports',
    seller: 'Virat Kohli',
    sellerEmail: 'seller@wregals.com',
    provenance: 'Authenticated by BCCI · Direct Signature',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1470&auto=format&fit=crop',
    currentBid: 125000,
    minIncrement: 2000,
    bidCount: 45,
    status: 'Live',
    likes: 820,
    shares: 210,
    description: 'A personally signed match-worn jersey from the 2023 World Cup campaign. Features a dedicated inscription from Virat Kohli alongside official BCCI authentication.',
    secsLeft: 2 * 3600 + 34 * 60 + 12,
    bids: [
      { user: 'S.V***', amount: 125000, time: '5m ago' },
      { user: 'M.K***', amount: 123000, time: '12m ago' },
      { user: 'R.D***', amount: 118000, time: '30m ago' },
      { user: 'A.B***', amount: 112000, time: '1h ago' },
      { user: 'J.P***', amount: 105000, time: '1h 20m ago' },
    ],
  },
  s3: {
    id: 's3',
    title: 'Vintage Boxing Gloves — Ali Era Autographed',
    lot: '#L-003',
    category: 'Sports',
    seller: 'Virat Kohli',
    sellerEmail: 'seller@wregals.com',
    provenance: 'Ali Legend Sports · COA Included',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1470&auto=format&fit=crop',
    currentBid: 280000,
    minIncrement: 5000,
    bidCount: 78,
    status: 'Ended',
    likes: 960,
    shares: 144,
    description: 'An extraordinarily rare pair of vintage boxing gloves from the golden Ali era, authenticated with full provenance documentation.',
    secsLeft: 0,
    bids: [
      { user: 'M.S***', amount: 280000, time: '3h ago' },
      { user: 'R.K***', amount: 270000, time: '3h 30m ago' },
      { user: 'T.M***', amount: 255000, time: '4h ago' },
    ],
  },
  s4: {
    id: 's4',
    title: 'Original Screenplay — "Mughal-e-Azam" (1960)',
    lot: '#L-004',
    category: 'Cinema',
    seller: 'Virat Kohli',
    sellerEmail: 'seller@wregals.com',
    provenance: 'Estate of K. Asif · Film Archives India',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1470&auto=format&fit=crop',
    currentBid: 195000,
    minIncrement: 3000,
    bidCount: 52,
    status: 'Ended',
    likes: 512,
    shares: 98,
    description: 'An original working screenplay from the timeless 1960 classic Mughal-e-Azam, with handwritten notes by director K. Asif. Sourced from the estate with full archival documentation.',
    secsLeft: 0,
    bids: [
      { user: 'H.J***', amount: 195000, time: '1d ago' },
      { user: 'C.V***', amount: 185000, time: '1d ago' },
      { user: 'S.N***', amount: 172000, time: '1d ago' },
    ],
  },
  s5: {
    id: 's5',
    title: 'Signed Guitar — AR Rahman World Tour',
    lot: '#L-005',
    category: 'Music',
    seller: 'Virat Kohli',
    sellerEmail: 'seller@wregals.com',
    provenance: 'AR Rahman Foundation · Stage Used',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1470&auto=format&fit=crop',
    currentBid: 88000,
    minIncrement: 2000,
    bidCount: 34,
    status: 'Ended',
    likes: 743,
    shares: 167,
    description: 'A stage-used guitar personally signed by AR Rahman during his iconic World Tour. Comes with a certificate from the AR Rahman Foundation.',
    secsLeft: 0,
    bids: [
      { user: 'P.R***', amount: 88000, time: '2d ago' },
      { user: 'A.K***', amount: 84000, time: '2d ago' },
      { user: 'V.S***', amount: 79000, time: '2d ago' },
    ],
  },
};

function Countdown({ secs: initial }: { secs: number }) {
  const [secs, setSecs] = useState(initial);
  useEffect(() => {
    if (initial <= 0) return;
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [initial]);
  const urgent = secs < 3600 && secs > 0;
  return (
    <span className={`tabular-nums font-bold text-2xl tracking-tight ${urgent ? 'text-amber-400' : 'text-white'}`}>
      {fmtSecs(secs)}
    </span>
  );
}

interface SellerAuctionPageProps {
  user: any;
}

export default function SellerAuctionPage({ user }: SellerAuctionPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const listing = id ? SELLER_LISTINGS[id] : null;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(listing?.likes ?? 0);
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#0C0C0D] flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-neutral-400 text-sm mb-4">Listing not found.</p>
          <button onClick={() => navigate('/seller/dashboard')} className="text-white text-xs underline underline-offset-4">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  function handleLike() {
    setLiked(l => {
      setLikeCount(c => l ? c - 1 : c + 1);
      return !l;
    });
  }

  function fmtCount(n: number) {
    return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);
  }

  return (
    <section className="hh-root">
      <div style={{
        display: 'grid',
        gridTemplateColumns: '270px 1fr',
        maxWidth: '100%',
        padding: 'calc(80px + 28px) 12px 0',
        gap: '0',
        alignItems: 'start',
      }}>
        <LeftSidebar />

        <div style={{ borderLeft: '1px solid var(--hh-line)', minHeight: '100vh' }}>
          {/* Breadcrumb */}
          <div style={{ padding: '14px 28px', borderBottom: '1px solid var(--hh-line)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="text-neutral-500 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            >
              <IIcon icon="solar:arrow-left-linear" width="14" />
              Dashboard
            </button>
            <span className="text-neutral-700 text-xs">/</span>
            <span className="text-neutral-400 text-xs line-clamp-1">{listing.title}</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5" style={{ borderBottom: '1px solid var(--hh-line)' }}>
            {/* LEFT — Image & Details */}
            <div className="xl:col-span-3" style={{ borderRight: '1px solid var(--hh-line)', padding: '28px' }}>
              {/* Status badge */}
              <div className="flex items-center gap-3 mb-5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded ${listing.status === 'Live' ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-neutral-500'}`}>
                  {listing.status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                  {listing.status}
                </span>
                <span className="text-[10px] text-neutral-600 tracking-widest uppercase">{listing.lot}</span>
                <span className="text-[10px] text-neutral-600 tracking-widest uppercase">{listing.category}</span>
              </div>

              <h1 className="text-xl font-semibold text-white leading-snug mb-3">{listing.title}</h1>
              <p className="text-xs text-neutral-500 mb-6">{listing.provenance}</p>

              {/* Image */}
              <div className="relative rounded-sm overflow-hidden mb-4" style={{ aspectRatio: '16/9', background: '#111' }}>
                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                {listing.status === 'Ended' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 border border-neutral-700 px-3 py-1.5 rounded">Auction Ended</span>
                  </div>
                )}
              </div>

              {/* Likes, Share, Save */}
              <div className="flex items-center gap-1 mb-6 border-b border-white/[0.04] pb-5">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-semibold transition-all ${liked ? 'text-white bg-white/10' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill={liked ? '#fff' : 'none'} stroke="currentColor" strokeWidth="2" style={{ transition: 'fill 0.18s' }}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {fmtCount(likeCount)} Likes
                </button>

                <button
                  onClick={() => setShared(s => !s)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-semibold transition-all ${shared ? 'text-white bg-white/10' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                  {fmtCount(listing.shares + (shared ? 1 : 0))} Shares
                </button>

                <button
                  onClick={() => setSaved(s => !s)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-semibold transition-all ${saved ? 'text-white bg-white/10' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill={saved ? '#fff' : 'none'} stroke="currentColor" strokeWidth="2" style={{ transition: 'fill 0.18s' }}>
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>

              {/* Description */}
              <div className="bg-white/[0.02] border border-white/5 rounded-sm p-5">
                <p className="text-[10px] text-neutral-600 tracking-widest uppercase mb-3 font-semibold">About This Lot</p>
                <p className="text-sm text-neutral-300 font-light leading-relaxed">{listing.description}</p>
              </div>
            </div>

            {/* RIGHT — Bid Info + Feed */}
            <div className="xl:col-span-2 flex flex-col">
              {/* Bid summary */}
              <div style={{ padding: '28px', borderBottom: '1px solid var(--hh-line)' }}>
                {/* Countdown or Ended */}
                {listing.status === 'Live' ? (
                  <div className="mb-6">
                    <p className="text-[10px] text-neutral-600 tracking-widest uppercase mb-1 font-semibold">Time Remaining</p>
                    <Countdown secs={listing.secsLeft} />
                  </div>
                ) : (
                  <div className="mb-6 bg-white/[0.02] border border-white/5 rounded-sm px-4 py-3 inline-block">
                    <p className="text-[10px] text-neutral-500 tracking-widest uppercase font-semibold">Auction Closed</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/[0.02] border border-white/5 rounded-sm p-4">
                    <p className="text-[9px] text-neutral-600 tracking-widest uppercase mb-1">
                      {listing.status === 'Ended' ? 'Winning Bid' : 'Current Bid'}
                    </p>
                    <p className="text-xl font-bold text-white">{fmt(listing.currentBid)}</p>
                    <p className="text-[10px] text-neutral-600 mt-0.5">{listing.bidCount} bids placed</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-sm p-4">
                    <p className="text-[9px] text-neutral-600 tracking-widest uppercase mb-1">
                      {listing.status === 'Ended' ? 'Min. Increment' : 'Next Bid Min.'}
                    </p>
                    <p className="text-xl font-bold text-white">
                      {listing.status === 'Ended' ? fmt(listing.minIncrement) : fmt(listing.currentBid + listing.minIncrement)}
                    </p>
                    <p className="text-[10px] text-neutral-600 mt-0.5">+{fmt(listing.minIncrement)} increment</p>
                  </div>
                </div>

                {listing.status === 'Live' ? (
                  <button className="w-full py-3.5 bg-white text-black text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-neutral-200 transition-colors">
                    Place Bid — {fmt(listing.currentBid + listing.minIncrement)}
                  </button>
                ) : (
                  <div className="w-full rounded-sm border border-white/5 bg-white/[0.02] p-4 text-center">
                    <p className="text-[10px] text-neutral-500 tracking-widest uppercase font-semibold">This auction has ended</p>
                  </div>
                )}
              </div>

              {/* Live Bid Feed */}
              <div style={{ padding: '20px 28px', flex: 1 }}>
                <div className="flex items-center gap-2 mb-4">
                  {listing.status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                  <p className="text-[10px] text-neutral-500 tracking-widest uppercase font-bold">
                    {listing.status === 'Live' ? 'Live Bid Feed' : 'Bid History'}
                  </p>
                </div>

                <div className="space-y-1">
                  {listing.bids.map((bid: any, i: number) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-4 py-3 rounded-sm border transition-colors ${i === 0 && listing.status === 'Ended' ? 'bg-green-500/5 border-green-500/20' : 'bg-white/[0.015] border-white/[0.04] hover:bg-white/[0.03]'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${i === 0 ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-neutral-500'}`}>
                          {i === 0 ? '🥇' : i + 1}
                        </div>
                        <div>
                          <p className="text-xs text-white font-light">{bid.user}</p>
                          <p className="text-[10px] text-neutral-600">{bid.time}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-bold ${i === 0 ? 'text-green-400' : 'text-white'}`}>
                        {fmt(bid.amount)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Seller analytics note */}
                <div className="mt-5 bg-blue-500/5 border border-blue-500/15 rounded-sm px-4 py-3 flex items-start gap-2.5">
                  <IIcon icon="solar:chart-2-linear" width="14" className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Full analytics for this listing are available in your{' '}
                    <button onClick={() => navigate('/seller/dashboard')} className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                      Dashboard
                    </button>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
