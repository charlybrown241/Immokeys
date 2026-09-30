import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                serif: ['Fraunces', ...defaultTheme.fontFamily.serif],
            },
            // Brand palette — mirrored as CSS custom properties in app.css
            // for the few rules written outside Tailwind (price slider).
            colors: {
                cream: '#FAF6F0',
                ink: '#1E1B18',
                charcoal: '#2A2622',
                sand: '#E8E1D6',
                olive: {
                    DEFAULT: '#6B7A4F',
                    100: '#E9ECE1',
                    800: '#434D31',
                },
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
        },
    },

    plugins: [forms],
};
