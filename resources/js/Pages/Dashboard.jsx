import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import {
    badgeCertified,
    badgeDanger,
    badgeNeutral,
    badgePending,
} from '@/Constants/theme';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_STYLES = {
    en_attente: badgePending,
    disponible: badgeCertified,
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
            <span className={`px-2.5 py-0.5 text-xs ${badgeDanger}`}>
                Suspendue par l'administrateur
            </span>
        );
    }

    return (
        <span
            className={`px-2.5 py-0.5 text-xs ${STATUS_STYLES[annonce.status]}`}
        >
            {STATUS_LABELS[annonce.status]}
        </span>
    );
}

function StatCard({ label, value, hint }) {
    return (
        <div className="rounded-xl border border-l-[3px] border-line border-l-accent bg-surface p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                {label}
            </span>
            <p className="mt-2 font-display text-[1.6rem] font-semibold leading-none text-ink">
                {value}
            </p>
            {hint && <p className="mt-2 text-xs text-ink-soft">{hint}</p>}
        </div>
    );
}

function Thumbnail({ annonce, className }) {
    return (
        <div
            className={`shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-line to-pending-bg ${className}`}
        >
            {annonce.main_photo ? (
                <img
                    src={`/storage/${annonce.main_photo.path}`}
                    alt=""
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-ink-soft">
                    Aucune
                </div>
            )}
        </div>
    );
}

const iconButtonClasses =
    'inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition hover:bg-bg hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent';

function RowActions({ annonce, onContacts, onDelete }) {
    return (
        <div className="flex items-center gap-1">
            <Link
                href={route('annonces.edit', annonce.id)}
                aria-label="Modifier"
                title="Modifier"
                className={iconButtonClasses}
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
            </Link>
            <button
                type="button"
                onClick={onContacts}
                aria-label="Contacts reçus"
                title="Contacts reçus"
                className={iconButtonClasses}
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L4 20l1.1-4.5A8.5 8.5 0 1 1 21 11.5Z" />
                </svg>
            </button>
            <button
                type="button"
                onClick={onDelete}
                aria-label="Supprimer"
                title="Supprimer"
                className={`${iconButtonClasses} hover:bg-red-50 hover:text-red-700`}
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                </svg>
            </button>
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
                    <div>
                        <h2 className="font-display text-2xl font-semibold leading-tight text-ink">
                            Dashboard
                        </h2>
                        {isVerified && (
                            <span
                                className={`mt-2 px-3 py-1 text-xs font-bold ${badgeCertified}`}
                            >
                                ✓ Compte certifié
                            </span>
                        )}
                        {!isVerified &&
                            certification?.status === 'en_attente' && (
                                <span
                                    className={`mt-2 px-3 py-1 text-xs font-bold ${badgeNeutral}`}
                                >
                                    Certification en attente
                                </span>
                            )}
                    </div>
                    <Link
                        href={route('annonces.create')}
                        className="inline-flex items-center rounded-input bg-navbar px-4 py-2.5 text-sm font-semibold text-navbar-ink transition hover:bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                        Publier une annonce
                    </Link>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl space-y-6 px-4 md:px-7">
                    {flash?.success && (
                        <div className="rounded-input bg-success-bg p-4 text-sm text-success-ink">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="rounded-input bg-red-50 p-4 text-sm text-red-700">
                            {flash.error}
                        </div>
                    )}

                    {!isVerified && !certification && (
                        <div className="rounded-input bg-pending-bg p-4 text-sm text-pending-ink">
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
                        <div className="rounded-input border border-line bg-surface p-4 text-sm text-ink-soft">
                            Votre pièce d'identité est en cours de
                            vérification par notre équipe.
                        </div>
                    )}

                    {!isVerified && certification?.status === 'rejete' && (
                        <div className="rounded-input bg-red-50 p-4 text-sm text-red-800">
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

                    <div className="overflow-hidden rounded-card bg-surface shadow-card">
                        <div className="border-b border-line px-6 py-4">
                            <h3 className="font-display text-lg font-semibold text-ink">
                                Registre de mes annonces
                            </h3>
                        </div>

                        {annonces.length === 0 ? (
                            <div className="p-10 text-center text-sm text-ink-soft">
                                Vous n'avez pas encore publié d'annonce.
                            </div>
                        ) : (
                            <>
                                {/* Mobile: stacked cards (below md) */}
                                <div className="divide-y divide-line md:hidden">
                                    {annonces.map((annonce) => (
                                        <div key={annonce.id} className="p-4">
                                            <div className="flex gap-3">
                                                <Thumbnail
                                                    annonce={annonce}
                                                    className="h-16 w-20"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="truncate font-semibold text-ink">
                                                        {annonce.title}
                                                    </div>
                                                    <div className="text-sm text-ink-soft">
                                                        {annonce.quartier}
                                                    </div>
                                                    <div className="mt-2">
                                                        <StatusBadge
                                                            annonce={annonce}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex gap-4 text-sm text-ink-soft">
                                                    <span>
                                                        {annonce.views_count}{' '}
                                                        vues
                                                    </span>
                                                    <span>
                                                        {
                                                            annonce.contact_logs_count
                                                        }{' '}
                                                        leads
                                                    </span>
                                                </div>
                                                <RowActions
                                                    annonce={annonce}
                                                    onContacts={() =>
                                                        setContactsAnnonce(
                                                            annonce,
                                                        )
                                                    }
                                                    onDelete={() =>
                                                        setAnnonceToDelete(
                                                            annonce,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop: table (md and up) */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="min-w-full divide-y divide-line">
                                        <thead>
                                            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-ink-soft">
                                                <th className="px-6 py-3">
                                                    Annonce
                                                </th>
                                                <th className="px-6 py-3">
                                                    Statut
                                                </th>
                                                <th className="px-6 py-3">
                                                    Vues
                                                </th>
                                                <th className="px-6 py-3">
                                                    Leads
                                                </th>
                                                <th className="px-6 py-3 text-right">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-line">
                                            {annonces.map((annonce) => (
                                                <tr key={annonce.id}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <Thumbnail
                                                                annonce={
                                                                    annonce
                                                                }
                                                                className="h-12 w-16"
                                                            />
                                                            <div className="min-w-0">
                                                                <div className="font-semibold text-ink">
                                                                    {
                                                                        annonce.title
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-ink-soft">
                                                                    {
                                                                        annonce.quartier
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <StatusBadge
                                                            annonce={annonce}
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-ink">
                                                        {annonce.views_count}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-ink">
                                                        {
                                                            annonce.contact_logs_count
                                                        }
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="flex justify-end">
                                                            <RowActions
                                                                annonce={
                                                                    annonce
                                                                }
                                                                onContacts={() =>
                                                                    setContactsAnnonce(
                                                                        annonce,
                                                                    )
                                                                }
                                                                onDelete={() =>
                                                                    setAnnonceToDelete(
                                                                        annonce,
                                                                    )
                                                                }
                                                            />
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
                    <h2 className="font-display text-lg font-semibold text-ink">
                        Contacts reçus — {contactsAnnonce?.title}
                    </h2>

                    {contactsAnnonce?.contact_logs?.length > 0 ? (
                        <ul className="mt-4 divide-y divide-line">
                            {contactsAnnonce.contact_logs.map((log) => (
                                <li
                                    key={log.id}
                                    className="flex items-center justify-between py-2 text-sm"
                                >
                                    <span className="text-ink">
                                        {log.user?.name ?? 'Étudiant'}
                                    </span>
                                    <span className="text-ink-soft">
                                        {new Date(
                                            log.created_at,
                                        ).toLocaleDateString('fr-FR')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4 text-sm text-ink-soft">
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
                    <h2 className="font-display text-lg font-semibold text-ink">
                        Supprimer cette annonce ?
                    </h2>
                    <p className="mt-1 text-sm text-ink-soft">
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
