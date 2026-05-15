// src/features/profile/components/Badge/Badge.jsx
import { TYPE_STYLE } from '../../constants/typeStyle';

export default function Badge({ type }) {
  const s = TYPE_STYLE[type];
  if (!s) return null;

  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 10.5,
        fontWeight: 700,
        padding: '4px 10px',
        borderRadius: 999,
        letterSpacing: '-0.01em',
        flexShrink: 0,
        border: '1px solid rgba(255,255,255,0.55)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {type}
    </span>
  );
}