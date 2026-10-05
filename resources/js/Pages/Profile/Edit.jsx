import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <DashboardLayout
            header={
                <h2 className="font-display text-2xl font-semibold leading-tight text-ink">
                    Mon profil
                </h2>
            }
        >
            <Head title="Mon profil" />

            <div className="py-10">
                <div className="mx-auto max-w-3xl space-y-6 px-4 md:px-7">
                    <div className="rounded-card bg-surface p-5 shadow-card sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="rounded-card bg-surface p-5 shadow-card sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="rounded-card border border-red-200 bg-surface p-5 shadow-card sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
