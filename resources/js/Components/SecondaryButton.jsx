export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex min-h-10 items-center justify-center rounded-input border border-line bg-transparent px-5 py-2.5 text-sm font-semibold text-ink transition duration-150 ease-in-out hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    disabled && 'cursor-not-allowed opacity-40'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
