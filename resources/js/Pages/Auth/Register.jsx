import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        // "Devenir propriétaire" links here with ?role=proprietaire.
        role:
            new URLSearchParams(window.location.search).get('role') ===
            'proprietaire'
                ? 'proprietaire'
                : 'etudiant',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Inscription" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel value="Type de compte" />

                    {/* -my-2.5 py-2.5: 40px touch targets without moving the layout */}
                    <div className="mt-2 flex gap-6 text-sm text-ink">
                        <label className="-my-2.5 flex cursor-pointer items-center gap-2 py-2.5">
                            <input
                                type="radio"
                                name="role"
                                value="etudiant"
                                checked={data.role === 'etudiant'}
                                onChange={(e) => setData('role', e.target.value)}
                                className="text-accent focus:ring-accent"
                            />
                            Étudiant
                        </label>

                        <label className="-my-2.5 flex cursor-pointer items-center gap-2 py-2.5">
                            <input
                                type="radio"
                                name="role"
                                value="proprietaire"
                                checked={data.role === 'proprietaire'}
                                onChange={(e) => setData('role', e.target.value)}
                                className="text-accent focus:ring-accent"
                            />
                            Propriétaire
                        </label>
                    </div>

                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="name" value="Nom complet" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="E-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmer le mot de passe"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <PrimaryButton className="mt-6 w-full" disabled={processing}>
                    Créer mon compte
                </PrimaryButton>

                <p className="mt-4 text-center text-xs text-ink-soft">
                    Déjà inscrit ?{' '}
                    <Link
                        href={route('login')}
                        className="-my-3 inline-flex min-h-10 items-center rounded py-3 text-ink underline underline-offset-2 hover:text-accent-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                        Se connecter
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
