import { cx, focusRing } from '@/Components/ui';
import { Link, usePage } from '@inertiajs/react';
import { House, MessageCircle } from 'lucide-react';

const linkClasses = cx(
    'rounded-md text-white/80 underline-offset-4 transition hover:text-white hover:underline',
    focusRing,
    'focus-visible:ring-offset-navy-950',
);

/** Thin navy strip above the public navbar: live stats, contact, account. */
export default function PublicInfoBar() {
    const { auth, platform } = usePage().props;
    const count = platform?.active_annonces_count ?? 0;
    const whatsapp = platform?.whatsapp;

    return (
        <div className="bg-navy-950 font-body text-xs text-white/80 sm:text-sm">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 md:px-7">
                <p className="inline-flex items-center gap-2">
                    <House size={15} className="text-gold-300" aria-hidden="true" />
                    <span>
                        <strong className="font-semibold text-gold-300">{count.toLocaleString('fr-FR')}</strong>{' '}
                        {count > 1 ? 'logements disponibles' : 'logement disponible'} à Casablanca
                    </span>
                </p>

                <div className="flex items-center gap-4">
                    {whatsapp && (
                        <a
                            href={`https://wa.me/${whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cx('hidden items-center gap-1.5 sm:inline-flex', linkClasses)}
                        >
                            <MessageCircle size={15} aria-hidden="true" />
                            Nous contacter sur WhatsApp
                        </a>
                    )}

                    {auth.user ? (
                        <>
                            <Link href={route(auth.home_route)} className={linkClasses}>
                                Mon espace
                            </Link>
                            <Link href={route('logout')} method="post" as="button" className={linkClasses}>
                                Déconnexion
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href={route('login')} className={linkClasses}>
                                Connexion
                            </Link>
                            <span aria-hidden="true" className="text-white/30">
                                |
                            </span>
                            <Link href={route('register')} className={linkClasses}>
                                Inscription
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
