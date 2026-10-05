import Logo from '@/Components/Logo';
import { Button, cx, Drawer, focusRing } from '@/Components/ui';
import { QUARTIERS, quartierUrl } from '@/Constants/quartiers';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, MapPin, Menu as MenuIcon, Plus } from 'lucide-react';
import { useState } from 'react';

function useNavLinks() {
    return [
        { label: 'Accueil', href: '/', active: false },
        {
            label: 'Logements',
            href: route('annonces.index'),
            active: route().current('annonces.index') || route().current('annonces.show'),
        },
        { label: 'Quartiers', quartiers: true },
        {
            label: 'Comment ça marche',
            href: route('pages.how-it-works'),
            active: route().current('pages.how-it-works'),
        },
        { label: 'Contact', href: '#contact', anchor: true },
    ];
}

// Guests are invited to sign up as owners; owners go straight to the form.
function publishHref(user) {
    if (!user) return `${route('register')}?role=proprietaire`;
    if (user.role?.name === 'proprietaire') return route('annonces.create');
    return null;
}

const desktopLink = (active) =>
    cx(
        'relative inline-flex items-center gap-1 rounded-md py-2 text-sm font-semibold transition',
        focusRing,
        active
            ? 'text-navy-900 after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-gold-600'
            : 'text-ui-muted hover:text-navy-900',
    );

function QuartiersMenu() {
    return (
        <Menu>
            <MenuButton className={desktopLink(false)}>
                Quartiers
                <ChevronDown size={16} aria-hidden="true" />
            </MenuButton>
            <MenuItems
                transition
                anchor="bottom start"
                className="z-50 mt-2 w-56 rounded-card border border-ui-border bg-white p-1.5 shadow-float transition duration-100 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                {QUARTIERS.map((quartier) => (
                    <MenuItem key={quartier}>
                        <Link
                            href={quartierUrl(quartier)}
                            className="flex items-center gap-2 rounded-field px-3 py-2 font-body text-sm text-ui-text data-[focus]:bg-ui-bg"
                        >
                            <MapPin size={16} className="text-gold-700" aria-hidden="true" />
                            {quartier}
                        </Link>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
}

/** White sticky navbar of the public pages, with a drawer on mobile. */
export default function PublicNavbar() {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const links = useNavLinks();
    const publishUrl = publishHref(auth.user);

    return (
        <nav aria-label="Navigation principale" className="sticky top-0 z-40 border-b border-ui-border bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:px-7">
                <Link href="/" aria-label="ImmoKeys, accueil" className={cx('rounded-md', focusRing)}>
                    <Logo variant="light" height={32} />
                </Link>

                <ul className="hidden items-center gap-7 lg:flex">
                    {links.map((link) => (
                        <li key={link.label}>
                            {link.quartiers ? (
                                <QuartiersMenu />
                            ) : link.anchor ? (
                                <a href={link.href} className={desktopLink(false)}>
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    href={link.href}
                                    aria-current={link.active ? 'page' : undefined}
                                    className={desktopLink(link.active)}
                                >
                                    {link.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-2">
                    {publishUrl && (
                        <Button as={Link} href={publishUrl} variant="secondary" icon={Plus} className="hidden sm:inline-flex">
                            Publier un logement
                        </Button>
                    )}
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label="Ouvrir le menu"
                        aria-expanded={open}
                        className={cx(
                            'inline-flex h-11 w-11 items-center justify-center rounded-field text-navy-900 transition hover:bg-ui-bg lg:hidden',
                            focusRing,
                        )}
                    >
                        <MenuIcon size={24} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <Drawer open={open} onClose={() => setOpen(false)} title="Menu" side="right" className="bg-white text-navy-900">
                <div className="flex h-16 items-center border-b border-ui-border px-5">
                    <Logo variant="light" height={28} />
                </div>
                <ul className="flex-1 space-y-1 p-3 font-body">
                    {links
                        .filter((link) => !link.quartiers)
                        .map(({ anchor, ...link }) => {
                            const Tag = anchor ? 'a' : Link;
                            return (
                            <li key={link.label}>
                                <Tag
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    aria-current={link.active ? 'page' : undefined}
                                    className={cx(
                                        'flex rounded-field px-3 py-3 text-base font-semibold transition',
                                        focusRing,
                                        link.active ? 'bg-gold-50 text-gold-700' : 'text-navy-900 hover:bg-ui-bg',
                                    )}
                                >
                                    {link.label}
                                </Tag>
                            </li>
                            );
                        })}
                </ul>
                <div className="border-t border-ui-border p-3 font-body">
                    <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-ui-muted">Quartiers</p>
                    <ul className="grid grid-cols-2 gap-1">
                        {QUARTIERS.map((quartier) => (
                            <li key={quartier}>
                                <Link
                                    href={quartierUrl(quartier)}
                                    className={cx('flex rounded-field px-3 py-2 text-sm text-ui-text hover:bg-ui-bg', focusRing)}
                                >
                                    {quartier}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {publishUrl && (
                    <div className="border-t border-ui-border p-4">
                        <Button as={Link} href={publishUrl} variant="secondary" icon={Plus} className="w-full">
                            Publier un logement
                        </Button>
                    </div>
                )}
            </Drawer>
        </nav>
    );
}
