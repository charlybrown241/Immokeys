import FeaturedCarousel from '@/Components/home/FeaturedCarousel';
import HeroVisual from '@/Components/home/HeroVisual';
import HomeSearchBar from '@/Components/home/HomeSearchBar';
import { Badge, Button, cx, EmptyState, focusRing, Input } from '@/Components/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { formatMad } from '@/utils/format';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, Building2, Headset, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';

const container = 'mx-auto max-w-7xl px-4 md:px-7';

const REASSURANCE = [
    {
        icon: BadgeCheck,
        title: 'Annonces vérifiées',
        text: 'Publiées uniquement par des propriétaires certifiés, et modérées par notre équipe.',
    },
    {
        icon: ShieldCheck,
        title: 'Propriétaires certifiés',
        text: "Pièce d'identité (CIN) vérifiée à la main avant toute publication.",
    },
    {
        icon: MessageCircle,
        title: 'Contact direct WhatsApp',
        text: 'Écris au propriétaire en un clic, sans intermédiaire ni frais.',
    },
    {
        icon: Headset,
        title: 'Support étudiant',
        text: 'Une question ? Notre équipe te répond à contact@immokeys.ma.',
    },
];

function SectionTitle({ id, eyebrow, title, children }) {
    return (
        <div>
            {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-gold-700">{eyebrow}</p>}
            <h2 id={id} className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
                {title}
            </h2>
            {children && <p className="mt-2 max-w-2xl text-ui-muted">{children}</p>}
        </div>
    );
}

function Hero() {
    return (
        <section className="relative overflow-hidden bg-white">
            <span aria-hidden="true" className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-50" />
            <span aria-hidden="true" className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-ui-bg" />

            <div className={cx(container, 'relative grid items-center gap-12 pb-32 pt-12 lg:grid-cols-2 lg:pb-40 lg:pt-16')}>
                <div>
                    <Badge variant="brand" size="md" icon={MapPin}>
                        Location étudiante à Casablanca
                    </Badge>
                    <h1 className="mt-5 font-heading text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-navy-900 sm:text-6xl">
                        Trouve ton logement étudiant.
                        <span className="mt-2 block text-gold-700">Vis sereinement à Casablanca.</span>
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-ui-muted">
                        Des logements vérifiés, des propriétaires certifiés, un contact direct sur WhatsApp.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button as={Link} href={route('annonces.index')} variant="secondary" size="lg" iconRight={ArrowRight}>
                            Parcourir les logements
                        </Button>
                        <Button as={Link} href={route('pages.how-it-works')} variant="outline" size="lg">
                            Comment ça marche
                        </Button>
                    </div>
                </div>

                <HeroVisual className="mx-auto hidden w-full max-w-xl lg:block" />
            </div>
        </section>
    );
}

function Reassurance() {
    return (
        <section aria-label="Nos garanties" className={cx(container, 'mt-14')}>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {REASSURANCE.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex gap-4">
                        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                            <Icon size={22} aria-hidden="true" />
                        </span>
                        <div>
                            <h3 className="font-heading font-bold text-navy-900">{title}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-ui-muted">{text}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function Featured({ annonces }) {
    const title = (
        <SectionTitle id="a-la-une" eyebrow="Sélection" title="Logements à la une">
            Les dernières annonces publiées par des propriétaires certifiés.
        </SectionTitle>
    );

    return (
        <section className={cx(container, 'mt-20')}>
            {annonces.length > 0 ? (
                <>
                    <FeaturedCarousel annonces={annonces} title={title} titleId="a-la-une" />
                    <div className="mt-4 text-center">
                        <Button as={Link} href={route('annonces.index')} variant="ghost" iconRight={ArrowRight}>
                            Voir tous les logements
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    {title}
                    <EmptyState
                        icon={Building2}
                        title="Aucun logement publié pour le moment"
                        description="Les premières annonces arrivent bientôt. Reviens vite !"
                        className="mt-6"
                    />
                </>
            )}
        </section>
    );
}

function OwnerCta() {
    return (
        <section className={cx(container, 'mt-20')}>
            <div className="relative overflow-hidden rounded-card bg-navy-900 px-6 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-14 lg:py-14">
                <span aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-500/15" />
                <span aria-hidden="true" className="absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-gold-300/10" />
                <div className="relative">
                    <h2 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
                        Tu as un logement à <span className="text-gold-gradient">louer</span> ?
                    </h2>
                    <p className="mt-2 max-w-xl text-white/75">
                        Publie ton annonce et rencontre des étudiants sérieux, avec le badge de propriétaire certifié.
                    </p>
                </div>
                <Button
                    as={Link}
                    href={`${route('register')}?role=proprietaire`}
                    size="lg"
                    iconRight={ArrowRight}
                    className="relative mt-6 focus-visible:ring-offset-navy-900 lg:mt-0"
                >
                    Publier une annonce
                </Button>
            </div>
        </section>
    );
}

function Quartiers({ quartiers }) {
    return (
        <section className={cx(container, 'mt-20')}>
            <SectionTitle eyebrow="Casablanca" title="Explorer par quartier">
                Les quartiers où l'on trouve le plus de logements en ce moment.
            </SectionTitle>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quartiers.map((quartier) => (
                    <li key={quartier.name}>
                        <Link
                            href={route('annonces.index', { search: quartier.name })}
                            className={cx('group relative flex h-44 overflow-hidden rounded-card bg-navy-800 lg:h-56', focusRing)}
                        >
                            {quartier.photo ? (
                                <img
                                    src={`/storage/${quartier.photo}`}
                                    alt=""
                                    loading="lazy"
                                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                />
                            ) : (
                                <MapPin
                                    size={120}
                                    aria-hidden="true"
                                    className="absolute -right-4 -top-4 text-gold-300 opacity-15"
                                />
                            )}
                            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/45 to-navy-950/10" />
                            <span className="relative mt-auto p-5">
                                <span className="block font-heading text-xl font-bold text-white">{quartier.name}</span>
                                <span className="mt-0.5 block text-sm text-white/85">
                                    À partir de <span className="font-semibold text-gold-300">{formatMad(quartier.min_price)}/mois</span>
                                </span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function Newsletter() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({ email: '' });

    const submit = (event) => {
        event.preventDefault();
        post(route('newsletter.store'), { preserveScroll: true, onSuccess: () => reset('email') });
    };

    return (
        <section className={cx(container, 'my-20')}>
            <div className="grid gap-6 rounded-card border border-gold-100 bg-gold-50 p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
                <div className="flex gap-4">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-gold-700">
                        <Mail size={22} aria-hidden="true" />
                    </span>
                    <div>
                        <h2 className="font-heading text-2xl font-extrabold text-navy-900">Reste au courant</h2>
                        <p className="mt-1 text-ui-text">
                            Nouvelles annonces, conseils logement et bons plans étudiants à Casablanca.
                        </p>
                    </div>
                </div>
                <div>
                    <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <Input
                            id="newsletter-email"
                            type="email"
                            required
                            label="Adresse email"
                            icon={Mail}
                            placeholder="toi@exemple.ma"
                            autoComplete="email"
                            className="flex-1"
                            value={data.email}
                            onChange={(e) => {
                                setData('email', e.target.value);
                                clearErrors('email');
                            }}
                            error={errors.email}
                        />
                        <Button type="submit" variant="secondary" size="lg" loading={processing} className="sm:mt-[1.625rem]">
                            S'inscrire
                        </Button>
                    </form>
                    <p role="status" className="mt-2 min-h-5 text-sm font-medium text-success-700">
                        {flash?.newsletter}
                    </p>
                    <p className="text-xs text-ui-muted">Ton adresse sert uniquement à t'envoyer la newsletter ImmoKeys.</p>
                </div>
            </div>
        </section>
    );
}

export default function Home({ featured, quartiers, categories }) {
    const { auth } = usePage().props;

    return (
        <PublicLayout>
            <Head title="Logements étudiants à Casablanca" />

            <Hero />

            <div className={cx(container, 'relative z-10 -mt-24 lg:-mt-28')}>
                <HomeSearchBar categories={categories} quartiers={quartiers} />
            </div>

            <Reassurance />
            <Featured annonces={featured} />
            {!auth.user && <OwnerCta />}
            {quartiers.length > 0 && <Quartiers quartiers={quartiers} />}
            <Newsletter />
        </PublicLayout>
    );
}
