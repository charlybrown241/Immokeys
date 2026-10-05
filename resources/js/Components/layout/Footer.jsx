import Logo from '@/Components/Logo';
import { cx, focusRing } from '@/Components/ui';
import { QUARTIERS, quartierUrl } from '@/Constants/quartiers';
import { Link, usePage } from '@inertiajs/react';
import { Mail, MapPin, MessageCircle } from 'lucide-react';

// lucide-react no longer ships brand icons, so the two logos are drawn here.
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

// Placeholder accounts: no real profiles exist yet.
const SOCIALS = [
    { label: 'Instagram', icon: InstagramIcon },
    { label: 'Facebook', icon: FacebookIcon },
];

const headingClasses = 'font-heading text-sm font-bold uppercase tracking-wider text-gold-300';

const linkClasses = cx(
    'rounded-md text-sm text-white/75 transition hover:text-white',
    focusRing,
    'focus-visible:ring-offset-navy-950',
);

function Column({ title, id, children }) {
    return (
        <div id={id} className="scroll-mt-24">
            <h2 className={headingClasses}>{title}</h2>
            <ul className="mt-4 space-y-3">{children}</ul>
        </div>
    );
}

/** Navy footer with four columns, shared by the public pages. */
export default function Footer() {
    const { platform } = usePage().props;
    const whatsapp = platform?.whatsapp;

    return (
        <footer className="bg-navy-950 font-body text-white">
            <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 md:px-7">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <Logo variant="dark" height={36} />
                        <p className="mt-4 max-w-[240px] text-sm leading-relaxed text-white/75">
                            La location étudiante en confiance à Casablanca, avec des propriétaires certifiés.
                        </p>
                        <div className="mt-6 flex gap-3">
                            {SOCIALS.map(({ label, icon: Icon }) => (
                                <a
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    title={label}
                                    className={cx(
                                        'inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition hover:border-gold-300 hover:text-gold-300',
                                        focusRing,
                                        'focus-visible:ring-offset-navy-950',
                                    )}
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    <Column title="Explorer">
                        <li>
                            <Link href={route('annonces.index')} className={linkClasses}>
                                Tous les logements
                            </Link>
                        </li>
                        {QUARTIERS.slice(0, 4).map((quartier) => (
                            <li key={quartier}>
                                <Link href={quartierUrl(quartier)} className={linkClasses}>
                                    Logements à {quartier}
                                </Link>
                            </li>
                        ))}
                    </Column>

                    <Column title="Ressources">
                        <li>
                            <Link href={route('pages.how-it-works')} className={linkClasses}>
                                Comment ça marche
                            </Link>
                        </li>
                        <li>
                            <Link href={route('pages.security')} className={linkClasses}>
                                Sécurité et certification
                            </Link>
                        </li>
                        <li>
                            <Link href={`${route('register')}?role=proprietaire`} className={linkClasses}>
                                Devenir propriétaire
                            </Link>
                        </li>
                    </Column>

                    <Column title="Contact" id="contact">
                        <li>
                            <a href="mailto:contact@immokeys.ma" className={cx('inline-flex items-center gap-2 break-all', linkClasses)}>
                                <Mail size={16} className="shrink-0 text-gold-300" aria-hidden="true" />
                                contact@immokeys.ma
                            </a>
                        </li>
                        {whatsapp && (
                            <li>
                                <a
                                    href={`https://wa.me/${whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cx('inline-flex items-center gap-2', linkClasses)}
                                >
                                    <MessageCircle size={16} className="shrink-0 text-gold-300" aria-hidden="true" />
                                    WhatsApp
                                </a>
                            </li>
                        )}
                        <li className="inline-flex items-center gap-2 text-sm text-white/75">
                            <MapPin size={16} className="shrink-0 text-gold-300" aria-hidden="true" />
                            Casablanca, Maroc
                        </li>
                    </Column>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {new Date().getFullYear()} <span translate="no">ImmoKeys</span>. Tous droits réservés.
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <Link href={route('pages.legal')} className={cx(linkClasses, 'text-xs')}>
                            Mentions légales
                        </Link>
                        <Link href={route('pages.privacy')} className={cx(linkClasses, 'text-xs')}>
                            Politique de confidentialité
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
