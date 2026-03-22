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
      <div className="space-y-4">
        {WATCHLIST.length > 0 ? (
          <div className="grid gap-4">
            {WATCHLIST.map((item, i) => (
              <div
                key={i}
                className="border flex flex-col md:flex-row rounded-xl overflow-hidden group"
                style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}
              >
                <div className="w-full md:w-28 h-28 flex-shrink-0 relative">
                  <img src={item.image} alt={item.item} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <button className="absolute top-2 right-2 w-7 h-7 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-[#D4AF37] hover:bg-white hover:text-black transition-all">
                    <IIcon icon="lucide:heart" width="13" />
                  </button>
                </div>
                <div className="flex-1 p-5 flex flex-col md:flex-row justify-between items-center gap-5">
                  <div className="flex-1 space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--hh-w3)' }}>{item.auction}</p>
                    <h3 className="text-base font-semibold" style={{ color: 'var(--hh-w1)' }}>{item.item}</h3>
                    <p className="text-[10px] tracking-widest mt-1.5 flex items-center gap-1.5" style={{ color: 'var(--hh-w3)' }}>
                      <IIcon icon="lucide:clock" width="11" />
                      {item.timeLeft} remaining
                    </p>
                  </div>

                  <div className="flex gap-7 text-center border-l pl-7" style={{ borderColor: 'var(--hh-line)' }}>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: 'var(--hh-w3)' }}>Current Bid</p>
                      <p className="text-base font-semibold text-[#D4AF37]">₹{item.currentBid.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <button className="px-5 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-all rounded-sm">
                    Place Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="py-20 text-center border border-dashed rounded-xl"
            style={{ borderColor: 'var(--hh-line2)' }}
          >
            <IIcon icon="lucide:heart" width="48" className="mx-auto mb-4" style={{ color: 'var(--hh-w3)' }} />
            <h2 className="font-semibold mb-2" style={{ color: 'var(--hh-w1)' }}>Your watchlist is empty</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--hh-w3)' }}>Find auctions you're interested in and save them here.</p>
            <button className="px-8 py-3 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#c49f2e] transition-colors rounded-sm">
              Explore Auctions
            </button>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
