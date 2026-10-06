import Logo from '@/Components/Logo';
import { Button, cx, focusRing } from '@/Components/ui';
import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    CreditCard,
    FileCheck2,
    House,
    LayoutDashboard,
    Rocket,
    ShieldCheck,
    UserRound,
    Users,
} from 'lucide-react';

const profileItem = { label: 'Mon profil', route: 'profile.edit', icon: UserRound };

// Menu per role. `match` lists extra route names that mark the item active.
const MENUS = {
    proprietaire: [
        { label: 'Tableau de bord', route: 'dashboard', icon: LayoutDashboard },
        {
            label: 'Mes annonces',
            route: 'annonces.mine',
            match: ['annonces.create', 'annonces.edit'],
            icon: Building2,
        },
        { label: 'Certification', route: 'certification.create', icon: ShieldCheck },
        { label: 'Abonnement', route: 'subscription.show', icon: CreditCard },
        profileItem,
    ],
    etudiant: [
        { label: 'Mon espace', route: 'student.dashboard', icon: LayoutDashboard },
        { label: 'Logements', route: 'annonces.index', icon: House },
        { label: 'Abonnement', route: 'subscription.show', icon: CreditCard },
        profileItem,
    ],
    admin: [
        { label: 'Tableau de bord', route: 'admin.dashboard', icon: LayoutDashboard },
        {
            label: 'Certifications',
            route: 'admin.certifications.index',
            icon: FileCheck2,
            counter: 'pending_certifications',
        },
        { label: 'Annonces', route: 'admin.annonces.index', icon: Building2 },
        { label: 'Utilisateurs', route: 'admin.users.index', icon: Users },
        profileItem,
    ],
};

function isActive(item) {
    return [item.route, ...(item.match ?? [])].some((name) => route().current(name));
}

// Upsell card: Pro for owners, Premium for free-tier students.
function promoFor(user) {
    const role = user.role?.name;

    if (role === 'proprietaire') {
        return {
            title: 'Boostez vos annonces',
            text: 'Badge de confiance et visibilité accrue auprès des étudiants.',
            cta: 'Découvrir Pro',
        };
    }

    if (role === 'etudiant' && user.subscription?.type !== 'premium') {
        return {
            title: 'Passez Premium',
            text: 'Sans publicité, annonces en tête de liste et support prioritaire.',
            cta: 'Découvrir Premium',
        };
    }

    return null;
}

function PromoCard({ promo }) {
    return (
        <div className="relative overflow-hidden rounded-card bg-navy-800 p-4">
            <span aria-hidden="true" className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold-500/15" />
            <span aria-hidden="true" className="absolute -bottom-10 right-6 h-20 w-20 rounded-full bg-gold-300/10" />
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-field bg-gold-gradient text-navy-900">
                <Rocket size={20} aria-hidden="true" />
            </span>
            <p className="relative mt-3 font-heading text-base font-bold text-white">{promo.title}</p>
            <p className="relative mt-1 text-sm leading-snug text-white/75">{promo.text}</p>
            <Button
                as={Link}
                href={route('subscription.show')}
                size="sm"
                className="relative mt-4 w-full focus-visible:ring-offset-navy-800"
            >
                {promo.cta}
            </Button>
        </div>
    );
}

/** Navy sidebar content, shared by the fixed desktop column and the drawer. */
export default function DashboardSidebar({ onNavigate }) {
    const { auth, notifications } = usePage().props;
    const items = MENUS[auth.user.role?.name] ?? [profileItem];
    const promo = promoFor(auth.user);

    return (
        <div className="flex h-full w-full flex-col bg-navy-950 px-4 py-5 font-body">
            <Link
                href={route(auth.home_route)}
                aria-label="ImmoKeys, accueil de mon espace"
                className={cx('self-start rounded-md px-2', focusRing, 'focus-visible:ring-offset-navy-950')}
            >
                <Logo variant="dark" height={32} />
            </Link>

            <nav aria-label="Navigation de l'espace" className="mt-8 flex-1">
                <ul className="space-y-1">
                    {items.map((item) => {
                        const active = isActive(item);
                        const count = item.counter ? notifications?.[item.counter] ?? 0 : 0;
                        const Icon = item.icon;

                        return (
                            <li key={item.route}>
                                <Link
                                    href={route(item.route)}
                                    onClick={onNavigate}
                                    aria-current={active ? 'page' : undefined}
                                    className={cx(
                                        'flex min-h-11 items-center gap-3 rounded-field px-3 text-sm font-semibold transition',
                                        focusRing,
                                        'focus-visible:ring-offset-navy-950',
                                        active
                                            ? 'bg-gold-gradient text-navy-900'
                                            : 'text-white/75 hover:bg-white/5 hover:text-white',
                                    )}
                                >
                                    <Icon size={20} aria-hidden="true" />
                                    <span className="flex-1">{item.label}</span>
                                    {count > 0 && (
                                        <span
                                            className={cx(
                                                'min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs font-bold',
                                                active ? 'bg-navy-900 text-gold-300' : 'bg-gold-300 text-navy-950',
                                            )}
                                        >
                                            {count}
                                            <span className="sr-only"> en attente</span>
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {promo && <PromoCard promo={promo} />}
        </div>
    );
}
