import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const STEPS = [
    { id: 1, label: 'Infos générales' },
    { id: 2, label: 'Localisation & prix' },
    { id: 3, label: 'Photos' },
];

export default function Create({ categories }) {
    const [step, setStep] = useState(1);
    const [photoPreviews, setPhotoPreviews] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category_id: '',
        description: '',
        quartier: '',
        surface: '',
        price: '',
        photos: [],
    });

    const stepErrorMessage = {
        1:
            !data.title.trim() || !data.category_id || !data.description.trim()
                ? 'Merci de renseigner le titre, la catégorie et la description.'
                : null,
        2:
            !data.quartier.trim() || !data.price || Number(data.price) <= 0
                ? 'Merci de renseigner le quartier et un loyer valide.'
                : null,
    };

    const goToStep = (target) => {
        if (target > step && stepErrorMessage[step]) {
            return;
        }
        setStep(target);
    };

    const handlePhotosChange = (e) => {
        const files = Array.from(e.target.files);
        setData('photos', files);
        setPhotoPreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const removePhoto = (index) => {
        setData(
            'photos',
            data.photos.filter((_, i) => i !== index),
        );
        setPhotoPreviews((previews) => previews.filter((_, i) => i !== index));
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('annonces.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Publier une annonce
                </h2>
            }
        >
            <Head title="Nouvelle annonce" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <ol className="mb-8 flex items-center justify-between text-sm">
                            {STEPS.map((s) => (
                                <li
                                    key={s.id}
                                    className={`flex-1 border-b-2 pb-2 text-center ${
                                        step === s.id
                                            ? 'border-indigo-600 font-semibold text-indigo-600'
                                            : 'border-gray-200 text-gray-400'
                                    }`}
                                >
                                    {s.id}. {s.label}
                                </li>
                            ))}
                        </ol>

                        <form onSubmit={submit}>
                            {step === 1 && (
                                <div className="space-y-4">
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
                                            <option value="">
                                                Sélectionner...
                                            </option>
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
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel value="Ville" />
                                        <TextInput
                                            value="Casablanca"
                                            className="mt-1 block w-full bg-gray-100"
                                            disabled
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
                                                setData(
                                                    'quartier',
                                                    e.target.value,
                                                )
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
                                                setData(
                                                    'surface',
                                                    e.target.value,
                                                )
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
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="photos"
                                            value="Photos de l'annonce"
                                        />
                                        <input
                                            id="photos"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handlePhotosChange}
                                            className="mt-1 block w-full text-sm text-gray-700"
                                        />
                                        <InputError
                                            message={errors.photos}
                                            className="mt-2"
                                        />
                                    </div>

                                    {photoPreviews.length > 0 && (
                                        <div className="grid grid-cols-3 gap-3">
                                            {photoPreviews.map((src, index) => (
                                                <div
                                                    key={src}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={src}
                                                        alt=""
                                                        className="h-24 w-full rounded-md object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removePhoto(index)
                                                        }
                                                        className="absolute right-1 top-1 rounded-full bg-white/90 px-1.5 text-xs font-semibold text-red-600 shadow"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-8 flex items-center justify-between">
                                <SecondaryButton
                                    type="button"
                                    disabled={step === 1}
                                    onClick={() => goToStep(step - 1)}
                                >
                                    Précédent
                                </SecondaryButton>

                                {step < 3 ? (
                                    <div className="text-right">
                                        {stepErrorMessage[step] && (
                                            <p className="mb-2 text-sm text-red-600">
                                                {stepErrorMessage[step]}
                                            </p>
                                        )}
                                        <PrimaryButton
                                            type="button"
                                            disabled={Boolean(
                                                stepErrorMessage[step],
                                            )}
                                            onClick={() => goToStep(step + 1)}
                                        >
                                            Suivant
                                        </PrimaryButton>
                                    </div>
                                ) : (
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        Publier l'annonce
                                    </PrimaryButton>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
