// Main app — router, state, Tweaks integration
const { useState: useState2, useEffect: useEffect2, useRef: useRef2 } = React;

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "lang": "vi",
  "particleDensity": 1,
  "goldAccent": "#d4a84a",
  "shuffleDuration": 2600,
  "serifFont": "Cormorant Garamond"
}/*EDITMODE-END*/;

function TarotApp() {
  const [tweaks, setTweaks] = useTweaks(DEFAULT_TWEAKS);
  const [lang, setLang] = useState2(tweaks.lang || 'vi');
  const [screen, setScreen] = useState2('home'); // home | shuffle | reveal | result | donate
  const [tab, setTab] = useState2('home'); // home | donate
  const [spreadN, setSpreadN] = useState2(3);
  const [cards, setCards] = useState2([]);
  const [transitionKey, setTransitionKey] = useState2(0);

  useEffect2(() => { setLang(tweaks.lang || 'vi'); }, [tweaks.lang]);

  const t = I18N[lang];

  const startSpread = (n) => {
    setSpreadN(n);
    // draw n unique cards with random orientation
    const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, n).map(c => ({ ...c, reversed: Math.random() < 0.35 }));
    setCards(picked);
    setTransitionKey(k => k + 1);
    setScreen('shuffle');
    setTab('home');
  };

  const handleNav = (key) => {
    setTab(key);
    if (key === 'home') {
      setTransitionKey(k => k + 1);
      setScreen('home');
    } else if (key === 'donate') {
      setTransitionKey(k => k + 1);
      setScreen('donate');
    }
  };

  const onLangChange = (v) => {
    setLang(v);
    setTweaks({ lang: v });
  };

  // Show bottom nav on home / donate / result
  const showNav = screen === 'home' || screen === 'donate' || screen === 'result';
  const showLang = screen === 'home' || screen === 'donate';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div key={transitionKey} style={{ position: 'absolute', inset: 0, animation: 'screen-fade-in 0.5s ease-out' }}>
        {screen === 'home' && (
          <HomeScreen lang={lang} onSpread={startSpread} goTo={setScreen} t={t}/>
        )}
        {screen === 'shuffle' && (
          <ShuffleScreen onComplete={() => { setTransitionKey(k => k + 1); setScreen('reveal'); }} t={t}/>
        )}
        {screen === 'reveal' && (
          <RevealScreen cards={cards} lang={lang}
            onDone={() => { setTransitionKey(k => k + 1); setScreen('result'); setTab('home'); }} t={t}/>
        )}
        {screen === 'result' && (
          <ResultScreen cards={cards} lang={lang}
            onNew={() => { setTransitionKey(k => k + 1); setScreen('home'); }} t={t}/>
        )}
        {screen === 'donate' && (
          <DonateScreen lang={lang} t={t}/>
        )}
      </div>

      {showLang && <LangToggle lang={lang} onChange={onLangChange}/>}
      {showNav && <BottomNav active={tab} onNav={handleNav} t={t}/>}

      <TarotTweaks tweaks={tweaks} setTweaks={setTweaks}/>
    </div>
  );
}

function TarotTweaks({ tweaks, setTweaks }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Language & Copy">
        <TweakRadio label="Default language" value={tweaks.lang}
          options={[{ value: 'vi', label: '🇻🇳 Tiếng Việt' }, { value: 'en', label: '🇺🇸 English' }]}
          onChange={v => setTweaks({ lang: v })}/>
      </TweakSection>
      <TweakSection title="Atmosphere">
        <TweakSlider label="Particle density" value={tweaks.particleDensity}
          min={0} max={2} step={0.1}
          onChange={v => setTweaks({ particleDensity: v })}/>
        <TweakNumber label="Shuffle duration (ms)" value={tweaks.shuffleDuration}
          min={800} max={6000} step={100}
          onChange={v => setTweaks({ shuffleDuration: v })}/>
      </TweakSection>
      <TweakSection title="Visual Style">
        <TweakColor label="Gold accent" value={tweaks.goldAccent}
          onChange={v => setTweaks({ goldAccent: v })}/>
        <TweakSelect label="Serif font" value={tweaks.serifFont}
          options={['Cormorant Garamond', 'Cinzel', 'Cardo', 'EB Garamond']}
          onChange={v => setTweaks({ serifFont: v })}/>
      </TweakSection>
    </TweaksPanel>
  );
}

// Mount inside iOS device, scaled to fit viewport
function Mount() {
  const [scale, setScale] = useState2(1);
  useEffect2(() => {
    const compute = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const fw = 402, fh = 874;
      const pad = 40;
      const s = Math.min((w - pad) / fw, (h - pad) / fh, 1);
      setScale(s);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `
        radial-gradient(ellipse at 30% 20%, #1a0830 0%, transparent 50%),
        radial-gradient(ellipse at 70% 80%, #2a0a40 0%, transparent 50%),
        #030108
      `,
      overflow: 'hidden',
    }}>
      {/* Ambient page stars */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          {Array.from({ length: 50 }).map((_, i) => {
            const x = (i * 53 + 11) % 100;
            const y = (i * 73 + 17) % 100;
            return <circle key={i} cx={`${x}%`} cy={`${y}%`} r={(i%5===0)?1:0.5} fill="#fff" opacity={0.15 + (i%4)*0.07}/>;
          })}
        </svg>
      </div>

      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
        <IOSDevice width={402} height={874} dark={true}>
          <TarotApp/>
        </IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Mount/>);
