import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';
import BidModal from '../components/BidModal';
import { WatchlistSkeleton } from '../components/SkeletonScreens';

interface WatchlistProps {
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

const WATCHLIST = [
  { 
    id: '1', title: 'Rare Sachin Tendulkar Signed Bat', auction: 'Sachin Tendulkar', currentBid: 125000, timeLeft: '02h 45m', 
    minIncrement: 5000, bidCount: 45, endsAt: hrs(3), provenance: 'Sachin Tendulkar · Authenticated by BCCI', category: 'Sports', seller: 'Sachin Tendulkar', lot: '#0848', status: 'live' 
  },
  { 
    id: '2', title: 'IPL Final Match Ball (2023)', auction: 'MS Dhoni', currentBid: 45000, timeLeft: '04d 12h', 
    minIncrement: 1500, bidCount: 18, endsAt: hrs(108), provenance: 'MS Dhoni · Guaranteed Authentic', category: 'Sports', seller: 'MS Dhoni', lot: '#0849', status: 'live' 
  },
];

export default function Watchlist({ user, walletBalance = 0, onSignInClick }: WatchlistProps) {
  const [bidItem, setBidItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <WatchlistSkeleton />;

  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="Watchlist">
      <div className="space-y-4">
        {WATCHLIST.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {WATCHLIST.map((item, i) => {
              const initials = item.auction.split(' ').map(w => w[0]).join('').slice(0, 2);
              return (
                <div 
                  key={i} 
                  className="hh-post" 
                  style={{ border: '1px solid var(--hh-line)', borderRadius: '12px', paddingBottom: '16px' }}
                >
                  {/* Header — seller info */}
                  <div className="hh-p-header">
                    <div className="hh-p-seller">
                      <Link to={`/celebrity/${SELLER_IDS[item.seller] || 'vk'}`} onClick={e => e.stopPropagation()} className="hh-p-av" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                        {initials}
                      </Link>
                      <div>
                        <div className="hh-p-nm-row">
                          <Link to={`/celebrity/${SELLER_IDS[item.seller] || 'vk'}`} onClick={e => e.stopPropagation()} style={{ textDecoration: 'none' }}>
                            <span className="hh-p-name" style={{ cursor: 'pointer' }}>{item.seller}</span>
                          </Link>
                          <span className="hh-vtick">✓</span>
                        </div>
                        <div className="hh-p-handle">{item.provenance}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="hh-p-tag-row" style={{ marginTop: 0 }}>
                        <span className="hh-ptag hh-ptag-live">
                          <span className="hh-rdot" style={{ width: 4, height: 4 }} />
                          {item.status === 'live' ? 'Live' : item.status}
                        </span>
                        <span className="hh-ptag hh-ptag-cat">{item.category}</span>
                      </div>
                      <button className="hh-p-more" onClick={e => e.stopPropagation()}>···</button>
                    </div>
                  </div>

                  {/* Media placeholder */}
                  <div className="hh-p-media relative">
                    <div className="hh-p-media-ph">{initials}</div>
                    <button className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-[#D4AF37] hover:bg-white hover:text-black transition-all z-10" onClick={e => e.stopPropagation()}>
                      <IIcon icon="lucide:heart" width="16" />
                    </button>
                    <div className="hh-p-media-timer" style={item.status === 'ending-soon' ? { color: 'var(--hh-amber)' } : {}}>
                      <span className="font-mono text-xs tabular-nums font-semibold text-[var(--hh-w1)]">
                        <IIcon icon="lucide:clock" width="11" style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                        {Math.floor((item.endsAt.getTime() - Date.now()) / 1000 / 3600)}h {Math.floor(((item.endsAt.getTime() - Date.now()) / 1000 % 3600) / 60)}m left
                      </span>
                    </div>
                    <div className="hh-p-media-lot">{item.lot}</div>
                  </div>

                  {/* Title */}
                  <div className="hh-p-title">{item.title}</div>

                  {/* Bid card */}
                  <div className="hh-p-bid">
                    <div className="hh-p-bid-data">
                      <div className="hh-bdg">
                        <div className="hh-bdl">Current Bid</div>
                        <div className="hh-bdv">{fmt(item.currentBid)}</div>
                        <div className="hh-bds">{item.bidCount} bids</div>
                      </div>
                      <div className="hh-bdg">
                        <div className="hh-bdl">Next Bid</div>
                        <div className="hh-bdv hh-bdv-muted">{fmt(item.currentBid + item.minIncrement)}</div>
                        <div className="hh-bds">Dep: {fmt(Math.ceil((item.currentBid + item.minIncrement) * 0.1))}</div>
                      </div>
                    </div>
                    <button className="hh-p-bid-btn" onClick={e => { e.stopPropagation(); setBidItem(item); }}>
                      Place Bid
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
        ) : (
          <div
            className="py-20 text-center border border-dashed rounded-xl"
            style={{ borderColor: 'var(--hh-line2)' }}
          >
            <IIcon icon="lucide:heart" width="48" className="mx-auto mb-4" style={{ color: 'var(--hh-w3)' }} />
            <h2 className="font-semibold mb-2" style={{ color: 'var(--hh-w1)' }}>Your watchlist is empty</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--hh-w3)' }}>Find auctions you're interested in and save them here.</p>
            <button className="px-8 py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors rounded-sm">
              Explore Auctions
            </button>
          </div>
        )}
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
