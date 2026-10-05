import { cx } from './styles';

/** Placeholder for empty lists: icon, title, description and an action. */
export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
    return (
        <div
            className={cx(
                'flex flex-col items-center rounded-card border border-dashed border-ui-border bg-white px-6 py-12 text-center',
                className,
            )}
        >
            {Icon && (
                <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                    <Icon size={26} aria-hidden="true" />
                </span>
            )}
            <h3 className="font-heading text-lg font-bold text-ui-text">{title}</h3>
            {description && <p className="mt-1.5 max-w-sm font-body text-sm text-ui-muted">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
