import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

const STATUS_STYLES = {
    en_attente: 'bg-yellow-100 text-yellow-800',
    approuve: 'bg-green-100 text-green-800',
    rejete: 'bg-red-100 text-red-800',
};

const STATUS_LABELS = {
    en_attente: 'En attente',
    approuve: 'Approuvée',
    rejete: 'Rejetée',
};

function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
        >
            {STATUS_LABELS[status]}
        </span>
    );
}

export default function Index({ certifications }) {
    const { flash } = usePage().props;

    const approve = (certification) => {
        router.post(route('admin.certifications.approve', certification.id));
    };

    const reject = (certification) => {
        router.post(route('admin.certifications.reject', certification.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Certifications
                </h2>
            }
        >
            <Head title="Certifications" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-x-auto bg-white shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Propriétaire
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Soumis le
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Document
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {certifications.map((certification) => (
                                    <tr key={certification.id}>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {certification.user.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {certification.user.email}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {new Date(
                                                certification.created_at,
                                            ).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <StatusBadge
                                                status={certification.status}
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <a
                                                href={route(
                                                    'admin.certifications.document',
                                                    certification.id,
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 underline hover:text-indigo-900"
                                            >
                                                Voir le document
                                            </a>
                                        </td>
                                        <td className="whitespace-nowrap space-x-2 px-6 py-4 text-right">
                                            {certification.status ===
                                                'en_attente' && (
                                                <>
                                                    <PrimaryButton
                                                        onClick={() =>
                                                            approve(
                                                                certification,
                                                            )
                                                        }
                                                    >
                                                        Approuver
                                                    </PrimaryButton>
                                                    <DangerButton
                                                        onClick={() =>
                                                            reject(
                                                                certification,
                                                            )
                                                        }
                                                    >
                                                        Rejeter
                                                    </DangerButton>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {certifications.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            Aucune certification soumise.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
