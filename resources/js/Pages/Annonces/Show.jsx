import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ annonce }) {
    const [activePhoto, setActivePhoto] = useState(0);
    const photos = annonce.photos ?? [];
    const mainPhoto = photos[activePhoto] ?? null;

    return (
        <>
            <Head title={annonce.title} />

            <div className="min-h-screen bg-gray-100">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link
                        href={route('annonces.index')}
                        className="text-sm text-indigo-600 underline hover:text-indigo-900"
                    >
                        ← Retour aux annonces
                    </Link>

                    <div className="mt-4 overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="h-80 w-full bg-gray-100">
                            {mainPhoto ? (
                                <img
                                    src={`/storage/${mainPhoto.path}`}
                                    alt={annonce.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400">
                                    Aucune photo disponible
                                </div>
                            )}
                        </div>

                        {photos.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto p-3">
                                {photos.map((photo, index) => (
                                    <button
                                        key={photo.id}
                                        type="button"
                                        onClick={() => setActivePhoto(index)}
                                        className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                                            index === activePhoto
                                                ? 'border-indigo-600'
                                                : 'border-transparent'
                                        }`}
                                    >
                                        <img
                                            src={`/storage/${photo.path}`}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="p-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium uppercase text-gray-500">
                                    {annonce.category?.name}
                                </span>

                                {annonce.is_certified_pro && (
                                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                                        Propriétaire certifié
                                    </span>
                                )}
                            </div>

                            <h1 className="mt-3 text-2xl font-semibold text-gray-900">
                                {annonce.title}
                            </h1>
                            <p className="mt-1 text-gray-500">
                                {annonce.quartier}, {annonce.city}
                                {annonce.surface
                                    ? ` · ${annonce.surface} m²`
                                    : ''}
                            </p>

                            <p className="mt-3 text-2xl font-bold text-gray-900">
                                {Number(annonce.price).toLocaleString(
                                    'fr-FR',
                                )}{' '}
                                MAD / mois
                            </p>

                            <p className="mt-6 whitespace-pre-line text-gray-700">
                                {annonce.description}
                            </p>

                            <div className="mt-8">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L4 20l1.1-4.5A8.5 8.5 0 1 1 21 11.5Z" />
                                        <path d="M8.5 10.5c0 3 2.5 5.5 5.5 5.5" />
                                    </svg>
                                    Contacter sur WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
