import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Pagination from '@/Components/listings/Pagination';
import PageHeading from '@/Components/dashboard/PageHeading';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router, usePage } from '@inertiajs/react';

const STATUS_STYLES = {
    en_attente: 'bg-warning-50 text-warning-700',
    disponible: 'bg-success-50 text-success-700',
    loue: 'bg-ui-border text-ui-text',
};

const STATUS_LABELS = {
    en_attente: 'En attente',
    disponible: 'Disponible',
    loue: 'Louée',
};

function StatusBadge({ annonce }) {
    if (annonce.is_suspended) {
        return (
            <span className="inline-flex items-center rounded-full bg-danger-50 px-2.5 py-0.5 text-xs font-medium text-danger-700">
                Suspendue
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

const FILTER_OPTIONS = [
    { value: '', label: 'Toutes' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'disponible', label: 'Disponible' },
    { value: 'loue', label: 'Louée' },
    { value: 'suspendu', label: 'Suspendues' },
];

export default function Index({ annonces, filters }) {
    const { flash } = usePage().props;

    const applyFilter = (status) => {
        router.get(
            route('admin.annonces.index'),
            status ? { status } : {},
            { preserveState: true, preserveScroll: true, only: ['annonces', 'filters'] },
        );
    };

    const toggleSuspension = (annonce) => {
        router.post(route('admin.annonces.toggle-suspension', annonce.id));
    };

    return (
        <DashboardLayout
            header={<PageHeading title="Annonces" subtitle="Modération des annonces publiées" />}
        >
            <Head title="Annonces" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded-field bg-success-50 p-4 text-sm text-success-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <label htmlFor="filtre-statut" className="text-sm font-medium text-ui-muted">
                            Statut
                        </label>
                        <select
                            id="filtre-statut"
                            value={filters.status ?? ''}
                            onChange={(e) => applyFilter(e.target.value)}
                            className="rounded-field border-ui-border bg-white text-sm focus:border-gold-600 focus:ring-gold-600/30"
                        >
                            {FILTER_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto bg-white shadow-sm sm:rounded-card">
                        <table className="min-w-full divide-y divide-ui-border">
                            <thead className="bg-ui-bg">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Photo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Titre & quartier
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Propriétaire
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Prix
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ui-border bg-white">
                                {annonces.data.map((annonce) => (
                                    <tr key={annonce.id}>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="h-12 w-16 overflow-hidden rounded bg-ui-bg">
                                                {annonce.main_photo ? (
                                                    <img
                                                        src={`/storage/${annonce.main_photo.path}`}
                                                        loading="lazy"
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-xs text-ui-muted">
                                                        Aucune
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-ui-text">
                                                {annonce.title}
                                            </div>
                                            <div className="text-sm text-ui-muted">
                                                {annonce.quartier},{' '}
                                                {annonce.city}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-ui-text">
                                                {annonce.owner?.name}
                                            </div>
                                            <div className="text-sm text-ui-muted">
                                                {annonce.owner?.email}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-ui-text">
                                            {Number(
                                                annonce.price,
                                            ).toLocaleString('fr-FR')}{' '}
                                            MAD
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <StatusBadge annonce={annonce} />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                            {annonce.is_suspended ? (
                                                <SecondaryButton
                                                    onClick={() =>
                                                        toggleSuspension(
                                                            annonce,
                                                        )
                                                    }
                                                >
                                                    Réactiver
                                                </SecondaryButton>
                                            ) : (
                                                <DangerButton
                                                    onClick={() =>
                                                        toggleSuspension(
                                                            annonce,
                                                        )
                                                    }
                                                >
                                                    Suspendre
                                                </DangerButton>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {annonces.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-4 text-center text-sm text-ui-muted"
                                        >
                                            Aucune annonce ne correspond a ce
                                            filtre.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination links={annonces.links} />
                </div>
            </div>
        </DashboardLayout>
    );
}
