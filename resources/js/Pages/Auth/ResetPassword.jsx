import { AuthHeading, focusFirstError } from '@/Components/auth/AuthParts';
import { Button, Input, PasswordInput } from '@/Components/ui';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { useRef } from 'react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmationRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (formErrors) =>
                focusFirstError(formErrors, [
                    ['email', emailRef],
                    ['password', passwordRef],
                    ['password_confirmation', confirmationRef],
                ]),
        });
    };

    return (
        <AuthLayout>
            <Head title="Nouveau mot de passe" />

            <AuthHeading title="Choisis un nouveau mot de passe">
                Il remplacera l'ancien dès que tu valides.
            </AuthHeading>

            <form onSubmit={submit} noValidate className="mt-6 space-y-5">
                <Input
                    ref={emailRef}
                    id="email"
                    type="email"
                    name="email"
                    label="Email"
                    icon={Mail}
                    value={data.email}
                    autoComplete="username"
                    error={errors.email}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <PasswordInput
                    ref={passwordRef}
                    id="password"
                    name="password"
                    label="Nouveau mot de passe"
                    hint="8 caractères minimum."
                    value={data.password}
                    autoComplete="new-password"
                    autoFocus
                    error={errors.password}
                    onChange={(e) => setData('password', e.target.value)}
                />

                <PasswordInput
                    ref={confirmationRef}
                    id="password_confirmation"
                    name="password_confirmation"
                    label="Confirmer le mot de passe"
                    value={data.password_confirmation}
                    autoComplete="new-password"
                    error={errors.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />

                <Button type="submit" size="lg" loading={processing} className="w-full">
                    {processing ? 'Enregistrement…' : 'Réinitialiser le mot de passe'}
                </Button>
            </form>
        </AuthLayout>
    );
}
