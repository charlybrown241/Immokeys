import { cx } from '@/Components/ui';

// Brand-asset PNGs (brand-assets/brand) are not in the repo yet, so the
// logo is a typographic wordmark for now. Once the files are provided, swap
// the markup below for an <img src="/images/brand/..."> with explicit
// width/height; every caller already goes through <Logo variant="..." />.
//
// Variants: dark = on navy/black, light = on white/light backgrounds,
// white = on photos, icon / icon-light = collapsed sidebar and mobile header
// (on dark / on light backgrounds). Never stretch it or add shadows/effects.

// Supported heights in px; anything below 28 is clamped to the minimum.
const heights = {
    28: { box: 'h-7', text: 'text-lg', icon: 'h-7 w-7 text-xs' },
    32: { box: 'h-8', text: 'text-xl', icon: 'h-8 w-8 text-sm' },
    36: { box: 'h-9', text: 'text-2xl', icon: 'h-9 w-9 text-sm' },
    40: { box: 'h-10', text: 'text-[1.7rem]', icon: 'h-10 w-10 text-base' },
    48: { box: 'h-12', text: 'text-[2rem]', icon: 'h-12 w-12 text-lg' },
};

function sizeFor(height) {
    const supported = Object.keys(heights).map(Number);
    const match = supported.filter((value) => value <= Math.max(height, 28)).pop();
    return heights[match];
}

const wordmarkColors = {
    dark: ['text-white', 'text-gold-300'],
    light: ['text-navy-900', 'text-gold-700'],
    white: ['text-white', 'text-white'],
};

const iconColors = {
    icon: 'bg-gold-gradient text-navy-900',
    'icon-light': 'bg-navy-900 text-gold-300',
};

export default function Logo({ variant = 'light', height = 36, className = '' }) {
    const size = sizeFor(height);

    if (iconColors[variant]) {
        return (
            <span
                role="img"
                aria-label="ImmoKeys"
                translate="no"
                className={cx(
                    'inline-flex shrink-0 items-center justify-center rounded-field font-heading font-extrabold',
                    size.icon,
                    iconColors[variant],
                    className,
                )}
            >
                <span aria-hidden="true">IK</span>
            </span>
        );
    }

    const [immo, keys] = wordmarkColors[variant] ?? wordmarkColors.light;

    return (
        <span
            translate="no"
            className={cx(
                'inline-flex shrink-0 items-center font-heading font-extrabold leading-none tracking-tight',
                size.box,
                size.text,
                className,
            )}
        >
            <span className={immo}>Immo</span>
            <span className={keys}>Keys</span>
        </span>
    );
}
