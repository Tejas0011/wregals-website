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
    title: 'Match-Worn 2023 World Cup Jersey - Signed',
    cat: 'Cricket', lot: 'Lot #0847', bids: '23 bids', watching: '147 watching',
    current: '₹84,000', starting: '₹50,000', nextBid: '₹85,000',
    bidcount: '23 bids placed', deposit: '₹8,500', watch2: '147 people',
    cond: 'Match-Worn', btnText: 'Place Bid - ₹85,000',
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
      { av: 'V', name: '@vikram_c', time: '1h ago', amt: '₹62,500' },
      { av: 'S', name: '@sid_v', time: '1h 15m ago', amt: '₹60,000' },
      { av: 'D', name: '@divya_m', time: '1h 25m ago', amt: '₹58,000' },
      { av: 'G', name: '@gaurav_p4', time: '1h 40m ago', amt: '₹56,500' },
      { av: 'L', name: '@lakshmi_r', time: '1h 55m ago', amt: '₹55,000' },
      { av: 'I', name: '@ishaan_k', time: '2h ago', amt: '₹54,000' },
      { av: 'H', name: '@harsh_t', time: '2h 15m ago', amt: '₹53,000' },
      { av: 'O', name: '@om_patel', time: '2h 30m ago', amt: '₹52,500' },
      { av: 'B', name: '@bhavna_s', time: '2h 50m ago', amt: '₹52,000' },
      { av: 'C', name: '@chirag_d', time: '3h ago', amt: '₹51,500' },
      { av: 'W', name: '@wasim_a', time: '3h 20m ago', amt: '₹51,000' },
    ],
  },
  msd: {
    ph: 'MSD', av: 'MS', name: 'MS Dhoni', handle: '@msd_official',
    title: '2011 World Cup Winning Gloves - Match Worn',
    cat: 'Cricket', lot: 'Lot #0841', bids: '47 bids', watching: '318 watching',
    current: '₹2,40,000', starting: '₹80,000', nextBid: '₹2,45,000',
    bidcount: '47 bids placed', deposit: '₹24,000', watch2: '318 people',
    cond: 'Match-Worn', btnText: 'Place Bid - ₹2,45,000',
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
      { av: 'T', name: '@tanuj_r', time: '1h 10m ago', amt: '₹1,65,000' },
      { av: 'G', name: '@girish_v', time: '1h 22m ago', amt: '₹1,60,000' },
      { av: 'L', name: '@lalit_m', time: '1h 35m ago', amt: '₹1,55,000' },
      { av: 'H', name: '@hemant_d', time: '1h 48m ago', amt: '₹1,50,000' },
      { av: 'J', name: '@jatin_c', time: '2h ago', amt: '₹1,45,000' },
      { av: 'B', name: '@brijesh_p', time: '2h 20m ago', amt: '₹1,40,000' },
      { av: 'F', name: '@farhan_k', time: '2h 40m ago', amt: '₹1,30,000' },
      { av: 'O', name: '@om_sharma', time: '3h ago', amt: '₹1,20,000' },
      { av: 'I', name: '@indra_s', time: '3h 30m ago', amt: '₹1,10,000' },
    ],
  },
  rs: {
    ph: 'RS', av: 'RS', name: 'Ranveer Singh', handle: '@ranveersingh',
    title: 'Rocky Aur Rani Custom Jacket - Film Set Piece',
    cat: 'Bollywood', lot: 'Lot #0852', bids: '12 bids', watching: '89 watching',
    current: '₹42,000', starting: '₹15,000', nextBid: '₹43,500',
    bidcount: '12 bids placed', deposit: '₹4,200', watch2: '89 people',
    cond: 'Film Costume', btnText: 'Bid Now - ₹43,500',
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
      { av: 'L', name: '@leela_n', time: '1h 35m ago', amt: '₹17,000' },
    ],
  },
  hp: {
    ph: 'HP', av: 'HP', name: 'Hardik Pandya', handle: '@hardikpandya7',
    title: 'IPL 2023 Match-Used Cricket Bat - Season Signed',
    cat: 'Cricket', lot: 'Lot #0848', bids: '31 bids', watching: '201 watching',
    current: '₹1,18,500', starting: '₹40,000', nextBid: '₹1,20,000',
    bidcount: '31 bids placed', deposit: '₹11,850', watch2: '201 people',
    cond: 'Match-Used', btnText: 'Place Bid - ₹1,20,000',
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
      { av: 'T', name: '@tarun_b', time: '1h 40m ago', amt: '₹72,000' },
      { av: 'J', name: '@jatin_p', time: '1h 55m ago', amt: '₹68,500' },
      { av: 'H', name: '@harish_n', time: '2h ago', amt: '₹65,000' },
      { av: 'L', name: '@lokesh_r', time: '2h 15m ago', amt: '₹62,000' },
      { av: 'B', name: '@binod_k', time: '2h 30m ago', amt: '₹58,500' },
      { av: 'O', name: '@om_raj', time: '2h 50m ago', amt: '₹55,000' },
      { av: 'E', name: '@ekram_s', time: '3h ago', amt: '₹52,000' },
      { av: 'I', name: '@ishwar_j', time: '3h 15m ago', amt: '₹48,500' },
      { av: 'U', name: '@umesh_r', time: '3h 30m ago', amt: '₹45,000' },
    ],
  },
  ab: {
    ph: 'AB', av: 'AB', name: 'Alia Bhatt', handle: '@aliabhatt',
    title: 'Gangubai Kathiawadi Premiere Saree - Signed',
    cat: 'Bollywood', lot: 'Lot #0860', bids: '28 bids', watching: '412 watching',
    current: '₹67,200', starting: '₹25,000', nextBid: '₹68,500',
    bidcount: '28 bids placed', deposit: '₹6,720', watch2: '412 people',
    cond: 'Premiere Saree', btnText: 'Place Bid - ₹68,500',
    secs: 2 * 3600 + 15 * 60 + 45,
    desc: "Worn at the Gangubai Kathiawadi world premiere. Personally signed with full authentication documentation.",
    feed: [
      { av: 'S', name: '@shreya_v', time: 'Just now', amt: '₹67,200', top: true },
      { av: 'K', name: '@kavya_m', time: '3 min ago', amt: '₹65,000' },
      { av: 'R', name: '@ritika_s', time: '7 min ago', amt: '₹63,000' },
      { av: 'P', name: '@pooja_k', time: '12 min ago', amt: '₹61,500' },
      { av: 'D', name: '@divya_j', time: '18 min ago', amt: '₹60,000' },
      { av: 'A', name: '@ananya_c', time: '24 min ago', amt: '₹58,000' },
      { av: 'M', name: '@mansi_t', time: '30 min ago', amt: '₹56,500' },
      { av: 'T', name: '@tara_v', time: '38 min ago', amt: '₹55,000' },
      { av: 'N', name: '@nisha_b', time: '45 min ago', amt: '₹52,000' },
      { av: 'V', name: '@veena_r', time: '52 min ago', amt: '₹50,000' },
      { av: 'G', name: '@gauri_m', time: '1h ago', amt: '₹48,500' },
      { av: 'J', name: '@jaya_p', time: '1h 12m ago', amt: '₹46,000' },
      { av: 'L', name: '@lata_d', time: '1h 25m ago', amt: '₹44,000' },
      { av: 'H', name: '@hema_v', time: '1h 40m ago', amt: '₹42,000' },
      { av: 'I', name: '@isha_k', time: '1h 55m ago', amt: '₹40,500' },
      { av: 'B', name: '@bhumi_s', time: '2h ago', amt: '₹38,000' },
      { av: 'C', name: '@chitra_n', time: '2h 20m ago', amt: '₹36,000' },
      { av: 'F', name: '@fatima_z', time: '2h 40m ago', amt: '₹34,000' },
      { av: 'E', name: '@esha_r', time: '3h ago', amt: '₹32,000' },
      { av: 'U', name: '@urvi_m', time: '3h 20m ago', amt: '₹30,000' },
    ],
  },
  bj: {
    ph: 'BD', av: 'BD', name: 'Badshah', handle: '@badboyshah',
    title: 'Signed Custom Performance Jacket - Sanak Tour',
    cat: 'Music', lot: 'Lot #0872', bids: '19 bids', watching: '95 watching',
    current: '₹38,900', starting: '₹10,000', nextBid: '₹40,000',
    bidcount: '19 bids placed', deposit: '₹3,890', watch2: '95 people',
    cond: 'Stage Worn', btnText: 'Place Bid - ₹40,000',
    secs: 8 * 3600 + 42 * 60 + 10,
    desc: "Custom jacket worn by Badshah during the Sanak North American Tour. Autographed on the inner lining.",
    feed: [
      { av: 'A', name: '@aman_r', time: 'Just now', amt: '₹38,900', top: true },
      { av: 'R', name: '@rohit_b', time: '7 min ago', amt: '₹37,500' },
      { av: 'S', name: '@sameer_k', time: '14 min ago', amt: '₹36,000' },
      { av: 'N', name: '@nikhil_m', time: '22 min ago', amt: '₹34,500' },
      { av: 'P', name: '@pankaj_v', time: '30 min ago', amt: '₹33,000' },
      { av: 'D', name: '@danish_s', time: '38 min ago', amt: '₹31,500' },
      { av: 'M', name: '@mohsin_a', time: '45 min ago', amt: '₹30,000' },
      { av: 'K', name: '@kartik_p', time: '55 min ago', amt: '₹28,000' },
      { av: 'V', name: '@vivek_j', time: '1h 5m ago', amt: '₹26,500' },
      { av: 'T', name: '@tushar_g', time: '1h 20m ago', amt: '₹25,000' },
      { av: 'G', name: '@gaurav_r', time: '1h 35m ago', amt: '₹23,000' },
      { av: 'J', name: '@jai_kumar', time: '1h 50m ago', amt: '₹21,500' },
      { av: 'L', name: '@laxman_b', time: '2h ago', amt: '₹20,000' },
      { av: 'H', name: '@harinder_s', time: '2h 15m ago', amt: '₹18,500' },
      { av: 'B', name: '@bunty_d', time: '2h 30m ago', amt: '₹17,000' },
      { av: 'C', name: '@chandan_r', time: '2h 50m ago', amt: '₹15,500' },
      { av: 'F', name: '@faisal_m', time: '3h ago', amt: '₹14,000' },
      { av: 'I', name: '@irfan_k', time: '3h 20m ago', amt: '₹12,500' },
      { av: 'O', name: '@ojas_t', time: '3h 40m ago', amt: '₹11,000' },
    ],
  },
  ps: {
    ph: 'PS', av: 'PS', name: 'Priyanka Chopra', handle: '@priyankachopra',
    title: 'Hand-woven Banarasi Saree - Met Gala Afterparty',
    cat: 'Bollywood', lot: 'Lot #0894', bids: '54 bids', watching: '520 watching',
    current: '₹1,92,000', starting: '₹50,000', nextBid: '₹1,95,000',
    bidcount: '54 bids placed', deposit: '₹19,200', watch2: '520 people',
    cond: 'Mint Condition', btnText: 'Place Bid - ₹1,95,000',
    secs: 1 * 3600 + 5 * 60 + 30,
    desc: "A stunning hand-woven Banarasi saree worn by Priyanka Chopra Jonas. Features intricate gold zari work and original certification.",
    feed: [
      { av: 'M', name: '@maya_s', time: 'Just now', amt: '₹1,92,000', top: true },
      { av: 'P', name: '@pooja_k', time: '4 min ago', amt: '₹1,90,000' },
      { av: 'S', name: '@sunita_v', time: '9 min ago', amt: '₹1,87,000' },
      { av: 'R', name: '@rekha_m', time: '15 min ago', amt: '₹1,84,000' },
      { av: 'A', name: '@aarti_r', time: '22 min ago', amt: '₹1,80,000' },
      { av: 'D', name: '@deepika_j', time: '28 min ago', amt: '₹1,76,000' },
      { av: 'K', name: '@komal_s', time: '35 min ago', amt: '₹1,72,000' },
      { av: 'N', name: '@neeta_p', time: '42 min ago', amt: '₹1,68,000' },
      { av: 'T', name: '@tanisha_b', time: '50 min ago', amt: '₹1,64,000' },
      { av: 'V', name: '@vandana_r', time: '58 min ago', amt: '₹1,60,000' },
      { av: 'G', name: '@garima_k', time: '1h 8m ago', amt: '₹1,55,000' },
      { av: 'J', name: '@juhi_m', time: '1h 20m ago', amt: '₹1,50,000' },
      { av: 'L', name: '@lavanya_d', time: '1h 35m ago', amt: '₹1,45,000' },
      { av: 'H', name: '@hina_s', time: '1h 48m ago', amt: '₹1,40,000' },
      { av: 'B', name: '@bindu_v', time: '2h ago', amt: '₹1,35,000' },
      { av: 'C', name: '@chandni_t', time: '2h 15m ago', amt: '₹1,28,000' },
      { av: 'F', name: '@farida_b', time: '2h 30m ago', amt: '₹1,20,000' },
      { av: 'I', name: '@indira_k', time: '2h 50m ago', amt: '₹1,10,000' },
      { av: 'E', name: '@ekta_j', time: '3h ago', amt: '₹1,00,000' },
      { av: 'O', name: '@om_priya', time: '3h 25m ago', amt: '₹90,000' },
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
export function PromoBidModal({ auctionKey, onClose, walletBalance = 50000 }: { auctionKey: string | null; onClose: () => void; walletBalance?: number }) {
  const d = auctionKey ? auctionData[auctionKey as keyof typeof auctionData] : null;
  const [secs, setSecs] = useState(d?.secs ?? 0);
  const [activeThumb, setActiveThumb] = useState(0);
  const [step, setStep] = useState<'idle' | 'confirm' | 'no-funds' | 'success'>('idle');
  const dur = 7 * 3600;

  const [localBids, setLocalBids] = useState<any[]>([]);
  useEffect(() => {
    const fetchLocal = () => {
      if (!auctionKey) return;
      const b = JSON.parse(localStorage.getItem('dummyBids') || '[]');
      setLocalBids(b.filter((x: any) => x.itemId === `'promo-${Math.random()}'` || x.itemId === auctionKey).reverse()); 
    };
    fetchLocal();
    const interval = setInterval(fetchLocal, 1000);
    return () => clearInterval(interval);
  }, [auctionKey]);

  // Parse numeric values from string data
  const parseAmt = (s: string) => parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;
  
  const baseCurrentBid = d ? parseAmt(d.current) : 0;
  const highestLocalBid = localBids.length > 0 ? Math.max(...localBids.map(b => Number(b.amt))) : 0;
  const actualCurrentBid = Math.max(baseCurrentBid, highestLocalBid);
  
  const nextBidNum = d ? Math.max(parseAmt(d.nextBid), actualCurrentBid + 1000) : 0;
  const depositNum = Math.min(walletBalance, nextBidNum); // Freeze logic
  const depositStr = `₹${depositNum.toLocaleString('en-IN')}`;
  
  const currentBidStr = `₹${actualCurrentBid.toLocaleString('en-IN')}`;
  const nextBidStr = `₹${nextBidNum.toLocaleString('en-IN')}`;

  useEffect(() => {
    if (!d) return;
    setSecs(d.secs);
    setActiveThumb(0);
    setStep('idle');
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

        {/* LEFT - media */}
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

        {/* RIGHT - auction panel */}
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
                <div className="hh-mbc-val">{currentBidStr}</div>
                <div className="hh-mbc-sub">{parseAmt(d.bidcount) + localBids.length} bids placed</div>
              </div>
              <div className="hh-mbc">
                <div className="hh-mbc-lbl">Starting Bid</div>
                <div className="hh-mbc-val hh-mbc-dim">{d.starting}</div>
                <div className="hh-mbc-sub">Next: {nextBidStr}</div>
              </div>
            </div>
            <button className="hh-mr-place-btn" onClick={() => {
              if (walletBalance >= depositNum) {
                setStep('confirm');
              } else {
                setStep('no-funds');
              }
            }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 11 12 6 7 11" /><line x1="12" y1="6" x2="12" y2="18" /></svg>
              Place Bid - {nextBidStr}
            </button>
          </div>

          {/* ── CONFIRMATION / NO-FUNDS OVERLAY ── */}
          {step !== 'idle' && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(12,12,13,0.97)', backdropFilter: 'blur(8px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', zIndex: 20, borderRadius: 16,
              padding: '32px 28px', animation: 'hh-modalIn .2s ease both',
            }}>

              {/* SUCCESS */}
              {step === 'success' && (
                <>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'rgba(34,197,106,0.12)', border: '1.5px solid rgba(34,197,106,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, marginBottom: 18,
                  }}>✓</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--hh-w1)', marginBottom: 6, letterSpacing: '-0.3px' }}>Bid Placed!</div>
                  <div style={{ fontSize: 12, color: 'var(--hh-w3)', textAlign: 'center' }}>You are now the leading bidder at {nextBidStr}.</div>
                </>
              )}

              {/* CONFIRM */}
              {step === 'confirm' && (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--hh-w4)', marginBottom: 24 }}>Confirm Your Bid</div>
                  <div style={{
                    width: '100%', background: 'var(--hh-s2)', border: '1px solid var(--hh-line)',
                    borderRadius: 12, padding: '20px', marginBottom: 20,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: 'var(--hh-w3)' }}>Your Bid</div>
                      <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--hh-w1)', letterSpacing: '-0.5px' }}>{nextBidStr}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--hh-line)', marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: 'var(--hh-w3)' }}>Frozen Deposit</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--hh-green)' }}>{depositStr}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 11, color: 'var(--hh-w3)' }}>Wallet after bid</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--hh-w2)' }}>₹{(walletBalance - depositNum).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--hh-w4)', textAlign: 'center', marginBottom: 20, lineHeight: 1.6 }}>
                    By confirming, you agree to deposit {depositStr} from your wallet.
                  </div>
                  <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                    <button onClick={() => setStep('idle')} style={{
                      flex: 1, padding: '13px 0', borderRadius: 10,
                      background: 'var(--hh-s3)', border: '1px solid var(--hh-line)',
                      color: 'var(--hh-w2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}>Cancel</button>
                    <button onClick={() => { 
                      // Generate username logic
                      const baseName = 'collector';
                      const cleanName = baseName.replace(/\s+/g, '').toLowerCase();
                      const rNum = String(Math.floor(Math.random() * 900000) + 100000);
                      const handle = `@${cleanName}${rNum}`;
                      const uav = baseName.substring(0, 2).toUpperCase();

                      // Save to dummyBids so it appears in My Bids
                      const newBid = {
                          id: Date.now().toString(),
                          itemId: auctionKey,
                          av: uav,
                          name: handle,
                          time: 'Just now',
                          amt: nextBidNum,
                          itemData: {
                              id: auctionKey,
                              title: d.title,
                              image: '', // Can't resolve image from promo
                              seller: d.name,
                              currentBid: nextBidNum,
                              minIncrement: 1000,
                              bidCount: parseAmt(d.bidcount) + localBids.length + 1,
                              endsAt: new Date(Date.now() + secs * 1000).toISOString(),
                              provenance: 'Wregals Verified',
                              category: d.cat,
                              status: 'live'
                          },
                      };
                      
                      const existing = JSON.parse(localStorage.getItem('dummyBids') || '[]');
                      existing.push(newBid);
                      localStorage.setItem('dummyBids', JSON.stringify(existing));
                      setLocalBids(prev => [newBid, ...prev]);

                      // Deduct wallet balance
                      const currentBalance = Number(localStorage.getItem('dummyWalletBalance') || '50000');
                      const newBalance = Math.max(0, currentBalance - depositNum);
                      localStorage.setItem('dummyWalletBalance', newBalance.toString());

                      const existingTx = JSON.parse(localStorage.getItem('dummyWalletTransactions') || '[]');
                      existingTx.unshift({
                          id: Date.now().toString(),
                          type: 'blocked',
                          amount: depositNum,
                          date: new Date().toISOString(),
                          desc: `Bid placed on ${d.title}`,
                          status: 'completed'
                      });
                      localStorage.setItem('dummyWalletTransactions', JSON.stringify(existingTx));

                      // Show success for 3 seconds, then return to idle (the live feed)
                      setStep('success'); 
                      setTimeout(() => setStep('idle'), 3000);
                    }} style={{
                      flex: 2, padding: '13px 0', borderRadius: 10,
                      background: 'var(--hh-w1)', border: 'none',
                      color: '#0C0C0D', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 11 12 6 7 11" /><line x1="12" y1="6" x2="12" y2="18" /></svg>
                      Confirm - {nextBidStr}
                    </button>
                  </div>
                </>
              )}

              {/* NO FUNDS */}
              {step === 'no-funds' && (() => {
                const shortfall = depositNum - walletBalance;
                return (
                  <>
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: 'rgba(245,165,0,0.1)', border: '1.5px solid rgba(245,165,0,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 26, marginBottom: 18,
                    }}>⚠</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--hh-w1)', marginBottom: 6, letterSpacing: '-0.3px' }}>Insufficient Funds</div>
                    <div style={{ fontSize: 12, color: 'var(--hh-w3)', textAlign: 'center', marginBottom: 24, lineHeight: 1.6 }}>
                      You need a 10% deposit of <strong style={{ color: 'var(--hh-w2)' }}>{depositStr}</strong> to place this bid.
                    </div>
                    <div style={{
                      width: '100%', background: 'var(--hh-s2)', border: '1px solid var(--hh-line)',
                      borderRadius: 12, padding: '18px 20px', marginBottom: 20,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: 'var(--hh-w3)' }}>Wallet balance</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--hh-w2)' }}>₹{walletBalance.toLocaleString('en-IN')}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--hh-line)' }}>
                        <div style={{ fontSize: 11, color: 'var(--hh-w3)' }}>Add at least</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--hh-amber)' }}>+ ₹{shortfall.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                      <button onClick={() => setStep('idle')} style={{
                        flex: 1, padding: '13px 0', borderRadius: 10,
                        background: 'var(--hh-s3)', border: '1px solid var(--hh-line)',
                        color: 'var(--hh-w2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      }}>Back</button>
                      <button onClick={onClose} style={{
                        flex: 2, padding: '13px 0', borderRadius: 10,
                        background: 'var(--hh-amber)', border: 'none',
                        color: '#0C0C0D', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      }}>Add ₹{shortfall.toLocaleString('en-IN')} to Wallet</button>
                    </div>
                  </>
                );
              })()}

            </div>
          )}

          {/* Info grid */}
          <div className="hh-mr-info-grid">
            <div className="hh-mig"><div className="hh-mig-lbl">Deposit (10%)</div><div className="hh-mig-val">{depositStr}</div></div>
            <div className="hh-mig"><div className="hh-mig-lbl">Watching</div><div className="hh-mig-val">{d.watch2}</div></div>
            <div className="hh-mig"><div className="hh-mig-lbl">Category</div><div className="hh-mig-val">{d.cat}</div></div>
            <div className="hh-mig"><div className="hh-mig-lbl">Condition</div><div className="hh-mig-val">{d.cond}</div></div>
          </div>

          {/* Live feed */}
          <div className="hh-mr-feed">
            <div className="hh-mrf-header">
              <div className="hh-mrf-l"><LiveDot /> Live Bidding</div>
              <span className="hh-mrf-r">{parseAmt(d.bidcount) + localBids.length} bids</span>
            </div>
            <div className="hh-mrf-list">
              {localBids.map((f, i) => (
                <div key={`loc-${i}`} className={`hh-mfr${i === 0 ? ' hh-mfr-top' : ''}`}>
                  <div className="hh-mfr-av">{f.av}</div>
                  <div className="hh-mfr-info">
                    <div className="hh-mfr-name">
                      {f.name}
                      {i === 0 && <span className="hh-mfr-badge">LEADING</span>}
                    </div>
                    <div className="hh-mfr-time">Just now</div>
                  </div>
                  <div className="hh-mfr-amt">{`₹${f.amt.toLocaleString('en-IN')}`}</div>
                </div>
              ))}
              {d.feed.map((f, i) => (
                <div key={i} className={`hh-mfr${f.top && localBids.length === 0 ? ' hh-mfr-top' : ''}`}>
                  <div className="hh-mfr-av">{f.av}</div>
                  <div className="hh-mfr-info">
                    <div className="hh-mfr-name">
                      {f.name}
                      {f.top && localBids.length === 0 && <span className="hh-mfr-badge">LEADING</span>}
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

  const allTicker = [];
  for (let i = 0; i < 8; i++) {
    allTicker.push(...tickerItems);
  }

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
