// @ts-nocheck
import { Link } from 'react-router-dom';
import LeftSidebar from '../components/LeftSidebar';

const CATEGORIES = [
  { id: 'sports', name: 'Sports', count: 47, color: '#3B82F6' },
  { id: 'cinema', name: 'Cinema', count: 83, color: '#EC4899' },
  { id: 'musicians', name: 'Musicians & Artists', count: 31, color: '#8B5CF6' },
  { id: 'creators', name: 'Content Creators', count: 22, color: '#10B981' },
  { id: 'athletes', name: 'Athletes', count: 19, color: '#F59E0B' },
  { id: 'tv-stars', name: 'TV & OTT Stars', count: 27, color: '#F43F5E' },
  { id: 'comedians', name: 'Stand-up & Comedy', count: 12, color: '#06B6D4' },
  { id: 'fashion', name: 'Fashion', count: 34, color: '#D946EF' },
  { id: 'entrepreneurs', name: 'Entrepreneurs', count: 11, color: '#14B8A6' },
  { id: 'others', name: 'Others', count: 9, color: '#D4AF37' },
];

export default function AllCategories() {
  return (
    <section className="hh-root">
      <div style={{
        display: 'grid',
        gridTemplateColumns: '270px 1fr',
        maxWidth: '100%',
        padding: 'calc(80px + 28px) 12px 0',
        gap: '0',
        alignItems: 'start',
      }}>
        <LeftSidebar />

        <div style={{ borderLeft: '1px solid var(--hh-line)', minHeight: '100vh', paddingBottom: 64 }}>
          {/* Header */}
          <div style={{ padding: '16px 28px 20px', borderBottom: '1px solid var(--hh-line)' }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--hh-w1)', letterSpacing: '-0.3px' }}>
              Browse All Categories
            </h1>
            <p style={{ fontSize: 12, color: 'var(--hh-w3)', marginTop: 5 }}>
              Authenticated lots from India's biggest celebrities and icons.
            </p>
          </div>

          {/* 2-column grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.id} to={`/browse/${cat.id}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '17px 24px',
                    borderBottom: '1px solid var(--hh-line)',
                    borderRight: '1px solid var(--hh-line)',
                    cursor: 'pointer',
                    transition: 'background 0.16s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Colored dot */}
                  <span style={{
                    width: 9, height: 9, borderRadius: '50%',
                    background: cat.color,
                    flexShrink: 0,
                    boxShadow: `0 0 6px ${cat.color}80`,
                  }} />

                  {/* Name & count */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: 'var(--hh-w1)',
                      letterSpacing: '-0.1px',
                    }}>
                      {cat.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--hh-w4)', marginTop: 2 }}>
                      {cat.count} active lots
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(255,255,255,0.15)" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
