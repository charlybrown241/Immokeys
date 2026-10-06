import { useCallback, useSyncExternalStore } from 'react';

// Last searches made on the results page, kept in this browser only
// (localStorage): there is no saved-search table on the server.
const KEY = 'immokeys:recherches';
const MAX = 6;
const FIELDS = ['search', 'category_id', 'max_price', 'min_price', 'sort'];
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

function write(searches) {
    cache = searches;
    try {
        window.localStorage.setItem(KEY, JSON.stringify(searches));
    } catch {
        // Storage unavailable: keep the in-memory list only.
    }
    listeners.forEach((listener) => listener());
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/** Keeps only the filters worth replaying; null when nothing is set. */
export function normalizeSearch(filters) {
    const entries = FIELDS.map((key) => [key, filters[key]]).filter(
        ([, value]) => value !== undefined && value !== null && String(value).trim() !== '',
    );
    return entries.length ? Object.fromEntries(entries.map(([key, value]) => [key, String(value).trim()])) : null;
}

const emptyServerSnapshot = [];

export default function useRecentSearches() {
    const searches = useSyncExternalStore(subscribe, read, () => emptyServerSnapshot);

    const remember = useCallback((filters) => {
        const search = normalizeSearch(filters);
        if (!search) return;
        const key = JSON.stringify(search);
        write([search, ...read().filter((item) => JSON.stringify(item) !== key)].slice(0, MAX));
    }, []);

    const clear = useCallback(() => write([]), []);

    return { searches, remember, clear };
}
