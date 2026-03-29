// @ts-nocheck
import { useState, useEffect, useRef } from 'react';

/* ─── DATA ─────────────────────────────────────── */
export const tickerItems = [
  { type: 'promo', name: 'Kohli WC Jersey', price: '₹84,000', key: 'vk' },
  { type: 'promo', name: 'MSD WC Gloves', price: '₹2,40,000', key: 'msd' },
  { type: 'live', name: 'Ranveer Jacket', price: '₹42,000', key: 'rs' },
  { type: 'live', name: 'Hardik Pandya Bat', price: '₹1,18,500', key: 'hp' },
  { type: 'live', name: 'Alia Bhatt Dress', price: '₹67,200', key: 'ab' },
  { type: 'live', name: 'Dhoni Gloves', price: '₹2,40,000', key: 'msd' },
  { type: 'live', name: 'Badshah Jacket', price: '₹38,900', key: 'bj' },
  { type: 'live', name: 'Priyanka Saree', price: '₹1,92,000', key: 'ps' },
];

export const auctionData = {
  vk: {
    ph: 'VK', av: 'VK', name: 'Virat Kohli', handle: '@virat.kohli',
    title: 'Match-Worn 2023 World Cup Jersey — Signed',
    cat: 'Cricket', lot: 'Lot #0847', bids: '23 bids', watching: '147 watching',
    current: '₹84,000', starting: '₹50,000', nextBid: '₹85,000',
    bidcount: '23 bids placed', deposit: '₹8,500', watch2: '147 people',
    cond: 'Match-Worn', btnText: 'Place Bid — ₹85,000',
    secs: 4 * 3600 + 12 * 60 + 39,
    desc: "An exceptionally rare, match-worn example of the 2023 Cricket World Cup jersey. Featuring Kohli's authentic signature on the front. Accompanied by original authentication papers and photographic proof from the match day.",
    feed: [
      { av: 'M', name: '@marcus_t', time: 'Just now', amt: '₹84,000', top: true },
      { av: 'S', name: '@sarah_kl', time: '2 min ago', amt: '₹82,500' },
      { av: 'J', name: '@james_w', time: '6 min ago', amt: '₹80,000' },
      { av: 'R', name: '@rahul_m', time: '12 min ago', amt: '₹77,500' },
      { av: 'P', name: '@preet_v', time: '18 min ago', amt: '₹75,000' },
      { av: 'A', name: '@arjun_s', time: '25 min ago', amt: '₹72,000' },
      { av: 'T', name: '@tanya_b', time: '34 min ago', amt: '₹70,500' },
      { av: 'K', name: '@kunal_d', time: '41 min ago', amt: '₹68,000' },
      { av: 'N', name: '@neha_r', time: '55 min ago', amt: '₹65,000' },
      { av: 'V', name: '@vikram_c', time: '1h 2m ago', amt: '₹62,500' },
      { av: 'S', name: '@sid_v', time: '1h 15m ago', amt: '₹60,000' },
    ],
  },
  msd: {
    ph: 'MSD', av: 'MS', name: 'MS Dhoni', handle: '@msd_official',
    title: '2011 World Cup Winning Gloves — Match Worn',
    cat: 'Cricket', lot: 'Lot #0841', bids: '47 bids', watching: '318 watching',
    current: '₹2,40,000', starting: '₹80,000', nextBid: '₹2,45,000',
    bidcount: '47 bids placed', deposit: '₹24,000', watch2: '318 people',
    cond: 'Match-Worn', btnText: 'Place Bid — ₹2,45,000',
    secs: 1 * 3600 + 52 * 60 + 14,
    desc: "The actual gloves worn during India's historic 2011 World Cup final. Individually numbered and certified with full provenance documentation from the BCCI.",
    feed: [
      { av: 'R', name: '@rahul_m', time: 'Just now', amt: '₹2,40,000', top: true },
      { av: 'A', name: '@arjun_k', time: '4 min ago', amt: '₹2,35,000' },
      { av: 'V', name: '@vikram_s', time: '9 min ago', amt: '₹2,30,000' },
      { av: 'P', name: '@prateek_j', time: '12 min ago', amt: '₹2,25,000' },
      { av: 'S', name: '@sunil_g', time: '17 min ago', amt: '₹2,10,000' },
      { av: 'M', name: '@manish_p', time: '21 min ago', amt: '₹2,05,000' },
      { av: 'D', name: '@dinesh_k', time: '28 min ago', amt: '₹1,95,000' },
      { av: 'R', name: '@rohit_s', time: '35 min ago', amt: '₹1,90,000' },
      { av: 'K', name: '@karan_v', time: '42 min ago', amt: '₹1,85,000' },
      { av: 'A', name: '@amit_b', time: '50 min ago', amt: '₹1,75,000' },
      { av: 'N', name: '@naveen_c', time: '59 min ago', amt: '₹1,70,000' },
    ],
  },
  rs: {
    ph: 'RS', av: 'RS', name: 'Ranveer Singh', handle: '@ranveersingh',
    title: 'Rocky Aur Rani Custom Jacket — Film Set Piece',
    cat: 'Bollywood', lot: 'Lot #0852', bids: '12 bids', watching: '89 watching',
    current: '₹42,000', starting: '₹15,000', nextBid: '₹43,500',
    bidcount: '12 bids placed', deposit: '₹4,200', watch2: '89 people',
    cond: 'Film Costume', btnText: 'Bid Now — ₹43,500',
    secs: 23 * 60 + 7,
    desc: "Custom jacket worn on set during Rocky Aur Rani Ki Prem Kahaani. Sourced from the costume department with director's letter of authenticity and full documentation.",
    feed: [
      { av: 'N', name: '@neha_v', time: 'Just now', amt: '₹42,000', top: true },
      { av: 'K', name: '@karan_p', time: '3 min ago', amt: '₹40,500' },
      { av: 'A', name: '@anjali_s', time: '8 min ago', amt: '₹39,000' },
      { av: 'S', name: '@simran_k', time: '15 min ago', amt: '₹37,500' },
      { av: 'R', name: '@rohan_m', time: '22 min ago', amt: '₹35,000' },
      { av: 'P', name: '@priya_d', time: '31 min ago', amt: '₹32,500' },
      { av: 'V', name: '@varun_d', time: '40 min ago', amt: '₹30,000' },
      { av: 'M', name: '@meera_r', time: '48 min ago', amt: '₹28,000' },
      { av: 'D', name: '@dev_g', time: '55 min ago', amt: '₹25,500' },
      { av: 'T', name: '@tara_s', time: '1h 5m ago', amt: '₹22,000' },
      { av: 'J', name: '@jay_k', time: '1h 20m ago', amt: '₹18,500' },
    ],
  },
  hp: {
    ph: 'HP', av: 'HP', name: 'Hardik Pandya', handle: '@hardikpandya7',
    title: 'IPL 2023 Match-Used Cricket Bat — Season Signed',
    cat: 'Cricket', lot: 'Lot #0848', bids: '31 bids', watching: '201 watching',
    current: '₹1,18,500', starting: '₹40,000', nextBid: '₹1,20,000',
    bidcount: '31 bids placed', deposit: '₹11,850', watch2: '201 people',
    cond: 'Match-Used', btnText: 'Place Bid — ₹1,20,000',
    secs: 3 * 3600 + 55 * 60 + 10,
    desc: 'Bat used throughout the IPL 2023 season, signed at season end with full provenance documentation from the Mumbai Indians franchise.',
    feed: [
      { av: 'D', name: '@deepak_r', time: 'Just now', amt: '₹1,18,500', top: true },
      { av: 'F', name: '@farrukh_t', time: '5 min ago', amt: '₹1,16,000' },
      { av: 'G', name: '@gaurav_m', time: '11 min ago', amt: '₹1,14,000' },
      { av: 'A', name: '@akash_s', time: '18 min ago', amt: '₹1,12,000' },
      { av: 'P', name: '@pranav_v', time: '24 min ago', amt: '₹1,05,500' },
      { av: 'S', name: '@sachin_k', time: '32 min ago', amt: '₹1,00,000' },
      { av: 'R', name: '@rishabh_p', time: '40 min ago', amt: '₹95,000' },
      { av: 'V', name: '@vishal_d', time: '47 min ago', amt: '₹90,500' },
      { av: 'N', name: '@nitin_m', time: '56 min ago', amt: '₹85,000' },
      { av: 'M', name: '@mohit_c', time: '1h 10m ago', amt: '₹80,000' },
      { av: 'K', name: '@kunal_s', time: '1h 25m ago', amt: '₹75,500' },
    ],
  },
  ab: {
    ph: 'AB', av: 'AB', name: 'Alia Bhatt', handle: '@aliabhatt',
    title: 'Gangubai Kathiawadi Premiere Saree — Signed',
    cat: 'Bollywood', lot: 'Lot #0860', bids: '28 bids', watching: '412 watching',
    current: '₹67,200', starting: '₹25,000', nextBid: '₹68,500',
    bidcount: '28 bids placed', deposit: '₹6,720', watch2: '412 people',
    cond: 'Premiere Saree', btnText: 'Place Bid — ₹68,500',
    secs: 2 * 3600 + 15 * 60 + 45,
    desc: "Worn at the Gangubai Kathiawadi world premiere. Personally signed with full authentication documentation.",
    feed: [
      { av: 'S', name: '@shreya_v', time: 'Just now', amt: '₹67,200', top: true },
      { av: 'K', name: '@kavya_m', time: '3 min ago', amt: '₹65,000' },
    ],
  },
  bj: {
    ph: 'BD', av: 'BD', name: 'Badshah', handle: '@badboyshah',
    title: 'Signed Custom Performance Jacket — Sanak Tour',
    cat: 'Music', lot: 'Lot #0872', bids: '19 bids', watching: '95 watching',
    current: '₹38,900', starting: '₹10,000', nextBid: '₹40,000',
    bidcount: '19 bids placed', deposit: '₹3,890', watch2: '95 people',
    cond: 'Stage Worn', btnText: 'Place Bid — ₹40,000',
    secs: 8 * 3600 + 42 * 60 + 10,
    desc: "Custom jacket worn by Badshah during the Sanak North American Tour. Autographed on the inner lining.",
    feed: [
      { av: 'A', name: '@aman_r', time: 'Just now', amt: '₹38,900', top: true },
      { av: 'R', name: '@rohit_b', time: '7 min ago', amt: '₹37,500' },
    ],
  },
  ps: {
    ph: 'PS', av: 'PS', name: 'Priyanka Chopra', handle: '@priyankachopra',
    title: 'Hand-woven Banarasi Saree — Met Gala Afterparty',
    cat: 'Bollywood', lot: 'Lot #0894', bids: '54 bids', watching: '520 watching',
    current: '₹1,92,000', starting: '₹50,000', nextBid: '₹1,95,000',
    bidcount: '54 bids placed', deposit: '₹19,200', watch2: '520 people',
    cond: 'Mint Condition', btnText: 'Place Bid — ₹1,95,000',
    secs: 1 * 3600 + 5 * 60 + 30,
    desc: "A stunning hand-woven Banarasi saree worn by Priyanka Chopra Jonas. Features intricate gold zari work and original certification.",
    feed: [
      { av: 'M', name: '@maya_s', time: 'Just now', amt: '₹1,92,000', top: true },
      { av: 'P', name: '@pooja_k', time: '4 min ago', amt: '₹1,90,000' },
    ],
  },
};

/* ─── HELPERS ───────────────────────────────────── */
export const pad = (n: number) => String(n).padStart(2, '0');
export const fmtSecs = (s: number) =>
  `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;

/* ─── SUB-COMPONENTS ────────────────────────────── */

export function LiveDot() {
  return (
    <span className="hh-rdot" />
  );
}

export function VTick() {
  return <span className="hh-vtick">✓</span>;
}

export function PostTag({ type, children }: { type: string; children: React.ReactNode }) {
  const cls: Record<string, string> = {
    live: 'hh-ptag hh-ptag-live',
    cat: 'hh-ptag hh-ptag-cat',
    cert: 'hh-ptag hh-ptag-cert',
    soon: 'hh-ptag hh-ptag-soon',
    up: 'hh-ptag hh-ptag-up',
  };
  return <span className={cls[type] || 'hh-ptag hh-ptag-cat'}>{children}</span>;
}

/* ─── BID MODAL ─────────────────────────────────── */
export function PromoBidModal({ auctionKey, onClose }: { auctionKey: string | null; onClose: () => void }) {
  const d = auctionKey ? auctionData[auctionKey as keyof typeof auctionData] : null;
  const [secs, setSecs] = useState(d?.secs ?? 0);
  const [activeThumb, setActiveThumb] = useState(0);
  const dur = 7 * 3600;

  useEffect(() => {
    if (!d) return;
    setSecs(d.secs);
    setActiveThumb(0);
  }, [auctionKey]);

  useEffect(() => {
    if (!d) return;
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [auctionKey]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!d) return null;

  const isUrgent = auctionKey === 'rs';
  const pct = Math.max(2, (secs / dur) * 100);

  return (
    <div className="hh-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="hh-modal">
        <button className="hh-mr-close" onClick={onClose}>✕</button>

        {/* LEFT — media */}
        <div className="hh-modal-left">
          <div className="hh-modal-media">
            <div className="hh-mm-ph">{d.ph}</div>
            <div className="hh-mm-badge-live"><LiveDot /> Live</div>
            <div className="hh-mm-cert">✓ Wregals Verified</div>
            <div className="hh-mm-count">1 / 4</div>
          </div>
          <div className="hh-modal-thumbs">
            {['▶', '●', '◆', '■'].map((ico, i) => (
              <div
                key={i}
                className={`hh-mthumb${activeThumb === i ? ' active' : ''}`}
                onClick={() => setActiveThumb(i)}
              >{ico}</div>
            ))}
          </div>
          <div className="hh-modal-desc-label">Item Details</div>
          <div className="hh-modal-desc">{d.desc}</div>
          <div className="hh-modal-proof">
            {['Match-worn', 'Original COA', 'Photo proof', 'Wregals inspected'].map(p => (
              <span key={p} className="hh-mp">✓ {p}</span>
            ))}
          </div>
        </div>

        {/* RIGHT — auction panel */}
        <div className="hh-modal-right">
          <div className="hh-mr-seller">
            <div className="hh-mr-seller-left">
              <div className="hh-mr-av">{d.av}</div>
              <div>
                <div className="hh-mr-name">{d.name} <VTick /></div>
                <div className="hh-mr-handle">{d.handle}</div>
              </div>
            </div>
            <button className="hh-mr-flw">Follow</button>
          </div>

          <div className="hh-mr-title">{d.title}</div>
          <div className="hh-mr-meta">
            <span className="hh-mr-tag">{d.cat}</span>
            <span className="hh-mr-dot" />
            <span>{d.lot}</span>
            <span className="hh-mr-dot" />
            <span>{d.bids}</span>
            <span className="hh-mr-dot" />
            <span>{d.watching}</span>
          </div>

          {/* Timer */}
          <div className="hh-mr-timer">
            <div className="hh-mrt-row">
              <div>
                <div className="hh-mrt-lbl">Time Left</div>
                <div className="hh-mrt-val">{fmtSecs(secs)}</div>
              </div>
              <div className="hh-mrt-closes">Closes<br /><strong>Today, 11:59 PM</strong></div>
            </div>
            <div className="hh-mrt-bar"><div className="hh-mrt-fill" style={{ width: `${pct}%` }} /></div>
          </div>

          {/* Bid card */}
          <div className="hh-mr-bid-card">
            <div className="hh-mr-bid-split">
              <div className="hh-mbc">
                <div className="hh-mbc-lbl">Current Bid</div>
                <div className="hh-mbc-val">{d.current}</div>
                <div className="hh-mbc-sub">{d.bidcount}</div>
              </div>
              <div className="hh-mbc">
                <div className="hh-mbc-lbl">Starting Bid</div>
                <div className="hh-mbc-val hh-mbc-dim">{d.starting}</div>
                <div className="hh-mbc-sub">Next: {d.nextBid}</div>
              </div>
            </div>
            <button className="hh-mr-place-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 11 12 6 7 11" /><line x1="12" y1="6" x2="12" y2="18" /></svg>
              {d.btnText}
            </button>
          </div>

          {/* Info grid */}
          <div className="hh-mr-info-grid">
            <div className="hh-mig"><div className="hh-mig-lbl">Deposit (10%)</div><div className="hh-mig-val">{d.deposit}</div></div>
            <div className="hh-mig"><div className="hh-mig-lbl">Watching</div><div className="hh-mig-val">{d.watch2}</div></div>
            <div className="hh-mig"><div className="hh-mig-lbl">Category</div><div className="hh-mig-val">{d.cat}</div></div>
            <div className="hh-mig"><div className="hh-mig-lbl">Condition</div><div className="hh-mig-val">{d.cond}</div></div>
          </div>

          {/* Live feed */}
          <div className="hh-mr-feed">
            <div className="hh-mrf-header">
              <div className="hh-mrf-l"><LiveDot /> Live Bidding</div>
              <span className="hh-mrf-r">{d.bids}</span>
            </div>
            <div className="hh-mrf-list">
              {d.feed.map((f, i) => (
                <div key={i} className={`hh-mfr${f.top ? ' hh-mfr-top' : ''}`}>
                  <div className="hh-mfr-av">{f.av}</div>
                  <div className="hh-mfr-info">
                    <div className="hh-mfr-name">
                      {f.name}
                      {f.top && <span className="hh-mfr-badge">LEADING</span>}
                    </div>
                    <div className="hh-mfr-time">{f.time}</div>
                  </div>
                  <div className="hh-mfr-amt">{f.amt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PROMO RIBBON COMPONENT ────────────────────── */
export default function PromoRibbon() {
  const [modalKey, setModalKey] = useState<string | null>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  const openModal = (key: string) => {
    setModalKey(key);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setModalKey(null);
    document.body.style.overflow = '';
  };

  const pauseRibbon = () => { if (tickerRef.current) tickerRef.current.style.animationPlayState = 'paused'; };
  const resumeRibbon = () => { if (tickerRef.current) tickerRef.current.style.animationPlayState = 'running'; };

  const allTicker = [...tickerItems, ...tickerItems];

  return (
    <>
      <div className="hh-ribbon">
        <div className="hh-ribbon-label">Promoted</div>
        <div className="hh-ribbon-track" ref={tickerRef} onMouseEnter={pauseRibbon} onMouseLeave={resumeRibbon}>
          {allTicker.map((item, i) => (
            <div
              key={i}
              className="hh-tick-item"
              onClick={() => openModal(item.key)}
              style={{ cursor: 'pointer' }}
            >
              {item.type === 'live' && <span className="hh-rdot" />}
              <span className="hh-ti-name">{item.name}</span>
              <span className="hh-ti-price">{item.price}</span>
              <span className="hh-ti-up">↑</span>
            </div>
          ))}
        </div>
      </div>
      
      {modalKey && <PromoBidModal auctionKey={modalKey} onClose={closeModal} />}
    </>
  );
}
