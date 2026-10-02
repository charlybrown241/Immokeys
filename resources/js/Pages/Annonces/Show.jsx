import AdBanner from '@/Components/AdBanner';
import { initials } from '@/Components/PublicNavbar';
import { badgeCertified } from '@/Constants/theme';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

function WhatsappIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L4 20l1.1-4.5A8.5 8.5 0 1 1 21 11.5Z" />
            <path d="M8.5 10.5c0 3 2.5 5.5 5.5 5.5" />
        </svg>
    );
}

const WHATSAPP_UNAVAILABLE_MESSAGES = {
    wrong_role:
        'Seuls les étudiants peuvent contacter les propriétaires via WhatsApp.',
    missing_phone:
        "Le propriétaire n'a pas encore renseigné de numéro de téléphone.",
    unavailable: "Cette annonce n'est plus disponible.",
};

function WhatsappButton({ contact }) {
    const buttonClasses =
        'flex w-full items-center justify-center gap-2 rounded-[12px] px-5 py-3 text-sm font-bold text-accent-ink';
    const enabledClasses =
        'bg-accent-strong transition hover:bg-terracotta-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-300 focus-visible:ring-offset-2';

    if (contact.status === 'ready') {
        return (
            <a
                href={contact.url}
                className={`${buttonClasses} ${enabledClasses}`}
            >
                <WhatsappIcon />
                Contacter sur WhatsApp
            </a>
        );
    }

    if (contact.status === 'guest') {
        return (
            <Link
                href={`${route('login')}?reason=contact-whatsapp`}
                className={`${buttonClasses} ${enabledClasses}`}
            >
                <WhatsappIcon />
                Contacter sur WhatsApp
            </Link>
        );
    }

    return (
        <div>
            <button
                type="button"
                disabled
                className={`${buttonClasses} cursor-not-allowed bg-accent/50`}
            >
                <WhatsappIcon />
                Contacter sur WhatsApp
            </button>
            <p className="mt-2 text-xs text-ink-soft">
                {WHATSAPP_UNAVAILABLE_MESSAGES[contact.status]}
            </p>
        </div>
    );
}

const STATUS_LABELS = {
    disponible: 'Disponible',
    loue: 'Loué',
};

function CheckIcon({ className = 'h-3.5 w-3.5' }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="m5 12 5 5L20 7" />
        </svg>
    );
}

export default function Show({ annonce }) {
    const [activePhoto, setActivePhoto] = useState(0);
    const photos = annonce.photos ?? [];
    const mainPhoto = photos[activePhoto] ?? null;

    const features = [
        ['Surface', annonce.surface ? `${annonce.surface} m²` : '—'],
        ['Type', annonce.category?.name ?? '—'],
        ['Quartier', annonce.quartier],
        ['Disponibilité', STATUS_LABELS[annonce.status] ?? '—'],
    ];

    return (
        <PublicLayout>
            <Head title={annonce.title} />

            <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-7 sm:pt-10">
                <Link
                    href={route('annonces.index')}
                    className="text-sm font-semibold text-ink-soft transition hover:text-ink"
                >
                    ← Retour aux annonces
                </Link>

                <div className="mt-4">
                    <AdBanner />
                </div>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="min-w-0">
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px] bg-gradient-to-br from-line to-pending-bg">
                            {mainPhoto ? (
                                <img
                                    src={`/storage/${mainPhoto.path}`}
                                    alt={annonce.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-ink-soft">
                                    Aucune photo disponible
                                </div>
                            )}

                            {annonce.is_certified_pro && (
                                <span
                                    className={`absolute left-3 top-3 px-2.5 py-1 text-xs ${badgeCertified}`}
                                >
                                    <CheckIcon className="h-3 w-3" />
                                    Certifié Pro
                                </span>
                            )}
                        </div>

                        {photos.length > 1 && (
                            <div className="mt-3 grid grid-cols-4 gap-3">
                                {photos.map((photo, index) => (
                                    <button
                                        key={photo.id}
                                        type="button"
                                        onClick={() => setActivePhoto(index)}
                                        aria-label={`Photo ${index + 1}`}
                                        aria-pressed={index === activePhoto}
                                        className={`aspect-square overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-bg transition focus:outline-none focus-visible:ring-accent ${
                                            index === activePhoto
                                                ? 'ring-accent'
                                                : 'ring-transparent hover:opacity-90'
                                        }`}
                                    >
                                        <img
                                            src={`/storage/${photo.path}`}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <section className="mt-8">
                            <h2 className="font-display text-base font-semibold text-ink">
                                Description
                            </h2>
                            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/80">
                                {annonce.description}
                            </p>
                        </section>

                        <dl className="mt-8 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                            {features.map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex items-baseline justify-between gap-4 border-b border-dotted border-ink-soft/40 py-3"
                                >
                                    <dt className="text-sm text-ink-soft">
                                        {label}
                                    </dt>
                                    <dd className="text-sm font-bold text-ink">
                                        {value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <aside className="self-start rounded-card bg-surface p-[22px] shadow-card lg:sticky lg:top-6">
                        <h1 className="font-display text-2xl font-semibold leading-tight text-ink">
                            {annonce.title}
                        </h1>
                        <p className="mt-1 text-sm text-ink-soft">
                            {annonce.quartier}, {annonce.city}
                        </p>

                        <p className="mt-4 text-[1.5rem] font-bold text-accent">
                            {Number(annonce.price).toLocaleString('fr-FR')} MAD
                            <span className="text-sm font-medium text-ink-soft">
                                {' '}
                                /mois
                            </span>
                        </p>

                        <div className="mt-5 flex items-center gap-3 border-y border-line py-4">
                            <span
                                aria-hidden="true"
                                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navbar text-sm font-bold text-navbar-ink"
                            >
                                {annonce.owner_name ? (
                                    initials(annonce.owner_name)
                                ) : (
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
                                    </svg>
                                )}
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-ink">
                                    {annonce.owner_name ?? 'Propriétaire'}
                                </p>
                                {annonce.is_certified_pro ? (
                                    <p className="flex items-center gap-1 text-xs font-semibold text-success-ink">
                                        <CheckIcon />
                                        Propriétaire certifié
                                    </p>
                                ) : (
                                    <p className="text-xs text-ink-soft">
                                        Particulier
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-5">
                            <WhatsappButton
                                contact={annonce.whatsapp_contact}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    );
}
