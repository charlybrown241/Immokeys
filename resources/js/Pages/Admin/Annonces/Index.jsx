import AnnonceModerationList from '@/Components/admin/AnnonceModerationList';
import FlashMessages from '@/Components/dashboard/FlashMessages';
import PageHeading from '@/Components/dashboard/PageHeading';
import Pagination from '@/Components/listings/Pagination';
import { Button, Card, EmptyState, FilterTabs, Skeleton } from '@/Components/ui';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatNumber } from '@/utils/format';
import { Head, router } from '@inertiajs/react';
import { SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';

// Server-side filter values (AnnonceIndexRequest); '' = all.
const FILTERS = [
    { key: '', label: 'Toutes' },
    { key: 'en_attente', label: 'En attente' },
    { key: 'disponible', label: 'Disponibles' },
    { key: 'loue', label: 'Louées' },
    { key: 'suspendu', label: 'Suspendues' },
];

function useListLoading() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const path = new URL(route('admin.annonces.index')).pathname;
        const stopStart = router.on('start', (event) => {
            if (event.detail.visit.url.pathname === path && event.detail.visit.method === 'get') setLoading(true);
        });
        const stopFinish = router.on('finish', () => setLoading(false));
        return () => {
            stopStart();
            stopFinish();
        };
    }, []);

    return loading;
}

export default function Index({ annonces, filters }) {
    const current = filters.status ?? '';
    const loading = useListLoading();

    const applyFilter = (status) =>
        router.get(route('admin.annonces.index'), status ? { status } : {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['annonces', 'filters'],
        });

    const items = annonces.data.map((annonce) => ({
        id: annonce.id,
        title: annonce.title,
        quartier: annonce.quartier,
        status: annonce.status,
        is_suspended: annonce.is_suspended,
        created_at: annonce.created_at,
        owner: annonce.owner?.name,
        owner_email: annonce.owner?.email,
        photo: annonce.main_photo?.path,
        price: annonce.price,
    }));

    return (
        <DashboardLayout
            header={
                <PageHeading
                    title="Annonces"
                    subtitle={`${formatNumber(annonces.total)} annonce${annonces.total > 1 ? 's' : ''}${current ? ' dans ce filtre' : ' au total'}`}
                />
            }
        >
            <Head title="Annonces" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <FlashMessages />

                <FilterTabs label="Filtrer par statut" value={current} onChange={applyFilter} items={FILTERS} />

                <Card aria-busy={loading}>
                    {loading ? (
                        <ul className="divide-y divide-ui-border" aria-hidden="true">
                            {Array.from({ length: 5 }, (_, index) => (
                                <li key={index} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                    <Skeleton className="h-14 w-20 rounded-field" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="w-1/2" />
                                        <Skeleton className="h-3 w-1/3" />
                                    </div>
                                    <Skeleton className="h-9 w-28 rounded-field" />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <AnnonceModerationList
                            annonces={items}
                            withPhotos
                            empty={
                                <EmptyState
                                    icon={SearchX}
                                    title="Aucune annonce dans ce filtre"
                                    action={
                                        current && (
                                            <Button variant="outline" onClick={() => applyFilter('')}>
                                                Voir toutes les annonces
                                            </Button>
                                        )
                                    }
                                    className="border-0 py-8"
                                />
                            }
                        />
                    )}
                </Card>

                <Pagination links={annonces.links} />
            </div>
        </DashboardLayout>
    );
}
