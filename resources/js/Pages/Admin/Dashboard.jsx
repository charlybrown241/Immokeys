import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
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
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Tableau de bord admin (à venir : certifications à
                            valider, gestion des annonces).
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
