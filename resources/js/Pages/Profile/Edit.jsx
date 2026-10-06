import FlashMessages from '@/Components/dashboard/FlashMessages';
import PageHeading from '@/Components/dashboard/PageHeading';
import { Avatar, Badge, Button, Card } from '@/Components/ui';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, Clock, Crown, ShieldCheck } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

const ROLE_LABELS = {
    etudiant: 'Étudiant',
    proprietaire: 'Propriétaire',
    admin: 'Administrateur',
};

const PLAN_LABELS = {
    gratuit: 'Gratuit',
    premium: 'Premium',
    pro: 'Pro',
};

function IdentityCard({ user }) {
    const role = user.role?.name;
    const plan = user.subscription?.type;

    return (
        <Card className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar name={user.name} size="lg" />
            <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-xl font-bold text-navy-900">{user.name}</p>
                <p className="truncate text-sm text-ui-muted">{user.email}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="neutral">{ROLE_LABELS[role] ?? role}</Badge>
                    {role === 'proprietaire' &&
                        (user.is_verified ? (
                            <Badge variant="brand" icon={ShieldCheck}>
                                Identité certifiée
                            </Badge>
                        ) : (
                            <Badge variant="warning" icon={Clock}>
                                Identité non certifiée
                            </Badge>
                        ))}
                    {plan && plan !== 'gratuit' && (
                        <Badge variant="navy" icon={plan === 'pro' ? BadgeCheck : Crown}>
                            {PLAN_LABELS[plan] ?? plan}
                        </Badge>
                    )}
                </div>
            </div>
            {role === 'proprietaire' && !user.is_verified && (
                <Button as={Link} href={route('certification.create')} variant="outline" size="sm" iconRight={ArrowRight}>
                    Certifier mon identité
                </Button>
            )}
            {(role === 'etudiant' || role === 'proprietaire') && (user.is_verified || role === 'etudiant') && (
                <Button as={Link} href={route('subscription.show')} variant="ghost" size="sm" iconRight={ArrowRight}>
                    Mon abonnement
                </Button>
            )}
        </Card>
    );
}

export default function Edit({ mustVerifyEmail, status }) {
    const { user } = usePage().props.auth;

    return (
        <DashboardLayout header={<PageHeading title="Mon profil" subtitle="Tes informations personnelles et la sécurité de ton compte." />}>
            <Head title="Mon profil" />

            <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <FlashMessages />
                <IdentityCard user={user} />
                <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                <UpdatePasswordForm />
                <DeleteUserForm />
            </div>
        </DashboardLayout>
    );
}
