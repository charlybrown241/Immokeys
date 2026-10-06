// Original flat illustration: two students, one with a book and a
// graduation cap, one with a laptop. Navy, gold and off-white only.
export default function StudentsIllustration({ className = '' }) {
    return (
        <svg viewBox="0 0 320 440" className={className} aria-hidden="true" focusable="false">
            <circle cx="160" cy="210" r="150" className="fill-gold-50" />
            <ellipse cx="160" cy="400" rx="130" ry="12" className="fill-navy-900 opacity-10" />

            {/* Sparkles */}
            <path d="M58 70l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" className="fill-gold-300" />
            <path d="M268 64l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" className="fill-gold-500" />
            <circle cx="282" cy="250" r="5" className="fill-gold-300" />
            <circle cx="40" cy="260" r="4" className="fill-navy-800 opacity-30" />

            {/* Student with book and graduation cap */}
            <rect x="72" y="200" width="40" height="70" rx="12" className="fill-navy-800" />
            <rect x="92" y="300" width="18" height="95" rx="8" className="fill-navy-900" />
            <rect x="116" y="300" width="18" height="95" rx="8" className="fill-navy-900" />
            <ellipse cx="99" cy="396" rx="14" ry="6" className="fill-navy-950" />
            <ellipse cx="127" cy="396" rx="14" ry="6" className="fill-navy-950" />
            <rect x="84" y="190" width="58" height="120" rx="24" className="fill-gold-500" />
            <rect x="105" y="172" width="16" height="22" rx="6" className="fill-gold-100" />
            <circle cx="113" cy="150" r="28" className="fill-gold-100" />
            <path d="M85 150a28 28 0 0 1 56 0c-8-8-18-12-28-12s-20 4-28 12z" className="fill-navy-950" />
            <polygon points="113,104 155,120 113,136 71,120" className="fill-navy-950" />
            <rect x="97" y="122" width="32" height="12" rx="3" className="fill-navy-950" />
            <path d="M152 121v22" strokeWidth="3" strokeLinecap="round" className="fill-none stroke-gold-300" />
            <circle cx="152" cy="146" r="4" className="fill-gold-300" />
            <circle cx="104" cy="154" r="2.5" className="fill-navy-950" />
            <circle cx="122" cy="154" r="2.5" className="fill-navy-950" />
            <path d="M106 163q7 6 14 0" strokeWidth="2.5" strokeLinecap="round" className="fill-none stroke-navy-950" />
            <rect x="140" y="200" width="34" height="44" rx="4" className="fill-navy-800" />
            <rect x="146" y="207" width="22" height="4" rx="2" className="fill-gold-300" />
            <rect x="146" y="215" width="15" height="4" rx="2" className="fill-gold-300 opacity-60" />
            <rect x="118" y="222" width="34" height="16" rx="8" className="fill-gold-600" />
            <circle cx="150" cy="230" r="7" className="fill-gold-100" />

            {/* Student with laptop */}
            <rect x="196" y="305" width="18" height="90" rx="8" className="fill-navy-950" />
            <rect x="220" y="305" width="18" height="90" rx="8" className="fill-navy-950" />
            <ellipse cx="203" cy="396" rx="14" ry="6" className="fill-navy-950" />
            <ellipse cx="231" cy="396" rx="14" ry="6" className="fill-navy-950" />
            <rect x="188" y="205" width="58" height="110" rx="24" className="fill-navy-800" />
            <path d="M205 205l12 14 12-14z" className="fill-white" />
            <rect x="209" y="186" width="16" height="22" rx="6" className="fill-gold-100" />
            <circle cx="217" cy="166" r="27" className="fill-gold-100" />
            <circle cx="217" cy="132" r="12" className="fill-navy-950" />
            <path
                d="M190 168a27 27 0 0 1 54 0v26h-10v-22c-6-8-14-12-17-12s-11 4-17 12v22h-10z"
                className="fill-navy-950"
            />
            <circle cx="209" cy="172" r="2.5" className="fill-navy-950" />
            <circle cx="225" cy="172" r="2.5" className="fill-navy-950" />
            <path d="M211 181q6 5 12 0" strokeWidth="2.5" strokeLinecap="round" className="fill-none stroke-navy-950" />
            <rect x="176" y="240" width="64" height="42" rx="5" className="fill-gold-300" />
            <circle cx="208" cy="261" r="6" className="fill-gold-600" />
            <rect x="170" y="280" width="76" height="6" rx="3" className="fill-gold-600" />
            <circle cx="176" cy="284" r="7" className="fill-gold-100" />
            <circle cx="240" cy="284" r="7" className="fill-gold-100" />
        </svg>
    );
}
