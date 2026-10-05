import {
    Avatar,
    Badge,
    Button,
    Card,
    Checkbox,
    EmptyState,
    Input,
    Select,
    Skeleton,
    StatCard,
} from '@/Components/ui';
import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Building2,
    Clock,
    Eye,
    House,
    Info,
    Lock,
    Mail,
    MapPin,
    MessageCircle,
    Plus,
    Search,
    ShieldAlert,
    Star,
} from 'lucide-react';

// Dev-only showcase of the "navy + or" tokens and the ui/ component kit.
// Class names are written out in full so Tailwind can find them.

const colorGroups = [
    {
        name: 'Navy',
        swatches: [
            { token: 'navy-950', hex: '#0A1128', className: 'bg-navy-950' },
            { token: 'navy-900', hex: '#0F1B3D', className: 'bg-navy-900' },
            { token: 'navy-800', hex: '#16254F', className: 'bg-navy-800' },
        ],
    },
    {
        name: 'Or',
        swatches: [
            { token: 'gold-50', hex: '#FDF6E3', className: 'bg-gold-50' },
            { token: 'gold-100', hex: '#FBEBC0', className: 'bg-gold-100' },
            { token: 'gold-300', hex: '#F8DA6A', className: 'bg-gold-300' },
            { token: 'gold-500', hex: '#E0A82E', className: 'bg-gold-500' },
            { token: 'gold-600', hex: '#D49533', className: 'bg-gold-600' },
            { token: 'gold-700', hex: '#9A6700', className: 'bg-gold-700' },
            { token: 'gold-gradient', hex: '#F8DA6A → #D49533', className: 'bg-gold-gradient' },
        ],
    },
    {
        name: 'Indigo (données uniquement)',
        swatches: [
            { token: 'indigo-50', hex: '#EEEBFC', className: 'bg-indigo-50' },
            { token: 'indigo-500', hex: '#5B45D6', className: 'bg-indigo-500' },
        ],
    },
    {
        name: 'Statuts',
        swatches: [
            { token: 'success', hex: '#16A34A', className: 'bg-success' },
            { token: 'warning', hex: '#F59E0B', className: 'bg-warning' },
            { token: 'danger', hex: '#DC2626', className: 'bg-danger' },
            { token: 'whatsapp', hex: '#25D366', className: 'bg-whatsapp' },
        ],
    },
    {
        name: 'Neutres',
        swatches: [
            { token: 'ui-bg', hex: '#F5F7FB', className: 'bg-ui-bg' },
            { token: 'ui-border', hex: '#E5E9F2', className: 'bg-ui-border' },
            { token: 'ui-text', hex: '#0F172A', className: 'bg-ui-text' },
            { token: 'ui-muted', hex: '#64748B', className: 'bg-ui-muted' },
        ],
    },
];

const buttonVariants = ['primary', 'secondary', 'outline', 'ghost', 'whatsapp'];

function Section({ title, description, children }) {
    return (
        <section className="space-y-5">
            <div>
                <h2 className="font-heading text-2xl font-bold text-ui-text">{title}</h2>
                {description && <p className="mt-1 text-sm text-ui-muted">{description}</p>}
            </div>
            {children}
        </section>
    );
}

export default function DesignSystem() {
    return (
        <>
            <Head title="Design system" />

            <div className="min-h-screen bg-ui-bg font-body text-ui-text">
                <header className="bg-navy-950">
                    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                        <p className="text-sm font-semibold uppercase tracking-widest text-gold-300">ImmoKeys</p>
                        <h1 className="mt-2 font-heading text-4xl font-extrabold text-gold-gradient sm:text-5xl">
                            Charte navy + or
                        </h1>
                        <p className="mt-3 max-w-2xl text-white/80">
                            Design tokens et kit de composants (resources/js/Components/ui). Page visible en
                            environnement local uniquement.
                        </p>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6">
                    <Section
                        title="Couleurs"
                        description="Or clair et dégradé en texte uniquement sur navy ; sur fond blanc, le texte or utilise gold-700."
                    >
                        <div className="space-y-8">
                            {colorGroups.map((group) => (
                                <div key={group.name}>
                                    <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-ui-muted">
                                        {group.name}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                                        {group.swatches.map((swatch) => (
                                            <div key={swatch.token} className="overflow-hidden rounded-card border border-ui-border bg-white">
                                                <div className={`h-16 ${swatch.className}`} />
                                                <div className="p-3">
                                                    <p className="text-sm font-semibold">{swatch.token}</p>
                                                    <p className="text-xs text-ui-muted">{swatch.hex}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <p className="text-sm text-ui-muted">Sur fond blanc</p>
                                <p className="mt-2 font-heading text-2xl font-bold text-gold-700">Texte or : gold-700</p>
                            </Card>
                            <div className="rounded-card bg-navy-900 p-6 shadow-card">
                                <p className="text-sm text-white/70">Sur fond navy</p>
                                <p className="mt-2 font-heading text-2xl font-bold text-gold-300">Texte or : gold-300</p>
                                <p className="font-heading text-2xl font-bold text-gold-gradient">text-gold-gradient</p>
                            </div>
                        </div>
                    </Section>

                    <Section title="Typographie" description="Plus Jakarta Sans pour les titres (700/800), Inter pour le texte.">
                        <Card className="space-y-4">
                            <p className="font-heading text-5xl font-extrabold tracking-tight">Titre 800</p>
                            <p className="font-heading text-3xl font-bold">Titre 700 : Trouvez votre logement</p>
                            <p className="max-w-2xl text-base">
                                Inter 400 : des logements étudiants à Casablanca, publiés par des propriétaires dont
                                l'identité est certifiée. Contact direct via WhatsApp.
                            </p>
                            <p className="text-sm font-medium text-ui-muted">Inter 500, texte secondaire (ui-muted)</p>
                        </Card>
                    </Section>

                    <Section title="Rayons et ombres">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-field border border-ui-border bg-white p-4 text-sm">rounded-field · 12px</div>
                            <div className="rounded-card border border-ui-border bg-white p-4 text-sm">rounded-card · 16px</div>
                            <div className="rounded-card bg-white p-4 text-sm shadow-card">shadow-card</div>
                            <div className="rounded-card bg-white p-4 text-sm shadow-float">shadow-float</div>
                        </div>
                    </Section>

                    <Section title="Boutons" description="Variantes, tailles, icônes, chargement et désactivé. Tab pour voir le focus.">
                        <Card className="space-y-6">
                            {buttonVariants.map((variant) => (
                                <div key={variant} className="flex flex-wrap items-center gap-3">
                                    <span className="w-24 text-sm font-medium text-ui-muted">{variant}</span>
                                    <Button variant={variant} size="sm">
                                        Petit
                                    </Button>
                                    <Button variant={variant}>Moyen</Button>
                                    <Button variant={variant} size="lg">
                                        Grand
                                    </Button>
                                    <Button variant={variant} loading>
                                        Chargement
                                    </Button>
                                    <Button variant={variant} disabled>
                                        Désactivé
                                    </Button>
                                </div>
                            ))}
                            <div className="flex flex-wrap items-center gap-3 border-t border-ui-border pt-6">
                                <Button icon={Search}>Rechercher</Button>
                                <Button variant="secondary" icon={Plus}>
                                    Publier une annonce
                                </Button>
                                <Button variant="outline" iconRight={ArrowRight}>
                                    Voir le détail
                                </Button>
                                <Button variant="whatsapp" icon={MessageCircle}>
                                    Contacter sur WhatsApp
                                </Button>
                            </div>
                        </Card>
                        <div className="flex flex-wrap gap-3 rounded-card bg-navy-900 p-6">
                            <Button>Primaire sur navy</Button>
                            <Button variant="outline">Outline sur navy</Button>
                        </div>
                    </Section>

                    <Section title="Champs de formulaire">
                        <Card className="grid gap-6 md:grid-cols-2">
                            <Input label="Adresse e-mail" type="email" icon={Mail} placeholder="nom@exemple.ma" />
                            <Input label="Quartier" icon={MapPin} placeholder="Maârif" hint="Casablanca uniquement." />
                            <Input
                                label="Mot de passe"
                                type="password"
                                icon={Lock}
                                required
                                error="Le mot de passe doit contenir au moins 8 caractères."
                            />
                            <Input label="Champ désactivé" disabled value="Non modifiable" readOnly />
                            <Select
                                label="Type de logement"
                                icon={House}
                                placeholder="Tous les types"
                                options={[
                                    { value: 'studio', label: 'Studio' },
                                    { value: 'appartement', label: 'Appartement' },
                                    { value: 'chambre', label: 'Chambre' },
                                ]}
                            />
                            <Select
                                label="Ville"
                                error="Veuillez choisir une option."
                                placeholder="Choisir"
                                options={[{ value: 'casablanca', label: 'Casablanca' }]}
                            />
                            <Checkbox label="Meublé" description="Afficher uniquement les logements meublés." />
                            <Checkbox label="J'accepte les conditions" error="Vous devez accepter les conditions." />
                        </Card>
                    </Section>

                    <Section title="Badges">
                        <Card className="flex flex-wrap items-center gap-3">
                            <Badge variant="success" icon={BadgeCheck}>
                                Certifié
                            </Badge>
                            <Badge variant="warning" icon={Clock}>
                                En attente
                            </Badge>
                            <Badge variant="danger" icon={ShieldAlert}>
                                Refusé
                            </Badge>
                            <Badge variant="info" icon={Info}>
                                Nouveau
                            </Badge>
                            <Badge variant="neutral">Brouillon</Badge>
                            <Badge variant="brand" icon={Star}>
                                Pro
                            </Badge>
                            <Badge variant="brand" size="md" icon={Star}>
                                Premium (md)
                            </Badge>
                        </Card>
                    </Section>

                    <Section title="Cartes et avatars">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="flex items-center gap-4">
                                <Avatar name="Salma Bennani" size="lg" />
                                <div>
                                    <p className="font-heading text-lg font-bold">Salma Bennani</p>
                                    <p className="text-sm text-ui-muted">Propriétaire depuis 2024</p>
                                    <Badge variant="success" icon={BadgeCheck} className="mt-2">
                                        Identité certifiée
                                    </Badge>
                                </div>
                            </Card>
                            <Card className="flex items-center gap-3">
                                <Avatar name="Youssef Alaoui" size="sm" />
                                <Avatar name="Youssef Alaoui" />
                                <Avatar name="Youssef Alaoui" size="lg" />
                                <Avatar src="/image-introuvable.jpg" name="Image cassée" />
                            </Card>
                        </div>
                    </Section>

                    <Section title="Statistiques" description="La sparkline utilise l'indigo, réservé aux données.">
                        <div className="grid gap-4 md:grid-cols-3">
                            <StatCard
                                icon={MessageCircle}
                                label="Contacts WhatsApp"
                                value="128"
                                delta={12}
                                deltaLabel="vs mois dernier"
                                sparkline={[4, 6, 5, 9, 8, 12, 11, 15]}
                            />
                            <StatCard
                                icon={Eye}
                                label="Vues des annonces"
                                value="2 430"
                                delta={-4}
                                deltaLabel="vs mois dernier"
                                sparkline={[30, 28, 32, 27, 25, 26, 24, 23]}
                            />
                            <StatCard icon={Building2} label="Annonces actives" value="7" />
                        </div>
                    </Section>

                    <Section title="État vide">
                        <EmptyState
                            icon={Building2}
                            title="Aucune annonce pour le moment"
                            description="Publiez votre premier logement pour qu'il apparaisse dans les recherches des étudiants."
                            action={<Button icon={Plus}>Publier une annonce</Button>}
                        />
                    </Section>

                    <Section title="Squelettes de chargement">
                        <div className="grid gap-4 md:grid-cols-3">
                            {[1, 2, 3].map((key) => (
                                <Card key={key} className="space-y-3">
                                    <Skeleton shape="rect" />
                                    <Skeleton shape="title" />
                                    <Skeleton />
                                    <div className="flex items-center gap-3 pt-2">
                                        <Skeleton shape="circle" />
                                        <Skeleton className="w-1/2" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Section>
                </main>
            </div>
        </>
    );
}
