// @ts-nocheck
/* ─── Skeleton Loading Screens ────────────────────────────────
   Dark-themed shimmer placeholders matching each page layout.
   Import the full-page skeleton for the page you need.
────────────────────────────────────────────────────────────── */

import LeftSidebar from './LeftSidebar';

/* ─── Building blocks ─────────────────────────────── */

function Bone({ w = '100%', h = 12, r = 4, className = '', style = {} }: any) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }}
    />
  );
}

/* ─── Skeleton Post Card (feed item) ──────────────── */
export function SkeletonPostCard() {
  return (
    <div className="skeleton-post">
      {/* Header: avatar + name */}
      <div className="skeleton-post-header">
        <Bone w={36} h={36} r="50%" className="skeleton-circle" />
        <div className="skeleton-post-header-info">
          <Bone w="55%" h={11} />
          <Bone w="35%" h={9} />
        </div>
        <Bone w={60} h={22} r={12} />
      </div>

      {/* Media area */}
      <Bone className="skeleton-rect skeleton-post-media" h="auto" style={{ aspectRatio: '16 / 10' }} />

      {/* Actions row */}
      <div className="skeleton-post-actions">
        <Bone w={54} h={16} r={4} />
        <Bone w={54} h={16} r={4} />
      </div>

      {/* Title + desc */}
      <Bone w="80%" h={14} style={{ marginBottom: 8 }} />
      <Bone w="95%" h={10} style={{ marginBottom: 5 }} />
      <Bone w="60%" h={10} style={{ marginBottom: 14 }} />

      {/* Bid block */}
      <div className="skeleton-post-bid">
        <div className="skeleton-post-bid-data">
          <div className="skeleton-post-bid-group">
            <Bone w={60} h={9} />
            <Bone w={80} h={16} />
            <Bone w={45} h={9} />
          </div>
          <div className="skeleton-post-bid-group">
            <Bone w={50} h={9} />
            <Bone w={70} h={16} />
            <Bone w={55} h={9} />
          </div>
        </div>
        <Bone w={90} h={34} r={8} />
      </div>
    </div>
  );
}

/* ─── Skeleton Sidebar ────────────────────────────── */
export function SkeletonSidebar() {
  return (
    <div>
      {/* Card 1: Active Bids */}
      <div className="skeleton-sidebar-card">
        <Bone w="50%" h={10} style={{ marginBottom: 14 }} />
        <div className="skeleton-sidebar-row">
          <Bone w={32} h={32} r="50%" className="skeleton-circle" />
          <div className="skeleton-sidebar-row-info">
            <Bone w="70%" h={10} />
            <Bone w="50%" h={8} />
          </div>
          <Bone w={44} h={24} r={6} />
        </div>
      </div>

      {/* Card 2: Ending Soon */}
      <div className="skeleton-sidebar-card">
        <Bone w="45%" h={10} style={{ marginBottom: 14 }} />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton-sidebar-row">
            <Bone w={32} h={32} r="50%" className="skeleton-circle" />
            <div className="skeleton-sidebar-row-info">
              <Bone w={`${60 + i * 5}%`} h={10} />
              <Bone w="35%" h={8} />
            </div>
            <Bone w={52} h={14} r={4} />
          </div>
        ))}
      </div>

      {/* Card 3: People */}
      <div className="skeleton-sidebar-card">
        <Bone w="55%" h={10} style={{ marginBottom: 14 }} />
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-sidebar-row">
            <Bone w={32} h={32} r="50%" className="skeleton-circle" />
            <div className="skeleton-sidebar-row-info">
              <Bone w={`${55 + i * 8}%`} h={10} />
              <Bone w="40%" h={8} />
            </div>
            <Bone w={54} h={24} r={6} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Skeleton Filter Bar ─────────────────────────── */
export function SkeletonFilterBar() {
  return (
    <div className="skeleton-filter-bar">
      {[70, 50, 80, 55].map((w, i) => (
        <Bone key={i} w={w} h={28} r={6} />
      ))}
      <Bone w={1} h={18} r={0} style={{ background: 'var(--hh-line)', marginLeft: 4, marginRight: 4 }} />
      {[45, 70, 60].map((w, i) => (
        <Bone key={`s${i}`} w={w} h={28} r={6} />
      ))}
      <div style={{ flex: 1 }} />
      <Bone w={100} h={28} r={6} />
    </div>
  );
}

/* ─── Skeleton Profile Header ─────────────────────── */
export function SkeletonProfileHeader() {
  return (
    <div className="skeleton-profile-header">
      <Bone w={80} h={80} r="50%" className="skeleton-circle" />
      <div className="skeleton-profile-info">
        <Bone w={180} h={20} />
        <Bone w={120} h={11} />
        <Bone w="70%" h={12} style={{ marginTop: 4 }} />
        <Bone w="50%" h={12} />
        <div className="skeleton-profile-stats">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-profile-stat">
              <Bone w={50} h={18} />
              <Bone w={65} h={10} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <Bone w={76} h={36} r={8} />
        <Bone w={62} h={36} r={8} />
      </div>
    </div>
  );
}

/* ─── Skeleton Post Grid (3-col images) ───────────── */
export function SkeletonPostGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="skeleton-post-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-post-grid-item" />
      ))}
    </div>
  );
}

/* ─── Skeleton KPI Cards ──────────────────────────── */
export function SkeletonKpiCards() {
  return (
    <div className="skeleton-kpi-grid">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton-kpi-card">
          <div className="skeleton-kpi-card-info">
            <Bone w={70} h={9} />
            <Bone w={55} h={20} />
          </div>
          <Bone w={40} h={40} r="50%" className="skeleton-circle" />
        </div>
      ))}
    </div>
  );
}

/* ─── Skeleton Panel ──────────────────────────────── */
export function SkeletonPanel({ rows = 3 }: { rows?: number }) {
  return (
    <div className="skeleton-panel">
      <div className="skeleton-panel-header">
        <Bone w={16} h={16} r={4} />
        <Bone w={120} h={10} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-panel-row">
          <Bone w={80} h={9} />
          <Bone w={`${50 + i * 15}%`} h={13} />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FULL-PAGE SKELETONS
═══════════════════════════════════════════════════════ */

/* ─── Home Feed ───────────────────────────────────── */
export function HomeFeedSkeleton() {
  return (
    <section className="hh-root">
      <div className="hh-layout">
        <LeftSidebar />
        <div className="hh-feed" style={{ borderLeft: '1px solid var(--hh-line)', borderRight: '1px solid var(--hh-line)' }}>
          <SkeletonPostCard />
          <SkeletonPostCard />
          <SkeletonPostCard />
        </div>
        <div className="hh-rsidebar">
          <SkeletonSidebar />
        </div>
      </div>
    </section>
  );
}

/* ─── Live Auctions ───────────────────────────────── */
export function LiveAuctionsSkeleton() {
  return (
    <section className="hh-root">
      <div style={{
        display: 'grid', gridTemplateColumns: '270px 1fr',
        maxWidth: '100%', padding: 'calc(80px + 28px) 12px 0',
        gap: 0, alignItems: 'start',
      }}>
        <LeftSidebar />
        <div style={{ borderLeft: '1px solid var(--hh-line)', minHeight: '100vh' }}>
          {/* Header */}
          <div style={{ padding: '16px 28px 20px', borderBottom: '1px solid var(--hh-line)' }}>
            <Bone w={180} h={22} style={{ marginBottom: 8 }} />
            <Bone w={220} h={11} />
          </div>

          {/* Filter bar */}
          <SkeletonFilterBar />

          {/* Results count */}
          <div style={{ padding: '14px 28px 0' }}>
            <Bone w={100} h={10} />
          </div>

          {/* Grid of cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, padding: '16px 28px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ border: '1px solid var(--hh-line)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <Bone w={36} h={36} r="50%" className="skeleton-circle" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Bone w="60%" h={11} />
                    <Bone w="40%" h={9} />
                  </div>
                  <Bone w={55} h={22} r={12} />
                </div>
                <Bone h="auto" r={10} style={{ width: '100%', aspectRatio: '16/10', marginBottom: 14 }} className="skeleton-rect" />
                <Bone w="75%" h={13} style={{ marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 16, padding: 12, background: 'var(--hh-s2)', borderRadius: 10, border: '1px solid var(--hh-line)', marginBottom: 12 }}>
                  <div style={{ flex: 1, display: 'flex', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <Bone w={55} h={9} />
                      <Bone w={70} h={15} />
                      <Bone w={40} h={8} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <Bone w={50} h={9} />
                      <Bone w={65} h={15} />
                      <Bone w={45} h={8} />
                    </div>
                  </div>
                  <Bone w={80} h={32} r={8} />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Bone w={50} h={15} r={4} />
                  <Bone w={50} h={15} r={4} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Celebrity Profile ───────────────────────────── */
export function CelebrityProfileSkeleton() {
  return (
    <section className="hh-root">
      <div style={{
        display: 'grid', gridTemplateColumns: '270px 1fr',
        maxWidth: '100%', padding: 'calc(80px + 0px) 12px 0',
        gap: 0, alignItems: 'start',
      }}>
        <LeftSidebar />
        <div style={{ borderLeft: '1px solid var(--hh-line)', minHeight: '100vh', paddingBottom: 64 }}>
          <SkeletonProfileHeader />

          {/* Tabs */}
          <div style={{ borderBottom: '1px solid var(--hh-line)', display: 'flex', paddingLeft: 28, gap: 8, padding: '12px 28px' }}>
            <Bone w={60} h={14} />
            <Bone w={90} h={14} />
          </div>

          {/* Post grid */}
          <SkeletonPostGrid count={6} />
        </div>
      </div>
    </section>
  );
}

/* ─── My Profile ──────────────────────────────────── */
export function MyProfileSkeleton() {
  return (
    <div className="space-y-5">
      {/* Hero card */}
      <div style={{ background: 'linear-gradient(to bottom right, #1a1a1a, #0d0d0d)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 32 }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <Bone w={96} h={96} r="50%" className="skeleton-circle" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Bone w={200} h={22} />
            <Bone w={160} h={12} />
            <Bone w="60%" h={12} style={{ marginTop: 4 }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Bone w={110} h={28} r={4} />
              <Bone w={130} h={28} r={4} />
              <Bone w={100} h={28} r={4} />
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <SkeletonKpiCards />

      {/* Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SkeletonPanel rows={4} />
          <SkeletonPanel rows={3} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SkeletonPanel rows={3} />
          <SkeletonPanel rows={2} />
          <SkeletonPanel rows={4} />
        </div>
      </div>
    </div>
  );
}

/* ─── Browse Category ─────────────────────────────── */
export function BrowseCategorySkeleton() {
  return (
    <section className="hh-root">
      <div style={{
        display: 'grid', gridTemplateColumns: '270px 1fr',
        maxWidth: '100%', padding: 'calc(80px + 28px) 12px 0',
        gap: 0, alignItems: 'start',
      }}>
        <LeftSidebar />
        <div style={{ borderLeft: '1px solid var(--hh-line)', minHeight: '100vh' }}>
          {/* Header */}
          <div style={{ padding: '16px 28px 20px', borderBottom: '1px solid var(--hh-line)' }}>
            <Bone w={160} h={22} style={{ marginBottom: 8 }} />
            <Bone w={200} h={11} />
          </div>

          {/* Filter bar */}
          <SkeletonFilterBar />

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, padding: '16px 28px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ border: '1px solid var(--hh-line)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <Bone w={36} h={36} r="50%" className="skeleton-circle" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Bone w="55%" h={11} />
                    <Bone w="35%" h={9} />
                  </div>
                </div>
                <Bone h="auto" r={10} style={{ width: '100%', aspectRatio: '16/10', marginBottom: 14 }} className="skeleton-rect" />
                <Bone w="70%" h={13} style={{ marginBottom: 8 }} />
                <Bone w="45%" h={10} style={{ marginBottom: 14 }} />
                <div style={{ display: 'flex', gap: 16, padding: 12, background: 'var(--hh-s2)', borderRadius: 10,  border: '1px solid var(--hh-line)' }}>
                  <div style={{ flex: 1, display: 'flex', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <Bone w={55} h={9} />
                      <Bone w={70} h={15} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <Bone w={50} h={9} />
                      <Bone w={65} h={15} />
                    </div>
                  </div>
                  <Bone w={80} h={32} r={8} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   ACCOUNT PAGES SKELETONS
═══════════════════════════════════════════════════════ */

export function AccountSkeletonLayout({ titleWidth = 120, children }: { titleWidth?: number; children: React.ReactNode }) {
  return (
    <section className="hh-root">
      <div style={{
        display: 'grid', gridTemplateColumns: '270px 1fr',
        maxWidth: '100%', padding: 'calc(80px + 28px) 12px 0', gap: 0, alignItems: 'start'
      }}>
        <LeftSidebar />
        <div style={{ borderLeft: '1px solid var(--hh-line)', minHeight: '100vh' }}>
          <div style={{ padding: '16px 28px 20px', borderBottom: '1px solid var(--hh-line)' }}>
            <Bone w={titleWidth} h={24} style={{ marginBottom: 10 }} />
            <Bone w={40} h={2} />
          </div>
          <div style={{ padding: '24px 28px 64px' }}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WatchlistSkeleton() {
  return (
    <AccountSkeletonLayout titleWidth={160}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <SkeletonPostCard />
        <SkeletonPostCard />
      </div>
    </AccountSkeletonLayout>
  );
}

export function MyBidsSkeleton() {
  return (
    <AccountSkeletonLayout titleWidth={140}>
      <div className="flex gap-5 border-b pb-0 mb-5" style={{ borderColor: 'var(--hh-line)' }}>
        <Bone w={120} h={12} style={{ marginBottom: 14 }} />
        <Bone w={90} h={12} style={{ marginBottom: 14 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <SkeletonPostCard />
        <SkeletonPostCard />
      </div>
    </AccountSkeletonLayout>
  );
}

export function WalletPageSkeleton() {
  return (
    <AccountSkeletonLayout titleWidth={110}>
      <div className="space-y-6">
        {/* Balance Card */}
        <div className="border rounded-xl p-8" style={{ background: 'var(--hh-s1)', borderColor: 'var(--hh-line)' }}>
          <Bone w={160} h={12} style={{ marginBottom: 16 }} />
          <Bone w={220} h={48} style={{ marginBottom: 32 }} />
          <div className="flex gap-3">
            <Bone w={140} h={36} r={4} />
            <Bone w={140} h={36} r={4} />
          </div>
        </div>
        
        {/* Transaction History */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <Bone w={180} h={11} />
            <Bone w={160} h={11} />
          </div>
          <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--hh-line)' }}>
            <div style={{ padding: '14px 20px', background: 'var(--hh-s2)', borderBottom: '1px solid var(--hh-line)', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr' }}>
              <Bone w="60%" h={10} />
              <Bone w="40%" h={10} />
              <Bone w="70%" h={10} />
              <Bone w="80%" h={10} style={{ justifySelf: 'end' }} />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ padding: '16px 20px', background: 'var(--hh-s1)', borderBottom: i === 3 ? 'none' : '1px solid var(--hh-line)', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', alignItems: 'center' }}>
                <Bone w={80} h={12} />
                <div>
                  <Bone w={140} h={14} style={{ marginBottom: 6 }} />
                  <Bone w={90} h={10} />
                </div>
                <Bone w={100} h={12} />
                <Bone w={70} h={14} style={{ justifySelf: 'end' }} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AccountSkeletonLayout>
  );
}
