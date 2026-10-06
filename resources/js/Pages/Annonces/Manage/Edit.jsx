import {
    detailsFromAnnonce,
    GENERAL_FIELDS,
    GeneralFields,
    HOUSING_FIELDS,
    HousingFields,
    LOCATION_FIELDS,
    LocationFields,
} from '@/Components/annonces/AnnonceFields';
import PhotoManager from '@/Components/annonces/PhotoManager';
import FlashMessages from '@/Components/dashboard/FlashMessages';
import PageHeading from '@/Components/dashboard/PageHeading';
import Panel from '@/Components/dashboard/Panel';
import { Alert, Button, Select } from '@/Components/ui';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Ban, Eye, Save, ToggleRight } from 'lucide-react';
import { useRef } from 'react';

const STATUS_OPTIONS = [
    { value: 'en_attente', label: 'En attente' },
    { value: 'disponible', label: 'Disponible' },
    { value: 'loue', label: 'Louée' },
];

const STATUS_HINTS = {
    en_attente: "Invisible pour les étudiants tant qu'elle n'est pas disponible.",
    disponible: 'Visible dans la recherche, les étudiants peuvent te contacter.',
    loue: 'Reste consultable, mais le contact WhatsApp est désactivé.',
};

export default function Edit({ annonce, categories, amenities }) {
    const refs = {
        status: useRef(null),
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

    const { data, setData, put, processing, errors, clearErrors } = useForm({
        title: annonce.title,
        category_id: annonce.category_id,
        description: annonce.description,
        quartier: annonce.quartier,
        surface: annonce.surface ?? '',
        price: annonce.price,
        ...detailsFromAnnonce(annonce),
        status: annonce.status,
    });

    const update = (field, value) => {
        setData(field, value);
        clearErrors(field);
    };

    const submit = (e) => {
        e.preventDefault();

        put(route('annonces.update', annonce.id), {
            onError: (formErrors) => {
                const first = ['status', ...GENERAL_FIELDS, ...HOUSING_FIELDS, ...LOCATION_FIELDS].find(
                    (field) => formErrors[field] || Object.keys(formErrors).some((key) => key.startsWith(`${field}.`)),
                );
                refs[first]?.current?.focus();
            },
        });
    };

    const isPublic = annonce.status !== 'en_attente' && !annonce.is_suspended;
    const photos = [...(annonce.photos ?? [])].sort((a, b) => a.ordre - b.ordre);

    return (
        <DashboardLayout
            header={
                <PageHeading
                    title="Modifier l'annonce"
                    subtitle={annonce.title}
                    actions={
                        isPublic && (
                            <Button as={Link} href={route('annonces.show', annonce.id)} variant="outline" icon={Eye}>
                                Voir l'annonce
                            </Button>
                        )
                    }
                />
            }
        >
            <Head title="Modifier l'annonce" />

            <form onSubmit={submit} noValidate className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <FlashMessages />

                {annonce.is_suspended && (
                    <Alert variant="danger" icon={Ban} title="Annonce suspendue par l'administrateur">
                        Elle reste masquée aux étudiants, même si tu la passes en « Disponible ». Contacte-nous pour en savoir plus.
                    </Alert>
                )}

                <Panel title="Statut" description="Contrôle la visibilité de l'annonce.">
                    <Select
                        ref={refs.status}
                        id="status"
                        label="Statut de l'annonce"
                        icon={ToggleRight}
                        options={STATUS_OPTIONS}
                        value={data.status}
                        onChange={(e) => update('status', e.target.value)}
                        hint={STATUS_HINTS[data.status]}
                        error={errors.status}
                    />
                </Panel>

                <Panel title="Infos générales">
                    <GeneralFields data={data} setData={update} errors={errors} categories={categories} refs={refs} />
                </Panel>

                <Panel title="Logement">
                    <HousingFields data={data} setData={update} errors={errors} refs={refs} amenities={amenities} />
                </Panel>

                <Panel title="Localisation & prix">
                    <LocationFields data={data} setData={update} errors={errors} refs={refs} />
                </Panel>

                <Panel title="Photos" description="Les changements de photos sont enregistrés immédiatement.">
                    <PhotoManager annonceId={annonce.id} photos={photos} />
                </Panel>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button as={Link} href={route('annonces.mine')} variant="ghost">
                        Annuler
                    </Button>
                    <Button type="submit" icon={Save} loading={processing}>
                        {processing ? 'Enregistrement…' : 'Enregistrer les modifications'}
                    </Button>
                </div>
            </form>
        </DashboardLayout>
    );
}
