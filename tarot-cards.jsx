// Mystical tarot card artwork — SVG based, per-card symbol
// Card back design: ornate sacred geometry
// Each card face: unique sigil over gradient backdrop

function CardBack({ width = 200, glow = 0.6 }) {
  const h = width * 1.6;
  return (
    <svg viewBox="0 0 200 320" width={width} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="cb-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0616"/>
          <stop offset="50%" stopColor="#1a0c2e"/>
          <stop offset="100%" stopColor="#050312"/>
        </linearGradient>
        <radialGradient id="cb-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#d4a84a" stopOpacity={0.35 * glow}/>
          <stop offset="60%" stopColor="#6b3aa0" stopOpacity={0.1 * glow}/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>
        <pattern id="cb-stars" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="7" r="0.5" fill="#d4a84a" opacity="0.5"/>
          <circle cx="28" cy="19" r="0.3" fill="#fff" opacity="0.4"/>
          <circle cx="15" cy="32" r="0.4" fill="#b89660" opacity="0.4"/>
          <circle cx="35" cy="5" r="0.3" fill="#fff" opacity="0.3"/>
        </pattern>
      </defs>

      {/* card bg */}
      <rect width="200" height="320" rx="12" fill="url(#cb-bg)"/>
      <rect width="200" height="320" rx="12" fill="url(#cb-stars)"/>
      <rect width="200" height="320" rx="12" fill="url(#cb-glow)"/>

      {/* ornate border */}
      <rect x="6" y="6" width="188" height="308" rx="8" fill="none" stroke="#c9a04a" strokeOpacity="0.45" strokeWidth="0.6"/>
      <rect x="10" y="10" width="180" height="300" rx="6" fill="none" stroke="#c9a04a" strokeOpacity="0.25" strokeWidth="0.4"/>

      {/* sacred geometry center — flower of life + compass */}
      <g transform="translate(100 160)" stroke="#d4a84a" strokeWidth="0.7" fill="none" opacity="0.85">
        {/* outer ring */}
        <circle r="62" strokeOpacity="0.3"/>
        <circle r="54" strokeOpacity="0.5"/>
        <circle r="46" strokeOpacity="0.35"/>

        {/* hexagram flower */}
        {[0,60,120,180,240,300].map(a => (
          <circle key={a} r="22"
            cx={Math.cos(a*Math.PI/180)*22}
            cy={Math.sin(a*Math.PI/180)*22}
            strokeOpacity="0.55"/>
        ))}
        <circle r="22" strokeOpacity="0.7"/>

        {/* rays */}
        {[0,45,90,135,180,225,270,315].map(a => (
          <line key={a} x1={Math.cos(a*Math.PI/180)*46} y1={Math.sin(a*Math.PI/180)*46}
                       x2={Math.cos(a*Math.PI/180)*62} y2={Math.sin(a*Math.PI/180)*62}
                       strokeOpacity="0.5"/>
        ))}

        {/* central eye / sigil */}
        <circle r="7" fill="#d4a84a" fillOpacity="0.15" stroke="#d4a84a" strokeOpacity="0.9"/>
        <circle r="2.5" fill="#f4d17a"/>
      </g>

      {/* top + bottom sigils */}
      <g transform="translate(100 40)" stroke="#c9a04a" strokeOpacity="0.6" fill="none" strokeWidth="0.6">
        <path d="M-14 0 L0 -8 L14 0 L0 8 Z"/>
        <circle r="2" fill="#d4a84a" fillOpacity="0.7"/>
      </g>
      <g transform="translate(100 280)" stroke="#c9a04a" strokeOpacity="0.6" fill="none" strokeWidth="0.6">
        <path d="M-14 0 L0 -8 L14 0 L0 8 Z"/>
        <circle r="2" fill="#d4a84a" fillOpacity="0.7"/>
      </g>

      {/* corner ornaments */}
      {[[20,20],[180,20],[20,300],[180,300]].map(([x,y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="2.5" fill="none" stroke="#c9a04a" strokeOpacity="0.5" strokeWidth="0.5"/>
          <circle r="0.8" fill="#d4a84a" fillOpacity="0.7"/>
        </g>
      ))}
    </svg>
  );
}

// Individual card face — parameterized by card
function CardFace({ card, reversed = false, width = 200 }) {
  const h = width * 1.6;
  const hue = card.hue;
  return (
    <svg viewBox="0 0 200 320" width={width} height={h}
         style={{ display: 'block', transform: reversed ? 'rotate(180deg)' : 'none' }}>
      <defs>
        <linearGradient id={`cf-bg-${card.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue} 45% 12%)`}/>
          <stop offset="50%" stopColor={`hsl(${hue} 55% 18%)`}/>
          <stop offset="100%" stopColor={`hsl(${hue} 40% 8%)`}/>
        </linearGradient>
        <radialGradient id={`cf-glow-${card.id}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={`hsl(${hue} 80% 65%)`} stopOpacity="0.35"/>
          <stop offset="70%" stopColor={`hsl(${hue} 60% 25%)`} stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>
        <filter id={`cf-soft-${card.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5"/>
        </filter>
      </defs>

      {/* bg */}
      <rect width="200" height="320" rx="12" fill={`url(#cf-bg-${card.id})`}/>
      <rect width="200" height="320" rx="12" fill={`url(#cf-glow-${card.id})`}/>

      {/* stars */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = (i * 37) % 190 + 5;
        const y = (i * 71) % 300 + 10;
        const r = (i % 3 === 0) ? 0.8 : 0.4;
        return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.15 + (i%4)*0.1}/>;
      })}

      {/* ornate border */}
      <rect x="6" y="6" width="188" height="308" rx="8" fill="none" stroke="#c9a04a" strokeOpacity="0.45" strokeWidth="0.6"/>

      {/* symbol */}
      <g transform="translate(100 155)">
        {renderSymbol(card.symbol, card.id)}
      </g>

      {/* Roman numeral */}
      <text x="100" y="40" textAnchor="middle"
            fontFamily="'Cormorant Garamond', 'Cinzel', serif" fontSize="14"
            fill="#d4a84a" opacity="0.9" letterSpacing="3">
        {romanize(card)}
      </text>
      {/* Card name */}
      <text x="100" y="290" textAnchor="middle"
            fontFamily="'Cormorant Garamond', 'Cinzel', serif" fontSize="11"
            fill="#e8cb7a" opacity="0.95" letterSpacing="2"
            fontStyle="italic">
        {card.name.en.toUpperCase()}
      </text>
      <line x1="40" y1="300" x2="160" y2="300" stroke="#c9a04a" strokeOpacity="0.4" strokeWidth="0.4"/>
    </svg>
  );
}

function romanize(card) {
  const map = {
    fool: '0', magician: 'I', priestess: 'II', lovers: 'VI',
    hermit: 'IX', wheel: 'X', death: 'XIII', tower: 'XVI',
    star: 'XVII', moon: 'XVIII', sun: 'XIX', world: 'XXI',
  };
  return map[card.id] || '';
}

// Unique SVG symbol per card — line-art style, gold
function renderSymbol(symbol, id) {
  const stroke = '#e8cb7a';
  const faintFill = 'rgba(232,203,122,0.12)';
  const common = { stroke, strokeWidth: 0.9, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (symbol) {
    case 'fool':
      return (
        <g {...common}>
          <circle r="35" strokeOpacity="0.5"/>
          <path d="M-20 18 Q0 -28 20 18" />
          <circle cy="-8" r="6"/>
          <path d="M-12 -2 L0 14 L12 -2" />
          <circle cx="22" cy="22" r="1.5" fill={stroke}/>
          <path d="M-30 22 L-22 10" strokeOpacity="0.6"/>
        </g>
      );
    case 'magician':
      return (
        <g {...common}>
          <path d="M0 -38 L0 38" strokeOpacity="0.7"/>
          <circle cy="-38" r="3" fill={stroke}/>
          <circle cy="38" r="3" fill={stroke}/>
          <path d="M-24 -10 Q0 -18 24 -10" />
          <path d="M-24 10 Q0 18 24 10" />
          <circle r="8" fill={faintFill}/>
          <path d="M-16 -28 L16 -28 M-16 28 L16 28" strokeOpacity="0.6"/>
          <path d="M-32 0 L-22 0 M22 0 L32 0"/>
        </g>
      );
    case 'priestess':
      return (
        <g {...common}>
          <path d="M0 -36 A 20 20 0 0 0 0 36 A 20 20 0 0 0 0 -36 Z" strokeOpacity="0.8"/>
          <path d="M-15 0 A 15 15 0 0 1 15 0" fill={faintFill}/>
          <circle cy="-8" r="2.5" fill={stroke}/>
          <path d="M-6 20 L-6 -10 M6 20 L6 -10" strokeOpacity="0.5"/>
          {/* moon crescent */}
          <path d="M-4 32 A 6 6 0 1 0 4 32 A 4 4 0 1 1 -4 32" fill={stroke} fillOpacity="0.6" strokeOpacity="0"/>
        </g>
      );
    case 'star':
      return (
        <g {...common}>
          {/* 8 point star */}
          <path d="M0 -35 L4 -10 L28 -8 L8 4 L16 28 L0 14 L-16 28 L-8 4 L-28 -8 L-4 -10 Z"
                fill={faintFill}/>
          <circle r="3" fill={stroke}/>
          {[0,45,90,135,180,225,270,315].map(a => (
            <line key={a} x1={Math.cos(a*Math.PI/180)*35} y1={Math.sin(a*Math.PI/180)*35}
                         x2={Math.cos(a*Math.PI/180)*42} y2={Math.sin(a*Math.PI/180)*42}
                         strokeOpacity="0.5"/>
          ))}
        </g>
      );
    case 'moon':
      return (
        <g {...common}>
          <circle r="30" strokeOpacity="0.4" fill={faintFill}/>
          <path d="M-8 -25 A 25 25 0 1 0 -8 25 A 18 18 0 1 1 -8 -25" fill={stroke} fillOpacity="0.7" strokeOpacity="0"/>
          <circle cx="12" cy="-8" r="1.5" fill={stroke}/>
          <circle cx="15" cy="6" r="1" fill={stroke}/>
          <circle cx="4" cy="-18" r="0.8" fill={stroke}/>
        </g>
      );
    case 'sun':
      return (
        <g {...common}>
          <circle r="18" fill={faintFill} strokeOpacity="0.9"/>
          <circle r="6" fill={stroke} fillOpacity="0.7"/>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = i * 30;
            const r1 = 22, r2 = i % 2 === 0 ? 38 : 32;
            return (
              <line key={i}
                x1={Math.cos(a*Math.PI/180)*r1} y1={Math.sin(a*Math.PI/180)*r1}
                x2={Math.cos(a*Math.PI/180)*r2} y2={Math.sin(a*Math.PI/180)*r2}/>
            );
          })}
        </g>
      );
    case 'tower':
      return (
        <g {...common}>
          <path d="M-14 24 L-14 -20 L-10 -28 L10 -28 L14 -20 L14 24 Z" fill={faintFill}/>
          <path d="M-14 -8 L14 -8 M-14 6 L14 6"/>
          <path d="M-2 24 L-2 10 L2 10 L2 24"/>
          {/* lightning */}
          <path d="M-22 -34 L-6 -20 L-12 -12 L4 2" strokeWidth="1.3" strokeOpacity="0.9"/>
          <circle cx="-4" cy="-22" r="1.5" fill={stroke}/>
        </g>
      );
    case 'lovers':
      return (
        <g {...common}>
          <circle cx="-10" cy="-4" r="10" strokeOpacity="0.7"/>
          <circle cx="10" cy="-4" r="10" strokeOpacity="0.7"/>
          {/* intertwined heart */}
          <path d="M0 22 C -16 8 -16 -8 0 0 C 16 -8 16 8 0 22 Z" fill={faintFill}/>
          <circle cy="-12" r="3" fill={stroke}/>
          <path d="M-22 14 L-14 22 M22 14 L14 22" strokeOpacity="0.5"/>
        </g>
      );
    case 'hermit':
      return (
        <g {...common}>
          <path d="M0 -32 L-16 28 L16 28 Z" fill={faintFill}/>
          <circle cy="-8" r="6" fill={stroke} fillOpacity="0.5"/>
          {/* lantern rays */}
          {[0,30,60,90,120,150,180].map(a => (
            <line key={a}
              x1={Math.cos((a+180)*Math.PI/180)*10 + 0} y1={Math.sin((a+180)*Math.PI/180)*10 + -8}
              x2={Math.cos((a+180)*Math.PI/180)*20 + 0} y2={Math.sin((a+180)*Math.PI/180)*20 + -8}
              strokeOpacity="0.5"/>
          ))}
          <path d="M-8 30 L8 30"/>
        </g>
      );
    case 'wheel':
      return (
        <g {...common}>
          <circle r="32" strokeOpacity="0.6"/>
          <circle r="24" strokeOpacity="0.5"/>
          <circle r="6" fill={stroke} fillOpacity="0.6"/>
          {[0,45,90,135,180,225,270,315].map(a => (
            <line key={a} x1={Math.cos(a*Math.PI/180)*6} y1={Math.sin(a*Math.PI/180)*6}
                         x2={Math.cos(a*Math.PI/180)*32} y2={Math.sin(a*Math.PI/180)*32}/>
          ))}
          {/* outer marks */}
          {[0,90,180,270].map(a => (
            <circle key={a} cx={Math.cos(a*Math.PI/180)*38} cy={Math.sin(a*Math.PI/180)*38} r="1.5" fill={stroke}/>
          ))}
        </g>
      );
    case 'death':
      return (
        <g {...common}>
          {/* scythe curve + crescent */}
          <path d="M-20 -28 Q 24 -20 20 24" strokeWidth="1.2"/>
          <path d="M-20 -28 L-26 -22 L-18 -22 Z" fill={stroke} fillOpacity="0.6"/>
          <circle cx="-2" cy="4" r="14" fill={faintFill} strokeOpacity="0.7"/>
          <circle cx="-7" cy="1" r="2" fill={stroke}/>
          <circle cx="3" cy="1" r="2" fill={stroke}/>
          <path d="M-6 10 L-2 12 L2 10" strokeOpacity="0.6"/>
          <path d="M-14 22 L10 22" strokeOpacity="0.5"/>
        </g>
      );
    case 'world':
      return (
        <g {...common}>
          <ellipse rx="26" ry="32" strokeOpacity="0.7" fill={faintFill}/>
          <path d="M-26 0 Q 0 -10 26 0" strokeOpacity="0.5"/>
          <path d="M-26 0 Q 0 10 26 0" strokeOpacity="0.5"/>
          <path d="M0 -32 L0 32" strokeOpacity="0.3"/>
          {/* corner emblems */}
          {[[0,-38],[0,38],[-32,0],[32,0]].map(([x,y], i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill={stroke} fillOpacity="0.7"/>
          ))}
        </g>
      );
    default:
      return <circle r="20" {...common}/>;
  }
}

Object.assign(window, { CardBack, CardFace });
