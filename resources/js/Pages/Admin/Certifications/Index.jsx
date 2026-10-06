import CertificationQueue from '@/Components/admin/CertificationQueue';
import FlashMessages from '@/Components/dashboard/FlashMessages';
import PageHeading from '@/Components/dashboard/PageHeading';
import { Button, Card, EmptyState, FilterTabs } from '@/Components/ui';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { FileCheck2, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';

const FILTERS = [
    { key: 'en_attente', label: 'En attente' },
    { key: 'approuve', label: 'Approuvées' },
    { key: 'rejete', label: 'Refusées' },
    { key: 'all', label: 'Toutes' },
];

export default function Index({ certifications }) {
    // Same shape as the dashboard queue.
    const items = useMemo(
        () =>
            certifications.map((certification) => ({
                id: certification.id,
                status: certification.status,
                submitted_at: certification.created_at,
                user: certification.user ? { name: certification.user.name, email: certification.user.email } : null,
            })),
        [certifications],
    );

    const counts = useMemo(
        () => Object.fromEntries(FILTERS.map(({ key }) => [key, key === 'all' ? items.length : items.filter((item) => item.status === key).length])),
        [items],
    );

    // Start on the pending queue when there is work to do.
    const [filter, setFilter] = useState(counts.en_attente > 0 ? 'en_attente' : 'all');
    const visible = filter === 'all' ? items : items.filter((item) => item.status === filter);

    return (
        <DashboardLayout
            header={
                <PageHeading
                    title="Certifications d'identité"
                    subtitle={
                        counts.en_attente > 0
                            ? `${counts.en_attente} pièce${counts.en_attente > 1 ? 's' : ''} à vérifier`
                            : 'Aucune pièce en attente de vérification'
                    }
                />
            }
        >
            <Head title="Certifications" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <FlashMessages />

                {items.length === 0 ? (
                    <EmptyState
                        icon={FileCheck2}
                        title="Aucune demande de certification"
                        description="Les pièces d'identité envoyées par les propriétaires apparaîtront ici."
                    />
                ) : (
                    <>
                        <FilterTabs
                            label="Filtrer par statut"
                            value={filter}
                            onChange={setFilter}
                            items={FILTERS.map(({ key, label }) => ({ key, label, count: counts[key] }))}
                        />
                        <Card>
                            <CertificationQueue
                                certifications={visible}
                                empty={
                                    <EmptyState
                                        icon={SearchX}
                                        title={filter === 'en_attente' ? 'Aucune pièce en attente' : 'Aucune demande dans cette catégorie'}
                                        description={filter === 'en_attente' ? 'Tout est à jour.' : undefined}
                                        action={
                                            <Button variant="outline" onClick={() => setFilter('all')}>
                                                Voir toutes les demandes
                                            </Button>
                                        }
                                        className="border-0 py-8"
                                    />
                                }
                            />
                        </Card>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
