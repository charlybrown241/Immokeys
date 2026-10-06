import { Avatar, Badge, Button, Dialog, EmptyState } from '@/Components/ui';
import { formatDate } from '@/utils/format';
import { router } from '@inertiajs/react';
import { Check, CircleCheck, Clock, FileCheck2, FileText, X } from 'lucide-react';
import { useState } from 'react';

export const CERTIFICATION_STATUS = {
    en_attente: { variant: 'warning', label: 'En attente', icon: Clock },
    approuve: { variant: 'success', label: 'Approuvée', icon: CircleCheck },
    rejete: { variant: 'danger', label: 'Refusée', icon: X },
};

export function CertificationBadge({ status }) {
    const config = CERTIFICATION_STATUS[status] ?? { variant: 'neutral', label: status };
    return (
        <Badge variant={config.variant} icon={config.icon}>
            {config.label}
        </Badge>
    );
}

function Actions({ certification, busy, onApprove, onReject }) {
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
                aria-label={`Voir la pièce de ${certification.user?.name ?? 'ce propriétaire'} (nouvel onglet)`}
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

/**
 * Identity certification queue: table from md up, cards below. Approve
 * acts at once, reject asks for confirmation. Each item:
 * { id, status, submitted_at, user: { name, email } }.
 */
export default function CertificationQueue({ certifications, empty }) {
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
            empty ?? (
                <EmptyState
                    icon={FileCheck2}
                    title="Aucune demande de certification"
                    description="Les pièces d'identité envoyées par les propriétaires apparaîtront ici."
                    className="border-0 py-8"
                />
            )
        );
    }

    const actionsFor = (certification) => (
        <Actions
            certification={certification}
            busy={busyFor(certification)}
            onApprove={() => send(certification, 'approve')}
            onReject={() => setToReject(certification)}
        />
    );

    return (
        <>
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
                        {actionsFor(certification)}
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
                                    <div className="flex justify-end">{actionsFor(certification)}</div>
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
                description={`${toReject?.user?.name ?? 'Ce propriétaire'} verra le refus dans son espace et devra envoyer un nouveau document avant de pouvoir publier.`}
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
