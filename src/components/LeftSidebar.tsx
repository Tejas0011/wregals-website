// @ts-nocheck
import { Link, useLocation } from 'react-router-dom';
import IIcon from './IIcon';

const NAV_LINKS = [
  { icon: 'lucide:layout-grid', label: 'Feed', path: '/' },
  { icon: 'lucide:clock', label: 'Live Now', path: '/auctions/live' },
  { icon: 'lucide:heart', label: 'Watchlist', path: '/watchlist' },
  { icon: 'lucide:activity', label: 'My Bids', path: '/my-bids' },
  { icon: 'lucide:credit-card', label: 'Wallet', path: '/wallet' },
];

const CATEGORIES = [
  { label: 'All', color: '#961616' },
  { label: 'Sports', color: '#3B82F6' },
  { label: 'Cinema', color: '#EC4899' },
  { label: 'Music', color: '#8B5CF6' },
  { label: 'Creators', color: '#10B981' },
];


export default function LeftSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <div className="hh-lsidebar">
      {NAV_LINKS.map(({ icon, label, path }) => (
        <Link
          key={label}
          to={path}
          className={`hh-ls-link${isActive(path) ? ' active' : ''}`}
        >
          <span className="hh-ls-icon"><IIcon icon={icon} width={20} /></span>
          {label}
        </Link>
      ))}

      <div className="hh-ls-sep" />
      <div className="hh-ls-section">Browse</div>

      <div className="hh-ls-cats">
        {CATEGORIES.map(({ label, color }) => {
          const path = `/browse/${label.toLowerCase()}`;
          return (
            <Link key={label} to={path} style={{ textDecoration: 'none' }}>
              <div className={`hh-ls-cat${isActive(path) ? ' active' : ''}`}>
                <div className="hh-ls-cat-dot" style={{ background: color }} />
                {label}
              </div>
            </Link>
          );
        })}
      </div>
      <Link to="/categories" style={{ textDecoration: 'none' }}>
        <button className="hh-ls-cat-all">
          <IIcon icon="lucide:plus" width={14} className="mr-2" />
          Browse all categories
        </button>
      </Link>



      <div className="hh-ls-sep" />

      <div className="hh-ls-wallet">
        <div className="hh-lw-label">My Wallet</div>
        <div className="hh-lw-value">₹50,000</div>
        <Link to="/wallet">
          <button className="hh-lw-btn">Add Funds</button>
        </Link>
      </div>
    </div>
  );
}
