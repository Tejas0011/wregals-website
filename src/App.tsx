// @ts-nocheck
import { useState, useEffect } from 'react';
import HeroScroll from './components/HeroScroll';
import AuthModal from './components/AuthModal';
import ProfileSetup from './components/ProfileSetup';
import ProfileSetup2 from './components/ProfileSetup2';
import { supabase } from './lib/supabase';

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [user, setUser] = useState(null);
  const [signOutConfirm, setSignOutConfirm] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [setupStep, setSetupStep] = useState(1);

  // Step-1 form state — lifted here so it survives navigation to/from Step 2
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCountry, setProfileCountry] = useState('');
  const [profileHeardSource, setProfileHeardSource] = useState<string[]>([]);

  // Lock body scroll when profile setup is open
  useEffect(() => {
    if (showProfileSetup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showProfileSetup]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    // Listen for auth changes (login, logout, OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setAuthOpen(false);
        // Show profile setup if profile hasn't been completed yet
        if (!session.user.user_metadata?.profile_completed) {
          setShowProfileSetup(true);
        }
      } else {
        setShowProfileSetup(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {/* Profile Setup — shown on first login */}
      {showProfileSetup && user && setupStep === 1 && (
        <ProfileSetup
          user={user}
          onNext={() => setSetupStep(2)}
          onDismiss={() => setShowProfileSetup(false)}
          displayName={profileName}
          setDisplayName={setProfileName}
          phone={profilePhone}
          setPhone={setProfilePhone}
          country={profileCountry}
          setCountry={setProfileCountry}
          heardSource={profileHeardSource}
          setHeardSource={setProfileHeardSource}
        />
      )}
      {showProfileSetup && user && setupStep === 2 && (
        <ProfileSetup2
          user={user}
          onComplete={() => setShowProfileSetup(false)}
          onBack={() => setSetupStep(1)}
          onDismiss={() => setShowProfileSetup(false)}
        />
      )}

      <div className="bg-[#080808] overflow-x-hidden selection:bg-[#D4AF37] selection:text-black text-white min-h-screen">
        {/* Navigation */}
        <nav
          className="fixed top-0 w-full z-50 bg-[#080808]/80 backdrop-blur-md border-b border-white/5"
          style={{
            opacity: heroReady ? 1 : 0,
            pointerEvents: heroReady ? 'auto' : 'none',
            transition: 'opacity 0.8s ease',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <a href="/">
              <img src="/wregals-logo-new.png" alt="WREGALS" className="h-16 w-auto object-contain" />
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase font-medium text-neutral-400">
              {/* Auctions with Dropdown */}
              <div className="relative group">
                <a href="#" className="transition-colors duration-300 hover:text-white">Auctions</a>

                {/* Full-width Dropdown */}
                <div className="fixed left-0 right-0 top-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible transition-all duration-300 z-40">
                  <div className="bg-[#0A0A0A] border-t border-white/10 py-8 px-6">
                    <div className="max-w-7xl mx-auto">
                      <div className="flex flex-col gap-6">
                        <a href="#" className="group/item py-3 border-b border-white/5 hover:border-white/20 transition-colors">
                          <h3 className="text-sm font-semibold mb-1 text-white group-hover/item:text-[#D4AF37] transition-colors">Live Auctions</h3>
                          <p className="text-xs text-neutral-500 normal-case tracking-normal">Current active auctions</p>
                        </a>
                        <a href="#" className="group/item py-3 border-b border-white/5 hover:border-white/20 transition-colors">
                          <h3 className="text-sm font-semibold mb-1 text-white group-hover/item:text-[#D4AF37] transition-colors">Upcoming Auctions</h3>
                          <p className="text-xs text-neutral-500 normal-case tracking-normal">Preview future events</p>
                        </a>
                        <a href="#" className="group/item py-3 border-b border-white/5 hover:border-white/20 transition-colors">
                          <h3 className="text-sm font-semibold mb-1 text-white group-hover/item:text-[#D4AF37] transition-colors">Auction Results</h3>
                          <p className="text-xs text-neutral-500 normal-case tracking-normal">Past auction outcomes</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a href="#" className="transition-colors duration-300 hover:text-white">About</a>
              <a href="#how-it-works" className="transition-colors duration-300 hover:text-white">How It Works</a>
              <a href="#" className="transition-colors duration-300 hover:text-white">Gallery</a>
            </div>

            {/* Sign In / User Dropdown */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <div className="relative group/user">
                  {/* Trigger — user avatar or generic icon */}
                  <button className="user-avatar-btn">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="user-avatar-initials">
                        {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                      </span>
                    )}
                  </button>

                  {/* Dropdown panel */}
                  <div className="user-dropdown">
                    {/* Header — name + email */}
                    <div className="user-dropdown-header">
                      <div className="user-dropdown-avatar">
                        {user.user_metadata?.avatar_url ? (
                          <img src={user.user_metadata.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <span className="user-avatar-initials user-avatar-initials--lg">
                            {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="user-dropdown-identity">
                        <p className="user-dropdown-name">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="user-dropdown-email">{user.email}</p>
                      </div>
                    </div>

                    <div className="user-dropdown-divider" />

                    {/* Menu items */}
                    <a href="#" className="user-dropdown-item">
                      <iconify-icon icon="solar:user-circle-linear" width="16" />
                      My Profile
                    </a>
                    <a href="#" className="user-dropdown-item">
                      <iconify-icon icon="mdi:gavel" width="16" />
                      My Bids
                    </a>
                    <a href="#" className="user-dropdown-item">
                      <iconify-icon icon="solar:heart-linear" width="16" />
                      Watchlist
                    </a>
                    <a href="#" className="user-dropdown-item">
                      <iconify-icon icon="solar:bell-linear" width="16" />
                      Notifications
                    </a>

                    <div className="user-dropdown-divider" />

                    {signOutConfirm ? (
                      <div className="user-dropdown-confirm">
                        <span className="user-dropdown-confirm-text">Confirm sign out?</span>
                        <div className="user-dropdown-confirm-actions">
                          <button
                            onClick={() => { supabase.auth.signOut(); setSignOutConfirm(false); }}
                            className="user-dropdown-confirm-yes"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setSignOutConfirm(false)}
                            className="user-dropdown-confirm-cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSignOutConfirm(true)}
                        className="user-dropdown-item user-dropdown-signout"
                      >
                        <iconify-icon icon="solar:logout-2-linear" width="16" />
                        Sign Out
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="border px-5 py-2 text-xs uppercase tracking-wider transition-all duration-500 rounded-sm border-white/20 hover:bg-white hover:text-black"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <button className="md:hidden text-white">
              <iconify-icon icon="solar:hamburger-menu-linear" width="24"></iconify-icon>
            </button>
          </div>
        </nav>

        {/* Auth Modal */}
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

        {/* Hero Section */}
        <HeroScroll onReady={() => setHeroReady(true)} />

        {/* Featured Celebrity Auctions */}
        <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b pb-6 border-white/10">
            <div>
              <span className="text-[#D4AF37] text-xs tracking-[0.2em] uppercase mb-2 block">Curated Collection</span>
              <h2 className="text-3xl md:text-4xl serif tracking-tight font-light">Celebrity Archives</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-xs transition-colors uppercase tracking-widest mt-4 md:mt-0 text-neutral-400 hover:text-white">
              View All
              <iconify-icon icon="solar:arrow-right-linear" width="16"></iconify-icon>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8">
            {/* Card 1 */}
            <article className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111] mb-6 rounded-sm">
                <img src="https://images.unsplash.com/photo-1617317376997-8748e6862c01?q=80&w=2070&auto=format&fit=crop" alt="Luxury Watch" className="w-full h-full object-cover img-reveal transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 backdrop-blur-sm px-3 py-1 border rounded-sm bg-black/60 border-white/10">
                  <span className="text-[10px] uppercase tracking-widest flex items-center gap-2 text-white">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Live
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl md:text-2xl tracking-tight group-hover:text-[#D4AF37] transition-colors text-white">1968 Daytona "Paul Newman"</h3>
                </div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">Ex-Collection: John Legend</p>
                <div className="flex justify-between items-end pt-3 border-t mt-3 border-white/5">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase">Current Bid</p>
                    <p className="font-mono text-sm text-neutral-300">$450,000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-500 uppercase">Ends In</p>
                    <p className="font-mono text-sm text-neutral-300">04h 21m</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 2 */}
            <article className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111] mb-6 rounded-sm">
                <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg" alt="Vintage Car" className="w-full h-full object-cover img-reveal transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 backdrop-blur-sm px-3 py-1 border rounded-sm bg-black/60 border-white/10">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-300">Upcoming</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl md:text-2xl tracking-tight group-hover:text-[#D4AF37] transition-colors text-white">1955 Porsche 550 Spyder</h3>
                </div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">Ex-Collection: Steve McQueen Estate</p>
                <div className="flex justify-between items-end pt-3 border-t mt-3 border-white/5">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase">Starting Bid</p>
                    <p className="font-mono text-sm text-neutral-300">$3,200,000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-500 uppercase">Opens In</p>
                    <p className="font-mono text-sm text-neutral-300">2 Days</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 3 */}
            <article className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111] mb-6 rounded-sm">
                <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop" alt="Diamond Ring" className="w-full h-full object-cover img-reveal transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 backdrop-blur-sm px-3 py-1 border rounded-sm bg-black/60 border-white/10">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-300">Reserve Met</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl md:text-2xl tracking-tight group-hover:text-[#D4AF37] transition-colors text-white">Cartier Panthère Ring</h3>
                </div>
                <p className="text-xs uppercase tracking-wider text-neutral-500">Ex-Collection: Elizabeth Taylor</p>
                <div className="flex justify-between items-end pt-3 border-t mt-3 border-white/5">
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase">Current Bid</p>
                    <p className="font-mono text-sm text-neutral-300">$185,000</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-500 uppercase">Ends In</p>
                    <p className="font-mono text-sm text-neutral-300">12m 30s</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Why WREGALS (Trust Section) */}
        <section className="py-24 bg-[#0B0B0B] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Trust 1 */}
              <div className="space-y-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border text-[#D4AF37] border-white/10">
                  <iconify-icon icon="solar:verified-check-linear" width="24" stroke-width="1.5"></iconify-icon>
                </div>
                <h3 className="serif text-2xl font-light text-white">Authenticity Guaranteed</h3>
                <p className="text-sm leading-relaxed font-light text-neutral-400">
                  Every asset listed on Wregals is verified by world-class appraisers and listed directly by the owner or an authorized estate.
                </p>
              </div>

              {/* Trust 2 */}
              <div className="space-y-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border text-[#D4AF37] border-white/10">
                  <iconify-icon icon="solar:graph-up-linear" width="24" stroke-width="1.5"></iconify-icon>
                </div>
                <h3 className="serif text-2xl font-light text-white">True Price Discovery</h3>
                <p className="text-sm leading-relaxed font-light text-neutral-400">
                  We eliminate dealer markups. Our global auction mechanism ensures assets are sold at their true market value, determined by demand.
                </p>
              </div>

              {/* Trust 3 */}
              <div className="space-y-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full border text-[#D4AF37] border-white/10">
                  <iconify-icon icon="solar:shield-check-linear" width="24" stroke-width="1.5"></iconify-icon>
                </div>
                <h3 className="serif text-2xl font-light text-white">Secure Escrow</h3>
                <p className="text-sm leading-relaxed font-light text-neutral-400">
                  Funds are held in an institutional-grade smart escrow system and are only released once the buyer has received and verified the asset.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Public Auctions */}
        <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Sidebar / Filters */}
            <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
              <h3 className="serif text-2xl mb-6 text-white">Marketplace</h3>

              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3">Categories</p>
                <label className="custom-checkbox flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="peer hidden" defaultChecked />
                  <div className="w-4 h-4 border rounded-sm flex items-center justify-center transition-all group-hover:border-white border-white/20">
                    <iconify-icon icon="solar:check-read-linear" class="text-[10px] text-black"></iconify-icon>
                  </div>
                  <span className="text-sm group-hover:text-white transition-colors text-neutral-300">Watches</span>
                </label>
                <label className="custom-checkbox flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="peer hidden" />
                  <div className="w-4 h-4 border rounded-sm flex items-center justify-center transition-all group-hover:border-white border-white/20"></div>
                  <span className="text-sm group-hover:text-white transition-colors text-neutral-300">Fine Art</span>
                </label>
                <label className="custom-checkbox flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="peer hidden" />
                  <div className="w-4 h-4 border rounded-sm flex items-center justify-center transition-all group-hover:border-white border-white/20"></div>
                  <span className="text-sm group-hover:text-white transition-colors text-neutral-300">Memorabilia</span>
                </label>
                <label className="custom-checkbox flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="peer hidden" />
                  <div className="w-4 h-4 border rounded-sm flex items-center justify-center transition-all group-hover:border-white border-white/20"></div>
                  <span className="text-sm group-hover:text-white transition-colors text-neutral-300">Real Estate</span>
                </label>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3">Price Range</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">$</span>
                  <input type="text" defaultValue="10,000" className="w-full bg-transparent border-b text-sm py-1 focus:outline-none focus:border-[#D4AF37] font-mono border-white/20 text-white" />
                </div>
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <p className="text-xs text-neutral-500"><span className="text-white">124</span> Verified Lots Available</p>
                <div className="flex items-center gap-4">
                  <button className="text-xs uppercase tracking-wider flex items-center gap-1 text-neutral-400 hover:text-white">
                    Sort by: Ending Soon
                    <iconify-icon icon="solar:alt-arrow-down-linear"></iconify-icon>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* List Item 1 */}
                <div className="group relative flex flex-col md:flex-row items-center gap-6 p-4 border bg-[#0F0F0F] hover:bg-[#141414] transition-all duration-300 rounded-sm border-white/5 hover:border-white/20">
                  <div className="w-full md:w-32 h-32 bg-[#1a1a1a] flex-shrink-0 overflow-hidden rounded-sm">
                    <img src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" alt="Item" />
                  </div>
                  <div className="flex-1 w-full text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <span className="px-2 py-0.5 border text-[10px] uppercase border-white/10 text-neutral-400">Fine Art</span>
                      <span className="px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] uppercase">Verified Seller</span>
                    </div>
                    <h4 className="text-xl tracking-tight mb-1 text-white">Banksy "Girl with Balloon" (Print)</h4>
                    <p className="text-xs text-neutral-500">Lot #8492 • London, UK</p>
                  </div>
                  <div className="w-full md:w-auto text-center md:text-right px-4 md:border-l border-white/5">
                    <p className="text-[10px] text-neutral-500 uppercase mb-1">Current Bid</p>
                    <p className="font-mono text-lg mb-2 text-white">$85,000</p>
                    <button className="w-full md:w-auto text-xs uppercase tracking-wider border px-4 py-2 transition-colors border-white/20 hover:border-white">
                      Place Bid
                    </button>
                  </div>
                </div>

                {/* List Item 2 */}
                <div className="group relative flex flex-col md:flex-row items-center gap-6 p-4 border bg-[#0F0F0F] hover:bg-[#141414] transition-all duration-300 rounded-sm border-white/5 hover:border-white/20">
                  <div className="w-full md:w-32 h-32 bg-[#1a1a1a] flex-shrink-0 overflow-hidden rounded-sm">
                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" alt="Item" />
                  </div>
                  <div className="flex-1 w-full text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <span className="px-2 py-0.5 border text-[10px] uppercase border-white/10 text-neutral-400">Horology</span>
                    </div>
                    <h4 className="text-xl tracking-tight mb-1 text-white">Patek Philippe Nautilus 5711</h4>
                    <p className="text-xs text-neutral-500">Lot #9921 • Geneva, CH</p>
                  </div>
                  <div className="w-full md:w-auto text-center md:text-right px-4 md:border-l border-white/5">
                    <p className="text-[10px] text-neutral-500 uppercase mb-1">Current Bid</p>
                    <p className="font-mono text-lg mb-2 text-white">$112,500</p>
                    <button className="w-full md:w-auto text-xs uppercase tracking-wider border px-4 py-2 transition-colors border-white/20 hover:border-white">
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <button className="text-xs uppercase tracking-widest border-b border-transparent pb-1 transition-all hover:border-white text-neutral-400 hover:text-white">Load More Assets</button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-[#0A0A0A] scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="serif text-3xl md:text-4xl font-light mb-4">Acquisition Process</h2>
              <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] -z-0 bg-white/5"></div>

              {/* Step 1 */}
              <div className="relative z-10 text-center md:text-left group">
                <div className="w-24 h-24 bg-[#0A0A0A] md:pr-4 pb-4 mx-auto md:mx-0">
                  <span className="text-4xl serif group-hover:text-[#D4AF37] transition-colors duration-500 text-neutral-700">01</span>
                </div>
                <h4 className="text-lg font-normal mb-2 text-white">Discover</h4>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Browse our curated selection of rare assets from verified celebrity estates and collectors.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 text-center md:text-left group">
                <div className="w-24 h-24 bg-[#0A0A0A] md:pr-4 pb-4 mx-auto md:mx-0">
                  <span className="text-4xl serif group-hover:text-[#D4AF37] transition-colors duration-500 text-neutral-700">02</span>
                </div>
                <h4 className="text-lg font-normal mb-2 text-white">Bid</h4>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Place competitive bids in real-time. Our transparent system ensures fair market discovery.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 text-center md:text-left group">
                <div className="w-24 h-24 bg-[#0A0A0A] md:pr-4 pb-4 mx-auto md:mx-0">
                  <span className="text-4xl serif group-hover:text-[#D4AF37] transition-colors duration-500 text-neutral-700">03</span>
                </div>
                <h4 className="text-lg font-normal mb-2 text-white">Secure</h4>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Winners transfer funds to our secure escrow service. Money is protected until delivery.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 text-center md:text-left group">
                <div className="w-24 h-24 bg-[#0A0A0A] md:pr-4 pb-4 mx-auto md:mx-0">
                  <span className="text-4xl serif group-hover:text-[#D4AF37] transition-colors duration-500 text-neutral-700">04</span>
                </div>
                <h4 className="text-lg font-normal mb-2 text-white">Possess</h4>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Assets are authenticated, shipped via armored courier, and released to your custody.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-20 pb-10 border-t bg-black border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              <div className="md:col-span-1">
                <a href="#" className="text-xl serif tracking-tighter uppercase mb-6 block text-white">WREGALS</a>
                <p className="text-xs text-neutral-500 leading-relaxed font-light">
                  The definitive digital auction house for the world's most significant assets.
                </p>
              </div>

              <div className="md:col-span-1">
                <h5 className="text-xs font-semibold uppercase tracking-widest mb-6 text-white">Platform</h5>
                <ul className="space-y-4 text-xs text-neutral-500 font-light">
                  <li><a href="#" className="transition-colors hover:text-white">About Wregals</a></li>
                  <li><a href="#" className="transition-colors hover:text-white">Celebrity Partners</a></li>
                  <li><a href="#" className="transition-colors hover:text-white">Careers</a></li>
                  <li><a href="#" className="transition-colors hover:text-white">Press Room</a></li>
                </ul>
              </div>

              <div className="md:col-span-1">
                <h5 className="text-xs font-semibold uppercase tracking-widest mb-6 text-white">Support</h5>
                <ul className="space-y-4 text-xs text-neutral-500 font-light">
                  <li><a href="#" className="transition-colors hover:text-white">Trust & Safety</a></li>
                  <li><a href="#" className="transition-colors hover:text-white">Authentication</a></li>
                  <li><a href="#" className="transition-colors hover:text-white">Shipping & Returns</a></li>
                  <li><a href="#" className="transition-colors hover:text-white">Concierge</a></li>
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
              <p className="text-[10px] uppercase tracking-wider text-neutral-600">© 2023 Wregals Inc. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-neutral-500 transition-colors hover:text-white">
                  <iconify-icon icon="solar:instagram-linear" width="18"></iconify-icon>
                </a>
                <a href="#" className="text-neutral-500 transition-colors hover:text-white">
                  <iconify-icon icon="solar:twitter-linear" width="18"></iconify-icon>
                </a>
                <a href="#" className="text-neutral-500 transition-colors hover:text-white">
                  <iconify-icon icon="solar:linkedin-linear" width="18"></iconify-icon>
                </a>
              </div>
              <div className="flex gap-6 mt-4 md:mt-0 text-[10px] uppercase tracking-wider text-neutral-600">
                <a href="#" className="hover:text-neutral-400">Privacy</a>
                <a href="#" className="hover:text-neutral-400">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;

