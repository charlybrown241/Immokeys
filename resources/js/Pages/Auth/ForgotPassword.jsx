import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Mot de passe oublié" />

            <div className="mb-4 text-sm text-ink-soft">
                Mot de passe oublié ? Indiquez votre adresse e-mail et nous
                vous enverrons un lien pour en choisir un nouveau.
            </div>

            {status && (
                <div className="mb-4 rounded-input bg-success-bg p-3 text-sm font-medium text-success-ink">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <InputLabel htmlFor="email" value="E-mail" />

                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <PrimaryButton className="mt-6 w-full" disabled={processing}>
                    Envoyer le lien de réinitialisation
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
