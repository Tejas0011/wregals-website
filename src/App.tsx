// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HeroScroll from './components/HeroScroll';
import AuthModal from './components/AuthModal';
import ProfileSetup from './components/ProfileSetup';
import ProfileSetup2 from './components/ProfileSetup2';
import WalletModal from './components/WalletModal';
import LiveAuctions from './pages/LiveAuctions';
import UpcomingAuctions from './pages/UpcomingAuctions';
import AuctionResults from './pages/AuctionResults';
import About from './pages/About';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Contact from './pages/Contact';
import HowItWorks from './pages/HowItWorks';
import Gallery from './pages/Gallery';
import Social from './pages/Social';
import AIChatbot from './components/AIChatbot';
import IIcon from './components/IIcon';
import { supabase } from './lib/supabase';

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [user, setUser] = useState(null);
  const [signOutConfirm, setSignOutConfirm] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [walletOpen, setWalletOpen] = useState(false);
  const [openNav, setOpenNav] = useState<'auctions' | 'company' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroScrolled, setHeroScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const navCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNavMenu = (menu: 'auctions' | 'company') => {
    if (navCloseTimer.current) clearTimeout(navCloseTimer.current);
    setOpenNav(menu);
  };
  const closeNavMenu = () => {
    navCloseTimer.current = setTimeout(() => setOpenNav(null), 100);
  };

  // Close dropdown when clicking outside the nav
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenNav(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
    <Routes>
      <Route path="/auctions/live" element={
        <LiveAuctions user={user} walletBalance={50000} onSignInClick={() => setAuthOpen(true)} />
      } />
      <Route path="/auctions/upcoming" element={
        <UpcomingAuctions user={user} onSignInClick={() => setAuthOpen(true)} />
      } />
      <Route path="/auctions/results" element={
        <AuctionResults user={user} onSignInClick={() => setAuthOpen(true)} />
      } />
      <Route path="/about" element={
        <About user={user} onSignInClick={() => setAuthOpen(true)} />
      } />
      <Route path="/careers" element={
        <Careers user={user} onSignInClick={() => setAuthOpen(true)} />
      } />
      <Route path="/press" element={
        <Press user={user} onSignInClick={() => setAuthOpen(true)} />
      } />
      <Route path="/contact" element={
        <Contact user={user} onSignInClick={() => setAuthOpen(true)} />
      } />
      <Route path="/how-it-works" element={
        <HowItWorks user={user} onSignInClick={() => setAuthOpen(true)} />
      } />
      <Route path="/gallery" element={
        <Gallery user={user} onSignInClick={() => setAuthOpen(true)} />
      } />
      <Route path="/social" element={
        <Social user={user} onSignInClick={() => setAuthOpen(true)} />
      } />
      <Route path="/*" element={<>
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
              <Link to="/">
                <img src="/wregals-logo-new.png" alt="WREGALS" className="h-16 w-auto object-contain" />
              </Link>

              {/* Desktop Menu */}
              <div ref={navRef} className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase font-medium text-neutral-400">
                {/* Auctions with Dropdown */}
                <div className="relative group" onMouseEnter={() => openNavMenu('auctions')} onMouseLeave={closeNavMenu}>
                  <button
                    onClick={() => setOpenNav(v => v === 'auctions' ? null : 'auctions')}
                    className={`transition-colors duration-300 hover:text-white group-hover:text-white ${openNav === 'auctions' ? 'text-white' : ''}`}
                  >
                    AUCTIONS
                  </button>

                  {/* Full-width Dropdown */}
                  <div onMouseEnter={() => openNavMenu('auctions')} onMouseLeave={closeNavMenu} className={`fixed left-0 right-0 top-20 transition-all duration-300 z-40 ${openNav === 'auctions' ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
                    <div className="bg-[#0A0A0A] border-t border-white/10 py-8 px-6">
                      <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col gap-6">
                          <Link to="/auctions/live" onClick={() => setOpenNav(null)} className="group/item py-3 border-b border-white/5 hover:border-white/20 transition-colors">
                            <h3 className="text-sm font-semibold mb-1 text-white group-hover/item:text-[#D4AF37] transition-colors">Live Auctions</h3>
                            <p className="text-xs text-neutral-500 normal-case tracking-normal">Current active auctions</p>
                          </Link>
                          <Link to="/auctions/upcoming" onClick={() => setOpenNav(null)} className="group/item py-3 border-b border-white/5 hover:border-white/20 transition-colors">
                            <h3 className="text-sm font-semibold mb-1 text-white group-hover/item:text-[#D4AF37] transition-colors">Upcoming Auctions</h3>
                            <p className="text-xs text-neutral-500 normal-case tracking-normal">Preview future events</p>
                          </Link>
                          <Link to="/auctions/results" onClick={() => setOpenNav(null)} className="group/item py-3 border-b border-white/5 hover:border-white/20 transition-colors">
                            <h3 className="text-sm font-semibold mb-1 text-white group-hover/item:text-[#D4AF37] transition-colors">Auction Results</h3>
                            <p className="text-xs text-neutral-500 normal-case tracking-normal">Past auction outcomes</p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Link to="/social" className="transition-colors duration-300 hover:text-white">Social</Link>
                <Link to="/how-it-works" className="transition-colors duration-300 hover:text-white">How It Works</Link>
                <Link to="/gallery" className="transition-colors duration-300 hover:text-white">Gallery</Link>

                {/* Company dropdown */}
                <div className="relative group" onMouseEnter={() => openNavMenu('company')} onMouseLeave={closeNavMenu}>
                  <button
                    onClick={() => setOpenNav(v => v === 'company' ? null : 'company')}
                    className={`transition-colors duration-300 hover:text-white group-hover:text-white ${openNav === 'company' ? 'text-white' : ''}`}
                  >
                    COMPANY
                  </button>

                  <div onMouseEnter={() => openNavMenu('company')} onMouseLeave={closeNavMenu} className={`fixed left-0 right-0 top-20 transition-all duration-300 z-40 ${openNav === 'company' ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
                    <div className="bg-[#0A0A0A] border-t border-white/10 py-8 px-6">
                      <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col gap-6">
                          <Link to="/about" onClick={() => setOpenNav(null)} className="group/item py-3 border-b border-white/5 hover:border-white/20 transition-colors">
                            <h3 className="text-sm font-semibold mb-1 text-white group-hover/item:text-[#D4AF37] transition-colors">About Us</h3>
                            <p className="text-xs text-neutral-500 normal-case tracking-normal">Our mission, story, and team</p>
                          </Link>
                          <Link to="/careers" onClick={() => setOpenNav(null)} className="group/item py-3 border-b border-white/5 hover:border-white/20 transition-colors">
                            <h3 className="text-sm font-semibold mb-1 text-white group-hover/item:text-[#D4AF37] transition-colors">Careers</h3>
                            <p className="text-xs text-neutral-500 normal-case tracking-normal">Join the WREGALS team</p>
                          </Link>
                          <Link to="/press" onClick={() => setOpenNav(null)} className="group/item py-3 border-b border-white/5 hover:border-white/20 transition-colors">
                            <h3 className="text-sm font-semibold mb-1 text-white group-hover/item:text-[#D4AF37] transition-colors">Press</h3>
                            <p className="text-xs text-neutral-500 normal-case tracking-normal">Media resources and enquiries</p>
                          </Link>
                          <Link to="/contact" onClick={() => setOpenNav(null)} className="group/item py-3 border-white/5 hover:border-white/20 transition-colors">
                            <h3 className="text-sm font-semibold mb-1 text-white group-hover/item:text-[#D4AF37] transition-colors">Contact</h3>
                            <p className="text-xs text-neutral-500 normal-case tracking-normal">Get in touch with us</p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                      <button className="user-dropdown-item w-full text-left">
                        <IIcon icon="solar:user-circle-linear" width="16" />
                        My Profile
                      </button>
                      <button
                        onClick={() => setWalletOpen(true)}
                        className="user-dropdown-item w-full text-left"
                      >
                        <IIcon icon="solar:wallet-linear" width="16" />
                        Wallet
                      </button>
                      <button className="user-dropdown-item w-full text-left">
                        <IIcon icon="mdi:gavel" width="16" />
                        My Bids
                      </button>
                      <button className="user-dropdown-item w-full text-left">
                        <IIcon icon="solar:heart-linear" width="16" />
                        Watchlist
                      </button>
                      <button className="user-dropdown-item w-full text-left">
                        <IIcon icon="solar:bell-linear" width="16" />
                        Notifications
                      </button>

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
                          <IIcon icon="solar:logout-2-linear" width="16" />
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
              <button
                className="md:hidden text-white"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
              >
                <IIcon icon="solar:hamburger-menu-linear" width="24"></IIcon>
              </button>
            </div>
          </nav>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md md:hidden">
              <div className="flex justify-between items-center px-6 h-20 border-b border-white/10">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <img src="/wregals-logo-new.png" alt="WREGALS" className="h-12 w-auto object-contain" />
                </Link>
                <button
                  className="text-white"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <IIcon icon="solar:close-square-linear" width="24"></IIcon>
                </button>
              </div>

              <div className="px-6 py-8 space-y-8 text-sm tracking-widest uppercase">
                {/* Auctions */}
                <div className="space-y-3">
                  <p className="text-neutral-500 text-[11px] font-semibold">Auctions</p>
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/auctions/live"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/80 hover:text-white"
                    >
                      Live Auctions
                    </Link>
                    <Link
                      to="/auctions/upcoming"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/80 hover:text-white"
                    >
                      Upcoming Auctions
                    </Link>
                    <Link
                      to="/auctions/results"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/80 hover:text-white"
                    >
                      Auction Results
                    </Link>
                  </div>
                </div>

                {/* Primary links */}
                <div className="space-y-3">
                  <p className="text-neutral-500 text-[11px] font-semibold">Explore</p>
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/social"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/80 hover:text-white"
                    >
                      Social
                    </Link>
                    <Link
                      to="/how-it-works"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/80 hover:text-white"
                    >
                      How It Works
                    </Link>
                    <Link
                      to="/gallery"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/80 hover:text-white"
                    >
                      Gallery
                    </Link>
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-3">
                  <p className="text-neutral-500 text-[11px] font-semibold">Company</p>
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/about"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/80 hover:text-white"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/careers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/80 hover:text-white"
                    >
                      Careers
                    </Link>
                    <Link
                      to="/press"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/80 hover:text-white"
                    >
                      Press
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white/80 hover:text-white"
                    >
                      Contact
                    </Link>
                  </div>
                </div>

                {/* Auth / User actions */}
                <div className="pt-6 border-t border-white/10">
                  {user ? (
                    <div className="space-y-4">
                      <p className="text-[11px] text-neutral-500 font-semibold">Account</p>
                      <button
                        onClick={() => {
                          setWalletOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full border px-4 py-2 text-xs uppercase tracking-wider border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                      >
                        Wallet
                      </button>
                      <button
                        onClick={() => {
                          setSignOutConfirm(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-xs uppercase tracking-wider text-red-400 hover:text-red-300"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setAuthOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full border px-4 py-2 text-xs uppercase tracking-wider border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Auth Modal */}
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

          {/* AI Chatbot — appears after hero scroll completes */}
          <AIChatbot visible={heroScrolled} user={user} onSignInClick={() => setAuthOpen(true)} />

          {/* Wallet Modal */}
          <WalletModal isOpen={walletOpen} onClose={() => setWalletOpen(false)} user={user} />

          {/* Hero Section */}
          <HeroScroll onReady={() => setHeroReady(true)} onAnimationDone={() => setHeroScrolled(true)} />

          {/* Featured Celebrity Auctions */}
          <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b pb-6 border-white/10">
              <div>
                <span className="text-[#D4AF37] text-xs tracking-[0.2em] uppercase mb-2 block">Curated Collection</span>
                <h2 className="text-3xl md:text-4xl serif tracking-tight font-light">Celebrity Archives</h2>
              </div>
              <a href="#" className="hidden md:flex items-center gap-2 text-xs transition-colors uppercase tracking-widest mt-4 md:mt-0 text-neutral-400 hover:text-white">
                View All
                <IIcon icon="solar:arrow-right-linear" width="16"></IIcon>
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

          {/* Social / High-Profile Activity Section */}
          <section className="py-24 bg-[#0A0A0A] relative overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <span className="text-[#D4AF37] text-xs tracking-[0.2em] uppercase">The Inner Circle</span>
                <h2 className="text-3xl md:text-5xl serif tracking-tight font-light text-white">Who's Trading on Wregals</h2>
                <p className="text-neutral-400 font-light text-sm md:text-base leading-relaxed tracking-wide">
                  See what collectors, dignitaries, and cultural icons are discovering. Follow verified portfolios to stay updated on the rarest acquisitions.
                </p>
              </div>

              {/* Social Feed Grid (3 Posts) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative pb-32">
                {/* Post 1 */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-sm font-medium">Marcus Chen</span>
                        <IIcon icon="solar:verified-check-bold" class="text-[#D4AF37] text-sm" />
                      </div>
                      <span className="text-neutral-500 text-xs">@m_chen_collection</span>
                    </div>
                  </div>
                  <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop" alt="Post Image" className="w-full aspect-square object-cover rounded-xl border border-white/5" />
                  <p className="text-neutral-300 text-sm font-light leading-relaxed">
                    Thrilled to add this pristine 1950s Patek to the vault. The provenance verification on <span className="text-[#D4AF37]">@wregals</span> is truly unmatched. 🕰️✨
                  </p>
                  <div className="flex items-center gap-4 pt-2 text-neutral-500 text-xs">
                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"><IIcon icon="solar:heart-linear" width="16" /> 1.2k</div>
                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"><IIcon icon="solar:chat-line-linear" width="16" /> 84</div>
                  </div>
                </div>

                {/* Post 2 */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-sm font-medium">Elena Rodriguez</span>
                        <IIcon icon="solar:verified-check-bold" class="text-[#D4AF37] text-sm" />
                      </div>
                      <span className="text-neutral-500 text-xs">@elena_art_advisors</span>
                    </div>
                  </div>
                  <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop" alt="Post Image" className="w-full aspect-square object-cover rounded-xl border border-white/5" />
                  <p className="text-neutral-300 text-sm font-light leading-relaxed">
                    Just secured this masterpiece for a private client. The smart-escrow system made cross-border settlement completely frictionless.
                  </p>
                  <div className="flex items-center gap-4 pt-2 text-neutral-500 text-xs">
                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"><IIcon icon="solar:heart-linear" width="16" /> 3.4k</div>
                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"><IIcon icon="solar:chat-line-linear" width="16" /> 156</div>
                  </div>
                </div>

                {/* Post 3 */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-colors hidden md:block">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-sm font-medium">James Sterling</span>
                        <IIcon icon="solar:verified-check-bold" class="text-[#D4AF37] text-sm" />
                      </div>
                      <span className="text-neutral-500 text-xs">@sterling_motors</span>
                    </div>
                  </div>
                  <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600&auto=format&fit=crop" alt="Post Image" className="w-full aspect-[4/5] object-cover rounded-xl border border-white/5 bg-neutral-900" />
                  <p className="text-neutral-300 text-sm font-light leading-relaxed">
                    Saying goodbye to an old friend today. Heading to its new owner via <span className="text-[#D4AF37]">@wregals</span>. 🏎️💨
                  </p>
                  <div className="flex items-center gap-4 pt-2 text-neutral-500 text-xs">
                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"><IIcon icon="solar:heart-linear" width="16" /> 5.8k</div>
                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"><IIcon icon="solar:chat-line-linear" width="16" /> 241</div>
                  </div>
                </div>

                {/* Fade Out & CTA Overlay */}
                <div className="absolute bottom-0 left-0 w-full h-[350px] bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent flex flex-col items-center justify-end pb-8">
                  <div className="backdrop-blur-md bg-black/40 border border-[#D4AF37]/30 p-8 rounded-2xl text-center max-w-md w-[90%] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                    <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4 bg-black/50 text-[#D4AF37]">
                      <IIcon icon="solar:lock-keyhole-minimalistic-linear" width="24" />
                    </div>
                    <h4 className="text-white text-xl serif mb-2 tracking-tight">Unlock The Inner Circle</h4>
                    <p className="text-neutral-400 text-xs mb-6 px-4">
                      Create an account or sign in to explore the full social feed, follow collectors, and participate in discussions.
                    </p>
                    <button 
                      onClick={() => setAuthOpen(true)}
                      className="w-full py-3 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors transition-duration-300"
                    >
                      Sign In to Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why WREGALS (Trust Section) */}
          <section className="py-24 bg-[#0B0B0B] border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Trust 1 */}
                <div className="space-y-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border text-[#D4AF37] border-white/10">
                    <IIcon icon="solar:verified-check-linear" width="24" stroke-width="1.5"></IIcon>
                  </div>
                  <h3 className="serif text-2xl font-light text-white">Authenticity Guaranteed</h3>
                  <p className="text-sm leading-relaxed font-light text-neutral-400">
                    Every asset listed on Wregals is verified by world-class appraisers and listed directly by the owner or an authorized estate.
                  </p>
                </div>

                {/* Trust 2 */}
                <div className="space-y-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border text-[#D4AF37] border-white/10">
                    <IIcon icon="solar:graph-up-linear" width="24" stroke-width="1.5"></IIcon>
                  </div>
                  <h3 className="serif text-2xl font-light text-white">True Price Discovery</h3>
                  <p className="text-sm leading-relaxed font-light text-neutral-400">
                    We eliminate dealer markups. Our global auction mechanism ensures assets are sold at their true market value, determined by demand.
                  </p>
                </div>

                {/* Trust 3 */}
                <div className="space-y-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border text-[#D4AF37] border-white/10">
                    <IIcon icon="solar:shield-check-linear" width="24" stroke-width="1.5"></IIcon>
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
                      <IIcon icon="solar:check-read-linear" class="text-[10px] text-black"></IIcon>
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
                      <IIcon icon="solar:alt-arrow-down-linear"></IIcon>
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
                <p className="text-[10px] uppercase tracking-wider text-neutral-600">© 2023 Wregals Inc. All rights reserved.</p>
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
        </div>
      </>
      } />
    </Routes >
  );
}

export default App;

