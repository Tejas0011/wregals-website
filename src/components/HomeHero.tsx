// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import IIcon from './IIcon';

import PromoRibbon, { PromoBidModal, LiveDot, VTick, PostTag, fmtSecs } from './PromoRibbon';

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
          <button className="hh-p-bid-btn" onClick={() => openModal(auctionKey)}>Bid Now</button>
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


  const openModal = (key: string) => {
    setModalKey(key);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setModalKey(null);
    document.body.style.overflow = '';
  };



  const toggleFollow = (name: string) => setFollowed(p => ({ ...p, [name]: !p[name] }));

  const navLinks = [
    { icon: 'lucide:layout-grid', label: 'Feed', path: '/' },
    { icon: 'lucide:clock', label: 'Live Now', path: '/auctions/live' },
    { icon: 'lucide:heart', label: 'Watchlist', path: '/watchlist' },
    { icon: 'lucide:activity', label: 'My Bids', path: '/my-bids' },
    { icon: 'lucide:credit-card', label: 'Wallet', path: '/wallet' },
  ];

  const cats = [
    { label: 'All', color: '#961616' },
    { label: 'Sports', color: '#3B82F6' },
    { label: 'Cinema', color: '#EC4899' },
    { label: 'Music', color: '#8B5CF6' },
    { label: 'Creators', color: '#10B981' },
  ];

  const feedTabs = ['For You', 'Sports', 'Cinema', 'Music', 'Creators'];



  return (
    <section className="hh-root">
      {/* ─── PROMO RIBBON ────────────────────────── */}
      <PromoRibbon />

      {/* ─── 3-COLUMN LAYOUT ─────────────────────── */}
      <div className="hh-layout">

        {/* LEFT SIDEBAR */}
        <div className="hh-lsidebar">
          {navLinks.map(({ icon, label, badge, path }) => (
            <Link
              key={label}
              to={path}
              className={`hh-ls-link${activeNavLink === label ? ' active' : ''}`}
              onClick={() => setActiveNavLink(label)}
            >
              <span className="hh-ls-icon"><IIcon icon={icon} width={20} /></span>
              {label}
              {badge && <span className="hh-ls-badge">{badge}</span>}
            </Link>
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
          <button className="hh-ls-cat-all">
            <IIcon icon="lucide:plus" width={14} className="mr-2" />
            Browse all categories
          </button>

          <div className="hh-ls-sep" />

          <div className="hh-ls-wallet">
            <div className="hh-lw-label">My Wallet</div>
            <div className="hh-lw-value">₹50,000</div>
            <button className="hh-lw-btn">Add Funds</button>
          </div>
        </div>

        {/* FEED */}
        <div className="hh-feed">


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
            <button className="hh-rc-show-more">
              Show more
            </button>
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
            <button className="hh-rc-show-more">
              Show more
            </button>
          </div>



        </div>
      </div>

      {/* BID MODAL */}
      {modalKey && <PromoBidModal auctionKey={modalKey} onClose={closeModal} />}
    </section>
  );
}
