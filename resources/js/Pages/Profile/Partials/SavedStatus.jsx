import { CircleCheck } from 'lucide-react';

// Live region kept in the DOM so screen readers announce the change.
export default function SavedStatus({ show, children = 'Modifications enregistrées.' }) {
    return (
        <p role="status" className="inline-flex min-h-6 items-center gap-1.5 text-sm font-medium text-success-700">
            {show && (
                <>
                    <CircleCheck size={16} aria-hidden="true" />
                    {children}
                </>
            )}
        </p>
    );
}
