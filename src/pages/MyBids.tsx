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
      <div className="space-y-5">
        {/* Tabs */}
        <div className="flex gap-5 border-b pb-0" style={{ borderColor: 'var(--hh-line)' }}>
          <button className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-3 px-1">Active Bids (2)</button>
          <button className="text-[10px] uppercase tracking-widest font-bold pb-3 px-1 hover:text-white transition-colors" style={{ color: 'var(--hh-w3)' }}>Past Bids</button>
        </div>

        <div className="grid gap-4">
          {BIDS.map((bid, i) => (
            <div
              key={i}
              className="border flex flex-col md:flex-row rounded-xl overflow-hidden group"
              style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}
            >
              <div className="w-full md:w-28 h-28 flex-shrink-0">
                <img src={bid.image} alt={bid.item} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="flex-1 p-5 flex flex-col md:flex-row justify-between items-center gap-5">
                <div className="flex-1 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--hh-w3)' }}>{bid.auction}</p>
                  <h3 className="text-base font-semibold" style={{ color: 'var(--hh-w1)' }}>{bid.item}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${bid.status === 'Winning' ? 'bg-emerald-500' : 'bg-[var(--hh-red)] animate-pulse'}`} />
                    <span className={`text-[10px] uppercase tracking-widest ${bid.status === 'Winning' ? 'text-emerald-500' : 'text-[var(--hh-red)]'}`}>{bid.status}</span>
                  </div>
                </div>

                <div className="flex gap-7 text-center border-x px-7" style={{ borderColor: 'var(--hh-line)' }}>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: 'var(--hh-w3)' }}>Your Bid</p>
                    <p className="text-base font-semibold" style={{ color: 'var(--hh-w1)' }}>₹{bid.myBid.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: 'var(--hh-w3)' }}>Current High</p>
                    <p className="text-base font-semibold text-[#D4AF37]">₹{bid.currentHigh.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <button className="px-5 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] transition-all rounded-sm">
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
