import { forwardRef, useId } from 'react';
import Field, { describedBy } from './Field';
import { fieldClasses } from './styles';

/**
 * Text input with label, hint, error and optional leading lucide icon.
 * `labelAside` sits right of the label; `trailing` is an element placed
 * inside the field on the right (e.g. a show-password button).
 */
export default forwardRef(function Input(
    {
        id,
        label,
        labelAside,
        hint,
        error,
        icon: Icon,
        trailing,
        required,
        className = '',
        inputClassName = '',
        ...props
    },
    ref,
) {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
        <Field
            id={inputId}
            label={label}
            labelAside={labelAside}
            hint={hint}
            error={error}
            required={required}
            className={className}
        >
            <div className="relative">
                {Icon && (
                    <Icon
                        size={18}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ui-muted"
                    />
                )}
                <input
                    ref={ref}
                    id={inputId}
                    required={required}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy(inputId, error, hint)}
                    className={`${fieldClasses(Boolean(error), Boolean(Icon), Boolean(trailing))} ${inputClassName}`}
                    {...props}
                />
                {trailing && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
            </div>
        </Field>
    );
});
