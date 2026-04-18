import { Link } from 'react-router-dom';
import IIcon from './IIcon';

const CREATORS = [
  { id: 'rs', name: 'Rohit Shetty', handle: '@rohitshetty', role: 'Film Director', initials: 'RS', followers: '142k', posts: 14 },
  { id: 'dp', name: 'Deepika Padukone', handle: '@deepikapadukone', role: 'Actor & Collector', initials: 'DP', followers: '389k', posts: 8 },
  { id: 'vk', name: 'Virat Kohli', handle: '@viratkohli', role: 'Cricketer', initials: 'VK', followers: '512k', posts: 11 },
];

const TRENDING_LOTS = [
  { label: 'Trending · Collectibles', title: '2011 World Cup Jersey', posts: '4.2k bids', time: 'Opens in 6 days', link: '/celebrity/vk' },
  { label: 'Live Now · Jewellery', title: 'Cartier Diamond - Cannes 2018', posts: '₹87.5L current bid', time: '2d 14h left', link: '/auctions/live' },
  { label: 'Trending · Cinema', title: 'Singham Director Chair', posts: '₹4.75L hammer', time: 'Sold', link: '/auctions/results' },
];

interface RightSidebarProps {
  followed: Set<string>;
  toggleFollow: (id: string) => void;
  onRaise?: (id: string) => void;
}

export default function RightSidebar({ followed, toggleFollow, onRaise }: RightSidebarProps) {
  return (
    <div className="flex flex-col h-full w-full">
      
      {/* 1. Your Active Bids */}
      <div className="bg-[#0C0C0C] border border-white/5 rounded-xl mb-4 flex-shrink-0 relative overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-neutral-400 text-[12px] uppercase tracking-wider">Your Active Bids</h3>
        </div>
        {[
          { av: 'HP', name: 'Hardik - IPL Bat', sub: 'Winning · your bid ₹1,20,000', green: true, key: 'hp' },
          { av: 'VK', name: 'Kohli WC Jersey', sub: 'Outbid · your bid ₹80,000', green: false, key: 'vk' },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
            <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-neutral-400">{row.av}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-white truncate">{row.name}</div>
              <div className={`text-xs mt-0.5 ${row.green ? 'text-green-400' : 'text-red-500'}`}>{row.sub}</div>
            </div>
            <button
              onClick={() => {
                if (onRaise) onRaise(row.key);
                else window.location.href = '/auctions/live';
              }}
              className="text-[12px] font-bold px-4 py-1.5 border border-white bg-white text-black hover:bg-neutral-200 transition-all rounded-lg"
            >
              Raise
            </button>
          </div>
        ))}
      </div>

      {/* 2. Live Drops */}
      <div className="bg-[#0C0C0C] border border-white/5 rounded-xl mb-4 flex-shrink-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-500/80" />
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h3 className="font-bold text-white text-[15px]">Live Drops</h3>
          </div>
        </div>
        {TRENDING_LOTS.map((t, i) => (
          <Link to={t.link} key={i} className="block px-5 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 cursor-pointer">
            <p className="text-[10px] text-neutral-500 mb-1 font-semibold tracking-wide uppercase">{t.label}</p>
            <p className="text-[15px] font-semibold text-white mb-1 leading-snug">{t.title}</p>
            <p className="text-[13px] text-neutral-400 font-medium">{t.posts} <span className="mx-1 text-neutral-700">·</span> {t.time}</p>
          </Link>
        ))}
        <Link to="/auctions/live" className="block px-5 py-3 text-[13px] font-semibold text-white hover:bg-white/5 transition-colors text-center">
          Show all live auctions
        </Link>
      </div>

      {/* 3. Verified Creators */}
      <div className="bg-[#0C0C0C] border border-white/5 rounded-xl mb-4 flex-1 flex flex-col pt-1">
        <div className="px-5 py-3 pb-2 border-b border-white/5">
          <h3 className="font-bold text-white text-[15px]">Verified Creators</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {CREATORS.map(c => (
            <div key={c.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
              <Link to={`/celebrity/${c.id}`} className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity">
                <span className="text-xs font-bold text-blue-400">{c.initials}</span>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <Link to={`/celebrity/${c.id}`} className="text-[14px] font-bold text-white truncate hover:underline">{c.name}</Link>
                  <IIcon icon="solar:verified-check-bold" width="13" class="text-blue-400 flex-shrink-0" />
                </div>
                <p className="text-xs text-neutral-500 truncate mt-0.5">{c.handle}</p>
              </div>
              <button 
                onClick={() => toggleFollow(c.id)}
                className={`text-[11px] font-bold px-4 py-1.5 border transition-all flex-shrink-0 tracking-wide rounded-full ${followed.has(c.id)
                  ? 'border-white/20 text-white hover:border-red-400/50 hover:text-red-400'
                  : 'bg-white text-black hover:bg-neutral-200 border-white'
                }`}
              >
                {followed.has(c.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
