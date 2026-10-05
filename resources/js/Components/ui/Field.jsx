import { cx } from './styles';

// Label + control + hint/error wrapper shared by Input and Select.
// `labelAside` renders next to the label, right-aligned (e.g. a help link).
export default function Field({ id, label, labelAside, hint, error, required, className = '', children }) {
    const labelElement = label && (
        <label htmlFor={id} className="block text-sm font-medium text-ui-text">
            {label}
            {required && (
                <span className="ml-0.5 text-danger-700" aria-hidden="true">
                    *
                </span>
            )}
        </label>
    );

    return (
        <div className={cx('font-body', className)}>
            {labelAside ? (
                <div className="mb-1.5 flex items-center justify-between gap-3">
                    {labelElement}
                    {labelAside}
                </div>
            ) : (
                labelElement && <div className="mb-1.5">{labelElement}</div>
            )}
            {children}
            {error ? (
                <p id={`${id}-error`} className="mt-1.5 text-sm text-danger-700">
                    {error}
                </p>
            ) : (
                hint && (
                    <p id={`${id}-hint`} className="mt-1.5 text-sm text-ui-muted">
                        {hint}
                    </p>
                )
            )}
        </div>
    );
}

export function describedBy(id, error, hint) {
    if (error) return `${id}-error`;
    if (hint) return `${id}-hint`;
    return undefined;
}
