import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,jsx}',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                display: ['Fraunces', 'Georgia', 'serif'],
            },
            // "Maquette pro" design tokens — mirrored as CSS custom properties
            // in app.css for the few rules written outside Tailwind (price slider).
            colors: {
                bg: '#FAF6EF',
                surface: '#FFFFFF',
                ink: '#2A2622',
                'ink-soft': '#8A8075',
                navbar: '#1E1B18',
                'navbar-ink': '#F3EDE3',
                'navbar-ink-dim': '#B6AEA2',
                accent: '#C2652E',
                'accent-ink': '#FFFFFF',
                'success-bg': '#E6EEDC',
                'success-ink': '#55682F',
                'pending-bg': '#F6E7D6',
                'pending-ink': '#8A5A22',
                line: '#EAE3D6',
                // Shade scale around the accent, kept for hover/focus states.
                terracotta: {
                    DEFAULT: '#C2652E',
                    50: '#FBF3EE',
                    100: '#F6E3D6',
                    200: '#EDC4AA',
                    300: '#E0A07B',
                    400: '#D17F4F',
                    500: '#C9713C',
                    600: '#C2652E',
                    700: '#A15225',
                    800: '#7F4220',
                    900: '#66361C',
                },
            },
            borderRadius: {
                card: '16px',
                input: '10px',
            },
            boxShadow: {
                card: '0 1px 2px rgba(20,16,10,.06), 0 18px 40px -22px rgba(20,16,10,.3)',
            },
        },
    },

    plugins: [forms],
};
