import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <>
            <Head title="Annonces" />

            <div className="min-h-screen bg-gray-100 p-6">
                <h1 className="text-xl font-semibold text-gray-800">
                    Annonces
                </h1>
                <p className="mt-2 text-gray-600">
                    Recherche et filtrage des annonces à venir.
                </p>
            </div>
        </>
    );
}
