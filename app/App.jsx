/* App.jsx — raíz: tema, navegación, sesión y panel de Tweaks. */
(function () {
  const { useState, useEffect, useRef } = React;
  const S = window.Store, Icon = window.Icon;
  const { Toast } = window.UI;
  const { BottomNav } = window.Shell;
  const Sc = window.Screens;
  const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakColor } = window;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "tema": "ambar",
    "tipografia": "Hanken Grotesk",
    "esquinas": "suaves",
    "payrollLayout": "todo",
    "captureMode": "teclado"
  }/*EDITMODE-END*/;

  const TEMAS = {
    ambar:    { '--primary': '#B5740F', '--primary-ink': '#8A5A0C', '--primary-soft': '#F6E7C8', '--on-primary': '#FFFDF7' },
    mezquite: { '--primary': '#7A4A1E', '--primary-ink': '#6B3F18', '--primary-soft': '#ECE0CE', '--on-primary': '#FBF6EF' },
    comal:    { '--primary': '#B0532A', '--primary-ink': '#934323', '--primary-soft': '#F6E0D4', '--on-primary': '#FFF8F3' },
  };
  const ESQUINAS = {
    redondeadas: { '--r-card': '20px', '--r-field': '14px', '--r-btn': '14px' },
    suaves:      { '--r-card': '16px', '--r-field': '12px', '--r-btn': '12px' },
    rectas:      { '--r-card': '9px',  '--r-field': '9px',  '--r-btn': '9px' },
  };

  const LS = {
    get auth() { try { return localStorage.getItem('tortiapp_auth') === '1'; } catch (e) { return false; } },
    set auth(v) { try { localStorage.setItem('tortiapp_auth', v ? '1' : '0'); } catch (e) {} },
    get tab() { try { return localStorage.getItem('tortiapp_tab') || 'inicio'; } catch (e) { return 'inicio'; } },
    set tab(v) { try { localStorage.setItem('tortiapp_tab', v); } catch (e) {} },
  };

  function Stage({ children }) {
    const [scale, setScale] = useState(1);
    useEffect(() => {
      const fit = () => {
        setScale(Math.min(window.innerWidth / 402, window.innerHeight / 874, 1));
      };
      fit();
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }, []);
    // Sin transform cuando el dispositivo ya cabe (mejor captura/render).
    const scaled = scale < 0.999;
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--stage)', overflow: 'hidden' }}>
        <div style={scaled ? { transform: `scale(${scale})`, transformOrigin: 'center' } : undefined}>{children}</div>
      </div>
    );
  }

  function App() {
    const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [authed, setAuthed] = useState(LS.auth);
    const [tab, setTab] = useState(LS.tab);
    const [toast, setToastMsg] = useState('');
    const [tarifasOpen, setTarifasOpen] = useState(false);
    const tRef = useRef(null);

    const showToast = (m) => { setToastMsg(m); clearTimeout(tRef.current); tRef.current = setTimeout(() => setToastMsg(''), 2200); };
    const go = (t) => { setTab(t); LS.tab = t; };
    const login = () => { setAuthed(true); LS.auth = true; };
    const logout = () => { setAuthed(false); LS.auth = false; };

    const themeVars = { ...TEMAS[tw.tema] || TEMAS.ambar, ...ESQUINAS[tw.esquinas] || ESQUINAS.suaves, '--font': `'${tw.tipografia}', system-ui, sans-serif`, '--font-display': `'${tw.tipografia}', system-ui, sans-serif` };

    const screen = () => {
      if (tab === 'inicio') return <Sc.Inicio go={go} onLogout={logout} openTarifas={() => setTarifasOpen(true)} />;
      if (tab === 'empleados') return <Sc.Empleados toast={showToast} />;
      if (tab === 'nomina') return <Sc.Nomina toast={showToast} tw={{ payrollLayout: tw.payrollLayout, captureMode: tw.captureMode }} />;
      if (tab === 'asistencia') return <Sc.Asistencia toast={showToast} />;
      if (tab === 'historial') return <Sc.Historial />;
      if (tab === 'prestamos') return <Sc.Prestamos onBack={() => go('inicio')} toast={showToast} />;
      return null;
    };

    return (
      <Stage>
        <div className="ta-root" style={themeVars}>
          <window.IOSDevice>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', fontFamily: 'var(--font)' }}>
              {!authed ? (
                <div style={{ flex: 1, overflow: 'auto' }}><Sc.Login onLogin={login} /></div>
              ) : (
                <React.Fragment>
                  <div key={tab} className="ta-scroll" style={{ flex: 1, overflow: 'auto', position: 'relative' }}>{screen()}</div>
                  <BottomNav active={tab} onNav={go} />
                </React.Fragment>
              )}
              <Sc.Tarifas open={tarifasOpen} onClose={() => setTarifasOpen(false)} toast={showToast} />
              <Toast msg={toast} />
            </div>
          </window.IOSDevice>
        </div>

        <TweaksPanel>
          <TweakSection label="Pantalla de nómina" />
          <TweakRadio label="Layout" value={tw.payrollLayout} onChange={v => setTweak('payrollLayout', v)}
            options={[{ value: 'todo', label: 'Todo' }, { value: 'asistente', label: 'Asistente' }, { value: 'acordeon', label: 'Acordeón' }]} />
          <TweakRadio label="Captura" value={tw.captureMode} onChange={v => setTweak('captureMode', v)}
            options={[{ value: 'teclado', label: 'Teclado' }, { value: 'stepper', label: '+ / −' }, { value: 'tabla', label: 'Tabla' }]} />
          <TweakSection label="Estilo" />
          <TweakColor label="Tema" value={(TEMAS[tw.tema] || TEMAS.ambar)['--primary']}
            options={Object.keys(TEMAS).map(k => TEMAS[k]['--primary'])}
            onChange={hex => setTweak('tema', Object.keys(TEMAS).find(k => TEMAS[k]['--primary'] === hex) || 'ambar')} />
          <TweakSelect label="Tipografía" value={tw.tipografia} onChange={v => setTweak('tipografia', v)}
            options={['Hanken Grotesk', 'Albert Sans', 'IBM Plex Sans']} />
          <TweakRadio label="Esquinas" value={tw.esquinas} onChange={v => setTweak('esquinas', v)}
            options={[{ value: 'redondeadas', label: 'Redond.' }, { value: 'suaves', label: 'Suaves' }, { value: 'rectas', label: 'Rectas' }]} />
        </TweaksPanel>
      </Stage>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
})();
