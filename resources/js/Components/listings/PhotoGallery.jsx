import { cx, focusRing } from '@/Components/ui';
import { ChevronLeft, ChevronRight, House } from 'lucide-react';
import { useState } from 'react';

const arrowClasses = cx(
    'absolute top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-navy-900 shadow-card transition hover:bg-white',
    focusRing,
);

/** Large photo with previous/next arrows and a row of thumbnails. */
export default function PhotoGallery({ photos, title, children }) {
    const [active, setActive] = useState(0);
    const count = photos.length;
    const current = photos[active];

    const go = (delta) => setActive((index) => (index + delta + count) % count);

    return (
        <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-navy-800">
                {current ? (
                    <img
                        src={`/storage/${current.path}`}
                        alt={`${title}, photo ${active + 1} sur ${count}`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-gold-300">
                        <House size={48} aria-hidden="true" />
                        <span className="text-sm text-white/80">Aucune photo pour cette annonce</span>
                    </div>
                )}

                {children}

                {count > 1 && (
                    <>
                        <button type="button" onClick={() => go(-1)} aria-label="Photo précédente" className={cx(arrowClasses, 'left-3')}>
                            <ChevronLeft size={22} aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => go(1)} aria-label="Photo suivante" className={cx(arrowClasses, 'right-3')}>
                            <ChevronRight size={22} aria-hidden="true" />
                        </button>
                        <span className="absolute bottom-3 right-3 rounded-full bg-navy-950/80 px-2.5 py-1 text-xs font-semibold text-white">
                            {active + 1} / {count}
                        </span>
                    </>
                )}
            </div>

            {count > 1 && (
                <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
                    {photos.map((photo, index) => (
                        <li key={photo.id}>
                            <button
                                type="button"
                                onClick={() => setActive(index)}
                                aria-label={`Afficher la photo ${index + 1}`}
                                aria-current={index === active ? 'true' : undefined}
                                className={cx(
                                    'block aspect-square w-full overflow-hidden rounded-field ring-2 ring-offset-2 transition',
                                    focusRing,
                                    index === active ? 'ring-gold-600' : 'ring-transparent opacity-80 hover:opacity-100',
                                )}
                            >
                                <img src={`/storage/${photo.path}`} alt="" loading="lazy" className="h-full w-full object-cover" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
