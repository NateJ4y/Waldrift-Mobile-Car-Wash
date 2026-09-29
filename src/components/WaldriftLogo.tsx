import React from 'react';

interface WaldriftLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showAddress?: boolean;
  className?: string;
}

export const WaldriftLogo: React.FC<WaldriftLogoProps> = ({
  size = 'md',
  showAddress = false,
  className = '',
}) => {
  const isSm = size === 'sm';
  const isMd = size === 'md';
  const isLg = size === 'lg';
  const isHero = size === 'hero';

  return (
    <div className={`flex flex-col items-center justify-center select-none text-center ${className}`}>
      {showAddress && (
        <span className="text-[10px] md:text-xs font-700 tracking-widest text-neutral-400 uppercase mb-1">
          19 Andesite Ave &middot; 1 Doloriet Ave, Waldrif, Vereeniging
        </span>
      )}

      <div className="relative flex flex-col items-center">
        {/* Car Silhouette SVG in Crimson Red */}
        <div className="relative w-full flex justify-center -mb-2 z-0">
          <svg
            viewBox="0 0 320 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${
              isSm ? 'w-24 h-6' : isMd ? 'w-36 h-9' : isLg ? 'w-52 h-14' : 'w-72 md:w-96 h-20 md:h-24'
            } text-red-600 transition-transform duration-300`}
          >
            {/* Aerodynamic sporty car roofline and windshield silhouette */}
            <path
              d="M35 62 C50 38, 90 22, 160 20 C230 22, 270 38, 285 62"
              stroke="#dc2626"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Windshield sweep */}
            <path
              d="M75 58 C90 32, 120 25, 160 25 C200 25, 230 32, 245 58"
              fill="rgba(220, 38, 38, 0.12)"
              stroke="#ef4444"
              strokeWidth="2.5"
            />
            {/* Sleek roof ridge */}
            <path
              d="M100 24 C120 18, 140 16, 160 16 C180 16, 200 18, 220 24"
              stroke="#f87171"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Side Mirrors */}
            <path
              d="M48 42 C40 38, 35 44, 42 48 C48 50, 52 46, 48 42 Z"
              fill="#dc2626"
            />
            <path
              d="M272 42 C280 38, 285 44, 278 48 C272 50, 268 46, 272 42 Z"
              fill="#dc2626"
            />
            {/* Front hood highlight accent */}
            <path
              d="M55 64 Q160 76 265 64"
              stroke="#b91c1c"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Headlight arcs */}
            <path
              d="M58 56 Q75 56 85 60"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
            <path
              d="M262 56 Q245 56 235 60"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
          </svg>
        </div>

        {/* Text Lockup in Oswald Condensed */}
        <div className="z-10 flex flex-col items-center leading-none">
          <span
            className={`font-oswald font-700 tracking-wider text-white uppercase ${
              isSm ? 'text-lg' : isMd ? 'text-2xl' : isLg ? 'text-4xl' : 'text-5xl md:text-6xl'
            }`}
          >
            WALDRIFT
          </span>
          <span
            className={`font-oswald font-700 tracking-widest text-red-600 uppercase -mt-0.5 ${
              isSm ? 'text-base' : isMd ? 'text-xl' : isLg ? 'text-3xl' : 'text-4xl md:text-5xl'
            }`}
          >
            CAR WASH
          </span>
        </div>
      </div>
    </div>
  );
};

export default WaldriftLogo;
