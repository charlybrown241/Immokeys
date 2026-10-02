import { Link } from '@inertiajs/react';

/**
 * Navbar link. The active link is underlined by a 2px accent bar drawn
 * ~16px below the text rather than as a border glued to it; py-2.5 keeps
 * a 40px hit area.
 */
export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'relative inline-flex items-center py-2.5 text-sm font-semibold transition duration-150 ease-in-out focus:outline-none focus-visible:text-navbar-ink ' +
                (active
                    ? 'text-navbar-ink after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:rounded-full after:bg-accent '
                    : 'text-navbar-ink-dim hover:text-navbar-ink ') +
                className
            }
        >
            {children}
        </Link>
    );
}
