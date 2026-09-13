import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_STYLES = {
    en_attente: 'bg-orange-100 text-orange-800',
    disponible: 'bg-green-100 text-green-800',
    loue: 'bg-gray-200 text-gray-700',
};

const STATUS_LABELS = {
    en_attente: 'En attente',
    disponible: 'Disponible',
    loue: 'Louée',
};

function StatusBadge({ annonce }) {
    if (annonce.is_suspended) {
        return (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                Suspendue par l'administrateur
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[annonce.status]}`}
        >
            {STATUS_LABELS[annonce.status]}
        </span>
    );
}

export default function Index({ annonces }) {
    const { flash } = usePage().props;
    const [annonceToDelete, setAnnonceToDelete] = useState(null);

    const destroy = () => {
        router.delete(route('annonces.destroy', annonceToDelete.id), {
            onFinish: () => setAnnonceToDelete(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Mes annonces
                    </h2>
                    <Link href={route('annonces.create')}>
                        <PrimaryButton type="button">
                            Publier une annonce
                        </PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Mes annonces" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {annonces.length === 0 && (
                        <div className="overflow-hidden bg-white p-6 text-sm text-gray-500 shadow-sm sm:rounded-lg">
                            Vous n'avez pas encore publié d'annonce.
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {annonces.map((annonce) => {
                            const mainPhoto = annonce.photos?.[0];

                            return (
                                <div
                                    key={annonce.id}
                                    className="overflow-hidden rounded-lg bg-white shadow-sm"
                                >
                                    <div className="h-40 w-full bg-gray-100">
                                        {mainPhoto ? (
                                            <img
                                                src={`/storage/${mainPhoto.path}`}
                                                alt={annonce.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                                Aucune photo
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-medium text-gray-900">
                                                {annonce.title}
                                            </h3>
                                            <StatusBadge
                                                annonce={annonce}
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {annonce.quartier}
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            {Number(
                                                annonce.price,
                                            ).toLocaleString('fr-FR')}{' '}
                                            MAD / mois
                                        </p>

                                        <div className="mt-4 flex gap-4">
                                            <Link
                                                href={route(
                                                    'annonces.edit',
                                                    annonce.id,
                                                )}
                                                className="text-sm text-indigo-600 underline hover:text-indigo-900"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setAnnonceToDelete(annonce)
                                                }
                                                className="text-sm text-red-600 underline hover:text-red-900"
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
                    <h2 className="text-lg font-medium text-gray-900">
                        Supprimer cette annonce ?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
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
        </AuthenticatedLayout>
    );
}
