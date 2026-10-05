import LandlordIllustration from '@/Components/illustrations/LandlordIllustration';
import StudentsIllustration from '@/Components/illustrations/StudentsIllustration';
import Logo from '@/Components/Logo';
import { cx, focusRing } from '@/Components/ui';
import { Link } from '@inertiajs/react';

/**
 * Auth screens (login, register, password reset): logo above a centered
 * white card, with flat illustrations on each side from lg up. `below`
 * renders under the card (e.g. a back link).
 */
export default function AuthLayout({ below, children }) {
    return (
        <div className="flex min-h-screen flex-col bg-ui-bg font-body text-ui-text">
            <main className="flex flex-1 items-center justify-center gap-8 px-4 py-12 xl:gap-16">
                <StudentsIllustration className="hidden w-60 shrink-0 lg:block xl:w-72" />

                <div className="w-full max-w-[440px]">
                    <div className="flex justify-center">
                        <Link href="/" aria-label="ImmoKeys, accueil" className={cx('rounded-md p-2', focusRing)}>
                            <Logo variant="light" height={40} />
                        </Link>
                    </div>

                    <div className="mt-6 rounded-card border border-ui-border bg-white p-6 shadow-card sm:p-8">
                        {children}
                    </div>

                    {below && <div className="mt-6 text-center">{below}</div>}
                </div>

                <LandlordIllustration className="hidden w-60 shrink-0 lg:block xl:w-72" />
            </main>

            <footer className="flex flex-wrap justify-center gap-x-6 gap-y-2 px-4 pb-6 text-xs text-ui-muted">
                <span>
                    © {new Date().getFullYear()} <span translate="no">ImmoKeys</span>
                </span>
                <Link href={route('pages.legal')} className={cx('rounded-md hover:text-ui-text', focusRing)}>
                    Mentions légales
                </Link>
                <Link href={route('pages.privacy')} className={cx('rounded-md hover:text-ui-text', focusRing)}>
                    Confidentialité
                </Link>
            </footer>
        </div>
    );
}
