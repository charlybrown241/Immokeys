// Popular student neighbourhoods in Casablanca, used as search shortcuts
// (annonces.index?search=...) on the search page, navbar and footer.
export const QUARTIERS = ['Maarif', 'Gauthier', 'Racine', 'Bourgogne', 'CIL', 'Sidi Belyout'];

export function quartierUrl(quartier) {
    return route('annonces.index', { search: quartier });
}
