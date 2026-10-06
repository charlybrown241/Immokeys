import { cx, focusRing } from '@/Components/ui';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const base = cx(
    'inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-field px-3 text-sm font-semibold transition',
    focusRing,
);

/**
 * Laravel paginator links rendered as Inertia links. The first and last
 * entries are "previous" / "next"; the others are page numbers or "...".
 */
export default function Pagination({ links, className = '' }) {
    if (!links || links.length <= 3) return null;

    const pages = links.slice(1, -1);
    const previous = links[0];
    const next = links[links.length - 1];

    const arrow = (link, label, Icon, iconAfter = false) =>
        link.url ? (
            <Link href={link.url} preserveState className={cx(base, 'border border-ui-border bg-white text-navy-900 hover:border-navy-900')}>
                {!iconAfter && <Icon size={18} aria-hidden="true" />}
                <span className="hidden sm:inline">{label}</span>
                <span className="sr-only sm:hidden">{label}</span>
                {iconAfter && <Icon size={18} aria-hidden="true" />}
            </Link>
        ) : (
            <span aria-disabled="true" className={cx(base, 'border border-ui-border bg-white text-ui-muted opacity-50')}>
                {!iconAfter && <Icon size={18} aria-hidden="true" />}
                <span className="hidden sm:inline">{label}</span>
                <span className="sr-only sm:hidden">{label}</span>
                {iconAfter && <Icon size={18} aria-hidden="true" />}
            </span>
        );

    return (
        <nav aria-label="Pagination" className={cx('flex flex-wrap items-center justify-center gap-2', className)}>
            {arrow(previous, 'Précédent', ChevronLeft)}
            <ul className="flex flex-wrap items-center gap-2">
                {pages.map((link, index) => (
                    <li key={`${link.label}-${index}`}>
                        {link.url ? (
                            <Link
                                href={link.url}
                                preserveState
                                aria-current={link.active ? 'page' : undefined}
                                aria-label={`Page ${link.label}`}
                                className={cx(
                                    base,
                                    link.active
                                        ? 'bg-navy-900 text-white'
                                        : 'border border-ui-border bg-white text-navy-900 hover:border-navy-900',
                                )}
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <span className={cx(base, 'text-ui-muted')}>{link.label}</span>
                        )}
                    </li>
                ))}
            </ul>
            {arrow(next, 'Suivant', ChevronRight, true)}
        </nav>
    );
}
