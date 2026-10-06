import { cx, focusRing } from '@/Components/ui';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

// Shared bits of the auth screens (login, register, password reset).

export const authLink = cx('rounded-md font-semibold text-gold-700 underline-offset-4 hover:underline', focusRing);

export function AuthHeading({ title, children }) {
    return (
        <>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-navy-900">{title}</h1>
            {children && <p className="mt-2 text-sm text-ui-muted">{children}</p>}
        </>
    );
}

export function BackToHome() {
    return (
        <Link
            href={route('home')}
            className={cx('inline-flex items-center gap-1.5 rounded-md text-sm text-ui-muted hover:text-ui-text', focusRing)}
        >
            <ArrowLeft size={16} aria-hidden="true" />
            Retour à l'accueil
        </Link>
    );
}

/** Focuses the first field (in form order) that Laravel rejected. */
export function focusFirstError(errors, fields) {
    const first = fields.find(([name]) => errors[name]);
    first?.[1].current?.focus();
}
