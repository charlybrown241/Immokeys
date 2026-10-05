import { cx } from './styles';

// Label + control + hint/error wrapper shared by Input and Select.
export default function Field({ id, label, hint, error, required, className = '', children }) {
    return (
        <div className={cx('font-body', className)}>
            {label && (
                <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ui-text">
                    {label}
                    {required && (
                        <span className="ml-0.5 text-danger-700" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
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
