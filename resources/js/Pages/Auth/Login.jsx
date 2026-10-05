import { Button, Checkbox, cx, focusRing, Input } from '@/Components/ui';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useRef, useState } from 'react';

const goldLink = cx('rounded-md font-semibold text-gold-700 underline-offset-4 hover:underline', focusRing);

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
            // Move focus to the first field Laravel rejected.
            onError: (formErrors) => {
                if (formErrors.email) emailRef.current?.focus();
                else if (formErrors.password) passwordRef.current?.focus();
            },
        });
    };

    return (
        <AuthLayout
            below={
                <Link
                    href="/"
                    className={cx('inline-flex items-center gap-1.5 rounded-md text-sm text-ui-muted hover:text-ui-text', focusRing)}
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Retour à l'accueil
                </Link>
            }
        >
            <Head title="Connexion" />

            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-navy-900">
                Content de te revoir sur <span translate="no">ImmoKeys</span>.
            </h1>
            <p className="mt-2 text-sm text-ui-muted">
                Nouveau ici ?{' '}
                <Link href={route('register')} className={goldLink}>
                    Créer un compte
                </Link>
            </p>

            {status && (
                <div
                    role="status"
                    className="mt-6 flex items-start gap-2.5 rounded-field border border-success/20 bg-success-50 p-3 text-sm font-medium text-success-700"
                >
                    <CheckCircle size={18} className="mt-px shrink-0" aria-hidden="true" />
                    <p>{status}</p>
                </div>
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

                <Input
                    ref={passwordRef}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    label="Mot de passe"
                    icon={Lock}
                    value={data.password}
                    autoComplete="current-password"
                    error={errors.password}
                    onChange={(e) => setData('password', e.target.value)}
                    labelAside={
                        canResetPassword && (
                            <Link href={route('password.request')} className={cx(goldLink, 'text-xs')}>
                                Mot de passe oublié ?
                            </Link>
                        )
                    }
                    trailing={
                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            aria-controls="password"
                            className={cx(
                                'inline-flex h-10 w-10 items-center justify-center rounded-field text-ui-muted transition hover:text-navy-900',
                                focusRing,
                                'focus-visible:ring-offset-0',
                            )}
                        >
                            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                        </button>
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
