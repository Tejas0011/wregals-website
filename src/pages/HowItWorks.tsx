// @ts-nocheck
import { useState } from 'react';
import { Link } from 'react-router-dom';
import IIcon from '../components/IIcon';
import Footer from '../components/Footer';

const STEPS = [
    {
        n: '01',
        icon: 'solar:user-id-linear',
        title: 'Create & Verify Your Account',
        desc: 'Sign up with your email. Complete our KYC process — government-issued ID, PAN, and source-of-funds declaration. Verification typically takes one business day.',
        detail: [
            'Government-issued photo ID (Aadhaar / Passport)',
            'PAN card for transactions above ₹2L',
            'Source-of-funds declaration for high-value bids',
            'Bank account linking for settlements',
        ],
    },
    {
        n: '02',
        icon: 'solar:wallet-money-linear',
        title: 'Fund Your WREGALS Wallet',
        desc: 'Deposit funds via NEFT, RTGS, or UPI. Your wallet balance must cover at least 50% of your intended bid before you are eligible to place it.',
        detail: [
            'Min deposit: ₹10,000',
            'Accepted: NEFT · RTGS · UPI · Wire',
            'Funds reflect within 2 banking hours',
            'Withdrawals processed within 1 business day',
        ],
    },
    {
        n: '03',
        icon: 'solar:eye-linear',
        title: 'Browse & Register Interest',
        desc: 'Explore current and upcoming lots. View full provenance records, condition reports, and authentication certificates. Register interest to be reminded when a lot opens.',
        detail: [
            'High-resolution catalogue images',
            'Full authentication documentation',
            'Provenance chain from original owner',
            'Independent condition reports',
        ],
    },
    {
        n: '04',
        icon: 'solar:hammer-linear',
        title: 'Place Your Bid',
        desc: 'When a lot is live, bid in any amount above the current price by the minimum increment. The system confirms your wallet balance covers 50% of your bid before accepting it.',
        detail: [
            '50% of bid must be available in wallet',
            'Funds are blocked, not deducted',
            'Minimum increments enforced per lot',
            'Bids are binding and irrevocable',
        ],
    },
    {
        n: '05',
        icon: 'solar:shield-warning-linear',
        title: 'Anti-Sniping Protection',
        desc: 'To ensure fair outcomes, any bid placed in the final 2 minutes of a lot automatically extends the closing time by 2 minutes — preventing last-second sniping.',
        detail: [
            'Activates within the final 2 minutes',
            'Extends timer by 2 minutes per bid',
            'No limit on number of extensions',
            'Displayed in real-time on the lot page',
        ],
    },
    {
        n: '06',
        icon: 'solar:check-circle-linear',
        title: 'Win & Settle',
        desc: 'If you hold the highest bid when the clock expires, you\'ve won. You have 48 hours to complete the remaining payment. Failure to settle triggers a liquidated damages clause.',
        detail: [
            '48-hour payment window post-auction',
            '50% already blocked in wallet',
            'Balance payable via NEFT / wire',
            '20% liquidated damages on default',
        ],
    },
];

const FAQS = [
    {
        q: 'What happens if I win but cannot pay?',
        a: 'A liquidated damages clause of 20% of the hammer price applies. The blocked 50% in your wallet is partially retained and your account may be suspended.',
    },
    {
        q: 'Can I retract a bid?',
        a: 'No. All bids on WREGALS are binding and irrevocable once placed. The 50% wallet requirement ensures that only committed buyers participate.',
    },
    {
        q: 'How is provenance verified?',
        a: 'Every lot is reviewed by our specialist team. We require original purchase receipts, prior auction records, authentication certificates, and independent appraisals before a lot goes live.',
    },
    {
        q: 'Is there a buyer\'s premium?',
        a: 'Yes. A buyer\'s premium of 15% + GST is added to the hammer price. This is shown clearly on every lot before bidding.',
    },
    {
        q: 'How are items delivered after a win?',
        a: 'High-value items are delivered through insured, specialist art and asset logistics partners (e.g. Masterpiece, Crown Fine Art). Delivery costs and timelines are listed on each lot.',
    },
    {
        q: 'Can I sell through WREGALS?',
        a: 'Yes. Apply via our Consign page. Our specialist team will evaluate your item, agree a reserve price, and list it in the next relevant sale.',
    },
];

interface HowItWorksProps { user: any; onSignInClick: () => void; }

export default function HowItWorks({ user, onSignInClick }: HowItWorksProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="bg-[#3D0808] min-h-screen text-white">

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#3D0808]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/"><img src="/wregals-logo-new.png" alt="WREGALS" className="h-12 w-auto object-contain" /></Link>
                    <div className="flex items-center gap-6 text-xs tracking-widest uppercase text-neutral-400">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/auctions/live" className="hover:text-white transition-colors hidden md:block">Auctions</Link>
                        <span className="text-[#D4AF37]">How It Works</span>
                        {user ? (
                            <span className="text-neutral-300 hidden md:block">{user.email?.split('@')[0]}</span>
                        ) : (
                            <button onClick={onSignInClick} className="border px-4 py-1.5 rounded-sm border-white/20 hover:bg-white hover:text-black transition-all">Sign In</button>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="pt-16 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#D4AF37]/4 blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 py-24 relative">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 mb-8">
                        <Link to="/" className="hover:text-neutral-400 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#D4AF37]">How It Works</span>
                    </div>
                    <div className="max-w-2xl">
                        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4 block">Capital-Backed Auctions</span>
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
                            Every bid is a<br />
                            <span className="text-neutral-500">real commitment.</span>
                        </h1>
                        <p className="text-neutral-400 text-base leading-relaxed">
                            WREGALS operates on a simple principle: to bid, you must have skin in the game.
                            Our 6-step process ensures every participant is verified, every bid is financially backed,
                            and every settlement is enforceable.
                        </p>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 mt-16 border border-white/5">
                        {[
                            { v: '50%', l: 'Wallet Requirement' },
                            { v: '48h', l: 'Settlement Window' },
                            { v: '2 min', l: 'Anti-Snipe Extension' },
                            { v: '20%', l: 'Default Damages' },
                        ].map(s => (
                            <div key={s.l} className="bg-[#3D0808] px-8 py-6">
                                <p className="font-mono text-2xl text-white mb-1">{s.v}</p>
                                <p className="text-[10px] uppercase tracking-widest text-neutral-600">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Steps ── */}
            <section className="border-t border-white/5 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4 block">The Process</span>
                    <h2 className="text-3xl font-light tracking-tight mb-16">Six steps, start to sale.</h2>

                    <div className="space-y-0">
                        {STEPS.map((step, i) => (
                            <div key={step.n}
                                className={`group grid md:grid-cols-2 gap-10 py-12 transition-colors duration-300 ${i < STEPS.length - 1 ? 'border-b border-white/5' : ''}`}>

                                {/* Left */}
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0">
                                        <span
                                            className="font-mono text-[#D4AF37]/30 group-hover:text-[#D4AF37] text-5xl font-light leading-none transition-all duration-500"
                                            style={{ textShadow: 'none' }}
                                            onMouseEnter={e => (e.currentTarget.style.textShadow = '0 0 30px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4)')}
                                            onMouseLeave={e => (e.currentTarget.style.textShadow = 'none')}
                                        >{step.n}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-9 h-9 border border-white/10 rounded-sm flex items-center justify-center">
                                                <IIcon icon={step.icon} width="16" class="text-[#D4AF37]" />
                                            </div>
                                            <h3 className="text-lg font-medium text-white">{step.title}</h3>
                                        </div>
                                        <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>

                                {/* Right — detail list */}
                                <div className="md:pl-8 md:border-l md:border-white/5">
                                    <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-4">Requirements / Details</p>
                                    <ul className="space-y-3">
                                        {step.detail.map(d => (
                                            <li key={d} className="flex items-start gap-3 text-sm text-neutral-400">
                                                <span className="text-[#D4AF37] mt-0.5 flex-shrink-0">·</span>
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="border-t border-white/5 py-24 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-6">
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4 block">Got Questions?</span>
                    <h2 className="text-3xl font-light tracking-tight mb-12">Frequently Asked Questions</h2>

                    <div className="max-w-3xl space-y-3">
                        {FAQS.map((faq, i) => (
                            <div key={i} className="border border-white/5 bg-[#0C0C0C] rounded-sm overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                                    <span className="text-sm font-medium text-white">{faq.q}</span>
                                    <IIcon
                                        icon={openFaq === i ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                                        width="16"
                                        class="text-neutral-500 flex-shrink-0"
                                    />
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-6 border-t border-white/5 pt-4">
                                        <p className="text-sm text-neutral-400 leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="border-t border-white/5 py-24">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-light tracking-tight mb-4">Ready to bid?</h2>
                    <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-8">
                        Create your verified account and fund your wallet to start bidding on exceptional lots.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/auctions/live"
                            className="px-8 py-3.5 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#c49f2e] transition-colors">
                            Browse Live Auctions
                        </Link>
                        <Link to="/auctions/upcoming"
                            className="px-8 py-3.5 border border-white/15 text-neutral-300 text-xs uppercase tracking-widest hover:border-white hover:text-white transition-all">
                            View Upcoming Lots
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
