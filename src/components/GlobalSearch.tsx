// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IIcon from './IIcon';

// ──────────────────────────────────────────────────────────────
// Search data — celebrities have avatarUrl, items do not
// ──────────────────────────────────────────────────────────────
const SEARCH_DATA = [
  // ── Celebrities ──────────────────────────────────
  {
    type: 'celebrity', id: 'vk',
    name: 'Virat Kohli', category: 'Cricketer',
    href: '/celebrity/vk',
    avatarInitials: 'VK', avatarBg: '#1e40af',
  },
  {
    type: 'celebrity', id: 'msd',
    name: 'MS Dhoni', category: 'Cricketer',
    href: '/celebrity/msd',
    avatarInitials: 'MS', avatarBg: '#1d4ed8',
  },
  {
    type: 'celebrity', id: 'hp',
    name: 'Hardik Pandya', category: 'Cricketer',
    href: '/celebrity/hp',
    avatarInitials: 'HP', avatarBg: '#1e3a8a',
  },
  {
    type: 'celebrity', id: 'rs',
    name: 'Ranveer Singh', category: 'Bollywood Actor',
    href: '/celebrity/rs',
    avatarInitials: 'RS', avatarBg: '#881337',
  },
  {
    type: 'celebrity', id: 'ab',
    name: 'Alia Bhatt', category: 'Bollywood Actress',
    href: '/celebrity/ab',
    avatarInitials: 'AB', avatarBg: '#9f1239',
  },
  {
    type: 'celebrity', id: 'pc',
    name: 'Priyanka Chopra', category: 'Bollywood Actress',
    href: '/celebrity/pc',
    avatarInitials: 'PC', avatarBg: '#be185d',
  },
  {
    type: 'celebrity', id: 'amitabh',
    name: 'Amitabh Bachchan', category: 'Bollywood Icon',
    href: '/celebrity/amitabh',
    avatarInitials: 'AB', avatarBg: '#b45309',
  },
  {
    type: 'celebrity', id: 'badshah',
    name: 'Badshah', category: 'Rapper',
    href: '/celebrity/badshah',
    avatarInitials: 'BD', avatarBg: '#5b21b6',
  },
  {
    type: 'celebrity', id: 'arr',
    name: 'A.R. Rahman', category: 'Music Composer',
    href: '/celebrity/arr',
    avatarInitials: 'AR', avatarBg: '#4c1d95',
  },
  {
    type: 'celebrity', id: 'bb',
    name: 'Bhuvan Bam', category: 'Content Creator',
    href: '/celebrity/bb',
    avatarInitials: 'BB', avatarBg: '#065f46',
  },
  {
    type: 'celebrity', id: 'nc',
    name: 'Neeraj Chopra', category: 'Olympian',
    href: '/celebrity/nc',
    avatarInitials: 'NC', avatarBg: '#78350f',
  },
  {
    type: 'celebrity', id: 'pv',
    name: 'PV Sindhu', category: 'Olympian',
    href: '/celebrity/pv',
    avatarInitials: 'PV', avatarBg: '#92400e',
  },

  // ── Items ──────────────────────────────────────────
  {
    type: 'item', id: 'i1',
    name: 'Match-Worn 2023 World Cup Jersey — Signed',
    category: 'Cricket · Lot #0847',
    href: '/browse/cricketers',
    price: '₹84,000',
  },
  {
    type: 'item', id: 'i2',
    name: '2011 World Cup Winning Gloves — Match Worn',
    category: 'Cricket · Lot #0841',
    href: '/browse/cricketers',
    price: '₹2,40,000',
  },
  {
    type: 'item', id: 'i3',
    name: 'Rocky Aur Rani Custom Jacket — Film Set Piece',
    category: 'Cinema · Lot #0852',
    href: '/browse/bollywood',
    price: '₹42,000',
  },
  {
    type: 'item', id: 'i4',
    name: 'Hand-woven Banarasi Saree — Met Gala Afterparty',
    category: 'Cinema · Lot #0894',
    href: '/browse/bollywood',
    price: '₹1,92,000',
  },
  {
    type: 'item', id: 'i5',
    name: 'Signed Custom Performance Jacket — Sanak Tour',
    category: 'Music · Lot #0872',
    href: '/browse/musicians',
    price: '₹38,900',
  },
  {
    type: 'item', id: 'i6',
    name: 'IPL 2023 Match-Used Cricket Bat — Season Signed',
    category: 'Cricket · Lot #0848',
    href: '/browse/cricketers',
    price: '₹1,18,500',
  },
  {
    type: 'item', id: 'i7',
    name: 'Original "Don" Movie Script Page — Signed',
    category: 'Cinema · Lot #0901',
    href: '/browse/bollywood',
    price: '₹65,000',
  },
  {
    type: 'item', id: 'i8',
    name: 'First 1M Subscribers Golden Play Button',
    category: 'Creators · Lot #0921',
    href: '/browse/creators',
    price: '₹1,25,000',
  },
];

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = query.trim().length > 0
    ? SEARCH_DATA.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const celebrities = results.filter(r => r.type === 'celebrity');
  const items = results.filter(r => r.type === 'item');

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (href: string) => {
    setQuery('');
    setFocused(false);
    navigate(href);
  };

  const showDropdown = focused && query.trim().length > 0;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: 360 }}>
      {/* Search Input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: focused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${focused ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: 12, padding: '10px 16px',
        transition: 'all 0.2s ease',
      }}>
        <IIcon icon="lucide:search" width={16} style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search celebrities or items…"
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: '#fff', fontSize: 14, fontFamily: 'inherit',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            style={{ color: 'rgba(255,255,255,0.3)', lineHeight: 1, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            <IIcon icon="lucide:x" width={13} />
          </button>
        )}
        <kbd style={{
          fontSize: 11, color: 'rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 6, padding: '3px 7px', fontFamily: 'inherit', flexShrink: 0,
          display: query ? 'none' : 'block',
        }}>⌘K</kbd>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
          background: '#111113', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)', zIndex: 9999,
        }}>
          {results.length === 0 ? (
            <div style={{ padding: '20px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
              No results for "{query}"
            </div>
          ) : (
            <>
              {/* Celebrities section */}
              {celebrities.length > 0 && (
                <>
                  <div style={{ padding: '8px 14px 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                    Celebrities
                  </div>
                  {celebrities.map(cel => (
                    <button
                      key={cel.id}
                      onClick={() => handleSelect(cel.href)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
                        textAlign: 'left', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      {/* Circular profile photo */}
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: cel.avatarBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: '#fff',
                        flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)',
                      }}>
                        {cel.avatarInitials}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{cel.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{cel.category}</div>
                      </div>
                      <IIcon icon="lucide:arrow-right" width={13} style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)' }} />
                    </button>
                  ))}
                </>
              )}

              {/* Divider */}
              {celebrities.length > 0 && items.length > 0 && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
              )}

              {/* Items section */}
              {items.length > 0 && (
                <>
                  <div style={{ padding: '8px 14px 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                    Lots & Items
                  </div>
                  {items.map(itm => (
                    <button
                      key={itm.id}
                      onClick={() => handleSelect(itm.href)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
                        textAlign: 'left', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      {/* No photo for items — just an icon box */}
                      <div style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, color: 'rgba(255,255,255,0.25)',
                      }}>
                        <IIcon icon="lucide:package" width={16} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#eee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{itm.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{itm.category}</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#D4AF37', flexShrink: 0 }}>{itm.price}</div>
                    </button>
                  ))}
                </>
              )}

              {/* Footer */}
              <div style={{
                padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.06)',
                fontSize: 11, color: 'rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <IIcon icon="lucide:search" width={11} />
                Press Enter to search all lots
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
