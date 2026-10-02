export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-line text-accent focus:ring-accent ' +
                className
            }
        />
    );
}
