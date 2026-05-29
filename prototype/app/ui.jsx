/* ui.jsx — primitivas de interfaz compartidas. Exporta a window.UI */
(function () {
  const { useState, useEffect, useRef } = React;

  const TIPO_COLOR = {
    Panadero: { bg: 'var(--amber-soft)', fg: 'var(--amber-ink)', dot: 'var(--amber)' },
    Tortillero: { bg: 'var(--brown-soft)', fg: 'var(--brown-ink)', dot: 'var(--brown)' },
    Mostrador: { bg: 'var(--green-soft)', fg: 'var(--green-ink)', dot: 'var(--green)' },
  };

  // ── Botón ────────────────────────────────────────────────
  function Button({ children, variant = 'primary', size = 'md', full, icon, style, ...rest }) {
    const base = {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: 'var(--font)', fontWeight: 600, cursor: 'pointer',
      border: '1px solid transparent', borderRadius: 'var(--r-btn)',
      transition: 'transform .12s ease, background .15s ease, box-shadow .15s ease',
      width: full ? '100%' : undefined, whiteSpace: 'nowrap',
      WebkitTapHighlightColor: 'transparent',
    };
    const sizes = {
      sm: { height: 38, padding: '0 14px', fontSize: 14 },
      md: { height: 50, padding: '0 18px', fontSize: 16 },
      lg: { height: 58, padding: '0 22px', fontSize: 17.5 },
    };
    const variants = {
      primary: { background: 'var(--primary)', color: 'var(--on-primary)', boxShadow: '0 1px 2px rgba(80,50,10,.18), 0 6px 16px -8px rgba(120,75,20,.45)' },
      soft: { background: 'var(--primary-soft)', color: 'var(--primary-ink)' },
      ghost: { background: 'transparent', color: 'var(--ink)' },
      outline: { background: 'var(--surface)', color: 'var(--ink)', borderColor: 'var(--line)' },
      danger: { background: 'var(--red-soft)', color: 'var(--red)' },
      dark: { background: 'var(--ink)', color: 'var(--surface)' },
    };
    return (
      <button className="ta-btn" style={{ ...base, ...sizes[size], ...variants[variant], ...style }} {...rest}>
        {icon && <Icon name={icon} size={size === 'sm' ? 17 : 19} stroke={2.1} />}
        {children}
      </button>
    );
  }

  function IconButton({ name, size = 44, stroke = 2, variant = 'plain', style, iconSize, ...rest }) {
    const variants = {
      plain: { background: 'transparent', color: 'var(--ink-2)' },
      surface: { background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)' },
      soft: { background: 'var(--primary-soft)', color: 'var(--primary-ink)' },
    };
    return (
      <button className="ta-btn" style={{
        width: size, height: size, borderRadius: 12, flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', WebkitTapHighlightColor: 'transparent', ...variants[variant], ...style,
      }} {...rest}>
        <Icon name={name} size={iconSize || Math.round(size * 0.46)} stroke={stroke} />
      </button>
    );
  }

  // ── Avatar ───────────────────────────────────────────────
  function Avatar({ emp, size = 44 }) {
    const initials = (emp.nombre || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const c = TIPO_COLOR[emp.tipo] || TIPO_COLOR.Panadero;
    if (emp.foto) return <img src={emp.foto} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: c.bg, color: c.fg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontWeight: 700, fontSize: size * 0.36, letterSpacing: 0.3,
      }}>{initials}</div>
    );
  }

  function TipoBadge({ tipo, size = 'md' }) {
    const c = TIPO_COLOR[tipo] || TIPO_COLOR.Panadero;
    const sm = size === 'sm';
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: c.bg, color: c.fg, borderRadius: 999,
        padding: sm ? '3px 9px' : '5px 11px', fontSize: sm ? 11.5 : 13, fontWeight: 600,
      }}>
        <span style={{ width: sm ? 5 : 6, height: sm ? 5 : 6, borderRadius: 99, background: c.dot }} />
        {tipo}
      </span>
    );
  }

  // ── Campo de texto ───────────────────────────────────────
  function Field({ label, hint, icon, suffix, prefix, style, inputRef, ...rest }) {
    return (
      <label style={{ display: 'block', ...style }}>
        {label && <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 7, paddingLeft: 2 }}>{label}</div>}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)',
          border: '1px solid var(--line)', borderRadius: 'var(--r-field)', padding: '0 14px',
          height: 52, transition: 'border-color .15s, box-shadow .15s',
        }} className="ta-field">
          {icon && <span style={{ color: 'var(--ink-3)', display: 'flex' }}><Icon name={icon} size={19} /></span>}
          {prefix && <span style={{ color: 'var(--ink-3)', fontSize: 16, fontWeight: 600 }}>{prefix}</span>}
          <input ref={inputRef} style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font)', fontSize: 16.5, color: 'var(--ink)', minWidth: 0, height: '100%',
          }} {...rest} />
          {suffix && <span style={{ color: 'var(--ink-3)', fontSize: 14.5, fontWeight: 600 }}>{suffix}</span>}
        </div>
        {hint && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 6, paddingLeft: 2 }}>{hint}</div>}
      </label>
    );
  }

  // ── Stepper numérico (+ / −) ─────────────────────────────
  function Stepper({ value, onChange, step = 1, min = 0, max = 999999, big }) {
    const v = +value || 0;
    const dim = big ? 52 : 44;
    const set = (nv) => onChange(Math.max(min, Math.min(max, nv)));
    const btn = (dir) => (
      <button className="ta-btn" onClick={() => set(v + dir * step)} style={{
        width: dim, height: dim, borderRadius: 12, flexShrink: 0, cursor: 'pointer',
        background: 'var(--primary-soft)', color: 'var(--primary-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={dir > 0 ? 'plus' : 'minus'} size={big ? 22 : 19} stroke={2.4} />
      </button>
    );
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {btn(-1)}
        <input inputMode="numeric" value={v === 0 ? '' : v} placeholder="0"
          onChange={(e) => set(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
          style={{
            flex: 1, minWidth: 0, textAlign: 'center', height: dim,
            border: '1px solid var(--line)', borderRadius: 12, background: 'var(--surface)',
            fontFamily: 'var(--font)', fontVariantNumeric: 'tabular-nums',
            fontSize: big ? 24 : 19, fontWeight: 700, color: 'var(--ink)', outline: 'none',
          }} />
        {btn(1)}
      </div>
    );
  }

  // ── Segmented control ────────────────────────────────────
  function Segmented({ value, onChange, options, full }) {
    return (
      <div style={{
        display: 'flex', gap: 4, background: 'var(--surface-2)', border: '1px solid var(--line)',
        borderRadius: 13, padding: 4, width: full ? '100%' : undefined,
      }}>
        {options.map(o => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          const on = val === value;
          return (
            <button key={val} className="ta-btn" onClick={() => onChange(val)} style={{
              flex: full ? 1 : undefined, padding: '9px 13px', borderRadius: 10, cursor: 'pointer',
              fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
              background: on ? 'var(--surface)' : 'transparent',
              color: on ? 'var(--ink)' : 'var(--ink-3)',
              boxShadow: on ? '0 1px 3px rgba(0,0,0,.1)' : 'none',
              transition: 'all .15s ease',
            }}>{lbl}</button>
          );
        })}
      </div>
    );
  }

  // ── Card ─────────────────────────────────────────────────
  function Card({ children, style, pad = 16, onClick }) {
    return (
      <div onClick={onClick} style={{
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-card)',
        padding: pad, boxShadow: '0 1px 2px rgba(60,40,10,.04)',
        cursor: onClick ? 'pointer' : undefined, ...style,
      }}>{children}</div>
    );
  }

  function SectionLabel({ children, action }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 4px 10px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{children}</div>
        {action}
      </div>
    );
  }

  // ── Bottom sheet / modal ─────────────────────────────────
  function Sheet({ open, onClose, children, title, full }) {
    const [mounted, setMounted] = useState(open);
    const [show, setShow] = useState(false);
    useEffect(() => {
      if (open) { setMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => setShow(true))); }
      else { setShow(false); const t = setTimeout(() => setMounted(false), 260); return () => clearTimeout(t); }
    }, [open]);
    if (!mounted) return null;
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <div onClick={onClose} style={{
          position: 'absolute', inset: 0, background: 'rgba(40,28,12,.4)',
          opacity: show ? 1 : 0, transition: 'opacity .26s ease', backdropFilter: 'blur(1px)',
        }} />
        <div style={{
          position: 'relative', background: 'var(--bg)', borderRadius: '26px 26px 0 0',
          maxHeight: full ? '94%' : '88%', display: 'flex', flexDirection: 'column',
          transform: show ? 'translateY(0)' : 'translateY(102%)',
          transition: 'transform .3s cubic-bezier(.32,.72,0,1)',
          boxShadow: '0 -10px 40px rgba(40,28,12,.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 4px' }}>
            <div style={{ width: 40 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 8, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ width: 38, height: 5, borderRadius: 99, background: 'var(--line)' }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>{title}</div>
            <IconButton name="x" size={40} variant="surface" onClick={onClose} iconSize={20} />
          </div>
          <div style={{ overflow: 'auto', padding: '8px 16px 20px', WebkitOverflowScrolling: 'touch' }}>{children}</div>
        </div>
      </div>
    );
  }

  // ── Toast ────────────────────────────────────────────────
  function Toast({ msg }) {
    if (!msg) return null;
    return (
      <div style={{
        position: 'absolute', left: '50%', bottom: 104, transform: 'translateX(-50%)',
        background: 'var(--ink)', color: 'var(--surface)', padding: '12px 20px',
        borderRadius: 999, fontSize: 14.5, fontWeight: 600, zIndex: 300, whiteSpace: 'nowrap',
        boxShadow: '0 8px 24px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', gap: 8,
        animation: 'taToast .3s ease',
      }}>
        <Icon name="check" size={17} stroke={2.6} /> {msg}
      </div>
    );
  }

  function EmptyState({ icon = 'info', title, sub, action }) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--ink-3)' }}>
        <div style={{ display: 'inline-flex', padding: 18, borderRadius: 20, background: 'var(--surface-2)', color: 'var(--ink-3)', marginBottom: 14 }}>
          <Icon name={icon} size={28} stroke={1.7} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 6 }}>{title}</div>
        {sub && <div style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 260, margin: '0 auto' }}>{sub}</div>}
        {action && <div style={{ marginTop: 18 }}>{action}</div>}
      </div>
    );
  }

  window.UI = { Button, IconButton, Avatar, TipoBadge, Field, Stepper, Segmented, Card, SectionLabel, Sheet, Toast, EmptyState, TIPO_COLOR };
})();
