import { DialogBackdrop, DialogPanel, DialogTitle, Dialog as HeadlessDialog } from '@headlessui/react';

/**
 * Centered modal (confirmations). Headless UI handles focus trap, Escape
 * and scroll lock; `actions` renders the button row.
 */
export default function Dialog({ open, onClose, title, description, actions, children }) {
    return (
        <HeadlessDialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-navy-950/60 transition-opacity duration-150 data-[closed]:opacity-0 motion-reduce:transition-none"
            />
            <div className="fixed inset-0 flex items-end justify-center p-4 sm:items-center">
                <DialogPanel
                    transition
                    className="w-full max-w-md rounded-card bg-white p-6 font-body shadow-float transition duration-150 data-[closed]:scale-95 data-[closed]:opacity-0 motion-reduce:transition-none"
                >
                    <DialogTitle className="font-heading text-lg font-bold text-navy-900">{title}</DialogTitle>
                    {description && <p className="mt-2 text-sm text-ui-muted">{description}</p>}
                    {children}
                    {actions && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{actions}</div>}
                </DialogPanel>
            </div>
        </HeadlessDialog>
    );
}
