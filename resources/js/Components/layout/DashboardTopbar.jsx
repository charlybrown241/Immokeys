import Logo from '@/Components/Logo';
import { Avatar, cx, focusRing, Input } from '@/Components/ui';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, ChevronDown, FileCheck2, LogOut, Menu as MenuIcon, Search, UserRound } from 'lucide-react';
import { useState } from 'react';

const ROLE_LABELS = {
    etudiant: 'Étudiant',
    proprietaire: 'Propriétaire',
    admin: 'Administrateur',
};

const menuPanel =
    'z-50 mt-2 rounded-card border border-ui-border bg-white p-1.5 font-body shadow-float transition duration-100 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0';

const menuItem =
    'flex w-full items-center gap-2.5 rounded-field px-3 py-2.5 text-left text-sm data-[focus]:bg-ui-bg';

const iconButton = cx(
    'relative inline-flex h-11 w-11 items-center justify-center rounded-field text-navy-900 transition hover:bg-ui-bg',
    focusRing,
);

// Searches the public listings; the query matches titles and quartiers.
function SearchForm() {
    const [search, setSearch] = useState('');

    const submit = (event) => {
        event.preventDefault();
        router.get(route('annonces.index'), search.trim() ? { search: search.trim() } : {});
    };

    return (
        <form role="search" onSubmit={submit} className="hidden w-full max-w-md md:block">
            <Input
                type="search"
                icon={Search}
                aria-label="Rechercher un logement ou un quartier"
                placeholder="Rechercher un logement, un quartier…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                inputClassName="bg-ui-bg"
            />
        </form>
    );
}

function NotificationsMenu() {
    const { notifications } = usePage().props;
    const pending = notifications?.pending_certifications ?? 0;

    return (
        <Menu>
            <MenuButton
                className={iconButton}
                aria-label={pending > 0 ? `Notifications, ${pending} non lues` : 'Notifications'}
            >
                <Bell size={22} aria-hidden="true" />
                {pending > 0 && (
                    <span
                        aria-hidden="true"
                        className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-white"
                    />
                )}
            </MenuButton>
            <MenuItems transition anchor="bottom end" className={cx(menuPanel, 'w-72')}>
                <p className="px-3 pb-1 pt-2 font-heading text-sm font-bold text-ui-text">Notifications</p>
                {pending > 0 ? (
                    <MenuItem>
                        <Link href={route('admin.certifications.index')} className={cx(menuItem, 'text-ui-text')}>
                            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-field bg-gold-50 text-gold-700">
                                <FileCheck2 size={16} aria-hidden="true" />
                            </span>
                            {pending > 1
                                ? `${pending} certifications à valider`
                                : '1 certification à valider'}
                        </Link>
                    </MenuItem>
                ) : (
                    <p className="px-3 py-3 text-sm text-ui-muted">Aucune nouvelle notification.</p>
                )}
            </MenuItems>
        </Menu>
    );
}

function ProfileMenu() {
    const { user } = usePage().props.auth;

    return (
        <Menu>
            <MenuButton className={cx('flex items-center gap-2.5 rounded-field p-1.5 transition hover:bg-ui-bg', focusRing)}>
                <span aria-hidden="true">
                    <Avatar name={user.name} size="sm" />
                </span>
                <span className="sr-only sm:hidden">{user.name}</span>
                <span className="hidden text-left leading-tight sm:block">
                    <span className="block text-sm font-semibold text-ui-text">{user.name}</span>
                    <span className="block text-xs text-ui-muted">{ROLE_LABELS[user.role?.name] ?? ''}</span>
                </span>
                <ChevronDown size={16} className="hidden text-ui-muted sm:block" aria-hidden="true" />
            </MenuButton>
            <MenuItems transition anchor="bottom end" className={cx(menuPanel, 'w-56')}>
                <div className="border-b border-ui-border px-3 pb-2.5 pt-2 sm:hidden">
                    <p className="text-sm font-semibold text-ui-text">{user.name}</p>
                    <p className="text-xs text-ui-muted">{ROLE_LABELS[user.role?.name] ?? ''}</p>
                </div>
                <MenuItem>
                    <Link href={route('profile.edit')} className={cx(menuItem, 'text-ui-text')}>
                        <UserRound size={18} className="text-ui-muted" aria-hidden="true" />
                        Mon profil
                    </Link>
                </MenuItem>
                <MenuItem>
                    <Link href={route('logout')} method="post" as="button" className={cx(menuItem, 'text-danger-700')}>
                        <LogOut size={18} aria-hidden="true" />
                        Se déconnecter
                    </Link>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
}

/** White top bar of the dashboard: menu (mobile), search, bell, profile. */
export default function DashboardTopbar({ onOpenSidebar }) {
    const { auth } = usePage().props;

    return (
        <div className="sticky top-0 z-30 border-b border-ui-border bg-white">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={onOpenSidebar}
                    aria-label="Ouvrir la navigation"
                    className={cx(iconButton, 'lg:hidden')}
                >
                    <MenuIcon size={24} aria-hidden="true" />
                </button>
                <Link href={route(auth.home_route)} className={cx('rounded-field lg:hidden', focusRing)}>
                    <Logo variant="icon-light" height={32} />
                    <span className="sr-only">, accueil de mon espace</span>
                </Link>

                <SearchForm />

                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <NotificationsMenu />
                    <ProfileMenu />
                </div>
            </div>
        </div>
    );
}
