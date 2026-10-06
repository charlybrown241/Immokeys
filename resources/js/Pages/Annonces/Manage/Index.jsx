import FlashMessages from '@/Components/dashboard/FlashMessages';
import PageHeading from '@/Components/dashboard/PageHeading';
import { Badge, Button, Card, cx, Dialog, EmptyState, FilterTabs, focusRing } from '@/Components/ui';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatMad, formatNumber } from '@/utils/format';
import { Head, Link, router } from '@inertiajs/react';
import { Ban, Building2, Eye, House, MapPin, MessageCircle, Pencil, Plus, SearchX, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const STATUS = {
    disponible: { label: 'Disponible', variant: 'success' },
    loue: { label: 'Louée', variant: 'neutral' },
    en_attente: { label: 'En attente', variant: 'warning' },
};

const FILTERS = [
    { key: 'all', label: 'Toutes', match: () => true },
    { key: 'disponible', label: 'Disponibles', match: (a) => a.status === 'disponible' && !a.is_suspended },
    { key: 'loue', label: 'Louées', match: (a) => a.status === 'loue' && !a.is_suspended },
    { key: 'en_attente', label: 'En attente', match: (a) => a.status === 'en_attente' && !a.is_suspended },
    { key: 'suspendue', label: 'Suspendues', match: (a) => a.is_suspended },
];

function StatusBadge({ annonce }) {
    if (annonce.is_suspended) {
        return (
            <Badge variant="danger" icon={Ban}>
                Suspendue
            </Badge>
        );
    }
    const status = STATUS[annonce.status] ?? { label: annonce.status, variant: 'neutral' };
    return <Badge variant={status.variant}>{status.label}</Badge>;
}

function AnnonceCard({ annonce, onDelete }) {
    const photo = annonce.photos?.[0];
    const isPublic = annonce.status !== 'en_attente' && !annonce.is_suspended;

    return (
        <Card as="article" padding="none" className="flex h-full flex-col overflow-hidden">
            <div className="relative aspect-[4/3] bg-navy-800">
                {photo ? (
                    <img src={`/storage/${photo.path}`} alt="" loading="lazy" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 text-gold-300">
                        <House size={36} aria-hidden="true" />
                        <span className="text-xs text-white/80">Aucune photo</span>
                    </div>
                )}
                <div className="absolute left-3 top-3">
                    <StatusBadge annonce={annonce} />
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <p className="font-heading text-xl font-extrabold text-navy-900">
                    {formatMad(annonce.price)}
                    <span className="font-body text-sm font-medium text-ui-muted">/mois</span>
                </p>
                <h2 className="mt-1 line-clamp-2 font-semibold leading-snug text-ui-text">{annonce.title}</h2>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-ui-muted">
                    <MapPin size={15} aria-hidden="true" />
                    {annonce.quartier}
                </p>

                <ul className="mt-3 flex gap-4 text-sm text-ui-text">
                    <li className="inline-flex items-center gap-1.5">
                        <Eye size={15} className="text-gold-700" aria-hidden="true" />
                        {formatNumber(annonce.views_count)} vue{annonce.views_count > 1 ? 's' : ''}
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                        <MessageCircle size={15} className="text-gold-700" aria-hidden="true" />
                        {formatNumber(annonce.contact_logs_count)} contact{annonce.contact_logs_count > 1 ? 's' : ''}
                    </li>
                </ul>

                {annonce.is_suspended && (
                    <p className="mt-3 text-xs text-danger-700">
                        Masquée aux étudiants par l'administrateur. Contacte-nous pour en savoir plus.
                    </p>
                )}

                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {isPublic && (
                        <Button as={Link} href={route('annonces.show', annonce.id)} variant="ghost" size="sm" icon={Eye}>
                            Voir
                        </Button>
                    )}
                    <Button as={Link} href={route('annonces.edit', annonce.id)} variant="outline" size="sm" icon={Pencil} className="flex-1">
                        Modifier
                    </Button>
                    <button
                        type="button"
                        onClick={() => onDelete(annonce)}
                        aria-label={`Supprimer « ${annonce.title} »`}
                        className={cx(
                            'inline-flex min-h-9 w-9 items-center justify-center rounded-field border border-ui-border text-danger-700 transition hover:border-danger hover:bg-danger-50',
                            focusRing,
                        )}
                    >
                        <Trash2 size={16} aria-hidden="true" />
                    </button>
                </div>
            </div>
        </Card>
    );
}

export default function Index({ annonces }) {
    const [filter, setFilter] = useState('all');
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const counts = useMemo(
        () => Object.fromEntries(FILTERS.map((item) => [item.key, annonces.filter(item.match).length])),
        [annonces],
    );
    const visible = annonces.filter(FILTERS.find((item) => item.key === filter).match);

    const destroy = () => {
        router.delete(route('annonces.destroy', toDelete.id), {
            preserveScroll: true,
            onStart: () => setDeleting(true),
            onFinish: () => {
                setDeleting(false);
                setToDelete(null);
            },
        });
    };

    return (
        <DashboardLayout
            header={
                <PageHeading
                    title="Mes annonces"
                    subtitle={
                        annonces.length > 0
                            ? `${annonces.length} annonce${annonces.length > 1 ? 's' : ''} publiée${annonces.length > 1 ? 's' : ''}`
                            : 'Publie ton premier logement'
                    }
                    actions={
                        <Button as={Link} href={route('annonces.create')} icon={Plus}>
                            Publier une annonce
                        </Button>
                    }
                />
            }
        >
            <Head title="Mes annonces" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <FlashMessages />

                {annonces.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title="Aucune annonce pour le moment"
                        description="Publie ton premier logement : il apparaîtra ici avec ses vues et ses contacts WhatsApp."
                        action={
                            <Button as={Link} href={route('annonces.create')} icon={Plus}>
                                Publier ma première annonce
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <FilterTabs
                            label="Filtrer par statut"
                            value={filter}
                            onChange={setFilter}
                            items={FILTERS.filter((item) => item.key === 'all' || counts[item.key] > 0).map((item) => ({
                                key: item.key,
                                label: item.label,
                                count: counts[item.key],
                            }))}
                        />

                        {visible.length > 0 ? (
                            <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {visible.map((annonce) => (
                                    <li key={annonce.id}>
                                        <AnnonceCard annonce={annonce} onDelete={setToDelete} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState
                                icon={SearchX}
                                title="Aucune annonce dans cette catégorie"
                                action={
                                    <Button variant="outline" onClick={() => setFilter('all')}>
                                        Voir toutes mes annonces
                                    </Button>
                                }
                            />
                        )}
                    </>
                )}
            </div>

            <Dialog
                open={toDelete !== null}
                onClose={() => !deleting && setToDelete(null)}
                title="Supprimer cette annonce ?"
                description={`« ${toDelete?.title ?? ''} » et ses photos seront définitivement supprimées. Cette action est irréversible.`}
                actions={
                    <>
                        <Button variant="outline" onClick={() => setToDelete(null)} disabled={deleting}>
                            Annuler
                        </Button>
                        <Button variant="danger" icon={Trash2} loading={deleting} onClick={destroy}>
                            Supprimer
                        </Button>
                    </>
                }
            />
        </DashboardLayout>
    );
}
