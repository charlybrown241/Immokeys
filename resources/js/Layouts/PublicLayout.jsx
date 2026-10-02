import Footer from '@/Components/Footer';
import PublicNavbar from '@/Components/PublicNavbar';

/**
 * Shell for visitor/student-facing pages: dark navbar, cream body, footer.
 * Owner dashboard and admin screens keep AuthenticatedLayout (no footer).
 */
export default function PublicLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-bg">
            <PublicNavbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
