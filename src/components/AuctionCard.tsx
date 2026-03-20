// @ts-nocheck
import { useState } from 'react';
import CountdownTimer from './CountdownTimer';
import BidModal from './BidModal';
import type { AuctionItem } from './BidModal';

export interface AuctionCardData extends AuctionItem {
    image: string;
    provenance: string;
    category: string;
    bidCount: number;
    endsAt: Date;
    status: 'live' | 'ending-soon' | 'reserve-met' | 'ended';
    extended?: boolean;
}

interface AuctionCardProps {
    auction: AuctionCardData;
    user: any;
    walletBalance?: number;
}

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

const STATUS_CONFIG = {
    'live': { label: 'Live', dot: 'bg-red-500 animate-pulse', text: 'text-white' },
    'ending-soon': { label: 'Ending Soon', dot: 'bg-amber-400 animate-pulse', text: 'text-amber-400' },
    'reserve-met': { label: 'Reserve Met', dot: 'bg-emerald-400', text: 'text-emerald-400' },
    'ended': { label: 'Ended', dot: 'bg-neutral-600', text: 'text-neutral-500' },
};

export default function AuctionCard({ auction, user, walletBalance = 0 }: AuctionCardProps) {
    const [bidOpen, setBidOpen] = useState(false);
    const cfg = STATUS_CONFIG[auction.status] || STATUS_CONFIG['live'];

    return (
        <>
            <article className="auction-card group">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#111] rounded-sm mb-5">
                    <img
                        src={auction.image}
                        alt={auction.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Status badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 backdrop-blur-sm bg-[#3D0808]/60 border border-white/10 rounded-sm px-2.5 py-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <span className={`text-[10px] uppercase tracking-widest ${cfg.text}`}>{cfg.label}</span>
                    </div>

                    {/* Lot number */}
                    <div className="absolute top-3 right-3 backdrop-blur-sm bg-[#3D0808]/60 border border-white/10 rounded-sm px-2.5 py-1.5">
                        <span className="text-[9px] uppercase tracking-widest text-neutral-400">Lot {auction.lot}</span>
                    </div>

                    {/* Bid button overlay on hover */}
                    {auction.status !== 'ended' && (
                        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <button
                                onClick={() => setBidOpen(true)}
                                className="w-full py-3.5 text-xs uppercase tracking-widest font-semibold bg-[#D4AF37] text-black hover:bg-[#c49f2e] transition-colors"
                            >
                                Place Bid
                            </button>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500">{auction.category}</p>
                    <h3 className="text-lg tracking-tight leading-snug text-white group-hover:text-[#D4AF37] transition-colors">
                        {auction.title}
                    </h3>
                    <p className="text-xs text-neutral-500">{auction.provenance}</p>

                    {/* Bid / timer row */}
                    <div className="flex justify-between items-end pt-4 border-t border-white/5 mt-3">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">
                                {auction.status === 'ended' ? 'Final Bid' : 'Current Bid'}
                            </p>
                            <p className="font-mono text-base text-white">{fmt(auction.currentBid)}</p>
                            <p className="text-[10px] text-neutral-600 mt-0.5">{auction.bidCount} bid{auction.bidCount !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">
                                {auction.status === 'ended' ? 'Ended' : 'Ends In'}
                            </p>
                            <CountdownTimer endsAt={auction.endsAt} extended={auction.extended} />
                        </div>
                    </div>

                    {/* Mobile bid button */}
                    {auction.status !== 'ended' && (
                        <button
                            onClick={() => setBidOpen(true)}
                            className="mt-3 w-full py-2.5 text-xs uppercase tracking-widest border border-white/15 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-neutral-400 md:hidden"
                        >
                            Place Bid
                        </button>
                    )}
                </div>
            </article>

            <BidModal
                isOpen={bidOpen}
                onClose={() => setBidOpen(false)}
                item={auction}
                user={user}
                walletBalance={walletBalance}
            />
        </>
    );
}
