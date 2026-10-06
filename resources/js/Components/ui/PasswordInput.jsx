import { Eye, EyeOff, Lock } from 'lucide-react';
import { forwardRef, useId, useState } from 'react';
import Input from './Input';
import { cx, focusRing } from './styles';

/** Input with a lock icon and a keyboard-accessible show/hide button. */
export default forwardRef(function PasswordInput({ id, ...props }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [visible, setVisible] = useState(false);

    return (
        <Input
            ref={ref}
            id={inputId}
            icon={Lock}
            {...props}
            type={visible ? 'text' : 'password'}
            trailing={
                <button
                    type="button"
                    onClick={() => setVisible((value) => !value)}
                    aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    aria-controls={inputId}
                    className={cx(
                        'inline-flex h-10 w-10 items-center justify-center rounded-field text-ui-muted transition hover:text-navy-900',
                        focusRing,
                        'focus-visible:ring-offset-0',
                    )}
                >
                    {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
            }
        />
    );
});
