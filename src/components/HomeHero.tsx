// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ─── DATA ─────────────────────────────────────── */
const tickerItems = [
  { type: 'promo', name: 'Kohli WC Jersey', price: '₹84,000' },
  { type: 'promo', name: 'MSD WC Gloves', price: '₹2,40,000' },
  { type: 'live', name: 'Ranveer Jacket', price: '₹42,000' },
  { type: 'live', name: 'Hardik Pandya Bat', price: '₹1,18,500' },
  { type: 'live', name: 'Alia Bhatt Dress', price: '₹67,200' },
  { type: 'live', name: 'Dhoni Gloves', price: '₹2,40,000' },
  { type: 'live', name: 'Badshah Jacket', price: '₹38,900' },
  { type: 'live', name: 'Priyanka Saree', price: '₹1,92,000' },
];

const auctionData = {
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
    ],
  },
};

/* ─── HELPERS ───────────────────────────────────── */
const pad = (n: number) => String(n).padStart(2, '0');
const fmtSecs = (s: number) =>
  `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;

/* ─── SUB-COMPONENTS ────────────────────────────── */

function LiveDot() {
  return (
    <span className="hh-rdot" />
  );
}

function VTick() {
  return <span className="hh-vtick">✓</span>;
}

function PostTag({ type, children }: { type: string; children: React.ReactNode }) {
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
function BidModal({ auctionKey, onClose }: { auctionKey: string | null; onClose: () => void }) {
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
            <button className="hh-mr-place-btn" style={isUrgent ? { background: 'var(--hh-red)' } : {}}>
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

/* ─── POST CARD ─────────────────────────────────── */
interface PostProps {
  auctionKey: string;
  seller: string;
  handle: string;
  ago: string;
  tags: React.ReactNode;
  title: string;
  desc: string;
  timerSecs: number;
  currentBid: string;
  bidCount: string;
  nextBid: string;
  dep: string;
  likes: string;
  isUpcoming?: boolean;
  isEndingSoon?: boolean;
  notifyMode?: boolean;
  startingBid?: string;
  interested?: string;
  openModal: (key: string) => void;
  timerColor?: string;
  lot: string;
  opacity?: number;
}

function PostCard({
  auctionKey, seller, handle, ago, tags, title, desc,
  timerSecs, currentBid, bidCount, nextBid, dep,
  likes, isUpcoming, isEndingSoon, notifyMode,
  startingBid, interested, openModal, timerColor, lot, opacity = 1,
}: PostProps) {
  const [secs, setSecs] = useState(timerSecs);
  const [liked, setLiked] = useState(false);
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    if (isUpcoming) return;
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [isUpcoming]);

  const initials = seller.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <div className="hh-post">
      <div className="hh-p-header">
        <div className="hh-p-seller">
          <div className="hh-p-av">{initials}</div>
          <div>
            <div className="hh-p-nm-row">
              <span className="hh-p-name">{seller}</span>
              <VTick />
            </div>
            <div className="hh-p-handle">{handle} · {ago}</div>
            <div className="hh-p-tag-row">{tags}</div>
          </div>
        </div>
        <button className="hh-p-more">···</button>
      </div>

      <div className="hh-p-media" style={{ opacity }}>
        <div className="hh-p-media-ph">{initials}</div>
        <div
          className="hh-p-media-timer"
          style={timerColor ? { color: timerColor } : isUpcoming ? { color: 'var(--hh-w2)' } : {}}
        >
          {isUpcoming ? `Starts Apr 5` : fmtSecs(secs)}
        </div>
        <div className="hh-p-media-lot">{lot}</div>
      </div>

      <div className="hh-p-title">{title}</div>
      <div className="hh-p-desc">{desc}</div>

      <div className="hh-p-bid">
        <div className="hh-p-bid-data">
          <div className="hh-bdg">
            <div className="hh-bdl">{notifyMode ? 'Starting Bid' : 'Current Bid'}</div>
            <div className={`hh-bdv${notifyMode ? ' hh-bdv-muted' : ''}`}>
              {notifyMode ? startingBid : currentBid}
            </div>
            <div className="hh-bds">{notifyMode ? `Opens Apr 5` : `${bidCount} · ${dep} watching`}</div>
          </div>
          <div className="hh-bdg">
            <div className="hh-bdl">{notifyMode ? 'Interested' : 'Next Bid'}</div>
            <div className="hh-bdv hh-bdv-muted" style={notifyMode ? { fontSize: '18px' } : {}}>
              {notifyMode ? interested : nextBid}
            </div>
            <div className="hh-bds">{notifyMode ? 'reminders set' : `Dep: ${dep}`}</div>
          </div>
        </div>
        {notifyMode ? (
          <button className="hh-p-bid-btn hh-p-bid-btn-notify">Notify Me</button>
        ) : isEndingSoon ? (
          <button className="hh-p-bid-btn hh-p-bid-btn-urgent" onClick={() => openModal(auctionKey)}>Bid Now</button>
        ) : (
          <button className="hh-p-bid-btn" onClick={() => openModal(auctionKey)}>Place Bid</button>
        )}
      </div>

      <div className="hh-p-actions">
        <button className={`hh-pact${liked ? ' hh-pact-liked' : ''}`} onClick={() => setLiked(l => !l)}>
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          {likes}
        </button>
        <button className={`hh-pact${watched ? ' hh-pact-watched' : ''}`} onClick={() => setWatched(w => !w)}>
          <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          {watched ? 'Watching' : 'Watch'}
        </button>
        <button className="hh-pact">
          <svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
          Share
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────── */
export default function HomeHero() {
  const [modalKey, setModalKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('For You');
  const [activeCat, setActiveCat] = useState('All');
  const [activeNavLink, setActiveNavLink] = useState('Feed');
  const [followed, setFollowed] = useState<Record<string, boolean>>({});
  const tickerRef = useRef<HTMLDivElement>(null);

  const openModal = (key: string) => {
    setModalKey(key);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setModalKey(null);
    document.body.style.overflow = '';
  };

  // Pause ribbon on hover
  const pauseRibbon = () => { if (tickerRef.current) tickerRef.current.style.animationPlayState = 'paused'; };
  const resumeRibbon = () => { if (tickerRef.current) tickerRef.current.style.animationPlayState = 'running'; };

  const toggleFollow = (name: string) => setFollowed(p => ({ ...p, [name]: !p[name] }));

  const navLinks = [
    { icon: '⊞', label: 'Feed' },
    { icon: '⏱', label: 'Live Now', badge: '12' },
    { icon: '♡', label: 'Watchlist' },
    { icon: '↑', label: 'My Bids' },
    { icon: '▭', label: 'Wallet' },
  ];

  const cats = [
    { label: 'All', color: '#F04040' },
    { label: 'Cricket', color: '#3B82F6' },
    { label: 'Bollywood', color: '#EC4899' },
    { label: 'Music', color: '#8B5CF6' },
    { label: 'Fashion', color: '#F59E0B' },
    { label: 'Sports', color: '#10B981' },
  ];

  const feedTabs = ['For You', 'Following', 'Cricket', 'Bollywood', 'Music'];

  // Double ticker items for seamless loop
  const allTicker = [...tickerItems, ...tickerItems];

  return (
    <section className="hh-root">
      {/* ─── PROMO RIBBON ────────────────────────── */}
      <div className="hh-ribbon">
        <div className="hh-ribbon-label">Promoted</div>
        <div className="hh-ribbon-track" ref={tickerRef} onMouseEnter={pauseRibbon} onMouseLeave={resumeRibbon}>
          {allTicker.map((item, i) => (
            <div key={i} className={`hh-tick-item${item.type === 'promo' ? ' hh-tick-promo' : ''}`}>
              {item.type === 'promo' && <span className="hh-promo-tag">AD</span>}
              {item.type === 'live' && <span className="hh-rdot" />}
              <span className="hh-ti-name">{item.name}</span>
              <span className="hh-ti-price">{item.price}</span>
              <span className="hh-ti-up">↑</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3-COLUMN LAYOUT ─────────────────────── */}
      <div className="hh-layout">

        {/* LEFT SIDEBAR */}
        <div className="hh-lsidebar">
          {navLinks.map(({ icon, label, badge }) => (
            <div
              key={label}
              className={`hh-ls-link${activeNavLink === label ? ' active' : ''}`}
              onClick={() => setActiveNavLink(label)}
            >
              <span className="hh-ls-icon">{icon}</span>
              {label}
              {badge && <span className="hh-ls-badge">{badge}</span>}
            </div>
          ))}

          <div className="hh-ls-sep" />
          <div className="hh-ls-section">Browse</div>

          <div className="hh-ls-cats">
            {cats.map(({ label, color }) => (
              <div
                key={label}
                className={`hh-ls-cat${activeCat === label ? ' active' : ''}`}
                onClick={() => setActiveCat(label)}
              >
                <div className="hh-ls-cat-dot" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>

          <div className="hh-ls-sep" />

          <div className="hh-ls-wallet">
            <div className="hh-lw-label">My Wallet</div>
            <div className="hh-lw-value">₹50,000</div>
            <button className="hh-lw-btn">Add Funds</button>
          </div>
        </div>

        {/* FEED */}
        <div className="hh-feed">
          <div className="hh-feed-tabs">
            {feedTabs.map(tab => (
              <div
                key={tab}
                className={`hh-ftab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Post 1 — Virat Kohli — LIVE */}
          <PostCard
            auctionKey="vk"
            seller="Virat Kohli" handle="@virat.kohli" ago="2h ago"
            tags={<><PostTag type="live"><LiveDot />Live</PostTag><PostTag type="cat">Cricket</PostTag><PostTag type="cert">✓ Verified</PostTag></>}
            title="Match-Worn 2023 World Cup Jersey — Signed"
            desc="An exceptionally rare match-worn jersey from the 2023 ICC Cricket World Cup, featuring Kohli's authenticated signature with original certification papers."
            timerSecs={4 * 3600 + 12 * 60 + 39}
            currentBid="₹84,000" bidCount="23 bids" nextBid="₹85,000" dep="₹8,500"
            likes="1.2K" lot="Lot #0847"
            openModal={openModal}
          />

          {/* Post 2 — MS Dhoni — LIVE */}
          <PostCard
            auctionKey="msd"
            seller="MS Dhoni" handle="@msd_official" ago="5h ago"
            tags={<><PostTag type="live"><LiveDot />Live</PostTag><PostTag type="cat">Cricket</PostTag><PostTag type="cert">✓ Verified</PostTag></>}
            title="2011 World Cup Winning Gloves — Match Worn"
            desc="The actual gloves worn during India's 2011 World Cup final. Individually numbered, certified, and fully documented by the BCCI."
            timerSecs={1 * 3600 + 52 * 60 + 14}
            currentBid="₹2,40,000" bidCount="47 bids" nextBid="₹2,45,000" dep="₹24,000"
            likes="3.4K" lot="Lot #0841"
            openModal={openModal}
          />

          {/* Post 3 — Ranveer Singh — ENDING SOON */}
          <PostCard
            auctionKey="rs"
            seller="Ranveer Singh" handle="@ranveersingh" ago="3h ago"
            tags={<><PostTag type="soon">Ending in 23 min</PostTag><PostTag type="cat">Bollywood</PostTag><PostTag type="cert">✓ Verified</PostTag></>}
            title="Rocky Aur Rani Custom Jacket — Film Set Piece"
            desc="Custom jacket worn on set during production. Sourced from the costume department with director's letter of authenticity."
            timerSecs={23 * 60 + 7}
            currentBid="₹42,000" bidCount="12 bids" nextBid="₹43,500" dep="₹4,200"
            likes="876" lot="Lot #0852"
            isEndingSoon
            timerColor="var(--hh-amber)"
            openModal={openModal}
          />

          {/* Post 4 — Alia Bhatt — UPCOMING */}
          <PostCard
            auctionKey="ab"
            seller="Alia Bhatt" handle="@aliabhatt" ago="1d ago"
            tags={<><PostTag type="up">Upcoming · Apr 5</PostTag><PostTag type="cat">Bollywood</PostTag><PostTag type="cert">✓ Verified</PostTag></>}
            title="Gangubai Kathiawadi Premiere Saree — Signed"
            desc="Worn at the Gangubai Kathiawadi world premiere. Personally signed with full authentication documentation. Bidding opens April 5th."
            timerSecs={0}
            currentBid="₹25,000" bidCount="0 bids" nextBid="412" dep="₹2,500"
            likes="2.1K" lot="Lot #0860"
            isUpcoming notifyMode
            startingBid="₹25,000" interested="412"
            opacity={0.65}
            openModal={openModal}
          />

          {/* Post 5 — Hardik Pandya — LIVE */}
          <PostCard
            auctionKey="hp"
            seller="Hardik Pandya" handle="@hardikpandya7" ago="4h ago"
            tags={<><PostTag type="live"><LiveDot />Live</PostTag><PostTag type="cat">Cricket</PostTag><PostTag type="cert">✓ Verified</PostTag></>}
            title="IPL 2023 Match-Used Cricket Bat — Season Signed"
            desc="Bat used throughout IPL 2023, signed at season end with full provenance documentation from the franchise."
            timerSecs={3 * 3600 + 55 * 60 + 10}
            currentBid="₹1,18,500" bidCount="31 bids" nextBid="₹1,20,000" dep="₹11,850"
            likes="1.8K" lot="Lot #0848"
            openModal={openModal}
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hh-rsidebar">

          {/* Ending soon */}
          <div className="hh-rc">
            <div className="hh-rc-title">Ending Soon</div>
            {[
              { av: 'RS', name: 'Ranveer — Film Jacket', sub: '12 bids', timer: '00:23:07', red: true, key: 'rs' },
              { av: 'MS', name: 'MSD — WC Gloves', sub: '47 bids', timer: '01:52:14', red: true, key: 'msd' },
              { av: 'VK', name: 'Kohli — WC Jersey', sub: '23 bids', timer: '04:12:39', red: false, key: 'vk' },
              { av: 'HP', name: 'Hardik — IPL Bat', sub: '31 bids', timer: '03:55:10', red: false, key: 'hp' },
            ].map(row => (
              <div key={row.key} className="hh-rc-row" onClick={() => openModal(row.key)} style={{ cursor: 'pointer' }}>
                <div className="hh-rc-av">{row.av}</div>
                <div className="hh-rc-info">
                  <div className="hh-rc-name">{row.name}</div>
                  <div className="hh-rc-sub">{row.sub}</div>
                </div>
                <div className={`hh-rc-timer${row.red ? ' hh-rc-timer-red' : ''}`}>{row.timer}</div>
              </div>
            ))}
          </div>

          {/* Sellers to follow */}
          <div className="hh-rc">
            <div className="hh-rc-title">Sellers to Follow</div>
            {[
              { av: 'SR', name: 'Sachin Tendulkar', sub: '2 upcoming auctions' },
              { av: 'DP', name: 'Deepika Padukone', sub: '1 live now' },
              { av: 'BD', name: 'Badshah', sub: 'Listing soon' },
            ].map(s => (
              <div key={s.name} className="hh-rc-row">
                <div className="hh-rc-av">{s.av}</div>
                <div className="hh-rc-info">
                  <div className="hh-rc-name">{s.name}</div>
                  <div className="hh-rc-sub">{s.sub}</div>
                </div>
                <button className="hh-flw-btn" onClick={() => toggleFollow(s.name)}>
                  {followed[s.name] ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>

          {/* Why Wregals */}
          <div className="hh-rc">
            <div className="hh-rc-title">Why Wregals</div>
            {[
              ['All items verified', '✓ Always'],
              ['Escrow protected', '✓ Always'],
              ['3-day returns', '✓ Guaranteed'],
              ['Avg. closing price', '₹96K'],
              ['Items sold this week', '142'],
            ].map(([l, r]) => (
              <div key={l} className="hh-rc-stat">
                <span className="hh-rs-l">{l}</span>
                <span className="hh-rs-r">{r}</span>
              </div>
            ))}
          </div>

          {/* Active bids */}
          <div className="hh-rc">
            <div className="hh-rc-title">Your Active Bids</div>
            <div className="hh-rc-row">
              <div className="hh-rc-av">VK</div>
              <div className="hh-rc-info">
                <div className="hh-rc-name">Kohli WC Jersey</div>
                <div className="hh-rc-sub" style={{ color: 'var(--hh-red)' }}>Outbid · your bid ₹80,000</div>
              </div>
              <button
                className="hh-flw-btn"
                style={{ background: 'var(--hh-red)', color: '#fff', borderColor: 'var(--hh-red)' }}
                onClick={() => openModal('vk')}
              >Raise</button>
            </div>
          </div>

        </div>
      </div>

      {/* BID MODAL */}
      {modalKey && <BidModal auctionKey={modalKey} onClose={closeModal} />}
    </section>
  );
}
