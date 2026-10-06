export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex min-h-11 items-center justify-center rounded-field bg-danger-700 px-5 py-2.5 font-body text-sm font-semibold text-white transition duration-150 ease-in-out hover:bg-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600 focus-visible:ring-offset-2 ${
                    disabled && 'cursor-not-allowed opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
