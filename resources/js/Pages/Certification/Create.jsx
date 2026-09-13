import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Create({ certification }) {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        phone: auth.user.phone ?? '',
        document: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('certification.store'), {
            forceFormData: true,
        });
    };

    const alreadyCertified =
        auth.user.is_verified || certification?.status === 'approuve';
    const isPending = !alreadyCertified && certification?.status === 'en_attente';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Compléter mon profil
                </h2>
            }
        >
            <Head title="Compléter mon profil" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        {alreadyCertified && (
                            <p className="text-gray-700">
                                Votre compte est déjà certifié.
                            </p>
                        )}

                        {isPending && (
                            <p className="text-gray-700">
                                Votre pièce d'identité est en cours de
                                vérification par notre équipe.
                            </p>
                        )}

                        {!alreadyCertified && !isPending && (
                            <>
                                {certification?.status === 'rejete' && (
                                    <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                                        Votre précédente certification a été
                                        refusée. Merci de soumettre un nouveau
                                        document.
                                    </div>
                                )}

                                <form onSubmit={submit}>
                                    <div>
                                        <InputLabel
                                            htmlFor="phone"
                                            value="Numéro de téléphone (utilisé pour WhatsApp)"
                                        />

                                        <TextInput
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            value={data.phone}
                                            className="mt-1 block w-full"
                                            autoComplete="tel"
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            required
                                        />

                                        <InputError
                                            message={errors.phone}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="document"
                                            value="Pièce d'identité (CIN, image ou PDF, 5 Mo max)"
                                        />

                                        <input
                                            id="document"
                                            type="file"
                                            name="document"
                                            accept="image/*,.pdf"
                                            className="mt-1 block w-full text-sm text-gray-700"
                                            onChange={(e) =>
                                                setData(
                                                    'document',
                                                    e.target.files[0],
                                                )
                                            }
                                            required
                                        />

                                        <InputError
                                            message={errors.document}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="mt-6 flex items-center justify-end">
                                        <PrimaryButton disabled={processing}>
                                            Envoyer
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
