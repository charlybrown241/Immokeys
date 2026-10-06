import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { badgeWarning } from '@/Constants/theme';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const PREMIUM_BENEFITS = [
    'Sans publicité',
    'Annonces en tête de liste',
    'Support prioritaire',
];

const PRO_BENEFITS = [
    'Badge de confiance sur vos annonces',
    'Visibilité accrue auprès des étudiants',
];

function formatDate(value) {
    return value ? new Date(value).toLocaleDateString('fr-FR') : null;
}

/**
 * Plan card shared by both roles: current status on top, then an optional
 * benefit list and call to action.
 */
function PlanCard({ plan, expiresAt, badge, benefits, action }) {
    return (
        <div className="rounded-card bg-white p-[22px] shadow-card">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <span className="text-sm text-ui-muted">Statut actuel</span>
                    <p className="mt-1 font-heading text-3xl font-semibold text-ui-text">
                        {plan}
                    </p>
                    {expiresAt && (
                        <p className="mt-1 text-sm text-ui-muted">
                            Valable jusqu'au {formatDate(expiresAt)}
                        </p>
                    )}
                </div>
                {badge && (
                    <span className={`px-3 py-1 text-xs ${badgeWarning}`}>
                        {badge}
                    </span>
                )}
            </div>

            {(benefits || action) && (
                <div className="mt-5 border-t border-ui-border pt-5">
                    {benefits && (
                        <ul className="space-y-2.5 text-sm text-ui-text">
                            {benefits.map((benefit) => (
                                <li
                                    key={benefit}
                                    className="flex items-center gap-2.5"
                                >
                                    <svg
                                        className="h-4 w-4 shrink-0 text-gold-700"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path d="m5 12 5 5L20 7" />
                                    </svg>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    )}
                    {action && <div className="mt-5">{action}</div>}
                </div>
            )}
        </div>
    );
}

export default function Show({ subscription }) {
    const { auth, flash } = usePage().props;
    const roleName = auth.user.role?.name;
    const isEtudiant = roleName === 'etudiant';
    const isProprietaire = roleName === 'proprietaire';
    const isPremium = subscription.type === 'premium';

    const [confirming, setConfirming] = useState(false);
    const [processing, setProcessing] = useState(false);

    const confirmAction = () => {
        setProcessing(true);

        router.post(
            route(isEtudiant ? 'subscription.upgrade' : 'subscription.renew'),
            {},
            {
                onFinish: () => {
                    setProcessing(false);
                    setConfirming(false);
                },
            },
        );
    };

    return (
        <DashboardLayout
            header={
                <h2 className="font-heading text-2xl font-semibold leading-tight text-ui-text">
                    Mon abonnement
                </h2>
            }
        >
            <Head title="Mon abonnement" />

            <div className="py-10">
                <div className="mx-auto max-w-md space-y-4 px-4">
                    {flash?.success && (
                        <div className="rounded-field bg-success-50 p-4 text-sm text-success-700">
                            {flash.success}
                        </div>
                    )}

                    {isEtudiant &&
                        (isPremium ? (
                            <PlanCard
                                plan="Premium"
                                expiresAt={subscription.expires_at}
                                badge="Premium actif"
                            />
                        ) : (
                            <PlanCard
                                plan="Gratuit"
                                benefits={PREMIUM_BENEFITS}
                                action={
                                    <PrimaryButton
                                        className="w-full"
                                        onClick={() => setConfirming(true)}
                                    >
                                        Passer Premium
                                    </PrimaryButton>
                                }
                            />
                        ))}

                    {isProprietaire && (
                        <PlanCard
                            plan="Pro"
                            expiresAt={subscription.expires_at}
                            badge="Pro actif"
                            benefits={PRO_BENEFITS}
                            action={
                                <PrimaryButton
                                    className="w-full"
                                    onClick={() => setConfirming(true)}
                                >
                                    Renouveler mon abonnement Pro
                                </PrimaryButton>
                            }
                        />
                    )}
                </div>
            </div>

            <Modal
                show={confirming}
                onClose={() => setConfirming(false)}
            >
                <div className="p-6">
                    <h2 className="font-heading text-lg font-semibold text-ui-text">
                        {isEtudiant
                            ? "Passer à l'abonnement Premium"
                            : "Renouveler l'abonnement Pro"}
                    </h2>

                    <div className="mt-4 rounded-field bg-warning-50 p-4 text-sm text-warning-700">
                        Paiement simulé à des fins pédagogiques — aucune
                        transaction réelle n'est effectuée.
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton
                            onClick={() => setConfirming(false)}
                        >
                            Annuler
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={confirmAction}
                            disabled={processing}
                        >
                            Confirmer
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
