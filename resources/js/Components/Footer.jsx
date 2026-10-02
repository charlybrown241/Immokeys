import { BrandLogo } from '@/Components/PublicNavbar';
import { Link } from '@inertiajs/react';

function InstagramIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z" />
        </svg>
    );
}

function WhatsappIcon() {
    return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L4 20l1.1-4.5A8.5 8.5 0 1 1 21 11.5Z" />
            <path d="M8.5 10.5c0 3 2.5 5.5 5.5 5.5" />
        </svg>
    );
}

// Placeholder accounts: no real profiles exist yet.
const SOCIALS = [
    { label: 'Instagram', icon: InstagramIcon },
    { label: 'Facebook', icon: FacebookIcon },
    { label: 'WhatsApp', icon: WhatsappIcon },
];

const headingClasses =
    'text-xs font-semibold uppercase tracking-wider text-navbar-ink-dim';

const linkClasses = 'text-sm text-navbar-ink-dim transition hover:text-terracotta-300';

export default function Footer() {
    return (
        <footer className="bg-navbar text-navbar-ink-dim">
            <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    <div>
                        <BrandLogo />
                        <p className="mt-4 max-w-xs font-display text-lg leading-snug text-navbar-ink/90">
                            La location étudiante en confiance à Casablanca.
                        </p>
                    </div>

                    <div>
                        <h2 className={headingClasses}>Navigation</h2>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="/" className={linkClasses}>
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link href={route('annonces.index')} className={linkClasses}>
                                    Rechercher un logement
                                </Link>
                            </li>
                            <li>
                                <Link href={`${route('register')}?role=proprietaire`} className={linkClasses}>
                                    Devenir propriétaire
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className={headingClasses}>Confiance</h2>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href={route('pages.how-it-works')} className={linkClasses}>
                                    Comment ça marche
                                </Link>
                            </li>
                            <li>
                                <Link href={route('pages.security')} className={linkClasses}>
                                    Sécurité &amp; certification
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className={headingClasses}>Contact</h2>
                        <a
                            href="mailto:contact@immokeys.ma"
                            className={`mt-4 inline-block break-all ${linkClasses}`}
                        >
                            contact@immokeys.ma
                        </a>
                        <div className="mt-5 flex gap-3">
                            {SOCIALS.map(({ label, icon: Icon }) => (
                                <a
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    title={label}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-navbar-ink-dim transition hover:border-terracotta hover:bg-terracotta hover:text-white"
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-navbar-ink-dim sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 <span translate="no">ImmoKeys</span> — Tous droits réservés</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <Link href={route('pages.legal')} className="transition hover:text-navbar-ink">
                            Mentions légales
                        </Link>
                        <Link href={route('pages.privacy')} className="transition hover:text-navbar-ink">
                            Politique de confidentialité
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
