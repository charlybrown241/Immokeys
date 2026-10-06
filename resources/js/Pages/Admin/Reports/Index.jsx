import FlashMessages from '@/Components/dashboard/FlashMessages';
import PageHeading from '@/Components/dashboard/PageHeading';
import { Badge, Button, Card, cx, Dialog, EmptyState, FilterTabs, focusRing } from '@/Components/ui';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatDate } from '@/utils/format';
import { Head, Link, router } from '@inertiajs/react';
import { Ban, Check, CircleCheck, Clock, Flag, PauseCircle, SearchX, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const STATUS = {
    nouveau: { variant: 'warning', label: 'À traiter', icon: Clock },
    traite: { variant: 'success', label: 'Traité', icon: CircleCheck },
    rejete: { variant: 'neutral', label: 'Rejeté', icon: X },
};

const FILTERS = [
    { key: 'nouveau', label: 'À traiter' },
    { key: 'traite', label: 'Traités' },
    { key: 'rejete', label: 'Rejetés' },
    { key: 'all', label: 'Tous' },
];

function ReportCard({ report, busy, onDecide, onSuspend }) {
    const status = STATUS[report.status];
    const annonce = report.annonce;
    const isPublic = annonce && annonce.status !== 'en_attente' && !annonce.is_suspended;
    const open = report.status === 'nouveau';

    return (
        <Card as="article" aria-label={`Signalement : ${report.reason}`} className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-2 font-heading font-bold text-navy-900">
                        <Flag size={16} className="text-danger-700" aria-hidden="true" />
                        {report.reason}
                    </p>
                    <p className="mt-0.5 text-sm text-ui-muted">
                        Signalé par {report.reporter?.name ?? 'un utilisateur supprimé'} le {formatDate(report.created_at)}
                        {report.handled_at && ` · traité le ${formatDate(report.handled_at)}`}
                    </p>
                </div>
                <Badge variant={status.variant} icon={status.icon}>
                    {status.label}
                </Badge>
            </div>

            {report.message && (
                <blockquote className="rounded-field border-l-4 border-ui-border bg-ui-bg px-4 py-3 text-sm text-ui-text">{report.message}</blockquote>
            )}

            <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-ui-muted">Annonce :</span>
                {annonce ? (
                    <>
                        {isPublic ? (
                            <Link href={route('annonces.show', annonce.id)} className={cx('rounded-md font-semibold text-ui-text hover:underline', focusRing)}>
                                {annonce.title}
                            </Link>
                        ) : (
                            <span className="font-semibold text-ui-text">{annonce.title}</span>
                        )}
                        <span className="text-ui-muted">
                            · {annonce.owner ?? 'Propriétaire supprimé'} · {annonce.quartier}
                        </span>
                        {annonce.is_suspended && (
                            <Badge variant="danger" icon={Ban}>
                                Suspendue
                            </Badge>
                        )}
                    </>
                ) : (
                    <span className="text-ui-muted">supprimée</span>
                )}
            </div>

            {open && (
                <div className="flex flex-wrap gap-2 border-t border-ui-border pt-4">
                    {annonce && !annonce.is_suspended && (
                        <Button size="sm" variant="danger" icon={PauseCircle} disabled={busy !== null} onClick={() => onSuspend(report)}>
                            Suspendre l'annonce
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="secondary"
                        icon={Check}
                        loading={busy === 'traite'}
                        disabled={busy !== null}
                        onClick={() => onDecide(report, 'traite')}
                    >
                        Marquer traité
                    </Button>
                    <Button size="sm" variant="outline" icon={X} loading={busy === 'rejete'} disabled={busy !== null} onClick={() => onDecide(report, 'rejete')}>
                        Rejeter
                    </Button>
                </div>
            )}
        </Card>
    );
}

export default function Index({ reports }) {
    const counts = useMemo(
        () => Object.fromEntries(FILTERS.map(({ key }) => [key, key === 'all' ? reports.length : reports.filter((r) => r.status === key).length])),
        [reports],
    );
    const [filter, setFilter] = useState(counts.nouveau > 0 ? 'nouveau' : 'all');
    const [busy, setBusy] = useState({ id: null, action: null });
    const [toSuspend, setToSuspend] = useState(null);

    const decide = (report, status, suspend = false) =>
        router.patch(route('admin.reports.update', report.id), { status, suspend }, {
            preserveScroll: true,
            onStart: () => setBusy({ id: report.id, action: suspend ? 'suspend' : status }),
            onFinish: () => {
                setBusy({ id: null, action: null });
                setToSuspend(null);
            },
        });

    const visible = filter === 'all' ? reports : reports.filter((report) => report.status === filter);
    const busyFor = (report) => (busy.id === report.id ? busy.action : busy.id ? 'other' : null);

    return (
        <DashboardLayout
            header={
                <PageHeading
                    title="Signalements"
                    subtitle={counts.nouveau > 0 ? `${counts.nouveau} signalement${counts.nouveau > 1 ? 's' : ''} à traiter` : 'Aucun signalement à traiter'}
                />
            }
        >
            <Head title="Signalements" />

            <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <FlashMessages />

                {reports.length === 0 ? (
                    <EmptyState icon={Flag} title="Aucun signalement" description="Les annonces signalées par les utilisateurs apparaîtront ici." />
                ) : (
                    <>
                        <FilterTabs
                            label="Filtrer par statut"
                            value={filter}
                            onChange={setFilter}
                            items={FILTERS.map(({ key, label }) => ({ key, label, count: counts[key] }))}
                        />
                        {visible.length > 0 ? (
                            <ul className="space-y-4">
                                {visible.map((report) => (
                                    <li key={report.id}>
                                        <ReportCard report={report} busy={busyFor(report)} onDecide={decide} onSuspend={setToSuspend} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState
                                icon={SearchX}
                                title={filter === 'nouveau' ? 'Rien à traiter' : 'Aucun signalement dans cette catégorie'}
                                description={filter === 'nouveau' ? 'Tout est à jour.' : undefined}
                                action={
                                    <Button variant="outline" onClick={() => setFilter('all')}>
                                        Voir tous les signalements
                                    </Button>
                                }
                            />
                        )}
                    </>
                )}
            </div>

            <Dialog
                open={toSuspend !== null}
                onClose={() => busy.id === null && setToSuspend(null)}
                title="Suspendre l'annonce signalée ?"
                description={`« ${toSuspend?.annonce?.title ?? ''} » sera masquée aux étudiants et le signalement sera marqué comme traité.`}
                actions={
                    <>
                        <Button variant="outline" onClick={() => setToSuspend(null)} disabled={busy.id !== null}>
                            Annuler
                        </Button>
                        <Button variant="danger" icon={PauseCircle} loading={busy.action === 'suspend'} onClick={() => decide(toSuspend, 'traite', true)}>
                            Suspendre
                        </Button>
                    </>
                }
            />
        </DashboardLayout>
    );
}
