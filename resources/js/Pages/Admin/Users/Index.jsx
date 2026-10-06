import PageHeading from '@/Components/dashboard/PageHeading';
import { Button } from '@/Components/ui';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Ban, RotateCcw } from 'lucide-react';

const ROLE_LABELS = {
    etudiant: 'Étudiant',
    proprietaire: 'Propriétaire',
    admin: 'Admin',
};

export default function Index({ users }) {
    const { auth, flash } = usePage().props;

    const toggleActive = (user) => {
        router.post(route('admin.users.toggle-active', user.id));
    };

    return (
        <DashboardLayout
            header={<PageHeading title="Utilisateurs" subtitle="Comptes étudiants, propriétaires et administrateurs" />}
        >
            <Head title="Utilisateurs" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded-field bg-success-50 p-4 text-sm text-success-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-x-auto bg-white shadow-sm sm:rounded-card">
                        <table className="min-w-full divide-y divide-ui-border">
                            <thead className="bg-ui-bg">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Nom
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Rôle
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Vérification
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Compte
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-ui-muted">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ui-border bg-white">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-ui-text">
                                            {user.name}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-ui-muted">
                                            {user.email}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-ui-text">
                                            {ROLE_LABELS[user.role] ??
                                                user.role}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            {user.role === 'proprietaire' ? (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        user.is_verified
                                                            ? 'bg-gold-50 text-gold-700'
                                                            : 'bg-warning-50 text-warning-700'
                                                    }`}
                                                >
                                                    {user.is_verified
                                                        ? 'Certifié'
                                                        : 'Non certifié'}
                                                </span>
                                            ) : (
                                                <span className="text-ui-muted">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    user.is_active
                                                        ? 'bg-success-50 text-success-700'
                                                        : 'bg-danger-50 text-danger-700'
                                                }`}
                                            >
                                                {user.is_active
                                                    ? 'Actif'
                                                    : 'Désactivé'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            {user.id === auth.user.id ? (
                                                <span className="text-xs text-ui-muted">
                                                    Votre compte
                                                </span>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant={user.is_active ? 'outline' : 'secondary'}
                                                    icon={user.is_active ? Ban : RotateCcw}
                                                    onClick={() => toggleActive(user)}
                                                >
                                                    {user.is_active ? 'Désactiver' : 'Réactiver'}
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {users.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-3 text-center text-sm text-ui-muted"
                                        >
                                            Aucun utilisateur.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
