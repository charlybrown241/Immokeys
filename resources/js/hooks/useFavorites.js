import { useCallback, useSyncExternalStore } from 'react';

// Favourites are kept in this browser only (localStorage): there is no
// favourites table on the server yet. Every card shares one store so a
// toggle is reflected everywhere at once.
const KEY = 'immokeys:favoris';
const listeners = new Set();
let cache = null;

function read() {
    if (cache) return cache;
    try {
        cache = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    } catch {
        cache = [];
    }
    return cache;
}

function write(ids) {
    cache = ids;
    try {
        window.localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
        // Storage unavailable (private mode...): keep the in-memory state.
    }
    listeners.forEach((listener) => listener());
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/** Current favourite ids, outside React (e.g. to send them to the server). */
export function favoriteIds() {
    return read();
}

const emptyServerSnapshot = [];

export default function useFavorites() {
    const ids = useSyncExternalStore(subscribe, read, () => emptyServerSnapshot);

    const toggle = useCallback((id) => {
        const current = read();
        write(current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
    }, []);

    return { isFavorite: (id) => ids.includes(id), toggle };
}
