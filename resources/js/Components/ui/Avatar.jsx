import { useState } from 'react';
import { cx } from './styles';

const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
};

function initials(name = '') {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

/** Round avatar: photo when `src` loads, otherwise initials on navy. */
export default function Avatar({ src, name = '', size = 'md', className = '' }) {
    const [failed, setFailed] = useState(false);
    const base = cx('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full', sizes[size], className);

    if (src && !failed) {
        return <img src={src} alt={name} onError={() => setFailed(true)} className={cx(base, 'object-cover')} />;
    }

    return (
        <span role="img" aria-label={name} className={cx(base, 'bg-navy-900 font-heading font-bold text-gold-300')}>
            <span aria-hidden="true">{initials(name)}</span>
        </span>
    );
}
