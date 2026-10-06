import { CHART } from '@/Constants/chart';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

function DonutTooltip({ active, payload, total }) {
    if (!active || !payload?.length) return null;
    const { label, value } = payload[0].payload;

    return (
        <div className="rounded-field border border-ui-border bg-white px-3 py-2 font-body text-sm shadow-float">
            <p className="font-semibold text-ui-text">{label}</p>
            <p className="text-ui-muted">
                {value} sur {total} ({Math.round((value / total) * 100)} %)
            </p>
        </div>
    );
}

/**
 * Donut of parts of a whole. The legend lists every slice with its count
 * and share, so identity never relies on colour alone.
 * `items`: [{ key, label, value, color }]
 */
export default function StatusDonut({ items, unit = 'annonces' }) {
    const reducedMotion = usePrefersReducedMotion();
    const total = items.reduce((sum, item) => sum + item.value, 0);
    const slices = items.filter((item) => item.value > 0);

    return (
        <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col">
            <div className="relative h-44 w-44 shrink-0" aria-hidden="true">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={slices}
                            dataKey="value"
                            nameKey="label"
                            innerRadius="68%"
                            outerRadius="100%"
                            stroke={CHART.surface}
                            strokeWidth={2}
                            startAngle={90}
                            endAngle={-270}
                            isAnimationActive={!reducedMotion}
                        >
                            {slices.map((item) => (
                                <Cell key={item.key} fill={item.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<DonutTooltip total={total} />} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-heading text-3xl font-extrabold text-ui-text">{total}</span>
                    <span className="text-xs text-ui-muted">{unit}</span>
                </div>
            </div>

            <ul className="w-full space-y-2.5 text-sm">
                {items.map((item) => (
                    <li key={item.key} className="flex items-center gap-2.5">
                        <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" aria-hidden="true">
                            <rect width="12" height="12" rx="3" fill={item.color} />
                        </svg>
                        <span className="flex-1 text-ui-text">{item.label}</span>
                        <span className="font-semibold text-ui-text">{item.value}</span>
                        <span className="w-10 text-right text-ui-muted">
                            {total > 0 ? Math.round((item.value / total) * 100) : 0} %
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
