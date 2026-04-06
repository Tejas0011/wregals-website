import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AccountLayout from '../components/AccountLayout';
import BidModal from '../components/BidModal';
import { MyBidsSkeleton } from '../components/SkeletonScreens';

interface MyBidsProps {
  user: any;
  walletBalance?: number;
  onSignInClick: () => void;
}

const hrs = (n: number) => new Date(Date.now() + n * 60 * 60 * 1000);
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

const SELLER_IDS: Record<string, string> = {
  'Virat Kohli': 'vk', 'MS Dhoni': 'msd', 'Hardik Pandya': 'hp',
  'Ranveer Singh': 'rs', 'Priyanka Chopra': 'pc', 'Badshah': 'badshah',
  'A.R. Rahman': 'arr', 'Bhuvan Bam': 'bb',
};

const BIDS = [
  { 
    id: '1', title: 'Match-Worn 2023 World Cup Jersey', auction: 'Virat Kohli', myBid: 85000, currentHigh: 95000, status: 'Outbid', 
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1473&auto=format&fit=crop',
    currentBid: 95000, minIncrement: 1000, bidCount: 24, endsAt: hrs(4), provenance: 'Virat Kohli · Authenticated by BCCI', category: 'Sports', seller: 'Virat Kohli', lot: '#0847' 
  },
  { 
    id: '2', title: 'Vintage Cricket Bat (1983)', auction: 'MS Dhoni', myBid: 42000, currentHigh: 42000, status: 'Winning', 
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1470&auto=format&fit=crop',
    currentBid: 42000, minIncrement: 1500, bidCount: 12, endsAt: hrs(2), provenance: 'MS Dhoni · Verified Classic', category: 'Sports', seller: 'MS Dhoni', lot: '#0842'
  },
];

export default function MyBids({ user, walletBalance = 0, onSignInClick }: MyBidsProps) {
  const [bidItem, setBidItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <MyBidsSkeleton />;

  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="My Bids">
      <div className="space-y-5">
        {/* Tabs */}
        <div className="flex gap-5 border-b pb-0" style={{ borderColor: 'var(--hh-line)' }}>
          <button className="text-[10px] uppercase tracking-widest text-white font-bold border-b-2 border-white pb-3 px-1">Active Bids (2)</button>
          <button className="text-[10px] uppercase tracking-widest font-bold pb-3 px-1 hover:text-white transition-colors" style={{ color: 'var(--hh-w3)' }}>Past Bids</button>
        </div>

        {/* Auction grid — styled as cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {BIDS.map((bid, i) => {
            const initials = bid.auction.split(' ').map(w => w[0]).join('').slice(0, 2);
            return (
              <div 
                key={i} 
                className="hh-post" 
                style={{ border: '1px solid var(--hh-line)', borderRadius: '12px', paddingBottom: '16px' }}
              >
                {/* Header — seller info */}
                <div className="hh-p-header">
                  <div className="hh-p-seller">
                    <Link to={`/celebrity/${SELLER_IDS[bid.seller] || 'vk'}`} onClick={e => e.stopPropagation()} className="hh-p-av" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                      {initials}
                    </Link>
                    <div>
                      <div className="hh-p-nm-row">
                        <Link to={`/celebrity/${SELLER_IDS[bid.seller] || 'vk'}`} onClick={e => e.stopPropagation()} style={{ textDecoration: 'none' }}>
                          <span className="hh-p-name" style={{ cursor: 'pointer' }}>{bid.seller}</span>
                        </Link>
                        <span className="hh-vtick">✓</span>
                      </div>
                      <div className="hh-p-handle">{bid.provenance}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="hh-p-tag-row" style={{ marginTop: 0 }}>
                      <span className={`hh-ptag ${bid.status === 'Winning' ? 'hh-ptag-cert' : 'hh-ptag-live'}`}>
                        {bid.status === 'Winning' ? '✓ ' : <span className="hh-rdot" style={{ width: 4, height: 4 }} /> }
                        {bid.status}
                      </span>
                      <span className="hh-ptag hh-ptag-cat">{bid.category}</span>
                    </div>
                    <button className="hh-p-more" onClick={e => e.stopPropagation()}>···</button>
                  </div>
                </div>

                {/* Media placeholder */}
                <div className="hh-p-media">
                  <div className="hh-p-media-ph">{initials}</div>
                  <div className="hh-p-media-timer" style={bid.status === 'ending-soon' ? { color: 'var(--hh-amber)' } : {}}>
                    <span className="font-mono text-xs tabular-nums font-semibold text-[var(--hh-w1)]">
                      {Math.floor((bid.endsAt.getTime() - Date.now()) / 1000 / 3600)}h {Math.floor(((bid.endsAt.getTime() - Date.now()) / 1000 % 3600) / 60)}m left
                    </span>
                  </div>
                  <div className="hh-p-media-lot">{bid.lot}</div>
                </div>

                {/* Title */}
                <div className="hh-p-title">{bid.title}</div>

                {/* Bid card */}
                <div className="hh-p-bid">
                  <div className="hh-p-bid-data">
                    <div className="hh-bdg">
                      <div className="hh-bdl">Your Bid</div>
                      <div className="hh-bdv">{fmt(bid.myBid)}</div>
                      <div className="hh-bds">{bid.bidCount} bids</div>
                    </div>
                    <div className="hh-bdg">
                      <div className="hh-bdl">Current High</div>
                      <div className="hh-bdv hh-bdv-muted">{fmt(bid.currentHigh)}</div>
                      <div className="hh-bds">Dep: {fmt(Math.ceil((bid.currentHigh + bid.minIncrement) * 0.1))}</div>
                    </div>
                  </div>
                  <button className="hh-p-bid-btn" onClick={e => { e.stopPropagation(); setBidItem(bid); }}>
                    Increase Bid
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
                    1.2K
                  </button>
                  <button className="hh-pact" onClick={e => e.stopPropagation()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                    Share
                  </button>
                </div>
              </div>
            );
          })}
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
    </AccountLayout>
  );
}
