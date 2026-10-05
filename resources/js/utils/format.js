const madFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

/** "2500.00" -> "2 500 MAD" */
export function formatMad(value) {
    return `${madFormatter.format(Number(value))} MAD`;
}
