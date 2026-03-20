import { Link } from 'react-router-dom';
import IIcon from './IIcon';

export default function Footer() {
    return (
        <footer className="pt-20 pb-10 border-t bg-[#3D0808] border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="md:col-span-1">
                        <Link to="/about" className="text-xl serif tracking-tighter uppercase mb-6 block text-white">WREGALS</Link>
                        <p className="text-xs text-neutral-500 leading-relaxed font-light">
                            The definitive digital auction house for the world's most significant assets.
                        </p>
                    </div>

                    <div className="md:col-span-1">
                        <h5 className="text-xs font-semibold uppercase tracking-widest mb-6 text-white">Platform</h5>
                        <ul className="space-y-4 text-xs text-neutral-500 font-light">
                            <li><Link to="/about" className="transition-colors hover:text-white">About Wregals</Link></li>
                            <li><Link to="/gallery" className="transition-colors hover:text-white">Celebrity Partners</Link></li>
                            <li><Link to="/careers" className="transition-colors hover:text-white">Careers</Link></li>
                            <li><Link to="/press" className="transition-colors hover:text-white">Press Room</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h5 className="text-xs font-semibold uppercase tracking-widest mb-6 text-white">Support</h5>
                        <ul className="space-y-4 text-xs text-neutral-500 font-light">
                            <li><Link to="/how-it-works" className="transition-colors hover:text-white">Trust & Safety</Link></li>
                            <li><Link to="/how-it-works" className="transition-colors hover:text-white">Authentication</Link></li>
                            <li><Link to="/contact" className="transition-colors hover:text-white">Shipping & Returns</Link></li>
                            <li><Link to="/contact" className="transition-colors hover:text-white">Concierge</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h5 className="text-xs font-semibold uppercase tracking-widest mb-6 text-white">Newsletter</h5>
                        <div className="flex border-b pb-2 border-white/20">
                            <input type="email" placeholder="Email Address" className="bg-transparent w-full text-xs focus:outline-none placeholder:text-neutral-600 text-white" />
                            <button className="text-xs hover:text-[#D4AF37] transition-colors text-white">JOIN</button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-600">© 2025 Wregals Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="text-neutral-500 transition-colors hover:text-white">
                            <IIcon icon="solar:instagram-linear" width="18"></IIcon>
                        </a>
                        <a href="#" className="text-neutral-500 transition-colors hover:text-white">
                            <IIcon icon="solar:twitter-linear" width="18"></IIcon>
                        </a>
                        <a href="#" className="text-neutral-500 transition-colors hover:text-white">
                            <IIcon icon="solar:linkedin-linear" width="18"></IIcon>
                        </a>
                    </div>
                    <div className="flex gap-6 mt-4 md:mt-0 text-[10px] uppercase tracking-wider text-neutral-600">
                        <span className="text-neutral-500 cursor-not-allowed">Privacy</span>
                        <span className="text-neutral-500 cursor-not-allowed">Terms</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
