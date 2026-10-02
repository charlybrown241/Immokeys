import ApplicationLogo from '@/Components/ApplicationLogo';
import Footer from '@/Components/Footer';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-bg">
            <div className="flex flex-1 flex-col items-center pb-12 pt-6 sm:justify-center sm:pt-12">
                <div>
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 fill-current text-terracotta" />
                    </Link>
                </div>

                <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-2xl">
                    {children}
                </div>
            </div>

            <Footer />
        </div>
    );
}
