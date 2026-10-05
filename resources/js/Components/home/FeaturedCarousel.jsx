import ListingCard from '@/Components/ListingCard';
import { cx, focusRing } from '@/Components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const arrowClasses = cx(
    'inline-flex h-11 w-11 items-center justify-center rounded-full border border-ui-border bg-white text-navy-900 transition hover:border-navy-900 disabled:cursor-not-allowed disabled:opacity-40',
    focusRing,
);

/**
 * Horizontal, scroll-snapping list of listing cards with previous/next
 * buttons. Native scrolling keeps touch, trackpad and keyboard working.
 */
export default function FeaturedCarousel({ annonces, title, titleId }) {
    const trackRef = useRef(null);
    const [edges, setEdges] = useState({ start: true, end: false });

    const updateEdges = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        setEdges({
            start: track.scrollLeft <= 4,
            end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
        });
    }, []);

    useEffect(() => {
        updateEdges();
        window.addEventListener('resize', updateEdges);
        return () => window.removeEventListener('resize', updateEdges);
    }, [updateEdges]);

    const scroll = (direction) => {
        const track = trackRef.current;
        track?.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: 'smooth' });
    };

    return (
        <div role="region" aria-roledescription="carrousel" aria-labelledby={titleId}>
            <div className="flex items-end justify-between gap-4">
                {title}
                <div className="hidden gap-2 sm:flex">
                    <button
                        type="button"
                        onClick={() => scroll(-1)}
                        disabled={edges.start}
                        aria-label="Logements précédents"
                        className={arrowClasses}
                    >
                        <ChevronLeft size={20} aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scroll(1)}
                        disabled={edges.end}
                        aria-label="Logements suivants"
                        className={arrowClasses}
                    >
                        <ChevronRight size={20} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <ul
                ref={trackRef}
                onScroll={updateEdges}
                className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scroll-px-4 px-4 pb-4 motion-reduce:scroll-auto md:-mx-7 md:scroll-px-7 md:px-7"
            >
                {annonces.map((annonce) => (
                    <li
                        key={annonce.id}
                        className="w-[82%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.7rem)] xl:w-[calc(25%-0.75rem)]"
                    >
                        <ListingCard annonce={annonce} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
