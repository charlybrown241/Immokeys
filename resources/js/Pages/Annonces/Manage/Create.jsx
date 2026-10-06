import {
    EMPTY_DETAILS,
    GENERAL_FIELDS,
    GeneralFields,
    HOUSING_FIELDS,
    HousingFields,
    LOCATION_FIELDS,
    LocationFields,
    missingFields,
    missingMessage,
} from '@/Components/annonces/AnnonceFields';
import PhotoPicker from '@/Components/annonces/PhotoPicker';
import PageHeading from '@/Components/dashboard/PageHeading';
import { Alert, Button, Card, cx, focusRing } from '@/Components/ui';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatMad } from '@/utils/format';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Check, Info, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const STEPS = [
    { id: 1, label: 'Infos générales', fields: GENERAL_FIELDS },
    { id: 2, label: 'Logement', fields: HOUSING_FIELDS },
    { id: 3, label: 'Localisation & prix', fields: LOCATION_FIELDS },
    { id: 4, label: 'Photos', fields: [] },
];

function Stepper({ current, onGoTo }) {
    return (
        <ol className="flex items-center gap-2 sm:gap-3">
            {STEPS.map((step, index) => {
                const state = step.id < current ? 'done' : step.id === current ? 'active' : 'upcoming';
                const circle = (
                    <span
                        className={cx(
                            'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                            state === 'done' && 'bg-gold-50 text-gold-700',
                            state === 'active' && 'bg-navy-900 text-white',
                            state === 'upcoming' && 'bg-ui-bg text-ui-muted ring-1 ring-inset ring-ui-border',
                        )}
                    >
                        {state === 'done' ? <Check size={16} aria-hidden="true" /> : step.id}
                    </span>
                );
                const label = (
                    <span
                        className={cx(
                            'text-sm leading-tight sm:whitespace-nowrap',
                            state === 'active' ? 'font-semibold text-navy-900' : 'hidden text-ui-muted sm:inline',
                        )}
                    >
                        {step.label}
                        {state === 'done' && <span className="sr-only"> (terminée)</span>}
                    </span>
                );

                return (
                    <li
                        key={step.id}
                        aria-current={state === 'active' ? 'step' : undefined}
                        className={cx('flex items-center gap-2 sm:gap-3', index < STEPS.length - 1 && 'flex-1', state === 'active' && 'min-w-0')}
                    >
                        {state === 'done' ? (
                            // Completed steps can be revisited.
                            <button
                                type="button"
                                onClick={() => onGoTo(step.id)}
                                className={cx('flex items-center gap-2 rounded-full pr-1 sm:gap-3', focusRing)}
                            >
                                {circle}
                                {label}
                            </button>
                        ) : (
                            <>
                                {circle}
                                {label}
                            </>
                        )}
                        {index < STEPS.length - 1 && <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-ui-border" />}
                    </li>
                );
            })}
        </ol>
    );
}

export default function Create({ categories, amenities }) {
    const [step, setStep] = useState(1);
    const [clientErrors, setClientErrors] = useState({});
    const [pendingFocus, setPendingFocus] = useState(null);

    const refs = {
        title: useRef(null),
        category_id: useRef(null),
        description: useRef(null),
        quartier: useRef(null),
        surface: useRef(null),
        rooms: useRef(null),
        is_furnished: useRef(null),
        available_from: useRef(null),
        amenities: useRef(null),
        price: useRef(null),
        charges: useRef(null),
        deposit: useRef(null),
    };
    const headingRef = useRef(null);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        title: '',
        category_id: '',
        description: '',
        quartier: '',
        surface: '',
        price: '',
        ...EMPTY_DETAILS,
        photos: [],
    });

    // Server errors win; local "required" checks fill the gaps.
    const fieldErrors = { ...clientErrors, ...errors };
    const photoErrors = Object.entries(errors)
        .filter(([key]) => key === 'photos' || key.startsWith('photos.'))
        .map(([, message]) => message);

    const update = (field, value) => {
        setData(field, value);
        clearErrors(field);
        setClientErrors(({ [field]: _removed, ...rest }) => rest);
    };

    // After a step change, focus the field to fix, or the step title.
    // Skipped on first render: the title field has autoFocus.
    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            return;
        }
        if (pendingFocus && refs[pendingFocus]?.current) {
            refs[pendingFocus].current.focus();
        } else {
            headingRef.current?.focus();
        }
        setPendingFocus(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    const goTo = (target, focusField = null) => {
        setPendingFocus(focusField);
        setStep(target);
    };

    const next = () => {
        const missing = missingFields(data, STEPS[step - 1].fields);
        if (missing.length) {
            setClientErrors(Object.fromEntries(missing.map((field) => [field, missingMessage(field)])));
            refs[missing[0]].current?.focus();
            return;
        }
        goTo(step + 1);
    };

    const submit = (e) => {
        e.preventDefault();
        if (step < STEPS.length) {
            next();
            return;
        }

        post(route('annonces.store'), {
            forceFormData: true,
            onError: (formErrors) => {
                // Send the owner back to the first step holding an error.
                const hasError = (field) => formErrors[field] || Object.keys(formErrors).some((key) => key.startsWith(`${field}.`));
                const target = STEPS.find((s) => s.fields.some(hasError));
                if (target && target.id !== step) {
                    goTo(target.id, target.fields.find(hasError));
                } else if (target) {
                    refs[target.fields.find(hasError)].current?.focus();
                }
            },
        });
    };

    const category = categories.find((item) => String(item.id) === String(data.category_id));

    return (
        <DashboardLayout header={<PageHeading title="Publier une annonce" subtitle="Quatre étapes, environ cinq minutes." />}>
            <Head title="Nouvelle annonce" />

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <Card padding="lg">
                    <Stepper current={step} onGoTo={(target) => goTo(target)} />

                    <form onSubmit={submit} noValidate className="mt-8">
                        <h2 ref={headingRef} tabIndex={-1} className="font-heading text-xl font-bold text-navy-900 focus:outline-none">
                            <span className="sr-only">
                                Étape {step} sur {STEPS.length} :{' '}
                            </span>
                            {STEPS[step - 1].label}
                        </h2>

                        <div className="mt-5">
                            {step === 1 && (
                                <GeneralFields
                                    data={data}
                                    setData={update}
                                    errors={fieldErrors}
                                    categories={categories}
                                    refs={refs}
                                    autoFocus={!mounted.current}
                                />
                            )}
                            {step === 2 && (
                                <HousingFields data={data} setData={update} errors={fieldErrors} refs={refs} amenities={amenities} />
                            )}
                            {step === 3 && <LocationFields data={data} setData={update} errors={fieldErrors} refs={refs} />}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <PhotoPicker files={data.photos} onChange={(files) => update('photos', files)} serverErrors={photoErrors} />

                                    <div className="rounded-card border border-ui-border bg-ui-bg p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-ui-muted">Récapitulatif</p>
                                        <p className="mt-2 font-heading text-lg font-bold text-navy-900">{data.title}</p>
                                        <p className="text-sm text-ui-text">
                                            {[
                                                category?.name,
                                                data.quartier,
                                                data.surface && `${data.surface} m²`,
                                                data.rooms && `${data.rooms} pièce${data.rooms > 1 ? 's' : ''}`,
                                                data.is_furnished === '1' ? 'Meublé' : data.is_furnished === '0' ? 'Non meublé' : null,
                                            ]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </p>
                                        {data.price !== '' && (
                                            <p className="mt-1 font-semibold text-ui-text">
                                                {formatMad(data.price)} / mois
                                                {data.charges !== '' && Number(data.charges) > 0 && (
                                                    <span className="font-normal text-ui-muted"> + {formatMad(data.charges)} de charges</span>
                                                )}
                                            </p>
                                        )}
                                        {data.amenities.length > 0 && (
                                            <p className="mt-1 text-sm text-ui-muted">
                                                {data.amenities.map((key) => amenities[key]).join(', ')}
                                            </p>
                                        )}
                                    </div>

                                    <Alert variant="info" icon={Info}>
                                        L'annonce est créée avec le statut « En attente ». Passe-la en « Disponible » depuis sa page de
                                        modification quand elle est prête à être vue par les étudiants.
                                    </Alert>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-ui-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                            {step === 1 ? (
                                <Button as={Link} href={route('annonces.mine')} variant="ghost">
                                    Annuler
                                </Button>
                            ) : (
                                <Button variant="outline" icon={ArrowLeft} onClick={() => goTo(step - 1)} disabled={processing}>
                                    Précédent
                                </Button>
                            )}

                            {step < STEPS.length ? (
                                <Button type="submit" iconRight={ArrowRight}>
                                    Suivant
                                </Button>
                            ) : (
                                <Button type="submit" icon={Send} loading={processing}>
                                    {processing ? 'Publication…' : "Publier l'annonce"}
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>
            </div>
        </DashboardLayout>
    );
}
