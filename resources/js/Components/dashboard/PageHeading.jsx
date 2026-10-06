/** Title row passed to DashboardLayout's `header` slot. */
export default function PageHeading({ title, subtitle, actions }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 className="font-heading text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-ui-muted">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
    );
}
