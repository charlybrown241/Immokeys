import InfoPage from '@/Components/InfoPage';

export default function MentionsLegales() {
    return (
        <InfoPage
            title="Mentions légales"
            intro="ImmoKeys est un projet étudiant réalisé dans un cadre pédagogique."
            sections={[
                {
                    title: 'Éditeur',
                    body: 'ImmoKeys — projet étudiant, Casablanca (Maroc). Contact : contact@immokeys.ma',
                },
                {
                    title: 'Responsabilité',
                    body: 'ImmoKeys met en relation étudiants et propriétaires mais n’est pas partie aux contrats de location conclus entre eux. Les informations des annonces relèvent de la responsabilité de leurs auteurs.',
                },
            ]}
        />
    );
}
