import InfoPage from '@/Components/InfoPage';

export default function CommentCaMarche() {
    return (
        <InfoPage
            title="Comment ça marche"
            intro="ImmoKeys met en relation les étudiants et les propriétaires de Casablanca, simplement et en confiance."
            sections={[
                {
                    title: '1. Je cherche un logement',
                    body: 'Parcourez les annonces librement, sans compte. Filtrez par quartier, catégorie (studio, colocation, chambre chez l’habitant…), loyer et surface.',
                },
                {
                    title: '2. Je contacte le propriétaire',
                    body: 'Une annonce vous plaît ? Créez un compte étudiant gratuit puis contactez directement le propriétaire sur WhatsApp, en un clic depuis la fiche de l’annonce.',
                },
                {
                    title: '3. Je publie mon bien',
                    body: 'Propriétaire ? Inscrivez-vous, faites certifier votre identité (CIN) puis publiez vos annonces. Chaque annonce est vérifiée par notre équipe avant d’être mise en ligne.',
                },
            ]}
        />
    );
}
