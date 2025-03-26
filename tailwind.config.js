const { theme } = require("./src/styles/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/component/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Use theme colors directly
                brand: theme.colors.brand,
                status: theme.colors.status,
                background: theme.colors.background,
                text: theme.colors.text,
                border: theme.colors.border,
                
                // ChainPay specific colors
                'chainpay': {
                    'blue-light': '#E6F0FF',
                    'blue': '#0066CC',
                    'blue-dark': '#004C99',
                    'orange': '#fda704',
                    'orange-dark': '#E65C00',
                    'orange-light': '#FFF5EB',
                },
            },
            borderRadius: theme.radius,
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
}