export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-terracotta-700 shadow-sm focus:ring-terracotta-500 ' +
                className
            }
        />
    );
}
