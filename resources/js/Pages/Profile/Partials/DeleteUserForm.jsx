import Panel from '@/Components/dashboard/Panel';
import { Button, Dialog, PasswordInput } from '@/Components/ui';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirming, setConfirming] = useState(false);
    const passwordInput = useRef(null);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const close = () => {
        setConfirming(false);
        clearErrors();
        reset();
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => close(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <Panel
            title="Supprimer mon compte"
            description="La suppression est définitive : tes annonces, tes photos et toutes tes données seront effacées."
            className={className}
        >
            <Button variant="danger" icon={Trash2} onClick={() => setConfirming(true)}>
                Supprimer mon compte
            </Button>

            <Dialog
                open={confirming}
                onClose={() => !processing && close()}
                title="Supprimer définitivement ton compte ?"
                description="Toutes tes données seront effacées et cette action est irréversible. Saisis ton mot de passe pour confirmer."
            >
                <form onSubmit={deleteUser} noValidate className="mt-5">
                    <PasswordInput
                        ref={passwordInput}
                        id="delete_password"
                        name="password"
                        label="Mot de passe"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="current-password"
                        autoFocus
                        error={errors.password}
                    />

                    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="outline" onClick={close} disabled={processing}>
                            Annuler
                        </Button>
                        <Button type="submit" variant="danger" icon={Trash2} loading={processing}>
                            Supprimer définitivement
                        </Button>
                    </div>
                </form>
            </Dialog>
        </Panel>
    );
}
