import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';
import PageHeading from '@/Components/dashboard/PageHeading';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router, usePage } from '@inertiajs/react';

const STATUS_STYLES = {
    en_attente: 'bg-warning-50 text-warning-700',
    approuve: 'bg-success-50 text-success-700',
    rejete: 'bg-danger-50 text-danger-700',
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
        <DashboardLayout
            header={<PageHeading title="Certifications d'identité" subtitle="Pièces CIN envoyées par les propriétaires" />}
        >
            <Head title="Certifications" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded-field bg-success-50 p-4 text-sm text-success-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-x-auto bg-white shadow-sm sm:rounded-card">
                        <table className="min-w-full divide-y divide-ui-border">
                            <thead className="bg-ui-bg">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Propriétaire
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Soumis le
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Document
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ui-border bg-white">
                                {certifications.map((certification) => (
                                    <tr key={certification.id}>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="font-medium text-ui-text">
                                                {certification.user.name}
                                            </div>
                                            <div className="text-sm text-ui-muted">
                                                {certification.user.email}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-ui-muted">
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
                                                className="text-gold-700 underline hover:text-gold-700"
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
                                            className="px-6 py-4 text-center text-sm text-ui-muted"
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
        </DashboardLayout>
    );
}
