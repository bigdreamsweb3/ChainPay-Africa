const { theme, keyframes } = require("./src/styles/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: theme.colors.brand,
                status: theme.colors.status,
                background: theme.colors.background,

                text: theme.colors.text,
                border: theme.colors.border,
                'chainpay': {
                    // Blue colors from logo
                    'blue-light': '#00AAFF',
                    'blue': '#0088CC',
                    'blue-dark': '#0066CC',
                    // Orange/yellow colors from logo
                    'orange': '#FFAA00',
                    'orange-light': '#FFBB33',
                    'orange-dark': '#FF9900',
                },
                'brand-primary': '#0088CC',    // Main blue from logo
                'brand-accent': '#FFAA00',     // Orange from logo
                'brand-secondary': '#0066CC',  // Darker blue from logo
                'text-primary': '#1F2937',     // Dark gray for text
                'text-secondary': '#6B7280',   // Medium gray for secondary text
                'text-muted': '#9CA3AF',       // Light gray for muted text
                'background-main': '#F9FAFB',  // Very light gray for main background
                'background-card': '#FFFFFF',  // White for card backgrounds
                'background-dark': '#1F2937',  // Dark background
                'border-light': '#E5E7EB',     // Light border color
                'border-medium': '#D1D5DB',    // Medium border color
            },
            gradientColorStops: theme.colors,
            backgroundImage: theme.gradients,
            boxShadow: theme.shadows,
            borderRadius: theme.radius,
            keyframes,
            animation: theme.animations,
            screens: {
                xs: "480px",
                sm: theme.breakpoints.sm,
                md: theme.breakpoints.md,
                lg: theme.breakpoints.lg,
                xl: theme.breakpoints.xl,
            },
        },
    },
    plugins: [],
};