import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const PREMIUM_BENEFITS = [
    'Sans publicité',
    'Annonces en tête de liste',
    'Support prioritaire',
];

function formatDate(value) {
    return value ? new Date(value).toLocaleDateString('fr-FR') : null;
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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Mon abonnement
                </h2>
            }
        >
            <Head title="Mon abonnement" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        {isEtudiant && (
                            <>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm text-gray-500">
                                            Statut actuel
                                        </span>
                                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                                            {isPremium ? 'Premium' : 'Gratuit'}
                                        </p>
                                        {isPremium &&
                                            subscription.expires_at && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Valable jusqu'au{' '}
                                                    {formatDate(
                                                        subscription.expires_at,
                                                    )}
                                                </p>
                                            )}
                                    </div>
                                    {isPremium && (
                                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                                            Premium actif
                                        </span>
                                    )}
                                </div>

                                {!isPremium && (
                                    <div className="mt-6 border-t border-gray-200 pt-6">
                                        <h3 className="font-medium text-gray-900">
                                            Passer Premium
                                        </h3>
                                        <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                            {PREMIUM_BENEFITS.map(
                                                (benefit) => (
                                                    <li
                                                        key={benefit}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span className="text-indigo-600">
                                                            ✓
                                                        </span>
                                                        {benefit}
                                                    </li>
                                                ),
                                            )}
                                        </ul>

                                        <PrimaryButton
                                            className="mt-4"
                                            onClick={() =>
                                                setConfirming(true)
                                            }
                                        >
                                            Passer Premium
                                        </PrimaryButton>
                                    </div>
                                )}
                            </>
                        )}

                        {isProprietaire && (
                            <>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm text-gray-500">
                                            Statut actuel
                                        </span>
                                        <p className="mt-1 text-2xl font-semibold text-gray-900">
                                            Pro
                                        </p>
                                        {subscription.expires_at && (
                                            <p className="mt-1 text-sm text-gray-500">
                                                Valable jusqu'au{' '}
                                                {formatDate(
                                                    subscription.expires_at,
                                                )}
                                            </p>
                                        )}
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                                        Pro actif
                                    </span>
                                </div>

                                <div className="mt-6 border-t border-gray-200 pt-6">
                                    <PrimaryButton
                                        onClick={() => setConfirming(true)}
                                    >
                                        Renouveler mon abonnement Pro
                                    </PrimaryButton>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                show={confirming}
                onClose={() => setConfirming(false)}
            >
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {isEtudiant
                            ? "Passer à l'abonnement Premium"
                            : "Renouveler l'abonnement Pro"}
                    </h2>

                    <div className="mt-4 rounded-md bg-yellow-50 p-4 text-sm text-yellow-800">
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
        </AuthenticatedLayout>
    );
}
