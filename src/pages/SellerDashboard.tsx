// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import IIcon from '../components/IIcon';
import { supabase } from '../lib/supabase';

interface SellerDashboardProps {
  user: any;
}

function fmt(n: number) { return '₹' + n.toLocaleString('en-IN'); }

const CHART_TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: 12 },
  itemStyle: { color: '#ffffff' },
  labelStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
};

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs">
        <p className="text-neutral-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}: <span className="font-semibold">{prefix}{typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}{suffix}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function KpiCard({ label, value, sub, trend = null, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="bg-[#0d0d0d] border border-white/5 p-5 flex flex-col rounded-sm hover:border-white/15 transition-all group cursor-pointer h-full relative"
    >
      {trend !== null && (
        <span className={`absolute top-5 right-5 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded ${trend >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
      <p className="text-white text-xs font-semibold uppercase tracking-wider mb-2 pr-10">{label}</p>
      <h3 className="text-2xl font-semibold tracking-tight text-white mb-1">{value}</h3>
      {sub && <p className="text-[11px] text-neutral-500">{sub}</p>}
    </div>
  );
}

function SectionTitle({ children }: any) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <h2 className="text-sm font-semibold text-white">{children}</h2>
    </div>
  );
}

function KpiDetailPanel({ metric, onClose }: { metric: { label: string; definition: string; formula: string; tip: string } | null; onClose: () => void }) {
  if (!metric) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full max-w-xl bg-[#0d0d0d] border border-white/10 rounded-sm p-6 relative shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-600 hover:text-white transition-colors text-lg leading-none"
        >✕</button>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          <p className="text-xs font-semibold text-white">{metric.label}</p>
        </div>
        <p className="text-sm text-neutral-300 font-light leading-relaxed mb-4">{metric.definition}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-sm px-4 py-3">
            <p className="text-[9px] tracking-widest uppercase text-neutral-600 mb-1">Formula</p>
            <p className="text-xs text-neutral-300">{metric.formula}</p>
          </div>
          <div className="flex-1 bg-blue-500/5 border border-blue-500/20 rounded-sm px-4 py-3">
            <p className="text-[9px] tracking-widest uppercase text-neutral-600 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-sm bg-blue-400" /> PRO TIP
            </p>
            <p className="text-xs text-neutral-300 font-light">{metric.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const weeklyDataZero = [
  { day: 'Mon', bids: 0, revenue: 0, views: 0, watchers: 0 },
  { day: 'Tue', bids: 0, revenue: 0, views: 0, watchers: 0 },
  { day: 'Wed', bids: 0, revenue: 0, views: 0, watchers: 0 },
  { day: 'Thu', bids: 0, revenue: 0, views: 0, watchers: 0 },
  { day: 'Fri', bids: 0, revenue: 0, views: 0, watchers: 0 },
  { day: 'Sat', bids: 0, revenue: 0, views: 0, watchers: 0 },
  { day: 'Sun', bids: 0, revenue: 0, views: 0, watchers: 0 },
];

const promotionEngagementDataZero = [
  { day: 'Mon', ribbon: 0, popup: 0, organic: 0 },
  { day: 'Tue', ribbon: 0, popup: 0, organic: 0 },
  { day: 'Wed', ribbon: 0, popup: 0, organic: 0 },
  { day: 'Thu', ribbon: 0, popup: 0, organic: 0 },
  { day: 'Fri', ribbon: 0, popup: 0, organic: 0 },
  { day: 'Sat', ribbon: 0, popup: 0, organic: 0 },
  { day: 'Sun', ribbon: 0, popup: 0, organic: 0 },
];

const monthlyPromoDataZero = [
  { month: 'Oct', impressions: 0, clicks: 0, ribbon: 0, popup: 0 },
  { month: 'Nov', impressions: 0, clicks: 0, ribbon: 0, popup: 0 },
  { month: 'Dec', impressions: 0, clicks: 0, ribbon: 0, popup: 0 },
  { month: 'Jan', impressions: 0, clicks: 0, ribbon: 0, popup: 0 },
  { month: 'Feb', impressions: 0, clicks: 0, ribbon: 0, popup: 0 },
  { month: 'Mar', impressions: 0, clicks: 0, ribbon: 0, popup: 0 },
];

export default function SellerDashboard({ user }: SellerDashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics' | 'listings'>('analytics');
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedPromoListing, setSelectedPromoListing] = useState<string | null>(null);
  const [selectedPromoType, setSelectedPromoType] = useState<string | null>(null);
  const [activeKpi, setActiveKpi] = useState<{ label: string; definition: string; formula: string; tip: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const kpiDefs: Record<string, { label: string; definition: string; formula: string; tip: string }> = {
    'Total Earned': {
      label: 'Total Earned',
      definition: 'The total net amount credited to your seller account after all auction settlements, excluding Wregals platform fees.',
      formula: 'Sum of all winning bids − Platform fee',
      tip: 'Higher reserve prices and better-quality provenance photos consistently result in higher final bids.',
    },
    'Total Listings': {
      label: 'Total Listings',
      definition: 'The total number of auction listings created under your account across all statuses - Live, Ended, and Draft.',
      formula: 'Live + Ended + Draft listings',
      tip: 'Sellers with 10+ listings on average see 40% more returning bidders.',
    },
    'Total Bidders': {
      label: 'Total Bidders',
      definition: 'The count of unique registered users who have placed at least one bid on any of your listings.',
      formula: 'Unique bidder accounts across all listings',
      tip: 'Engaging with watchers via Promotion Ribbon can convert them into active bidders.',
    },
    'Avg. Time-to-Sell': {
      label: 'Avg. Time-to-Sell',
      definition: 'The average number of days from when a listing goes live to when it closes with a winning bid.',
      formula: 'Sum of (end date − start date) for all sold listings ÷ number of sold listings',
      tip: 'Auctions ending on Saturday evenings historically attract the highest bid counts.',
    },
    'Return Rate': {
      label: 'Return Rate',
      definition: 'The percentage of your completed auctions that resulted in a dispute, cancellation, or non-payment from the winning bidder.',
      formula: '(Disputed / cancelled auctions ÷ Total closed auctions) × 100',
      tip: 'A 0% return rate boosts your Seller Trust Score, making your listings rank higher in search.',
    },
    'Avg. Bid Increment': {
      label: 'Avg. Bid Increment',
      definition: 'The average amount by which each successive bid exceeds the previous one across all your auctions.',
      formula: 'Total bid value increase across all bids ÷ Total number of bids placed',
      tip: 'A higher average increment signals strong competitive interest - great for future pricing strategy.',
    },
    'Active Promotions': {
      label: 'Active Promotions',
      definition: 'The number of promotion campaigns currently running for your listings, including Ribbon and Login Popup types.',
      formula: 'Count of promotions with status = Active',
      tip: 'Running both Ribbon and Popup simultaneously gives a 2.3× higher impression rate than either alone.',
    },
    'Total Impressions': {
      label: 'Total Impressions',
      definition: 'The total number of times your promoted listings were displayed to users this week - from both the Ribbon and Login Popup channels.',
      formula: 'Ribbon impressions + Popup impressions',
      tip: 'Impressions above 20K/week correlate strongly with a 30%+ increase in new bidder sign-ups.',
    },
    'Promo Clicks': {
      label: 'Promo Clicks',
      definition: 'The total number of times users clicked on your promoted listing from either the Promotion Ribbon or Login Popup to view your auction.',
      formula: 'Ribbon clicks + Popup clicks',
      tip: 'Titles under 60 characters with the celebrity name upfront see 2× higher click-through rates.',
    },
    'Avg. Promo CTR': {
      label: 'Avg. Promo CTR',
      definition: 'Click-Through Rate - the percentage of impressions that resulted in a click on your promoted listing.',
      formula: '(Total promo clicks ÷ Total impressions) × 100',
      tip: 'A CTR above 5% is considered excellent. Refresh your promotion creative every 10 days to avoid fatigue.',
    },
  };

  const handleKpiClick = (label: string) => {
    const def = kpiDefs[label];
    if (!def) return;
    setActiveKpi(prev => prev?.label === label ? null : def);
  };

  // Real data state
  const [listings, setListings] = useState<any[]>([]);
  const [kpis, setKpis] = useState({
    totalEarned: 0,
    totalListings: 0,
    totalBidders: 0,
    liveCount: 0,
    endedCount: 0,
    draftCount: 0,
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [recentBids, setRecentBids] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    loadDashboard();
  }, [user]);

  async function loadDashboard() {
    setLoading(true);
    try {
      // Fetch all listings for this seller
      const { data: listingData } = await supabase
        .from('listings')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      const myListings = listingData || [];
      setListings(myListings);

      const liveCount = myListings.filter(l => l.status === 'live').length;
      const endedCount = myListings.filter(l => l.status === 'ended').length;
      const draftCount = myListings.filter(l => l.status === 'draft').length;

      // Total earned = sum of current_bid on ended listings
      const totalEarned = myListings
        .filter(l => l.status === 'ended')
        .reduce((sum, l) => sum + (l.current_bid || 0), 0);

      // Fetch bids on all seller's listings
      const listingIds = myListings.map(l => l.id);
      let totalBidders = 0;
      let recentBidData: any[] = [];

      if (listingIds.length > 0) {
        const { data: bidsData } = await supabase
          .from('bids')
          .select('*, listings(title)')
          .in('listing_id', listingIds)
          .order('placed_at', { ascending: false })
          .limit(10);

        if (bidsData) {
          const uniqueBidders = new Set(bidsData.map(b => b.bidder_id));
          totalBidders = uniqueBidders.size;
          recentBidData = bidsData;
        }
      }

      setKpis({
        totalEarned,
        totalListings: myListings.length,
        totalBidders,
        liveCount,
        endedCount,
        draftCount,
      });
      setRecentBids(recentBidData);

      // Build monthly earnings from ended listings
      const months: Record<string, { month: string; earnings: number; listings: number }> = {};
      myListings.filter(l => l.status === 'ended').forEach(l => {
        const d = new Date(l.updated_at || l.created_at);
        const key = d.toLocaleString('en-US', { month: 'short' });
        if (!months[key]) months[key] = { month: key, earnings: 0, listings: 0 };
        months[key].earnings += l.current_bid || 0;
        months[key].listings += 1;
      });
      setMonthlyData(Object.values(months).slice(-6));
    } finally {
      setLoading(false);
    }
  }

  const handlePublishDraft = async (id: string) => {
    await supabase.from('listings').update({ status: 'live', starts_at: new Date().toISOString() }).eq('id', id);
    loadDashboard();
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-[1400px] mx-auto text-white min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">Dashboard</h1>
          <p className="text-neutral-500 text-sm">
            Welcome back, <span className="text-neutral-300">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Seller'}</span>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-500">Live data</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 self-start md:self-auto">
          <button
            onClick={() => setIsPromoteModalOpen(true)}
            className="border border-white/20 text-white px-6 py-2.5 text-xs font-semibold hover:bg-white/5 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm"
          >
            <IIcon icon="solar:star-fall-linear" width="16" />
            Promote Listing
          </button>
          <button
            onClick={() => navigate('/seller/create-listing')}
            className="bg-white text-black px-6 py-2.5 text-xs font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm"
          >
            <IIcon icon="solar:add-square-linear" width="16" />
            Create Listing
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-white/10 mb-10 gap-8">
        {(['analytics', 'listings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-semibold transition-colors ${activeTab === tab ? 'border-b-2 border-white text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            {tab === 'analytics' ? 'Overview & Analytics' : 'My Listings'}
          </button>
        ))}
      </div>

      {/* ══════════ ANALYTICS TAB ══════════ */}
      {activeTab === 'analytics' && (
        <div className="space-y-10">

          {/* KPI Row */}
          <div>
            <SectionTitle>Key Metrics</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <KpiCard label="Total Earned" value={fmt(kpis.totalEarned)} sub="From ended auctions" onClick={() => handleKpiClick('Total Earned')} />
              <KpiCard label="Total Listings" value={String(kpis.totalListings)} sub={`${kpis.liveCount} Live · ${kpis.endedCount} Ended · ${kpis.draftCount} Drafts`} onClick={() => handleKpiClick('Total Listings')} />
              <KpiCard label="Total Bidders" value={String(kpis.totalBidders)} sub="Unique across all listings" onClick={() => handleKpiClick('Total Bidders')} />
            </div>
            {/* Added back zero-state secondary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               <KpiCard label="Avg. Time-to-Sell" value="n/a" sub="Historical average" onClick={() => handleKpiClick('Avg. Time-to-Sell')} />
               <KpiCard label="Return Rate" value="0.0%" sub="0 disputed transactions" onClick={() => handleKpiClick('Return Rate')} />
               <KpiCard label="Avg. Bid Increment" value="n/a" sub="Per bid placed" onClick={() => handleKpiClick('Avg. Bid Increment')} />
            </div>
            {/* Promotion KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
               <KpiCard label="Active Promotions" value="0" sub="0 Ribbon · 0 Popup" onClick={() => handleKpiClick('Active Promotions')} />
               <KpiCard label="Total Impressions" value="0" sub="This week via promotions" onClick={() => handleKpiClick('Total Impressions')} />
               <KpiCard label="Promo Clicks" value="0" sub="Ribbon + Popup combined" onClick={() => handleKpiClick('Promo Clicks')} />
               <KpiCard label="Avg. Promo CTR" value="0.0%" sub="Above industry average" onClick={() => handleKpiClick('Avg. Promo CTR')} />
            </div>
            {activeKpi && <KpiDetailPanel metric={activeKpi} onClose={() => setActiveKpi(null)} />}
          </div>

          {/* Monthly Earnings always visible */}
          <div>
            <SectionTitle>Monthly Earnings</SectionTitle>
            <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm relative" style={{ height: 280 }}>
              {monthlyData.length === 0 && !loading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="text-center bg-[#0a0a0a]/80 py-4 px-6 rounded-lg backdrop-blur-sm border border-white/5">
                    <p className="text-neutral-500 text-sm font-medium">No earnings data yet.</p>
                    <p className="text-neutral-600 text-xs mt-1">Publish a listing to start seeing analytics.</p>
                  </div>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData.length > 0 ? monthlyData : [{ month: new Date().toLocaleString('en-US', { month: 'short' }), earnings: 0 }]} barSize={20}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <XAxis dataKey="month" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip prefix="₹" />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="earnings" name="Earnings" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Bids */}
          {recentBids.length > 0 && (
            <div>
              <SectionTitle>Recent Bid Activity</SectionTitle>
              <div className="bg-[#0d0d0d] border border-white/5 rounded-sm overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-[10px] tracking-widest uppercase text-neutral-600 px-6 py-3 font-normal">Item</th>
                      <th className="text-center text-[10px] tracking-widest uppercase text-neutral-600 px-6 py-3 font-normal">Amount</th>
                      <th className="text-right text-[10px] tracking-widest uppercase text-neutral-600 px-6 py-3 font-normal">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBids.slice(0, 8).map((bid, i) => (
                      <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                        <td className="px-6 py-3 text-neutral-300 line-clamp-1">{bid.listings?.title || 'Unknown item'}</td>
                        <td className="px-6 py-3 text-center text-white font-semibold">{fmt(bid.amount)}</td>
                        <td className="px-6 py-3 text-right text-neutral-500">
                          {new Date(bid.placed_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Section 2: Revenue + Bid Velocity (Area Charts) ── */}
          <div>
            <SectionTitle>Weekly Performance</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bid Velocity */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm relative">
                {weeklyDataZero.map((d) => d.bids).reduce((a,b) => a+b, 0) === 0 && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="text-center bg-[#0a0a0a]/80 py-4 px-6 rounded-lg backdrop-blur-sm border border-white/5">
                        <p className="text-neutral-500 text-sm font-medium">No bid data yet.</p>
                      </div>
                    </div>
                )}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Bid Velocity</h3>
                    <p className="text-xs text-neutral-500 mt-1">Bids placed per day this week</p>
                  </div>
                  <span className="text-xl font-semibold text-white tracking-tight">0</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyDataZero}>
                      <defs>
                        <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis dataKey="day" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Area type="linear" dataKey="bids" name="Bids" stroke="#60a5fa" strokeWidth={3} fill="url(#bidGrad)" dot={false} activeDot={{ r: 5, fill: '#fff', strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Growth */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm relative">
                {weeklyDataZero.map((d) => d.revenue).reduce((a,b) => a+b, 0) === 0 && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="text-center bg-[#0a0a0a]/80 py-4 px-6 rounded-lg backdrop-blur-sm border border-white/5">
                        <p className="text-neutral-500 text-sm font-medium">No sales data yet.</p>
                      </div>
                    </div>
                )}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Revenue Trajectory</h3>
                    <p className="text-xs text-neutral-500 mt-1">Cumulative highest bids this week</p>
                  </div>
                  <span className="text-xl font-semibold text-white tracking-tight">₹0</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyDataZero}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis dataKey="day" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                      <Tooltip content={<CustomTooltip prefix="₹" />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Area type="linear" dataKey="revenue" name="Revenue" stroke="#34d399" strokeWidth={3} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: '#fff', strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 4: Promo Engagement Breakdown ── */}
          <div>
            <SectionTitle>Engagement Breakdown</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Promotion Engagement Trend */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm flex flex-col relative">
                {promotionEngagementDataZero.map(d => d.ribbon + d.popup + d.organic).reduce((a,b) => a+b, 0) === 0 && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="text-center bg-[#0a0a0a]/80 py-4 px-6 rounded-lg backdrop-blur-sm border border-white/5">
                        <p className="text-neutral-500 text-sm font-medium">No engagement data yet.</p>
                      </div>
                    </div>
                )}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Promotion Engagement</h3>
                    <p className="text-xs text-neutral-500 mt-1">Clicks via Ribbon, Popup & Organic this week</p>
                  </div>
                  <div className="flex items-center gap-3 text-[9px] tracking-widest uppercase">
                    <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#f472b6] inline-block rounded" /> Ribbon</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#60a5fa] inline-block rounded" /> Popup</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#4ade80] inline-block rounded" /> Organic</span>
                  </div>
                </div>
                <div className="flex-1 min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={promotionEngagementDataZero}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis dataKey="day" stroke="#404040" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#404040" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 20 }} />
                      <Line type="linear" dataKey="ribbon" name="Ribbon" stroke="#f472b6" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#fff', strokeWidth: 0 }} />
                      <Line type="linear" dataKey="popup" name="Popup" stroke="#60a5fa" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#fff', strokeWidth: 0 }} />
                      <Line type="linear" dataKey="organic" name="Organic" stroke="#4ade80" strokeWidth={3} strokeDasharray="4 4" dot={false} activeDot={{ r: 5, fill: '#fff', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Impressions vs Clicks Bar Chart */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm flex flex-col relative">
                {monthlyPromoDataZero.map(d => d.impressions + d.clicks).reduce((a,b) => a+b, 0) === 0 && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="text-center bg-[#0a0a0a]/80 py-4 px-6 rounded-lg backdrop-blur-sm border border-white/5">
                        <p className="text-neutral-500 text-sm font-medium">No promotion data yet.</p>
                      </div>
                    </div>
                )}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Monthly Promo Reach</h3>
                    <p className="text-xs text-neutral-500 mt-1">Total impressions & clicks from promotions</p>
                  </div>
                  <div className="flex items-center gap-3 text-[9px] tracking-widest uppercase">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#f472b6]/70 inline-block rounded-sm" /> Impressions</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#3b82f6]/90 inline-block rounded-sm" /> Clicks</span>
                  </div>
                </div>
                <div className="flex-1 min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyPromoDataZero} barGap={6} barSize={10}>
                      <defs>
                        <linearGradient id="promoImp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f472b6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#db2777" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="promoClick" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis dataKey="month" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                      <Bar dataKey="impressions" name="Impressions" fill="url(#promoImp)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="clicks" name="Clicks" fill="url(#promoClick)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ══════════ MY LISTINGS TAB ══════════ */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#0d0d0d] border border-white/5 px-6 py-4 rounded-sm">
            <h2 className="text-[11px] tracking-widest uppercase text-neutral-400">All Listings</h2>
            <div className="flex gap-4">
              <span className="text-[10px] text-neutral-500 font-semibold tracking-wide flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Live</span>
              <span className="text-[10px] text-neutral-500 font-semibold tracking-wide flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Draft</span>
              <span className="text-[10px] text-neutral-500 font-semibold tracking-wide flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" /> Ended</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-neutral-600 text-sm">Loading your listings...</div>
          ) : listings.length === 0 ? (
            <div className="bg-[#0d0d0d] border border-dashed border-white/10 rounded-sm p-16 text-center">
              <IIcon icon="solar:tag-horizontal-linear" width="48" className="mx-auto mb-4 text-neutral-700" />
              <h3 className="text-white font-semibold mb-2">No listings yet</h3>
              <p className="text-neutral-500 text-sm mb-6">Create your first auction listing to get started.</p>
              <button
                onClick={() => navigate('/seller/create-listing')}
                className="bg-white text-black px-6 py-2.5 text-xs font-semibold hover:bg-neutral-200 transition-colors rounded-sm"
              >
                Create First Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {listings.map(listing => (
                <div key={listing.id} className="bg-[#0d0d0d] border border-white/5 rounded-sm p-5 flex flex-col md:flex-row gap-6 items-center hover:border-white/10 transition-colors">
                  {listing.images?.[0] ? (
                    <img src={listing.images[0]} alt={listing.title} className="w-full md:w-28 h-28 object-cover rounded-sm flex-shrink-0" />
                  ) : (
                    <div className="w-full md:w-28 h-28 bg-white/5 rounded-sm flex-shrink-0 flex items-center justify-center text-neutral-700">
                      <IIcon icon="solar:gallery-linear" width="28" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className={`w-2 h-2 rounded-full ${listing.status === 'live' ? 'bg-green-500 animate-pulse' : listing.status === 'draft' ? 'bg-blue-500' : 'bg-neutral-600'}`} />
                      <span className="text-[10px] text-neutral-500 font-semibold tracking-wide capitalize">{listing.status}</span>
                    </div>
                    <h3 className="text-base font-[300] line-clamp-2 leading-snug">{listing.title}</h3>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-[11px] text-neutral-500">
                      <span>{listing.unique_bidders} Bidders</span>
                      <span>·</span>
                      <span>{listing.bid_count} Bids</span>
                      {listing.celebrity && <><span>·</span><span>{listing.celebrity}</span></>}
                    </div>
                  </div>
                  <div className="flex-1 mt-4 sm:mt-0 sm:text-right">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5 font-semibold">Current Bid</p>
                    <p className="text-xl text-white">{listing.current_bid > 0 ? fmt(listing.current_bid) : 'No bids yet'}</p>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                    {listing.status === 'live' && (
                      <button
                        onClick={() => navigate(`/auction/${listing.id}`)}
                        className="mt-2 w-full md:w-auto border border-white/20 px-5 py-2 text-[10px] font-semibold tracking-wide hover:bg-white hover:text-black transition-colors"
                      >Manage Live</button>
                    )}
                    {listing.status === 'draft' && (
                      <button
                        onClick={() => handlePublishDraft(listing.id)}
                        className="mt-2 w-full md:w-auto bg-white text-black px-5 py-2 text-[10px] font-semibold tracking-wide hover:bg-neutral-200 transition-colors"
                      >Publish</button>
                    )}
                    {listing.status === 'ended' && (
                      <button
                        onClick={() => navigate(`/auction/${listing.id}`)}
                        className="mt-2 w-full md:w-auto border border-white/20 px-5 py-2 text-[10px] font-semibold tracking-wide hover:bg-white hover:text-black transition-colors"
                      >View Results</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Promote Modal ── */}
      {isPromoteModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-sm p-6 relative flex flex-col my-auto max-h-[90vh]">
            <button
              onClick={() => { setIsPromoteModalOpen(false); setSelectedPromoListing(null); setSelectedPromoType(null); }}
              className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
            >
              <IIcon icon="solar:close-circle-linear" width="24" />
            </button>
            <h2 className="text-xl font-[300] tracking-wider uppercase mb-1 text-white">Promote Your Listing</h2>
            <p className="text-sm text-neutral-400 mb-6 font-light">Select a listing and choose a promotion strategy to boost visibility.</p>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              <div>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-4">1. Select Listing</p>
                <div className="grid grid-cols-1 gap-3">
                  {listings.filter(l => l.status === 'live' || l.status === 'draft').map(listing => (
                    <div
                      key={listing.id}
                      onClick={() => setSelectedPromoListing(listing.id)}
                      className={`p-3 border rounded-sm flex items-center gap-4 cursor-pointer transition-colors ${selectedPromoListing === listing.id ? 'border-blue-500 bg-white/5' : 'border-white/10 hover:border-white/30 bg-[#0d0d0d]'}`}
                    >
                      {listing.images?.[0] ? (
                        <img src={listing.images[0]} alt="" className="w-12 h-12 object-cover rounded-sm" />
                      ) : (
                        <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center text-neutral-600">
                          <IIcon icon="solar:gallery-linear" width="18" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm line-clamp-1">{listing.title}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5 capitalize">{listing.status} · Current Bid: {listing.current_bid > 0 ? fmt(listing.current_bid) : 'None'}</p>
                      </div>
                      {selectedPromoListing === listing.id && <IIcon icon="solar:check-circle-bold" width="20" className="text-blue-400" />}
                    </div>
                  ))}
                  {listings.filter(l => l.status === 'live' || l.status === 'draft').length === 0 && (
                    <p className="text-neutral-600 text-sm text-center py-4">No live or draft listings available to promote.</p>
                  )}
                </div>
              </div>

              {selectedPromoListing && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-4">2. Select Promotion Type</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'ribbon', icon: 'solar:stars-line-duotone', title: 'Promotion Ribbon', desc: 'Your listing appears in the scrolling featured ribbon on the homepage.' },
                      { key: 'popup', icon: 'solar:monitor-smartphone-linear', title: 'Login Pop-up', desc: 'A dedicated pop-up showcases your listing when target buyers open the app.' },
                    ].map(opt => (
                      <div
                        key={opt.key}
                        onClick={() => setSelectedPromoType(opt.key)}
                        className={`p-4 border rounded-sm cursor-pointer transition-colors ${selectedPromoType === opt.key ? 'border-blue-500 bg-white/5' : 'border-white/10 hover:border-white/30 bg-[#0d0d0d]'}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="p-2 rounded flex items-center justify-center bg-white/5">
                            <IIcon icon={opt.icon} width="24" className={selectedPromoType === opt.key ? 'text-blue-400' : 'text-neutral-400'} />
                          </div>
                          {selectedPromoType === opt.key && <IIcon icon="solar:check-circle-bold" width="20" className="text-blue-400" />}
                        </div>
                        <h4 className="font-semibold text-sm mb-1 text-white">{opt.title}</h4>
                        <p className="text-[11px] text-neutral-400 font-light leading-relaxed">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => { setIsPromoteModalOpen(false); setSelectedPromoListing(null); setSelectedPromoType(null); }}
                className="px-5 py-2.5 text-xs tracking-widest uppercase font-semibold text-neutral-400 hover:text-white transition-colors"
              >Cancel</button>
              <button
                disabled={!selectedPromoListing || !selectedPromoType}
                onClick={() => { setIsPromoteModalOpen(false); setSelectedPromoListing(null); setSelectedPromoType(null); }}
                className="bg-white text-black px-6 py-2.5 text-xs tracking-widest uppercase font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >Pay & Promote</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
