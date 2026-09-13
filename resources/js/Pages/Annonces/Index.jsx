import PriceRangeSlider from '@/Components/PriceRangeSlider';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
    const { auth } = usePage().props;
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

    return (
        <>
            <Head title="Annonces" />

            <div className="min-h-screen bg-gray-100">
                <div className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                        <span className="font-semibold text-gray-800">
                            ImmoKeys
                        </span>

                        {auth.user ? (
                            <div className="flex flex-wrap items-center gap-3 text-sm sm:gap-4">
                                <span className="hidden text-gray-500 sm:inline">
                                    {auth.user.name}
                                </span>
                                {auth.user.role?.name === 'etudiant' && (
                                    <Link
                                        href={route('subscription.show')}
                                        className="text-indigo-600 underline hover:text-indigo-900"
                                    >
                                        Mon abonnement
                                    </Link>
                                )}
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="text-gray-600 underline hover:text-gray-900"
                                >
                                    Se déconnecter
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-sm sm:gap-4">
                                <Link
                                    href={route('login')}
                                    className="text-gray-600 underline hover:text-gray-900"
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="text-indigo-600 underline hover:text-indigo-900"
                                >
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                        Trouvez votre logement étudiant à Casablanca
                    </h1>

                    <div className="mt-4 space-y-5 rounded-lg bg-white p-4 shadow-sm sm:p-5">
                        <input
                            type="text"
                            value={values.search}
                            onChange={(e) =>
                                updateValue('search', e.target.value)
                            }
                            placeholder="Quartier, résidence, université..."
                            className="block w-full rounded-md border-gray-300 text-base focus:border-indigo-500 focus:ring-indigo-500"
                        />

                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
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
                                        className={`rounded-full px-3 py-2.5 text-sm font-medium transition ${
                                            values.search === quartier
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {quartier}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
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
                                        className={`rounded-full px-3 py-2.5 text-sm font-medium transition ${
                                            String(values.category_id) ===
                                            String(category.id)
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
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

                        <details className="text-sm">
                            <summary className="cursor-pointer font-medium text-gray-600">
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
                                    className="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                                    className="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </details>
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                        {annonces.total} annonce
                        {annonces.total > 1 ? 's' : ''} trouvée
                        {annonces.total > 1 ? 's' : ''}
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {annonces.data.map((annonce) => (
                            <Link
                                key={annonce.id}
                                href={route('annonces.show', annonce.id)}
                                className="block overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md"
                            >
                                <div className="relative h-40 w-full bg-gray-100">
                                    {annonce.main_photo ? (
                                        <img
                                            src={`/storage/${annonce.main_photo.path}`}
                                            alt={annonce.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                            Aucune photo
                                        </div>
                                    )}

                                    {annonce.is_certified_pro && (
                                        <span className="absolute left-2 top-2 inline-flex items-center rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-medium text-white shadow">
                                            Propriétaire certifié Pro
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase text-gray-500">
                                        {annonce.category?.name}
                                    </span>
                                    <h3 className="mt-2 font-medium text-gray-900">
                                        {annonce.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {annonce.quartier}, {annonce.city}
                                    </p>
                                    {annonce.surface && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {annonce.surface} m²
                                        </p>
                                    )}
                                    <p className="mt-2 font-semibold text-gray-900">
                                        {Number(
                                            annonce.price,
                                        ).toLocaleString('fr-FR')}{' '}
                                        MAD / mois
                                    </p>
                                </div>
                            </Link>
                        ))}

                        {annonces.data.length === 0 && (
                            <div className="col-span-full rounded-lg bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                                Aucune annonce ne correspond à ces critères.
                            </div>
                        )}
                    </div>

                    {annonces.links.length > 3 && (
                        <nav className="mt-6 flex flex-wrap items-center justify-center gap-1">
                            {annonces.links.map((link, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => goToPage(link.url)}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    className={`rounded-md px-3 py-1 text-sm ${
                                        link.active
                                            ? 'bg-gray-800 text-white'
                                            : link.url
                                              ? 'bg-white text-gray-700 hover:bg-gray-100'
                                              : 'cursor-not-allowed bg-white text-gray-300'
                                    }`}
                                />
                            ))}
                        </nav>
                    )}
                </div>
            </div>
        </>
    );
}
