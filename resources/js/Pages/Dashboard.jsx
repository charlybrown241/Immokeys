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

function StatCard({ label, value, hint }) {
    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            <span className="text-sm text-gray-500">{label}</span>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
                {value}
            </p>
            {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>
    );
}

export default function Dashboard({ certification, stats, annonces }) {
    const { auth, flash } = usePage().props;
    const isVerified = auth.user.is_verified;

    const [contactsAnnonce, setContactsAnnonce] = useState(null);
    const [annonceToDelete, setAnnonceToDelete] = useState(null);

    const destroy = () => {
        router.delete(route('annonces.destroy', annonceToDelete.id), {
            onFinish: () => setAnnonceToDelete(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                    <Link href={route('annonces.create')}>
                        <PrimaryButton type="button">
                            Publier une annonce
                        </PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {flash.error}
                        </div>
                    )}

                    {isVerified && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                            Compte certifié
                        </span>
                    )}

                    {!isVerified && !certification && (
                        <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-800">
                            Complétez votre profil et soumettez votre pièce
                            d'identité pour pouvoir publier des annonces.{' '}
                            <Link
                                href={route('certification.create')}
                                className="font-semibold underline"
                            >
                                Compléter mon profil
                            </Link>
                        </div>
                    )}

                    {!isVerified && certification?.status === 'en_attente' && (
                        <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
                            Votre pièce d'identité est en cours de
                            vérification par notre équipe.
                        </div>
                    )}

                    {!isVerified && certification?.status === 'rejete' && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                            Votre certification a été refusée, merci de
                            soumettre un nouveau document.{' '}
                            <Link
                                href={route('certification.create')}
                                className="font-semibold underline"
                            >
                                Soumettre un nouveau document
                            </Link>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Annonces actives"
                            value={stats.activeAnnoncesCount}
                        />
                        <StatCard
                            label="Taux d'occupation"
                            value={`${stats.occupancyRate}%`}
                        />
                        <StatCard
                            label="Nouveaux leads (7 jours)"
                            value={stats.newLeadsCount}
                        />
                        <StatCard
                            label="Revenus mensuels"
                            value={`${stats.monthlyRevenue.toLocaleString('fr-FR')} MAD`}
                            hint="Estimation, aucun paiement réel"
                        />
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h3 className="font-semibold text-gray-900">
                                Registre de mes annonces
                            </h3>
                        </div>

                        {annonces.length === 0 ? (
                            <div className="p-6 text-sm text-gray-500">
                                Vous n'avez pas encore publié d'annonce.
                            </div>
                        ) : (
                            <>
                                {/* Mobile: stacked cards (below md) */}
                                <div className="divide-y divide-gray-200 md:hidden">
                                    {annonces.map((annonce) => (
                                        <div
                                            key={annonce.id}
                                            className="p-4"
                                        >
                                            <div className="flex gap-3">
                                                <div className="h-16 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
                                                    {annonce.main_photo ? (
                                                        <img
                                                            src={`/storage/${annonce.main_photo.path}`}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                                            Aucune
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-medium text-gray-900">
                                                        {annonce.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {annonce.quartier}
                                                    </div>
                                                    <div className="mt-2">
                                                        <StatusBadge
                                                            annonce={annonce}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex gap-4 text-sm text-gray-600">
                                                <span>
                                                    {annonce.views_count} vues
                                                </span>
                                                <span>
                                                    {
                                                        annonce.contact_logs_count
                                                    }{' '}
                                                    leads
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                                <Link
                                                    href={route(
                                                        'annonces.edit',
                                                        annonce.id,
                                                    )}
                                                    className="text-indigo-600 underline"
                                                >
                                                    Modifier
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setContactsAnnonce(
                                                            annonce,
                                                        )
                                                    }
                                                    className="text-gray-600 underline"
                                                >
                                                    Contacts reçus
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setAnnonceToDelete(
                                                            annonce,
                                                        )
                                                    }
                                                    className="text-red-600 underline"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop: table (md and up) */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Photo
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Titre & quartier
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Statut
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Vues
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Leads
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {annonces.map((annonce) => (
                                                <tr key={annonce.id}>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="h-12 w-16 overflow-hidden rounded bg-gray-100">
                                                            {annonce.main_photo ? (
                                                                <img
                                                                    src={`/storage/${annonce.main_photo.path}`}
                                                                    alt=""
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                                                    Aucune
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900">
                                                            {annonce.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {annonce.quartier}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <StatusBadge
                                                            annonce={annonce}
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                        {annonce.views_count}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                        {
                                                            annonce.contact_logs_count
                                                        }
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                        <div className="flex justify-end gap-4">
                                                            <Link
                                                                href={route(
                                                                    'annonces.edit',
                                                                    annonce.id,
                                                                )}
                                                                className="text-indigo-600 underline hover:text-indigo-900"
                                                            >
                                                                Modifier
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setContactsAnnonce(
                                                                        annonce,
                                                                    )
                                                                }
                                                                className="text-gray-600 underline hover:text-gray-900"
                                                            >
                                                                Contacts
                                                                reçus
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setAnnonceToDelete(
                                                                        annonce,
                                                                    )
                                                                }
                                                                className="text-red-600 underline hover:text-red-900"
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                show={contactsAnnonce !== null}
                onClose={() => setContactsAnnonce(null)}
            >
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Contacts reçus — {contactsAnnonce?.title}
                    </h2>

                    {contactsAnnonce?.contact_logs?.length > 0 ? (
                        <ul className="mt-4 divide-y divide-gray-200">
                            {contactsAnnonce.contact_logs.map((log) => (
                                <li
                                    key={log.id}
                                    className="flex items-center justify-between py-2 text-sm"
                                >
                                    <span className="text-gray-900">
                                        {log.user?.name ?? 'Étudiant'}
                                    </span>
                                    <span className="text-gray-500">
                                        {new Date(
                                            log.created_at,
                                        ).toLocaleDateString('fr-FR')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4 text-sm text-gray-500">
                            Aucun contact reçu pour cette annonce pour le
                            moment.
                        </p>
                    )}

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton
                            onClick={() => setContactsAnnonce(null)}
                        >
                            Fermer
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>

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
