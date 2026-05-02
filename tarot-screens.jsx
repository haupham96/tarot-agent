// Screens: Home, Shuffle, Reveal, Result, Donate
// All rendered inside an IOSDevice. Navigation via a simple router in App.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─────────────────────────────────────────────────────────────
// Mystical atmosphere background (stars + fog + particles)
// ─────────────────────────────────────────────────────────────
function MysticalBG({ intensity = 1, children }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        radial-gradient(ellipse 110% 60% at 50% 0%, #2a1550 0%, transparent 55%),
        radial-gradient(ellipse 70% 50% at 80% 90%, #3d1a4a 0%, transparent 55%),
        radial-gradient(ellipse 60% 40% at 10% 80%, #0e0730 0%, transparent 55%),
        linear-gradient(180deg, #080316 0%, #0a0420 50%, #05020f 100%)
      `,
      overflow: 'hidden',
    }}>
      {/* Starfield */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.7 * intensity }}>
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {Array.from({ length: 80 }).map((_, i) => {
          const x = (i * 53 + 17) % 100;
          const y = (i * 37 + 11) % 100;
          const r = (i % 5 === 0) ? 1.2 : 0.5;
          const op = 0.3 + ((i * 13) % 70) / 100;
          return <circle key={i} cx={`${x}%`} cy={`${y}%`} r={r} fill="#fff" opacity={op}/>;
        })}
        {/* a few bigger glowing stars */}
        {[[18,12],[72,24],[34,55],[82,68],[10,78]].map(([x,y], i) => (
          <g key={i}>
            <circle cx={`${x}%`} cy={`${y}%`} r="8" fill="url(#starGlow)" opacity="0.4"/>
            <circle cx={`${x}%`} cy={`${y}%`} r="1.3" fill="#f4e1a0"/>
          </g>
        ))}
      </svg>

      {/* Fog layers */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 80% 40% at 30% 60%, rgba(90,40,140,0.18) 0%, transparent 70%),
          radial-gradient(ellipse 70% 35% at 70% 40%, rgba(140,90,180,0.12) 0%, transparent 70%)
        `,
        animation: 'fog-drift 30s ease-in-out infinite alternate',
      }}/>

      {/* Floating particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {Array.from({ length: 14 }).map((_, i) => {
          const x = (i * 73) % 100;
          const delay = (i * 1.3) % 12;
          const dur = 14 + (i % 5) * 3;
          const size = 1 + (i % 3);
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${x}%`, bottom: '-5%',
              width: size, height: size, borderRadius: '50%',
              background: i % 3 === 0 ? '#f4d17a' : '#d9b4ff',
              boxShadow: `0 0 ${size * 4}px ${i % 3 === 0 ? '#f4d17a' : '#c395ff'}`,
              opacity: 0.7,
              animation: `particle-rise ${dur}s linear ${delay}s infinite`,
            }}/>
          );
        })}
      </div>

      {/* Light rays from top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(212,168,74,0.06) 10deg, transparent 20deg, transparent 340deg, rgba(212,168,74,0.06) 350deg, transparent 360deg)',
        pointerEvents: 'none',
      }}/>

      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom Nav (Home / Donate)
// ─────────────────────────────────────────────────────────────
function BottomNav({ active, onNav, t }) {
  const items = [
    { key: 'home', label: t.home, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V11z"
              stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    )},
    { key: 'donate', label: t.donate, icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 21s-8-5-8-11a5 5 0 019-3 5 5 0 019 3c0 6-8 11-8 11h-2z"
              stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    )},
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      padding: '12px 20px 32px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(5,2,15,0.85) 40%, rgba(5,2,15,0.95) 100%)',
      backdropFilter: 'blur(20px) saturate(140%)',
      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      borderTop: '0.5px solid rgba(212,168,74,0.18)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {items.map(it => {
          const isActive = active === it.key;
          return (
            <button key={it.key} onClick={() => onNav(it.key)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 4, padding: '6px 24px', color: isActive ? '#f4d17a' : 'rgba(220,210,240,0.55)',
                transition: 'color 0.3s',
                filter: isActive ? 'drop-shadow(0 0 8px rgba(244,209,122,0.7))' : 'none',
              }}>
              {it.icon}
              <span style={{
                fontSize: 11, letterSpacing: 0.5, fontWeight: 500,
                fontFamily: '-apple-system, system-ui',
              }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Language toggle (top-right)
// ─────────────────────────────────────────────────────────────
function LangToggle({ lang, onChange }) {
  return (
    <div style={{
      position: 'absolute', top: 62, right: 20, zIndex: 30,
      display: 'flex', gap: 4, padding: 4,
      background: 'rgba(20,10,40,0.55)',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      border: '0.5px solid rgba(212,168,74,0.25)',
      borderRadius: 999,
    }}>
      {[
        { code: 'vi', flag: '🇻🇳' },
        { code: 'en', flag: '🇺🇸' },
      ].map(o => (
        <button key={o.code} onClick={() => onChange(o.code)}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            border: 'none', cursor: 'pointer',
            background: lang === o.code ? 'radial-gradient(circle, rgba(244,209,122,0.35), rgba(212,168,74,0.1))' : 'transparent',
            boxShadow: lang === o.code ? '0 0 12px rgba(244,209,122,0.5), inset 0 0 0 1px rgba(244,209,122,0.6)' : 'none',
            fontSize: 16, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s',
          }}>
          {o.flag}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────────────────────
function HomeScreen({ lang, onSpread, goTo, t }) {
  const spreads = [
    { n: 1, label: t.spread1, sub: t.spread1Sub },
    { n: 3, label: t.spread3, sub: t.spread3Sub },
    { n: 4, label: t.spread4, sub: t.spread4Sub },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, color: '#fff', fontFamily: '-apple-system, system-ui' }}>
      <MysticalBG/>

      {/* Brand / symbol at very top */}
      <div style={{
        position: 'absolute', top: 62, left: 0, right: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
      }}>
        <MoonSymbol size={34} />
        <div style={{
          marginTop: 6,
          fontFamily: "'Cormorant Garamond', 'Cinzel', serif",
          fontSize: 17, letterSpacing: 6, color: '#e8cb7a',
          textTransform: 'uppercase', fontWeight: 500,
        }}>Tarot Agent</div>
      </div>

      {/* Centered prompt */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '0 32px 120px', zIndex: 5,
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 24, lineHeight: 1.45, textAlign: 'center',
          color: 'rgba(240,230,255,0.92)',
          fontWeight: 400, fontStyle: 'italic',
          whiteSpace: 'pre-line',
          maxWidth: 320,
          textShadow: '0 2px 20px rgba(120,80,200,0.5)',
          marginBottom: 48,
        }}>
          {t.homeMessage}
        </div>

        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
          <div style={{ width: 50, height: 0.5, background: 'linear-gradient(to right, transparent, rgba(212,168,74,0.6))' }}/>
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#d4a84a" opacity="0.8"/></svg>
          <div style={{ width: 50, height: 0.5, background: 'linear-gradient(to left, transparent, rgba(212,168,74,0.6))' }}/>
        </div>

        {/* Spread buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 320 }}>
          {spreads.map(s => (
            <SpreadButton key={s.n} label={s.label} sub={s.sub} count={s.n}
                          onClick={() => onSpread(s.n)} />
          ))}
        </div>
      </div>

    </div>
  );
}

function SpreadButton({ label, sub, count, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: '18px 22px',
        background: 'linear-gradient(180deg, rgba(30,15,55,0.7), rgba(15,8,30,0.8))',
        border: '0.5px solid rgba(212,168,74,0.4)',
        borderRadius: 14,
        color: '#fff', cursor: 'pointer',
        textAlign: 'left',
        boxShadow: hover
          ? '0 0 0 1px rgba(244,209,122,0.6), 0 0 24px rgba(212,168,74,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 0 0 0.5px rgba(212,168,74,0.3), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}>
      {/* Mini card icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <MiniCardStack count={count} glow={hover ? 1 : 0.5} />
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 19, fontWeight: 500,
            color: '#f4e6c8', letterSpacing: 0.5,
          }}>{label}</div>
          <div style={{
            fontSize: 11.5, marginTop: 2,
            color: 'rgba(220,210,240,0.55)',
            letterSpacing: 0.3,
          }}>{sub}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ color: '#d4a84a', opacity: 0.8 }}>
          <path d="M4 2 L9 7 L4 12" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>

      {/* inner shimmer */}
      {hover && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 100% at 20% 50%, rgba(244,209,122,0.1), transparent 60%)',
        }}/>
      )}
    </button>
  );
}

function MiniCardStack({ count, glow = 0.5 }) {
  const cards = Array.from({ length: count }).map((_, i) => i);
  return (
    <div style={{ position: 'relative', width: 36, height: 50, flexShrink: 0 }}>
      {cards.map((i) => {
        const offset = count === 1 ? 0 : (i - (count-1)/2) * 5;
        const rot = count === 1 ? 0 : (i - (count-1)/2) * 8;
        return (
          <div key={i} style={{
            position: 'absolute', top: 0, left: '50%',
            transform: `translateX(-50%) translateX(${offset}px) rotate(${rot}deg)`,
            width: 24, height: 36, borderRadius: 3,
            background: 'linear-gradient(135deg, #2a1450, #120725)',
            border: '0.5px solid rgba(212,168,74,0.7)',
            boxShadow: `0 0 ${6 + glow * 8}px rgba(212,168,74,${0.3 + glow * 0.4})`,
          }}>
            <div style={{
              position: 'absolute', inset: 2, border: '0.5px solid rgba(212,168,74,0.4)', borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#d4a84a', boxShadow: '0 0 4px #f4d17a' }}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MoonSymbol({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <radialGradient id="ms-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#f4d17a" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#f4d17a" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#ms-glow)"/>
      {/* crescent + star */}
      <path d="M15 6 A 14 14 0 1 0 15 34 A 11 11 0 1 1 15 6"
            fill="#e8cb7a" opacity="0.9"/>
      <path d="M28 14 L29 18 L33 19 L29 20 L28 24 L27 20 L23 19 L27 18 Z"
            fill="#f4d17a"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// SHUFFLE SCREEN
// ─────────────────────────────────────────────────────────────
function ShuffleScreen({ onComplete, t }) {
  useEffect(() => {
    const id = setTimeout(onComplete, 2600);
    return () => clearTimeout(id);
  }, [onComplete]);

  return (
    <div onClick={onComplete}
      style={{ position: 'absolute', inset: 0, cursor: 'pointer', color: '#fff' }}>
      <MysticalBG intensity={1.3}/>

      {/* Darken overlay for focus */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 40% at 50% 45%, transparent 0%, rgba(0,0,0,0.5) 100%)',
      }}/>

      {/* Floating cards */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ position: 'relative', width: 220, height: 320 }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const angle = (i - 3) * 12;
            const delay = i * 0.15;
            return (
              <div key={i} style={{
                position: 'absolute', inset: 0,
                animation: `card-float ${4 + i * 0.3}s ease-in-out ${delay}s infinite alternate`,
                transformOrigin: 'center 110%',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: '50%',
                  transform: `translateX(-50%) rotate(${angle}deg) translateY(${i * -4}px)`,
                  opacity: 0.55 + (i % 3) * 0.15,
                  filter: `drop-shadow(0 0 16px rgba(212,168,74,0.3))`,
                }}>
                  <div style={{
                    width: 110, height: 176, borderRadius: 8,
                    overflow: 'hidden',
                    border: '0.5px solid rgba(212,168,74,0.5)',
                  }}>
                    <CardBack width={110} glow={0.9}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Text */}
      <div style={{
        position: 'absolute', bottom: '22%', left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        padding: '0 32px',
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, fontStyle: 'italic', textAlign: 'center',
          color: 'rgba(244,230,200,0.95)',
          letterSpacing: 0.5,
          textShadow: '0 2px 20px rgba(120,80,200,0.6)',
          animation: 'fade-pulse 2.5s ease-in-out infinite',
        }}>
          {t.shuffling}
        </div>
        <div style={{
          fontSize: 11, color: 'rgba(220,210,240,0.4)',
          letterSpacing: 2, textTransform: 'uppercase',
        }}>{t.tapToSkip}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CARD REVEAL — all cards shown concurrently
// ─────────────────────────────────────────────────────────────
function RevealScreen({ cards, lang, onDone, t }) {
  const n = cards.length;
  const [flipped, setFlipped] = useState(Array(n).fill(false));
  const [focus, setFocus] = useState(null); // index being focused/inspected
  const positions = TAROT_POSITIONS[n][lang];

  const allFlipped = flipped.every(Boolean);

  const flipOne = (i) => {
    if (flipped[i]) { setFocus(i); return; }
    setFlipped(f => { const next = [...f]; next[i] = true; return next; });
    setTimeout(() => setFocus(i), 600);
  };

  const flipAll = () => {
    cards.forEach((_, i) => {
      setTimeout(() => {
        setFlipped(f => { if (f[i]) return f; const next = [...f]; next[i] = true; return next; });
      }, i * 220);
    });
  };

  // Card sizing depends on count so all fit in a row
  const cardW = n === 1 ? 220 : n === 3 ? 96 : 76;
  const gap = n === 1 ? 0 : n === 3 ? 12 : 8;

  return (
    <div style={{
      position: 'absolute', inset: 0, color: '#fff',
      animation: 'screen-fade-in 0.5s ease-out',
    }}>
      <MysticalBG intensity={0.8}/>

      {/* Darken for focus */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 50% at 50% 45%, transparent 0%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }}/>

      {/* Top: instruction */}
      <div style={{
        position: 'absolute', top: 90, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 5,
      }}>
        <div style={{
          fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
          color: 'rgba(212,168,74,0.7)',
        }}>
          {lang === 'vi' ? `${n} lá bài của bạn` : `Your ${n} card${n>1?'s':''}`}
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 20, color: '#f4e6c8', fontStyle: 'italic',
          textShadow: '0 2px 20px rgba(120,80,200,0.6)',
          textAlign: 'center', padding: '0 32px',
        }}>
          {allFlipped
            ? (lang === 'vi' ? 'Chạm vào một lá để xem chi tiết' : 'Tap a card to see details')
            : (lang === 'vi' ? 'Chạm vào từng lá bài để lật' : 'Tap each card to reveal')}
        </div>
      </div>

      {/* Cards row */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 20px',
      }}>
        <div style={{ display: 'flex', gap, alignItems: 'center', justifyContent: 'center' }}>
          {cards.map((c, i) => (
            <ConcurrentCard key={i} card={c} flipped={flipped[i]}
              label={positions[i]} width={cardW}
              delay={i * 120}
              onTap={() => flipOne(i)}/>
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div style={{
        position: 'absolute', bottom: 40, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        padding: '0 24px',
      }}>
        {!allFlipped && n > 1 && (
          <button onClick={flipAll} style={{
            padding: '10px 22px',
            background: 'rgba(30,15,55,0.6)',
            border: '0.5px solid rgba(212,168,74,0.5)',
            borderRadius: 999,
            color: '#f4d17a', cursor: 'pointer',
            fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}>
            {lang === 'vi' ? '✦  Lật tất cả' : '✦  Reveal all'}
          </button>
        )}
        {allFlipped && (
          <button onClick={onDone} style={{
            padding: '14px 28px',
            background: 'linear-gradient(180deg, rgba(70,40,120,0.6), rgba(30,15,55,0.8))',
            border: '0.5px solid rgba(244,209,122,0.7)',
            borderRadius: 999,
            color: '#f4e6c8', cursor: 'pointer',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16, letterSpacing: 1.5,
            boxShadow: '0 0 24px rgba(212,168,74,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>
            {lang === 'vi' ? 'Xem lời giải  →' : 'See reading  →'}
          </button>
        )}
      </div>

      {/* Focus overlay — tap a revealed card to inspect */}
      {focus !== null && flipped[focus] && (
        <FocusOverlay card={cards[focus]} label={positions[focus]}
          lang={lang} t={t} onClose={() => setFocus(null)}/>
      )}
    </div>
  );
}

function ConcurrentCard({ card, flipped, label, width, delay, onTap }) {
  const h = width * 1.6;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      animation: `screen-fade-in 0.6s ease-out ${delay}ms both`,
    }}>
      <div style={{
        fontSize: 8.5, letterSpacing: 2, textTransform: 'uppercase',
        color: 'rgba(212,168,74,0.75)',
        fontWeight: 500,
      }}>{label}</div>

      <button onClick={onTap} style={{
        width, height: h, padding: 0,
        background: 'transparent', border: 'none', cursor: 'pointer',
        perspective: 1400,
        position: 'relative',
      }}>
        {/* glow */}
        <div style={{
          position: 'absolute', inset: -10,
          borderRadius: 20,
          background: flipped
            ? `radial-gradient(ellipse 90% 90% at 50% 50%, hsl(${card.hue} 70% 55% / 0.4), transparent 70%)`
            : 'radial-gradient(ellipse 90% 90% at 50% 50%, rgba(212,168,74,0.25), transparent 70%)',
          filter: 'blur(8px)', pointerEvents: 'none',
          transition: 'all 0.8s',
        }}/>
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.9s cubic-bezier(0.7, 0, 0.3, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 8, overflow: 'hidden',
            boxShadow: '0 10px 24px rgba(0,0,0,0.6), 0 0 14px rgba(212,168,74,0.3)',
          }}>
            <CardBack width={width} glow={0.9}/>
          </div>
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 8, overflow: 'hidden',
            boxShadow: `0 10px 24px rgba(0,0,0,0.6), 0 0 18px hsl(${card.hue} 70% 60% / 0.5)`,
          }}>
            <CardFace card={card} reversed={card.reversed} width={width}/>
          </div>
        </div>
      </button>
    </div>
  );
}

function FocusOverlay({ card, label, lang, t, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'rgba(5,2,15,0.85)',
      backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'screen-fade-in 0.3s',
      cursor: 'pointer',
      padding: '60px 28px',
    }}>
      <div style={{
        fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
        color: 'rgba(212,168,74,0.75)',
      }}>{label}</div>
      <div style={{
        marginTop: 20,
        filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 24px hsl(${card.hue} 70% 60% / 0.5))`,
      }}>
        <div style={{ borderRadius: 12, overflow: 'hidden' }}>
          <CardFace card={card} reversed={card.reversed} width={200}/>
        </div>
      </div>
      <div style={{
        marginTop: 22,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 26, color: '#f4e6c8', fontWeight: 500,
        letterSpacing: 1, textAlign: 'center',
      }}>{card.name[lang]}</div>
      <div style={{
        marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '4px 14px', borderRadius: 999,
        background: card.reversed
          ? 'linear-gradient(90deg, rgba(180,40,50,0.2), rgba(120,20,30,0.2))'
          : 'linear-gradient(90deg, rgba(212,168,74,0.2), rgba(180,140,50,0.1))',
        border: `0.5px solid ${card.reversed ? 'rgba(220,80,100,0.5)' : 'rgba(212,168,74,0.5)'}`,
        fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
        color: card.reversed ? '#f0a0a0' : '#f4d17a',
      }}>
        <span style={{
          display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
          background: card.reversed ? '#e06070' : '#f4d17a',
          boxShadow: `0 0 6px ${card.reversed ? '#e06070' : '#f4d17a'}`,
        }}/>
        {card.reversed ? t.orientation.reversed : t.orientation.upright}
      </div>
      <div style={{
        marginTop: 18, fontSize: 13.5, lineHeight: 1.6, textAlign: 'center',
        color: 'rgba(230,220,250,0.85)', maxWidth: 320,
      }}>
        {card.reversed ? card.meaning.reversed[lang] : card.meaning.upright[lang]}
      </div>
      <div style={{
        position: 'absolute', bottom: 40,
        fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase',
        color: 'rgba(220,210,240,0.4)',
      }}>
        {lang === 'vi' ? 'Chạm bất kỳ đâu để đóng' : 'Tap anywhere to close'}
      </div>
    </div>
  );
}

function FlippingCard({ card, flipped }) {
  return (
    <div style={{
      perspective: 1400,
      width: 220, height: 352,
      position: 'relative',
    }}>
      {/* ambient glow */}
      <div style={{
        position: 'absolute', inset: -30,
        borderRadius: 40, pointerEvents: 'none',
        background: flipped
          ? `radial-gradient(ellipse 80% 80% at 50% 50%, hsl(${card.hue} 70% 55% / 0.35), transparent 70%)`
          : 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(212,168,74,0.22), transparent 70%)',
        transition: 'all 0.8s',
        filter: 'blur(10px)',
      }}/>

      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.9s cubic-bezier(0.7, 0, 0.3, 1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 24px rgba(212,168,74,0.3)',
        }}>
          <CardBack width={220} glow={1}/>
        </div>
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 12, overflow: 'hidden',
          boxShadow: `0 20px 40px rgba(0,0,0,0.6), 0 0 30px hsl(${card.hue} 70% 60% / 0.5)`,
        }}>
          <CardFace card={card} reversed={card.reversed} width={220}/>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RESULT SCREEN
// ─────────────────────────────────────────────────────────────
function ResultScreen({ cards, lang, onNew, goTo, active, t }) {
  const positions = TAROT_POSITIONS[cards.length][lang];
  const insight = useMemo(() => {
    const all = INSIGHT_TEMPLATES[lang];
    const idx = cards.reduce((s, c) => s + c.hue, 0) % all.length;
    return all[idx];
  }, [cards, lang]);

  const combined = useMemo(() => buildReading(cards, lang), [cards, lang]);

  return (
    <div style={{ position: 'absolute', inset: 0, color: '#fff' }}>
      <MysticalBG intensity={0.6}/>

      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto', overflowX: 'hidden',
        paddingTop: 56, paddingBottom: 110,
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '36px 24px 24px' }}>
          <div style={{
            fontSize: 11, letterSpacing: 4, textTransform: 'uppercase',
            color: 'rgba(212,168,74,0.7)',
          }}>{t.reading}</div>
          <div style={{
            marginTop: 10,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 32, fontWeight: 500, fontStyle: 'italic',
            color: '#f4e6c8',
            textShadow: '0 2px 20px rgba(120,80,200,0.6)',
          }}>
            {cards.length === 1 ? (lang === 'vi' ? 'Một thông điệp' : 'A single message')
             : cards.length === 3 ? (lang === 'vi' ? 'Ba dòng thời gian' : 'Three timelines')
             : (lang === 'vi' ? 'Bốn chiều tâm thức' : 'Four dimensions')}
          </div>
          <Divider />
        </div>

        {/* Section 1: insight */}
        <div style={{ padding: '0 24px 8px' }}>
          <Panel accent>
            <div style={{
              fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
              color: 'rgba(212,168,74,0.7)', marginBottom: 8,
            }}>{t.insight}</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 19, lineHeight: 1.45, fontStyle: 'italic',
              color: '#f4e6c8',
            }}>
              "{insight}"
            </div>
          </Panel>
        </div>

        {/* Section 2: cards */}
        <div style={{ padding: '24px 24px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {cards.map((c, i) => (
            <Panel key={i}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{
                  flexShrink: 0, width: 72, height: 115, borderRadius: 6,
                  overflow: 'hidden',
                  boxShadow: `0 4px 16px rgba(0,0,0,0.6), 0 0 12px hsl(${c.hue} 60% 50% / 0.3)`,
                  border: '0.5px solid rgba(212,168,74,0.3)',
                }}>
                  <CardFace card={c} reversed={c.reversed} width={72}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase',
                    color: 'rgba(212,168,74,0.75)',
                  }}>{positions[i]}</div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, fontWeight: 500,
                    color: '#f4e6c8', marginTop: 2, lineHeight: 1.15,
                  }}>{c.name[lang]}</div>
                  <div style={{
                    marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 9.5, letterSpacing: 1.5, textTransform: 'uppercase',
                    color: c.reversed ? '#f0a0a0' : '#f4d17a',
                  }}>
                    <span style={{
                      display: 'inline-block', width: 4, height: 4, borderRadius: '50%',
                      background: c.reversed ? '#e06070' : '#f4d17a',
                    }}/>
                    {c.reversed ? t.orientation.reversed : t.orientation.upright}
                  </div>
                </div>
              </div>
              <div style={{
                marginTop: 14, paddingTop: 14,
                borderTop: '0.5px solid rgba(212,168,74,0.15)',
                fontSize: 13.5, lineHeight: 1.6,
                color: 'rgba(230,220,250,0.85)',
              }}>
                {c.reversed ? c.meaning.reversed[lang] : c.meaning.upright[lang]}
              </div>
            </Panel>
          ))}
        </div>

        {/* Section 3: combined */}
        <div style={{ padding: '20px 24px 12px' }}>
          <Panel>
            <div style={{
              fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
              color: 'rgba(212,168,74,0.7)', marginBottom: 10,
            }}>{t.interpretation}</div>
            <div style={{
              fontSize: 14, lineHeight: 1.7,
              color: 'rgba(230,220,250,0.88)',
            }}>
              {combined}
            </div>
          </Panel>
        </div>

        {/* CTA */}
        <div style={{ padding: '8px 24px 12px' }}>
          <button onClick={onNew} style={{
            width: '100%', padding: '16px',
            background: 'linear-gradient(180deg, rgba(70,40,120,0.55), rgba(30,15,55,0.75))',
            border: '0.5px solid rgba(212,168,74,0.6)',
            borderRadius: 14,
            color: '#f4e6c8', cursor: 'pointer',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18, fontWeight: 500, letterSpacing: 1.5,
            boxShadow: '0 0 0 0.5px rgba(212,168,74,0.4), 0 0 24px rgba(212,168,74,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>
            ✦ &nbsp; {t.newReading} &nbsp; ✦
          </button>
        </div>
      </div>
    </div>
  );
}

function buildReading(cards, lang) {
  if (cards.length === 1) {
    const c = cards[0];
    const orient = c.reversed ? c.meaning.reversed[lang] : c.meaning.upright[lang];
    if (lang === 'vi') {
      return `Vũ trụ gửi đến bạn một thông điệp duy nhất: ${c.name.vi}${c.reversed ? ' (ngược)' : ''}. ${orient} Hãy mang theo năng lượng này trong những ngày tới và để trực giác dẫn đường.`;
    }
    return `The universe offers a single message: ${c.name.en}${c.reversed ? ' (reversed)' : ''}. ${orient} Carry this energy with you in the days ahead, and let intuition be your guide.`;
  }
  if (cards.length === 3) {
    const [a, b, c] = cards;
    if (lang === 'vi') {
      return `Quá khứ của bạn được đánh dấu bởi ${a.name.vi}${a.reversed ? ' (ngược)' : ''}, để lại một dấu ấn tinh vi lên hiện tại. Ngay lúc này, ${b.name.vi}${b.reversed ? ' (ngược)' : ''} đang là năng lượng chủ đạo — hãy quan sát kỹ những gì nó muốn nói. Lời khuyên của vũ trụ thể hiện qua ${c.name.vi}${c.reversed ? ' (ngược)' : ''}: đây là hướng đi, nếu bạn đủ can đảm để lắng nghe.`;
    }
    return `Your past is marked by ${a.name.en}${a.reversed ? ' (reversed)' : ''}, leaving a subtle imprint on the present. Right now, ${b.name.en}${b.reversed ? ' (reversed)' : ''} is the dominant current — watch closely what it wishes to say. Guidance from the universe moves through ${c.name.en}${c.reversed ? ' (reversed)' : ''}: this is the path, if you are brave enough to listen.`;
  }
  const [a, b, c, d] = cards;
  if (lang === 'vi') {
    return `Bản thân bạn đang mang năng lượng của ${a.name.vi}${a.reversed ? ' (ngược)' : ''} — đây là điều cốt lõi bạn cần thừa nhận. Ngoại cảnh xung quanh phản ánh qua ${b.name.vi}${b.reversed ? ' (ngược)' : ''}, định hình bối cảnh mà bạn đang sống. Bài học mà tình huống này mang đến là ${c.name.vi}${c.reversed ? ' (ngược)' : ''} — hãy đón nhận nó với lòng khiêm nhường. Và hành động được khuyên là theo tinh thần của ${d.name.vi}${d.reversed ? ' (ngược)' : ''}.`;
  }
  return `You carry the energy of ${a.name.en}${a.reversed ? ' (reversed)' : ''} — this is the core truth to acknowledge. The world around you mirrors ${b.name.en}${b.reversed ? ' (reversed)' : ''}, shaping the scene you live in. The lesson this brings is ${c.name.en}${c.reversed ? ' (reversed)' : ''} — receive it with humility. And the suggested action moves in the spirit of ${d.name.en}${d.reversed ? ' (reversed)' : ''}.`;
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginTop: 18 }}>
      <div style={{ width: 40, height: 0.5, background: 'linear-gradient(to right, transparent, rgba(212,168,74,0.6))' }}/>
      <svg width="8" height="8" viewBox="0 0 10 10"><path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#d4a84a" opacity="0.8"/></svg>
      <div style={{ width: 40, height: 0.5, background: 'linear-gradient(to left, transparent, rgba(212,168,74,0.6))' }}/>
    </div>
  );
}

function Panel({ children, accent = false }) {
  return (
    <div style={{
      padding: 18,
      background: accent
        ? 'linear-gradient(135deg, rgba(50,25,90,0.5), rgba(20,10,40,0.7))'
        : 'linear-gradient(135deg, rgba(25,12,50,0.55), rgba(15,8,30,0.75))',
      border: `0.5px solid ${accent ? 'rgba(212,168,74,0.45)' : 'rgba(212,168,74,0.22)'}`,
      borderRadius: 14,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: accent
        ? '0 0 20px rgba(120,80,200,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
        : '0 2px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DONATE SCREEN
// ─────────────────────────────────────────────────────────────
function DonateScreen({ lang, t }) {
  const AMOUNTS = [1, 5, 9, 19, 29, 49, 99, 199, 299, 499, 999];
  const [selected, setSelected] = useState(9);
  const [thanked, setThanked] = useState(false);

  return (
    <div style={{ position: 'absolute', inset: 0, color: '#fff' }}>
      <MysticalBG intensity={0.5}/>

      <div style={{
        position: 'absolute', inset: 0, paddingTop: 72, paddingBottom: 110,
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '28px 24px 18px' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" style={{ filter: 'drop-shadow(0 0 10px rgba(212,168,74,0.5))' }}>
            <path d="M24 42s-16-10-16-22a10 10 0 0118-6 10 10 0 0118 6c0 12-16 22-16 22h-4z"
                  stroke="#d4a84a" strokeWidth="1.2" fill="rgba(212,168,74,0.12)"/>
          </svg>
          <div style={{
            marginTop: 8,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 30, fontWeight: 500, fontStyle: 'italic',
            color: '#f4e6c8',
          }}>{t.donateTitle}</div>
          <div style={{
            marginTop: 12, fontSize: 13.5, lineHeight: 1.6,
            color: 'rgba(220,210,240,0.75)',
            maxWidth: 320, margin: '12px auto 0',
          }}>
            {t.donateMsg}
          </div>
          <Divider/>
        </div>

        {/* Amount grid */}
        <div style={{ padding: '8px 24px 0' }}>
          <div style={{
            fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
            color: 'rgba(212,168,74,0.7)', marginBottom: 12, textAlign: 'center',
          }}>{t.chooseAmount}</div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          }}>
            {AMOUNTS.map(a => {
              const isSel = selected === a;
              const isBig = a >= 199;
              return (
                <button key={a} onClick={() => setSelected(a)}
                  style={{
                    padding: '14px 8px',
                    background: isSel
                      ? 'linear-gradient(180deg, rgba(100,50,140,0.6), rgba(40,15,80,0.75))'
                      : 'linear-gradient(180deg, rgba(25,12,50,0.55), rgba(15,8,30,0.7))',
                    border: `0.5px solid ${isSel ? 'rgba(244,209,122,0.85)' : 'rgba(212,168,74,0.25)'}`,
                    borderRadius: 12,
                    cursor: 'pointer',
                    color: isSel ? '#f4e6c8' : 'rgba(220,210,240,0.8)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, fontWeight: 500,
                    boxShadow: isSel
                      ? (isBig
                          ? '0 0 0 1px rgba(244,209,122,0.7), 0 0 20px rgba(230,100,80,0.35), inset 0 1px 0 rgba(255,255,255,0.1)'
                          : '0 0 0 1px rgba(244,209,122,0.7), 0 0 20px rgba(244,209,122,0.35), inset 0 1px 0 rgba(255,255,255,0.1)')
                      : '0 2px 10px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s',
                    position: 'relative', overflow: 'hidden',
                  }}>
                  <span style={{ fontSize: 13, opacity: 0.7, marginRight: 2 }}>$</span>{a}
                  {isSel && (
                    <div style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: isBig
                        ? 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(230,100,80,0.15), transparent 70%)'
                        : 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(244,209,122,0.12), transparent 70%)',
                    }}/>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm button */}
        <div style={{ padding: '22px 24px 0' }}>
          <button onClick={() => { setThanked(true); setTimeout(() => setThanked(false), 2800); }}
            style={{
              width: '100%', padding: '18px',
              background: 'linear-gradient(180deg, rgba(140,60,180,0.55), rgba(60,20,100,0.75))',
              border: '0.5px solid rgba(244,209,122,0.7)',
              borderRadius: 14,
              color: '#f4e6c8', cursor: 'pointer',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 18, fontWeight: 500, letterSpacing: 1.5,
              boxShadow: '0 0 28px rgba(212,168,74,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}>
            ♡ &nbsp; {t.donateConfirm} &nbsp; · &nbsp; ${selected}
          </button>
        </div>
      </div>

      {/* Thanks overlay */}
      {thanked && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 60,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,2,15,0.82)',
          backdropFilter: 'blur(20px)',
          animation: 'screen-fade-in 0.4s',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,209,122,0.35), rgba(212,168,74,0.05))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '0.5px solid rgba(244,209,122,0.6)',
            boxShadow: '0 0 30px rgba(244,209,122,0.5)',
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <path d="M8 16 L14 22 L24 10" stroke="#f4d17a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{
            marginTop: 18,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26, fontStyle: 'italic', color: '#f4e6c8',
          }}>{t.thankyou}</div>
          <div style={{
            marginTop: 6, fontSize: 13, color: 'rgba(220,210,240,0.6)',
            textAlign: 'center', padding: '0 40px',
          }}>{t.thankyouSub}</div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  MysticalBG, BottomNav, LangToggle,
  HomeScreen, ShuffleScreen, RevealScreen, ResultScreen, DonateScreen,
});
