import AccountLayout from '../components/AccountLayout';

interface MyBidsProps {
  user: any;
  onSignInClick: () => void;
}

const BIDS = [
  { item: 'Match-Worn 2023 World Cup Jersey', auction: 'Blue Heaven Sports', myBid: 85000, currentHigh: 95000, status: 'Outbid', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1473&auto=format&fit=crop' },
  { item: 'Vintage Cricket Bat (1983)', auction: 'Gold Collection', myBid: 42000, currentHigh: 42000, status: 'Winning', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1470&auto=format&fit=crop' },
];

export default function MyBids({ user, onSignInClick }: MyBidsProps) {
  return (
    <AccountLayout user={user} onSignInClick={onSignInClick} title="My Bids">
      <div className="space-y-6">
        <div className="flex gap-4 border-b border-white/5 pb-1">
          <button className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold border-b border-[#D4AF37] pb-3 px-1">Active Bids (2)</button>
          <button className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold pb-3 px-1 hover:text-neutral-300 transition-colors">Past Bids</button>
        </div>

        <div className="grid gap-4">
          {BIDS.map((bid, i) => (
            <div key={i} className="bg-[#3D0808] border border-white/5 flex flex-col md:flex-row rounded-sm overflow-hidden group">
              <div className="w-full md:w-32 h-32 flex-shrink-0">
                <img src={bid.image} alt={bid.item} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-semibold">{bid.auction}</p>
                  <h3 className="text-lg font-light text-white">{bid.item}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${bid.status === 'Winning' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                    <span className={`text-[10px] uppercase tracking-widest ${bid.status === 'Winning' ? 'text-emerald-500' : 'text-red-500'}`}>{bid.status}</span>
                  </div>
                </div>
                
                <div className="flex gap-8 text-center border-x border-white/5 px-8">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">Your Bid</p>
                    <p className="text-lg font-light text-white">₹{bid.myBid.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-neutral-600 mb-1">Current High</p>
                    <p className="text-lg font-light text-[#D4AF37]">₹{bid.currentHigh.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <button className="px-6 py-2.5 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-all">
                  Increase Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}
