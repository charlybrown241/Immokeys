import { Badge, Button, cx, Dialog, EmptyState, focusRing } from '@/Components/ui';
import { formatDate, formatMad } from '@/utils/format';
import { Link, router } from '@inertiajs/react';
import { Ban, Building2, House, PauseCircle, PlayCircle } from 'lucide-react';
import { useState } from 'react';

const ANNONCE_STATUS = {
    disponible: { variant: 'success', label: 'Disponible' },
    loue: { variant: 'neutral', label: 'Louée' },
    en_attente: { variant: 'warning', label: 'En attente' },
};

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

/**
 * Moderation list: suspend (confirmed) or reactivate annonces. Each item:
 * { id, title, quartier, status, is_suspended, created_at, owner,
 *   owner_email?, photo?, price? } — optional fields are shown when given.
 */
export default function AnnonceModerationList({ annonces, empty, withPhotos = false }) {
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
        return empty ?? <EmptyState icon={Building2} title="Aucune annonce publiée" className="border-0 py-8" />;
    }

    return (
        <>
            <ul className="divide-y divide-ui-border">
                {annonces.map((annonce) => {
                    const isPublic = annonce.status !== 'en_attente' && !annonce.is_suspended;

                    return (
                        <li key={annonce.id} className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                {withPhotos && (
                                    <span className="h-14 w-20 shrink-0 overflow-hidden rounded-field bg-navy-800">
                                        {annonce.photo ? (
                                            <img src={`/storage/${annonce.photo}`} alt="" loading="lazy" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="flex h-full items-center justify-center text-gold-300">
                                                <House size={20} aria-hidden="true" />
                                            </span>
                                        )}
                                    </span>
                                )}
                                <div className="min-w-0">
                                    {isPublic ? (
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
                                        {[annonce.owner ?? 'Propriétaire supprimé', annonce.quartier, formatDate(annonce.created_at)].join(' · ')}
                                    </p>
                                    {(annonce.owner_email || annonce.price) && (
                                        <p className="truncate text-xs text-ui-muted">
                                            {[annonce.price && `${formatMad(annonce.price)}/mois`, annonce.owner_email].filter(Boolean).join(' · ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <AnnonceBadges annonce={annonce} />
                            <Button
                                size="sm"
                                variant="outline"
                                icon={annonce.is_suspended ? PlayCircle : PauseCircle}
                                loading={busyId === annonce.id && !toSuspend}
                                disabled={busyId !== null}
                                onClick={() => (annonce.is_suspended ? toggle(annonce) : setToSuspend(annonce))}
                                aria-label={`${annonce.is_suspended ? 'Réactiver' : 'Suspendre'} « ${annonce.title} »`}
                            >
                                {annonce.is_suspended ? 'Réactiver' : 'Suspendre'}
                            </Button>
                        </li>
                    );
                })}
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
