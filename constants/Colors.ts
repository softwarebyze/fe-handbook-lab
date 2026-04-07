/**
 * Semantic palette: engineering-forward teal on cool slate.
 * Keep `text`, `background`, `tint`, `tabIconDefault` for Themed.tsx compatibility.
 */
export const light = {
  text: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  background: '#eef2f6',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  tint: '#0d9488',
  tintSecondary: '#0f766e',
  tabIconDefault: '#94a3b8',
  tabIconSelected: '#0d9488',
  success: '#059669',
  successMuted: 'rgba(5, 150, 105, 0.14)',
  danger: '#dc2626',
  dangerMuted: 'rgba(220, 38, 38, 0.12)',
  warning: '#d97706',
  chartFill: '#f8fafc',
  chartGrid: '#e2e8f0',
  chartZeroLine: '#cbd5e1',
  tabBar: '#ffffff',
  heroOverlay: 'rgba(13, 148, 136, 0.08)',
} as const;

export const dark = {
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  background: '#0b1120',
  surface: '#141b2d',
  surfaceElevated: '#1a2336',
  border: '#2d3b55',
  borderStrong: '#3d4f6f',
  tint: '#2dd4bf',
  tintSecondary: '#5eead4',
  tabIconDefault: '#64748b',
  tabIconSelected: '#2dd4bf',
  success: '#34d399',
  successMuted: 'rgba(52, 211, 153, 0.16)',
  danger: '#f87171',
  dangerMuted: 'rgba(248, 113, 113, 0.14)',
  warning: '#fbbf24',
  chartFill: '#141b2d',
  chartGrid: '#2d3b55',
  chartZeroLine: '#3d4f6f',
  tabBar: '#111827',
  heroOverlay: 'rgba(45, 212, 191, 0.1)',
} as const;

export type AppColors = typeof light | typeof dark;

export default {
  light,
  dark,
};
