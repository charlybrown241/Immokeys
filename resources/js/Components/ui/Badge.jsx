import { cx } from './styles';

// Every pair reaches at least 4.5:1 (WCAG AA, small text).
const variants = {
    success: 'bg-success-50 text-success-700 ring-success/20',
    warning: 'bg-warning-50 text-warning-700 ring-warning/30',
    danger: 'bg-danger-50 text-danger-700 ring-danger/20',
    info: 'bg-blue-50 text-blue-700 ring-blue-700/15',
    neutral: 'bg-ui-bg text-ui-text ring-ui-border',
    brand: 'bg-gold-50 text-gold-700 ring-gold-600/30',
};

const sizes = {
    sm: 'gap-1 px-2 py-0.5 text-xs',
    md: 'gap-1.5 px-2.5 py-1 text-sm',
};

/** Pill-shaped status label; `icon` takes a lucide icon. */
export default function Badge({ variant = 'neutral', size = 'sm', icon: Icon, className = '', children, ...props }) {
    return (
        <span
            {...props}
            className={cx(
                'inline-flex items-center rounded-full font-body font-semibold ring-1 ring-inset',
                variants[variant],
                sizes[size],
                className,
            )}
        >
            {Icon && <Icon size={size === 'sm' ? 12 : 14} aria-hidden="true" />}
            {children}
        </span>
    );
}
