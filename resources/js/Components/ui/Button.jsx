import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';
import { cx, focusRing } from './styles';

const variants = {
    // Gold gradient with navy text (6.3:1 on the darkest stop).
    primary: 'bg-gold-gradient text-navy-900 shadow-card hover:brightness-105',
    secondary: 'bg-navy-900 text-white hover:bg-navy-800',
    outline: 'border border-ui-border bg-white text-navy-900 hover:border-navy-900 hover:bg-ui-bg',
    ghost: 'text-navy-900 hover:bg-ui-bg',
    // Navy text: white on #25D366 only reaches 2:1.
    whatsapp: 'bg-whatsapp text-navy-950 hover:brightness-95',
};

const sizes = {
    sm: 'min-h-9 gap-1.5 px-3 text-sm',
    md: 'min-h-11 gap-2 px-4 text-sm',
    lg: 'min-h-12 gap-2 px-6 text-base',
};

const iconSizes = { sm: 16, md: 18, lg: 20 };

/**
 * Button of the "navy + or" kit. Pass `as` (e.g. Inertia's Link or 'a') to
 * render a link styled as a button; `icon` / `iconRight` take lucide icons.
 */
export default forwardRef(function Button(
    {
        as: Component = 'button',
        variant = 'primary',
        size = 'md',
        loading = false,
        disabled = false,
        icon: Icon,
        iconRight: IconRight,
        className = '',
        children,
        ...props
    },
    ref,
) {
    const isDisabled = disabled || loading;
    const iconSize = iconSizes[size];

    const nativeProps =
        Component === 'button'
            ? { type: props.type ?? 'button', disabled: isDisabled }
            : { 'aria-disabled': isDisabled || undefined };

    return (
        <Component
            ref={ref}
            {...props}
            {...nativeProps}
            aria-busy={loading || undefined}
            className={cx(
                'inline-flex items-center justify-center whitespace-nowrap rounded-field font-body font-semibold transition duration-150',
                focusRing,
                variants[variant],
                sizes[size],
                isDisabled && 'pointer-events-none opacity-50',
                className,
            )}
        >
            {loading ? (
                <Loader2 size={iconSize} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
            ) : (
                Icon && <Icon size={iconSize} aria-hidden="true" />
            )}
            {children}
            {IconRight && !loading && <IconRight size={iconSize} aria-hidden="true" />}
        </Component>
    );
});
