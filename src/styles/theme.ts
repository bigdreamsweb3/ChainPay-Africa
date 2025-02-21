export const theme = {
  colors: {
    // Brand colors from the logo
    brand: {
      primary: '#0066CC',    // Blue from logo
      secondary: '#FF9900',  // Orange from logo
      accent: '#00AAFF',     // Light blue accent
    },
    // Status colors
    status: {
      success: '#00C853',
      warning: '#FFB300',
      error: '#FF3D00',
      info: '#0091EA',
    },
    // Background colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      dark: '#1E293B',
    },
    // Text colors
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      light: '#FFFFFF',
    },
    // Border colors
    border: {
      light: '#E2E8F0',
      dark: '#CBD5E1',
    },
  },
  // Gradients
  gradients: {
    primary: 'from-brand-primary to-brand-accent',
    secondary: 'from-brand-secondary to-status-warning',
  },
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  // Border radius
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  // Animation durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  // Breakpoints
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
}

export type Theme = typeof theme; 