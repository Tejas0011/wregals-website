// @ts-nocheck
import { useState } from 'react';
import type { ReactNode } from 'react';
import LeftSidebar from './LeftSidebar';
import IIcon from './IIcon';
import { Link } from 'react-router-dom';

interface AccountLayoutProps {
  user: any;
  onSignInClick: () => void;
  children: ReactNode;
  title: string;
}

export default function AccountLayout({ children, title }: AccountLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <section className="hh-root">
      {/* Mobile sidebar toggle */}
      <button
        className="hh-mobile-sidebar-toggle"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle sidebar"
      >
        <IIcon icon={sidebarOpen ? 'lucide:x' : 'lucide:menu'} width={20} />
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="hh-mobile-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2-column grid: sidebar + content */}
      <div className="hh-account-grid">
        {/* LHS Sidebar */}
        <div className={`hh-account-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <LeftSidebar />
        </div>

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

      <style>{`
        .hh-account-grid {
          display: grid;
          grid-template-columns: 270px 1fr;
          max-width: 100%;
          padding: calc(80px + 28px) 12px 0;
          gap: 0;
          align-items: start;
        }

        .hh-mobile-sidebar-toggle {
          display: none;
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 60;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--hh-s2, #111);
          border: 1px solid var(--hh-line, rgba(255,255,255,0.06));
          color: white;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .hh-mobile-sidebar-overlay {
          display: none;
        }

        .hh-account-sidebar {
          display: block;
        }

        @media (max-width: 768px) {
          .hh-account-grid {
            grid-template-columns: 1fr;
            padding: calc(60px + 16px) 0 0;
          }

          .hh-account-sidebar {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 280px;
            z-index: 55;
            background: var(--hh-s1, #0a0a0a);
            padding-top: 80px;
            overflow-y: auto;
            border-right: 1px solid var(--hh-line, rgba(255,255,255,0.06));
          }

          .hh-account-sidebar.open {
            display: block;
          }

          .hh-mobile-sidebar-toggle {
            display: flex;
          }

          .hh-mobile-sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 50;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
          }
        }
      `}</style>
    </section>
  );
}
