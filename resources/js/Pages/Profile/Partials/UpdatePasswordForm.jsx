import Panel from '@/Components/dashboard/Panel';
import { Button, PasswordInput } from '@/Components/ui';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import SavedStatus from './SavedStatus';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <Panel
            title="Mot de passe"
            description="Choisis un mot de passe long et unique pour protéger ton compte."
            className={className}
        >
            <form onSubmit={updatePassword} noValidate className="space-y-5">
                <PasswordInput
                    ref={currentPasswordInput}
                    id="current_password"
                    label="Mot de passe actuel"
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    autoComplete="current-password"
                    error={errors.current_password}
                />

                <PasswordInput
                    ref={passwordInput}
                    id="password"
                    label="Nouveau mot de passe"
                    hint="8 caractères minimum."
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    autoComplete="new-password"
                    error={errors.password}
                />

                <PasswordInput
                    id="password_confirmation"
                    label="Confirmer le mot de passe"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    autoComplete="new-password"
                    error={errors.password_confirmation}
                />

                <div className="flex flex-wrap items-center gap-4">
                    <Button type="submit" loading={processing}>
                        {processing ? 'Enregistrement…' : 'Mettre à jour'}
                    </Button>
                    <SavedStatus show={recentlySuccessful}>Mot de passe mis à jour.</SavedStatus>
                </div>
            </form>
        </Panel>
    );
}
