import { cx, focusRing } from '@/Components/ui';
import { CHART } from '@/Constants/chart';
import { formatNumber } from '@/utils/format';
import { Link } from '@inertiajs/react';

/**
 * Horizontal bar ranking in plain HTML + SVG: one row per item, value
 * printed next to the bar. `items`: [{ id, label, value, href, meta }]
 */
export default function RankingBars({ items, unit }) {
    const max = Math.max(...items.map((item) => item.value), 1);

    return (
        <ol className="space-y-4">
            {items.map((item, index) => (
                <li key={item.id}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="flex min-w-0 items-baseline gap-2">
                            <span className="w-4 shrink-0 font-semibold text-ui-muted">{index + 1}</span>
                            {item.href ? (
                                <Link href={item.href} className={cx('truncate rounded-md font-semibold text-ui-text hover:underline', focusRing)}>
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="truncate font-semibold text-ui-text">{item.label}</span>
                            )}
                        </span>
                        <span className="shrink-0 text-ui-text">
                            <span className="font-semibold">{formatNumber(item.value)}</span> {unit}
                        </span>
                    </div>
                    <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="ml-6 mt-1.5 h-2 w-[calc(100%-1.5rem)]" aria-hidden="true">
                        <rect width="100" height="8" rx="4" fill={CHART.grid} />
                        <rect width={Math.max((item.value / max) * 100, item.value > 0 ? 2 : 0)} height="8" rx="4" fill={CHART.gold} />
                    </svg>
                    {item.meta && <p className="ml-6 mt-1 text-xs text-ui-muted">{item.meta}</p>}
                </li>
            ))}
        </ol>
    );
}
