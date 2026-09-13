import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ certification }) {
    const { auth, flash } = usePage().props;
    const isVerified = auth.user.is_verified;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-4 py-12">
                <div className="mx-auto max-w-7xl space-y-4 sm:px-6 lg:px-8">
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

                    <Link
                        href={route('annonces.mine')}
                        className="block overflow-hidden rounded-lg bg-white p-6 shadow-sm hover:bg-gray-50"
                    >
                        <span className="text-sm text-gray-500">
                            Mes annonces
                        </span>
                        <p className="mt-1 font-semibold text-gray-900">
                            Voir et gérer mes annonces
                        </p>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
