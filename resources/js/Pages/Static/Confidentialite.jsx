import InfoPage from '@/Components/InfoPage';

export default function Confidentialite() {
    return (
        <InfoPage
            title="Politique de confidentialité"
            intro="Nous collectons uniquement les données nécessaires au fonctionnement du service."
            sections={[
                {
                    title: 'Données collectées',
                    body: 'Nom, adresse email et mot de passe (chiffré) pour tous les comptes ; numéro de téléphone et pièce d’identité pour les propriétaires qui demandent une certification.',
                },
                {
                    title: 'Utilisation',
                    body: 'Ces données servent à gérer votre compte, vérifier l’identité des propriétaires et permettre le contact WhatsApp entre étudiants et propriétaires. Elles ne sont ni revendues ni partagées avec des tiers.',
                },
                {
                    title: 'Vos droits',
                    body: 'Vous pouvez modifier ou supprimer votre compte à tout moment depuis votre profil, ou nous écrire à contact@immokeys.ma.',
                },
            ]}
        />
    );
}
