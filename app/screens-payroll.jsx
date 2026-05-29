/* screens-payroll.jsx — Asistencia, Nómina (pantalla estrella, con variaciones), Historial */
(function () {
  const { useState, useMemo, useEffect } = React;
  const S = window.Store, Icon = window.Icon;
  const { Button, IconButton, Avatar, TipoBadge, Field, Stepper, Segmented, Card, SectionLabel, Sheet, EmptyState } = window.UI;
  const { ScreenHeader } = window.Shell;

  // ── Selector de semana ───────────────────────────────────
  function WeekNav({ week, setWeek, compact }) {
    const isThis = week === S.weekId(new Date());
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 13, padding: 5 }}>
        <IconButton name="chevL" size={compact ? 36 : 40} variant="plain" onClick={() => setWeek(S.addWeeks(week, -1))} iconSize={20} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{S.weekLabel(week)}</div>
          <div style={{ fontSize: 11.5, color: isThis ? 'var(--green-ink)' : 'var(--ink-3)', fontWeight: 600 }}>{isThis ? 'Semana actual' : S.weekFromId(week).getFullYear()}</div>
        </div>
        <IconButton name="chevR" size={compact ? 36 : 40} variant="plain" onClick={() => setWeek(S.addWeeks(week, 1))} iconSize={20} disabled={isThis}
          style={{ opacity: isThis ? 0.3 : 1 }} />
      </div>
    );
  }

  // ════════════════════════════ ASISTENCIA ════════════════════════════
  function Asistencia({ toast }) {
    const db = S.useDB();
    const [week, setWeek] = useState(S.weekId(new Date()));
    const mostrador = db.employees.filter(e => e.activo && e.tipo === 'Mostrador');

    return (
      <React.Fragment>
        <ScreenHeader title="Asistencia" large subtitle="Empleados de mostrador"
          accessory={<WeekNav week={week} setWeek={setWeek} />} />
        <div style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mostrador.length === 0 ? (
            <EmptyState icon="calendar" title="Sin empleados de mostrador" sub="La asistencia solo aplica a empleados tipo Mostrador." />
          ) : mostrador.map(e => <AsistRow key={e.id} emp={e} week={week} toast={toast} />)}
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', textAlign: 'center', marginTop: 4, lineHeight: 1.5 }}>
            Los días marcados se usan automáticamente al calcular la nómina.
          </div>
        </div>
      </React.Fragment>
    );
  }

  function AsistRow({ emp, week, toast }) {
    const arr = S.getAsistencia(week, emp.id);
    const toggle = (i) => { const n = arr.slice(); n[i] = !n[i]; S.setAsistencia(week, emp.id, n); };
    const dias = arr.filter(Boolean).length;
    const pago = dias * (emp.sueldoDiario || 0);
    return (
      <Card pad={15}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <Avatar emp={emp} size={42} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>{emp.nombre}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{S.money0(emp.sueldoDiario)} / día</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--green-ink)', fontVariantNumeric: 'tabular-nums' }}>{dias}/7</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}>{S.money0(pago)}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
          {S.DAYS.map((d, i) => {
            const on = arr[i];
            return (
              <button key={i} className="ta-btn" onClick={() => toggle(i)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 0', borderRadius: 11, cursor: 'pointer',
                background: on ? 'var(--green)' : 'var(--surface-2)', color: on ? '#fff' : 'var(--ink-3)',
                border: on ? 'none' : '1px solid var(--line)', transition: 'all .15s',
              }}>
                <span style={{ fontSize: 10.5, fontWeight: 700 }}>{d}</span>
                {on ? <Icon name="check" size={15} stroke={3} /> : <span style={{ width: 15, height: 15, borderRadius: 99, border: '1.5px solid var(--line)' }} />}
              </button>
            );
          })}
        </div>
      </Card>
    );
  }

  // ════════════════════════════ NÓMINA (estrella) ════════════════════════════
  function Nomina({ toast, tw }) {
    const db = S.useDB();
    const layout = (tw && tw.payrollLayout) || 'todo';
    const capture = (tw && tw.captureMode) || 'teclado';
    const [week, setWeek] = useState(S.weekId(new Date()));
    const [empId, setEmpId] = useState(null);
    const [prod, setProd] = useState({});
    const [ajustes, setAjustes] = useState({ bonos: [], extras: [], abono: 0, credito: 0 });
    const [step, setStep] = useState(0);

    const emp = db.employees.find(e => e.id === empId);
    const activos = db.employees.filter(e => e.activo);
    const yaCalculada = !!(empId && S.getNomina(empId, week));

    useEffect(() => {
      if (!emp) return;
      const ex = S.getNomina(empId, week);
      if (ex) { setProd(ex.prod); setAjustes(ex.ajustes); return; }
      if (emp.tipo === 'Panadero') setProd({ panes: { dulce: 0, blanco: 0, ajonjoli: 0, galletas: 0 } });
      else if (emp.tipo === 'Tortillero') setProd({ sacos: 0, precioSaco: db.tarifas.sacoHarina });
      else { const a = S.getAsistencia(week, empId); setProd({ dias: a.filter(Boolean).length, sueldoDiario: emp.sueldoDiario || db.tarifas.sueldoDiarioMostrador }); }
      setAjustes({ bonos: [], extras: [], abono: 0, credito: 0 });
      setStep(1);
    }, [empId, week]);

    const res = emp ? S.calc({ tipo: emp.tipo, prod, ajustes, tarifas: db.tarifas }) : null;

    const save = () => {
      const snap = JSON.parse(JSON.stringify(prod));
      if (emp.tipo === 'Panadero') snap.rates = { ...db.tarifas.pan };
      const r = S.calc({ tipo: emp.tipo, prod: snap, ajustes });
      S.saveNomina({ empId, empNombre: emp.nombre, tipo: emp.tipo, weekId: week, prod: snap, ajustes, ...r });
      toast('Nómina guardada');
    };

    // ── Bloques reutilizables ──
    const pickerBlock = (
      <EmployeePicker activos={activos} empId={empId} setEmpId={setEmpId} week={week} setWeek={setWeek} />
    );
    const prodBlock = emp && <Produccion emp={emp} prod={prod} setProd={setProd} capture={capture} tarifas={db.tarifas} res={res} />;
    const ajustesBlock = emp && <Ajustes ajustes={ajustes} setAjustes={setAjustes} />;
    const resumenBlock = emp && <Resumen emp={emp} res={res} prod={prod} />;

    const props = { emp, week, setWeek, empId, layout, capture, yaCalculada, res, save, step, setStep, pickerBlock, prodBlock, ajustesBlock, resumenBlock, toast };

    return (
      <React.Fragment>
        <ScreenHeader title="Nómina semanal" large
          subtitle={emp ? `${emp.nombre} · ${S.weekLabel(week)}` : 'Selecciona un empleado'}
          right={emp ? <IconButton name="x" size={42} variant="surface" iconSize={20} onClick={() => { setEmpId(null); setStep(0); }} /> : null}
        />
        {layout === 'asistente' ? <WizardLayout {...props} /> : layout === 'acordeon' ? <AcordeonLayout {...props} /> : <TodoLayout {...props} />}
      </React.Fragment>
    );
  }

  // ── Selección de empleado + semana ──
  function EmployeePicker({ activos, empId, setEmpId, week, setWeek }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <WeekNav week={week} setWeek={setWeek} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {activos.map(e => {
            const on = e.id === empId;
            const done = !!S.getNomina(e.id, week);
            return (
              <button key={e.id} className="ta-btn" onClick={() => setEmpId(e.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 12, cursor: 'pointer', textAlign: 'left',
                background: on ? 'var(--primary-soft)' : 'var(--surface)',
                border: '1px solid ' + (on ? 'var(--amber-line)' : 'var(--line)'), borderRadius: 'var(--r-card)',
              }}>
                <Avatar emp={e} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>{e.nombre}</div>
                  <div style={{ marginTop: 4 }}><TipoBadge tipo={e.tipo} size="sm" /></div>
                </div>
                {done ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 700, color: 'var(--green-ink)', background: 'var(--green-soft)', padding: '5px 9px', borderRadius: 99 }}>
                    <Icon name="check" size={13} stroke={3} /> Lista
                  </span>
                ) : <Icon name={on ? 'check' : 'chevR'} size={20} stroke={on ? 3 : 2} style={{ color: on ? 'var(--primary-ink)' : 'var(--ink-3)' }} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Producción (según captureMode) ──
  function Produccion({ emp, prod, setProd, capture, tarifas, res }) {
    if (emp.tipo === 'Panadero') return <ProdPanadero prod={prod} setProd={setProd} capture={capture} tarifas={tarifas} />;
    if (emp.tipo === 'Tortillero') return <ProdTortillero prod={prod} setProd={setProd} capture={capture} tarifas={tarifas} />;
    return <ProdMostrador prod={prod} setProd={setProd} emp={emp} capture={capture} />;
  }

  function ProdPanadero({ prod, setProd, capture, tarifas }) {
    const set = (k, v) => setProd(p => ({ ...p, panes: { ...p.panes, [k]: Math.max(0, v) } }));
    const panes = prod.panes || {};
    const total = S.PANES.reduce((s, p) => s + (panes[p.k] || 0) * tarifas.pan[p.k], 0);

    if (capture === 'tabla') {
      return (
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 84px 92px', padding: '11px 14px', background: 'var(--surface-2)', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
            <span>Tipo de pan</span><span style={{ textAlign: 'center' }}>Piezas</span><span style={{ textAlign: 'right' }}>Subtotal</span>
          </div>
          {S.PANES.map((p, i) => {
            const u = panes[p.k] || 0;
            return (
              <div key={p.k} style={{ display: 'grid', gridTemplateColumns: '1fr 84px 92px', alignItems: 'center', padding: '10px 14px', borderTop: '1px solid var(--line)' }}>
                <div><div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{p.label}</div><div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{S.money(tarifas.pan[p.k])} c/u</div></div>
                <input inputMode="numeric" value={u === 0 ? '' : u} placeholder="0" onChange={e => set(p.k, parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                  style={{ width: '100%', height: 40, textAlign: 'center', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--surface-2)', fontFamily: 'var(--font)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', outline: 'none', fontVariantNumeric: 'tabular-nums' }} />
                <div style={{ textAlign: 'right', fontSize: 14.5, fontWeight: 700, color: u ? 'var(--ink)' : 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}>{S.money0(u * tarifas.pan[p.k])}</div>
              </div>
            );
          })}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 14px', borderTop: '2px solid var(--line)', background: 'var(--surface-2)' }}>
            <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink-2)' }}>Total producción</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--amber-ink)', fontVariantNumeric: 'tabular-nums' }}>{S.money(total)}</span>
          </div>
        </Card>
      );
    }
    // stepper / teclado: tarjeta por tipo
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {S.PANES.map(p => {
          const u = panes[p.k] || 0;
          return (
            <Card key={p.k} pad={14}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--amber)', flexShrink: 0 }} />
                  <span style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{p.label}</span>
                </div>
                <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>{S.money(tarifas.pan[p.k])} c/u → <b style={{ color: 'var(--amber-ink)' }}>{S.money0(u * tarifas.pan[p.k])}</b></span>
              </div>
              {capture === 'stepper'
                ? <Stepper big value={u} step={25} onChange={v => set(p.k, v)} />
                : <BigNumber value={u} onChange={v => set(p.k, v)} suffix="piezas" />}
            </Card>
          );
        })}
      </div>
    );
  }

  function ProdTortillero({ prod, setProd, capture, tarifas }) {
    const sacos = prod.sacos || 0;
    const precio = prod.precioSaco != null ? prod.precioSaco : tarifas.sacoHarina;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Card pad={14}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 11 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--brown)' }} />
              <span style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>Sacos producidos</span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>esta semana</span>
          </div>
          {capture === 'tabla'
            ? <TablaSingle label="Sacos de harina" sub={`${S.money(precio)} por saco`} value={sacos} onChange={v => setProd(p => ({ ...p, sacos: v }))} sub2={S.money0(sacos * precio)} />
            : capture === 'stepper'
              ? <Stepper big value={sacos} step={1} onChange={v => setProd(p => ({ ...p, sacos: v }))} />
              : <BigNumber value={sacos} onChange={v => setProd(p => ({ ...p, sacos: v }))} suffix="sacos" />}
        </Card>
        <Card pad={14}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>Precio por saco</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1 }}>Editable solo para esta nómina</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 11, padding: '0 12px', height: 48, width: 118 }}>
              <span style={{ color: 'var(--ink-3)', fontWeight: 700 }}>$</span>
              <input inputMode="decimal" value={precio} onChange={e => setProd(p => ({ ...p, precioSaco: e.target.value.replace(/[^\d.]/g, '') }))}
                style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', textAlign: 'right', fontFamily: 'var(--font)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }} />
            </div>
          </div>
        </Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', fontSize: 14.5 }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{sacos} sacos × {S.money(precio)}</span>
          <span style={{ fontWeight: 800, color: 'var(--brown-ink)', fontVariantNumeric: 'tabular-nums' }}>{S.money(sacos * precio)}</span>
        </div>
      </div>
    );
  }

  function ProdMostrador({ prod, setProd, emp, capture }) {
    const dias = prod.dias || 0;
    const sd = prod.sueldoDiario != null ? prod.sueldoDiario : emp.sueldoDiario;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Card pad={14}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--green)' }} />
            <span style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>Días asistidos</span>
            <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--green-ink)', background: 'var(--green-soft)', padding: '3px 8px', borderRadius: 99, fontWeight: 700 }}>desde asistencia</span>
          </div>
          {capture === 'stepper'
            ? <Stepper big value={dias} step={1} min={0} max={7} onChange={v => setProd(p => ({ ...p, dias: v }))} />
            : <BigNumber value={dias} max={7} onChange={v => setProd(p => ({ ...p, dias: Math.min(7, v) }))} suffix="de 7 días" />}
        </Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', fontSize: 14.5 }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{dias} días × {S.money(sd)}</span>
          <span style={{ fontWeight: 800, color: 'var(--green-ink)', fontVariantNumeric: 'tabular-nums' }}>{S.money(dias * sd)}</span>
        </div>
      </div>
    );
  }

  // input numérico grande (teclado)
  function BigNumber({ value, onChange, suffix, max }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 13, padding: '0 16px', height: 60 }}>
        <input inputMode="numeric" value={value === 0 ? '' : value} placeholder="0"
          onChange={e => { let v = parseInt(e.target.value.replace(/\D/g, '')) || 0; if (max) v = Math.min(max, v); onChange(v); }}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font)', fontSize: 30, fontWeight: 800, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }} />
        <span style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 600, flexShrink: 0 }}>{suffix}</span>
      </div>
    );
  }

  function TablaSingle({ label, sub, value, onChange, sub2 }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 84px 92px', alignItems: 'center', gap: 8 }}>
        <div><div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{label}</div><div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{sub}</div></div>
        <input inputMode="numeric" value={value === 0 ? '' : value} placeholder="0" onChange={e => onChange(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
          style={{ width: '100%', height: 40, textAlign: 'center', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--surface-2)', fontFamily: 'var(--font)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', outline: 'none', fontVariantNumeric: 'tabular-nums' }} />
        <div style={{ textAlign: 'right', fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{sub2}</div>
      </div>
    );
  }

  // ── Ajustes (bonos / extras / descuentos) ──
  function Ajustes({ ajustes, setAjustes }) {
    const addItem = (key) => setAjustes(a => ({ ...a, [key]: [...(a[key] || []), { desc: '', monto: '' }] }));
    const updItem = (key, i, field, v) => setAjustes(a => { const arr = a[key].slice(); arr[i] = { ...arr[i], [field]: v }; return { ...a, [key]: arr }; });
    const delItem = (key, i) => setAjustes(a => ({ ...a, [key]: a[key].filter((_, j) => j !== i) }));

    const ItemList = ({ keyName, label, icon, color, placeholder }) => (
      <Card pad={14}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (ajustes[keyName] || []).length ? 12 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', width: 26, height: 26, borderRadius: 8, background: color.soft, color: color.ink, alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={16} stroke={2.2} /></span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{label}</span>
          </div>
          <button className="ta-btn" onClick={() => addItem(keyName)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13.5, fontWeight: 700, color: 'var(--primary-ink)', background: 'transparent', cursor: 'pointer' }}>
            <Icon name="plus" size={16} stroke={2.4} /> Agregar
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {(ajustes[keyName] || []).map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input placeholder={placeholder} value={it.desc} onChange={e => updItem(keyName, i, 'desc', e.target.value)}
                style={{ flex: 1, minWidth: 0, height: 46, border: '1px solid var(--line)', borderRadius: 11, background: 'var(--surface-2)', padding: '0 12px', fontFamily: 'var(--font)', fontSize: 15, color: 'var(--ink)', outline: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 11, padding: '0 10px', height: 46, width: 100, flexShrink: 0 }}>
                <span style={{ color: 'var(--ink-3)', fontWeight: 700, fontSize: 14 }}>$</span>
                <input inputMode="decimal" placeholder="0" value={it.monto} onChange={e => updItem(keyName, i, 'monto', e.target.value.replace(/[^\d.]/g, ''))}
                  style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', textAlign: 'right', fontFamily: 'var(--font)', fontSize: 15.5, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }} />
              </div>
              <button className="ta-btn" onClick={() => delItem(keyName, i)} style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="x" size={18} /></button>
            </div>
          ))}
        </div>
      </Card>
    );

    const Deduc = ({ keyName, label, sub }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: keyName === 'abono' ? '1px solid var(--line)' : 'none' }}>
        <span style={{ display: 'inline-flex', width: 26, height: 26, borderRadius: 8, background: 'var(--red-soft)', color: 'var(--red)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="minus" size={16} stroke={2.6} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{sub}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 11, padding: '0 11px', height: 46, width: 110 }}>
          <span style={{ color: 'var(--red)', fontWeight: 700, fontSize: 14 }}>−$</span>
          <input inputMode="decimal" placeholder="0" value={ajustes[keyName] || ''} onChange={e => setAjustes(a => ({ ...a, [keyName]: e.target.value.replace(/[^\d.]/g, '') }))}
            style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', textAlign: 'right', fontFamily: 'var(--font)', fontSize: 16, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }} />
        </div>
      </div>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <SectionLabel>Ingresos adicionales</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ItemList keyName="bonos" label="Bonos" icon="plus" color={{ soft: 'var(--green-soft)', ink: 'var(--green-ink)' }} placeholder="Ej. Bono de puntualidad" />
            <ItemList keyName="extras" label="Conceptos extra" icon="plus" color={{ soft: 'var(--green-soft)', ink: 'var(--green-ink)' }} placeholder="Ej. Hora extra domingo" />
          </div>
        </div>
        <div>
          <SectionLabel>Descuentos</SectionLabel>
          <Card pad={14}>
            <Deduc keyName="abono" label="Abono a préstamo" sub="Monto variable cada semana" />
            <Deduc keyName="credito" label="Crédito de tienda" sub="Lo que tomó de la tienda" />
          </Card>
        </div>
      </div>
    );
  }

  // ── Resumen / desglose ──
  function Resumen({ emp, res, prod }) {
    const Row = ({ label, val, neg, strong, sub }) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0' }}>
        <div><span style={{ fontSize: strong ? 15.5 : 14.5, fontWeight: strong ? 700 : 500, color: strong ? 'var(--ink)' : 'var(--ink-2)' }}>{label}</span>{sub && <span style={{ fontSize: 12.5, color: 'var(--ink-3)', marginLeft: 7 }}>{sub}</span>}</div>
        <span style={{ fontSize: 15, fontWeight: 700, color: neg ? 'var(--red)' : 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{neg ? '−' : ''}{S.money(Math.abs(val))}</span>
      </div>
    );
    return (
      <Card pad={16}>
        <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: 4 }}>
          {res.baseLineas.filter(l => l.qty > 0).map((l, i) => (
            <Row key={i} label={l.label} sub={`${S.num(l.qty)} × ${S.money(l.rate)}`} val={l.sub} />
          ))}
          {res.base === 0 && <div style={{ fontSize: 13.5, color: 'var(--ink-3)', padding: '6px 0' }}>Sin producción registrada</div>}
        </div>
        {res.bonos > 0 && <Row label="Bonos" val={res.bonos} />}
        {res.extras > 0 && <Row label="Conceptos extra" val={res.extras} />}
        {res.abono > 0 && <Row label="Abono a préstamo" val={res.abono} neg />}
        {res.credito > 0 && <Row label="Crédito de tienda" val={res.credito} neg />}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 14, borderTop: '2px solid var(--line)' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Total neto</span>
          <span style={{ fontSize: 27, fontWeight: 800, color: 'var(--primary-ink)', fontVariantNumeric: 'tabular-nums' }}>{S.money(res.neto)}</span>
        </div>
      </Card>
    );
  }

  // ── Barra fija de total ──
  function TotalBar({ res, save, yaCalculada, extra }) {
    return (
      <div style={{ position: 'sticky', bottom: 0, zIndex: 20, background: 'var(--nav-bg)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderTop: '1px solid var(--header-line)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: extra ? '0 0 auto' : 1 }}>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Total neto</div>
          <div style={{ fontSize: 23, fontWeight: 800, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>{S.money(res.neto)}</div>
        </div>
        {extra}
        {!extra && <Button size="lg" icon={yaCalculada ? 'check' : 'receipt'} onClick={save} style={{ flexShrink: 0 }}>{yaCalculada ? 'Actualizar' : 'Guardar'}</Button>}
      </div>
    );
  }

  function StepTitle({ n, total, title, sub }) {
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary-ink)', letterSpacing: 0.4 }}>PASO {n} DE {total}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 800, color: 'var(--ink)', marginTop: 3 }}>{title}</div>
        {sub && <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>}
      </div>
    );
  }

  function SecHead({ icon, title, right }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '4px 4px 12px' }}>
        <span style={{ display: 'inline-flex', width: 30, height: 30, borderRadius: 9, background: 'var(--primary-soft)', color: 'var(--primary-ink)', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={18} stroke={2.1} /></span>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{title}</span>
        {right && <span style={{ marginLeft: 'auto' }}>{right}</span>}
      </div>
    );
  }

  // ════ LAYOUT A — Todo en uno ════
  function TodoLayout({ emp, pickerBlock, prodBlock, ajustesBlock, resumenBlock, res, save, yaCalculada }) {
    if (!emp) return <div style={{ padding: '16px 16px 28px' }}><EmployeePickerWrap>{pickerBlock}</EmployeePickerWrap></div>;
    return (
      <React.Fragment>
        <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div><SecHead icon={emp.tipo === 'Tortillero' ? 'tag' : 'coins'} title="Producción" />{prodBlock}</div>
          <div>{ajustesBlock}</div>
          <div><SecHead icon="receipt" title="Resumen" />{resumenBlock}</div>
        </div>
        <TotalBar res={res} save={save} yaCalculada={yaCalculada} />
      </React.Fragment>
    );
  }

  function EmployeePickerWrap({ children }) {
    return <React.Fragment><SecHead icon="users" title="¿De quién es la nómina?" />{children}</React.Fragment>;
  }

  // ════ LAYOUT B — Asistente (wizard) ════
  function WizardLayout({ emp, step, setStep, pickerBlock, prodBlock, ajustesBlock, resumenBlock, res, save, yaCalculada, empId }) {
    const steps = ['Empleado', 'Producción', 'Ajustes', 'Resumen'];
    const cur = !empId ? 0 : step;
    const canNext = cur === 0 ? !!empId : true;

    return (
      <React.Fragment>
        {/* progreso */}
        <div style={{ display: 'flex', gap: 6, padding: '14px 16px 4px' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 99, background: i <= cur ? 'var(--primary)' : 'var(--line)', transition: 'background .2s' }} />
          ))}
        </div>
        <div style={{ padding: '12px 16px 24px' }}>
          {cur === 0 && <React.Fragment><StepTitle n={1} total={4} title="¿De quién es la nómina?" sub="Elige la semana y el empleado" />{pickerBlock}</React.Fragment>}
          {cur === 1 && <React.Fragment><StepTitle n={2} total={4} title="Producción" sub={emp && emp.tipo === 'Panadero' ? 'Piezas producidas por tipo' : emp && emp.tipo === 'Tortillero' ? 'Sacos de harina' : 'Días asistidos'} />{prodBlock}</React.Fragment>}
          {cur === 2 && <React.Fragment><StepTitle n={3} total={4} title="Bonos y descuentos" sub="Opcional" />{ajustesBlock}</React.Fragment>}
          {cur === 3 && <React.Fragment><StepTitle n={4} total={4} title="Resumen" sub="Revisa antes de guardar" />{resumenBlock}</React.Fragment>}
        </div>
        {/* footer */}
        <div style={{ position: 'sticky', bottom: 0, zIndex: 20, background: 'var(--nav-bg)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderTop: '1px solid var(--header-line)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          {cur > 0 && <Button variant="outline" size="lg" icon="chevL" onClick={() => setStep(cur - 1)} style={{ flexShrink: 0 }}>Atrás</Button>}
          {cur < 3
            ? <Button size="lg" full onClick={() => canNext && setStep(cur + 1)} style={{ opacity: canNext ? 1 : 0.5 }}>Continuar</Button>
            : <Button size="lg" full icon={yaCalculada ? 'check' : 'receipt'} onClick={save}>{yaCalculada ? 'Actualizar nómina' : 'Guardar nómina'} · {S.money0(res.neto)}</Button>}
        </div>
      </React.Fragment>
    );
  }

  // ════ LAYOUT C — Acordeón ════
  function AcordeonLayout({ emp, pickerBlock, prodBlock, ajustesBlock, resumenBlock, res, save, yaCalculada, empId }) {
    const [openSec, setOpenSec] = useState('emp');
    useEffect(() => { if (empId) setOpenSec('prod'); }, [empId]);

    const Acc = ({ id, icon, title, summary, children }) => {
      const on = openSec === id;
      return (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
          <button className="ta-btn" onClick={() => setOpenSec(on ? '' : id)} style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: 15, cursor: 'pointer', background: 'transparent', textAlign: 'left' }}>
            <span style={{ display: 'inline-flex', width: 32, height: 32, borderRadius: 9, background: 'var(--primary-soft)', color: 'var(--primary-ink)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={icon} size={18} stroke={2.1} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
              {summary && <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary}</div>}
            </div>
            <Icon name="chevD" size={20} stroke={2.2} style={{ color: 'var(--ink-3)', transform: on ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
          </button>
          {on && <div style={{ padding: '0 14px 16px' }}>{children}</div>}
        </div>
      );
    };

    return (
      <React.Fragment>
        <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Acc id="emp" icon="users" title="Empleado y semana" summary={emp ? emp.nombre : 'Sin seleccionar'}>{pickerBlock}</Acc>
          {emp && <Acc id="prod" icon="coins" title="Producción" summary={S.money(res.base) + ' en producción'}>{prodBlock}</Acc>}
          {emp && <Acc id="ajustes" icon="sliders" title="Bonos y descuentos" summary={`+${S.money0(res.bonos + res.extras)} · −${S.money0(res.deducciones)}`}>{ajustesBlock}</Acc>}
          {emp && <Acc id="resumen" icon="receipt" title="Resumen" summary={'Neto ' + S.money(res.neto)}>{resumenBlock}</Acc>}
        </div>
        {emp && <TotalBar res={res} save={save} yaCalculada={yaCalculada} />}
      </React.Fragment>
    );
  }

  // ════════════════════════════ HISTORIAL ════════════════════════════
  function Historial() {
    const db = S.useDB();
    const [mode, setMode] = useState('semana'); // semana | empleado
    const [detail, setDetail] = useState(null);

    const sorted = [...db.nominas].sort((a, b) => (a.weekId < b.weekId ? 1 : a.weekId > b.weekId ? -1 : a.empNombre.localeCompare(b.empNombre)));
    const groups = useMemo(() => {
      const m = {};
      sorted.forEach(n => { const k = mode === 'semana' ? n.weekId : n.empId; (m[k] = m[k] || []).push(n); });
      return Object.entries(m);
    }, [sorted, mode]);

    return (
      <React.Fragment>
        <ScreenHeader title="Historial" large
          accessory={<Segmented full value={mode} onChange={setMode} options={[{ value: 'semana', label: 'Por semana' }, { value: 'empleado', label: 'Por empleado' }]} />} />
        <div style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {groups.length === 0 ? (
            <EmptyState icon="history" title="Sin nóminas aún" sub="Las nóminas que guardes aparecerán aquí, filtrables por semana o empleado." />
          ) : groups.map(([key, items]) => {
            const total = items.reduce((s, n) => s + n.neto, 0);
            const head = mode === 'semana' ? S.weekLabel(key) : (db.employees.find(e => e.id === key) || {}).nombre || items[0].empNombre;
            const sub = mode === 'semana' ? `${items.length} pago${items.length === 1 ? '' : 's'}` : `${items.length} semana${items.length === 1 ? '' : 's'}`;
            return (
              <div key={key}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 4px 10px' }}>
                  <div><div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{head}</div><div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1 }}>{sub}</div></div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink-2)', fontVariantNumeric: 'tabular-nums' }}>{S.money0(total)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map(n => {
                    const emp = db.employees.find(e => e.id === n.empId) || { nombre: n.empNombre, tipo: n.tipo };
                    return (
                      <Card key={n.id} pad={13} onClick={() => setDetail(n)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar emp={emp} size={42} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{mode === 'semana' ? n.empNombre : S.weekLabel(n.weekId)}</div>
                          <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{n.tipo}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{S.money(n.neto)}</div>
                          {n.deducciones > 0 && <div style={{ fontSize: 11.5, color: 'var(--red)', fontVariantNumeric: 'tabular-nums' }}>−{S.money0(n.deducciones)} desc.</div>}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <DetailSheet n={detail} onClose={() => setDetail(null)} db={db} />
      </React.Fragment>
    );
  }

  function DetailSheet({ n, onClose, db }) {
    const emp = n && (db.employees.find(e => e.id === n.empId) || { nombre: n.empNombre, tipo: n.tipo });
    return (
      <Sheet open={!!n} onClose={onClose} title="Detalle de nómina">
        {n && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <Avatar emp={emp} size={52} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>{n.empNombre}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{n.tipo} · {S.weekLong(n.weekId)}</div>
              </div>
            </div>
            <Resumen emp={emp} res={n} prod={n.prod} />
          </div>
        )}
      </Sheet>
    );
  }

  window.Screens = Object.assign(window.Screens || {}, { Asistencia, Nomina, Historial });
})();
