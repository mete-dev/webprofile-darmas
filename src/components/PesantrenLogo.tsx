import React from 'react';

interface PesantrenLogoProps {
  className?: string;
  size?: number;
  variant?: 'emerald' | 'white' | 'gold';
  withWhiteBg?: boolean;
}

export default function PesantrenLogo({
  className = 'h-10 w-10',
  variant = 'emerald',
  withWhiteBg = false,
}: PesantrenLogoProps) {
  // Select gradient definitions and stroke colors based on chosen variant
  const isWhite = variant === 'white';
  const isGold = variant === 'gold';

  const dropShadowFilter = isWhite
    ? 'drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]'
    : isGold
    ? 'drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)]'
    : 'drop-shadow-[0_2px_6px_rgba(2,44,34,0.4)]';

  const strokeColorOuter = isWhite ? '#CBD5E1' : isGold ? '#78350F' : '#013322';
  const strokeColorInner = isWhite ? '#E2E8F0' : isGold ? '#B45309' : '#047857';
  const strokeColorFine = isWhite ? '#94A3B8' : isGold ? '#92400E' : '#01281A';

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 ${
        withWhiteBg ? 'bg-white rounded-xl p-1 shadow-md shadow-emerald-950/30' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 400 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full object-contain filter ${dropShadowFilter}`}
        aria-label="Logo Pondok Pesantren Darul Mushtofa Assunniyyah"
      >
        <defs>
          {isWhite ? (
            <>
              {/* Monochromatic Premium White & Silver Gradients */}
              <linearGradient id="logoMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#F8FAFC" />
                <stop offset="65%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>

              <linearGradient id="logoHighlightGradient" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>

              <linearGradient id="logoShineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="30%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F8FAFC" />
                <stop offset="70%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#E2E8F0" />
              </linearGradient>

              <filter id="logoBevelFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.45" />
              </filter>
            </>
          ) : isGold ? (
            <>
              {/* Gold Gradients */}
              <linearGradient id="logoMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>

              <linearGradient id="logoHighlightGradient" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="logoShineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="35%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#FFFBEB" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>

              <filter id="logoBevelFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#451A03" floodOpacity="0.7" />
              </filter>
            </>
          ) : (
            <>
              {/* Metallic Emerald Green Gradients */}
              <linearGradient id="logoMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="25%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="75%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>

              <linearGradient id="logoHighlightGradient" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="40%" stopColor="#10B981" />
                <stop offset="80%" stopColor="#047857" />
                <stop offset="100%" stopColor="#022C22" />
              </linearGradient>

              <linearGradient id="logoShineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="30%" stopColor="#34D399" />
                <stop offset="50%" stopColor="#A7F3D0" />
                <stop offset="70%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#065F46" />
              </linearGradient>

              <filter id="logoBevelFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#022c22" floodOpacity="0.8" />
              </filter>
            </>
          )}
        </defs>

        {/* --- Top Spire / Finial (Kubah Pinnacle) --- */}
        {/* Needle Top */}
        <path
          d="M 200 12 L 204 45 L 196 45 Z"
          fill="url(#logoShineGradient)"
          stroke={strokeColorInner}
          strokeWidth="2"
        />
        {/* Spire Bead 1 */}
        <path
          d="M 197 45 C 192 48 190 54 195 60 C 198 64 202 64 205 60 C 210 54 208 48 203 45 Z"
          fill="url(#logoHighlightGradient)"
          stroke={strokeColorInner}
          strokeWidth="2"
        />
        {/* Spire Bead 2 */}
        <path
          d="M 195 60 C 188 64 186 72 193 80 C 197 85 203 85 207 80 C 214 72 212 64 205 60 Z"
          fill="url(#logoMainGradient)"
          stroke={strokeColorInner}
          strokeWidth="2"
        />
        {/* Spire Bead 3 */}
        <path
          d="M 192 80 C 184 86 182 96 191 106 C 196 112 204 112 209 106 C 218 96 216 86 208 80 Z"
          fill="url(#logoHighlightGradient)"
          stroke={strokeColorInner}
          strokeWidth="2"
        />
        {/* Spire Base Stem */}
        <path
          d="M 193 106 L 190 128 L 210 128 L 207 106 Z"
          fill="url(#logoShineGradient)"
          stroke={strokeColorInner}
          strokeWidth="2"
        />

        {/* --- Main Mosque Arch / Kubah Frame --- */}
        {/* Outer Architectural Stepped Arch */}
        <path
          d="M 200 125 
             C 215 145 270 175 295 210
             C 318 242 322 280 322 320
             L 345 320
             L 345 395
             L 55 395
             L 55 320
             L 78 320
             C 78 280 82 242 105 210
             C 130 175 185 145 200 125 Z"
          fill="url(#logoMainGradient)"
          stroke={strokeColorOuter}
          strokeWidth="3.5"
          filter="url(#logoBevelFilter)"
        />

        {/* Inner Molding Contour (Stepped Arch Cavity) */}
        <path
          d="M 200 152
             C 212 170 255 196 276 226
             C 295 254 298 285 298 320
             L 315 320
             L 315 385
             L 85 385
             L 85 320
             L 102 320
             C 102 285 105 254 124 226
             C 145 196 188 170 200 152 Z"
          fill={isWhite ? '#000000' : isGold ? '#451A03' : '#064E3B'}
          fillOpacity={isWhite ? '0.15' : '0.25'}
          stroke="url(#logoHighlightGradient)"
          strokeWidth="3"
        />

        {/* Inner Secondary Rim */}
        <path
          d="M 200 170
             C 210 185 245 208 262 234
             C 278 258 280 286 280 318
             L 120 318
             C 120 286 122 258 138 234
             C 155 208 190 185 200 170 Z"
          stroke="url(#logoShineGradient)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* --- Top Calligraphy: 'دار' (Dār) --- */}
        <g id="calligraphy-dar" filter="url(#logoBevelFilter)">
          {/* Daal (د) curve */}
          <path
            d="M 265 260 
               C 278 268 285 282 278 296 
               C 270 310 248 316 230 316 
               C 202 316 186 308 178 300 
               C 174 296 178 290 186 293 
               C 205 298 226 298 245 294 
               C 255 291 260 283 256 276 
               C 252 268 240 262 230 258 
               C 226 256 228 248 234 249 
               C 245 252 256 255 265 260 Z"
            fill="url(#logoShineGradient)"
            stroke={strokeColorFine}
            strokeWidth="1.5"
          />
          {/* Raa (ر) flourish */}
          <path
            d="M 224 235
               C 226 248 222 262 212 274
               C 200 288 184 296 170 300
               C 164 302 162 296 166 292
               C 176 282 188 270 192 256
               C 195 244 196 232 195 220
               C 195 214 205 214 208 218
               C 214 224 220 228 224 235 Z"
            fill="url(#logoHighlightGradient)"
            stroke={strokeColorFine}
            strokeWidth="1.5"
          />
          {/* Calligraphic Accent / Harakat */}
          <ellipse
            cx="248"
            cy="235"
            rx="5"
            ry="3.5"
            transform="rotate(-25 248 235)"
            fill="url(#logoShineGradient)"
          />
        </g>

        {/* --- Middle Calligraphy: 'المصطفى' (Al-Mushtofa) --- */}
        <g id="calligraphy-musthofa" filter="url(#logoBevelFilter)">
          {/* Vertical Alif-Lam Stems on Left & Right */}
          <path
            d="M 125 280 L 138 280 L 138 375 L 125 375 Z"
            fill="url(#logoMainGradient)"
            stroke={strokeColorFine}
            strokeWidth="1.5"
          />
          <path
            d="M 148 290 L 160 290 L 160 375 L 148 375 Z"
            fill="url(#logoShineGradient)"
            stroke={strokeColorFine}
            strokeWidth="1.5"
          />

          {/* Meem & Saad loop & tooth (مصـ) */}
          <path
            d="M 160 355 
               C 160 340 172 330 190 330
               C 208 330 220 342 220 355
               C 220 365 210 374 190 374
               L 160 374 Z"
            fill="url(#logoHighlightGradient)"
            stroke={strokeColorFine}
            strokeWidth="1.5"
          />
          <ellipse
            cx="190"
            cy="352"
            rx="14"
            ry="10"
            fill={isWhite ? '#0F172A' : isGold ? '#451A03' : '#064E3B'}
            fillOpacity={isWhite ? '0.2' : '1'}
          />

          {/* Central Dome / Taa loop (ـطـ) with upright vertical mast */}
          <path
            d="M 215 350
               C 225 330 245 322 265 322
               C 285 322 298 334 298 355
               L 298 374
               L 215 374 Z"
            fill="url(#logoShineGradient)"
            stroke={strokeColorFine}
            strokeWidth="1.5"
          />
          {/* Taa Upright Spine */}
          <path
            d="M 252 270 L 264 270 L 264 345 L 252 345 Z"
            fill="url(#logoHighlightGradient)"
            stroke={strokeColorFine}
            strokeWidth="1.5"
          />

          {/* Faa / Alif Maqsurah Loop & Curve (ـفى) */}
          <path
            d="M 288 340
               C 300 340 310 348 310 360
               C 310 372 298 378 285 378
               L 270 378
               L 270 360
               C 270 348 278 340 288 340 Z"
            fill="url(#logoMainGradient)"
            stroke={strokeColorFine}
            strokeWidth="1.5"
          />
          {/* Faa Dot */}
          <circle
            cx="292"
            cy="326"
            r="6"
            fill="url(#logoShineGradient)"
            stroke={strokeColorFine}
            strokeWidth="1.2"
          />

          {/* Nuqthah / Diacritics */}
          <circle cx="178" cy="318" r="5" fill="url(#logoShineGradient)" />
        </g>

        {/* --- Lower Architectural Arch Base / Platform --- */}
        <g id="plinth-base" filter="url(#logoBevelFilter)">
          {/* Horizontal Beam Header */}
          <rect
            x="35"
            y="395"
            width="330"
            height="20"
            rx="4"
            fill="url(#logoHighlightGradient)"
            stroke={strokeColorOuter}
            strokeWidth="2.5"
          />

          {/* Foundation Box */}
          <rect
            x="40"
            y="415"
            width="320"
            height="65"
            rx="6"
            fill="url(#logoMainGradient)"
            stroke={strokeColorOuter}
            strokeWidth="3"
          />

          {/* --- Base Calligraphy: 'السنية' (Assunniyyah) in Kufic Style --- */}
          {/* Letter Alif & Lam (الـ) */}
          <rect
            x="58"
            y="426"
            width="14"
            height="42"
            rx="2"
            fill="url(#logoShineGradient)"
            stroke={strokeColorFine}
            strokeWidth="1"
          />
          <rect
            x="78"
            y="426"
            width="14"
            height="42"
            rx="2"
            fill="url(#logoShineGradient)"
            stroke={strokeColorFine}
            strokeWidth="1"
          />

          {/* Seen (سـ) teeth */}
          <rect
            x="98"
            y="438"
            width="10"
            height="30"
            rx="1.5"
            fill="url(#logoHighlightGradient)"
            stroke={strokeColorFine}
            strokeWidth="1"
          />
          <rect
            x="114"
            y="438"
            width="10"
            height="30"
            rx="1.5"
            fill="url(#logoHighlightGradient)"
            stroke={strokeColorFine}
            strokeWidth="1"
          />
          <rect
            x="130"
            y="438"
            width="10"
            height="30"
            rx="1.5"
            fill="url(#logoHighlightGradient)"
            stroke={strokeColorFine}
            strokeWidth="1"
          />

          {/* Noon (نـ) stem & dot */}
          <rect
            x="146"
            y="432"
            width="12"
            height="36"
            rx="1.5"
            fill="url(#logoShineGradient)"
            stroke={strokeColorFine}
            strokeWidth="1"
          />
          <circle
            cx="152"
            cy="422"
            r="4.5"
            fill="url(#logoShineGradient)"
            stroke={strokeColorFine}
            strokeWidth="1"
          />

          {/* Yaa (يـ) stem & two dots */}
          <rect
            x="164"
            y="432"
            width="12"
            height="36"
            rx="1.5"
            fill="url(#logoHighlightGradient)"
            stroke={strokeColorFine}
            strokeWidth="1"
          />
          <circle cx="180" cy="458" r="3.5" fill="url(#logoShineGradient)" />
          <circle cx="192" cy="458" r="3.5" fill="url(#logoShineGradient)" />

          {/* Connecting Kufic Horizontal Baseline Bar */}
          <rect
            x="58"
            y="456"
            width="220"
            height="12"
            rx="2"
            fill="url(#logoHighlightGradient)"
            stroke={strokeColorFine}
            strokeWidth="1"
          />

          {/* Ta' Marbutah / End Finial (ـة) */}
          <rect
            x="282"
            y="426"
            width="16"
            height="42"
            rx="2"
            fill="url(#logoShineGradient)"
            stroke={strokeColorFine}
            strokeWidth="1"
          />
          <rect
            x="298"
            y="434"
            width="28"
            height="34"
            rx="3"
            fill="url(#logoHighlightGradient)"
            stroke={strokeColorFine}
            strokeWidth="1"
          />
          <circle cx="306" cy="422" r="3.5" fill="url(#logoShineGradient)" />
          <circle cx="318" cy="422" r="3.5" fill="url(#logoShineGradient)" />

          {/* Bottom Footers / Pedestal Base Legs */}
          <rect
            x="60"
            y="480"
            width="30"
            height="15"
            rx="3"
            fill="url(#logoShineGradient)"
            stroke={strokeColorOuter}
            strokeWidth="2"
          />
          <rect
            x="100"
            y="480"
            width="30"
            height="15"
            rx="3"
            fill="url(#logoShineGradient)"
            stroke={strokeColorOuter}
            strokeWidth="2"
          />
          <rect
            x="140"
            y="480"
            width="120"
            height="15"
            rx="3"
            fill="url(#logoMainGradient)"
            stroke={strokeColorOuter}
            strokeWidth="2"
          />
          <rect
            x="270"
            y="480"
            width="30"
            height="15"
            rx="3"
            fill="url(#logoShineGradient)"
            stroke={strokeColorOuter}
            strokeWidth="2"
          />
          <rect
            x="310"
            y="480"
            width="30"
            height="15"
            rx="3"
            fill="url(#logoShineGradient)"
            stroke={strokeColorOuter}
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}
