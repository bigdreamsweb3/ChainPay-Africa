const theme = {
  colors: {
    brand: {
      primary: '#0066FF',
      secondary: '#00C2FF',
      accent: '#FFB800',
      success: '#00D632',
      warning: '#FFB800',
      error: '#FF3366',
      info: '#0091FF',
    },
    status: {
      success: '#00D632',
      warning: '#FFB800',
      error: '#FF3366',
      info: '#0091FF',
    },
    background: {
      main: '#FFFFFF',
      card: '#FFFFFF',
      dark: '#0A0F1E',
      light: '#F5F7FA',
      overlay: 'rgba(10, 15, 30, 0.7)',
    },
    text: {
      primary: '#0A0F1E',
      secondary: '#5A6478',
      muted: '#8F96A7',
      dark: '#0A0F1E',
      light: '#FFFFFF',
    },
    border: {
      light: '#E8EDF5',
      medium: '#D1D8E5',
      dark: '#B4BDCC',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)',
      secondary: 'linear-gradient(135deg, #FFB800 0%, #FFD600 100%)',
      dark: 'linear-gradient(135deg, #0A0F1E 0%, #1A2235 100%)',
    },
  },
  radius: {
    'none': '0',
    'sm': '0.375rem',
    'md': '0.5rem',
    'lg': '0.75rem',
    'xl': '1rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    'full': '9999px',
  },
  shadows: {
    sm: '0 2px 4px rgba(10, 15, 30, 0.05)',
    md: '0 4px 6px rgba(10, 15, 30, 0.07)',
    lg: '0 8px 16px rgba(10, 15, 30, 0.1)',
    xl: '0 12px 24px rgba(10, 15, 30, 0.15)',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      display: 'Inter, system-ui, -apple-system, sans-serif',
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
  }
};

module.exports = { theme };
