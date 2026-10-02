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

    const pillClasses = (active) =>
        `rounded-full border px-4 py-2 text-sm font-medium transition ${
            active
                ? 'border-navbar bg-navbar text-white'
                : 'border-line bg-white text-ink hover:border-ink/30'
        }`;

    return (
        <PublicLayout>
            <Head title="Annonces" />

            <div>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                        Trouvez votre logement étudiant à Casablanca
                    </h1>

                    <form
                        onSubmit={submitSearch}
                        className="mt-6 space-y-6 rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(30,27,24,0.06)] ring-1 ring-line sm:mt-8 sm:p-7"
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={values.search}
                                onChange={(e) =>
                                    updateValue('search', e.target.value)
                                }
                                placeholder="Quartier, résidence, université..."
                                className="block w-full rounded-full border-line bg-bg/60 px-5 py-3 text-base text-ink placeholder:text-ink/40 focus:border-terracotta focus:ring-terracotta"
                            />
                            <button
                                type="submit"
                                aria-label="Rechercher"
                                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navbar text-white shadow-sm transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
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

                        <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink/60">
                                Quartiers populaires
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_QUARTIERS.map((quartier) => (
                                    <button
                                        key={quartier}
                                        type="button"
                                        onClick={() =>
                                            toggleQuartierTag(quartier)
                                        }
                                        className={pillClasses(
                                            values.search === quartier,
                                        )}
                                    >
                                        {quartier}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink/60">
                                Catégorie
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() =>
                                            toggleCategoryTag(category.id)
                                        }
                                        className={pillClasses(
                                            String(values.category_id) ===
                                                String(category.id),
                                        )}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="sm:max-w-md">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink/60">
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
                            <summary className="cursor-pointer font-medium text-ink/70 hover:text-ink">
                                Filtres avancés (surface)
                            </summary>
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-xs">
                                <input
                                    type="number"
                                    min="0"
                                    value={values.min_surface}
                                    onChange={(e) =>
                                        updateValue(
                                            'min_surface',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Min m²"
                                    className="block w-full rounded-xl border-line text-sm focus:border-terracotta focus:ring-terracotta"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    value={values.max_surface}
                                    onChange={(e) =>
                                        updateValue(
                                            'max_surface',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Max m²"
                                    className="block w-full rounded-xl border-line text-sm focus:border-terracotta focus:ring-terracotta"
                                />
                            </div>
                        </details>
                    </form>

                    <p className="mt-10 text-sm text-ink/60">
                        {annonces.total} annonce
                        {annonces.total > 1 ? 's' : ''} trouvée
                        {annonces.total > 1 ? 's' : ''}
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                        {annonces.data.map((annonce) => (
                            <Link
                                key={annonce.id}
                                href={route('annonces.show', annonce.id)}
                                className="group flex flex-col rounded-2xl bg-white p-3 shadow-sm ring-1 ring-line transition duration-200 hover:shadow-lg"
                            >
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-line/60">
                                    {annonce.main_photo ? (
                                        <img
                                            src={`/storage/${annonce.main_photo.path}`}
                                            alt={annonce.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-ink/40">
                                            Aucune photo
                                        </div>
                                    )}

                                    {annonce.is_certified_pro && (
                                        <span className={`absolute left-3 top-3 px-2.5 py-1 text-[11px] shadow-sm ${badgeCertified}`}>
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

                                <div className="flex flex-1 items-end justify-between gap-3 px-2 pb-1 pt-4">
                                    <div className="min-w-0">
                                        <h3 className="truncate font-display text-lg font-semibold text-ink">
                                            {[
                                                annonce.category?.name,
                                                annonce.quartier,
                                            ]
                                                .filter(Boolean)
                                                .join(' — ')}
                                        </h3>
                                        <p className="mt-0.5 truncate text-sm text-ink/60">
                                            {annonce.title}
                                            {annonce.surface
                                                ? ` · ${annonce.surface} m²`
                                                : ''}
                                        </p>
                                        <p className="mt-3 text-xl font-bold text-terracotta">
                                            {Number(
                                                annonce.price,
                                            ).toLocaleString('fr-FR')}{' '}
                                            MAD
                                            <span className="text-sm font-medium text-ink/60">
                                                {' '}
                                                / mois
                                            </span>
                                        </p>
                                    </div>

                                    <span
                                        aria-hidden="true"
                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navbar text-white transition group-hover:bg-terracotta"
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
                            </Link>
                        ))}

                        {annonces.data.length === 0 && (
                            <div className="col-span-full rounded-2xl bg-white p-10 text-center text-sm text-ink/60 ring-1 ring-line">
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
                                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition ${
                                        link.active
                                            ? 'bg-navbar text-white'
                                            : link.url
                                              ? 'bg-white text-ink ring-1 ring-line hover:ring-ink/30'
                                              : 'cursor-not-allowed bg-white text-ink/30 ring-1 ring-line'
                                    }`}
                                />
                            ))}
                        </nav>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
