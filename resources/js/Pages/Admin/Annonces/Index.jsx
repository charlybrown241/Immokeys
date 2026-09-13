import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

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

    const goToPage = (url) => {
        if (!url) {
            return;
        }

        router.get(url, {}, { preserveState: true, preserveScroll: true, only: ['annonces'] });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Annonces
                </h2>
            }
        >
            <Head title="Annonces" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-500">
                            Statut
                        </label>
                        <select
                            value={filters.status ?? ''}
                            onChange={(e) => applyFilter(e.target.value)}
                            className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            {FILTER_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto bg-white shadow-sm sm:rounded-lg">
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
                                        Propriétaire
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Prix
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {annonces.data.map((annonce) => (
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
                                                {annonce.quartier},{' '}
                                                {annonce.city}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {annonce.owner?.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {annonce.owner?.email}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
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
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            Aucune annonce ne correspond a ce
                                            filtre.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {annonces.links.length > 3 && (
                        <nav className="flex flex-wrap items-center justify-center gap-1">
                            {annonces.links.map((link, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => goToPage(link.url)}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    className={`rounded-md px-3 py-1 text-sm ${
                                        link.active
                                            ? 'bg-gray-800 text-white'
                                            : link.url
                                              ? 'bg-white text-gray-700 hover:bg-gray-100'
                                              : 'cursor-not-allowed bg-white text-gray-300'
                                    }`}
                                />
                            ))}
                        </nav>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
