import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import { cx, focusRing } from './styles';

/**
 * Off-canvas panel for mobile navigation. Headless UI handles the focus
 * trap, Escape key and scroll lock; `side` picks the edge it slides from.
 */
export default function Drawer({ open, onClose, title, side = 'left', className = '', children }) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-navy-950/60 transition-opacity duration-200 data-[closed]:opacity-0 motion-reduce:transition-none"
            />
            <div className={cx('fixed inset-y-0 flex w-full max-w-xs', side === 'left' ? 'left-0' : 'right-0')}>
                <DialogPanel
                    transition
                    className={cx(
                        'relative flex w-full flex-col overflow-y-auto shadow-float transition duration-200 ease-out motion-reduce:transition-none',
                        side === 'left' ? 'data-[closed]:-translate-x-full' : 'data-[closed]:translate-x-full',
                        className,
                    )}
                >
                    <DialogTitle className="sr-only">{title}</DialogTitle>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer le menu"
                        className={cx(
                            'absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-field text-current opacity-80 transition hover:opacity-100',
                            focusRing,
                        )}
                    >
                        <X size={22} aria-hidden="true" />
                    </button>
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    );
}
