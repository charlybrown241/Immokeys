import { Badge, cx } from '@/Components/ui';
import { ImagePlus, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

// Mirrors AnnonceStoreRequest: up to 10 photos, jpg/png/webp, 5 MB each.
export const MAX_PHOTOS = 10;
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = '.jpg,.jpeg,.png,.webp';
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Photo selection with previews. Files are added to the selection (not
 * replaced), invalid ones are rejected with a message, the first photo is
 * the main one. `serverErrors` are Laravel's photos / photos.N messages.
 */
export default function PhotoPicker({ files, onChange, serverErrors = [] }) {
    const inputId = useId();
    const [previews, setPreviews] = useState([]);
    const [rejected, setRejected] = useState([]);

    useEffect(() => {
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviews(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [files]);

    const add = (event) => {
        const picked = Array.from(event.target.files ?? []);
        event.target.value = '';
        const messages = [];
        const valid = picked.filter((file) => {
            if (!TYPES.includes(file.type)) {
                messages.push(`« ${file.name} » : format non accepté (JPG, PNG ou WebP).`);
                return false;
            }
            if (file.size > MAX_BYTES) {
                messages.push(`« ${file.name} » dépasse 5 Mo.`);
                return false;
            }
            return true;
        });
        const room = MAX_PHOTOS - files.length;
        if (valid.length > room) {
            messages.push(`${MAX_PHOTOS} photos maximum : ${valid.length - room} photo(s) non ajoutée(s).`);
        }
        setRejected(messages);
        onChange([...files, ...valid.slice(0, Math.max(room, 0))]);
    };

    const remove = (index) => onChange(files.filter((_, i) => i !== index));
    const errors = [...rejected, ...serverErrors];
    const full = files.length >= MAX_PHOTOS;

    return (
        <div className="space-y-4">
            <div>
                <label
                    htmlFor={inputId}
                    className={cx(
                        'flex flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed px-6 py-10 text-center transition',
                        'focus-within:ring-2 focus-within:ring-gold-600 focus-within:ring-offset-2',
                        full ? 'cursor-not-allowed border-ui-border bg-ui-bg opacity-60' : 'cursor-pointer border-ui-border bg-white hover:border-navy-900 hover:bg-ui-bg',
                    )}
                >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                        <ImagePlus size={24} aria-hidden="true" />
                    </span>
                    <span className="font-semibold text-navy-900">{full ? 'Nombre maximum de photos atteint' : 'Ajouter des photos'}</span>
                    <span className="text-sm text-ui-muted">
                        JPG, PNG ou WebP · 5 Mo max par photo · {files.length}/{MAX_PHOTOS}
                    </span>
                    <input
                        id={inputId}
                        type="file"
                        accept={ACCEPT}
                        multiple
                        disabled={full}
                        onChange={add}
                        aria-describedby={errors.length ? `${inputId}-errors` : undefined}
                        className="sr-only"
                    />
                </label>
                {errors.length > 0 && (
                    <ul id={`${inputId}-errors`} className="mt-2 space-y-1 text-sm text-danger-700">
                        {errors.map((message) => (
                            <li key={message}>{message}</li>
                        ))}
                    </ul>
                )}
            </div>

            {files.length > 0 ? (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {files.map((file, index) => (
                        <li key={`${file.name}-${file.lastModified}-${index}`} className="relative overflow-hidden rounded-field border border-ui-border">
                            {previews[index] && <img src={previews[index]} alt={`Aperçu : ${file.name}`} className="aspect-[4/3] w-full object-cover" />}
                            {index === 0 && (
                                <Badge variant="navy" className="absolute left-2 top-2">
                                    Photo principale
                                </Badge>
                            )}
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                aria-label={`Retirer la photo ${index + 1} (${file.name})`}
                                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-danger-700 shadow-card transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-600"
                            >
                                <X size={16} aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-ui-muted">
                    Aucune photo pour l'instant. Les photos aident les étudiants à se projeter ; elles restent facultatives.
                </p>
            )}
        </div>
    );
}
