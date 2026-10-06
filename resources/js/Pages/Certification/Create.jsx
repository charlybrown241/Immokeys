import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DashboardLayout from '@/Layouts/DashboardLayout';
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
        <DashboardLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-ui-text">
                    Compléter mon profil
                </h2>
            }
        >
            <Head title="Compléter mon profil" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-card">
                        {alreadyCertified && (
                            <p className="text-ui-text">
                                Votre compte est déjà certifié.
                            </p>
                        )}

                        {isPending && (
                            <p className="text-ui-text">
                                Votre pièce d'identité est en cours de
                                vérification par notre équipe.
                            </p>
                        )}

                        {!alreadyCertified && !isPending && (
                            <>
                                {certification?.status === 'rejete' && (
                                    <div className="mb-4 rounded-field bg-danger-50 p-4 text-sm text-danger-700">
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
                                            className="mt-1 block w-full text-sm text-ui-text"
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
        </DashboardLayout>
    );
}
