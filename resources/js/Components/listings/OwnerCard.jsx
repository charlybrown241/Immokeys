import { Avatar, Badge, Button, Card } from '@/Components/ui';
import useFavorites from '@/hooks/useFavorites';
import { formatMad } from '@/utils/format';
import { Link } from '@inertiajs/react';
import { BadgeCheck, Heart, Info, MessageCircle, ShieldCheck } from 'lucide-react';

const UNAVAILABLE_MESSAGES = {
    wrong_role: 'Seuls les étudiants peuvent contacter les propriétaires via WhatsApp.',
    missing_phone: "Le propriétaire n'a pas encore renseigné de numéro de téléphone.",
    unavailable: "Cette annonce n'est plus disponible.",
};

// The "ready" URL is a short-lived signed route: it logs the contact for
// the owner/admin stats, then redirects to wa.me with a message that
// already contains the listing title. Never link to wa.me directly.
function WhatsappAction({ contact }) {
    if (contact.status === 'ready') {
        return (
            <Button as="a" href={contact.url} variant="whatsapp" size="lg" icon={MessageCircle} className="w-full">
                Contacter sur WhatsApp
            </Button>
        );
    }

    if (contact.status === 'guest') {
        return (
            <>
                <Button
                    as={Link}
                    href={`${route('login')}?reason=contact-whatsapp`}
                    variant="whatsapp"
                    size="lg"
                    icon={MessageCircle}
                    className="w-full"
                >
                    Contacter sur WhatsApp
                </Button>
                <p className="mt-2 text-center text-xs text-ui-muted">Connexion étudiante requise pour contacter.</p>
            </>
        );
    }

    return (
        <>
            <Button variant="whatsapp" size="lg" icon={MessageCircle} disabled className="w-full" aria-describedby="whatsapp-indisponible">
                Contacter sur WhatsApp
            </Button>
            <p id="whatsapp-indisponible" className="mt-2 flex items-start gap-1.5 text-xs text-ui-muted">
                <Info size={14} className="mt-px shrink-0" aria-hidden="true" />
                {UNAVAILABLE_MESSAGES[contact.status]}
            </p>
        </>
    );
}

/** Price, owner identity, WhatsApp contact and favourite toggle. */
export default function OwnerCard({ annonce, className = '' }) {
    const { isFavorite, toggle } = useFavorites();
    const favorite = isFavorite(annonce.id);

    return (
        <Card className={className}>
            <p className="font-heading text-3xl font-extrabold text-navy-900">
                {formatMad(annonce.price)}
                <span className="font-body text-base font-medium text-ui-muted">/mois</span>
            </p>
            {(Number(annonce.charges) > 0 || Number(annonce.deposit) > 0) && (
                <ul className="mt-1 space-y-0.5 text-sm text-ui-muted">
                    {Number(annonce.charges) > 0 && <li>+ {formatMad(annonce.charges)} de charges par mois</li>}
                    {Number(annonce.deposit) > 0 && <li>Caution : {formatMad(annonce.deposit)}</li>}
                </ul>
            )}

            <div className="mt-5 flex items-center gap-3 border-y border-ui-border py-4">
                <Avatar name={annonce.owner_name ?? 'Propriétaire'} size="lg" />
                <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-ui-muted">Propriétaire</p>
                    <p className="truncate font-heading text-lg font-bold text-ui-text">{annonce.owner_name ?? 'Propriétaire'}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {annonce.owner_is_verified && (
                            <Badge variant="brand" icon={ShieldCheck}>
                                Identité certifiée
                            </Badge>
                        )}
                        {annonce.is_certified_pro && (
                            <Badge variant="navy" icon={BadgeCheck}>
                                Pro
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <WhatsappAction contact={annonce.whatsapp_contact} />
            </div>

            <Button
                variant="outline"
                size="lg"
                onClick={() => toggle(annonce.id)}
                className="mt-3 w-full"
            >
                <Heart size={20} aria-hidden="true" className={favorite ? 'fill-danger text-danger' : ''} />
                {favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </Button>
        </Card>
    );
}
