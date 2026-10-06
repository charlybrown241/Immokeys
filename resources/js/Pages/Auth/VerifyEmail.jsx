import { authLink, AuthHeading } from '@/Components/auth/AuthParts';
import { Alert, Button } from '@/Components/ui';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout>
            <Head title="Vérification de l'e-mail" />

            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                <MailCheck size={24} aria-hidden="true" />
            </span>

            <div className="mt-4">
                <AuthHeading title="Vérifie ta boîte mail">
                    Merci pour ton inscription ! Confirme ton adresse en cliquant sur le lien que nous venons de
                    t'envoyer. Rien reçu ? Nous pouvons t'en renvoyer un.
                </AuthHeading>
            </div>

            {status === 'verification-link-sent' && (
                <Alert variant="success" className="mt-6">
                    Un nouveau lien de vérification a été envoyé à l'adresse indiquée lors de ton inscription.
                </Alert>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
                <Button type="submit" size="lg" loading={processing} className="w-full">
                    {processing ? 'Envoi en cours…' : "Renvoyer l'e-mail de vérification"}
                </Button>

                <p className="text-center text-sm">
                    <Link href={route('logout')} method="post" as="button" className={authLink}>
                        Se déconnecter
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
