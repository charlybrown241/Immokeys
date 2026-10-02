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
                // Darkened from the mockup's #8A8075 to reach WCAG AA (4.5:1)
                // on white, cream and disabled fields.
                'ink-soft': '#70665B',
                navbar: '#1E1B18',
                // Raised surface on the navbar/footer (avatar, separators).
                'navbar-soft': '#3A352E',
                'navbar-ink': '#F3EDE3',
                'navbar-ink-dim': '#B6AEA2',
                accent: '#C2652E',
                // Accent for small text and white-on-accent buttons: #C2652E
                // only reaches 4:1, this shade reaches 5.6:1 on white.
                'accent-strong': '#A15225',
                'accent-ink': '#FFFFFF',
                'success-bg': '#E6EEDC',
                'success-ink': '#55682F',
                'pending-bg': '#F6E7D6',
                'pending-ink': '#8A5A22',
                line: '#EAE3D6',
                // Greys from the mockup: disabled field, upcoming wizard step.
                'surface-muted': '#F2EFE7',
                idle: '#EEEAE2',
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
