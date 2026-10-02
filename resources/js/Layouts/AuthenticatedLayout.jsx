import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import {
    BrandLogo,
    navbarGutter,
    UserAvatar,
} from '@/Components/PublicNavbar';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { user, home_route: homeRoute } = usePage().props.auth;
    const roleName = user.role?.name;
    const homeLabel = roleName === 'etudiant' ? 'Annonces' : 'Dashboard';
    const canManageSubscription =
        roleName === 'etudiant' || roleName === 'proprietaire';

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-bg">
            <nav className="bg-navbar text-navbar-ink">
                <div
                    className={`mx-auto flex max-w-7xl items-center justify-between py-3.5 ${navbarGutter}`}
                >
                    <div className="flex items-center gap-10">
                        <BrandLogo />

                        <div className="hidden items-center gap-7 sm:flex">
                            <NavLink
                                href={route(homeRoute)}
                                active={route().current(homeRoute)}
                            >
                                {homeLabel}
                            </NavLink>

                            {canManageSubscription && (
                                <NavLink
                                    href={route('subscription.show')}
                                    active={route().current(
                                        'subscription.show',
                                    )}
                                >
                                    Mon abonnement
                                </NavLink>
                            )}
                        </div>
                    </div>

                    <div className="hidden sm:flex sm:items-center">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2.5 rounded-full py-1 pe-1 ps-1 text-sm font-semibold text-navbar-ink transition duration-150 ease-in-out hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                >
                                    <UserAvatar name={user.name} />
                                    {user.name}

                                    <svg
                                        className="h-4 w-4 text-navbar-ink-dim"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>
                                    Profil
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                >
                                    Se déconnecter
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setShowingNavigationDropdown(
                                (previousState) => !previousState,
                            )
                        }
                        aria-label="Menu"
                        aria-expanded={showingNavigationDropdown}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navbar-ink-dim transition duration-150 ease-in-out hover:bg-white/10 hover:text-navbar-ink focus:outline-none focus-visible:bg-white/10 focus-visible:text-navbar-ink sm:hidden"
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
                            {showingNavigationDropdown ? (
                                <path d="M6 18 18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 7h16M4 12h16M4 17h16" />
                            )}
                        </svg>
                    </button>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' border-t border-white/10 sm:hidden'
                    }
                >
                    <div className="pb-2 pt-2">
                        <ResponsiveNavLink
                            href={route(homeRoute)}
                            active={route().current(homeRoute)}
                        >
                            {homeLabel}
                        </ResponsiveNavLink>

                        {canManageSubscription && (
                            <ResponsiveNavLink
                                href={route('subscription.show')}
                                active={route().current('subscription.show')}
                            >
                                Mon abonnement
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-white/10 pb-3 pt-3">
                        <div className="flex items-center gap-2.5 px-4">
                            <UserAvatar name={user.name} />
                            <div>
                                <div className="text-sm font-semibold text-navbar-ink">
                                    {user.name}
                                </div>
                                <div className="text-xs text-navbar-ink-dim">
                                    {user.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-2">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Se déconnecter
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-line bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
