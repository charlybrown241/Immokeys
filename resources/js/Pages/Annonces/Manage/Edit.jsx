import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { inputClasses } from '@/Constants/theme';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const STATUS_OPTIONS = [
    { value: 'en_attente', label: 'En attente' },
    { value: 'disponible', label: 'Disponible' },
    { value: 'loue', label: 'Louée' },
];

export default function Edit({ annonce, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        title: annonce.title,
        category_id: annonce.category_id,
        description: annonce.description,
        quartier: annonce.quartier,
        surface: annonce.surface ?? '',
        price: annonce.price,
        status: annonce.status,
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('annonces.update', annonce.id));
    };

    return (
        <DashboardLayout
            header={
                <h2 className="font-heading text-2xl font-semibold leading-tight text-ui-text">
                    Modifier l'annonce
                </h2>
            }
        >
            <Head title="Modifier l'annonce" />

            <div className="py-10">
                <div className="mx-auto max-w-3xl px-4 md:px-7">
                    <div className="rounded-card bg-white p-6 shadow-card sm:p-8">
                        {annonce.photos?.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-ui-text">
                                    Photos
                                </p>
                                <p className="mt-0.5 text-xs text-ui-muted">
                                    Les photos ne peuvent pas encore être
                                    modifiées après la publication.
                                </p>
                                <div className="mt-3 grid grid-cols-4 gap-2">
                                    {annonce.photos.map((photo) => (
                                        <img
                                            key={photo.id}
                                            src={`/storage/${photo.path}`}
                                            alt=""
                                            className="aspect-square w-full rounded-field object-cover"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="status" value="Statut" />
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData('status', e.target.value)
                                    }
                                    className={`mt-1 block w-full ${inputClasses}`}
                                >
                                    {STATUS_OPTIONS.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.status}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="title"
                                    value="Titre de l'annonce"
                                />
                                <TextInput
                                    id="title"
                                    value={data.title}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="category_id"
                                    value="Catégorie"
                                />
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData(
                                            'category_id',
                                            e.target.value,
                                        )
                                    }
                                    className={`mt-1 block w-full ${inputClasses}`}
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.category_id}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="Description"
                                />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    rows={5}
                                    className={`mt-1 block w-full ${inputClasses}`}
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="quartier"
                                    value="Quartier"
                                />
                                <TextInput
                                    id="quartier"
                                    value={data.quartier}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('quartier', e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.quartier}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="surface"
                                    value="Surface (m², optionnel)"
                                />
                                <TextInput
                                    id="surface"
                                    type="number"
                                    min="1"
                                    value={data.surface}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('surface', e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.surface}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="price"
                                    value="Loyer mensuel (MAD)"
                                />
                                <TextInput
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.price}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('price', e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.price}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center gap-3 border-t border-ui-border pt-6 sm:justify-between">
                                <Link
                                    href={route('annonces.mine')}
                                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-field border border-ui-border px-5 py-2.5 text-sm font-semibold text-ui-text transition hover:border-ui-text/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600 focus-visible:ring-offset-2 sm:flex-none"
                                >
                                    Annuler
                                </Link>
                                <PrimaryButton
                                    className="flex-1 sm:flex-none"
                                    disabled={processing}
                                >
                                    Enregistrer
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
