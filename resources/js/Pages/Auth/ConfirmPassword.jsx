import { AuthHeading } from '@/Components/auth/AuthParts';
import { Button, PasswordInput } from '@/Components/ui';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const passwordRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
            onError: () => passwordRef.current?.focus(),
        });
    };

    return (
        <AuthLayout>
            <Head title="Confirmer le mot de passe" />

            <AuthHeading title="Confirme ton mot de passe">
                Cette zone est sécurisée : confirme ton mot de passe pour continuer.
            </AuthHeading>

            <form onSubmit={submit} noValidate className="mt-6 space-y-5">
                <PasswordInput
                    ref={passwordRef}
                    id="password"
                    name="password"
                    label="Mot de passe"
                    value={data.password}
                    autoComplete="current-password"
                    autoFocus
                    error={errors.password}
                    onChange={(e) => setData('password', e.target.value)}
                />

                <Button type="submit" size="lg" loading={processing} className="w-full">
                    {processing ? 'Vérification…' : 'Confirmer'}
                </Button>
            </form>
        </AuthLayout>
    );
}
