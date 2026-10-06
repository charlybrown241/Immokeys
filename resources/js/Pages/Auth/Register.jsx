import { authLink, AuthHeading, BackToHome, focusFirstError } from '@/Components/auth/AuthParts';
import { Alert, Button, cx, Input, PasswordInput } from '@/Components/ui';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Check, GraduationCap, KeyRound, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useRef } from 'react';

const ROLES = [
    { value: 'etudiant', label: 'Étudiant', description: 'Je cherche un logement', icon: GraduationCap },
    { value: 'proprietaire', label: 'Propriétaire', description: 'Je loue un logement', icon: KeyRound },
];

// Native radios (visually hidden) keep arrow-key navigation and the
// radio-group semantics; the card mirrors their checked/focus state.
function RoleCards({ value, onChange, error, firstRef }) {
    return (
        <fieldset aria-describedby={error ? 'role-error' : undefined}>
            <legend className="mb-2 text-sm font-medium text-ui-text">Je m'inscris en tant que</legend>
            <div className="grid grid-cols-2 gap-3">
                {ROLES.map(({ value: role, label, description, icon: Icon }, index) => {
                    const checked = value === role;

                    return (
                        <label key={role} className="relative block cursor-pointer">
                            <input
                                ref={index === 0 ? firstRef : undefined}
                                type="radio"
                                name="role"
                                value={role}
                                checked={checked}
                                onChange={(e) => onChange(e.target.value)}
                                className="peer sr-only"
                            />
                            <span
                                className={cx(
                                    'flex h-full flex-col gap-2 rounded-card border-2 bg-white p-4 transition',
                                    'peer-focus-visible:ring-2 peer-focus-visible:ring-gold-600 peer-focus-visible:ring-offset-2',
                                    checked ? 'border-navy-900 bg-gold-50' : 'border-ui-border hover:border-navy-900/40',
                                    error && !checked && 'border-danger',
                                )}
                            >
                                <span
                                    className={cx(
                                        'inline-flex h-10 w-10 items-center justify-center rounded-field',
                                        checked ? 'bg-navy-900 text-gold-300' : 'bg-gold-50 text-gold-700',
                                    )}
                                >
                                    <Icon size={20} aria-hidden="true" />
                                </span>
                                <span className="font-heading font-bold text-navy-900">{label}</span>
                                <span className="text-xs text-ui-muted">{description}</span>
                            </span>
                            {checked && (
                                <span
                                    aria-hidden="true"
                                    className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-white"
                                >
                                    <Check size={14} />
                                </span>
                            )}
                        </label>
                    );
                })}
            </div>
            {error && (
                <p id="role-error" className="mt-1.5 text-sm text-danger-700">
                    {error}
                </p>
            )}
        </fieldset>
    );
}

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

    const roleRef = useRef(null);
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmationRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (formErrors) =>
                focusFirstError(formErrors, [
                    ['role', roleRef],
                    ['name', nameRef],
                    ['email', emailRef],
                    ['password', passwordRef],
                    ['password_confirmation', confirmationRef],
                ]),
        });
    };

    return (
        <AuthLayout below={<BackToHome />}>
            <Head title="Inscription" />

            <AuthHeading title={<>Crée ton compte <span translate="no">ImmoKeys</span>.</>}>
                Déjà inscrit ?{' '}
                <Link href={route('login')} className={authLink}>
                    Se connecter
                </Link>
            </AuthHeading>

            <form onSubmit={submit} noValidate className="mt-6 space-y-5">
                <RoleCards value={data.role} onChange={(role) => setData('role', role)} error={errors.role} firstRef={roleRef} />

                {data.role === 'proprietaire' && (
                    <Alert variant="info" icon={ShieldCheck} title="Ton identité, ta meilleure carte de visite">
                        Après l'inscription, envoie ta pièce d'identité (CIN) depuis ton espace. Une fois vérifiée par
                        notre équipe, tu pourras publier et tes annonces afficheront le badge « Identité certifiée »,
                        qui rassure les étudiants.
                    </Alert>
                )}

                <Input
                    ref={nameRef}
                    id="name"
                    name="name"
                    label="Nom complet"
                    icon={UserRound}
                    value={data.name}
                    autoComplete="name"
                    required
                    error={errors.name}
                    onChange={(e) => setData('name', e.target.value)}
                />

                <Input
                    ref={emailRef}
                    id="email"
                    type="email"
                    name="email"
                    label="Email"
                    icon={Mail}
                    value={data.email}
                    autoComplete="username"
                    required
                    error={errors.email}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <PasswordInput
                    ref={passwordRef}
                    id="password"
                    name="password"
                    label="Mot de passe"
                    hint="8 caractères minimum."
                    value={data.password}
                    autoComplete="new-password"
                    required
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
                    required
                    error={errors.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />

                <Button type="submit" size="lg" loading={processing} className="w-full">
                    {processing ? 'Création du compte…' : 'Créer mon compte'}
                </Button>
            </form>
        </AuthLayout>
    );
}
