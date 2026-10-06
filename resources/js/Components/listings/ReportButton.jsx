import { Button, cx, Dialog, focusRing, Textarea } from '@/Components/ui';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Flag } from 'lucide-react';
import { useState } from 'react';

const linkClasses = cx(
    'inline-flex items-center gap-1.5 rounded-md text-sm text-ui-muted underline-offset-4 hover:text-navy-900 hover:underline',
    focusRing,
);

/**
 * "Signaler l'annonce": a reason (radio list) and an optional message,
 * required for "Autre". Guests are sent to the login page.
 */
export default function ReportButton({ annonceId, reasons }) {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({ reason: '', message: '' });

    if (!auth.user) {
        return (
            <Link href={route('login')} className={linkClasses}>
                <Flag size={15} aria-hidden="true" />
                Signaler l'annonce
            </Link>
        );
    }

    const close = () => {
        setOpen(false);
        reset();
        clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('annonces.report', annonceId), { preserveScroll: true, onSuccess: close });
    };

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className={linkClasses}>
                <Flag size={15} aria-hidden="true" />
                Signaler l'annonce
            </button>

            <Dialog
                open={open}
                onClose={() => !processing && close()}
                title="Signaler cette annonce"
                description="Notre équipe vérifie chaque signalement. Le propriétaire ne voit pas qui a signalé."
            >
                <form onSubmit={submit} noValidate className="mt-5 space-y-5">
                    <fieldset aria-describedby={errors.reason ? 'report-reason-error' : undefined}>
                        <legend className="mb-2 text-sm font-medium text-ui-text">Raison</legend>
                        <div className="space-y-2">
                            {Object.entries(reasons).map(([key, label]) => (
                                <label
                                    key={key}
                                    className={cx(
                                        'flex cursor-pointer items-center gap-3 rounded-field border px-3 py-2.5 text-sm transition',
                                        data.reason === key ? 'border-navy-900 bg-gold-50' : 'border-ui-border hover:border-navy-900/40',
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={key}
                                        checked={data.reason === key}
                                        onChange={() => {
                                            setData('reason', key);
                                            clearErrors('reason');
                                        }}
                                        className="h-4 w-4 border-ui-border text-navy-900 focus:ring-2 focus:ring-gold-700 focus:ring-offset-2"
                                    />
                                    <span className="text-ui-text">{label}</span>
                                </label>
                            ))}
                        </div>
                        {errors.reason && (
                            <p id="report-reason-error" className="mt-1.5 text-sm text-danger-700">
                                {errors.reason}
                            </p>
                        )}
                    </fieldset>

                    <Textarea
                        id="report-message"
                        label={data.reason === 'autre' ? 'Précisions' : 'Précisions (optionnel)'}
                        required={data.reason === 'autre'}
                        rows={3}
                        maxLength={1000}
                        value={data.message}
                        onChange={(e) => {
                            setData('message', e.target.value);
                            clearErrors('message');
                        }}
                        error={errors.message}
                    />

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="outline" onClick={close} disabled={processing}>
                            Annuler
                        </Button>
                        <Button type="submit" variant="secondary" icon={Flag} loading={processing}>
                            Envoyer le signalement
                        </Button>
                    </div>
                </form>
            </Dialog>
        </>
    );
}
