// Class strings shared by the pages not yet rebuilt on Components/ui
// (Badge, Input...). Same tokens as the kit, so both look identical.

const pill = 'inline-flex items-center gap-1 rounded-full font-semibold ring-1 ring-inset';

export const badgeSuccess = `${pill} bg-success-50 text-success-700 ring-success/20`;

export const badgeWarning = `${pill} bg-warning-50 text-warning-700 ring-warning/30`;

export const badgeNeutral = `${pill} bg-ui-bg text-ui-text ring-ui-border`;

export const badgeDanger = `${pill} bg-danger-50 text-danger-700 ring-danger/20`;

// Text inputs, selects and textareas: 12px radius, gold focus, greyed when
// disabled. Callers add layout classes (mt-1 block w-full...).
export const inputClasses =
    'rounded-field border-ui-border bg-white px-3.5 py-2.5 font-body text-sm text-ui-text placeholder:text-ui-muted focus:border-gold-600 focus:ring-gold-600/30 disabled:cursor-not-allowed disabled:bg-ui-bg disabled:text-ui-muted';
