import { Badge, Button, cx, Dialog, focusRing, Skeleton } from '@/Components/ui';
import { router, usePage } from '@inertiajs/react';
import { ImagePlus, Loader2, Star, Trash2 } from 'lucide-react';
import { useId, useState } from 'react';
import { checkPhotoFiles, MAX_PHOTOS, PHOTO_ACCEPT } from './PhotoPicker';

/**
 * Photos of an existing annonce, saved immediately: add, remove (confirmed)
 * and choose the main photo. preserveState keeps the unsaved edits of the
 * surrounding form.
 */
export default function PhotoManager({ annonceId, photos }) {
    const inputId = useId();
    const { errors } = usePage().props;
    const [busy, setBusy] = useState(null);
    const [rejected, setRejected] = useState([]);
    const [toDelete, setToDelete] = useState(null);

    const options = (action, id = null) => ({
        preserveState: true,
        preserveScroll: true,
        onStart: () => setBusy({ action, id }),
        onFinish: () => {
            setBusy(null);
            setToDelete(null);
        },
    });

    const upload = (event) => {
        const picked = Array.from(event.target.files ?? []);
        event.target.value = '';
        const { valid, messages } = checkPhotoFiles(picked, MAX_PHOTOS - photos.length);
        setRejected(messages);
        if (valid.length) {
            router.post(route('annonces.photos.store', annonceId), { photos: valid }, { ...options('upload'), forceFormData: true });
        }
    };

    const serverErrors = Object.entries(errors ?? {})
        .filter(([key]) => key === 'photos' || key.startsWith('photos.'))
        .map(([, message]) => message);
    const messages = [...rejected, ...serverErrors];
    const full = photos.length >= MAX_PHOTOS;
    const uploading = busy?.action === 'upload';

    return (
        <div className="space-y-4">
            {photos.length > 0 || uploading ? (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {photos.map((photo, index) => {
                        const isBusy = busy?.id === photo.id;
                        return (
                            <li key={photo.id} className="overflow-hidden rounded-card border border-ui-border bg-white">
                                <div className="relative">
                                    <img
                                        src={`/storage/${photo.path}`}
                                        alt={`Photo ${index + 1} de l'annonce`}
                                        loading="lazy"
                                        className={cx('aspect-[4/3] w-full object-cover transition', isBusy && 'opacity-50')}
                                    />
                                    {index === 0 && (
                                        <Badge variant="navy" icon={Star} className="absolute left-2 top-2">
                                            Principale
                                        </Badge>
                                    )}
                                    {isBusy && (
                                        <span className="absolute inset-0 flex items-center justify-center text-navy-900">
                                            <Loader2 size={24} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
                                            <span className="sr-only">Traitement en cours</span>
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between gap-2 p-2">
                                    {index === 0 ? (
                                        <span className="px-1 text-xs text-ui-muted">Affichée sur les cartes</span>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            icon={Star}
                                            disabled={busy !== null}
                                            onClick={() => router.patch(route('annonces.photos.main', [annonceId, photo.id]), {}, options('main', photo.id))}
                                            aria-label={`Définir la photo ${index + 1} comme principale`}
                                        >
                                            Principale
                                        </Button>
                                    )}
                                    <button
                                        type="button"
                                        disabled={busy !== null}
                                        onClick={() => setToDelete({ ...photo, index })}
                                        aria-label={`Supprimer la photo ${index + 1}`}
                                        className={cx(
                                            'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-field text-danger-700 transition hover:bg-danger-50 disabled:opacity-50',
                                            focusRing,
                                        )}
                                    >
                                        <Trash2 size={16} aria-hidden="true" />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                    {uploading && (
                        <li aria-hidden="true">
                            <Skeleton shape="rect" className="!h-full min-h-32" />
                        </li>
                    )}
                </ul>
            ) : (
                <p className="text-sm text-ui-muted">Cette annonce n'a pas encore de photo.</p>
            )}

            <div>
                <label
                    htmlFor={inputId}
                    className={cx(
                        'flex items-center justify-center gap-3 rounded-card border-2 border-dashed px-4 py-5 text-sm transition',
                        'focus-within:ring-2 focus-within:ring-gold-700 focus-within:ring-offset-2',
                        full || busy ? 'cursor-not-allowed border-ui-border bg-ui-bg opacity-60' : 'cursor-pointer border-ui-border bg-white hover:border-navy-900',
                    )}
                >
                    {uploading ? (
                        <Loader2 size={20} className="animate-spin text-gold-700 motion-reduce:animate-none" aria-hidden="true" />
                    ) : (
                        <ImagePlus size={20} className="text-gold-700" aria-hidden="true" />
                    )}
                    <span className="font-semibold text-navy-900">
                        {uploading ? 'Envoi en cours…' : full ? 'Nombre maximum de photos atteint' : 'Ajouter des photos'}
                    </span>
                    <span className="text-ui-muted">
                        {photos.length}/{MAX_PHOTOS}
                    </span>
                    <input
                        id={inputId}
                        type="file"
                        accept={PHOTO_ACCEPT}
                        multiple
                        disabled={full || busy !== null}
                        onChange={upload}
                        aria-describedby={messages.length ? `${inputId}-errors` : undefined}
                        className="sr-only"
                    />
                </label>
                {messages.length > 0 && (
                    <ul id={`${inputId}-errors`} className="mt-2 space-y-1 text-sm text-danger-700">
                        {messages.map((message) => (
                            <li key={message}>{message}</li>
                        ))}
                    </ul>
                )}
            </div>

            <Dialog
                open={toDelete !== null}
                onClose={() => busy === null && setToDelete(null)}
                title="Supprimer cette photo ?"
                description={
                    toDelete?.index === 0
                        ? 'C’est la photo principale : la suivante la remplacera sur les cartes.'
                        : 'La photo sera définitivement supprimée.'
                }
                actions={
                    <>
                        <Button variant="outline" onClick={() => setToDelete(null)} disabled={busy !== null}>
                            Annuler
                        </Button>
                        <Button
                            variant="danger"
                            icon={Trash2}
                            loading={busy?.action === 'delete'}
                            onClick={() => router.delete(route('annonces.photos.destroy', [annonceId, toDelete.id]), options('delete', toDelete.id))}
                        >
                            Supprimer
                        </Button>
                    </>
                }
            />
        </div>
    );
}
