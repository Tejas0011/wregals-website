import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import IIcon from './IIcon';
import Footer from './Footer';

interface AccountLayoutProps {
  user: any;
  onSignInClick: () => void;
  children: ReactNode;
  title: string;
}

const MENU_ITEMS = [
  { label: 'My Profile', icon: 'solar:user-circle-linear', path: '/profile' },
  { label: 'Wallet', icon: 'solar:wallet-linear', path: '/wallet' },
  { label: 'My Bids', icon: 'mdi:gavel', path: '/my-bids' },
  { label: 'Watchlist', icon: 'solar:heart-linear', path: '/watchlist' },
  { label: 'Notifications', icon: 'solar:bell-linear', path: '/notifications' },
];

export default function AccountLayout({ user, onSignInClick, children, title }: AccountLayoutProps) {
  const location = useLocation();

  return (
    <div className="bg-[#3D0808] min-h-screen text-white flex flex-col">
      {/* Shared Nav (simplified for account pages) */}
      <nav className="fixed top-0 w-full z-50 bg-[#3D0808]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <img src="/wregals-logo-new.png" alt="WREGALS" className="h-12 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-6 text-xs tracking-widest uppercase text-neutral-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/auctions/live" className="hover:text-white transition-colors hidden md:block">Auctions</Link>
            {user ? (
              <span className="text-neutral-300 hidden md:block">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
            ) : (
              <button
                onClick={onSignInClick}
                className="border px-4 py-1.5 rounded-sm border-white/20 hover:bg-white hover:text-black transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 hidden md:flex flex-col border-r border-white/10 bg-[#3D0808] fixed h-[calc(100vh-64px)] overflow-y-auto">
          <div className="p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] mb-8 font-semibold">
              Account Settings
            </p>
            <nav className="space-y-1">
              {MENU_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 group ${
                      isActive
                        ? 'bg-[#D4AF37]/10 text-white'
                        : 'text-neutral-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <IIcon
                      icon={item.icon}
                      width="18"
                      class={`transition-colors ${
                        isActive ? 'text-[#D4AF37]' : 'text-neutral-600 group-hover:text-neutral-400'
                      }`}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1 h-4 bg-[#D4AF37] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-white/10">
            <div className="bg-white/5 p-4 rounded-sm border border-white/10">
              <p className="text-[9px] uppercase tracking-widest text-neutral-500 mb-2">Need Help?</p>
              <Link to="/contact" className="text-xs text-neutral-400 hover:text-[#D4AF37] transition-colors">
                Contact Concierge
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 bg-[#3D0808]">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <header className="mb-12">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-500 mb-4">
                <Link to="/" className="hover:text-neutral-300 transition-colors">Dashboard</Link>
                <span>/</span>
                <span className="text-[#D4AF37]">{title}</span>
              </div>
              <h1 className="text-4xl font-light tracking-tight text-white mb-2">{title}</h1>
              <div className="h-px w-24 bg-[#D4AF37]/40" />
            </header>

            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
