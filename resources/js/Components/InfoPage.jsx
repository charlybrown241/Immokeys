import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

/**
 * Simple content page (how it works, legal notice…) wrapped in the public
 * layout. Sections are passed as { title, body } where body is a string or
 * JSX.
 */
export default function InfoPage({ title, intro, sections }) {
    return (
        <PublicLayout>
            <Head title={title} />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                    {title}
                </h1>
                {intro && (
                    <p className="mt-4 text-lg leading-relaxed text-ink/70">
                        {intro}
                    </p>
                )}

                <div className="mt-10 space-y-6">
                    {sections.map((section) => (
                        <section
                            key={section.title}
                            className="rounded-2xl bg-white p-6 ring-1 ring-line sm:p-8"
                        >
                            <h2 className="font-display text-xl font-semibold text-ink">
                                {section.title}
                            </h2>
                            <div className="mt-3 leading-relaxed text-ink/80">
                                {section.body}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
