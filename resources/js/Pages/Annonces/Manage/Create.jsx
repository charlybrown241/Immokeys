import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { inputClasses } from '@/Constants/theme';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const STEPS = [
    { id: 1, label: 'Infos générales' },
    { id: 2, label: 'Localisation & prix' },
    { id: 3, label: 'Photos' },
];

function StepCircle({ state, number }) {
    if (state === 'done') {
        return (
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success-bg text-success-ink">
                <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="m5 12 5 5L20 7" />
                </svg>
            </span>
        );
    }

    return (
        <span
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                state === 'active'
                    ? 'bg-accent-strong text-accent-ink'
                    : 'bg-idle text-ink-soft'
            }`}
        >
            {number}
        </span>
    );
}

function Stepper({ current }) {
    return (
        <ol className="mb-8 flex items-center gap-2 sm:gap-3">
            {STEPS.map((s, index) => {
                const state =
                    s.id < current
                        ? 'done'
                        : s.id === current
                          ? 'active'
                          : 'upcoming';

                return (
                    <li
                        key={s.id}
                        aria-current={state === 'active' ? 'step' : undefined}
                        className={`flex items-center gap-2 sm:gap-3 ${
                            // The active step sizes to its label and is the
                            // only one allowed to shrink (its label wraps);
                            // the others keep room for circle + connector.
                            state === 'active' ? 'min-w-0' : ''
                        } ${
                            index < STEPS.length - 1
                                ? state === 'active'
                                    ? 'flex-auto'
                                    : 'flex-1'
                                : ''
                        }`}
                    >
                        <StepCircle state={state} number={s.id} />
                        <span
                            className={`text-sm leading-tight sm:whitespace-nowrap ${
                                state === 'active'
                                    ? 'font-semibold text-ink'
                                    : 'hidden text-ink-soft sm:inline'
                            }`}
                        >
                            {s.id}. {s.label}
                        </span>
                        {index < STEPS.length - 1 && (
                            <span
                                aria-hidden="true"
                                className="h-px min-w-3 flex-1 bg-line"
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

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
                <h2 className="font-display text-2xl font-semibold leading-tight text-ink">
                    Publier une annonce
                </h2>
            }
        >
            <Head title="Nouvelle annonce" />

            <div className="py-10">
                <div className="mx-auto max-w-3xl px-4 md:px-7">
                    <div className="rounded-card bg-surface p-6 shadow-card sm:p-8">
                        <Stepper current={step} />

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
                                            className={`mt-1 block w-full ${inputClasses}`}
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
                                            className={`mt-1 block w-full ${inputClasses}`}
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
                                            className="mt-1 block w-full"
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
                                            className="mt-1 block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-navbar file:px-4 file:py-2 file:text-sm file:font-semibold file:text-navbar-ink hover:file:bg-ink"
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
                                                        className="h-24 w-full rounded-lg object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removePhoto(index)
                                                        }
                                                        aria-label="Retirer la photo"
                                                        className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface/90 text-sm font-semibold text-red-600 shadow"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
                                <SecondaryButton
                                    type="button"
                                    disabled={step === 1}
                                    onClick={() => goToStep(step - 1)}
                                >
                                    Précédent
                                </SecondaryButton>

                                {step < 3 ? (
                                    <PrimaryButton
                                        type="button"
                                        disabled={Boolean(
                                            stepErrorMessage[step],
                                        )}
                                        onClick={() => goToStep(step + 1)}
                                    >
                                        Suivant
                                    </PrimaryButton>
                                ) : (
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        Publier l'annonce
                                    </PrimaryButton>
                                )}
                            </div>

                            {step < 3 && stepErrorMessage[step] && (
                                <p className="mt-3 text-right text-sm text-red-600">
                                    {stepErrorMessage[step]}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
