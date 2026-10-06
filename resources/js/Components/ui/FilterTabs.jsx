import { cx, focusRing } from './styles';

/**
 * Row of pill toggles to filter a list. `items`: [{ key, label, count? }].
 * Scrolls horizontally on small screens instead of wrapping.
 */
export default function FilterTabs({ items, value, onChange, label, className = '' }) {
    return (
        <div role="group" aria-label={label} className={cx('-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0', className)}>
            {items.map((item) => {
                const active = value === item.key;
                return (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => onChange(item.key)}
                        aria-pressed={active}
                        className={cx(
                            'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 font-body text-sm font-semibold transition',
                            focusRing,
                            active ? 'border-navy-900 bg-navy-900 text-white' : 'border-ui-border bg-white text-ui-text hover:border-navy-900',
                        )}
                    >
                        {item.label}
                        {typeof item.count === 'number' && (
                            <span className={cx('rounded-full px-1.5 text-xs', active ? 'bg-white/15 text-white' : 'bg-ui-bg text-ui-muted')}>
                                {item.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
