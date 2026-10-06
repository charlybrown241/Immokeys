// Original flat illustration: an owner raising a key in front of a house.
// Navy, gold and off-white only.
export default function LandlordIllustration({ className = '' }) {
    return (
        <svg viewBox="0 0 320 440" className={className} aria-hidden="true" focusable="false">
            <circle cx="160" cy="210" r="150" className="fill-gold-50" />
            <ellipse cx="160" cy="400" rx="130" ry="12" className="fill-navy-900 opacity-10" />

            {/* Sparkles */}
            <path d="M246 58l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" className="fill-gold-300" />
            <path d="M40 120l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" className="fill-gold-500" />
            <circle cx="300" cy="300" r="4" className="fill-navy-800 opacity-30" />

            {/* House */}
            <rect x="150" y="140" width="20" height="44" className="fill-navy-800" />
            <rect x="40" y="200" width="150" height="196" rx="6" className="fill-white" />
            <polygon points="28,208 115,128 202,208" className="fill-navy-900" />
            <rect x="58" y="230" width="36" height="36" rx="4" className="fill-gold-100" />
            <path d="M76 230v36M58 248h36" strokeWidth="3" className="stroke-navy-900" />
            <rect x="136" y="230" width="36" height="36" rx="4" className="fill-gold-100" />
            <path d="M154 230v36M136 248h36" strokeWidth="3" className="stroke-navy-900" />
            <path d="M96 396v-76a20 20 0 0 1 40 0v76z" className="fill-gold-500" />
            <circle cx="126" cy="356" r="3" className="fill-navy-900" />

            {/* Owner */}
            <rect x="218" y="300" width="18" height="92" rx="8" className="fill-navy-950" />
            <rect x="242" y="300" width="18" height="92" rx="8" className="fill-navy-950" />
            <ellipse cx="225" cy="395" rx="14" ry="6" className="fill-navy-950" />
            <ellipse cx="253" cy="395" rx="14" ry="6" className="fill-navy-950" />
            <path d="M214 214L204 288" strokeWidth="16" strokeLinecap="round" className="stroke-navy-900" />
            <circle cx="203" cy="294" r="8" className="fill-gold-100" />
            <rect x="208" y="196" width="62" height="118" rx="22" className="fill-navy-900" />
            <path d="M226 196l13 30 13-30z" className="fill-white" />
            <path d="M236 204h6l2 22-5 6-5-6z" className="fill-gold-500" />
            <rect x="231" y="176" width="16" height="24" rx="6" className="fill-gold-100" />
            <circle cx="239" cy="156" r="27" className="fill-gold-100" />
            <path d="M212 154a27 27 0 0 1 54 0c-6-6-14-9-27-9s-21 3-27 9z" className="fill-navy-950" />
            <circle cx="231" cy="160" r="2.5" className="fill-navy-950" />
            <circle cx="247" cy="160" r="2.5" className="fill-navy-950" />
            <path d="M232 169q7 6 14 0" strokeWidth="2.5" strokeLinecap="round" className="fill-none stroke-navy-950" />

            {/* Raised arm and key */}
            <path d="M262 212L282 150" strokeWidth="16" strokeLinecap="round" className="stroke-navy-900" />
            <rect x="279" y="118" width="8" height="58" rx="3" className="fill-gold-600" />
            <rect x="287" y="160" width="10" height="6" rx="1.5" className="fill-gold-600" />
            <rect x="287" y="170" width="7" height="6" rx="1.5" className="fill-gold-600" />
            <circle cx="283" cy="100" r="22" className="fill-gold-500" />
            <circle cx="283" cy="100" r="8" className="fill-gold-50" />
            <circle cx="283" cy="144" r="9" className="fill-gold-100" />
        </svg>
    );
}
