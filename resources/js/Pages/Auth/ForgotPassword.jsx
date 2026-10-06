import { authLink, AuthHeading, BackToHome } from '@/Components/auth/AuthParts';
import { Alert, Button, Input } from '@/Components/ui';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { useRef } from 'react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const emailRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'), {
            onError: () => emailRef.current?.focus(),
        });
    };

    return (
        <AuthLayout below={<BackToHome />}>
            <Head title="Mot de passe oublié" />

            <AuthHeading title="Mot de passe oublié ?">
                Indique ton adresse email : nous t'enverrons un lien pour en choisir un nouveau.
            </AuthHeading>

            {status && (
                <Alert variant="success" className="mt-6">
                    {status}
                </Alert>
            )}

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
                    autoFocus
                    error={errors.email}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <Button type="submit" size="lg" loading={processing} className="w-full">
                    {processing ? 'Envoi en cours…' : 'Envoyer le lien de réinitialisation'}
                </Button>

                <p className="text-center text-sm text-ui-muted">
                    Tu t'en souviens ?{' '}
                    <Link href={route('login')} className={authLink}>
                        Se connecter
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
