// src/features/profile/components/TabBar/TabBar.jsx

export default function TabBar({ tabs, tab, setTab, isMobile }) {
  return (
    <div className="au d3" style={{ marginBottom: 14 }}>
      <div
        style={{
          display: 'flex',
          gap: isMobile ? 16 : 18,
          borderBottom: '1px solid var(--line)',
          overflowX: isMobile ? 'auto' : 'visible',
        }}
      >
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`tab-line ${tab === item ? 'on' : ''}`}
            style={{
              padding: isMobile ? '14px 4px 12px' : '15px 6px 13px',
              border: 'none',
              position: 'relative',
              borderRadius: 0,
              background: 'transparent',
              color: tab === item ? 'var(--text-main)' : 'var(--text-light)',
              fontSize: isMobile ? 15 : 16,
              fontWeight: tab === item ? 600 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.18s ease',
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}