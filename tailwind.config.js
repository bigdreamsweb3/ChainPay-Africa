const { theme } = require("./src/styles/theme");

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
                bg: theme.colors.background,
                text: theme.colors.text,
            },
            gradientColorStops: theme.colors,
            backgroundImage: theme.gradients,
            boxShadow: theme.shadows,
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
};