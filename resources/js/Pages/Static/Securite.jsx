import InfoPage from '@/Components/InfoPage';

export default function Securite() {
    return (
        <InfoPage
            title="Sécurité & certification"
            intro="Pour limiter les fausses annonces, chaque propriétaire doit prouver son identité avant de publier."
            sections={[
                {
                    title: 'Vérification de la CIN',
                    body: 'Le propriétaire envoie une copie de sa carte d’identité nationale (CIN) ainsi que son numéro de téléphone. Notre équipe contrôle le document manuellement puis valide ou refuse la certification.',
                },
                {
                    title: 'Modération des annonces',
                    body: 'Une nouvelle annonce reste « en attente » tant qu’elle n’a pas été vérifiée. Une annonce non conforme peut être suspendue à tout moment par l’administration.',
                },
                {
                    title: 'Le badge « Certifié Pro »',
                    body: 'Il distingue les propriétaires dont l’identité a été vérifiée et qui disposent d’un abonnement Pro actif. C’est un repère de confiance supplémentaire lors de votre recherche.',
                },
                {
                    title: 'Vos documents',
                    body: 'Les pièces d’identité ne sont jamais affichées publiquement : elles sont stockées de façon privée et consultables uniquement par l’équipe de vérification.',
                },
            ]}
        />
    );
}
