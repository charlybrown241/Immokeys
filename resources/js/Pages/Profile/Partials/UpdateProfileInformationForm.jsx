import Panel from '@/Components/dashboard/Panel';
import { Alert, Button, cx, focusRing, Input } from '@/Components/ui';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Mail, UserRound } from 'lucide-react';
import { useRef } from 'react';
import SavedStatus from './SavedStatus';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const nameRef = useRef(null);
    const emailRef = useRef(null);

    const { data, setData, patch, errors, clearErrors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    // Drop a field's error as soon as it is edited.
    const update = (field) => (e) => {
        setData(field, e.target.value);
        clearErrors(field);
    };

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
            onError: (formErrors) => (formErrors.name ? nameRef : emailRef).current?.focus(),
        });
    };

    return (
        <Panel title="Informations du profil" description="Ton nom et ton adresse email." className={className}>
            <form onSubmit={submit} noValidate className="space-y-5">
                <Input
                    ref={nameRef}
                    id="name"
                    label="Nom complet"
                    icon={UserRound}
                    value={data.name}
                    onChange={update('name')}
                    required
                    autoComplete="name"
                    error={errors.name}
                />

                <Input
                    ref={emailRef}
                    id="email"
                    type="email"
                    label="Email"
                    icon={Mail}
                    value={data.email}
                    onChange={update('email')}
                    required
                    autoComplete="username"
                    error={errors.email}
                />

                {mustVerifyEmail && user.email_verified_at === null && (
                    <Alert variant="info" title="Adresse email non vérifiée">
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className={cx('rounded-md font-semibold text-gold-700 underline underline-offset-4', focusRing)}
                        >
                            Renvoyer l'email de vérification
                        </Link>
                        {status === 'verification-link-sent' && (
                            <span className="mt-1 block text-success-700">Un nouveau lien vient d'être envoyé.</span>
                        )}
                    </Alert>
                )}

                <div className="flex flex-wrap items-center gap-4">
                    <Button type="submit" loading={processing}>
                        {processing ? 'Enregistrement…' : 'Enregistrer'}
                    </Button>
                    <SavedStatus show={recentlySuccessful} />
                </div>
            </form>
        </Panel>
    );
}
