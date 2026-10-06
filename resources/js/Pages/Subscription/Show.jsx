import FlashMessages from '@/Components/dashboard/FlashMessages';
import PageHeading from '@/Components/dashboard/PageHeading';
import { Alert, Badge, Button, Card, cx, Dialog } from '@/Components/ui';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatDate } from '@/utils/format';
import { Head, router, usePage } from '@inertiajs/react';
import { BadgeCheck, Check, Clock, Crown, FlaskConical, RefreshCw, Sparkles } from 'lucide-react';
import { useState } from 'react';

const FREE_BENEFITS = ['Toutes les annonces de Casablanca', 'Contact WhatsApp des propriétaires', 'Publicités affichées'];
const PREMIUM_BENEFITS = ['Sans publicité', 'Annonces en tête de liste', 'Support prioritaire'];
const PRO_BENEFITS = ['Badge de confiance sur vos annonces', 'Visibilité accrue auprès des étudiants'];

function isActive(subscription) {
    return !subscription.expires_at || new Date(subscription.expires_at) > new Date();
}

function PlanCard({ icon: Icon, name, benefits, current, status, action, highlight = false }) {
    return (
        <Card
            as="section"
            aria-label={`Formule ${name}`}
            className={cx('flex h-full flex-col', highlight && 'ring-2 ring-gold-600 ring-offset-2 ring-offset-ui-bg')}
        >
            <div className="flex items-start justify-between gap-3">
                <span
                    className={cx(
                        'inline-flex h-11 w-11 items-center justify-center rounded-field',
                        highlight ? 'bg-gold-gradient text-navy-900' : 'bg-ui-bg text-ui-muted',
                    )}
                >
                    <Icon size={22} aria-hidden="true" />
                </span>
                {current && <Badge variant="brand">Plan actuel</Badge>}
            </div>
            <h2 className="mt-4 font-heading text-2xl font-extrabold text-navy-900">{name}</h2>
            {status && <div className="mt-1">{status}</div>}

            <ul className="mt-5 space-y-2.5 border-t border-ui-border pt-5 text-sm text-ui-text">
                {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5">
                        <Check size={16} className="mt-0.5 shrink-0 text-gold-700" aria-hidden="true" />
                        {benefit}
                    </li>
                ))}
            </ul>

            {action && <div className="mt-auto pt-6">{action}</div>}
        </Card>
    );
}

function Validity({ subscription }) {
    if (!subscription.expires_at) return null;
    return isActive(subscription) ? (
        <p className="text-sm text-ui-muted">Valable jusqu'au {formatDate(subscription.expires_at, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    ) : (
        <Badge variant="warning" icon={Clock}>
            Expiré le {formatDate(subscription.expires_at)}
        </Badge>
    );
}

export default function Show({ subscription }) {
    const { auth } = usePage().props;
    const roleName = auth.user.role?.name;
    const isEtudiant = roleName === 'etudiant';
    const isProprietaire = roleName === 'proprietaire';
    const active = isActive(subscription);
    const isPremium = subscription.type === 'premium' && active;

    const [confirming, setConfirming] = useState(false);
    const [processing, setProcessing] = useState(false);

    const confirmAction = () => {
        router.post(
            route(isEtudiant ? 'subscription.upgrade' : 'subscription.renew'),
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => {
                    setProcessing(false);
                    setConfirming(false);
                },
            },
        );
    };

    const premiumExpired = subscription.type === 'premium' && !active;
    const actionLabel = isEtudiant ? (premiumExpired ? 'Renouveler Premium' : 'Passer Premium') : 'Renouveler mon abonnement Pro';

    return (
        <DashboardLayout
            header={
                <PageHeading
                    title="Mon abonnement"
                    subtitle={isEtudiant ? 'Choisis la formule qui te convient.' : 'Ton abonnement propriétaire Pro.'}
                />
            }
        >
            <Head title="Mon abonnement" />

            <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <FlashMessages />

                <Alert variant="info" icon={FlaskConical} title="Paiement simulé">
                    ImmoKeys est en phase de test : aucune transaction réelle n'est effectuée et aucun moyen de paiement n'est
                    demandé.
                </Alert>

                {isEtudiant && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <PlanCard icon={Sparkles} name="Gratuit" benefits={FREE_BENEFITS} current={!isPremium} />
                        <PlanCard
                            icon={Crown}
                            name="Premium"
                            benefits={PREMIUM_BENEFITS}
                            current={isPremium}
                            highlight
                            status={subscription.type === 'premium' && <Validity subscription={subscription} />}
                            action={
                                !isPremium && (
                                    <Button
                                        className="w-full"
                                        icon={premiumExpired ? RefreshCw : Crown}
                                        onClick={() => setConfirming(true)}
                                    >
                                        {actionLabel}
                                    </Button>
                                )
                            }
                        />
                    </div>
                )}

                {isProprietaire && (
                    <div className="mx-auto max-w-md">
                        <PlanCard
                            icon={BadgeCheck}
                            name="Pro"
                            benefits={PRO_BENEFITS}
                            current={active}
                            highlight
                            status={<Validity subscription={subscription} />}
                            action={
                                <Button className="w-full" variant={active ? 'outline' : 'primary'} icon={RefreshCw} onClick={() => setConfirming(true)}>
                                    {actionLabel}
                                </Button>
                            }
                        />
                    </div>
                )}
            </div>

            <Dialog
                open={confirming}
                onClose={() => !processing && setConfirming(false)}
                title={isEtudiant ? (premiumExpired ? 'Renouveler Premium' : "Passer à l'abonnement Premium") : "Renouveler l'abonnement Pro"}
                description={
                    isEtudiant
                        ? 'Premium sera actif pendant un mois.'
                        : "L'abonnement Pro sera prolongé d'un an à partir d'aujourd'hui."
                }
                actions={
                    <>
                        <Button variant="outline" onClick={() => setConfirming(false)} disabled={processing}>
                            Annuler
                        </Button>
                        <Button onClick={confirmAction} loading={processing}>
                            Confirmer
                        </Button>
                    </>
                }
            >
                <Alert variant="info" icon={FlaskConical} className="mt-4">
                    Paiement simulé : aucune transaction réelle n'est effectuée.
                </Alert>
            </Dialog>
        </DashboardLayout>
    );
}
