import { Card, cx } from '@/Components/ui';
import { useId } from 'react';

/** Dashboard section: a card with a titled header and an optional action. */
export default function Panel({ title, description, action, className = '', bodyClassName = 'mt-5', children }) {
    const titleId = useId();

    return (
        <Card as="section" aria-labelledby={titleId} className={cx('min-w-0', className)}>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 id={titleId} className="font-heading text-lg font-bold text-navy-900">
                        {title}
                    </h2>
                    {description && <p className="mt-0.5 text-sm text-ui-muted">{description}</p>}
                </div>
                {action}
            </div>
            <div className={bodyClassName}>{children}</div>
        </Card>
    );
}
