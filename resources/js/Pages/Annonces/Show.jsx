import AdBanner from '@/Components/AdBanner';
import ListingCard from '@/Components/ListingCard';
import OwnerCard from '@/Components/listings/OwnerCard';
import PhotoGallery from '@/Components/listings/PhotoGallery';
import { Badge, cx, focusRing } from '@/Components/ui';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BadgeCheck, CalendarDays, CircleCheck, House, MapPin, Maximize2 } from 'lucide-react';

const STATUS_LABELS = {
    disponible: 'Disponible',
    loue: 'Déjà loué',
};

function formatDate(value) {
    return value ? new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
}

export default function Show({ annonce, similar }) {
    const features = [
        { icon: Maximize2, label: 'Surface', value: annonce.surface ? `${annonce.surface} m²` : null },
        { icon: House, label: 'Type', value: annonce.category?.name },
        { icon: MapPin, label: 'Quartier', value: annonce.quartier },
        { icon: CircleCheck, label: 'Statut', value: STATUS_LABELS[annonce.status] },
        { icon: CalendarDays, label: 'Publiée le', value: formatDate(annonce.published_at) },
    ].filter((feature) => feature.value);

    return (
        <PublicLayout>
            <Head title={annonce.title} />

            <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-7">
                <Link
                    href={route('annonces.index')}
                    className={cx('inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-ui-muted hover:text-navy-900', focusRing)}
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Retour aux logements
                </Link>

                <AdBanner className="mt-4" />

                {/* DOM order: gallery, owner card, details, so phones see the
                    price and the contact button right after the photos. On
                    desktop the card is a sticky right column over both rows. */}
                <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[auto_1fr]">
                    <div className="min-w-0 lg:col-start-1 lg:row-start-1">
                        <PhotoGallery photos={annonce.photos ?? []} title={annonce.title}>
                            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                                {annonce.is_certified_pro && (
                                    <Badge variant="brand" size="md" icon={BadgeCheck}>
                                        Certifié
                                    </Badge>
                                )}
                                {annonce.status === 'loue' && (
                                    <Badge variant="navy" size="md">
                                        Déjà loué
                                    </Badge>
                                )}
                            </div>
                        </PhotoGallery>

                        <h1 className="mt-6 font-heading text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                            {annonce.title}
                        </h1>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-ui-muted">
                            <MapPin size={18} aria-hidden="true" />
                            {annonce.quartier}, {annonce.city}
                        </p>
                    </div>

                    <aside aria-label="Contact" className="self-start lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                        <OwnerCard annonce={annonce} />
                    </aside>

                    <div className="min-w-0 space-y-10 lg:col-start-1 lg:row-start-2">
                        <section aria-labelledby="caracteristiques">
                            <h2 id="caracteristiques" className="font-heading text-xl font-bold text-navy-900">
                                Caractéristiques
                            </h2>
                            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {features.map(({ icon: Icon, label, value }) => (
                                    <li key={label} className="flex items-center gap-3 rounded-card border border-ui-border bg-white p-3.5">
                                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-field bg-gold-50 text-gold-700">
                                            <Icon size={20} aria-hidden="true" />
                                        </span>
                                        <p className="min-w-0">
                                            <span className="block text-xs text-ui-muted">{label}</span>
                                            <span className="block text-sm font-semibold text-ui-text">{value}</span>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section aria-labelledby="description">
                            <h2 id="description" className="font-heading text-xl font-bold text-navy-900">
                                Description
                            </h2>
                            <p className="mt-3 whitespace-pre-line leading-relaxed text-ui-text">{annonce.description}</p>
                        </section>
                    </div>
                </div>

                {similar.length > 0 && (
                    <section aria-labelledby="similaires" className="mt-20">
                        <h2 id="similaires" className="font-heading text-2xl font-extrabold tracking-tight text-navy-900">
                            Annonces similaires
                        </h2>
                        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {similar.map((item) => (
                                <li key={item.id}>
                                    <ListingCard annonce={item} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </PublicLayout>
    );
}
