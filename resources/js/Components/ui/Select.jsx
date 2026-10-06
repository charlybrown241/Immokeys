import { forwardRef, useId } from 'react';
import Field, { describedBy } from './Field';
import { fieldClasses } from './styles';

/**
 * Native select with label, hint, error and optional leading lucide icon.
 * `options` is an array of { value, label }; children are rendered as-is.
 */
export default forwardRef(function Select(
    { id, label, hint, error, icon: Icon, required, options, placeholder, className = '', children, ...props },
    ref,
) {
    const autoId = useId();
    const selectId = id ?? autoId;

    return (
        <Field id={selectId} label={label} hint={hint} error={error} required={required} className={className}>
            <div className="relative">
                {Icon && (
                    <Icon
                        size={18}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-ui-muted"
                    />
                )}
                <select
                    ref={ref}
                    id={selectId}
                    required={required}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy(selectId, error, hint)}
                    className={fieldClasses(Boolean(error), Boolean(Icon), true)}
                    {...props}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                    {children}
                </select>
            </div>
        </Field>
    );
});
