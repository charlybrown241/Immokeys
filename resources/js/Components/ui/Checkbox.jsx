import { forwardRef, useId } from 'react';
import { cx } from './styles';

/** Checkbox with label, optional description and error. */
export default forwardRef(function Checkbox(
    { id, label, description, error, className = '', ...props },
    ref,
) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const helpId = error ? `${inputId}-error` : description ? `${inputId}-description` : undefined;

    return (
        <div className={cx('flex items-start gap-2.5 font-body', className)}>
            <input
                ref={ref}
                id={inputId}
                type="checkbox"
                aria-invalid={error ? true : undefined}
                aria-describedby={helpId}
                className={cx(
                    'mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md text-navy-900',
                    'focus:ring-2 focus:ring-gold-600 focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    error ? 'border-danger' : 'border-ui-border',
                )}
                {...props}
            />
            <div className="text-sm">
                {label && (
                    <label htmlFor={inputId} className="cursor-pointer font-medium text-ui-text">
                        {label}
                    </label>
                )}
                {description && !error && (
                    <p id={`${inputId}-description`} className="text-ui-muted">
                        {description}
                    </p>
                )}
                {error && (
                    <p id={`${inputId}-error`} className="text-danger-700">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
});
