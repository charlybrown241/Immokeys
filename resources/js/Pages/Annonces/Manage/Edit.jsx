import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Modifier l'annonce
                </h2>
            }
        >
            <Head title="Modifier l'annonce" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        {annonce.photos?.length > 0 && (
                            <div className="mb-6 grid grid-cols-4 gap-2">
                                {annonce.photos.map((photo) => (
                                    <img
                                        key={photo.id}
                                        src={`/storage/${photo.path}`}
                                        alt=""
                                        className="h-20 w-full rounded-md object-cover"
                                    />
                                ))}
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
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

                            <div className="flex justify-end">
                                <PrimaryButton disabled={processing}>
                                    Enregistrer
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
