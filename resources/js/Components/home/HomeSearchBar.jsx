import { Button, Card, Input, Select } from '@/Components/ui';
import { router } from '@inertiajs/react';
import { House, MapPin, Search, Wallet } from 'lucide-react';
import { useState } from 'react';

/**
 * Floating search card of the home page. Submits to the public search page
 * with the same query-string filters it already understands
 * (search, category_id, max_price).
 */
export default function HomeSearchBar({ categories, quartiers }) {
    const [values, setValues] = useState({ search: '', category_id: '', max_price: '' });

    const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

    const submit = (event) => {
        event.preventDefault();
        const query = Object.fromEntries(
            Object.entries(values)
                .map(([key, value]) => [key, String(value).trim()])
                .filter(([, value]) => value !== ''),
        );
        router.get(route('annonces.index'), query);
    };

    return (
        <Card as="form" role="search" aria-label="Rechercher un logement" onSubmit={submit} className="shadow-float">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-end">
                <Input
                    label="Quartier"
                    icon={MapPin}
                    placeholder="Maarif, Gauthier…"
                    list="home-quartiers"
                    autoComplete="off"
                    value={values.search}
                    onChange={update('search')}
                />
                <datalist id="home-quartiers">
                    {quartiers.map((quartier) => (
                        <option key={quartier.name} value={quartier.name} />
                    ))}
                </datalist>

                <Select
                    label="Type de logement"
                    icon={House}
                    placeholder="Tous les types"
                    options={categories.map((category) => ({ value: category.id, label: category.name }))}
                    value={values.category_id}
                    onChange={update('category_id')}
                />

                <Input
                    label="Budget max (MAD/mois)"
                    icon={Wallet}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="100"
                    placeholder="Ex. 3000"
                    value={values.max_price}
                    onChange={update('max_price')}
                />

                <Button type="submit" size="lg" icon={Search} className="w-full md:col-span-3 lg:col-span-1 lg:w-auto">
                    Rechercher
                </Button>
            </div>
        </Card>
    );
}
