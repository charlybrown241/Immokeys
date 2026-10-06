import { cx } from './styles';

const shapes = {
    text: 'h-4 w-full rounded-md',
    title: 'h-6 w-2/3 rounded-md',
    circle: 'h-10 w-10 rounded-full',
    rect: 'h-32 w-full rounded-card',
};

/** Loading placeholder; size it with className (h-*, w-*). */
export default function Skeleton({ shape = 'text', className = '' }) {
    return (
        <div
            aria-hidden="true"
            className={cx('animate-pulse bg-ui-border motion-reduce:animate-none', shapes[shape], className)}
        />
    );
}
