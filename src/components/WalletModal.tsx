// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import IIcon from './IIcon';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export default function WalletModal({ isOpen, onClose, user }: WalletModalProps) {
    const [balance, setBalance] = useState<number>(0);
    const [blocked, setBlocked] = useState<number>(0);
    const [depositAmount, setDepositAmount] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'history'>('overview');
    const [loading, setLoading] = useState(true);
    const [transactions] = useState([
        // Placeholder transactions — replace with real Supabase query later
        { id: 1, type: 'deposit', amount: 50000, date: '2025-02-28', note: 'Wallet top-up' },
        { id: 2, type: 'blocked', amount: 25000, date: '2025-02-28', note: 'Bid on Lot #9921' },
        { id: 3, type: 'released', amount: 25000, date: '2025-02-27', note: 'Outbid on Lot #8492' },
    ]);

    useEffect(() => {
        if (!isOpen || !user) return;
        // Fetch wallet from Supabase — placeholder for now
        setLoading(false);
        setBalance(50000);
        setBlocked(25000);
    }, [isOpen, user]);

    if (!isOpen) return null;

    const available = balance - blocked;

    const fmt = (n: number) =>
        '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

    const typeConfig = {
        deposit: { label: 'Deposited', color: 'text-emerald-400', icon: 'solar:arrow-down-linear' },
        blocked: { label: 'Blocked', color: 'text-amber-400', icon: 'solar:lock-linear' },
        released: { label: 'Released', color: 'text-sky-400', icon: 'solar:arrow-up-linear' },
        withdrawal: { label: 'Withdrawn', color: 'text-red-400', icon: 'solar:arrow-up-linear' },
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-[#0E0E0E] border border-white/10 rounded-sm shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <IIcon icon="solar:wallet-linear" width="20" class="text-[#D4AF37]" />
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-white">My Wallet</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                        <IIcon icon="solar:close-circle-linear" width="20" />
                    </button>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-3 gap-px bg-white/5 border-b border-white/5">
                    <div className="bg-[#0E0E0E] px-4 py-5 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Total</p>
                        <p className="font-mono text-base text-white">{loading ? '—' : fmt(balance)}</p>
                    </div>
                    <div className="bg-[#0E0E0E] px-4 py-5 text-center border-x border-white/5">
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Blocked</p>
                        <p className="font-mono text-base text-amber-400">{loading ? '—' : fmt(blocked)}</p>
                    </div>
                    <div className="bg-[#0E0E0E] px-4 py-5 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Available</p>
                        <p className="font-mono text-base text-emerald-400">{loading ? '—' : fmt(available)}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5">
                    {(['overview', 'deposit', 'history'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-[11px] uppercase tracking-widest transition-colors ${activeTab === tab
                                    ? 'text-[#D4AF37] border-b border-[#D4AF37]'
                                    : 'text-neutral-500 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="px-6 py-5 min-h-[200px]">

                    {/* Overview */}
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <div className="bg-[#0A0A0A] border border-white/5 rounded-sm p-4 space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-500">Bidding Power</p>
                                <p className="text-xs text-neutral-400 leading-relaxed">
                                    With your available balance of <span className="text-white font-mono">{fmt(available)}</span>, you can bid up to{' '}
                                    <span className="text-[#D4AF37] font-mono">{fmt(available * 2)}</span>.
                                </p>
                                <p className="text-[10px] text-neutral-600">
                                    As per WREGALS' capital-backing rule, 50% of any bid must be held in your wallet.
                                </p>
                            </div>
                            <div className="bg-[#0A0A0A] border border-white/5 rounded-sm p-4 space-y-2">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Quick Actions</p>
                                <button
                                    onClick={() => setActiveTab('deposit')}
                                    className="w-full text-xs uppercase tracking-wider border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] py-2.5 transition-all"
                                >
                                    Add Funds
                                </button>
                                <button className="w-full text-xs uppercase tracking-wider border border-white/10 hover:border-white py-2.5 transition-all text-neutral-400 hover:text-white mt-2">
                                    Withdraw Funds
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Deposit */}
                    {activeTab === 'deposit' && (
                        <div className="space-y-4">
                            <p className="text-xs text-neutral-500 leading-relaxed">
                                Enter the amount you'd like to add to your wallet. Minimum deposit is ₹1,000.
                            </p>

                            {/* Quick amounts */}
                            <div className="grid grid-cols-3 gap-2">
                                {[10000, 25000, 50000, 100000, 250000, 500000].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setDepositAmount(String(amt))}
                                        className={`py-2 text-xs font-mono border rounded-sm transition-all ${depositAmount === String(amt)
                                                ? 'border-[#D4AF37] text-[#D4AF37]'
                                                : 'border-white/10 text-neutral-400 hover:border-white/30'
                                            }`}
                                    >
                                        {fmt(amt)}
                                    </button>
                                ))}
                            </div>

                            {/* Custom amount */}
                            <div className="border-b border-white/10 flex items-center gap-2 pb-2">
                                <span className="text-neutral-500 text-sm">₹</span>
                                <input
                                    type="number"
                                    placeholder="Custom amount"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-neutral-700 text-white font-mono"
                                />
                            </div>

                            <button
                                disabled={!depositAmount || Number(depositAmount) < 1000}
                                className="w-full py-3 text-xs uppercase tracking-widest bg-[#D4AF37] text-black font-semibold hover:bg-[#c49f2e] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Proceed to Payment
                            </button>
                            <p className="text-[10px] text-neutral-600 text-center">
                                Payments are processed via secure gateway. Funds appear instantly.
                            </p>
                        </div>
                    )}

                    {/* History */}
                    {activeTab === 'history' && (
                        <div className="space-y-2">
                            {transactions.length === 0 ? (
                                <p className="text-xs text-neutral-600 text-center py-8">No transactions yet.</p>
                            ) : (
                                transactions.map((tx) => {
                                    const cfg = typeConfig[tx.type] || typeConfig.deposit;
                                    return (
                                        <div key={tx.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <IIcon icon={cfg.icon} width="14" class={cfg.color} />
                                                <div>
                                                    <p className="text-xs text-neutral-300">{tx.note}</p>
                                                    <p className="text-[10px] text-neutral-600">{tx.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-mono text-xs ${cfg.color}`}>{fmt(tx.amount)}</p>
                                                <p className="text-[10px] text-neutral-600 uppercase">{cfg.label}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
