import FlashMessages from '@/Components/dashboard/FlashMessages';
import PageHeading from '@/Components/dashboard/PageHeading';
import Panel from '@/Components/dashboard/Panel';
import { Alert, Button, Card, cx, Input } from '@/Components/ui';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatDate } from '@/utils/format';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BadgeCheck, Clock, FileText, IdCard, Lock, Phone, Plus, Send, ShieldCheck, Upload, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

// Mirrors CertificationStoreRequest: jpg/png/pdf, 5 MB.
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const STEPS = [
    { icon: IdCard, title: 'Envoie ta CIN', text: 'Photo ou scan lisible, recto de la carte.' },
    { icon: ShieldCheck, title: 'Vérification', text: 'Notre équipe contrôle le document à la main.' },
    { icon: BadgeCheck, title: 'Badge et publication', text: 'Tu peux publier, avec le badge « Identité certifiée ».' },
];

function formatSize(bytes) {
    return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} Mo` : `${Math.round(bytes / 1024)} Ko`;
}

function Process({ current }) {
    return (
        <ol className="grid gap-4 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, index) => {
                const done = index < current;
                const active = index === current;
                return (
                    <li key={title} aria-current={active ? 'step' : undefined} className="flex gap-3 sm:flex-col">
                        <span
                            className={cx(
                                'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
                                done && 'bg-gold-50 text-gold-700',
                                active && 'bg-navy-900 text-gold-300',
                                !done && !active && 'bg-ui-bg text-ui-muted ring-1 ring-inset ring-ui-border',
                            )}
                        >
                            <Icon size={20} aria-hidden="true" />
                        </span>
                        <div>
                            <p className={cx('font-heading font-bold', active ? 'text-navy-900' : 'text-ui-text')}>
                                {index + 1}. {title}
                                {done && <span className="sr-only"> (terminé)</span>}
                            </p>
                            <p className="mt-0.5 text-sm text-ui-muted">{text}</p>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

// Single document picker with preview (image) or file card (PDF).
function DocumentField({ file, onChange, error, inputRef }) {
    const id = useId();
    const [preview, setPreview] = useState(null);
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        if (!file || !file.type.startsWith('image/')) {
            setPreview(null);
            return undefined;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const pick = (event) => {
        const picked = event.target.files?.[0];
        event.target.value = '';
        if (!picked) return;
        if (!TYPES.includes(picked.type)) {
            setLocalError('Format non accepté : JPG, PNG ou PDF.');
            return;
        }
        if (picked.size > MAX_BYTES) {
            setLocalError('Le document dépasse 5 Mo.');
            return;
        }
        setLocalError(null);
        onChange(picked);
    };

    const message = localError ?? error;

    return (
        <div>
            <p id={`${id}-label`} className="mb-1.5 text-sm font-medium text-ui-text">
                Pièce d'identité (CIN)
                <span className="ml-0.5 text-danger-700" aria-hidden="true">*</span>
            </p>

            {file ? (
                <div className="flex items-center gap-4 rounded-card border border-ui-border bg-white p-3">
                    {preview ? (
                        <img src={preview} alt="Aperçu de la pièce d'identité" className="h-16 w-24 shrink-0 rounded-field object-cover" />
                    ) : (
                        <span className="inline-flex h-16 w-24 shrink-0 items-center justify-center rounded-field bg-gold-50 text-gold-700">
                            <FileText size={28} aria-hidden="true" />
                        </span>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ui-text">{file.name}</p>
                        <p className="text-xs text-ui-muted">{formatSize(file.size)}</p>
                    </div>
                    <Button variant="ghost" size="sm" icon={X} onClick={() => onChange(null)}>
                        Retirer
                    </Button>
                </div>
            ) : (
                <label
                    htmlFor={id}
                    className={cx(
                        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed bg-white px-6 py-8 text-center transition hover:border-navy-900 hover:bg-ui-bg',
                        'focus-within:ring-2 focus-within:ring-gold-600 focus-within:ring-offset-2',
                        message ? 'border-danger' : 'border-ui-border',
                    )}
                >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                        <Upload size={22} aria-hidden="true" />
                    </span>
                    <span className="font-semibold text-navy-900">Choisir un fichier</span>
                    <span className="text-sm text-ui-muted">JPG, PNG ou PDF · 5 Mo max</span>
                    <input
                        ref={inputRef}
                        id={id}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={pick}
                        aria-labelledby={`${id}-label`}
                        aria-invalid={message ? true : undefined}
                        aria-describedby={message ? `${id}-error` : undefined}
                        className="sr-only"
                    />
                </label>
            )}

            {message && (
                <p id={`${id}-error`} className="mt-1.5 text-sm text-danger-700">
                    {message}
                </p>
            )}
        </div>
    );
}

export default function Create({ certification }) {
    const { auth } = usePage().props;
    const phoneRef = useRef(null);
    const documentRef = useRef(null);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        phone: auth.user.phone ?? '',
        document: null,
    });

    const alreadyCertified = auth.user.is_verified || certification?.status === 'approuve';
    const isPending = !alreadyCertified && certification?.status === 'en_attente';
    const isRejected = !alreadyCertified && certification?.status === 'rejete';
    const currentStep = alreadyCertified ? 3 : isPending ? 1 : 0;

    const submit = (e) => {
        e.preventDefault();

        post(route('certification.store'), {
            forceFormData: true,
            onError: (formErrors) => (formErrors.phone ? phoneRef : documentRef).current?.focus(),
        });
    };

    return (
        <DashboardLayout
            header={<PageHeading title="Certification d'identité" subtitle="Obligatoire pour publier des annonces." />}
        >
            <Head title="Certification d'identité" />

            <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <FlashMessages />

                <Card>
                    <Process current={currentStep} />
                </Card>

                {alreadyCertified && (
                    <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                            <ShieldCheck size={24} aria-hidden="true" />
                        </span>
                        <div className="flex-1">
                            <p className="font-heading text-lg font-bold text-navy-900">Ton identité est certifiée</p>
                            <p className="text-sm text-ui-muted">
                                {certification?.approved_at
                                    ? `Validée le ${formatDate(certification.approved_at)}. `
                                    : ''}
                                Le badge « Identité certifiée » s'affiche sur tes annonces.
                            </p>
                        </div>
                        <Button as={Link} href={route('annonces.create')} icon={Plus}>
                            Publier une annonce
                        </Button>
                    </Card>
                )}

                {isPending && (
                    <Card className="flex items-start gap-4">
                        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warning-50 text-warning-700">
                            <Clock size={24} aria-hidden="true" />
                        </span>
                        <div>
                            <p className="font-heading text-lg font-bold text-navy-900">Vérification en cours</p>
                            <p className="text-sm text-ui-muted">
                                Envoyée le {formatDate(certification.created_at)}. Notre équipe vérifie ta pièce ; le
                                statut se met à jour ici et sur ton tableau de bord.
                            </p>
                        </div>
                    </Card>
                )}

                {!alreadyCertified && !isPending && (
                    <Panel
                        title={isRejected ? 'Envoyer un nouveau document' : 'Envoyer ma pièce d\'identité'}
                        description="Ton numéro sert aussi au contact WhatsApp avec les étudiants."
                    >
                        {isRejected && (
                            <Alert variant="danger" title="Ta précédente pièce a été refusée" className="mb-5">
                                Elle était peut-être illisible ou incomplète. Envoie une photo nette de ta CIN en entier.
                            </Alert>
                        )}

                        <form onSubmit={submit} noValidate className="space-y-5">
                            <Input
                                ref={phoneRef}
                                id="phone"
                                type="tel"
                                name="phone"
                                label="Numéro de téléphone (WhatsApp)"
                                icon={Phone}
                                placeholder="+212 6 12 34 56 78"
                                hint="Chiffres, espaces et « + » uniquement."
                                autoComplete="tel"
                                required
                                maxLength={30}
                                value={data.phone}
                                onChange={(e) => {
                                    setData('phone', e.target.value);
                                    clearErrors('phone');
                                }}
                                error={errors.phone}
                            />

                            <DocumentField
                                file={data.document}
                                inputRef={documentRef}
                                onChange={(file) => {
                                    setData('document', file);
                                    clearErrors('document');
                                }}
                                error={errors.document}
                            />

                            <p className="flex items-start gap-2 text-sm text-ui-muted">
                                <Lock size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                                Ton document est conservé dans un espace privé et n'est consulté que par l'équipe de vérification.
                            </p>

                            <div className="flex justify-end">
                                <Button type="submit" icon={Send} loading={processing}>
                                    {processing ? 'Envoi…' : 'Envoyer pour vérification'}
                                </Button>
                            </div>
                        </form>
                    </Panel>
                )}
            </div>
        </DashboardLayout>
    );
}
