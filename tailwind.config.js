import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import plugin from 'tailwindcss/plugin';

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
                // Charte "navy + or": Plus Jakarta Sans for headings (700/800),
                // Inter for body text (also the default "sans"). Self-hosted
                // via @fontsource.
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                heading: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
                body: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // ---- Charte "navy + or" — mirrored as CSS variables in app.css.
                // Contrast rule: light gold (300/500/gradient) is only used as
                // text on navy; on white, gold text uses gold-700 (4.9:1).
                navy: {
                    800: '#16254F',
                    900: '#0F1B3D',
                    950: '#0A1128',
                },
                gold: {
                    50: '#FDF6E3',
                    100: '#FBEBC0',
                    300: '#F8DA6A',
                    500: '#E0A82E',
                    600: '#D49533',
                    700: '#9A6700',
                },
                // Charts only: secondary series (the main series is gold), never UI chrome.
                indigo: {
                    50: '#EEEBFC',
                    500: '#5B45D6',
                },
                // Status colours. DEFAULT is for icons, borders and fills; the
                // 50/700 shades pair up for AA-compliant badges and text.
                success: {
                    DEFAULT: '#16A34A',
                    50: '#F0FDF4',
                    700: '#15803D',
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    50: '#FFFBEB',
                    700: '#92400E',
                },
                danger: {
                    DEFAULT: '#DC2626',
                    50: '#FEF2F2',
                    700: '#B91C1C',
                },
                // Informational badges (blue, outside the brand palette).
                info: {
                    50: '#EFF6FF',
                    700: '#1D4ED8',
                },
                whatsapp: '#25D366',
                // Neutrals: bg-ui-bg, border-ui-border, text-ui-text, text-ui-muted.
                ui: {
                    bg: '#F5F7FB',
                    border: '#E5E9F2',
                    text: '#0F172A',
                    // Darkened from #64748B (4.4:1 on ui-bg) to pass AA on every surface.
                    muted: '#5B6B82',
                },
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(180deg, #F8DA6A 0%, #D49533 100%)',
            },
            borderRadius: {
                card: '16px',
                field: '12px',
            },
            boxShadow: {
                // Charte "navy + or": soft navy-tinted shadows.
                card: '0 1px 2px rgba(15,27,61,.04), 0 4px 16px -4px rgba(15,27,61,.08)',
                float: '0 2px 4px rgba(15,27,61,.06), 0 16px 40px -8px rgba(15,27,61,.18)',
            },
        },
    },

    plugins: [
        forms,
        // text-gold-gradient: gradient-filled text, for navy backgrounds only.
        plugin(({ addUtilities }) => {
            addUtilities({
                '.text-gold-gradient': {
                    backgroundImage: 'linear-gradient(180deg, #F8DA6A 0%, #D49533 100%)',
                    backgroundClip: 'text',
                    '-webkit-background-clip': 'text',
                    color: 'transparent',
                },
            });
        }),
    ],
};
