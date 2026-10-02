import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-2 py-2 pe-4 ps-3 ${
                active
                    ? 'border-accent bg-white/5 text-navbar-ink focus:bg-white/10'
                    : 'border-transparent text-navbar-ink-dim hover:bg-white/5 hover:text-navbar-ink focus:bg-white/5 focus:text-navbar-ink'
            } text-sm font-semibold transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
