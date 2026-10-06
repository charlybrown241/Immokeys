import { router, usePage } from '@inertiajs/react';
import { useCallback, useSyncExternalStore } from 'react';

// Signed-in students: favourites live on the server (shared prop
// "favorites", array of ids), toggled with an optimistic update.
// Everyone else: favourites are kept in this browser (localStorage) and
// merged into the account at the student's next sign-in (FavoritesSync).

const KEY = 'immokeys:favoris';
const listeners = new Set();
let local = null;
let pending = {};

function notify() {
    listeners.forEach((listener) => listener());
}

function readLocal() {
    if (local) return local;
    try {
        local = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    } catch {
        local = [];
    }
    return local;
}

function writeLocal(ids) {
    local = ids;
    try {
        window.localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
        // Storage unavailable (private mode...): keep the in-memory state.
    }
    notify();
}

function setPending(id, value) {
    pending = { ...pending };
    if (value === undefined) delete pending[id];
    else pending[id] = value;
    notify();
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

const readPending = () => pending;
const emptyIds = [];
const emptyPending = {};

/** Favourites stored in this browser, outside React. */
export function localFavoriteIds() {
    return readLocal();
}

/** Forget the browser favourites once they are merged into the account. */
export function clearLocalFavorites() {
    writeLocal([]);
}

export default function useFavorites() {
    const serverIds = usePage().props.favorites;
    const localIds = useSyncExternalStore(subscribe, readLocal, () => emptyIds);
    const optimistic = useSyncExternalStore(subscribe, readPending, () => emptyPending);
    const onServer = Array.isArray(serverIds);

    const isFavorite = useCallback(
        (id) => (onServer ? (optimistic[id] ?? serverIds.includes(id)) : localIds.includes(id)),
        [onServer, optimistic, serverIds, localIds],
    );

    const toggle = useCallback(
        (id) => {
            if (!onServer) {
                const current = readLocal();
                writeLocal(current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
                return;
            }
            setPending(id, !isFavorite(id));
            router.post(route('favorites.toggle', id), {}, {
                preserveScroll: true,
                preserveState: true,
                // Fresh props now hold the truth (or the old state on error).
                onFinish: () => setPending(id, undefined),
            });
        },
        [onServer, isFavorite],
    );

    return { isFavorite, toggle, onServer };
}
