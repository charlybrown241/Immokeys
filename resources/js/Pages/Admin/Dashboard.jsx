import FlashMessages from '@/Components/dashboard/FlashMessages';
import PageHeading from '@/Components/dashboard/PageHeading';
import Panel from '@/Components/dashboard/Panel';
import AnnonceModerationList from '@/Components/admin/AnnonceModerationList';
import CertificationQueue from '@/Components/admin/CertificationQueue';
import { Button, StatCard } from '@/Components/ui';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatNumber } from '@/utils/format';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Building2, FileCheck2, ShieldAlert, Users } from 'lucide-react';

export default function AdminDashboard({ stats, certifications, annonces }) {
    const students = stats.usersByRole?.etudiant ?? 0;
    const owners = stats.usersByRole?.proprietaire ?? 0;

    return (
        <DashboardLayout header={<PageHeading title="Administration" subtitle="Vue d'ensemble de la plateforme" />}>
            <Head title="Administration" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <FlashMessages />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        icon={Users}
                        label="Utilisateurs"
                        value={formatNumber(stats.usersCount)}
                        hint={`${formatNumber(students)} étudiants · ${formatNumber(owners)} propriétaires`}
                    />
                    <StatCard
                        icon={Building2}
                        label="Annonces en attente"
                        value={formatNumber(stats.pendingAnnoncesCount)}
                        hint={`Sur ${formatNumber(stats.annoncesCount)} annonces`}
                    />
                    <StatCard
                        icon={FileCheck2}
                        label="Certifications en attente"
                        value={formatNumber(stats.pendingCertificationsCount)}
                        hint="Pièces d'identité à vérifier"
                    />
                    <StatCard
                        icon={ShieldAlert}
                        label="Annonces suspendues"
                        value={formatNumber(stats.suspendedAnnoncesCount)}
                        hint="Masquées aux étudiants"
                    />
                </div>

                <Panel
                    title="File de certification d'identité"
                    description="Demandes en attente en premier"
                    action={
                        <Button as={Link} href={route('admin.certifications.index')} variant="ghost" size="sm" iconRight={ArrowRight}>
                            Tout voir
                        </Button>
                    }
                >
                    <CertificationQueue certifications={certifications} />
                </Panel>

                <Panel
                    title="Modération des annonces"
                    description="Dernières annonces publiées"
                    action={
                        <Button as={Link} href={route('admin.annonces.index')} variant="ghost" size="sm" iconRight={ArrowRight}>
                            Toute la modération
                        </Button>
                    }
                >
                    <AnnonceModerationList annonces={annonces} />
                </Panel>
            </div>
        </DashboardLayout>
    );
}
