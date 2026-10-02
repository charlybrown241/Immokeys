import Footer from '@/Components/Footer';
import { Link } from '@inertiajs/react';

/**
 * Auth screens (login, register, password reset): no navbar, the brand name
 * above a centered card, and the public footer below.
 */
export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-bg">
            <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
                <Link
                    href="/"
                    translate="no"
                    className="font-display text-[1.75rem] font-semibold tracking-tight text-ink"
                >
                    ImmoKeys
                </Link>

                <div className="mt-6 w-full max-w-[340px] rounded-card bg-surface p-[26px] shadow-card">
                    {children}
                </div>
            </div>

            <Footer />
        </div>
    );
}
