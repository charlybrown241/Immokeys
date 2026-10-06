import { authLink, AuthHeading, BackToHome, focusFirstError } from '@/Components/auth/AuthParts';
import { Alert, Button, Checkbox, cx, Input, PasswordInput } from '@/Components/ui';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { useRef } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
            onError: (formErrors) =>
                focusFirstError(formErrors, [
                    ['email', emailRef],
                    ['password', passwordRef],
                ]),
        });
    };

    return (
        <AuthLayout below={<BackToHome />}>
            <Head title="Connexion" />

            <AuthHeading title={<>Content de te revoir sur <span translate="no">ImmoKeys</span>.</>}>
                Nouveau ici ?{' '}
                <Link href={route('register')} className={authLink}>
                    Créer un compte
                </Link>
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

                <PasswordInput
                    ref={passwordRef}
                    id="password"
                    name="password"
                    label="Mot de passe"
                    value={data.password}
                    autoComplete="current-password"
                    error={errors.password}
                    onChange={(e) => setData('password', e.target.value)}
                    labelAside={
                        canResetPassword && (
                            <Link href={route('password.request')} className={cx(authLink, 'text-xs')}>
                                Mot de passe oublié ?
                            </Link>
                        )
                    }
                />

                <Checkbox
                    name="remember"
                    label="Se souvenir de cet appareil"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                />

                <Button type="submit" size="lg" loading={processing} className="w-full">
                    {processing ? 'Connexion en cours…' : 'Se connecter'}
                </Button>
            </form>
        </AuthLayout>
    );
}
