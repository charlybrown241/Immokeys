import ActivityAreaChart from '@/Components/charts/ActivityAreaChart';
import RankingBars from '@/Components/charts/RankingBars';
import StatusDonut from '@/Components/charts/StatusDonut';
import ContactStatusMenu from '@/Components/dashboard/ContactStatusMenu';
import FlashMessages from '@/Components/dashboard/FlashMessages';
import PageHeading from '@/Components/dashboard/PageHeading';
import Panel from '@/Components/dashboard/Panel';
import { Alert, Avatar, Badge, Button, cx, EmptyState, FilterTabs, focusRing, StatCard } from '@/Components/ui';
import { CHART } from '@/Constants/chart';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatNumber, formatRelative } from '@/utils/format';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, CircleCheck, Eye, MessageCircle, MessageCircleOff, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';

const CERTIFICATION_LABELS = {
    verified: { value: 'Certifiée', hint: 'Ton badge est visible sur tes annonces.' },
    en_attente: { value: 'En attente', hint: 'Notre équipe vérifie ta pièce.' },
    rejete: { value: 'Refusée', hint: 'Envoie un nouveau document.' },
    none: { value: 'À faire', hint: 'Nécessaire pour publier.' },
};

// Weekly totals of the last 8 weeks, for the contacts sparkline.
function weeklyTotals(series) {
    const weeks = [];
    for (let end = series.length; end > 0 && weeks.length < 8; end -= 7) {
        weeks.unshift(series.slice(Math.max(end - 7, 0), end).reduce((sum, point) => sum + point.count, 0));
    }
    return weeks;
}

function CertificationBanner({ isVerified, certification }) {
    if (isVerified) return null;

    if (certification?.status === 'en_attente') {
        return <Alert variant="info">Ta pièce d'identité est en cours de vérification par notre équipe.</Alert>;
    }

    const rejected = certification?.status === 'rejete';

    return (
        <Alert variant={rejected ? 'danger' : 'info'} icon={ShieldCheck} title={rejected ? 'Certification refusée' : 'Certifie ton identité'}>
            {rejected
                ? 'Ta pièce n’a pas pu être validée. Envoie un nouveau document pour pouvoir publier.'
                : 'Envoie ta pièce d’identité (CIN) pour publier tes annonces avec le badge « Identité certifiée ».'}{' '}
            <Link href={route('certification.create')} className={cx('rounded-md font-semibold underline', focusRing)}>
                {rejected ? 'Envoyer un nouveau document' : 'Compléter ma certification'}
            </Link>
        </Alert>
    );
}

function RecentContacts({ contacts }) {
    if (contacts.length === 0) {
        return (
            <EmptyState
                icon={MessageCircleOff}
                title="Aucune demande pour le moment"
                description="Les étudiants qui te contactent sur WhatsApp apparaîtront ici."
                className="border-0 py-8"
            />
        );
    }

    return (
        <ul className="divide-y divide-ui-border">
            {contacts.map((contact) => (
                <li key={contact.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Avatar name={contact.student} size="md" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ui-text">{contact.student}</p>
                        <p className="truncate text-sm text-ui-muted">
                            {contact.annonce ? (
                                <Link href={route('annonces.edit', contact.annonce.id)} className={cx('rounded-md hover:underline', focusRing)}>
                                    {contact.annonce.title}
                                </Link>
                            ) : (
                                'Annonce supprimée'
                            )}
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                        {contact.status === 'traite' ? (
                            <Badge variant="success" icon={CircleCheck}>
                                Traitée
                            </Badge>
                        ) : (
                            <Badge variant="brand" icon={Sparkles}>
                                Nouveau
                            </Badge>
                        )}
                        <time dateTime={contact.created_at} className="text-xs text-ui-muted">
                            {formatRelative(contact.created_at)}
                        </time>
                    </div>
                    <ContactStatusMenu contact={contact} />
                </li>
            ))}
        </ul>
    );
}

const METRICS = {
    views: { label: 'Vues', unit: { one: 'vue', other: 'vues' }, empty: 'Les vues de tes annonces s’afficheront ici dès les premières visites.' },
    contacts: {
        label: 'Contacts WhatsApp',
        unit: { one: 'contact WhatsApp', other: 'contacts WhatsApp' },
        empty: 'Dès qu’un étudiant te contacte, l’évolution s’affichera ici.',
    },
};

export default function Dashboard({ certification, stats, contactsSeries, viewsSeries, recentContacts, annoncesByStatus, topViewed }) {
    const [metric, setMetric] = useState('views');
    const { user } = usePage().props.auth;
    const isVerified = user.is_verified;
    const certificationState = CERTIFICATION_LABELS[isVerified ? 'verified' : certification?.status ?? 'none'];
    const hasContacts = contactsSeries.some((point) => point.count > 0);
    const activitySeries = metric === 'views' ? viewsSeries : contactsSeries;
    const hasActivity = activitySeries.some((point) => point.count > 0);

    const statusItems = [
        { key: 'disponible', label: 'Disponibles', value: annoncesByStatus.disponible, color: CHART.gold },
        { key: 'loue', label: 'Louées', value: annoncesByStatus.loue, color: CHART.indigo },
        { key: 'en_attente', label: 'En attente', value: annoncesByStatus.en_attente, color: CHART.neutral },
    ];
    const annoncesTotal = statusItems.reduce((sum, item) => sum + item.value, 0) + annoncesByStatus.suspendue;

    return (
        <DashboardLayout
            header={
                <PageHeading
                    title="Tableau de bord"
                    subtitle={`Bonjour ${user.name.split(' ')[0]}, voici l'activité de tes annonces.`}
                    actions={
                        isVerified && (
                            <Button as={Link} href={route('annonces.create')} icon={Plus}>
                                Publier une annonce
                            </Button>
                        )
                    }
                />
            }
        >
            <Head title="Tableau de bord" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <FlashMessages />
                <CertificationBanner isVerified={isVerified} certification={certification} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon={Building2} label="Annonces actives" value={stats.activeAnnoncesCount} hint="Disponibles et visibles" />
                    <StatCard
                        icon={MessageCircle}
                        label="Contacts WhatsApp reçus"
                        value={formatNumber(stats.contactsCount)}
                        delta={stats.contactsDelta ?? undefined}
                        deltaLabel="sur 30 j"
                        hint={stats.contactsDelta === null ? `${stats.contactsLast30} ces 30 derniers jours` : undefined}
                        sparkline={hasContacts ? weeklyTotals(contactsSeries) : undefined}
                    />
                    <StatCard
                        icon={Eye}
                        label="Vues ce mois"
                        value={formatNumber(stats.viewsThisMonth)}
                        hint={`${formatNumber(stats.viewsTotal)} depuis la publication`}
                        sparkline={viewsSeries.some((point) => point.count > 0) ? weeklyTotals(viewsSeries) : undefined}
                    />
                    <StatCard icon={ShieldCheck} label="Certification" value={certificationState.value} hint={certificationState.hint} />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Panel
                        title="Activité de mes annonces"
                        description="Par jour, sur toutes tes annonces"
                        className="lg:col-span-2"
                        action={
                            <FilterTabs
                                label="Mesure affichée"
                                value={metric}
                                onChange={setMetric}
                                items={Object.entries(METRICS).map(([key, { label }]) => ({ key, label }))}
                                className="mx-0 px-0"
                            />
                        }
                    >
                        {hasActivity ? (
                            <ActivityAreaChart key={metric} series={activitySeries} unit={METRICS[metric].unit} />
                        ) : (
                            <EmptyState
                                icon={metric === 'views' ? Eye : MessageCircleOff}
                                title={metric === 'views' ? 'Pas encore de vue' : 'Pas encore de contact'}
                                description={METRICS[metric].empty}
                                className="border-0 py-10"
                            />
                        )}
                    </Panel>

                    <Panel title="Mes annonces" description="Répartition par statut">
                        {annoncesTotal > 0 ? (
                            <>
                                <StatusDonut items={statusItems} />
                                {annoncesByStatus.suspendue > 0 && (
                                    <p className="mt-4 text-xs text-ui-muted">
                                        + {annoncesByStatus.suspendue} suspendue{annoncesByStatus.suspendue > 1 ? 's' : ''} par l'administrateur
                                    </p>
                                )}
                            </>
                        ) : (
                            <EmptyState
                                icon={Building2}
                                title="Aucune annonce"
                                description="Publie ton premier logement."
                                className="border-0 py-8"
                            />
                        )}
                    </Panel>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Panel
                        title="Demandes récentes"
                        description="Derniers étudiants qui t'ont contacté (hors archivées)"
                        className="lg:col-span-2"
                    >
                        <RecentContacts contacts={recentContacts} />
                    </Panel>

                    <Panel
                        title="Annonces les plus vues"
                        action={
                            <Button as={Link} href={route('annonces.mine')} variant="ghost" size="sm" iconRight={ArrowRight}>
                                Gérer
                            </Button>
                        }
                    >
                        {topViewed.length > 0 ? (
                            <RankingBars
                                unit="vues"
                                items={topViewed.map((annonce) => ({
                                    id: annonce.id,
                                    label: annonce.title,
                                    value: annonce.views_count,
                                    href: route('annonces.edit', annonce.id),
                                    meta: `${annonce.contacts_count} contact${annonce.contacts_count > 1 ? 's' : ''} WhatsApp`,
                                }))}
                            />
                        ) : (
                            <p className="text-sm text-ui-muted">Aucune annonce pour l'instant.</p>
                        )}
                    </Panel>
                </div>
            </div>
        </DashboardLayout>
    );
}
