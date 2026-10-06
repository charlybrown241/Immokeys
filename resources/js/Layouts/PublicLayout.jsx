import FavoritesSync from '@/Components/FavoritesSync';
import Footer from '@/Components/layout/Footer';
import PublicInfoBar from '@/Components/layout/PublicInfoBar';
import PublicNavbar from '@/Components/layout/PublicNavbar';

/**
 * Shell of the visitor/student-facing pages: navy info bar, white sticky
 * navbar, page content and navy footer.
 */
export default function PublicLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-ui-bg font-body text-ui-text">
            <a
                href="#contenu"
                className="sr-only z-50 rounded-field bg-gold-gradient px-4 py-2 font-semibold text-navy-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
                Aller au contenu
            </a>
            <FavoritesSync />
            <PublicInfoBar />
            <PublicNavbar />
            <main id="contenu" className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
