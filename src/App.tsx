// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomeHero from './components/HomeHero';
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
import CustomCursor from './components/CustomCursor';
import { supabase } from './lib/supabase';

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [signOutConfirm, setSignOutConfirm] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [walletOpen, setWalletOpen] = useState(false);
  const [openNav, setOpenNav] = useState<'auctions' | 'company' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <>
      <CustomCursor />
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

          {/* AI Chatbot — visible immediately */}
          <AIChatbot visible={true} user={user} onSignInClick={() => setAuthOpen(true)} />

          {/* Wallet Modal */}
          <WalletModal isOpen={walletOpen} onClose={() => setWalletOpen(false)} user={user} />

          {/* Hero Section */}
          <HomeHero />

          {/* Footer removed for secondary pages only */}
        </div>
      </>
      } />
      </Routes>
    </>
  );
}

export default App;

