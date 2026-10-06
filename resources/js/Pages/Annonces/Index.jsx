import ListingCard from '@/Components/ListingCard';
import Pagination from '@/Components/listings/Pagination';
import { Badge, Button, Card, cx, EmptyState, focusRing, Input, Select, Skeleton } from '@/Components/ui';
import useRecentSearches from '@/hooks/useRecentSearches';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowUpDown, House, MapPin, RotateCcw, SearchX, SlidersHorizontal, Wallet } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SORT_OPTIONS = [
    { value: 'recent', label: 'Plus récents' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'surface_desc', label: 'Plus grande surface' },
];

// Filters set from elsewhere (old links, price slider) that this bar does
// not edit: kept in the query string so they are not silently dropped.
const CARRIED_FILTERS = ['min_price', 'min_surface', 'max_surface'];

function buildQuery(values, filters) {
    const query = { ...values };
    CARRIED_FILTERS.forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null) query[key] = filters[key];
    });
    if (query.sort === 'recent') delete query.sort;

    return Object.fromEntries(
        Object.entries(query)
            .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
            .filter(([, value]) => value !== '' && value !== null && value !== undefined),
    );
}

function useResultsLoading() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const path = new URL(route('annonces.index')).pathname;
        const stopStart = router.on('start', (event) => {
            if (event.detail.visit.url.pathname === path) setLoading(true);
        });
        const stopFinish = router.on('finish', () => setLoading(false));
        return () => {
            stopStart();
            stopFinish();
        };
    }, []);

    return loading;
}

export default function Index({ annonces, categories, filters }) {
    const [values, setValues] = useState({
        search: filters.search ?? '',
        category_id: filters.category_id ? String(filters.category_id) : '',
        max_price: filters.max_price ?? '',
        sort: filters.sort ?? 'recent',
    });
    const [filtersOpen, setFiltersOpen] = useState(false);
    const loading = useResultsLoading();
    const isFirstRender = useRef(true);
    const { remember } = useRecentSearches();

    // Remember each search that returned to this page with filters, for
    // the student space ("Recherches récentes").
    useEffect(() => {
        remember(filters);
    }, [filters, remember]);

    const visit = (query) =>
        router.get(route('annonces.index'), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['annonces', 'filters'],
        });

    // Live search, debounced so typing does not fire a request per key.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => visit(buildQuery(values, filters)), 350);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

    const activeCount = [values.category_id, values.max_price, values.sort !== 'recent' ? values.sort : ''].filter(
        (value) => value !== '',
    ).length;
    const hasFilters = activeCount > 0 || values.search !== '' || CARRIED_FILTERS.some((key) => filters[key]);

    const reset = () => {
        isFirstRender.current = true;
        setValues({ search: '', category_id: '', max_price: '', sort: 'recent' });
        visit({});
    };

    const total = annonces.total;

    return (
        <PublicLayout>
            <Head title="Logements étudiants à Casablanca" />

            <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-7">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-heading text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                        Logements étudiants à Casablanca
                    </h1>
                    <Badge variant="brand" size="md" aria-live="polite">
                        {total.toLocaleString('fr-FR')} {total > 1 ? 'résultats' : 'résultat'}
                    </Badge>
                </div>
                <p className="mt-2 text-ui-muted">
                    Studios, colocations et chambres publiés par des propriétaires certifiés.
                </p>

                <Card
                    as="form"
                    role="search"
                    aria-label="Filtrer les logements"
                    onSubmit={(event) => {
                        event.preventDefault();
                        visit(buildQuery(values, filters));
                    }}
                    className="mt-8 shadow-float"
                >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
                        <Input
                            label="Quartier ou mot-clé"
                            icon={MapPin}
                            placeholder="Maarif, résidence…"
                            value={values.search}
                            onChange={update('search')}
                            className="sm:col-span-2 lg:col-span-1"
                        />

                        <button
                            type="button"
                            onClick={() => setFiltersOpen((open) => !open)}
                            aria-expanded={filtersOpen}
                            aria-controls="filtres-avances"
                            className={cx(
                                'flex min-h-11 items-center justify-between rounded-field border border-ui-border px-3.5 text-sm font-semibold text-navy-900 sm:hidden',
                                focusRing,
                            )}
                        >
                            <span className="inline-flex items-center gap-2">
                                <SlidersHorizontal size={18} aria-hidden="true" />
                                Filtres et tri
                            </span>
                            {activeCount > 0 && <Badge variant="navy">{activeCount}</Badge>}
                        </button>

                        <div
                            id="filtres-avances"
                            className={cx(
                                'grid gap-4 sm:col-span-2 sm:grid sm:grid-cols-3 lg:col-span-3',
                                filtersOpen ? 'grid' : 'hidden',
                            )}
                        >
                            <Select
                                label="Type de logement"
                                icon={House}
                                placeholder="Tous les types"
                                options={categories.map((category) => ({ value: String(category.id), label: category.name }))}
                                value={values.category_id}
                                onChange={update('category_id')}
                            />
                            <Input
                                label="Budget max (MAD/mois)"
                                icon={Wallet}
                                type="number"
                                inputMode="numeric"
                                min="0"
                                step="100"
                                placeholder="Ex. 3000"
                                value={values.max_price}
                                onChange={update('max_price')}
                            />
                            <Select label="Trier par" icon={ArrowUpDown} options={SORT_OPTIONS} value={values.sort} onChange={update('sort')} />
                        </div>

                        {hasFilters && (
                            <Button variant="ghost" icon={RotateCcw} onClick={reset} className="sm:col-span-2 lg:col-span-1">
                                Réinitialiser
                            </Button>
                        )}
                    </div>
                </Card>

                <section aria-label="Résultats" aria-busy={loading} className="mt-10">
                    {loading ? (
                        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }, (_, index) => (
                                <li key={index}>
                                    <Card padding="none" className="overflow-hidden">
                                        <div className="aspect-[4/3]">
                                            <Skeleton shape="rect" className="!h-full !rounded-none" />
                                        </div>
                                        <div className="space-y-3 p-4">
                                            <Skeleton shape="title" className="w-1/3" />
                                            <Skeleton />
                                            <Skeleton className="w-1/2" />
                                            <Skeleton className="h-9 rounded-field" />
                                        </div>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    ) : annonces.data.length > 0 ? (
                        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {annonces.data.map((annonce) => (
                                <li key={annonce.id}>
                                    <ListingCard annonce={annonce} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState
                            icon={SearchX}
                            title="Aucun logement ne correspond à ta recherche"
                            description="Essaie un autre quartier, un budget un peu plus large ou un autre type de logement."
                            action={
                                hasFilters && (
                                    <Button variant="secondary" icon={RotateCcw} onClick={reset}>
                                        Réinitialiser les filtres
                                    </Button>
                                )
                            }
                        />
                    )}
                </section>

                <Pagination links={annonces.links} className="mt-12" />
            </div>
        </PublicLayout>
    );
}
