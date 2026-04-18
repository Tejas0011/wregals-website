// @ts-nocheck
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
};

const PAST_BIDS = [
  {
    id: 'p1', title: 'Ranveer Singh Film Jacket', auction: 'Ranveer Singh', myBid: 38000, status: 'Lost',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e', closedAt: 'Mar 12, 2025',
    finalPrice: 42000, category: 'Cinema', seller: 'Ranveer Singh', lot: '#0852',
  },
  {
    id: 'p2', title: 'Priyanka Saree Collection', auction: 'Priyanka Chopra', myBid: 192000, status: 'Won',
    image: null, closedAt: 'Feb 28, 2025',
    finalPrice: 192000, category: 'Fashion', seller: 'Priyanka Chopra', lot: '#0834',
  },
];

const BIDS = [
  {
    id: '1', title: 'Match-Worn 2023 World Cup Jersey', auction: 'Virat Kohli', myBid: 85000, currentHigh: 95000, status: 'Outbid',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1473&auto=format&fit=crop',
    currentBid: 95000, minIncrement: 1000, bidCount: 24, endsAt: hrs(4), provenance: 'Virat Kohli · Authenticated by BCCI', category: 'Sports', seller: 'Virat Kohli', lot: '#0847',
  },
  {
    id: '2', title: 'Vintage Cricket Bat (1983)', auction: 'MS Dhoni', myBid: 42000, currentHigh: 42000, status: 'Winning',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1470&auto=format&fit=crop',
    currentBid: 42000, minIncrement: 1500, bidCount: 12, endsAt: hrs(2), provenance: 'MS Dhoni · Verified Classic', category: 'Sports', seller: 'MS Dhoni', lot: '#0842',
  },
];

export default function MyBids({ user, walletBalance = 0, onSignInClick }: MyBidsProps) {
  const [bidItem, setBidItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeBids, setActiveBids] = useState<any[]>(BIDS);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    const fetchBids = () => {
      const userBids = JSON.parse(localStorage.getItem('dummyBids') || '[]');
      const latestBidsMap = new Map();
      userBids.forEach((b: any) => {
        if (!latestBidsMap.has(b.itemId) || latestBidsMap.get(b.itemId).amt < b.amt) {
          latestBidsMap.set(b.itemId, b);
        }
      });
      const mapped = Array.from(latestBidsMap.values()).map((b: any) => ({
        id: b.id,
        title: b.itemData?.title || 'Unknown Item',
        auction: b.itemData?.seller || 'Auction',
        myBid: b.amt,
        currentHigh: b.amt,
        status: 'Winning',
        image: b.itemData?.image || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e',
        currentBid: b.amt,
        minIncrement: b.itemData?.minIncrement || 1000,
        bidCount: (b.itemData?.bidCount || 0) + 1,
        endsAt: b.itemData?.endsAt ? new Date(b.itemData.endsAt) : hrs(2),
        provenance: b.itemData?.provenance || 'Wregals Verified',
        category: b.itemData?.category || 'Collectible',
        seller: b.itemData?.seller || 'Anonymous',
        lot: b.itemData?.lot || '#0000',
        isFromStorage: true,
      }));
      setActiveBids([...mapped, ...BIDS]);
    };
    fetchBids();
    const interval = setInterval(fetchBids, 1500);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  if (loading) return <MyBidsSkeleton />;

  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="My Bids">
      <div className="space-y-5">
        {/* Tabs */}
        <div className="flex gap-5 border-b" style={{ borderColor: 'var(--hh-line)' }}>
          <button
            onClick={() => setActiveTab('active')}
            className={`text-[10px] font-semibold tracking-wide pb-3 px-1 transition-colors border-b-2 ${activeTab === 'active' ? 'text-white border-white' : 'border-transparent hover:text-white'}`}
            style={{ color: activeTab === 'active' ? undefined : 'var(--hh-w3)' }}
          >
            Active ({activeBids.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`text-[10px] font-semibold tracking-wide pb-3 px-1 transition-colors border-b-2 ${activeTab === 'past' ? 'text-white border-white' : 'border-transparent hover:text-white'}`}
            style={{ color: activeTab === 'past' ? undefined : 'var(--hh-w3)' }}
          >
            Past ({PAST_BIDS.length})
          </button>
        </div>

        {/* Active Bids Grid */}
        {activeTab === 'active' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {activeBids.map((bid, i) => {
              const initials = (bid.auction || 'A').split(' ').map((w: string) => w[0]).join('').slice(0, 2);
              const isWinning = bid.status === 'Winning';
              return (
                <div key={i} className="hh-post" style={{ border: '1px solid var(--hh-line)', borderRadius: '12px', paddingBottom: '16px' }}>
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
                        <span className={`hh-ptag ${isWinning ? 'hh-ptag-cert' : 'hh-ptag-live'}`}>
                          {isWinning ? '✓ Winning' : 'Outbid'}
                        </span>
                        <span className="hh-ptag hh-ptag-cat">{bid.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="hh-p-media">
                    <div className="hh-p-media-ph">{initials}</div>
                    <div className="hh-p-media-timer">
                      <span className="text-xs tabular-nums font-bold tracking-tight text-[var(--hh-w1)]">
                        {Math.floor((bid.endsAt.getTime() - Date.now()) / 1000 / 3600)}h {Math.floor(((bid.endsAt.getTime() - Date.now()) / 1000 % 3600) / 60)}m left
                      </span>
                    </div>
                    <div className="hh-p-media-lot">{bid.lot}</div>
                  </div>

                  <div className="hh-p-title">{bid.title}</div>

                  <div className="hh-p-bid">
                    <div className="hh-p-bid-data">
                      <div className="hh-bdg">
                        <div className="hh-bdl">Your Bid</div>
                        <div className="hh-bdv">{fmt(bid.myBid)}</div>
                        <div className="hh-bds">{bid.bidCount} total bids</div>
                      </div>
                      <div className="hh-bdg">
                        <div className="hh-bdl">Current High</div>
                        <div className="hh-bdv hh-bdv-muted">{fmt(bid.currentHigh)}</div>
                        <div className="hh-bds">Dep: {fmt(Math.ceil((bid.currentHigh + bid.minIncrement) * 0.1))}</div>
                      </div>
                    </div>
                    <button className="hh-p-bid-btn" onClick={e => { e.stopPropagation(); setBidItem(bid); }}>
                      {isWinning ? 'Defend Lead' : 'Raise Bid'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Past Bids */}
        {activeTab === 'past' && (
          <div className="space-y-3">
            {PAST_BIDS.map((bid) => (
              <div
                key={bid.id}
                className="border rounded-xl p-5 flex items-center gap-5"
                style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ color: 'var(--hh-w3)' }}>
                  {bid.seller.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--hh-w1)' }}>{bid.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--hh-w3)' }}>Your bid: {fmt(bid.myBid)} · Closed {bid.closedAt}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${bid.status === 'Won' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}>
                    {bid.status}
                  </span>
                  {bid.status === 'Won' && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--hh-w3)' }}>Final: {fmt(bid.finalPrice)}</p>
                  )}
                  {bid.status === 'Lost' && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--hh-w3)' }}>Sold for: {fmt(bid.finalPrice)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {bidItem && (
        <BidModal isOpen={!!bidItem} onClose={() => setBidItem(null)} item={bidItem} user={user} walletBalance={walletBalance} />
      )}
    </AccountLayout>
  );
}
