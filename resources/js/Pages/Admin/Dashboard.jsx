import FlashMessages from '@/Components/dashboard/FlashMessages';
import PageHeading from '@/Components/dashboard/PageHeading';
import Panel from '@/Components/dashboard/Panel';
import { Avatar, Badge, Button, cx, Dialog, EmptyState, focusRing, StatCard } from '@/Components/ui';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatDate, formatNumber } from '@/utils/format';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Ban,
    Building2,
    Check,
    CircleCheck,
    Clock,
    FileCheck2,
    FileText,
    PauseCircle,
    PlayCircle,
    ShieldAlert,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

const CERTIFICATION_STATUS = {
    en_attente: { variant: 'warning', label: 'En attente', icon: Clock },
    approuve: { variant: 'success', label: 'Approuvée', icon: CircleCheck },
    rejete: { variant: 'danger', label: 'Refusée', icon: X },
};

const ANNONCE_STATUS = {
    disponible: { variant: 'success', label: 'Disponible' },
    loue: { variant: 'neutral', label: 'Louée' },
    en_attente: { variant: 'warning', label: 'En attente' },
};

function CertificationBadge({ status }) {
    const config = CERTIFICATION_STATUS[status] ?? { variant: 'neutral', label: status };
    return (
        <Badge variant={config.variant} icon={config.icon}>
            {config.label}
        </Badge>
    );
}

function AnnonceBadges({ annonce }) {
    const config = ANNONCE_STATUS[annonce.status] ?? { variant: 'neutral', label: annonce.status };
    return (
        <span className="flex flex-wrap gap-1.5">
            <Badge variant={config.variant}>{config.label}</Badge>
            {annonce.is_suspended && (
                <Badge variant="danger" icon={Ban}>
                    Suspendue
                </Badge>
            )}
        </span>
    );
}

function CertificationActions({ certification, busy, onApprove, onReject }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button
                as="a"
                href={route('admin.certifications.document', certification.id)}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                size="sm"
                icon={FileText}
            >
                Pièce
            </Button>
            {certification.status === 'en_attente' && (
                <>
                    <Button size="sm" variant="secondary" icon={Check} loading={busy === 'approve'} disabled={busy !== null} onClick={onApprove}>
                        Approuver
                    </Button>
                    <Button size="sm" variant="outline" icon={X} disabled={busy !== null} onClick={onReject}>
                        Refuser
                    </Button>
                </>
            )}
        </div>
    );
}

function CertificationQueue({ certifications }) {
    const [busy, setBusy] = useState({ id: null, action: null });
    const [toReject, setToReject] = useState(null);

    const send = (certification, action) => {
        router.post(route(`admin.certifications.${action}`, certification.id), {}, {
            preserveScroll: true,
            onStart: () => setBusy({ id: certification.id, action }),
            onFinish: () => {
                setBusy({ id: null, action: null });
                setToReject(null);
            },
        });
    };

    const busyFor = (certification) => (busy.id === certification.id ? busy.action : busy.id ? 'other' : null);

    if (certifications.length === 0) {
        return (
            <EmptyState
                icon={FileCheck2}
                title="Aucune demande de certification"
                description="Les pièces d'identité envoyées par les propriétaires apparaîtront ici."
                className="border-0 py-8"
            />
        );
    }

    return (
        <>
            {/* Cards below md, table from md up. */}
            <ul className="divide-y divide-ui-border md:hidden">
                {certifications.map((certification) => (
                    <li key={certification.id} className="space-y-3 py-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                            <Avatar name={certification.user?.name ?? '?'} size="md" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-ui-text">{certification.user?.name}</p>
                                <p className="truncate text-xs text-ui-muted">{certification.user?.email}</p>
                            </div>
                            <CertificationBadge status={certification.status} />
                        </div>
                        <p className="text-xs text-ui-muted">Envoyée le {formatDate(certification.submitted_at)}</p>
                        <CertificationActions
                            certification={certification}
                            busy={busyFor(certification)}
                            onApprove={() => send(certification, 'approve')}
                            onReject={() => setToReject(certification)}
                        />
                    </li>
                ))}
            </ul>

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                    <caption className="sr-only">File de certification d'identité</caption>
                    <thead className="border-b border-ui-border text-xs uppercase tracking-wider text-ui-muted">
                        <tr>
                            <th scope="col" className="py-3 pr-4 font-semibold">Propriétaire</th>
                            <th scope="col" className="px-4 py-3 font-semibold">Envoyée le</th>
                            <th scope="col" className="px-4 py-3 font-semibold">Statut</th>
                            <th scope="col" className="py-3 pl-4 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ui-border">
                        {certifications.map((certification) => (
                            <tr key={certification.id}>
                                <td className="py-3 pr-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={certification.user?.name ?? '?'} size="sm" />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-ui-text">{certification.user?.name}</p>
                                            <p className="text-xs text-ui-muted">{certification.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-ui-text">{formatDate(certification.submitted_at)}</td>
                                <td className="px-4 py-3">
                                    <CertificationBadge status={certification.status} />
                                </td>
                                <td className="py-3 pl-4">
                                    <div className="flex justify-end">
                                        <CertificationActions
                                            certification={certification}
                                            busy={busyFor(certification)}
                                            onApprove={() => send(certification, 'approve')}
                                            onReject={() => setToReject(certification)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog
                open={toReject !== null}
                onClose={() => busy.id === null && setToReject(null)}
                title="Refuser cette certification ?"
                description={`${toReject?.user?.name ?? 'Ce propriétaire'} sera averti et devra envoyer un nouveau document avant de pouvoir publier.`}
                actions={
                    <>
                        <Button variant="outline" onClick={() => setToReject(null)} disabled={busy.id !== null}>
                            Annuler
                        </Button>
                        <Button variant="danger" icon={X} loading={busy.action === 'reject'} onClick={() => send(toReject, 'reject')}>
                            Refuser
                        </Button>
                    </>
                }
            />
        </>
    );
}

function Moderation({ annonces }) {
    const [busyId, setBusyId] = useState(null);
    const [toSuspend, setToSuspend] = useState(null);

    const toggle = (annonce) => {
        router.post(route('admin.annonces.toggle-suspension', annonce.id), {}, {
            preserveScroll: true,
            onStart: () => setBusyId(annonce.id),
            onFinish: () => {
                setBusyId(null);
                setToSuspend(null);
            },
        });
    };

    if (annonces.length === 0) {
        return <EmptyState icon={Building2} title="Aucune annonce publiée" className="border-0 py-8" />;
    }

    return (
        <>
            <ul className="divide-y divide-ui-border">
                {annonces.map((annonce) => (
                    <li key={annonce.id} className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                            {annonce.status !== 'en_attente' && !annonce.is_suspended ? (
                                <Link
                                    href={route('annonces.show', annonce.id)}
                                    className={cx('block truncate rounded-md text-sm font-semibold text-ui-text hover:underline', focusRing)}
                                >
                                    {annonce.title}
                                </Link>
                            ) : (
                                <p className="truncate text-sm font-semibold text-ui-text">{annonce.title}</p>
                            )}
                            <p className="truncate text-xs text-ui-muted">
                                {annonce.owner ?? 'Propriétaire supprimé'} · {annonce.quartier} · {formatDate(annonce.created_at)}
                            </p>
                        </div>
                        <AnnonceBadges annonce={annonce} />
                        <Button
                            size="sm"
                            variant="outline"
                            icon={annonce.is_suspended ? PlayCircle : PauseCircle}
                            loading={busyId === annonce.id && !toSuspend}
                            disabled={busyId !== null}
                            onClick={() => (annonce.is_suspended ? toggle(annonce) : setToSuspend(annonce))}
                        >
                            {annonce.is_suspended ? 'Réactiver' : 'Suspendre'}
                        </Button>
                    </li>
                ))}
            </ul>

            <Dialog
                open={toSuspend !== null}
                onClose={() => busyId === null && setToSuspend(null)}
                title="Suspendre cette annonce ?"
                description={`« ${toSuspend?.title ?? ''} » ne sera plus visible par les étudiants jusqu'à sa réactivation.`}
                actions={
                    <>
                        <Button variant="outline" onClick={() => setToSuspend(null)} disabled={busyId !== null}>
                            Annuler
                        </Button>
                        <Button variant="danger" icon={PauseCircle} loading={busyId !== null} onClick={() => toggle(toSuspend)}>
                            Suspendre
                        </Button>
                    </>
                }
            />
        </>
    );
}

export default function AdminDashboard({ stats, certifications, annonces }) {
    const students = stats.usersByRole?.etudiant ?? 0;
    const owners = stats.usersByRole?.proprietaire ?? 0;

    return (
        <DashboardLayout header={<PageHeading title="Administration" subtitle="Vue d'ensemble de la plateforme" />}>
            <Head title="Administration" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <FlashMessages />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        icon={Users}
                        label="Utilisateurs"
                        value={formatNumber(stats.usersCount)}
                        hint={`${formatNumber(students)} étudiants · ${formatNumber(owners)} propriétaires`}
                    />
                    <StatCard
                        icon={Building2}
                        label="Annonces en attente"
                        value={formatNumber(stats.pendingAnnoncesCount)}
                        hint={`Sur ${formatNumber(stats.annoncesCount)} annonces`}
                    />
                    <StatCard
                        icon={FileCheck2}
                        label="Certifications en attente"
                        value={formatNumber(stats.pendingCertificationsCount)}
                        hint="Pièces d'identité à vérifier"
                    />
                    <StatCard
                        icon={ShieldAlert}
                        label="Annonces suspendues"
                        value={formatNumber(stats.suspendedAnnoncesCount)}
                        hint="Masquées aux étudiants"
                    />
                </div>

                <Panel
                    title="File de certification d'identité"
                    description="Demandes en attente en premier"
                    action={
                        <Button as={Link} href={route('admin.certifications.index')} variant="ghost" size="sm" iconRight={ArrowRight}>
                            Tout voir
                        </Button>
                    }
                >
                    <CertificationQueue certifications={certifications} />
                </Panel>

                <Panel
                    title="Modération des annonces"
                    description="Dernières annonces publiées"
                    action={
                        <Button as={Link} href={route('admin.annonces.index')} variant="ghost" size="sm" iconRight={ArrowRight}>
                            Toute la modération
                        </Button>
                    }
                >
                    <Moderation annonces={annonces} />
                </Panel>
            </div>
        </DashboardLayout>
    );
}
