import { cx, focusRing } from '@/Components/ui';
import { Link, usePage } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';

/**
 * Simulated ad slot for free-tier students. Purely a conditional render off
 * the Inertia-shared auth prop — no extra request, no page reload, and it
 * disappears as soon as the shared subscription data reflects an upgrade.
 */
export default function AdBanner({ className = '' }) {
    const { auth } = usePage().props;

    if (auth.user?.subscription?.type !== 'gratuit') {
        return null;
    }

    return (
        <div
            className={cx(
                'flex flex-wrap items-center justify-between gap-2 rounded-card border border-dashed border-ui-border bg-white px-4 py-3 text-sm text-ui-muted',
                className,
            )}
        >
            <span className="inline-flex items-center gap-2">
                <Megaphone size={16} aria-hidden="true" />
                Publicité — espace réservé aux comptes gratuits.
            </span>
            <Link
                href={route('subscription.show')}
                className={cx('rounded-md font-semibold text-gold-700 underline underline-offset-4', focusRing)}
            >
                Passer Premium pour la retirer
            </Link>
        </div>
    );
}
