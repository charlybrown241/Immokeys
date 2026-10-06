import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import {
    badgeSuccess,
    badgeDanger,
    badgeNeutral,
    badgeWarning,
} from '@/Constants/theme';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_STYLES = {
    en_attente: badgeWarning,
    disponible: badgeSuccess,
    loue: badgeNeutral,
};

const STATUS_LABELS = {
    en_attente: 'En attente',
    disponible: 'Disponible',
    loue: 'Louée',
};

function StatusBadge({ annonce }) {
    if (annonce.is_suspended) {
        return (
            <span className={`shrink-0 px-2.5 py-0.5 text-xs ${badgeDanger}`}>
                Suspendue par l'administrateur
            </span>
        );
    }

    return (
        <span
            className={`shrink-0 px-2.5 py-0.5 text-xs ${STATUS_STYLES[annonce.status]}`}
        >
            {STATUS_LABELS[annonce.status]}
        </span>
    );
}

const actionClasses =
    'inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-field border px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

export default function Index({ annonces }) {
    const { flash } = usePage().props;
    const [annonceToDelete, setAnnonceToDelete] = useState(null);

    const destroy = () => {
        router.delete(route('annonces.destroy', annonceToDelete.id), {
            onFinish: () => setAnnonceToDelete(null),
        });
    };

    return (
        <DashboardLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-heading text-xl font-semibold leading-tight text-ui-text sm:text-2xl">
                        Mes annonces
                    </h2>
                    <Link
                        href={route('annonces.create')}
                        className="inline-flex min-h-10 items-center rounded-field bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600 focus-visible:ring-offset-2"
                    >
                        Publier une annonce
                    </Link>
                </div>
            }
        >
            <Head title="Mes annonces" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-4 px-4 md:px-7">
                    {flash?.success && (
                        <div className="rounded-field bg-success-50 p-4 text-sm text-success-700">
                            {flash.success}
                        </div>
                    )}

                    {annonces.length === 0 && (
                        <div className="rounded-card bg-white p-10 text-center text-sm text-ui-muted shadow-card">
                            Vous n'avez pas encore publié d'annonce.
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {annonces.map((annonce) => {
                            const mainPhoto = annonce.photos?.[0];

                            return (
                                <div
                                    key={annonce.id}
                                    className="flex flex-col overflow-hidden rounded-card bg-white shadow-card"
                                >
                                    <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-ui-border to-warning-50">
                                        {mainPhoto ? (
                                            <img
                                                src={`/storage/${mainPhoto.path}`}
                                                loading="lazy"
                                                alt={annonce.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-ui-muted">
                                                Aucune photo
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="font-heading text-lg font-semibold leading-snug text-ui-text">
                                                {annonce.title}
                                            </h3>
                                            <StatusBadge annonce={annonce} />
                                        </div>
                                        <p className="mt-1 text-sm text-ui-muted">
                                            {annonce.quartier}
                                        </p>
                                        <p className="mt-2 text-lg font-bold text-gold-700">
                                            {Number(
                                                annonce.price,
                                            ).toLocaleString('fr-FR')}{' '}
                                            MAD
                                            <span className="text-sm font-medium text-ui-muted">
                                                {' '}
                                                / mois
                                            </span>
                                        </p>

                                        <div className="mt-auto flex gap-3 pt-4">
                                            <Link
                                                href={route(
                                                    'annonces.edit',
                                                    annonce.id,
                                                )}
                                                className={`${actionClasses} border-ui-border text-ui-text hover:border-ui-text/30 focus-visible:ring-gold-600`}
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setAnnonceToDelete(annonce)
                                                }
                                                className={`${actionClasses} border-danger text-danger-700 hover:border-danger hover:bg-danger-50 focus-visible:ring-danger`}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Modal
                show={annonceToDelete !== null}
                onClose={() => setAnnonceToDelete(null)}
            >
                <div className="p-6">
                    <h2 className="font-heading text-lg font-semibold text-ui-text">
                        Supprimer cette annonce ?
                    </h2>
                    <p className="mt-1 text-sm text-ui-muted">
                        Cette action est irréversible. L'annonce "
                        {annonceToDelete?.title}" et ses photos seront
                        définitivement supprimées.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton
                            onClick={() => setAnnonceToDelete(null)}
                        >
                            Annuler
                        </SecondaryButton>
                        <DangerButton onClick={destroy}>
                            Supprimer
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
