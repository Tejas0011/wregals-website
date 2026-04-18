// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { HomeFeedSkeleton } from './SkeletonScreens';

import PromoRibbon, { PromoBidModal, LiveDot, VTick, PostTag, fmtSecs } from './PromoRibbon';

/* ─── POST CARD ─────────────────────────────────── */
// Seller ID lookup - maps seller name to their celebrity profile ID
const SELLER_IDS: Record<string, string> = {
  'Virat Kohli': 'vk',
  'MS Dhoni': 'msd',
  'Hardik Pandya': 'hp',
  'Ranveer Singh': 'rs',
  'Alia Bhatt': 'ab',
  'Priyanka Chopra': 'pc',
  'Amitabh Bachchan': 'amitabh',
  'Badshah': 'badshah',
  'A.R. Rahman': 'arr',
  'Bhuvan Bam': 'bb',
  'Neeraj Chopra': 'nc',
  'PV Sindhu': 'pv',
};

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
  const sellerId = SELLER_IDS[seller] || null;

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
          {sellerId ? (
            <Link to={`/celebrity/${sellerId}`} onClick={e => e.stopPropagation()} className="hh-p-av" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              {initials}
            </Link>
          ) : (
            <div className="hh-p-av">{initials}</div>
          )}
          <div>
            <div className="hh-p-nm-row">
              {sellerId ? (
                <Link to={`/celebrity/${sellerId}`} onClick={e => e.stopPropagation()} style={{ textDecoration: 'none' }}>
                  <span className="hh-p-name" style={{ cursor: 'pointer' }}>{seller}</span>
                </Link>
              ) : (
                <span className="hh-p-name">{seller}</span>
              )}
              <VTick />
            </div>
            <div className="hh-p-handle">{handle} · {ago}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="hh-p-tag-row" style={{ marginTop: 0 }}>{tags}</div>
          <button className="hh-p-more">···</button>
        </div>
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

      {/* Actions row - directly below image */}
      <div className="hh-p-actions">
        <button
          className="hh-pact"
          onClick={(e) => { e.stopPropagation(); setLiked(l => !l); }}
        >
          <svg
            viewBox="0 0 24 24"
            fill={liked ? '#fff' : 'none'}
            stroke={liked ? '#fff' : 'currentColor'}
            style={{ transition: 'fill 0.18s, stroke 0.18s' }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likes}
        </button>
        <button className="hh-pact">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
          Share
        </button>
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
    </div>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────── */
export default function HomeHero() {
  const [modalKey, setModalKey] = useState<string | null>(null);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);


  const openModal = (key: string) => {
    setModalKey(key);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setModalKey(null);
    document.body.style.overflow = '';
  };



  const toggleFollow = (id: string) => setFollowed(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  if (loading) return <HomeFeedSkeleton />;

  return (
    <section className="hh-root">
      {/* ─── 3-COLUMN LAYOUT ─────────────────────── */}
      <div className="hh-layout">

        {/* LEFT SIDEBAR */}
        <LeftSidebar />

        {/* FEED */}
        <div className="hh-feed">


          {/* Post 1 - Virat Kohli - LIVE */}
          <PostCard
            auctionKey="vk"
            seller="Virat Kohli" handle="@virat.kohli" ago="2h ago"
            tags={<><PostTag type="live"><LiveDot />Live</PostTag><PostTag type="cat">Sports</PostTag></>}
            title="Match-Worn 2023 World Cup Jersey - Signed"
            desc="An exceptionally rare match-worn jersey from the 2023 ICC Cricket World Cup, featuring Kohli's authenticated signature with original certification papers."
            timerSecs={4 * 3600 + 12 * 60 + 39}
            currentBid="₹84,000" bidCount="23 bids" nextBid="₹85,000" dep="₹8,500"
            likes="1.2K" lot="Lot #0847"
            openModal={openModal}
          />

          {/* Post 2 - MS Dhoni - LIVE */}
          <PostCard
            auctionKey="msd"
            seller="MS Dhoni" handle="@msd_official" ago="5h ago"
            tags={<><PostTag type="live"><LiveDot />Live</PostTag><PostTag type="cat">Sports</PostTag></>}
            title="2011 World Cup Winning Gloves - Match Worn"
            desc="The actual gloves worn during India's 2011 World Cup final. Individually numbered, certified, and fully documented by the BCCI."
            timerSecs={1 * 3600 + 52 * 60 + 14}
            currentBid="₹2,40,000" bidCount="47 bids" nextBid="₹2,45,000" dep="₹24,000"
            likes="3.4K" lot="Lot #0841"
            openModal={openModal}
          />

          {/* Post 3 - Ranveer Singh - ENDING SOON */}
          <PostCard
            auctionKey="rs"
            seller="Ranveer Singh" handle="@ranveersingh" ago="3h ago"
            tags={<><PostTag type="soon">Ending in 23 min</PostTag><PostTag type="cat">Cinema</PostTag></>}
            title="Rocky Aur Rani Custom Jacket - Film Set Piece"
            desc="Custom jacket worn on set during production. Sourced from the costume department with director's letter of authenticity."
            timerSecs={23 * 60 + 7}
            currentBid="₹42,000" bidCount="12 bids" nextBid="₹43,500" dep="₹4,200"
            likes="876" lot="Lot #0852"
            isEndingSoon
            timerColor="var(--hh-amber)"
            openModal={openModal}
          />

          {/* Post 4 - Alia Bhatt - UPCOMING */}
          <PostCard
            auctionKey="ab"
            seller="Alia Bhatt" handle="@aliabhatt" ago="1d ago"
            tags={<><PostTag type="up">Upcoming · Apr 5</PostTag><PostTag type="cat">Cinema</PostTag></>}
            title="Gangubai Kathiawadi Premiere Saree - Signed"
            desc="Worn at the Gangubai Kathiawadi world premiere. Personally signed with full authentication documentation. Bidding opens April 5th."
            timerSecs={0}
            currentBid="₹25,000" bidCount="0 bids" nextBid="412" dep="₹2,500"
            likes="2.1K" lot="Lot #0860"
            isUpcoming notifyMode
            startingBid="₹25,000" interested="412"
            opacity={0.65}
            openModal={openModal}
          />

          {/* Post 5 - Hardik Pandya - LIVE */}
          <PostCard
            auctionKey="hp"
            seller="Hardik Pandya" handle="@hardikpandya7" ago="4h ago"
            tags={<><PostTag type="live"><LiveDot />Live</PostTag><PostTag type="cat">Sports</PostTag></>}
            title="IPL 2023 Match-Used Cricket Bat - Season Signed"
            desc="Bat used throughout IPL 2023, signed at season end with full provenance documentation from the franchise."
            timerSecs={3 * 3600 + 55 * 60 + 10}
            currentBid="₹1,18,500" bidCount="31 bids" nextBid="₹1,20,000" dep="₹11,850"
            likes="1.8K" lot="Lot #0848"
            openModal={openModal}
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hh-rsidebar">
          <RightSidebar followed={followed} toggleFollow={toggleFollow} onRaise={openModal} />
        </div>
      </div>

      {/* BID MODAL */}
      {modalKey && <PromoBidModal auctionKey={modalKey} onClose={closeModal} />}
    </section>
  );
}
