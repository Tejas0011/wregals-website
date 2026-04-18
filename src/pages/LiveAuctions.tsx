// @ts-nocheck
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import IIcon from '../components/IIcon';
import LeftSidebar from '../components/LeftSidebar';
import BidModal from '../components/BidModal';
import { LiveAuctionsSkeleton } from '../components/SkeletonScreens';
import { supabase } from '../lib/supabase';

/* ─── helpers ── */
const pad = (n: number) => String(n).padStart(2, '0');
const fmtSecs = (s: number) =>
  `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

const FILTER_CATS = ['All', 'sports', 'cinema', 'musicians', 'athletes', 'creators', 'tv-stars', 'comedians', 'fashion', 'entrepreneurs', 'others'];
const FILTER_CATS_DISPLAY: Record<string, string> = {
  'All': 'All', 'sports': 'Sports', 'cinema': 'Cinema', 'musicians': 'Musicians & Artists',
  'athletes': 'Athletes', 'creators': 'Content Creators', 'tv-stars': 'TV & OTT',
  'comedians': 'Comedy', 'fashion': 'Fashion', 'entrepreneurs': 'Entrepreneurs', 'others': 'Others',
};
const FILTER_STATUS = ['All', 'Live', 'Ending Soon'];
const SORTS = ['Ending Soonest', 'Highest Bid', 'Lowest Bid', 'Most Bids'];

function CountdownPill({ endsAt }: { endsAt: string }) {
  const total = Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000));
  const [secs, setSecs] = useState(total);
  useEffect(() => {
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const isUrgent = secs < 3600;
  return (
    <span className={`text-xs tabular-nums font-bold tracking-tight ${isUrgent ? 'text-[var(--hh-amber)]' : 'text-[var(--hh-w1)]'}`}>
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
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('Ending Soonest');
  const [bidItem, setBidItem] = useState<any | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'live')
        .gt('ends_at', new Date().toISOString())
        .order('ends_at', { ascending: true });
      if (!error && data) setAuctions(data);
      setLoading(false);
    };
    fetchAuctions();

    // Realtime subscription for bid updates
    const channel = supabase
      .channel('listings-live')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'listings' }, payload => {
        setAuctions(prev =>
          prev.map(a => a.id === payload.new.id ? { ...a, ...payload.new } : a)
        );
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = useMemo(() => {
    let list = [...auctions];
    if (category !== 'All') list = list.filter(a => a.category === category);
    if (status === 'Ending Soon') {
      list = list.filter(a => {
        const secsLeft = (new Date(a.ends_at).getTime() - Date.now()) / 1000;
        return secsLeft < 3600;
      });
    }
    if (sort === 'Ending Soonest') list.sort((a, b) => new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime());
    if (sort === 'Highest Bid') list.sort((a, b) => b.current_bid - a.current_bid);
    if (sort === 'Lowest Bid') list.sort((a, b) => a.current_bid - b.current_bid);
    if (sort === 'Most Bids') list.sort((a, b) => b.bid_count - a.bid_count);
    return list;
  }, [auctions, category, status, sort]);

  if (loading) return <LiveAuctionsSkeleton />;

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
          {/* Page header */}
          <div style={{ padding: '16px 28px 20px', borderBottom: '1px solid var(--hh-line)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--hh-w1)', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="hh-rdot" />
                  Live Auctions
                </h1>
                <p style={{ fontSize: 12, color: 'var(--hh-w3)', marginTop: 4 }}>
                  <span style={{ color: 'var(--hh-w1)', fontWeight: 600 }}>{auctions.length}</span> active lots · Bids updated in real-time
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
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {FILTER_CATS.filter(c => c === 'All' || auctions.some(a => a.category === c) || c === category).slice(0, 6).map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid',
                    borderColor: category === c ? 'var(--hh-w1)' : 'var(--hh-line)',
                    background: category === c ? 'var(--hh-s3)' : 'transparent',
                    color: category === c ? 'var(--hh-w1)' : 'var(--hh-w3)',
                    cursor: 'pointer', transition: 'all .14s',
                  }}
                >{FILTER_CATS_DISPLAY[c] || c}</button>
              ))}
            </div>

            <div style={{ height: 18, width: 1, background: 'var(--hh-line)' }} />
            <div style={{ display: 'flex', gap: 4 }}>
              {FILTER_STATUS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  style={{
                    padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid',
                    borderColor: status === s ? 'var(--hh-w1)' : 'var(--hh-line)',
                    background: status === s ? 'var(--hh-s3)' : 'transparent',
                    color: status === s ? 'var(--hh-w1)' : 'var(--hh-w3)',
                    cursor: 'pointer', transition: 'all .14s',
                  }}
                >{s}</button>
              ))}
            </div>

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
              {category !== 'All' ? ` in ${FILTER_CATS_DISPLAY[category] || category}` : ''}
            </p>
          </div>

          {/* Auction grid */}
          {filtered.length === 0 ? (
            <div style={{ padding: '80px 28px', textAlign: 'center' }}>
              <IIcon icon="solar:ghost-linear" width="48" style={{ margin: '0 auto 16px', color: 'var(--hh-w4)' }} />
              <p style={{ color: 'var(--hh-w3)', fontSize: 14, marginBottom: 8 }}>No live auctions right now.</p>
              <p style={{ color: 'var(--hh-w4)', fontSize: 12 }}>Check back soon - sellers are listing amazing items.</p>
              {(category !== 'All' || status !== 'All') && (
                <button
                  onClick={() => { setCategory('All'); setStatus('All'); }}
                  style={{ color: 'var(--hh-w1)', fontSize: 12, marginTop: 12, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}
                >Clear filters</button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', padding: '16px 28px' }}>
              {filtered.map(auction => {
                const sellerInitials = (auction.celebrity || auction.seller_id || 'S').slice(0, 2).toUpperCase();
                const secsLeft = Math.max(0, Math.floor((new Date(auction.ends_at).getTime() - Date.now()) / 1000));
                const isEndingSoon = secsLeft < 3600;
                const primaryImage = auction.images?.[0];

                return (
                  <div
                    key={auction.id}
                    className="hh-post"
                    onClick={() => setBidItem(auction)}
                    style={{ border: '1px solid var(--hh-line)', borderRadius: '12px', paddingBottom: '16px' }}
                  >
                    {/* Header */}
                    <div className="hh-p-header">
                      <div className="hh-p-seller">
                        <div className="hh-p-av">{sellerInitials}</div>
                        <div>
                          <div className="hh-p-nm-row">
                            <span className="hh-p-name">{auction.celebrity || 'Seller'}</span>
                            <span className="hh-vtick">✓</span>
                          </div>
                          <div className="hh-p-handle">{auction.category}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="hh-p-tag-row" style={{ marginTop: 0 }}>
                          {isEndingSoon ? (
                            <span className="hh-ptag hh-ptag-soon">
                              <span className="hh-rdot" style={{ width: 4, height: 4 }} />
                              Ending Soon
                            </span>
                          ) : (
                            <span className="hh-ptag hh-ptag-live">
                              <span className="hh-rdot" style={{ width: 4, height: 4 }} />
                              Live
                            </span>
                          )}
                          <span className="hh-ptag hh-ptag-cat">{FILTER_CATS_DISPLAY[auction.category] || auction.category}</span>
                        </div>
                        <button className="hh-p-more" onClick={e => e.stopPropagation()}>···</button>
                      </div>
                    </div>

                    {/* Media */}
                    <div className="hh-p-media">
                      {primaryImage ? (
                        <img src={primaryImage} alt={auction.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                      ) : (
                        <div className="hh-p-media-ph">{sellerInitials}</div>
                      )}
                      <div className="hh-p-media-timer" style={isEndingSoon ? { color: 'var(--hh-amber)' } : {}}>
                        {auction.ends_at ? <CountdownPill endsAt={auction.ends_at} /> : 'TBD'}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="hh-p-title">{auction.title}</div>

                    {/* Bid card */}
                    <div className="hh-p-bid">
                      <div className="hh-p-bid-data">
                        <div className="hh-bdg">
                          <div className="hh-bdl">Current Bid</div>
                          <div className="hh-bdv">{fmt(auction.current_bid)}</div>
                          <div className="hh-bds">{auction.bid_count} bids</div>
                        </div>
                        <div className="hh-bdg">
                          <div className="hh-bdl">Next Bid</div>
                          <div className="hh-bdv hh-bdv-muted">{fmt(auction.current_bid + auction.bid_increment)}</div>
                          <div className="hh-bds">Dep: {fmt(Math.ceil((auction.current_bid + auction.bid_increment) * 0.1))}</div>
                        </div>
                      </div>
                      <button className="hh-p-bid-btn" onClick={e => { e.stopPropagation(); setBidItem(auction); }}>
                        {isEndingSoon ? 'Bid Now' : 'Place Bid'}
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="hh-p-actions" onClick={e => e.stopPropagation()}>
                      <button className="hh-pact" onClick={e => {
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
          )}
        </div>
      </div>

      {/* Bid modal */}
      {bidItem && (() => {
        // Normalize Supabase snake_case fields to camelCase for BidModal
        const normalizedItem = {
          id: bidItem.id,
          title: bidItem.title,
          lot: bidItem.lot || `#${String(bidItem.id).slice(-4)}`,
          currentBid: bidItem.current_bid ?? bidItem.currentBid ?? 0,
          minIncrement: bidItem.bid_increment ?? bidItem.minIncrement ?? 1000,
          bidCount: bidItem.bid_count ?? bidItem.bidCount ?? 0,
          endsAt: bidItem.ends_at ? new Date(bidItem.ends_at) : (bidItem.endsAt instanceof Date ? bidItem.endsAt : undefined),
          status: bidItem.status || 'live',
          category: bidItem.category || 'Collectible',
          seller: bidItem.celebrity || bidItem.seller || 'Anonymous',
          provenance: bidItem.provenance || '',
          image: bidItem.images?.[0] || bidItem.image || '',
          // Keep raw fields for storage normalization
          images: bidItem.images,
          celebrity: bidItem.celebrity,
          current_bid: bidItem.current_bid,
          bid_increment: bidItem.bid_increment,
          bid_count: bidItem.bid_count,
          ends_at: bidItem.ends_at,
        };
        return (
          <BidModal
            isOpen={!!bidItem}
            onClose={() => setBidItem(null)}
            item={normalizedItem}
            user={user}
            walletBalance={walletBalance}
          />
        );
      })()}
    </section>
  );
}
