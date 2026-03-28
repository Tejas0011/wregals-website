import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import IIcon from '../components/IIcon';

interface SellerDashboardProps {
  user: any;
}

const mockChartData = [
  { day: 'Mon', bids: 12, revenue: 15000 },
  { day: 'Tue', bids: 19, revenue: 25000 },
  { day: 'Wed', bids: 30, revenue: 45000 },
  { day: 'Thu', bids: 25, revenue: 38000 },
  { day: 'Fri', bids: 40, revenue: 70000 },
  { day: 'Sat', bids: 55, revenue: 105000 },
  { day: 'Sun', bids: 60, revenue: 120000 },
];

const mockListings = [
  {
    id: 's1',
    item_name: 'Match-Worn 2023 World Cup Jersey — Kohli Signed',
    current_bid: 125000,
    end_time: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    status: 'Live',
    image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop',
    unique_bidders: 24,
    bids_placed: 45
  },
  {
    id: 's2',
    item_name: 'Custom Signature Bat — Final Over',
    current_bid: 0,
    end_time: null,
    status: 'Draft',
    image_url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=800&auto=format&fit=crop',
    unique_bidders: 0,
    bids_placed: 0
  },
  {
    id: 's3',
    item_name: 'Vintage Boxing Gloves — Ali Era Autographed',
    current_bid: 350000,
    end_time: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: 'Ended',
    image_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
    unique_bidders: 68,
    bids_placed: 132
  }
];

export default function SellerDashboard({ user }: SellerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'listings'>('analytics');

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto text-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-[300] tracking-wider uppercase mb-2">Seller Dashboard</h1>
          <p className="text-neutral-400 text-sm tracking-wide">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Seller'}
          </p>
        </div>
        <button className="bg-white text-black px-6 py-3 text-xs tracking-widest uppercase font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
          <IIcon icon="solar:add-square-linear" width="16" />
          Create Listing
        </button>
      </div>

      <div className="flex border-b border-white/10 mb-8 gap-8">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 text-xs font-semibold tracking-widest uppercase transition-colors ${activeTab === 'analytics' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-neutral-400 hover:text-white'}`}
        >
          Overview & Analytics
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-4 text-xs font-semibold tracking-widest uppercase transition-colors ${activeTab === 'listings' ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-neutral-400 hover:text-white'}`}
        >
          My Listings
        </button>
      </div>

      {activeTab === 'analytics' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#121213] border border-white/5 p-6 rounded-sm">
              <div className="flex justify-between items-start mb-4">
                <IIcon icon="solar:wallet-money-linear" width="24" className="text-green-400" />
              </div>
              <p className="text-neutral-500 text-xs tracking-widest uppercase mb-1">Total Earned</p>
              <h3 className="text-2xl font-light font-mono">₹4,75,000</h3>
              <p className="text-xs text-neutral-500 mt-2">Net of Wregals commission</p>
            </div>
            
            <div className="bg-[#121213] border border-white/5 p-6 rounded-sm">
              <div className="flex justify-between items-start mb-4">
                <IIcon icon="solar:tag-horizontal-linear" width="24" className="text-blue-400" />
              </div>
              <p className="text-neutral-500 text-xs tracking-widest uppercase mb-1">Total Listings</p>
              <h3 className="text-2xl font-light font-mono">24</h3>
              <p className="text-xs text-neutral-500 mt-2">4 Live, 18 Ended, 2 Drafts</p>
            </div>
            
            <div className="bg-[#121213] border border-white/5 p-6 rounded-sm">
              <div className="flex justify-between items-start mb-4">
                <IIcon icon="solar:hourglass-linear" width="24" className="text-[#D4AF37]" />
              </div>
              <p className="text-neutral-500 text-xs tracking-widest uppercase mb-1">Avg. Time-to-Sell</p>
              <h3 className="text-2xl font-light font-mono">3.2 Days</h3>
              <p className="text-xs text-neutral-500 mt-2">Historical average</p>
            </div>

            <div className="bg-[#121213] border border-white/5 p-6 rounded-sm">
              <div className="flex justify-between items-start mb-4">
                <IIcon icon="solar:refresh-circle-linear" width="24" className="text-red-400" />
              </div>
              <p className="text-neutral-500 text-xs tracking-widest uppercase mb-1">Return Rate</p>
              <h3 className="text-2xl font-light font-mono">0.0%</h3>
              <p className="text-xs text-neutral-500 mt-2">0 disputed transactions</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#121213] border border-white/5 p-6 rounded-sm">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-neutral-400 mb-6">Weekly Bid Velocity</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
                      itemStyle={{ color: '#D4AF37' }}
                    />
                    <Line type="monotone" dataKey="bids" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#000', stroke: '#D4AF37', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-neutral-500 mt-4 text-center">Bids placed per day across all active listings</p>
            </div>

            <div className="bg-[#121213] border border-white/5 p-6 rounded-sm">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-neutral-400 mb-6">Projected Revenue Growth</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
                      itemStyle={{ color: '#4ade80' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={2} dot={{ fill: '#000', stroke: '#4ade80', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-neutral-500 mt-4 text-center">Cumulative highest bids on active listings</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-[#121213] border border-white/5 px-6 py-4 rounded-sm">
            <h2 className="text-sm tracking-widest uppercase text-neutral-300">All Listings</h2>
            <div className="flex gap-4">
              <span className="text-xs text-neutral-500 uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Live</span>
              <span className="text-xs text-neutral-500 uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Draft</span>
              <span className="text-xs text-neutral-500 uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" /> Ended</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {mockListings.map(listing => (
              <div key={listing.id} className="bg-[#121213] border border-white/5 rounded-sm p-4 flex flex-col md:flex-row gap-6 items-center">
                <img src={listing.image_url} alt={listing.item_name} className="w-full md:w-32 h-32 object-cover rounded-sm grayscale hover:grayscale-0 transition-all" />
                
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <span className={`w-2 h-2 rounded-full ${listing.status === 'Live' ? 'bg-green-500 animate-pulse' : listing.status === 'Draft' ? 'bg-blue-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-neutral-400 uppercase tracking-widest">{listing.status}</span>
                  </div>
                  <h3 className="text-lg font-[300] line-clamp-2 leading-tight">{listing.item_name}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-mono text-neutral-500">
                    <span>{listing.unique_bidders} Bidders</span>
                    <span>•</span>
                    <span>{listing.bids_placed} Bids</span>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                  <p className="text-xs text-neutral-500 uppercase tracking-widest">Highest Bid</p>
                  <p className="text-xl font-mono text-[#D4AF37]">₹{listing.current_bid.toLocaleString()}</p>
                  {listing.status === 'Live' && (
                    <button className="mt-2 w-full md:w-auto border border-white/20 px-6 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                      Manage Live
                    </button>
                  )}
                  {listing.status === 'Draft' && (
                    <button className="mt-2 w-full md:w-auto bg-[#D4AF37] text-black px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#b5952f] transition-colors">
                      Publish
                    </button>
                  )}
                  {listing.status === 'Ended' && (
                    <button className="mt-2 w-full md:w-auto border border-white/20 px-6 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                      View Results
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
