import { Checkbox, Input, Select, Textarea } from '@/Components/ui';
import { QUARTIERS } from '@/Constants/quartiers';
import { BedDouble, Building2, CalendarDays, House, MapPin, Maximize2, Receipt, ShieldCheck, Sofa, Type, Wallet } from 'lucide-react';

// Field groups shared by the create wizard and the edit form. `refs` maps
// a field name to a ref so pages can focus the first rejected field.

export const GENERAL_FIELDS = ['title', 'category_id', 'description'];
export const HOUSING_FIELDS = ['surface', 'rooms', 'is_furnished', 'available_from', 'amenities'];
export const LOCATION_FIELDS = ['quartier', 'price', 'charges', 'deposit'];

export const EMPTY_DETAILS = {
    rooms: '',
    is_furnished: '',
    available_from: '',
    charges: '',
    deposit: '',
    amenities: [],
};

const FURNISHED_OPTIONS = [
    { value: '1', label: 'Meublé' },
    { value: '0', label: 'Non meublé' },
];

export function GeneralFields({ data, setData, errors, categories, refs, autoFocus = false }) {
    return (
        <div className="space-y-5">
            <Input
                ref={refs.title}
                id="title"
                label="Titre de l'annonce"
                icon={Type}
                placeholder="Ex. Studio meublé près de la faculté"
                hint="Court et précis : type de logement et atout principal."
                maxLength={255}
                required
                autoFocus={autoFocus}
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                error={errors.title}
            />
            <Select
                ref={refs.category_id}
                id="category_id"
                label="Type de logement"
                icon={House}
                placeholder="Choisir un type"
                required
                options={categories.map((category) => ({ value: String(category.id), label: category.name }))}
                value={data.category_id ? String(data.category_id) : ''}
                onChange={(e) => setData('category_id', e.target.value)}
                error={errors.category_id}
            />
            <Textarea
                ref={refs.description}
                id="description"
                label="Description"
                rows={6}
                required
                placeholder="Ambiance, proximité des transports et des facultés, conditions de location…"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                error={errors.description}
            />
        </div>
    );
}

export function HousingFields({ data, setData, errors, refs, amenities }) {
    const toggleAmenity = (key) =>
        setData('amenities', data.amenities.includes(key) ? data.amenities.filter((item) => item !== key) : [...data.amenities, key]);
    const amenityError = errors.amenities ?? Object.entries(errors).find(([key]) => key.startsWith('amenities.'))?.[1];

    return (
        <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <Input
                    ref={refs.surface}
                    id="surface"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    label="Surface (m²)"
                    icon={Maximize2}
                    hint="Optionnel"
                    value={data.surface}
                    onChange={(e) => setData('surface', e.target.value)}
                    error={errors.surface}
                />
                <Input
                    ref={refs.rooms}
                    id="rooms"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="20"
                    label="Nombre de pièces"
                    icon={BedDouble}
                    hint="Optionnel"
                    value={data.rooms}
                    onChange={(e) => setData('rooms', e.target.value)}
                    error={errors.rooms}
                />
                <Select
                    ref={refs.is_furnished}
                    id="is_furnished"
                    label="Ameublement"
                    icon={Sofa}
                    placeholder="Non précisé"
                    options={FURNISHED_OPTIONS}
                    value={data.is_furnished}
                    onChange={(e) => setData('is_furnished', e.target.value)}
                    error={errors.is_furnished}
                />
                <Input
                    ref={refs.available_from}
                    id="available_from"
                    type="date"
                    label="Disponible à partir du"
                    icon={CalendarDays}
                    hint="Laisse vide si disponible tout de suite."
                    value={data.available_from}
                    onChange={(e) => setData('available_from', e.target.value)}
                    error={errors.available_from}
                />
            </div>

            <fieldset ref={refs.amenities} tabIndex={-1} className="focus:outline-none">
                <legend className="mb-2 text-sm font-medium text-ui-text">Équipements</legend>
                <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                    {Object.entries(amenities).map(([key, label]) => (
                        <Checkbox
                            key={key}
                            id={`amenity-${key}`}
                            label={label}
                            checked={data.amenities.includes(key)}
                            onChange={() => toggleAmenity(key)}
                        />
                    ))}
                </div>
                {amenityError && <p className="mt-2 text-sm text-danger-700">{amenityError}</p>}
            </fieldset>
        </div>
    );
}

export function LocationFields({ data, setData, errors, refs }) {
    return (
        <div className="space-y-5">
            <Input id="city" label="Ville" icon={Building2} value="Casablanca" disabled readOnly hint="ImmoKeys est disponible à Casablanca uniquement." />
            <Input
                ref={refs.quartier}
                id="quartier"
                label="Quartier"
                icon={MapPin}
                list="annonce-quartiers"
                placeholder="Ex. Maarif"
                maxLength={100}
                autoComplete="off"
                required
                value={data.quartier}
                onChange={(e) => setData('quartier', e.target.value)}
                error={errors.quartier}
            />
            <datalist id="annonce-quartiers">
                {QUARTIERS.map((quartier) => (
                    <option key={quartier} value={quartier} />
                ))}
            </datalist>
            <div className="grid gap-5 sm:grid-cols-3">
                <Input
                    ref={refs.price}
                    id="price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="50"
                    label="Loyer (MAD/mois)"
                    icon={Wallet}
                    required
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    error={errors.price}
                />
                <Input
                    ref={refs.charges}
                    id="charges"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="50"
                    label="Charges (MAD/mois)"
                    icon={Receipt}
                    hint="Optionnel"
                    value={data.charges}
                    onChange={(e) => setData('charges', e.target.value)}
                    error={errors.charges}
                />
                <Input
                    ref={refs.deposit}
                    id="deposit"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    label="Caution (MAD)"
                    icon={ShieldCheck}
                    hint="Optionnel"
                    value={data.deposit}
                    onChange={(e) => setData('deposit', e.target.value)}
                    error={errors.deposit}
                />
            </div>
        </div>
    );
}

/** Same rules as the server, checked before moving to the next step. */
export function missingFields(data, fields) {
    const optionalNumber = (value, min) => value === '' || value === null || Number(value) >= min;
    const checks = {
        title: () => data.title.trim() !== '',
        category_id: () => Boolean(data.category_id),
        description: () => data.description.trim() !== '',
        surface: () => optionalNumber(data.surface, 1),
        rooms: () => optionalNumber(data.rooms, 1) && (data.rooms === '' || Number(data.rooms) <= 20),
        is_furnished: () => true,
        available_from: () => true,
        amenities: () => true,
        quartier: () => data.quartier.trim() !== '',
        price: () => data.price !== '' && Number(data.price) >= 0,
        charges: () => optionalNumber(data.charges, 0),
        deposit: () => optionalNumber(data.deposit, 0),
    };
    return fields.filter((field) => !checks[field]());
}

/** Message for a field rejected by missingFields(). */
export function missingMessage(field) {
    return {
        surface: 'La surface doit être d’au moins 1 m².',
        rooms: 'Entre 1 et 20 pièces.',
        charges: 'Le montant ne peut pas être négatif.',
        deposit: 'Le montant ne peut pas être négatif.',
    }[field] ?? 'Ce champ est obligatoire.';
}

/** Props → form values for an existing annonce (edit page). */
export function detailsFromAnnonce(annonce) {
    return {
        rooms: annonce.rooms ?? '',
        is_furnished: annonce.is_furnished === null || annonce.is_furnished === undefined ? '' : annonce.is_furnished ? '1' : '0',
        available_from: annonce.available_from ? String(annonce.available_from).slice(0, 10) : '',
        charges: annonce.charges ?? '',
        deposit: annonce.deposit ?? '',
        amenities: annonce.amenities ?? [],
    };
}
