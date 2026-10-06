// Shared helpers for the "navy + or" component kit.

// Joins truthy class names: cx('a', cond && 'b') -> 'a b'.
export function cx(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Visible keyboard focus, shared by every interactive component. gold-700
// (4.9:1 on white, 3.9:1 on navy) instead of gold-600 (2.7:1) for WCAG 1.4.11.
export const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-700 focus-visible:ring-offset-2';

// Text fields and selects: 12px radius, gold focus, red when invalid.
// `hasTrailing` reserves room on the right for a button or a chevron.
export function fieldClasses(hasError, hasIcon = false, hasTrailing = false) {
    return cx(
        'block w-full rounded-field border bg-white py-2.5 font-body text-sm text-ui-text placeholder:text-ui-muted',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:cursor-not-allowed disabled:bg-ui-bg disabled:text-ui-muted',
        hasIcon ? 'pl-10' : 'pl-3.5',
        hasTrailing ? 'pr-12' : 'pr-3.5',
        hasError
            ? 'border-danger focus:border-danger focus:ring-danger/30'
            : 'border-ui-border focus:border-gold-700 focus:ring-gold-700/25',
    );
}
