import { useState } from 'react';
import { Link } from 'react-router-dom';
import IIcon from './IIcon';
import Logo from './Logo';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 4000);
    };

    return (
        <footer className="pt-20 pb-10 border-t border-white/10 mt-auto" style={{ background: 'var(--hh-s1)' }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 items-start">
                    <div className="md:col-span-1">
                        <Link to="/about" className="-mt-10 mb-6 block">
                            <Logo height="h-28" />
                        </Link>
                        <p className="text-xs text-neutral-500 leading-relaxed font-light">
                            India's premier celebrity memorabilia auction platform. Authenticated collectibles from icons you admire.
                        </p>
                    </div>

                    <div className="md:col-span-1">
                        <h5 className="text-xs font-semibold tracking-wide mb-6 text-white">Platform</h5>
                        <ul className="space-y-4 text-xs text-neutral-500 font-light">
                            <li>
                                <Link to="/about" className="transition-colors hover:text-white flex items-center gap-1.5">
                                    About <Logo height="h-6" />
                                </Link>
                            </li>
                            <li><Link to="/how-it-works" className="transition-colors hover:text-white">How It Works</Link></li>
                            <li><Link to="/careers" className="transition-colors hover:text-white">Careers</Link></li>
                            <li><Link to="/press" className="transition-colors hover:text-white">Press Room</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h5 className="text-xs font-semibold tracking-wide mb-6 text-white">Support</h5>
                        <ul className="space-y-4 text-xs text-neutral-500 font-light">
                            <li><Link to="/how-it-works" className="transition-colors hover:text-white">How Bidding Works</Link></li>
                            <li><Link to="/how-it-works" className="transition-colors hover:text-white">Authentication Process</Link></li>
                            <li><Link to="/contact" className="transition-colors hover:text-white">Contact Support</Link></li>
                            <li><Link to="/contact" className="transition-colors hover:text-white">FAQs</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h5 className="text-xs font-semibold tracking-wide mb-6 text-white">Newsletter</h5>
                        <form onSubmit={handleSubscribe}>
                            <div className="flex border-b pb-2 border-white/20">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="bg-transparent w-full text-xs focus:outline-none placeholder:text-neutral-600 text-white"
                                    required
                                />
                                <button type="submit" className="text-xs hover:text-blue-400 transition-colors text-white">
                                    {subscribed ? '✓' : 'JOIN'}
                                </button>
                            </div>
                        </form>
                        {subscribed && (
                            <p className="text-[10px] text-emerald-400 mt-2 animate-pulse">You're in! We'll keep you posted.</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                        © 2026 <Logo height="h-2.5" /> Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="https://instagram.com/wregals" target="_blank" rel="noopener noreferrer" className="text-neutral-500 transition-colors hover:text-white">
                            <IIcon icon="solar:instagram-linear" width="18"></IIcon>
                        </a>
                        <a href="https://x.com/wregals" target="_blank" rel="noopener noreferrer" className="text-neutral-500 transition-colors hover:text-white">
                            <IIcon icon="solar:twitter-linear" width="18"></IIcon>
                        </a>
                        <a href="https://linkedin.com/company/wregals" target="_blank" rel="noopener noreferrer" className="text-neutral-500 transition-colors hover:text-white">
                            <IIcon icon="solar:linkedin-linear" width="18"></IIcon>
                        </a>
                    </div>
                    <div className="flex gap-6 mt-4 md:mt-0 text-[10px] uppercase tracking-wider text-neutral-600">
                        <Link to="/contact" className="text-neutral-500 hover:text-white transition-colors">Privacy</Link>
                        <Link to="/contact" className="text-neutral-500 hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
