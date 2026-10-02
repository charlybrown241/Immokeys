import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export function BrandLogo({ className = '' }) {
    return (
        <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
            <ApplicationLogo className="h-7 w-auto fill-current text-accent" />
            <span
                translate="no"
                className="font-display text-[1.05rem] font-semibold tracking-tight text-navbar-ink"
            >
                ImmoKeys
            </span>
        </Link>
    );
}

function initials(name = '') {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();
}

/** Round avatar with the user's initials, shown next to their name. */
export function UserAvatar({ name }) {
    return (
        <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navbar-soft text-xs font-bold text-navbar-ink"
        >
            {initials(name)}
        </span>
    );
}

// Shared horizontal padding of every navbar row: 16px mobile, 28px desktop.
export const navbarGutter = 'px-4 md:px-7';

const linkClasses =
    'inline-flex items-center py-2.5 text-sm font-semibold text-navbar-ink-dim transition hover:text-navbar-ink focus:outline-none focus-visible:text-navbar-ink';

const ctaClasses =
    'inline-flex min-h-10 items-center justify-center rounded-full bg-accent px-4 py-[9px] text-sm font-bold text-accent-ink transition hover:bg-terracotta-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navbar';

/**
 * Dark top bar used by the public pages (search results, listing detail).
 * Guests get the "Devenir propriétaire" call to action; signed-in users see
 * their account links instead.
 */
export default function PublicNavbar() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [open, setOpen] = useState(false);
    const onAnnonces = route().current('annonces.index');

    return (
        <nav className="bg-navbar text-navbar-ink">
            <div
                className={`mx-auto flex max-w-7xl items-center justify-between py-3.5 ${navbarGutter}`}
            >
                <div className="flex items-center gap-10">
                    <BrandLogo />

                    <div className="hidden items-center gap-7 md:flex">
                        <NavLink href="/">Accueil</NavLink>
                        <NavLink
                            href={route('annonces.index')}
                            active={onAnnonces}
                        >
                            Annonces
                        </NavLink>
                    </div>
                </div>

                <div className="hidden items-center gap-5 md:flex">
                    {user ? (
                        <>
                            {user.role?.name === 'etudiant' && (
                                <Link
                                    href={route('subscription.show')}
                                    className={linkClasses}
                                >
                                    Mon abonnement
                                </Link>
                            )}
                            <span className="flex items-center gap-2.5 text-sm font-semibold text-navbar-ink">
                                <UserAvatar name={user.name} />
                                {user.name}
                            </span>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className={linkClasses}
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
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    aria-label="Menu"
                    aria-expanded={open}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navbar-ink-dim transition hover:bg-white/10 hover:text-navbar-ink md:hidden"
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
                <div className="border-t border-white/10 pb-4 pt-2 md:hidden">
                    <ResponsiveNavLink href="/">Accueil</ResponsiveNavLink>
                    <ResponsiveNavLink
                        href={route('annonces.index')}
                        active={onAnnonces}
                    >
                        Annonces
                    </ResponsiveNavLink>

                    {user ? (
                        <div className="mt-3 border-t border-white/10 pt-3">
                            <div className="flex items-center gap-2.5 px-4 pb-2 text-sm font-semibold text-navbar-ink">
                                <UserAvatar name={user.name} />
                                {user.name}
                            </div>
                            {user.role?.name === 'etudiant' && (
                                <ResponsiveNavLink
                                    href={route('subscription.show')}
                                >
                                    Mon abonnement
                                </ResponsiveNavLink>
                            )}
                            <ResponsiveNavLink
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                Se déconnecter
                            </ResponsiveNavLink>
                        </div>
                    ) : (
                        <div className="mt-3 flex flex-col gap-3 border-t border-white/10 px-4 pt-4">
                            <Link href={route('login')} className={linkClasses}>
                                Se connecter
                            </Link>
                            <Link
                                href={`${route('register')}?role=proprietaire`}
                                className={`${ctaClasses} self-start`}
                            >
                                Devenir propriétaire
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
