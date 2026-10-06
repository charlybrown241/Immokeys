import { Alert } from '@/Components/ui';
import { usePage } from '@inertiajs/react';

/** Session flash messages (success / error) as kit alerts. */
export default function FlashMessages() {
    const { flash } = usePage().props;

    return (
        <>
            {flash?.success && <Alert variant="success">{flash.success}</Alert>}
            {flash?.error && <Alert variant="danger">{flash.error}</Alert>}
        </>
    );
}
