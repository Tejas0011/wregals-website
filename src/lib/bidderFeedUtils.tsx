// @ts-nocheck
import React from 'react';

/* ─── Synthetic bidder names pool ─── */
const BIDDER_POOL = [
  { av: 'RK', name: '@rajkumar_c' },
  { av: 'AS', name: '@arjun_bids' },
  { av: 'PM', name: '@priya_m99' },
  { av: 'VK', name: '@vikram_col' },
  { av: 'NR', name: '@neha_rare' },
  { av: 'SK', name: '@sanjay_k01' },
  { av: 'AM', name: '@amit_mvp' },
  { av: 'DP', name: '@deepa_p12' },
  { av: 'MR', name: '@manish_rb' },
  { av: 'KS', name: '@kavita_s7' },
];

const TIMES = ['Just now', '2 min ago', '5 min ago', '8 min ago', '14 min ago', '21 min ago'];

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

/**
 * Generate a deterministic (seeded by currentBid) list of synthetic bidders.
 */
export function generateBidderFeed(
  currentBid: number,
  minIncrement: number,
  bidCount: number,
  count: number = 3
) {
  const inc = minIncrement || Math.ceil(currentBid * 0.05);
  // Seed rotation from currentBid to vary which bidders appear
  const offset = Math.abs(Math.floor(currentBid / 1000)) % BIDDER_POOL.length;

  return Array.from({ length: count }, (_, i) => {
    const bidder = BIDDER_POOL[(offset + i) % BIDDER_POOL.length];
    const amt = currentBid - inc * i;
    return {
      av: bidder.av,
      name: bidder.name,
      time: TIMES[i] || `${(i + 1) * 5} min ago`,
      amt: fmt(amt),
      top: i === 0,
    };
  }).filter(f => !f.amt.includes('-'));
}

/**
 * Compact bidder feed for inline display inside bid cards.
 * Shows 3 rows: avatar initials, username, time ago, bid amount.
 */
export function BidderFeedMini({
  currentBid,
  minIncrement,
  bidCount,
}: {
  currentBid: number;
  minIncrement: number;
  bidCount: number;
}) {
  const feed = generateBidderFeed(currentBid, minIncrement, bidCount, 3);
  if (feed.length === 0) return null;

  return (
    <div className="ac-feed">
      <div className="ac-feed-header">
        <span className="ac-feed-dot" />
        <span className="ac-feed-label">Live Bidding</span>
        <span className="ac-feed-count">{bidCount} bids</span>
      </div>
      <div className="ac-feed-list">
        {feed.map((f, i) => (
          <div key={i} className={`ac-feed-row${f.top ? ' ac-feed-row--top' : ''}`}>
            <div className="ac-feed-av">{f.av}</div>
            <div className="ac-feed-info">
              <div className="ac-feed-name">
                {f.name}
                {f.top && <span className="ac-feed-badge">LEADING</span>}
              </div>
              <div className="ac-feed-time">{f.time}</div>
            </div>
            <div className="ac-feed-amt">{f.amt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
