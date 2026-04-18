// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { LiveDot, VTick, fmtSecs } from './PromoRibbon';

export interface AuctionItem {
    id: string;
    title: string;
    lot: string;
    currentBid: number;
    minIncrement: number;
    buyoutPrice?: number;
    currency?: string;
    
    seller?: string;
    provenance?: string;
    endsAt?: Date;
    bidCount?: number;
    status?: string;
    category?: string;
    image?: string;
}

interface BidModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: AuctionItem | null;
    user: any;
    walletBalance?: number;
}

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function BidModal({ isOpen, onClose, item, user, walletBalance = 0 }: BidModalProps) {
    const [secs, setSecs] = useState(0);
    const [activeThumb, setActiveThumb] = useState(0);
    const [step, setStep] = useState<'idle' | 'confirm' | 'no-funds' | 'success'>('idle');
    const dur = 7 * 3600;

    // Reset confirmation step when modal reopens
    useEffect(() => { if (isOpen) setStep('idle'); }, [isOpen]);

    useEffect(() => {
        if (!item || !item.endsAt) return;
        const s = Math.max(0, Math.floor((item.endsAt.getTime() - Date.now()) / 1000));
        setSecs(s);
    }, [item]);

    useEffect(() => {
        if (!item || !item.endsAt) return;
        const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [item]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!isOpen || !item) return null;

    // Synthesize data for the modal - dynamically update based on new bids
    const baseCurrentBid = item.currentBid;
    const highestLocalBid = localBids.length > 0 ? Math.max(...localBids.map(b => Number(b.amt))) : 0;
    const actualCurrentBid = Math.max(baseCurrentBid, highestLocalBid);
    
    const current = fmt(actualCurrentBid);
    const minBidNum = actualCurrentBid + item.minIncrement;
    const nextBid = fmt(minBidNum);
    const minRequired = Math.ceil(minBidNum * 0.1);   // minimum 10% needed to even place the bid
    const freezeNum = Math.min(walletBalance, minBidNum); // freeze as much as possible up to full bid
    const depositNum = freezeNum;  // what actually gets deducted from wallet
    const deposit = fmt(depositNum);
    const isPartialFreeze = walletBalance < minBidNum; // user can't cover full bid
    const remainingAfterWin = isPartialFreeze ? minBidNum - walletBalance : 0; // shortfall if they win
    
    const starting = fmt(Math.ceil(actualCurrentBid * 0.4)); // dummy calculation
    const isLive = item.status === 'live' || item.status === 'ending-soon';
    
    const sellerStr = item.seller || 'Anonymous Collector';
    const av = sellerStr.split(' ').map(w => w[0]).join('').substring(0, 2);
    const handle = `@${sellerStr.replace(/[^A-Za-z0-9]/g, '').toLowerCase()}`;
    
    // Realistic live bidder feed - 20 most recent bids
    const inc = item.minIncrement || Math.ceil(item.currentBid * 0.05);
    const bidders = [
        { av: 'RK', name: '@rajkumar_c'   },
        { av: 'AS', name: '@arjun_bids'   },
        { av: 'PM', name: '@priya_m99'    },
        { av: 'VK', name: '@vikram_col'   },
        { av: 'NR', name: '@neha_rare'    },
        { av: 'SK', name: '@sanjay_k01'   },
        { av: 'AM', name: '@amit_mvp'     },
        { av: 'DP', name: '@deepa_p12'    },
        { av: 'MR', name: '@manish_rb'    },
        { av: 'KS', name: '@kavita_s7'    },
        { av: 'RT', name: '@rohit_fan'    },
        { av: 'AK', name: '@aarav_k3'     },
        { av: 'SG', name: '@sneha_g88'    },
        { av: 'DB', name: '@dhruv_bid'    },
        { av: 'MS', name: '@meera_s21'    },
        { av: 'GP', name: '@gaurav_p4'    },
        { av: 'TS', name: '@tanvi_sp'     },
        { av: 'RJ', name: '@rahul_j99'    },
        { av: 'PD', name: '@pooja_dx'     },
        { av: 'NK', name: '@nikhil_k7'    },
    ];
    const [localBids, setLocalBids] = useState<any[]>([]);
    useEffect(() => {
        const fetchLocal = () => {
            if (!item) return;
            const b = JSON.parse(localStorage.getItem('dummyBids') || '[]');
            setLocalBids(b.filter((x: any) => x.itemId === item.id).reverse());
        }
        fetchLocal();
        const interval = setInterval(fetchLocal, 1000);
        return () => clearInterval(interval);
    }, [item]);

    const times = ['Just now', '1 min ago', '3 min ago', '5 min ago', '7 min ago', '9 min ago', '12 min ago', '15 min ago', '18 min ago', '22 min ago', '25 min ago', '28 min ago', '33 min ago', '37 min ago', '40 min ago', '45 min ago', '50 min ago', '55 min ago', '1h ago', '1h ago'];
    const staticFeed = bidders.map((b, i) => ({
        av: b.av,
        name: b.name,
        time: times[i],
        amt: baseCurrentBid - inc * i
    }));

    const feed = [...localBids, ...staticFeed].map((f, i) => ({
        av: f.av,
        name: f.name,
        time: i === 0 && localBids.length > 0 ? 'Just now' : f.time,
        amt: typeof f.amt === 'string' ? f.amt : fmt(f.amt),
        top: i === 0,
    })).filter(f => typeof f.amt === 'string' ? !f.amt.includes('-') : true);

    const watching = Math.floor(actualCurrentBid / 1000) % 500 + 40; // fake
    const cond = item.provenance ? 'Verified Authentic' : 'Excellent';
    const desc = item.provenance 
        ? `Fully authenticated item with documented provenance: ${item.provenance}. A truly premium collectible sourced directly for the Wregals platform.`
        : "An exceptionally rare item, documented and verified for authenticity. Perfect for dedicated collectors.";

    const pct = Math.max(2, (secs / dur) * 100);

    return (
        <div className="hh-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
          <div className="hh-modal">
            <button className="hh-mr-close" onClick={onClose}>✕</button>
    
            {/* LEFT - media */}
            <div className="hh-modal-left">
              <div className="hh-modal-media">
                <div className="hh-mm-ph">{av}</div>
                {isLive && <div className="hh-mm-badge-live"><LiveDot /> Live</div>}
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
              <div className="hh-modal-desc">{desc}</div>
              <div className="hh-modal-proof">
                {['Direct Provenance', 'Original COA', 'Photo proof', 'Wregals inspected'].map(p => (
                  <span key={p} className="hh-mp">✓ {p}</span>
                ))}
              </div>
            </div>
    
            {/* RIGHT - auction panel */}
            <div className="hh-modal-right">
              <div className="hh-mr-seller">
                <div className="hh-mr-seller-left">
                  <div className="hh-mr-av">{av}</div>
                  <div>
                    <div className="hh-mr-name">{sellerStr} <VTick /></div>
                    <div className="hh-mr-handle">{handle}</div>
                  </div>
                </div>
                <button className="hh-mr-flw">Follow</button>
              </div>
    
              <div className="hh-mr-title">{item.title}</div>
              <div className="hh-mr-meta">
                <span className="hh-mr-tag">{item.category || 'Collectible'}</span>
                <span className="hh-mr-dot" />
                <span>{item.lot}</span>
                <span className="hh-mr-dot" />
                <span>{item.bidCount + localBids.length} bids</span>
                <span className="hh-mr-dot" />
                <span>{watching} watching</span>
              </div>
    
              {/* Timer */}
              {item.endsAt && (
                  <div className="hh-mr-timer">
                    <div className="hh-mrt-row">
                      <div>
                        <div className="hh-mrt-lbl">{secs === 0 ? 'Auction Ended' : 'Time Left'}</div>
                        <div className="hh-mrt-val">{secs > 0 ? fmtSecs(secs) : '00:00:00'}</div>
                      </div>
                      <div className="hh-mrt-closes">Closes<br /><strong>Today, 11:59 PM</strong></div>
                    </div>
                    {secs > 0 && <div className="hh-mrt-bar"><div className="hh-mrt-fill" style={{ width: `${pct}%` }} /></div>}
                  </div>
              )}
    
              {/* Bid card */}
              <div className="hh-mr-bid-card">
                <div className="hh-mr-bid-split">
                  <div className="hh-mbc">
                    <div className="hh-mbc-lbl">Current Bid</div>
                    <div className="hh-mbc-val">{current}</div>
                    <div className="hh-mbc-sub">{item.bidCount + localBids.length} bids placed</div>
                  </div>
                  <div className="hh-mbc">
                    <div className="hh-mbc-lbl">Starting Bid</div>
                    <div className="hh-mbc-val hh-mbc-dim">{starting}</div>
                    <div className="hh-mbc-sub">Next: {nextBid}</div>
                  </div>
                </div>
                {secs > 0 ? (
                    <button className="hh-mr-place-btn" onClick={() => {
                        if (walletBalance >= minRequired) {
                            setStep('confirm');
                        } else {
                            setStep('no-funds');
                        }
                    }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 11 12 6 7 11" /><line x1="12" y1="6" x2="12" y2="18" /></svg>
                    Place Bid - {nextBid}
                    </button>
                ) : (
                    <button className="hh-mr-place-btn" style={{ background: 'var(--hh-s3)', borderColor: 'var(--hh-line)', color: 'var(--hh-w4)', cursor: 'not-allowed' }}>
                    Auction Closed
                    </button>
                )}
              </div>

              {/* ── CONFIRMATION / NO-FUNDS OVERLAY ─────────────── */}
              {step !== 'idle' && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(12,12,13,0.97)', backdropFilter: 'blur(8px)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 0, zIndex: 20, borderRadius: 16,
                  padding: '32px 28px', animation: 'hh-modalIn .2s ease both',
                }}>

                  {/* ── SUCCESS ── */}
                  {step === 'success' && (
                    <>
                      <div style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'rgba(34,197,106,0.12)', border: '1.5px solid rgba(34,197,106,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, marginBottom: 18,
                      }}>✓</div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--hh-w1)', marginBottom: 6, letterSpacing: '-0.3px' }}>Bid Placed!</div>
                      <div style={{ fontSize: 12, color: 'var(--hh-w3)', textAlign: 'center' }}>You are now the leading bidder at {fmt(minBidNum)}.</div>
                    </>
                  )}

                  {/* ── CONFIRM ── */}
                  {step === 'confirm' && (
                    <>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--hh-w4)', marginBottom: 24 }}>Confirm Your Bid</div>

                      <div style={{
                        width: '100%', background: 'var(--hh-s2)', border: '1px solid var(--hh-line)',
                        borderRadius: 12, padding: '20px 20px', marginBottom: 20,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                          <div style={{ fontSize: 11, color: 'var(--hh-w3)' }}>Your Bid</div>
                          <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--hh-w1)', letterSpacing: '-0.5px' }}>{fmt(minBidNum)}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--hh-line)', marginBottom: 10 }}>
                          <div style={{ fontSize: 11, color: 'var(--hh-w3)' }}>{isPartialFreeze ? 'Frozen (full wallet)' : 'Frozen (full bid)'}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--hh-green)' }}>{deposit}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isPartialFreeze ? 10 : 0 }}>
                          <div style={{ fontSize: 11, color: 'var(--hh-w3)' }}>Wallet after freeze</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--hh-w2)' }}>{fmt(walletBalance - depositNum)}</div>
                        </div>
                        {isPartialFreeze && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--hh-line)' }}>
                            <div style={{ fontSize: 11, color: 'var(--hh-amber)' }}>If you win, pay remaining</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--hh-amber)' }}>{fmt(remainingAfterWin)}</div>
                          </div>
                        )}
                      </div>

                      <div style={{ fontSize: 11, color: 'var(--hh-w4)', textAlign: 'center', marginBottom: 20, lineHeight: 1.6 }}>
                        {isPartialFreeze
                          ? `Your entire wallet (${deposit}) will be frozen. If you win, pay the remaining ${fmt(remainingAfterWin)} within the deadline.`
                          : `The full bid amount (${deposit}) will be frozen. Released immediately if you're outbid.`
                        }
                      </div>

                      <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                        <button
                          onClick={() => setStep('idle')}
                          style={{
                            flex: 1, padding: '13px 0', borderRadius: 10,
                            background: 'var(--hh-s3)', border: '1px solid var(--hh-line)',
                            color: 'var(--hh-w2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                          }}
                        >Cancel</button>
                        <button
                          onClick={() => {
                            // 1. Build username from user session
                            const baseName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'collector';
                            const cleanName = baseName.replace(/\s+/g, '').toLowerCase();
                            const rNum = String(Math.floor(Math.random() * 900000) + 100000);
                            const handle = `@${cleanName}${rNum}`;
                            const uav = baseName.substring(0, 2).toUpperCase();

                            // 2. Normalize item fields - use the camelCase fields directly since they are already normalized by the parent
                            const normalizedItem = {
                                id: item.id,
                                title: item.title,
                                seller: item.seller || item.celebrity || 'Anonymous',
                                currentBid: item.currentBid || item.current_bid || 0,
                                minIncrement: item.minIncrement || item.bid_increment || 1000,
                                bidCount: (item.bidCount || item.bid_count || 0) + localBids.length + 1,
                                endsAt: item.endsAt || item.ends_at,
                                provenance: item.provenance || '',
                                category: item.category || 'Collectible',
                                lot: item.lot || '#0000',
                                image: item.image || item.images?.[0] || '',
                                status: item.status || 'live',
                            };

                            // 3. Save to dummyBids
                            const newBid = {
                                id: Date.now().toString(),
                                itemId: item.id,
                                av: uav,
                                name: handle,
                                time: 'Just now',
                                amt: minBidNum,
                                itemData: normalizedItem,
                            };
                            const existing = JSON.parse(localStorage.getItem('dummyBids') || '[]');
                            existing.push(newBid);
                            localStorage.setItem('dummyBids', JSON.stringify(existing));
                            
                            // Force immediate leaderboard update in local UI
                            setLocalBids(prev => [newBid, ...prev]);

                            // 4. Deduct deposit from wallet and log transaction
                            const currentBalance = Number(localStorage.getItem('dummyWalletBalance') || '50000');
                            const newBalance = Math.max(0, currentBalance - depositNum);
                            localStorage.setItem('dummyWalletBalance', newBalance.toString());

                            // 5. Log bid deposit in wallet transaction history
                            const bidTx = {
                                id: 'TX-BID-' + Math.floor(Math.random() * 100000),
                                type: 'blocked',
                                amount: depositNum,
                                date: new Date().toISOString().split('T')[0],
                                note: `Bid Deposit - ${item.title || 'Auction Item'}`
                            };
                            const savedTxs = JSON.parse(localStorage.getItem('dummyWalletTransactions') || '[]');
                            savedTxs.unshift(bidTx);
                            localStorage.setItem('dummyWalletTransactions', JSON.stringify(savedTxs));

                            setStep('success');
                            setTimeout(() => setStep('idle'), 3000);
                          }}
                          style={{
                            flex: 2, padding: '13px 0', borderRadius: 10,
                            background: 'var(--hh-w1)', border: 'none',
                            color: '#0C0C0D', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 11 12 6 7 11" /><line x1="12" y1="6" x2="12" y2="18" /></svg>
                          Confirm - {fmt(minBidNum)}
                        </button>
                      </div>
                    </>
                  )}

                  {/* ── NO FUNDS ── */}
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
                          You need a 10% deposit of <strong style={{ color: 'var(--hh-w2)' }}>{deposit}</strong> to place this bid.
                        </div>

                        <div style={{
                          width: '100%', background: 'var(--hh-s2)', border: '1px solid var(--hh-line)',
                          borderRadius: 12, padding: '18px 20px', marginBottom: 20,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <div style={{ fontSize: 11, color: 'var(--hh-w3)' }}>Wallet balance</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--hh-w2)' }}>{fmt(walletBalance)}</div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--hh-line)' }}>
                            <div style={{ fontSize: 11, color: 'var(--hh-w3)' }}>Add at least</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--hh-amber)' }}>+ {fmt(shortfall)}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                          <button
                            onClick={() => setStep('idle')}
                            style={{
                              flex: 1, padding: '13px 0', borderRadius: 10,
                              background: 'var(--hh-s3)', border: '1px solid var(--hh-line)',
                              color: 'var(--hh-w2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            }}
                          >Back</button>
                          <button
                            onClick={onClose}
                            style={{
                              flex: 2, padding: '13px 0', borderRadius: 10,
                              background: 'var(--hh-amber)', border: 'none',
                              color: '#0C0C0D', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            }}
                          >Add {fmt(shortfall)} to Wallet</button>
                        </div>
                      </>
                    );
                  })()}

                </div>
              )}
    
              {/* Info grid */}
              <div className="hh-mr-info-grid">
                <div className="hh-mig"><div className="hh-mig-lbl">Deposit (10%)</div><div className="hh-mig-val">{deposit}</div></div>
                <div className="hh-mig"><div className="hh-mig-lbl">Watching</div><div className="hh-mig-val">{watching} people</div></div>
                <div className="hh-mig"><div className="hh-mig-lbl">Category</div><div className="hh-mig-val">{item.category || 'Collectible'}</div></div>
                <div className="hh-mig"><div className="hh-mig-lbl">Condition</div><div className="hh-mig-val">{cond}</div></div>
              </div>
    
              {/* Live feed */}
              <div className="hh-mr-feed">
                <div className="hh-mrf-header">
                  <div className="hh-mrf-l"><LiveDot /> Live Bidding</div>
                  <span className="hh-mrf-r">{item.bidCount + localBids.length} bids</span>
                </div>
                <div className="hh-mrf-list">
                  {feed.map((f, i) => (
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
