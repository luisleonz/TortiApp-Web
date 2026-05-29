/* shell.jsx — encabezado de pantalla + barra de navegación inferior. window.Shell */
(function () {
  const { Icon } = window;

  // Encabezado fijo (despeja la barra de estado del iPhone)
  function ScreenHeader({ title, subtitle, right, onBack, large, accessory }) {
    return (
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'var(--header-bg)', backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        borderBottom: '1px solid var(--header-line)',
        padding: '58px 18px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 38 }}>
          {onBack && (
            <button className="ta-btn" onClick={onBack} style={{
              width: 38, height: 38, marginLeft: -6, borderRadius: 11, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              background: 'transparent', color: 'var(--primary-ink)',
            }}>
              <Icon name="chevL" size={24} stroke={2.4} />
            </button>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: large ? 27 : 21, color: 'var(--ink)', letterSpacing: -0.5,
              lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{title}</div>
            {subtitle && <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 3, fontWeight: 500 }}>{subtitle}</div>}
          </div>
          {right && <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>{right}</div>}
        </div>
        {accessory && <div style={{ marginTop: 12 }}>{accessory}</div>}
      </div>
    );
  }

  const NAV = [
    { key: 'inicio', label: 'Inicio', icon: 'home' },
    { key: 'empleados', label: 'Empleados', icon: 'users' },
    { key: 'nomina', label: 'Nómina', icon: 'calc' },
    { key: 'asistencia', label: 'Asistencia', icon: 'calendar' },
    { key: 'historial', label: 'Historial', icon: 'history' },
  ];

  function BottomNav({ active, onNav }) {
    return (
      <div style={{
        flexShrink: 0, position: 'relative', zIndex: 40,
        background: 'var(--nav-bg)', backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        borderTop: '1px solid var(--header-line)',
        padding: '8px 6px 30px',
        display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
      }}>
        {NAV.map(n => {
          const on = active === n.key;
          const hero = n.key === 'nomina';
          return (
            <button key={n.key} className="ta-btn" onClick={() => onNav(n.key)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              background: 'transparent', cursor: 'pointer', padding: '4px 0',
              color: on ? 'var(--primary-ink)' : 'var(--ink-3)',
              WebkitTapHighlightColor: 'transparent',
            }}>
              {hero ? (
                <div style={{
                  width: 46, height: 34, marginTop: -2, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: on ? 'var(--primary)' : 'var(--primary-soft)',
                  color: on ? 'var(--on-primary)' : 'var(--primary-ink)',
                  boxShadow: on ? '0 4px 12px -3px rgba(120,75,20,.5)' : 'none',
                  transition: 'all .18s ease',
                }}>
                  <Icon name={n.icon} size={22} stroke={2.1} />
                </div>
              ) : (
                <Icon name={n.icon} size={24} stroke={on ? 2.3 : 1.9} />
              )}
              <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 600, letterSpacing: 0.1 }}>{n.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  window.Shell = { ScreenHeader, BottomNav, NAV };
})();
