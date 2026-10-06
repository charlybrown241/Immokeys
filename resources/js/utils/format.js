const madFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
const numberFormatter = new Intl.NumberFormat('fr-FR');
const relativeFormatter = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

/** "2500.00" -> "2 500 MAD" */
export function formatMad(value) {
    return `${madFormatter.format(Number(value))} MAD`;
}

/** 12500 -> "12 500" */
export function formatNumber(value) {
    return numberFormatter.format(Number(value));
}

/** "2026-10-02" -> "2 oct. 2026" (or a custom Intl option set). */
export function formatDate(value, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
    return value ? new Date(value).toLocaleDateString('fr-FR', options) : '';
}

/** ISO date -> "il y a 3 jours", "hier", "aujourd'hui"... */
export function formatRelative(value) {
    const days = Math.round((new Date(value).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);

    if (Math.abs(days) < 1) return "aujourd'hui";
    if (Math.abs(days) < 30) return relativeFormatter.format(days, 'day');
    return formatDate(value);
}
