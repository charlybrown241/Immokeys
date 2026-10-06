import FlashMessages from '@/Components/dashboard/FlashMessages';
import PageHeading from '@/Components/dashboard/PageHeading';
import Panel from '@/Components/dashboard/Panel';
import ListingCard from '@/Components/ListingCard';
import { Badge, Button, Card, cx, EmptyState, focusRing, Skeleton, StatCard } from '@/Components/ui';
import useFavorites, { favoriteIds } from '@/hooks/useFavorites';
import useRecentSearches from '@/hooks/useRecentSearches';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatMad, formatRelative } from '@/utils/format';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Eye, Heart, History, MessageCircle, Search, SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';

const SORT_LABELS = {
    price_asc: 'prix croissant',
    price_desc: 'prix décroissant',
    surface_desc: 'plus grande surface',
};

function searchLabel(search, categories) {
    const category = categories.find((item) => String(item.id) === String(search.category_id));
    return [
        search.search,
        category?.name,
        search.max_price && `≤ ${formatMad(search.max_price)}`,
        search.sort && SORT_LABELS[search.sort],
    ]
        .filter(Boolean)
        .join(' · ');
}

function CardGridSkeleton({ count = 3 }) {
    return (
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
            {Array.from({ length: count }, (_, index) => (
                <li key={index}>
                    <Card padding="none" className="overflow-hidden">
                        <div className="aspect-[4/3]">
                            <Skeleton shape="rect" className="!h-full !rounded-none" />
                        </div>
                        <div className="space-y-3 p-4">
                            <Skeleton shape="title" className="w-1/3" />
                            <Skeleton />
                            <Skeleton className="h-9 rounded-field" />
                        </div>
                    </Card>
                </li>
            ))}
        </ul>
    );
}

// Favourites are stored in this browser: send their ids to the server to
// get up-to-date cards (price, availability, contact link).
function useFavoriteCards(favoritesProp) {
    const { isFavorite } = useFavorites();
    const [ids] = useState(favoriteIds);
    const [loading, setLoading] = useState(ids.length > 0);

    useEffect(() => {
        if (ids.length === 0) return;
        router.reload({
            only: ['favorites'],
            data: { favoris: ids },
            preserveUrl: true,
            onFinish: () => setLoading(false),
        });
    }, [ids]);

    // Hide a card as soon as it is un-hearted, without another request.
    const cards = (favoritesProp ?? []).filter((annonce) => isFavorite(annonce.id));

    return { cards, loading, hasAny: ids.length > 0 };
}

export default function StudentDashboard({ recentlyViewed, contacts, contactsCount, categories, favorites }) {
    const { user } = usePage().props.auth;
    const favoriteCards = useFavoriteCards(favorites);
    const { searches, clear } = useRecentSearches();

    return (
        <DashboardLayout
            header={
                <PageHeading
                    title="Mon espace"
                    subtitle={`Bonjour ${user.name.split(' ')[0]}, retrouve ici tes favoris et tes démarches.`}
                    actions={
                        <Button as={Link} href={route('annonces.index')} icon={Search}>
                            Chercher un logement
                        </Button>
                    }
                />
            }
        >
            <Head title="Mon espace" />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <FlashMessages />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        icon={Heart}
                        label="Favoris"
                        value={favoriteCards.loading ? '…' : favoriteCards.cards.length}
                        hint="Sur cet appareil"
                    />
                    <StatCard icon={MessageCircle} label="Propriétaires contactés" value={contactsCount} hint="Via WhatsApp" />
                    <StatCard icon={Eye} label="Annonces consultées" value={recentlyViewed.length} hint="Pendant cette session" />
                </div>

                <Panel
                    title="Mes favoris"
                    description="Enregistrés dans ce navigateur"
                    action={
                        <Button as={Link} href={route('annonces.index')} variant="ghost" size="sm" iconRight={ArrowRight}>
                            Voir les logements
                        </Button>
                    }
                >
                    {favoriteCards.loading ? (
                        <CardGridSkeleton />
                    ) : favoriteCards.cards.length > 0 ? (
                        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {favoriteCards.cards.map((annonce) => (
                                <li key={annonce.id}>
                                    <ListingCard annonce={annonce} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState
                            icon={Heart}
                            title="Aucun favori pour l'instant"
                            description="Touche le cœur d'une annonce pour la retrouver ici."
                            action={
                                <Button as={Link} href={route('annonces.index')} variant="secondary">
                                    Parcourir les logements
                                </Button>
                            }
                            className="border-0 py-8"
                        />
                    )}
                </Panel>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Panel
                        title="Historique des contacts"
                        description="Propriétaires contactés sur WhatsApp"
                    >
                        {contacts.length > 0 ? (
                            <ul className="divide-y divide-ui-border">
                                {contacts.map((contact) => (
                                    <li key={contact.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-whatsapp/15 text-navy-900">
                                            <MessageCircle size={18} aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            {contact.annonce ? (
                                                <Link
                                                    href={route('annonces.show', contact.annonce.id)}
                                                    className={cx('block truncate rounded-md text-sm font-semibold text-ui-text hover:underline', focusRing)}
                                                >
                                                    {contact.annonce.title}
                                                </Link>
                                            ) : (
                                                <p className="text-sm font-semibold text-ui-muted">Annonce supprimée</p>
                                            )}
                                            <p className="truncate text-sm text-ui-muted">
                                                {contact.annonce && `${contact.annonce.quartier} · ${formatMad(contact.annonce.price)}/mois · `}
                                                <time dateTime={contact.created_at}>{formatRelative(contact.created_at)}</time>
                                            </p>
                                        </div>
                                        {contact.annonce && (
                                            <Badge variant={contact.annonce.available ? 'success' : 'neutral'}>
                                                {contact.annonce.available ? 'Disponible' : 'Plus disponible'}
                                            </Badge>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState
                                icon={MessageCircle}
                                title="Aucun contact pour l'instant"
                                description="Quand tu contactes un propriétaire sur WhatsApp, l'annonce apparaît ici."
                                className="border-0 py-8"
                            />
                        )}
                    </Panel>

                    <Panel
                        title="Recherches récentes"
                        description="Sur cet appareil"
                        action={
                            searches.length > 0 && (
                                <Button variant="ghost" size="sm" onClick={clear}>
                                    Effacer
                                </Button>
                            )
                        }
                    >
                        {searches.length > 0 ? (
                            <ul className="flex flex-wrap gap-2">
                                {searches.map((search) => (
                                    <li key={JSON.stringify(search)}>
                                        <Link
                                            href={route('annonces.index', search)}
                                            className={cx(
                                                'inline-flex min-h-10 items-center gap-2 rounded-full border border-ui-border bg-white px-4 text-sm font-medium text-ui-text transition hover:border-navy-900',
                                                focusRing,
                                            )}
                                        >
                                            <History size={16} className="text-gold-700" aria-hidden="true" />
                                            {searchLabel(search, categories)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState
                                icon={SearchX}
                                title="Aucune recherche récente"
                                description="Tes recherches filtrées s'afficheront ici pour les relancer en un clic."
                                className="border-0 py-8"
                            />
                        )}
                    </Panel>
                </div>

                <Panel title="Consultées récemment" description="Pendant ta session">
                    {recentlyViewed.length > 0 ? (
                        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {recentlyViewed.map((annonce) => (
                                <li key={annonce.id}>
                                    <ListingCard annonce={annonce} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState
                            icon={Eye}
                            title="Rien consulté pour le moment"
                            description="Les annonces que tu ouvres s'afficheront ici."
                            className="border-0 py-8"
                        />
                    )}
                </Panel>
            </div>
        </DashboardLayout>
    );
}
