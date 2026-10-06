import { clearLocalFavorites, localFavoriteIds } from '@/hooks/useFavorites';
import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

const MAX_SYNC = 50;

/**
 * Once a student is signed in, move the favourites saved in this browser
 * (as a guest) to the account, then forget the local copy. Renders nothing.
 */
export default function FavoritesSync() {
    const { favorites } = usePage().props;
    const signedInStudent = Array.isArray(favorites);

    useEffect(() => {
        if (!signedInStudent) return;
        const missing = localFavoriteIds().filter((id) => !favorites.includes(id));
        clearLocalFavorites();
        if (missing.length) {
            router.put(route('favorites.sync'), { ids: missing.slice(0, MAX_SYNC) }, { preserveScroll: true, preserveState: true });
        }
        // Run once per sign-in, not on every favourites change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signedInStudent]);

    return null;
}
