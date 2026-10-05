import { MessageCircle, ShieldCheck } from 'lucide-react';

// Window grid of the main building: 1 = lit (gold), 0 = dark (navy).
const MAIN_WINDOWS = [
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 0],
    [0, 1, 0],
    [1, 0, 1],
];
const SIDE_WINDOWS = [
    [1, 0],
    [0, 1],
    [1, 1],
    [0, 0],
    [1, 0],
    [0, 1],
];

// Original flat illustration of a Casablanca residence at dusk, framed like
// a photo, with two floating reassurance cards. No external image.
export default function HeroVisual({ className = '' }) {
    return (
        <div className={`relative ${className}`}>
            <svg viewBox="0 0 520 460" className="w-full drop-shadow-xl" role="img" aria-label="Illustration d'une résidence étudiante">
                <rect width="520" height="460" rx="32" className="fill-navy-900" />
                <circle cx="420" cy="92" r="36" className="fill-gold-300" />
                <circle cx="420" cy="92" r="52" className="fill-gold-300 opacity-15" />
                <circle cx="80" cy="70" r="2.5" className="fill-white opacity-70" />
                <circle cx="150" cy="40" r="2" className="fill-white opacity-60" />
                <circle cx="300" cy="56" r="2.5" className="fill-white opacity-70" />
                <circle cx="480" cy="190" r="2" className="fill-white opacity-50" />

                {/* Left building */}
                <rect x="40" y="170" width="130" height="270" rx="6" className="fill-navy-800" />
                {SIDE_WINDOWS.map((row, r) =>
                    row.map((lit, c) => (
                        <rect
                            key={`l-${r}-${c}`}
                            x={66 + c * 50}
                            y={196 + r * 38}
                            width="28"
                            height="22"
                            rx="3"
                            className={lit ? 'fill-gold-300' : 'fill-navy-950'}
                        />
                    )),
                )}

                {/* Right building */}
                <rect x="370" y="220" width="120" height="220" rx="6" className="fill-navy-800" />
                {SIDE_WINDOWS.slice(0, 5).map((row, r) =>
                    row.map((lit, c) => (
                        <rect
                            key={`r-${r}-${c}`}
                            x={392 + c * 46}
                            y={244 + r * 38}
                            width="28"
                            height="22"
                            rx="3"
                            className={lit ? 'fill-navy-950' : 'fill-gold-300'}
                        />
                    )),
                )}

                {/* Main residence */}
                <rect x="160" y="110" width="220" height="330" rx="8" className="fill-gold-50" />
                <rect x="150" y="100" width="240" height="22" rx="6" className="fill-gold-500" />
                {MAIN_WINDOWS.map((row, r) =>
                    row.map((lit, c) => (
                        <g key={`m-${r}-${c}`}>
                            <rect
                                x={186 + c * 62}
                                y={142 + r * 50}
                                width="44"
                                height="34"
                                rx="4"
                                className={lit ? 'fill-gold-300' : 'fill-navy-900'}
                            />
                            <rect x={184 + c * 62} y={174 + r * 50} width="48" height="5" rx="2" className="fill-navy-800" />
                        </g>
                    )),
                )}
                <path d="M244 440v-58a26 26 0 0 1 52 0v58z" className="fill-navy-900" />
                <circle cx="284" cy="414" r="3" className="fill-gold-300" />

                {/* Ground and palms */}
                <rect x="0" y="432" width="520" height="28" className="fill-navy-950" />
                <rect x="112" y="350" width="8" height="84" rx="4" className="fill-navy-950" />
                <path d="M116 352c-22-6-38 2-46 14 16-4 30-4 46-14zm0 0c22-6 38 2 46 14-16-4-30-4-46-14zm0 0c-8-18-24-24-38-22 12 6 22 14 38 22zm0 0c8-18 24-24 38-22-12 6-22 14-38 22z" className="fill-gold-600" />
                <rect x="418" y="362" width="8" height="72" rx="4" className="fill-navy-950" />
                <path d="M422 364c-20-6-34 2-42 13 15-4 28-4 42-13zm0 0c20-6 34 2 42 13-15-4-28-4-42-13zm0 0c-7-16-22-22-34-20 11 5 20 12 34 20zm0 0c7-16 22-22 34-20-11 5-20 12-34 20z" className="fill-gold-600" />
            </svg>

            <div className="absolute -left-6 top-12 flex items-center gap-3 rounded-card border border-ui-border bg-white p-3 pr-4 shadow-float">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                    <ShieldCheck size={20} aria-hidden="true" />
                </span>
                <span className="text-sm leading-tight">
                    <span className="block font-semibold text-ui-text">Propriétaires certifiés</span>
                    <span className="block text-ui-muted">Identité vérifiée</span>
                </span>
            </div>

            <div className="absolute -right-4 bottom-16 flex items-center gap-3 rounded-card border border-ui-border bg-white p-3 pr-4 shadow-float">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-whatsapp text-navy-950">
                    <MessageCircle size={20} aria-hidden="true" />
                </span>
                <span className="text-sm leading-tight">
                    <span className="block font-semibold text-ui-text">Contact direct</span>
                    <span className="block text-ui-muted">sur WhatsApp</span>
                </span>
            </div>
        </div>
    );
}
