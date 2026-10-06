export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex min-h-11 items-center justify-center rounded-field bg-gold-gradient px-5 py-2.5 font-body text-sm font-semibold text-navy-900 shadow-card transition duration-150 ease-in-out hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600 focus-visible:ring-offset-2 ${
                    disabled && 'cursor-not-allowed opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
