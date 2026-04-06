// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Legend, RadialBarChart, RadialBar
} from 'recharts';
import IIcon from '../components/IIcon';

interface SellerDashboardProps {
  user: any;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const weeklyData = [
  { day: 'Mon', bids: 12, revenue: 15000, views: 320, watchers: 85 },
  { day: 'Tue', bids: 19, revenue: 25000, views: 410, watchers: 110 },
  { day: 'Wed', bids: 30, revenue: 45000, views: 530, watchers: 160 },
  { day: 'Thu', bids: 25, revenue: 38000, views: 490, watchers: 140 },
  { day: 'Fri', bids: 40, revenue: 70000, views: 720, watchers: 230 },
  { day: 'Sat', bids: 55, revenue: 105000, views: 890, watchers: 310 },
  { day: 'Sun', bids: 60, revenue: 120000, views: 960, watchers: 340 },
];

const monthlyData = [
  { month: 'Oct', earnings: 45000, listings: 3 },
  { month: 'Nov', earnings: 82000, listings: 5 },
  { month: 'Dec', earnings: 135000, listings: 7 },
  { month: 'Jan', earnings: 98000, listings: 6 },
  { month: 'Feb', earnings: 175000, listings: 9 },
  { month: 'Mar', earnings: 475000, listings: 14 },
];

const categoryData = [
  { name: 'Sports', value: 48, color: '#D4AF37' },
  { name: 'Cinema', value: 22, color: '#4ade80' },
  { name: 'Music', value: 15, color: '#60a5fa' },
  { name: 'Art', value: 10, color: '#f472b6' },
  { name: 'Rare Media', value: 5, color: '#fb923c' },
];

const healthRadarData = [
  { subject: 'Listing Quality', score: 88, fullMark: 100 },
  { subject: 'Engagement', score: 75, fullMark: 100 },
  { subject: 'Response Time', score: 92, fullMark: 100 },
  { subject: 'Promotion Strategy', score: 85, fullMark: 100 },
  { subject: 'Buyer Rating', score: 82, fullMark: 100 },
];

const promotionEngagementData = [
  { day: 'Mon', ribbon: 120, popup: 45, organic: 180 },
  { day: 'Tue', ribbon: 250, popup: 85, organic: 210 },
  { day: 'Wed', ribbon: 340, popup: 110, organic: 270 },
  { day: 'Thu', ribbon: 280, popup: 95, organic: 240 },
  { day: 'Fri', ribbon: 420, popup: 180, organic: 320 },
  { day: 'Sat', ribbon: 550, popup: 220, organic: 410 },
  { day: 'Sun', ribbon: 610, popup: 260, organic: 480 },
];

const monthlyPromoData = [
  { month: 'Oct', impressions: 12000, clicks: 890, ribbon: 7200, popup: 4800 },
  { month: 'Nov', impressions: 18500, clicks: 1340, ribbon: 11000, popup: 7500 },
  { month: 'Dec', impressions: 24000, clicks: 2100, ribbon: 14000, popup: 10000 },
  { month: 'Jan', impressions: 19500, clicks: 1720, ribbon: 11800, popup: 7700 },
  { month: 'Feb', impressions: 32000, clicks: 2900, ribbon: 19000, popup: 13000 },
  { month: 'Mar', impressions: 47500, clicks: 4400, ribbon: 28000, popup: 19500 },
];

const activePromotions = [
  { item: 'Match-Worn 2023 World Cup Jersey — Kohli Signed', type: 'Promotion Ribbon', impressions: 15400, clicks: 1240, ctr: '8.1%' },
  { item: 'Vintage Boxing Gloves — Ali Era Autographed', type: 'Login Popup', impressions: 8200, clicks: 450, ctr: '5.5%' },
];

const bidFunnel = [
  { stage: 'Listing 1', views: 960, watchers: 340, bidders: 68, winner: 1 },
  { stage: 'Listing 2', views: 640, watchers: 210, bidders: 45, winner: 1 },
  { stage: 'Listing 3', views: 420, watchers: 145, bidders: 28, winner: 1 },
  { stage: 'Listing 4', views: 280, watchers: 88, bidders: 15, winner: 1 },
];

const topListings = [
  { name: 'Match-Worn 2023 World Cup Jersey — Kohli', bids: 132, highestBid: 350000, conversion: '96%', status: 'Ended', category: 'Sports' },
  { name: 'Match-Worn 2023 World Cup Jersey — Kohli Signed', bids: 45, highestBid: 125000, conversion: '82%', status: 'Live', category: 'Sports' },
  { name: 'Vintage Boxing Gloves — Ali Era Autographed', bids: 78, highestBid: 280000, conversion: '89%', status: 'Ended', category: 'Sports' },
  { name: 'Original Screenplay — "Mughal-e-Azam" (1960)', bids: 52, highestBid: 195000, conversion: '74%', status: 'Ended', category: 'Cinema' },
  { name: 'Signed Guitar — AR Rahman World Tour', bids: 34, highestBid: 88000, conversion: '68%', status: 'Ended', category: 'Music' },
];

const activityFeed = [
  { time: '2m ago', event: 'New bid placed', item: 'Match-Worn 2023 Jersey', amount: '₹1,29,000', user: 'R.M***', icon: 'solar:hand-money-linear', color: '#D4AF37' },
  { time: '5m ago', event: 'Listing viewed', item: 'Signed Guitar — AR Rahman', amount: null, user: 'Anon', icon: 'solar:eye-linear', color: '#60a5fa' },
  { time: '11m ago', event: 'Bid outbid', item: 'Match-Worn 2023 Jersey', amount: '₹1,25,000', user: 'P.K***', icon: 'solar:arrow-up-linear', color: '#4ade80' },
  { time: '18m ago', event: 'Watchlist added', item: 'Original Screenplay', amount: null, user: 'S.V***', icon: 'solar:bookmark-linear', color: '#a78bfa' },
  { time: '32m ago', event: 'New bid placed', item: 'Original Screenplay', amount: '₹1,98,000', user: 'T.N***', icon: 'solar:hand-money-linear', color: '#D4AF37' },
  { time: '1h ago', event: 'New bid placed', item: 'Vintage Boxing Gloves', amount: '₹2,80,000', user: 'M.S***', icon: 'solar:hand-money-linear', color: '#D4AF37' },
];

// 7×5 heatmap grid: rows = Mon-Sun, cols = weeks 1-5
const heatmapData = [
  [4, 12, 8, 20, 3],
  [7, 15, 22, 34, 8],
  [12, 25, 40, 55, 15],
  [9, 18, 32, 45, 11],
  [15, 28, 48, 62, 20],
  [22, 35, 55, 75, 28],
  [18, 30, 50, 68, 24],
];
const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const heatmapWeeks = ['W1', 'W2', 'W3', 'W4', 'W5'];

const mockListings = [
  { id: 's1', item_name: 'Match-Worn 2023 World Cup Jersey — Kohli Signed', current_bid: 125000, end_time: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), status: 'Live', image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop', unique_bidders: 24, bids_placed: 45 },
  { id: 's2', item_name: 'Custom Signature Bat — Final Over', current_bid: 0, end_time: null, status: 'Draft', image_url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=800&auto=format&fit=crop', unique_bidders: 0, bids_placed: 0 },
  { id: 's3', item_name: 'Vintage Boxing Gloves — Ali Era Autographed', current_bid: 350000, end_time: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), status: 'Ended', image_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop', unique_bidders: 68, bids_placed: 132 }
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) { return '₹' + n.toLocaleString('en-IN'); }

function heatColor(val: number, max = 75) {
  const ratio = val / max;
  if (ratio < 0.15) return '#1a1a1a';
  if (ratio < 0.35) return '#2a1f00';
  if (ratio < 0.55) return '#5a3e00';
  if (ratio < 0.75) return '#8a5f00';
  return '#D4AF37';
}

const CHART_TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: 12 },
  itemStyle: { color: '#D4AF37' },
  labelStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
};

// ── Sub-Components ────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, iconColor = 'text-[#D4AF37]', trend = null }: any) {
  return (
    <div className="bg-[#0d0d0d] border border-white/5 p-5 rounded-sm hover:border-white/10 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <IIcon icon={icon} width="22" className={iconColor} />
        {trend !== null && (
          <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded ${trend >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-neutral-500 text-[10px] tracking-widest uppercase mb-1">{label}</p>
      <h3 className="text-xl font-light font-mono text-white">{value}</h3>
      {sub && <p className="text-[11px] text-neutral-600 mt-1.5">{sub}</p>}
    </div>
  );
}

function SectionTitle({ children }: any) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-0.5 h-5 bg-[#D4AF37] rounded-full" />
      <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-400">{children}</h2>
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-xs">
        <p className="text-neutral-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{prefix}{p.name}: <span className="font-mono font-semibold">{prefix}{typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}{suffix}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function SellerDashboard({ user }: SellerDashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics' | 'listings'>('analytics');
  const [feedIndex, setFeedIndex] = useState(0);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedPromoListing, setSelectedPromoListing] = useState<string | null>(null);
  const [selectedPromoType, setSelectedPromoType] = useState<string | null>(null);

  // Animate activity feed
  useEffect(() => {
    const timer = setInterval(() => {
      setFeedIndex(i => (i + 1) % activityFeed.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const healthScore = Math.round(healthRadarData.reduce((a, b) => a + b.score, 0) / healthRadarData.length);

  return (
    <div className="pt-24 pb-20 px-6 max-w-[1400px] mx-auto text-white min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-[300] tracking-wider uppercase mb-1">Seller Dashboard</h1>
          <p className="text-neutral-500 text-sm tracking-wide">
            Welcome back, <span className="text-neutral-300">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Seller'}</span>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-green-400/70 tracking-widest uppercase">Live data</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 self-start md:self-auto">
          <button
            onClick={() => setIsPromoteModalOpen(true)}
            className="border border-[#D4AF37] text-[#D4AF37] px-6 py-3 text-xs tracking-widest uppercase font-bold hover:bg-[#D4AF37]/10 transition-colors flex items-center justify-center gap-2">
            <IIcon icon="solar:star-fall-linear" width="16" />
            Promote Listing
          </button>
          <button
            onClick={() => navigate('/seller/create-listing')}
            className="bg-white text-black px-6 py-3 text-xs tracking-widest uppercase font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
            <IIcon icon="solar:add-square-linear" width="16" />
            Create Listing
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-white/8 mb-10 gap-8">
        {(['analytics', 'listings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[11px] font-semibold tracking-widest uppercase transition-colors ${activeTab === tab ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-neutral-500 hover:text-white'}`}
          >
            {tab === 'analytics' ? 'Overview & Analytics' : 'My Listings'}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════ ANALYTICS TAB ══════════════════════════════ */}
      {activeTab === 'analytics' && (
        <div className="space-y-10">

          {/* ── Section 1: KPI Row (8 cards) ── */}
          <div>
            <SectionTitle>Key Metrics</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4 mb-4">
              <KpiCard icon="solar:wallet-money-linear" label="Total Earned" value="₹4,75,000" sub="Net of Wregals commission" iconColor="text-green-400" trend={18} />
              <KpiCard icon="solar:tag-horizontal-linear" label="Total Listings" value="24" sub="4 Live · 18 Ended · 2 Drafts" iconColor="text-blue-400" trend={4} />
              <KpiCard icon="solar:users-group-linear" label="Total Bidders" value="347" sub="Across all listings" iconColor="text-purple-400" trend={22} />
              <KpiCard icon="solar:chart-2-linear" label="Conversion Rate" value="76%" sub="Views → successful bids" iconColor="text-[#D4AF37]" trend={5} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
              <KpiCard icon="solar:hourglass-linear" label="Avg. Time-to-Sell" value="3.2 Days" sub="Historical average" iconColor="text-yellow-400" trend={-8} />
              <KpiCard icon="solar:refresh-circle-linear" label="Return Rate" value="0.0%" sub="0 disputed transactions" iconColor="text-red-400" />
              <KpiCard icon="solar:graph-up-linear" label="Avg. Bid Increment" value="₹8,450" sub="Per bid placed" iconColor="text-emerald-400" trend={12} />
              <KpiCard icon="solar:hand-money-linear" label="Commission Paid" value="₹47,500" sub="10% Wregals fee" iconColor="text-orange-400" />
            </div>
            {/* Promotion KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <KpiCard icon="solar:stars-line-duotone" label="Active Promotions" value="2" sub="1 Ribbon · 1 Popup" iconColor="text-pink-400" trend={100} />
              <KpiCard icon="solar:eye-linear" label="Total Impressions" value="23,600" sub="This week via promotions" iconColor="text-indigo-400" trend={34} />
              <KpiCard icon="solar:cursor-linear" label="Promo Clicks" value="1,690" sub="Ribbon + Popup combined" iconColor="text-fuchsia-400" trend={28} />
              <KpiCard icon="solar:percent-linear" label="Avg. Promo CTR" value="7.2%" sub="Above industry average" iconColor="text-cyan-400" trend={15} />
            </div>
          </div>

          {/* ── Section 2: Revenue + Bid Velocity (Area Charts) ── */}
          <div>
            <SectionTitle>Weekly Performance</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bid Velocity */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">Bid Velocity</h3>
                    <p className="text-xs text-neutral-600 mt-1">Bids placed per day this week</p>
                  </div>
                  <span className="text-xl font-mono font-light text-[#D4AF37]">+60</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="bidGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="day" stroke="#404040" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#404040" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="bids" name="Bids" stroke="#D4AF37" strokeWidth={2} fill="url(#bidGrad)" dot={{ fill: '#000', stroke: '#D4AF37', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Growth */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">Revenue Trajectory</h3>
                    <p className="text-xs text-neutral-600 mt-1">Cumulative highest bids this week</p>
                  </div>
                  <span className="text-xl font-mono font-light text-green-400">₹1.2L</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="day" stroke="#404040" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#404040" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                      <Tooltip content={<CustomTooltip prefix="₹" />} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#4ade80" strokeWidth={2} fill="url(#revGrad)" dot={{ fill: '#000', stroke: '#4ade80', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 3: Monthly Earnings Bar + Views/Watchers Line ── */}
          <div>
            <SectionTitle>Monthly Overview</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Earnings Bar */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <h3 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-6">Monthly Earnings</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="month" stroke="#404040" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#404040" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                      <Tooltip content={<CustomTooltip prefix="₹" />} />
                      <Bar dataKey="earnings" name="Earnings" fill="#D4AF37" radius={[3, 3, 0, 0]} opacity={0.85} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Views vs Watchers */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <h3 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-6">Audience Funnel (This Week)</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bidFunnel} layout="vertical" barSize={12}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                      <XAxis type="number" stroke="#404040" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="stage" stroke="#404040" fontSize={10} tickLine={false} axisLine={false} width={60} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="views" name="Views" fill="#60a5fa" radius={[0, 3, 3, 0]} opacity={0.7} />
                      <Bar dataKey="watchers" name="Watchers" fill="#a78bfa" radius={[0, 3, 3, 0]} opacity={0.8} />
                      <Bar dataKey="bidders" name="Bidders" fill="#D4AF37" radius={[0, 3, 3, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 4: Category Pie + Promotion Engagement Trend ── */}
          <div>
            <SectionTitle>Engagement Breakdown</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Category Pie */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <h3 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-6">Revenue by Category</h3>
                <div className="flex items-center gap-6">
                  <div className="h-52 flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: 12 }} itemStyle={{ color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-3 min-w-[120px]">
                    {categoryData.map(cat => (
                      <div key={cat.name} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        <div>
                          <p className="text-[11px] text-neutral-300">{cat.name}</p>
                          <p className="text-[10px] text-neutral-600 font-mono">{cat.value}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promotion Engagement Trend — replaces Health Radar */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">Promotion Engagement</h3>
                    <p className="text-xs text-neutral-600 mt-1">Clicks via Ribbon, Popup &amp; Organic this week</p>
                  </div>
                  <div className="flex items-center gap-3 text-[9px] tracking-widest uppercase">
                    <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#f472b6] inline-block rounded" /> Ribbon</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#60a5fa] inline-block rounded" /> Popup</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#4ade80] inline-block rounded" /> Organic</span>
                  </div>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={promotionEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="day" stroke="#404040" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#404040" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="ribbon" name="Ribbon" stroke="#f472b6" strokeWidth={2} dot={{ fill: '#000', stroke: '#f472b6', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="popup" name="Popup" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#000', stroke: '#60a5fa', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="organic" name="Organic" stroke="#4ade80" strokeWidth={2} strokeDasharray="4 2" dot={{ fill: '#000', stroke: '#4ade80', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 4.5: Promotion Analytics ── */}
          <div>
            <SectionTitle>Promotion Analytics</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Impressions vs Clicks Bar Chart */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">Monthly Promo Reach</h3>
                    <p className="text-xs text-neutral-600 mt-1">Total impressions &amp; clicks from promotions</p>
                  </div>
                  <div className="flex items-center gap-3 text-[9px] tracking-widest uppercase">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#f472b6]/70 inline-block rounded-sm" /> Impressions</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#D4AF37]/90 inline-block rounded-sm" /> Clicks</span>
                  </div>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyPromoData} barGap={4} barSize={14}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="month" stroke="#404040" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#404040" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => v >= 1000 ? `${v / 1000}k` : v} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="impressions" name="Impressions" fill="#f472b6" radius={[3, 3, 0, 0]} opacity={0.7} />
                      <Bar dataKey="clicks" name="Clicks" fill="#D4AF37" radius={[3, 3, 0, 0]} opacity={0.9} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active Promotions Table */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm flex flex-col">
                <h3 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-5">Active Promotions</h3>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Item & Type</th>
                        <th className="text-center text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Impressions</th>
                        <th className="text-center text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Clicks</th>
                        <th className="text-center text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">CTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePromotions.map((p, i) => (
                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                          <td className="py-3 pr-4">
                            <div>
                              <p className="text-white/80 line-clamp-1 font-light">{p.item}</p>
                              <span className="text-[9px] tracking-widest text-[#f472b6] mt-0.5 inline-block border border-[#f472b6]/20 bg-[#f472b6]/10 px-1.5 py-0.5 rounded">{p.type}</span>
                            </div>
                          </td>
                          <td className="text-center py-3 font-mono text-neutral-300">{p.impressions.toLocaleString()}</td>
                          <td className="text-center py-3 font-mono text-neutral-300">{p.clicks.toLocaleString()}</td>
                          <td className="text-center py-3 font-mono text-green-400">{p.ctr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 5: Top Listings Table + Activity Feed ── */}
          <div>
            <SectionTitle>Insights & Activity</SectionTitle>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Top Listings Table */}
              <div className="xl:col-span-2 bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <h3 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-5">Top Performing Listings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Item</th>
                        <th className="text-center text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Bids</th>
                        <th className="text-center text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Highest</th>
                        <th className="text-center text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Conv.</th>
                        <th className="text-center text-[10px] tracking-widest uppercase text-neutral-600 pb-3 font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topListings.map((l, i) => (
                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
                          <td className="py-3 pr-4">
                            <div>
                              <p className="text-white/80 line-clamp-1 font-light">{l.name}</p>
                              <p className="text-[10px] text-neutral-600 mt-0.5">{l.category}</p>
                            </div>
                          </td>
                          <td className="text-center py-3 font-mono text-neutral-300">{l.bids}</td>
                          <td className="text-center py-3 font-mono text-[#D4AF37]">{fmt(l.highestBid)}</td>
                          <td className="text-center py-3">
                            <span className="text-green-400 font-mono">{l.conversion}</span>
                          </td>
                          <td className="text-center py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] tracking-widest uppercase font-semibold
                              ${l.status === 'Live' ? 'bg-green-400/10 text-green-400' : l.status === 'Draft' ? 'bg-blue-400/10 text-blue-400' : 'bg-white/5 text-neutral-500'}`}>
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Activity Feed */}
              <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">Live Activity</h3>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[9px] text-green-400/70 tracking-widest uppercase">Real-time</span>
                  </span>
                </div>
                <div className="space-y-3">
                  {activityFeed.map((event, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded border transition-all duration-500 ${i === feedIndex ? 'border-[#D4AF37]/20 bg-[#D4AF37]/5' : 'border-white/[0.03] bg-transparent'}`}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: event.color + '18' }}>
                        <IIcon icon={event.icon} width="14" style={{ color: event.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-neutral-300 leading-snug line-clamp-1">{event.event}</p>
                        <p className="text-[10px] text-neutral-600 line-clamp-1 mt-0.5">{event.item}</p>
                        {event.amount && <p className="text-[11px] font-mono mt-0.5" style={{ color: event.color }}>{event.amount}</p>}
                      </div>
                      <span className="text-[9px] text-neutral-700 whitespace-nowrap">{event.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 6: Bid Activity Heatmap ── */}
          <div>
            <SectionTitle>Bid Activity Heatmap</SectionTitle>
            <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">Bid Intensity — Last 5 Weeks</h3>
                  <p className="text-[10px] text-neutral-600 mt-1">Day-of-week × Week. Darker gold = more bid activity.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-600">Low</span>
                  {['#1a1a1a', '#2a1f00', '#5a3e00', '#8a5f00', '#D4AF37'].map(c => (
                    <span key={c} className="w-4 h-4 rounded-sm" style={{ backgroundColor: c }} />
                  ))}
                  <span className="text-[10px] text-neutral-600">High</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[400px]">
                  <div className="flex gap-1 mb-1 pl-10">
                    {heatmapWeeks.map(w => (
                      <div key={w} className="flex-1 text-center text-[9px] text-neutral-600 tracking-widest">{w}</div>
                    ))}
                  </div>
                  {heatmapData.map((row, di) => (
                    <div key={di} className="flex items-center gap-1 mb-1">
                      <span className="w-8 text-[9px] text-neutral-600 text-right pr-2 tracking-wider">{heatmapDays[di]}</span>
                      {row.map((val, wi) => (
                        <div
                          key={wi}
                          className="flex-1 h-8 rounded-sm transition-opacity hover:opacity-80 cursor-default"
                          style={{ backgroundColor: heatColor(val) }}
                          title={`${heatmapDays[di]} ${heatmapWeeks[wi]}: ${val} bids`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════ MY LISTINGS TAB ══════════════════════════════ */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#0d0d0d] border border-white/5 px-6 py-4 rounded-sm">
            <h2 className="text-[11px] tracking-widest uppercase text-neutral-400">All Listings</h2>
            <div className="flex gap-4">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Live</span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Draft</span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" /> Ended</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {mockListings.map(listing => (
              <div key={listing.id} className="bg-[#0d0d0d] border border-white/5 rounded-sm p-5 flex flex-col md:flex-row gap-6 items-center hover:border-white/10 transition-colors">
                <img src={listing.image_url} alt={listing.item_name} className="w-full md:w-28 h-28 object-cover rounded-sm grayscale hover:grayscale-0 transition-all flex-shrink-0" />
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className={`w-2 h-2 rounded-full ${listing.status === 'Live' ? 'bg-green-500 animate-pulse' : listing.status === 'Draft' ? 'bg-blue-500' : 'bg-neutral-600'}`} />
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{listing.status}</span>
                  </div>
                  <h3 className="text-base font-[300] line-clamp-2 leading-snug">{listing.item_name}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-[11px] font-mono text-neutral-500">
                    <span>{listing.unique_bidders} Bidders</span>
                    <span>·</span>
                    <span>{listing.bids_placed} Bids</span>
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Highest Bid</p>
                  <p className="text-xl font-mono text-[#D4AF37]">{listing.current_bid > 0 ? fmt(listing.current_bid) : '—'}</p>
                  {listing.status === 'Live' && <button className="mt-2 w-full md:w-auto border border-white/20 px-5 py-2 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors">Manage Live</button>}
                  {listing.status === 'Draft' && <button className="mt-2 w-full md:w-auto bg-[#D4AF37] text-black px-5 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-[#ebd074] transition-colors">Publish</button>}
                  {listing.status === 'Ended' && <button className="mt-2 w-full md:w-auto border border-white/20 px-5 py-2 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors">View Results</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ══════════════════════════════ MODALS ══════════════════════════════ */}
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
            <p className="text-sm text-neutral-400 mb-6 font-light">Select a listing and choose a promotion strategy to significantly boost visibility and bids.</p>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              {/* Step 1: Select Listing */}
              <div>
                <SectionTitle>1. Select Listing</SectionTitle>
                <div className="grid grid-cols-1 gap-3">
                  {mockListings.filter(l => l.status === 'Live' || l.status === 'Draft').map(listing => (
                    <div 
                      key={listing.id}
                      onClick={() => setSelectedPromoListing(listing.id)}
                      className={`p-3 border rounded-sm flex items-center gap-4 cursor-pointer transition-colors ${selectedPromoListing === listing.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/10 hover:border-white/30 bg-[#0d0d0d]'}`}
                    >
                      <img src={listing.image_url} alt="" className="w-12 h-12 object-cover rounded-sm grayscale" />
                      <div className="flex-1">
                        <p className="text-sm line-clamp-1">{listing.item_name}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{listing.status} · Current Bid: {listing.current_bid ? fmt(listing.current_bid) : 'None'}</p>
                      </div>
                      {selectedPromoListing === listing.id && (
                        <IIcon icon="solar:check-circle-bold" width="20" className="text-[#D4AF37]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Promotion Type */}
              {selectedPromoListing && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <SectionTitle>2. Select Promotion Type</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option 1: Ribbon */}
                    <div 
                      onClick={() => setSelectedPromoType('ribbon')}
                      className={`p-4 border rounded-sm cursor-pointer transition-colors ${selectedPromoType === 'ribbon' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/10 hover:border-white/30 bg-[#0d0d0d]'}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className={`p-2 rounded flex items-center justify-center ${selectedPromoType === 'ribbon' ? 'bg-[#D4AF37]/10' : 'bg-white/5'}`}>
                           <IIcon icon="solar:stars-line-duotone" width="24" className={selectedPromoType === 'ribbon' ? 'text-[#D4AF37]' : 'text-neutral-400'} />
                        </div>
                        {selectedPromoType === 'ribbon' && <IIcon icon="solar:check-circle-bold" width="20" className="text-[#D4AF37]" />}
                      </div>
                      <h4 className="font-semibold text-sm mb-1 text-white">Promotion Ribbon</h4>
                      <p className="text-[11px] text-neutral-400 font-light leading-relaxed mb-1">Your listing appears in the scrolling featured ribbon on the homepage globally.</p>
                    </div>

                    {/* Option 2: Popup */}
                    <div 
                      onClick={() => setSelectedPromoType('popup')}
                      className={`p-4 border rounded-sm cursor-pointer transition-colors ${selectedPromoType === 'popup' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/10 hover:border-white/30 bg-[#0d0d0d]'}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className={`p-2 rounded flex items-center justify-center ${selectedPromoType === 'popup' ? 'bg-[#D4AF37]/10' : 'bg-white/5'}`}>
                           <IIcon icon="solar:monitor-smartphone-linear" width="24" className={selectedPromoType === 'popup' ? 'text-[#D4AF37]' : 'text-neutral-400'} />
                        </div>
                        {selectedPromoType === 'popup' && <IIcon icon="solar:check-circle-bold" width="20" className="text-[#D4AF37]" />}
                      </div>
                      <h4 className="font-semibold text-sm mb-1 text-white">Login Pop-up</h4>
                      <p className="text-[11px] text-neutral-400 font-light leading-relaxed mb-1">A dedicated pop-up showcases your listing when target buyers open the app.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-white/10 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => { setIsPromoteModalOpen(false); setSelectedPromoListing(null); setSelectedPromoType(null); }}
                className="px-5 py-2.5 text-xs tracking-widest uppercase font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={!selectedPromoListing || !selectedPromoType}
                onClick={() => {
                  alert('Promotion started successfully!');
                  setIsPromoteModalOpen(false);
                  setSelectedPromoListing(null);
                  setSelectedPromoType(null);
                }}
                className="bg-[#D4AF37] text-black px-6 py-2.5 text-xs tracking-widest uppercase font-bold hover:bg-[#ebd074] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay & Promote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
