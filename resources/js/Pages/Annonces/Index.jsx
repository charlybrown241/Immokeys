import PriceRangeSlider from '@/Components/PriceRangeSlider';
import { badgeCertified } from '@/Constants/theme';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const MIN_PRICE = 0;
const MAX_PRICE = 15000;
const PRICE_STEP = 100;

const POPULAR_QUARTIERS = [
    'Maarif',
    'Gauthier',
    'Racine',
    'Bourgogne',
    'CIL',
    'Sidi Belyout',
];

function buildQuery(values) {
    const query = { ...values };

    if (Number(query.min_price) === MIN_PRICE) {
        delete query.min_price;
    }

    if (Number(query.max_price) === MAX_PRICE) {
        delete query.max_price;
    }

    return Object.fromEntries(
        Object.entries(query).filter(
            ([, value]) => value !== '' && value !== null && value !== undefined,
        ),
    );
}

export default function Index({ annonces, categories, filters }) {
    const [values, setValues] = useState({
        search: filters.search ?? '',
        category_id: filters.category_id ?? '',
        min_price: filters.min_price ? Number(filters.min_price) : MIN_PRICE,
        max_price: filters.max_price ? Number(filters.max_price) : MAX_PRICE,
        min_surface: filters.min_surface ?? '',
        max_surface: filters.max_surface ?? '',
    });

    // On phones the filter panel starts collapsed so results show up in
    // the first screen; from sm up it is always expanded.
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Filters hidden behind the collapsed panel, surfaced on its toggle.
    const activeFiltersCount = [
        POPULAR_QUARTIERS.includes(values.search),
        values.category_id !== '',
        values.min_price !== MIN_PRICE || values.max_price !== MAX_PRICE,
        values.min_surface !== '' || values.max_surface !== '',
    ].filter(Boolean).length;

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(route('annonces.index'), buildQuery(values), {
                preserveState: true,
                preserveScroll: true,
                only: ['annonces'],
                replace: true,
            });
        }, 400);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    const updateValue = (key, value) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    const toggleQuartierTag = (quartier) => {
        updateValue('search', values.search === quartier ? '' : quartier);
    };

    const toggleCategoryTag = (categoryId) => {
        updateValue(
            'category_id',
            String(values.category_id) === String(categoryId)
                ? ''
                : categoryId,
        );
    };

    const goToPage = (url) => {
        if (!url) {
            return;
        }

        router.get(
            url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['annonces'],
            },
        );
    };

    // The search already runs live (debounced); the round button just lets
    // the user fire it immediately.
    const submitSearch = (e) => {
        e.preventDefault();

        router.get(route('annonces.index'), buildQuery(values), {
            preserveState: true,
            preserveScroll: true,
            only: ['annonces'],
            replace: true,
        });
    };

    const chipClasses = (active) =>
        `rounded-full border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
            active
                ? 'border-navbar bg-navbar text-navbar-ink'
                : 'border-line bg-surface text-ink hover:border-ink/30'
        }`;

    const sectionLabelClasses =
        'mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft';

    return (
        <PublicLayout>
            <Head title="Annonces" />

            <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 md:px-7 sm:pt-14">
                <h1 className="font-display text-[1.6rem] font-semibold leading-tight text-ink sm:text-[1.9rem]">
                    Trouvez votre logement étudiant à Casablanca
                </h1>
                <p className="mt-2 max-w-[520px] text-sm text-ink-soft">
                    Studios, colocations et chambres chez l'habitant, publiés
                    par des propriétaires vérifiés.
                </p>

                <form
                    onSubmit={submitSearch}
                    className="mt-8 space-y-6 rounded-[18px] bg-surface p-5 shadow-card sm:p-7"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative w-full">
                            <svg
                                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-3.5-3.5" />
                            </svg>
                            <input
                                type="text"
                                value={values.search}
                                onChange={(e) =>
                                    updateValue('search', e.target.value)
                                }
                                placeholder="Quartier, résidence, université..."
                                aria-label="Rechercher un logement"
                                className="block w-full rounded-full border-line bg-bg py-3 pl-11 pr-5 text-base text-ink placeholder:text-ink-soft focus:border-accent focus:ring-accent"
                            />
                        </div>
                        <button
                            type="submit"
                            aria-label="Rechercher"
                            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navbar text-navbar-ink transition hover:bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-3.5-3.5" />
                            </svg>
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setFiltersOpen((open) => !open)}
                        aria-expanded={filtersOpen}
                        aria-controls="filtres"
                        className="!mt-3 flex min-h-10 w-full items-center justify-between rounded-input border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:hidden"
                    >
                        <span className="flex items-center gap-2">
                            <svg
                                className="h-4 w-4 text-ink-soft"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M4 6h16M7 12h10M10 18h4" />
                            </svg>
                            Filtres
                            {activeFiltersCount > 0 && (
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-strong px-1.5 text-xs font-bold text-accent-ink">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </span>
                        <svg
                            className={`h-4 w-4 text-ink-soft transition ${
                                filtersOpen ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    <div
                        id="filtres"
                        className={`${
                            filtersOpen ? 'block' : 'hidden'
                        } space-y-6 sm:block`}
                    >
                        <div>
                            <p className={sectionLabelClasses}>
                                Quartiers populaires
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_QUARTIERS.map((quartier) => (
                                    <button
                                        key={quartier}
                                        type="button"
                                        onClick={() => toggleQuartierTag(quartier)}
                                        aria-pressed={values.search === quartier}
                                        className={chipClasses(
                                            values.search === quartier,
                                        )}
                                    >
                                        {quartier}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className={sectionLabelClasses}>Catégorie</p>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => {
                                    const active =
                                        String(values.category_id) ===
                                        String(category.id);

                                    return (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() =>
                                                toggleCategoryTag(category.id)
                                            }
                                            aria-pressed={active}
                                            className={chipClasses(active)}
                                        >
                                            {category.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="sm:max-w-md">
                            <p className={sectionLabelClasses}>
                                Loyer mensuel (MAD)
                            </p>
                            <PriceRangeSlider
                                min={MIN_PRICE}
                                max={MAX_PRICE}
                                step={PRICE_STEP}
                                value={[values.min_price, values.max_price]}
                                onChange={([minPrice, maxPrice]) =>
                                    setValues((current) => ({
                                        ...current,
                                        min_price: minPrice,
                                        max_price: maxPrice,
                                    }))
                                }
                            />
                        </div>

                        <details className="border-t border-line pt-5 text-sm">
                            <summary className="cursor-pointer font-semibold text-ink-soft hover:text-ink">
                                Filtres avancés (surface)
                            </summary>
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-xs">
                                <input
                                    type="number"
                                    min="0"
                                    value={values.min_surface}
                                    onChange={(e) =>
                                        updateValue('min_surface', e.target.value)
                                    }
                                    placeholder="Min m²"
                                    aria-label="Surface minimum"
                                    className="block w-full rounded-input border-line text-sm text-ink focus:border-accent focus:ring-accent"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    value={values.max_surface}
                                    onChange={(e) =>
                                        updateValue('max_surface', e.target.value)
                                    }
                                    placeholder="Max m²"
                                    aria-label="Surface maximum"
                                    className="block w-full rounded-input border-line text-sm text-ink focus:border-accent focus:ring-accent"
                                />
                            </div>
                        </details>
                    </div>
                </form>

                <p className="mt-10 text-sm text-ink-soft">
                    {annonces.total} annonce
                    {annonces.total > 1 ? 's' : ''} trouvée
                    {annonces.total > 1 ? 's' : ''}
                </p>

                <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {annonces.data.map((annonce) => (
                        <Link
                            key={annonce.id}
                            href={route('annonces.show', annonce.id)}
                            className="group flex flex-col overflow-hidden rounded-card bg-surface shadow-card transition duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-line to-pending-bg">
                                {annonce.main_photo ? (
                                    <img
                                        src={`/storage/${annonce.main_photo.path}`}
                                        alt={annonce.title}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-ink-soft">
                                        Aucune photo
                                    </div>
                                )}

                                {annonce.is_certified_pro && (
                                    <span
                                        className={`absolute left-3 top-3 px-2.5 py-1 text-[11px] ${badgeCertified}`}
                                    >
                                        <svg
                                            className="h-3 w-3"
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
                                        Certifié Pro
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
                                <h3 className="truncate font-display text-lg font-semibold text-ink">
                                    {annonce.title}
                                </h3>
                                <p className="mt-0.5 truncate text-sm text-ink-soft">
                                    {[
                                        annonce.quartier,
                                        annonce.category?.name,
                                        annonce.surface
                                            ? `${annonce.surface} m²`
                                            : null,
                                    ]
                                        .filter(Boolean)
                                        .join(' · ')}
                                </p>

                                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                                    <p className="text-lg font-bold text-accent-strong">
                                        {Number(annonce.price).toLocaleString(
                                            'fr-FR',
                                        )}{' '}
                                        MAD
                                        <span className="text-sm font-medium text-ink-soft">
                                            {' '}
                                            / mois
                                        </span>
                                    </p>

                                    <span
                                        aria-hidden="true"
                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navbar text-navbar-ink transition group-hover:bg-accent group-hover:text-accent-ink"
                                    >
                                        <svg
                                            className="h-4 w-4 -rotate-45"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M5 12h14M13 6l6 6-6 6" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {annonces.data.length === 0 && (
                        <div className="col-span-full rounded-card bg-surface p-10 text-center text-sm text-ink-soft shadow-card">
                            Aucune annonce ne correspond à ces critères.
                        </div>
                    )}
                </div>

                {annonces.links.length > 3 && (
                    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2">
                        {annonces.links.map((link, index) => (
                            <button
                                key={index}
                                type="button"
                                disabled={!link.url}
                                onClick={() => goToPage(link.url)}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
                                    link.active
                                        ? 'bg-navbar text-navbar-ink'
                                        : link.url
                                          ? 'border border-line bg-surface text-ink hover:border-ink/30'
                                          : 'cursor-not-allowed border border-line bg-surface text-ink/30'
                                }`}
                            />
                        ))}
                    </nav>
                )}
            </div>
        </PublicLayout>
    );
}
