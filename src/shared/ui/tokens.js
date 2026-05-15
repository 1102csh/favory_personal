// src/shared/ui/tokens.js
export const tokens = Object.freeze({
  color: {
    primary: '#D4A373',
    primaryHover: '#C08D5C',
    primaryDisabled: '#E8C9A8',
    text: '#2B2B2B',
    textMuted: '#6B6B6B',
    border: '#E0E0E0',
    background: '#FFFFFF',
    backgroundSoft: '#FAF6F2',
    danger: '#D64545',
    success: '#3BA776',
  },
  radius: { sm: '4px', md: '8px', lg: '12px' },
  spacing: (n) => `${n * 4}px`,
  font: {
    family: `'Pretendard', system-ui, -apple-system, sans-serif`,
    sizeBase: '14px',
  },
});