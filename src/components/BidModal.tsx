// @ts-nocheck
import { useState } from 'react';
import IIcon from './IIcon';

export interface AuctionItem {
    id: string;
    title: string;
    lot: string;
    currentBid: number;
    minIncrement: number;
    buyoutPrice?: number;
    currency?: string;
}

interface BidModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: AuctionItem | null;
    user: any;
    walletBalance?: number; // available (unblocked) wallet balance
}

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function BidModal({ isOpen, onClose, item, user, walletBalance = 0 }: BidModalProps) {
    const [bidAmount, setBidAmount] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen || !item) return null;

    const minBid = item.currentBid + item.minIncrement;
    const bid = Number(bidAmount);
    const requiredBalance = bid * 0.5;
    const hasEnoughBalance = walletBalance >= requiredBalance;
    const isValidBid = bid >= minBid && bid > 0;
    const isBuyout = item.buyoutPrice !== undefined && bid >= item.buyoutPrice;

    const handleClose = () => {
        setBidAmount('');
        setConfirmed(false);
        setLoading(false);
        setSuccess(false);
        onClose();
    };

    const handleConfirm = async () => {
        if (!isValidBid || !hasEnoughBalance) return;
        setLoading(true);
        // TODO: call Supabase to place bid
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);
        setSuccess(true);
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center" onClick={e => e.target === e.currentTarget && handleClose()}>
            <div className="absolute inset-0 bg-[#3D0808]/70 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative z-10 w-full sm:max-w-md mx-4 mb-0 sm:mb-auto bg-[#0E0E0E] border border-white/10 rounded-t-lg sm:rounded-sm shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-white/5">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Lot {item.lot}</p>
                        <h2 className="text-sm font-medium text-white leading-snug max-w-xs">{item.title}</h2>
                    </div>
                    <button onClick={handleClose} className="text-neutral-500 hover:text-white transition-colors mt-0.5">
                        <IIcon icon="solar:close-circle-linear" width="20" />
                    </button>
                </div>

                {success ? (
                    <div className="px-6 py-10 text-center space-y-3">
                        <IIcon icon="solar:check-circle-linear" width="40" class="text-emerald-400 mx-auto block" />
                        <p className="text-white font-medium">{isBuyout ? 'Buyout Placed!' : 'Bid Placed!'}</p>
                        <p className="text-xs text-neutral-500">
                            {isBuyout
                                ? 'Auction closed. You are the winner. Settlement instructions sent.'
                                : `Your bid of ${fmt(bid)} has been placed. ${fmt(requiredBalance)} is now blocked in your wallet.`}
                        </p>
                        <button onClick={handleClose} className="mt-4 w-full py-3 text-xs uppercase tracking-widest border border-white/10 hover:border-white transition-colors text-neutral-400 hover:text-white">
                            Done
                        </button>
                    </div>
                ) : (
                    <div className="px-6 py-5 space-y-5">
                        {/* Current bid info */}
                        <div className="grid grid-cols-3 gap-px bg-white/5 rounded-sm overflow-hidden text-center">
                            <div className="bg-[#0E0E0E] py-3">
                                <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">Current Bid</p>
                                <p className="font-mono text-sm text-white">{fmt(item.currentBid)}</p>
                            </div>
                            <div className="bg-[#0E0E0E] py-3 border-x border-white/5">
                                <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">Min Increment</p>
                                <p className="font-mono text-sm text-neutral-300">{fmt(item.minIncrement)}</p>
                            </div>
                            <div className="bg-[#0E0E0E] py-3">
                                <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">Your Minimum</p>
                                <p className="font-mono text-sm text-[#D4AF37]">{fmt(minBid)}</p>
                            </div>
                        </div>

                        {/* Bid input */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">Your Bid Amount</label>
                            <div className="flex items-center gap-2 border-b border-white/20 pb-2 focus-within:border-[#D4AF37] transition-colors">
                                <span className="text-neutral-500">₹</span>
                                <input
                                    type="number"
                                    value={bidAmount}
                                    onChange={e => { setBidAmount(e.target.value); setConfirmed(false); }}
                                    placeholder={minBid.toString()}
                                    className="flex-1 bg-transparent text-base focus:outline-none text-white font-mono placeholder:text-neutral-700"
                                    min={minBid}
                                />
                            </div>
                            {bid > 0 && !isValidBid && (
                                <p className="text-[10px] text-[var(--hh-red)] mt-1">Minimum bid is {fmt(minBid)}</p>
                            )}
                            {isBuyout && (
                                <p className="text-[10px] text-amber-400 mt-1">⚡ This bid meets the buyout price — auction will close immediately.</p>
                            )}
                        </div>

                        {/* Wallet check */}
                        {bid > 0 && isValidBid && (
                            <div className={`rounded-sm p-3 border text-xs space-y-1 ${hasEnoughBalance ? 'border-white/5 bg-[#0A0A0A]' : 'border-[var(--hh-red)]/30 bg-[var(--hh-red)]/5'}`}>
                                <div className="flex justify-between text-neutral-400">
                                    <span>Required wallet balance (50%)</span>
                                    <span className="font-mono">{fmt(requiredBalance)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Your available balance</span>
                                    <span className={`font-mono ${hasEnoughBalance ? 'text-emerald-400' : 'text-[var(--hh-red)]'}`}>{fmt(walletBalance)}</span>
                                </div>
                                {!hasEnoughBalance && (
                                    <p className="text-[var(--hh-red)] text-[10px] pt-1">
                                        Insufficient balance. Add ₹{(requiredBalance - walletBalance).toLocaleString('en-IN')} to your wallet to place this bid.
                                    </p>
                                )}
                            </div>
                        )}

                        {!user && (
                            <p className="text-xs text-amber-400 text-center">You must be signed in to place a bid.</p>
                        )}

                        {/* Action */}
                        {!confirmed ? (
                            <button
                                disabled={!isValidBid || !hasEnoughBalance || !user}
                                onClick={() => setConfirmed(true)}
                                className="w-full py-3.5 text-xs uppercase tracking-widest font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#D4AF37] text-black hover:bg-[#c49f2e]"
                            >
                                Review Bid — {bid > 0 && isValidBid ? fmt(bid) : '—'}
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-sm p-3 text-xs text-neutral-400 text-center">
                                    By confirming, you agree to the binding auction terms and liquidated damages clause.
                                </div>
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    className="w-full py-3.5 text-xs uppercase tracking-widest font-semibold bg-[#D4AF37] text-black hover:bg-[#c49f2e] transition-all disabled:opacity-60"
                                >
                                    {loading ? 'Placing Bid…' : `Confirm Bid — ${fmt(bid)}`}
                                </button>
                                <button onClick={() => setConfirmed(false)} className="w-full py-2 text-xs text-neutral-500 hover:text-white transition-colors">
                                    Edit Bid
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
