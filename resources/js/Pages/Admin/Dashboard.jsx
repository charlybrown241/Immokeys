import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const ROLE_LABELS = {
    etudiant: 'Étudiants',
    proprietaire: 'Propriétaires',
    admin: 'Admins',
};

function StatCard({ label, value, href }) {
    const content = (
        <>
            <span className="text-sm text-gray-500">{label}</span>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
                {value}
            </p>
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                className="block overflow-hidden rounded-lg bg-white p-6 shadow-sm hover:bg-gray-50"
            >
                {content}
            </Link>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
            {content}
        </div>
    );
}

export default function Dashboard({ stats }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Espace administrateur
                </h2>
            }
        >
            <Head title="Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Annonces (total)"
                            value={stats.annoncesCount}
                            href={route('admin.annonces.index')}
                        />

                        {Object.entries(ROLE_LABELS).map(([role, label]) => (
                            <StatCard
                                key={role}
                                label={label}
                                value={stats.usersByRole[role] ?? 0}
                                href={route('admin.users.index')}
                            />
                        ))}

                        <StatCard
                            label="Certifications en attente"
                            value={stats.pendingCertificationsCount}
                            href={route('admin.certifications.index')}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
