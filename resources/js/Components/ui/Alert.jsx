import { CheckCircle, CircleAlert, Info } from 'lucide-react';
import { cx } from './styles';

const variants = {
    success: { classes: 'border-success/20 bg-success-50 text-success-700', icon: CheckCircle, role: 'status' },
    info: { classes: 'border-gold-600/30 bg-gold-50 text-ui-text', icon: Info, role: 'status' },
    danger: { classes: 'border-danger/20 bg-danger-50 text-danger-700', icon: CircleAlert, role: 'alert' },
};

/** Inline message box (form status, explanation, error). */
export default function Alert({ variant = 'info', icon, title, className = '', children }) {
    const config = variants[variant];
    const Icon = icon ?? config.icon;

    return (
        <div role={config.role} className={cx('flex items-start gap-2.5 rounded-field border p-3.5 text-sm', config.classes, className)}>
            <Icon size={18} className={cx('mt-px shrink-0', variant === 'info' && 'text-gold-700')} aria-hidden="true" />
            <div>
                {title && <p className="font-semibold">{title}</p>}
                <div className={title ? 'mt-0.5' : 'font-medium'}>{children}</div>
            </div>
        </div>
    );
}
