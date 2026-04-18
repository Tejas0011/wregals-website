// @ts-nocheck
import type { ReactNode } from 'react';
import LeftSidebar from './LeftSidebar';
import { Link } from 'react-router-dom';

interface AccountLayoutProps {
  user: any;
  onSignInClick: () => void;
  children: ReactNode;
  title: string;
}

export default function AccountLayout({ children, title }: AccountLayoutProps) {
  return (
    <section className="hh-root">
      {/* Same 2-column grid as LiveAuctions - LHS sidebar + content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '270px 1fr',
        maxWidth: '100%',
        padding: 'calc(80px + 28px) 12px 0',
        gap: '0',
        alignItems: 'start',
      }}>
        {/* LHS Sidebar - same as home page */}
        <LeftSidebar />

        {/* Main content area */}
        <div style={{ borderLeft: '1px solid var(--hh-line)', minHeight: '100vh' }}>
          {/* Page header */}
          <div style={{ padding: '16px 28px 20px', borderBottom: '1px solid var(--hh-line)' }}>

            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--hh-w1)', letterSpacing: '-0.3px' }}>
              {title}
            </h1>
            <div style={{ height: 2, width: 40, background: 'var(--hh-line2)', marginTop: 10 }} />
          </div>

          {/* Content */}
          <div style={{ padding: '24px 28px 64px' }}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
