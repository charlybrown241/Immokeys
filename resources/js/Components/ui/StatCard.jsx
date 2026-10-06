import { TrendingDown, TrendingUp } from 'lucide-react';
import Card from './Card';
import { cx } from './styles';

// Minimal SVG line chart. Main series in gold; navy/indigo are kept for
// secondary series in fuller charts.
function Sparkline({ data }) {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const range = Math.max(...data) - min || 1;
    const points = data
        .map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 30 - ((value - min) / range) * 28;
            return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(' ');

    return (
        <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-10 w-full" aria-hidden="true" focusable="false">
            <polygon points={`0,32 ${points} 100,32`} className="fill-gold-50" />
            <polyline
                points={points}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fill-none stroke-gold-600 stroke-2"
            />
        </svg>
    );
}

/**
 * KPI tile: icon chip, label, value, optional variation (in %) and sparkline.
 * `deltaLabel` explains the variation period ("vs mois dernier"); `hint`
 * is a short line of context under the value.
 */
export default function StatCard({ icon: Icon, label, value, delta, deltaLabel, hint, sparkline, className = '' }) {
    const hasDelta = typeof delta === 'number';
    const positive = hasDelta && delta >= 0;
    const DeltaIcon = positive ? TrendingUp : TrendingDown;

    return (
        <Card className={cx('flex flex-col gap-4', className)}>
            <div className="flex items-center gap-3">
                {Icon && (
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-field bg-gold-50 text-gold-700">
                        <Icon size={20} aria-hidden="true" />
                    </span>
                )}
                <p className="font-body text-sm font-medium text-ui-muted">{label}</p>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-2">
                <p className="font-heading text-3xl font-extrabold tracking-tight text-ui-text">{value}</p>
                {hasDelta && (
                    <p
                        className={cx(
                            'inline-flex items-center gap-1 font-body text-sm font-semibold',
                            positive ? 'text-success-700' : 'text-danger-700',
                        )}
                    >
                        <DeltaIcon size={16} aria-hidden="true" />
                        <span>
                            {positive ? '+' : ''}
                            {delta}%
                        </span>
                        {deltaLabel && <span className="font-normal text-ui-muted">{deltaLabel}</span>}
                    </p>
                )}
            </div>

            {hint && <p className="-mt-2 font-body text-sm text-ui-muted">{hint}</p>}

            <Sparkline data={sparkline} />
        </Card>
    );
}
