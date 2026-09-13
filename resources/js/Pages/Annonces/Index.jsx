import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function buildQuery(values) {
    return Object.fromEntries(
        Object.entries(values).filter(
            ([, value]) => value !== '' && value !== null && value !== undefined,
        ),
    );
}

export default function Index({ annonces, categories, filters }) {
    const [values, setValues] = useState({
        quartier: filters.quartier ?? '',
        category_id: filters.category_id ?? '',
        min_price: filters.min_price ?? '',
        max_price: filters.max_price ?? '',
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
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Annonces à Casablanca
                    </h1>

                    <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-500">
                                Ville
                            </label>
                            <input
                                value="Casablanca"
                                disabled
                                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-sm"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="quartier"
                                className="block text-xs font-medium text-gray-500"
                            >
                                Quartier
                            </label>
                            <input
                                id="quartier"
                                type="text"
                                value={values.quartier}
                                onChange={(e) =>
                                    updateValue('quartier', e.target.value)
                                }
                                placeholder="Maarif, Gauthier..."
                                className="mt-1 block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="category_id"
                                className="block text-xs font-medium text-gray-500"
                            >
                                Catégorie
                            </label>
                            <select
                                id="category_id"
                                value={values.category_id}
                                onChange={(e) =>
                                    updateValue('category_id', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Toutes</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500">
                                Prix (MAD)
                            </label>
                            <div className="mt-1 flex gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    value={values.min_price}
                                    onChange={(e) =>
                                        updateValue(
                                            'min_price',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Min"
                                    className="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    value={values.max_price}
                                    onChange={(e) =>
                                        updateValue(
                                            'max_price',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Max"
                                    className="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500">
                                Surface (m²)
                            </label>
                            <div className="mt-1 flex gap-2">
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
                                    placeholder="Min"
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
                                    placeholder="Max"
                                    className="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
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
