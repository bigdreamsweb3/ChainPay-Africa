exports.theme = {
  colors: {
    brand: {
      primary: '#0066CC',    // Blue from logo
      secondary: '#FF9900',  // Orange from logo
      accent: '#00AAFF',
      highlight: "#FFB74D", // Lighter orange
      success: "#2ECC71", // Green for success states

    },
    status: {
      success: "#2ECC71",
      warning: "#F39C12",
      error: "#E74C3C",
      info: "#3498DB",
    },
    background: {
      main: "#FFFFFF", // White background
      card: "#F8FAFC", // Very light gray for cards
      hover: "#EDF2F7", // Light gray for hover states
      light: "#FFFFFF", // Pure white
      overlay: "rgba(10, 130, 205, 0.05)", // Transparent blue overlay
    },
    text: {
      primary: "#1A202C", // Dark gray for primary text
      secondary: "#4A5568", // Medium gray for secondary text
      muted: "#718096", // Lighter gray for muted text
      dark: "#2D3748", // Very dark gray
    },
    border: {
      light: "#E2E8F0", // Light gray for borders
      medium: "#CBD5E0", // Medium gray for borders
      focus: "rgba(10, 130, 205, 0.3)", // Transparent blue for focus states
    },
  },
  gradients: {
    'primary': "linear-gradient(45deg, #0A82CD, #35B0FF)",
    'accent': "linear-gradient(45deg, #F39C12, #FFB74D)",
    'light': "linear-gradient(180deg, #FFFFFF, #F8FAFC)",
    'glass': "linear-gradient(45deg, rgba(248, 250, 252, 0.8), rgba(255, 255, 255, 0.8))",
  },
  shadows: {
    small: "0 1px 3px rgba(0, 0, 0, 0.1)",
    medium: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
    large: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    focus: "0 0 0 3px rgba(10, 130, 205, 0.3)",
  },
  radius: {
    small: "4px",
    medium: "8px",
    large: "12px",
    pill: "9999px",
    circle: "50%",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  animations: {
    transition: "all 0.2s ease-in-out",
    fade: "fade 0.3s ease-in-out",
    slideUp: "slideUp 0.3s ease-out forwards",
    slideRight: "slideRight 0.3s ease-out forwards",
  },
};

exports.keyframes = {
  fade: {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
  slideUp: {
    "0%": { opacity: 0, transform: "translateY(10px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
  slideRight: {
    "0%": { opacity: 0, transform: "translateX(-10px)" },
    "100%": { opacity: 1, transform: "translateX(0)" },
  },
}; 