import { cx } from './styles';

const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
};

/** White surface with 16px radius, light border and soft shadow. */
export default function Card({ as: Component = 'div', padding = 'md', className = '', children, ...props }) {
    return (
        <Component
            {...props}
            className={cx('rounded-card border border-ui-border bg-white shadow-card', paddings[padding], className)}
        >
            {children}
        </Component>
    );
}
