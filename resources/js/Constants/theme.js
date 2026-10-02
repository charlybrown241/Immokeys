// Recurring Tailwind class strings from the "Maquette pro" design, shared
// so status badges look identical on every page.

const pill = 'inline-flex items-center gap-1 rounded-full font-semibold';

export const badgeCertified = `${pill} bg-success-bg text-success-ink`;

export const badgePending = `${pill} bg-pending-bg text-pending-ink`;

export const badgeNeutral = `${pill} bg-line text-ink`;

export const badgeDanger = `${pill} bg-red-100 text-red-800`;

// Text inputs, selects and textareas: line border, 10px radius, greyed when
// disabled. Callers add layout classes (mt-1 block w-full...).
export const inputClasses =
    'rounded-input border-line px-[13px] py-[11px] text-sm text-ink placeholder:text-ink-soft focus:border-accent focus:ring-accent disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-soft';
