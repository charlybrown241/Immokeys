import { Badge, Button, cx, focusRing } from '@/Components/ui';
import useFavorites from '@/hooks/useFavorites';
import { formatMad } from '@/utils/format';
import { Link } from '@inertiajs/react';
import { BadgeCheck, Heart, House, MapPin, Maximize2, MessageCircle, Sparkles } from 'lucide-react';

// Same rules as the detail page: a signed link for students, the login
// page for guests, the detail page otherwise (missing phone, wrong role).
function ContactButton({ annonce }) {
    const contact = annonce.whatsapp_contact ?? { status: 'guest' };
    const common = { size: 'sm', className: 'w-full' };

    if (contact.status === 'ready') {
        return (
            <Button as="a" href={contact.url} variant="whatsapp" icon={MessageCircle} {...common}>
                Contacter sur WhatsApp
            </Button>
        );
    }

    if (contact.status === 'guest') {
        return (
            <Button
                as={Link}
                href={`${route('login')}?reason=contact-whatsapp`}
                variant="whatsapp"
                icon={MessageCircle}
                {...common}
            >
                Contacter sur WhatsApp
            </Button>
        );
    }

    return (
        <Button as={Link} href={route('annonces.show', annonce.id)} variant="outline" {...common}>
            Voir l'annonce
        </Button>
    );
}

/**
 * Listing card: photo with badges and favourite toggle, price, title,
 * quartier, specs and WhatsApp contact. The title link covers the card.
 */
export default function ListingCard({ annonce, className = '' }) {
    const { isFavorite, toggle } = useFavorites();
    const favorite = isFavorite(annonce.id);

    return (
        <article
            className={cx(
                'group relative flex h-full flex-col overflow-hidden rounded-card border border-ui-border bg-white shadow-card transition hover:shadow-float',
                className,
            )}
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-navy-900">
                {annonce.main_photo ? (
                    <img
                        src={`/storage/${annonce.main_photo}`}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-navy-800 text-gold-300">
                        <House size={40} aria-hidden="true" />
                    </div>
                )}

                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {annonce.is_new && (
                        <Badge variant="navy" icon={Sparkles}>
                            Nouveau
                        </Badge>
                    )}
                    {annonce.is_certified_pro && (
                        <Badge variant="brand" icon={BadgeCheck}>
                            Certifié
                        </Badge>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => toggle(annonce.id)}
                    aria-pressed={favorite}
                    aria-label={`Ajouter « ${annonce.title} » aux favoris`}
                    className={cx(
                        'absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-navy-900 shadow-card transition hover:scale-105',
                        focusRing,
                    )}
                >
                    <Heart size={20} aria-hidden="true" className={favorite ? 'fill-danger text-danger' : ''} />
                </button>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <p className="font-heading text-xl font-extrabold text-navy-900">
                    {formatMad(annonce.price)}
                    <span className="font-body text-sm font-medium text-ui-muted">/mois</span>
                </p>
                <h3 className="mt-1 line-clamp-2 font-semibold leading-snug text-ui-text">
                    <Link
                        href={route('annonces.show', annonce.id)}
                        className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-gold-700"
                    >
                        {annonce.title}
                    </Link>
                </h3>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-ui-muted">
                    <MapPin size={15} aria-hidden="true" />
                    {annonce.quartier}
                </p>

                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ui-muted">
                    {annonce.surface && (
                        <li className="inline-flex items-center gap-1.5">
                            <Maximize2 size={15} className="text-gold-700" aria-hidden="true" />
                            {annonce.surface} m²
                        </li>
                    )}
                    {annonce.category && (
                        <li className="inline-flex items-center gap-1.5">
                            <House size={15} className="text-gold-700" aria-hidden="true" />
                            {annonce.category}
                        </li>
                    )}
                </ul>

                <div className="relative z-10 mt-auto pt-4">
                    <ContactButton annonce={annonce} />
                </div>
            </div>
        </article>
    );
}
