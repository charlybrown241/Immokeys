import { cx, focusRing } from '@/Components/ui';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { Archive, CircleCheck, EllipsisVertical, RotateCcw } from 'lucide-react';

const ACTIONS = [
    { status: 'traite', label: 'Marquer comme traitée', icon: CircleCheck },
    { status: 'nouveau', label: 'Remettre en « Nouveau »', icon: RotateCcw },
    { status: 'archive', label: 'Archiver', icon: Archive },
];

/** Follow-up actions of a WhatsApp contact (owner dashboard). */
export default function ContactStatusMenu({ contact }) {
    const update = (status) =>
        router.patch(route('contacts.status', contact.id), { status }, { preserveScroll: true });

    return (
        <Menu>
            <MenuButton
                aria-label={`Actions pour la demande de ${contact.student}`}
                className={cx(
                    'inline-flex h-9 w-9 items-center justify-center rounded-field text-ui-muted transition hover:bg-ui-bg hover:text-navy-900',
                    focusRing,
                )}
            >
                <EllipsisVertical size={18} aria-hidden="true" />
            </MenuButton>
            <MenuItems
                transition
                anchor="bottom end"
                className="z-50 mt-1 w-60 rounded-card border border-ui-border bg-white p-1.5 font-body shadow-float transition duration-100 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                {ACTIONS.filter((action) => action.status !== contact.status).map(({ status, label, icon: Icon }) => (
                    <MenuItem key={status}>
                        <button
                            type="button"
                            onClick={() => update(status)}
                            className="flex w-full items-center gap-2.5 rounded-field px-3 py-2.5 text-left text-sm text-ui-text data-[focus]:bg-ui-bg"
                        >
                            <Icon size={16} className="text-ui-muted" aria-hidden="true" />
                            {label}
                        </button>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
}
