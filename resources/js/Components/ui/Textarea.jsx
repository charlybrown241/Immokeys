import { forwardRef, useId } from 'react';
import Field, { describedBy } from './Field';
import { fieldClasses } from './styles';

/** Multi-line text field with label, hint and error, like Input. */
export default forwardRef(function Textarea(
    { id, label, labelAside, hint, error, required, rows = 5, className = '', ...props },
    ref,
) {
    const autoId = useId();
    const textareaId = id ?? autoId;

    return (
        <Field
            id={textareaId}
            label={label}
            labelAside={labelAside}
            hint={hint}
            error={error}
            required={required}
            className={className}
        >
            <textarea
                ref={ref}
                id={textareaId}
                rows={rows}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(textareaId, error, hint)}
                className={`${fieldClasses(Boolean(error))} min-h-28 resize-y leading-relaxed`}
                {...props}
            />
        </Field>
    );
});
