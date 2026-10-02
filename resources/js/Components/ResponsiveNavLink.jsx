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
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-terracotta-400 bg-white/5 text-white focus:border-terracotta-300 focus:bg-white/10'
                    : 'border-transparent text-navbar-ink-dim hover:border-navbar-ink-dim/40 hover:bg-white/5 hover:text-white focus:border-navbar-ink-dim/40 focus:bg-white/5 focus:text-white'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
