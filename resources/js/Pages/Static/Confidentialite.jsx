import InfoPage from '@/Components/InfoPage';

export default function Confidentialite() {
    return (
        <InfoPage
            title="Politique de confidentialité"
            intro="Nous collectons uniquement les données nécessaires au fonctionnement du service."
            sections={[
                {
                    title: 'Données collectées',
                    body: 'Nom, adresse email et mot de passe (chiffré) pour tous les comptes ; numéro de téléphone et pièce d’identité pour les propriétaires qui demandent une certification. Pour les étudiants : annonces mises en favoris et historique des contacts WhatsApp (annonce et date). Les signalements d’annonces que vous envoyez. Votre adresse email si vous vous inscrivez à la newsletter, même sans compte. Les vues des annonces sont comptées jour par jour, sans être liées à une personne.',
                },
                {
                    title: 'Utilisation',
                    body: 'Ces données servent à gérer votre compte, vérifier l’identité des propriétaires, permettre le contact WhatsApp entre étudiants et propriétaires, modérer les annonces signalées et envoyer la newsletter aux personnes inscrites. Elles ne sont ni revendues ni partagées avec des tiers. La pièce d’identité est conservée dans un espace privé, consulté uniquement par l’équipe de vérification.',
                },
                {
                    title: 'Vos droits',
                    body: 'Vous pouvez modifier ou supprimer votre compte à tout moment depuis votre profil. La suppression efface votre compte, votre abonnement, vos favoris, votre pièce d’identité et, pour un propriétaire, ses annonces et leurs photos ; l’historique des contacts reçus par les propriétaires est conservé sans votre nom. Pour vous désinscrire de la newsletter ou pour toute autre demande, écrivez-nous à contact@immokeys.ma.',
                },
            ]}
        />
    );
}
