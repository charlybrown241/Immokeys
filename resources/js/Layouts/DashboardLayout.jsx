import DashboardSidebar from '@/Components/layout/DashboardSidebar';
import DashboardTopbar from '@/Components/layout/DashboardTopbar';
import { Drawer } from '@/Components/ui';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * Shell of the signed-in areas (owner, student, admin): fixed 260px navy
 * sidebar on desktop, drawer on mobile, white top bar, optional page header.
 */
export default function DashboardLayout({ header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close the mobile drawer after any Inertia navigation.
    useEffect(() => router.on('navigate', () => setSidebarOpen(false)), []);

    return (
        <div className="min-h-screen bg-ui-bg font-body text-ui-text">
            <a
                href="#contenu"
                className="sr-only z-50 rounded-field bg-gold-gradient px-4 py-2 font-semibold text-navy-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
                Aller au contenu
            </a>

            <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] lg:flex">
                <DashboardSidebar />
            </aside>

            <Drawer
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                title="Navigation"
                className="bg-navy-950 text-white"
            >
                <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
            </Drawer>

            <div className="flex min-h-screen flex-col lg:pl-[260px]">
                <DashboardTopbar onOpenSidebar={() => setSidebarOpen(true)} />

                {header && (
                    <header className="border-b border-ui-border bg-white">
                        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}

                <main id="contenu" className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
