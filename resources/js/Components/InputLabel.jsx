export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block font-body text-sm font-medium text-ui-text ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
