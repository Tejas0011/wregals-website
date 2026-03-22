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
  { label: 'My Profile', icon: 'lucide:user', path: '/profile' },
  { label: 'Wallet', icon: 'lucide:credit-card', path: '/wallet' },
  { label: 'My Bids', icon: 'lucide:activity', path: '/my-bids' },
  { label: 'Watchlist', icon: 'lucide:heart', path: '/watchlist' },
  { label: 'Notifications', icon: 'lucide:bell', path: '/notifications' },
  { label: 'Settings', icon: 'lucide:settings', path: '/settings' },
];

export default function AccountLayout({ children, title }: AccountLayoutProps) {
  const location = useLocation();

  return (
    <div style={{ background: 'var(--hh-bg)' }} className="min-h-screen text-white flex flex-col">
      {/* Sidebar */}
      <aside
        className="w-[240px] hidden md:flex flex-col fixed top-20 left-0 h-[calc(100vh-5rem)] border-r z-30"
        style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}
      >
        <div className="pt-2" />

        {/* Section label */}
        <div className="px-5 pt-6 pb-2">
          <p className="text-[9px] uppercase tracking-[0.16em] font-bold" style={{ color: 'var(--hh-w3)' }}>
            Account
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group"
                style={{
                  background: isActive ? 'var(--hh-s2)' : 'transparent',
                  color: isActive ? 'var(--hh-w1)' : 'var(--hh-w3)',
                }}
              >
                <IIcon icon={item.icon} width={18} />
                <span className="text-[13px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom — back to home */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--hh-line)' }}>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all"
            style={{ color: 'var(--hh-w3)' }}
          >
            <IIcon icon="lucide:arrow-left" width={16} />
            <span className="text-[12px] font-medium">Back to Home</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-[240px] pt-20">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Breadcrumb + title */}
          <header className="mb-10">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--hh-w3)' }}>
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span style={{ color: '#D4AF37' }}>{title}</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--hh-w1)' }}>{title}</h1>
            <div className="h-px w-16 mt-3" style={{ background: 'rgba(212,175,55,0.4)' }} />
          </header>

          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
