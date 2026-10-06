import { cx, focusRing } from '@/Components/ui';
import { CHART } from '@/Constants/chart';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import { formatDate, formatNumber } from '@/utils/format';
import { useId, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const PERIODS = [
    { days: 7, label: '7 jours' },
    { days: 30, label: '30 jours' },
    { days: 90, label: '90 jours' },
];

const plural = (count, unit) => (count > 1 ? unit.other : unit.one);

function ChartTooltip({ active, payload, unit }) {
    if (!active || !payload?.length) return null;
    const point = payload[0].payload;

    return (
        <div className="rounded-field border border-ui-border bg-white px-3 py-2 font-body text-sm shadow-float">
            <p className="text-ui-muted">
                {point.week ? 'Semaine du ' : ''}
                {formatDate(point.date, { weekday: point.week ? undefined : 'short', day: 'numeric', month: 'long' })}
            </p>
            <p className="font-semibold text-ui-text">
                {point.count} {plural(point.count, unit)}
            </p>
        </div>
    );
}

/**
 * Single-series area chart of a daily count (views, WhatsApp contacts...),
 * with a period selector, crosshair tooltip and a data table for screen
 * readers. `unit`: { one, other } labels, e.g. { one: 'vue', other: 'vues' }.
 */
export default function ActivityAreaChart({ series, unit }) {
    const [days, setDays] = useState(30);
    const reducedMotion = usePrefersReducedMotion();
    const gradientId = `activity-${useId().replace(/:/g, '')}`;

    // Beyond a month, daily points are too noisy: group them by week.
    const data = useMemo(() => {
        const points = series.slice(-days);
        if (days <= 30) return points;
        const weeks = [];
        for (let end = points.length; end > 0; end -= 7) {
            const chunk = points.slice(Math.max(end - 7, 0), end);
            weeks.unshift({ date: chunk[0].date, count: chunk.reduce((sum, point) => sum + point.count, 0), week: true });
        }
        return weeks;
    }, [series, days]);
    const total = data.reduce((sum, point) => sum + point.count, 0);

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ui-muted">
                    <span className="font-heading text-2xl font-extrabold text-ui-text">{formatNumber(total)}</span>{' '}
                    {plural(total, unit)} sur {days} jours
                </p>
                <div role="group" aria-label="Période" className="inline-flex rounded-field border border-ui-border bg-ui-bg p-1">
                    {PERIODS.map((period) => (
                        <button
                            key={period.days}
                            type="button"
                            onClick={() => setDays(period.days)}
                            aria-pressed={days === period.days}
                            className={cx(
                                'min-h-9 rounded-lg px-3 text-sm font-semibold transition',
                                focusRing,
                                days === period.days ? 'bg-white text-navy-900 shadow-card' : 'text-ui-muted hover:text-navy-900',
                            )}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4 h-64" aria-hidden="true">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} accessibilityLayer={false}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={CHART.goldFill} stopOpacity={0.55} />
                                <stop offset="100%" stopColor={CHART.goldFill} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke={CHART.grid} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(value) => formatDate(value, { day: 'numeric', month: 'short' })}
                            tick={{ fill: CHART.axis, fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            minTickGap={28}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fill: CHART.axis, fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            width={40}
                        />
                        <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: CHART.axis, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke={CHART.gold}
                            strokeWidth={2}
                            fill={`url(#${gradientId})`}
                            activeDot={{ r: 5, stroke: CHART.surface, strokeWidth: 2, fill: CHART.gold }}
                            isAnimationActive={!reducedMotion}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <details className="mt-3 text-sm">
                <summary className={cx('inline-block cursor-pointer rounded-md font-semibold text-gold-700', focusRing)}>
                    Voir les données en tableau
                </summary>
                <div className="mt-3 max-h-60 overflow-y-auto rounded-field border border-ui-border">
                    <table className="w-full text-left">
                        <caption className="sr-only">
                            {unit.other} par {days > 30 ? 'semaine' : 'jour'}, {days} derniers jours
                        </caption>
                        <thead className="sticky top-0 bg-ui-bg text-xs uppercase tracking-wider text-ui-muted">
                            <tr>
                                <th scope="col" className="px-3 py-2">{days > 30 ? 'Semaine du' : 'Jour'}</th>
                                <th scope="col" className="px-3 py-2 text-right">
                                    {unit.other.charAt(0).toUpperCase() + unit.other.slice(1)}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ui-border">
                            {[...data].reverse().map((point) => (
                                <tr key={point.date}>
                                    <td className="px-3 py-1.5 text-ui-text">{formatDate(point.date)}</td>
                                    <td className="px-3 py-1.5 text-right font-semibold text-ui-text">{point.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>
        </div>
    );
}
