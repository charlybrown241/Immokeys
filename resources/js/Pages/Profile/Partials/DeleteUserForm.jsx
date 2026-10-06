import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="font-heading text-lg font-semibold text-danger-700">
                    Supprimer mon compte
                </h2>

                <p className="mt-1 text-sm text-ui-muted">
                    La suppression est définitive : vos annonces, vos photos et
                    toutes vos données seront effacées. Conservez au préalable
                    les informations que vous souhaitez garder.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Supprimer mon compte
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="font-heading text-lg font-semibold text-ui-text">
                        Supprimer définitivement votre compte ?
                    </h2>

                    <p className="mt-1 text-sm text-ui-muted">
                        Toutes vos données seront effacées et cette action est
                        irréversible. Saisissez votre mot de passe pour
                        confirmer.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Mot de passe"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-full sm:w-3/4"
                            isFocused
                            placeholder="Mot de passe"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Annuler
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Supprimer
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
