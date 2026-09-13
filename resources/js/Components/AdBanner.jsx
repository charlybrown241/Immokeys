import { Link, usePage } from '@inertiajs/react';

/**
 * Simulated ad slot for free-tier students. Purely a conditional render off
 * the Inertia-shared auth prop — no extra request, no page reload, and it
 * disappears as soon as the shared subscription data reflects an upgrade.
 */
export default function AdBanner() {
    const { auth } = usePage().props;

    if (auth.user?.subscription?.type !== 'gratuit') {
        return null;
    }

    return (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500">
            <span>Publicité — espace réservé aux comptes gratuits.</span>
            <Link
                href={route('subscription.show')}
                className="font-medium text-indigo-600 underline hover:text-indigo-900"
            >
                Passer Premium pour la retirer
            </Link>
        </div>
    );
}
