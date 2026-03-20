import AccountLayout from '../components/AccountLayout';
import IIcon from '../components/IIcon';

interface WatchlistProps {
  user: any;
  onSignInClick: () => void;
}

const WATCHLIST = [
  { item: 'Rare Sachin Tendulkar Signed Bat', auction: 'Modern Legends', currentBid: 125000, timeLeft: '02h 45m', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1473&auto=format&fit=crop' },
  { item: 'IPL Final Match Ball (2023)', auction: 'Gold Collection', currentBid: 45000, timeLeft: '04d 12h', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1470&auto=format&fit=crop' },
];

export default function Watchlist({ user, onSignInClick }: WatchlistProps) {
  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="Watchlist">
      <div className="space-y-6">
        {WATCHLIST.length > 0 ? (
          <div className="grid gap-4">
            {WATCHLIST.map((item, i) => (
              <div key={i} className="bg-[#3D0808] border border-white/5 flex flex-col md:flex-row rounded-sm overflow-hidden group">
                <div className="w-full md:w-32 h-32 flex-shrink-0 relative">
                  <img src={item.image} alt={item.item} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <button className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-[#D4AF37] hover:bg-white hover:text-black transition-all">
                    <IIcon icon="solar:heart-bold" width="14" />
                  </button>
                </div>
                <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1 space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-semibold">{item.auction}</p>
                    <h3 className="text-lg font-light text-white">{item.item}</h3>
                    <p className="text-[10px] tracking-widest text-neutral-500 mt-2 flex items-center gap-1.5">
                      <IIcon icon="solar:clock-circle-linear" width="12" />
                      {item.timeLeft} remaining
                    </p>
                  </div>
                  
                  <div className="flex gap-8 text-center border-l border-white/5 pl-8 pr-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">Current Bid</p>
                      <p className="text-lg font-light text-[#D4AF37]">₹{item.currentBid.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <button className="px-6 py-2.5 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-all">
                    Place Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-sm">
            <IIcon icon="solar:heart-linear" width="48" class="text-neutral-700 mx-auto mb-4" />
            <h2 className="text-white font-medium mb-2">Your watchlist is empty</h2>
            <p className="text-sm text-neutral-500 mb-6">Find auctions you're interested in and save them here.</p>
            <button className="px-8 py-3 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#c49f2e] transition-colors">
              Explore Auctions
            </button>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
