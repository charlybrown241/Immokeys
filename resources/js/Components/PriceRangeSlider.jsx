export default function PriceRangeSlider({ min, max, step = 100, value, onChange }) {
    const [minVal, maxVal] = value;
    const gap = step;

    const handleMinChange = (e) => {
        const next = Math.min(Number(e.target.value), maxVal - gap);
        onChange([next, maxVal]);
    };

    const handleMaxChange = (e) => {
        const next = Math.max(Number(e.target.value), minVal + gap);
        onChange([minVal, next]);
    };

    const minPercent = ((minVal - min) / (max - min)) * 100;
    const maxPercent = ((maxVal - min) / (max - min)) * 100;

    return (
        <div>
            <div className="dual-range">
                <div className="dual-range-track" />
                <div
                    className="dual-range-track-fill"
                    style={{
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`,
                    }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={minVal}
                    onChange={handleMinChange}
                    aria-label="Prix minimum"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={maxVal}
                    onChange={handleMaxChange}
                    aria-label="Prix maximum"
                />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span>{minVal.toLocaleString('fr-FR')} MAD</span>
                <span>
                    {maxVal >= max
                        ? `${max.toLocaleString('fr-FR')}+ MAD`
                        : `${maxVal.toLocaleString('fr-FR')} MAD`}
                </span>
            </div>
        </div>
    );
}
