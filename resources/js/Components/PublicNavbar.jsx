import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export function BrandLogo({ className = '' }) {
    return (
        <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
            <ApplicationLogo className="h-8 w-auto fill-current text-terracotta-400" />
            <span className="font-serif text-xl font-semibold tracking-tight text-cream">
                ImmoKeys
            </span>
        </Link>
    );
}

const linkClasses =
    'text-sm font-medium text-sand/80 transition hover:text-white';

const ctaClasses =
    'inline-flex items-center justify-center rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-terracotta-300 focus:ring-offset-2 focus:ring-offset-ink';

/**
 * Dark top bar used by the public pages (search results, listing detail).
 * Guests get the "Devenir propriétaire" call to action; signed-in users see
 * their account links instead.
 */
export default function PublicNavbar() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [open, setOpen] = useState(false);

    const accountLinks = user ? (
        <>
            {user.role?.name === 'etudiant' && (
                <Link href={route('subscription.show')} className={linkClasses}>
                    Mon abonnement
                </Link>
            )}
            <Link
                href={route('logout')}
                method="post"
                as="button"
                className={`${linkClasses} text-left`}
            >
                Se déconnecter
            </Link>
        </>
    ) : (
        <>
            <Link href={route('login')} className={linkClasses}>
                Se connecter
            </Link>
            <Link
                href={`${route('register')}?role=proprietaire`}
                className={ctaClasses}
            >
                Devenir propriétaire
            </Link>
        </>
    );

    return (
        <nav className="bg-ink text-cream">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <BrandLogo />

                <div className="hidden items-center gap-7 md:flex">
                    <Link href="/" className={linkClasses}>
                        Accueil
                    </Link>
                    <Link
                        href={route('annonces.index')}
                        className={
                            route().current('annonces.index')
                                ? 'text-sm font-medium text-white'
                                : linkClasses
                        }
                    >
                        Annonces
                    </Link>
                    {user && (
                        <span className="text-sm text-sand/60">
                            {user.name}
                        </span>
                    )}
                    {accountLinks}
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    aria-label="Menu"
                    aria-expanded={open}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sand transition hover:bg-white/10 md:hidden"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        {open ? (
                            <path d="M6 18 18 6M6 6l12 12" />
                        ) : (
                            <path d="M4 7h16M4 12h16M4 17h16" />
                        )}
                    </svg>
                </button>
            </div>

            {open && (
                <div className="flex flex-col gap-4 border-t border-white/10 px-4 pb-5 pt-4 sm:px-6 md:hidden">
                    <Link href="/" className={linkClasses}>
                        Accueil
                    </Link>
                    <Link href={route('annonces.index')} className={linkClasses}>
                        Annonces
                    </Link>
                    {user && (
                        <span className="text-sm text-sand/60">
                            {user.name}
                        </span>
                    )}
                    {accountLinks}
                </div>
            )}
        </nav>
    );
}
