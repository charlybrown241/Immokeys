import { Input, Select, Textarea } from '@/Components/ui';
import { QUARTIERS } from '@/Constants/quartiers';
import { Building2, House, MapPin, Maximize2, Type, Wallet } from 'lucide-react';

// Field groups shared by the create wizard and the edit form. `refs` maps
// a field name to a ref so pages can focus the first rejected field.

export const GENERAL_FIELDS = ['title', 'category_id', 'description'];
export const LOCATION_FIELDS = ['quartier', 'surface', 'price'];

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
                placeholder="Pièces, équipements, proximité des transports et des facultés, conditions…"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                error={errors.description}
            />
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
                    ref={refs.price}
                    id="price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="50"
                    label="Loyer mensuel (MAD)"
                    icon={Wallet}
                    required
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    error={errors.price}
                />
            </div>
        </div>
    );
}

/** Same rules as the server, checked before moving to the next step. */
export function missingFields(data, fields) {
    const checks = {
        title: () => data.title.trim() !== '',
        category_id: () => Boolean(data.category_id),
        description: () => data.description.trim() !== '',
        quartier: () => data.quartier.trim() !== '',
        surface: () => data.surface === '' || Number(data.surface) >= 1,
        price: () => data.price !== '' && Number(data.price) >= 0,
    };
    return fields.filter((field) => !checks[field]());
}
