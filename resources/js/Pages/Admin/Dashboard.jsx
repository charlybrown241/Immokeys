import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ pendingCertificationsCount }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Espace administrateur
                </h2>
            }
        >
            <Head title="Admin" />

            <div className="space-y-4 py-12">
                <div className="mx-auto max-w-7xl space-y-4 sm:px-6 lg:px-8">
                    <Link
                        href={route('admin.certifications.index')}
                        className="block overflow-hidden rounded-lg bg-white p-6 shadow-sm hover:bg-gray-50"
                    >
                        <span className="text-sm text-gray-500">
                            Certifications en attente
                        </span>
                        <p className="mt-1 text-3xl font-semibold text-gray-900">
                            {pendingCertificationsCount}
                        </p>
                    </Link>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Tableau de bord admin (à venir : gestion des
                            annonces).
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
