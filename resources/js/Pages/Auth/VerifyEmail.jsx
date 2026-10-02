import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Vérification de l'e-mail" />

            <div className="mb-4 text-sm text-ink-soft">
                Merci pour votre inscription ! Avant de commencer, confirmez
                votre adresse e-mail en cliquant sur le lien que nous venons de
                vous envoyer. Vous ne l'avez pas reçu ? Nous pouvons vous en
                renvoyer un.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-input bg-success-bg p-3 text-sm font-medium text-success-ink">
                    Un nouveau lien de vérification a été envoyé à l'adresse
                    e-mail indiquée lors de votre inscription.
                </div>
            )}

            <form onSubmit={submit}>
                <PrimaryButton className="w-full" disabled={processing}>
                    Renvoyer l'e-mail de vérification
                </PrimaryButton>

                <div className="mt-4 text-center">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded text-sm text-ink underline underline-offset-2 hover:text-accent-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    >
                        Se déconnecter
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
