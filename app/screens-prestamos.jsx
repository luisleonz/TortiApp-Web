/* screens-prestamos.jsx — Préstamos: libro de adeudos por empleado. */
(function () {
  const { useState } = React;
  const S = window.Store, Icon = window.Icon;
  const { Button, IconButton, Avatar, TipoBadge, Field, Segmented, Card, SectionLabel, Sheet, EmptyState } = window.UI;
  const { ScreenHeader } = window.Shell;

  const fmtDate = (iso) => { const d = new Date(iso); return `${d.getDate()} ${S.MONTHS[d.getMonth()]} ${d.getFullYear()}`; };

  function Prestamos({ onBack, toast }) {
    const db = S.useDB();
    const [detailId, setDetailId] = useState(null);
    const [form, setForm] = useState(null); // { empId, tipo } or null

    const total = S.getSaldoTotal();
    const conDeuda = db.employees.filter(e => S.getSaldo(e.id) > 0.005)
      .sort((a, b) => S.getSaldo(b.id) - S.getSaldo(a.id));

    return (
      <React.Fragment>
        <ScreenHeader title="Préstamos" subtitle="Adeudos de empleados" large onBack={onBack}
          right={<IconButton name="plus" size={42} variant="soft" stroke={2.4} onClick={() => setForm({ empId: '', tipo: 'prestamo' })} />} />
        <div style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Resumen */}
          <Card pad={18} style={{ background: 'var(--ink)', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,.6)', fontSize: 12.5, fontWeight: 600 }}>
              <Icon name="coins" size={16} /> Total por cobrar
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>{S.money(total)}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>{conDeuda.length} empleado{conDeuda.length === 1 ? '' : 's'} con adeudo</div>
          </Card>

          {conDeuda.length === 0 ? (
            <EmptyState icon="coins" title="Nadie debe nada" sub="Cuando registres un préstamo aparecerá aquí su saldo pendiente."
              action={<Button icon="plus" onClick={() => setForm({ empId: '', tipo: 'prestamo' })}>Registrar préstamo</Button>} />
          ) : (
            <div>
              <SectionLabel>Con adeudo</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {conDeuda.map(e => {
                  const saldo = S.getSaldo(e.id);
                  return (
                    <Card key={e.id} pad={14} onClick={() => setDetailId(e.id)} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                      <Avatar emp={e} size={46} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>{e.nombre}</div>
                        <div style={{ marginTop: 4 }}><TipoBadge tipo={e.tipo} size="sm" /></div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>Debe</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--amber-ink)', fontVariantNumeric: 'tabular-nums' }}>{S.money0(saldo)}</div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              <Button full icon="plus" variant="outline" onClick={() => setForm({ empId: '', tipo: 'prestamo' })} style={{ marginTop: 14 }}>Registrar préstamo o abono</Button>
            </div>
          )}

          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.5 }}>
            Los abonos hechos en la nómina se descuentan aquí automáticamente.
          </div>
        </div>

        <EmpDetail empId={detailId} onClose={() => setDetailId(null)} onRegister={(tipo) => setForm({ empId: detailId, tipo })} toast={toast} />
        <MovForm form={form} onClose={() => setForm(null)} employees={db.employees.filter(e => e.activo)} toast={toast} />
      </React.Fragment>
    );
  }

  // ── Detalle por empleado ──
  function EmpDetail({ empId, onClose, onRegister, toast }) {
    const db = S.useDB();
    const emp = empId && db.employees.find(e => e.id === empId);
    const movs = empId ? S.getMovimientos(empId) : [];
    const saldo = empId ? S.getSaldo(empId) : 0;
    return (
      <Sheet open={!!empId} onClose={onClose} title="Préstamos del empleado" full>
        {emp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <Avatar emp={emp} size={52} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>{emp.nombre}</div>
                <div style={{ marginTop: 4 }}><TipoBadge tipo={emp.tipo} size="sm" /></div>
              </div>
            </div>

            <Card pad={16} style={{ background: 'var(--amber-soft)', border: '1px solid var(--amber-line)' }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--amber-ink)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Saldo pendiente</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--amber-ink)', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{S.money(Math.max(0, saldo))}</div>
            </Card>

            <div style={{ display: 'flex', gap: 10 }}>
              <Button full variant="soft" icon="plus" onClick={() => onRegister('prestamo')}>Prestar</Button>
              <Button full variant="outline" icon="minus" onClick={() => onRegister('abono')}>Abonar</Button>
            </div>

            <div>
              <SectionLabel>Movimientos</SectionLabel>
              {movs.length === 0 ? (
                <div style={{ fontSize: 13.5, color: 'var(--ink-3)', textAlign: 'center', padding: '24px 0' }}>Sin movimientos</div>
              ) : (
                <Card pad={0}>
                  {movs.map((m, i) => {
                    const ab = m.tipo === 'abono';
                    return (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderTop: i ? '1px solid var(--line)' : 'none' }}>
                        <span style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: 10, flexShrink: 0, alignItems: 'center', justifyContent: 'center',
                          background: ab ? 'var(--green-soft)' : 'var(--amber-soft)', color: ab ? 'var(--green-ink)' : 'var(--amber-ink)' }}>
                          <Icon name={ab ? 'arrowL' : 'arrowR'} size={18} stroke={2.2} style={{ transform: ab ? 'rotate(90deg)' : 'rotate(-90deg)' }} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.motivo}</div>
                          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{fmtDate(m.fecha)}</div>
                        </div>
                        <div style={{ fontSize: 15.5, fontWeight: 800, color: ab ? 'var(--green-ink)' : 'var(--amber-ink)', fontVariantNumeric: 'tabular-nums' }}>{ab ? '−' : '+'}{S.money0(m.monto)}</div>
                        {!m.nominaId && (
                          <button className="ta-btn" onClick={() => { S.removeMovimiento(m.id); toast('Movimiento eliminado'); }}
                            style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="x" size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </Card>
              )}
            </div>
          </div>
        )}
      </Sheet>
    );
  }

  // ── Formulario de movimiento ──
  function MovForm({ form, onClose, employees, toast }) {
    const open = !!form;
    const [empId, setEmpId] = useState('');
    const [tipo, setTipo] = useState('prestamo');
    const [monto, setMonto] = useState('');
    const [motivo, setMotivo] = useState('');
    const [fecha, setFecha] = useState('');
    React.useEffect(() => {
      if (form) { setEmpId(form.empId || ''); setTipo(form.tipo || 'prestamo'); setMonto(''); setMotivo(''); setFecha(new Date().toISOString().slice(0, 10)); }
    }, [form]);

    const save = () => {
      if (!empId) { toast('Elige un empleado'); return; }
      if (!(+monto > 0)) { toast('Ingresa un monto válido'); return; }
      S.addMovimiento({ empId, tipo, monto: +monto, motivo: motivo.trim(), fecha });
      toast(tipo === 'abono' ? 'Abono registrado' : 'Préstamo registrado');
      onClose();
    };
    const lockEmp = form && form.empId;

    return (
      <Sheet open={open} onClose={onClose} title={tipo === 'abono' ? 'Registrar abono' : 'Registrar préstamo'} full>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Segmented full value={tipo} onChange={setTipo} options={[{ value: 'prestamo', label: '+ Préstamo' }, { value: 'abono', label: '− Abono' }]} />

          {!lockEmp && (
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 7, paddingLeft: 2 }}>Empleado</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {employees.map(e => {
                  const on = e.id === empId; const saldo = S.getSaldo(e.id);
                  return (
                    <button key={e.id} className="ta-btn" onClick={() => setEmpId(e.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 11, padding: 10, cursor: 'pointer', textAlign: 'left',
                      background: on ? 'var(--primary-soft)' : 'var(--surface)', border: '1px solid ' + (on ? 'var(--amber-line)' : 'var(--line)'), borderRadius: 13,
                    }}>
                      <Avatar emp={e} size={38} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>{e.nombre}</div>
                        {saldo > 0.005 && <div style={{ fontSize: 12, color: 'var(--amber-ink)' }}>Debe {S.money0(saldo)}</div>}
                      </div>
                      {on && <Icon name="check" size={19} stroke={3} style={{ color: 'var(--primary-ink)' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Field label="Monto" prefix="$" inputMode="decimal" placeholder="0.00" value={monto} onChange={e => setMonto(e.target.value.replace(/[^\d.]/g, ''))} suffix="MXN" />
          <Field label="Motivo / nota" placeholder={tipo === 'abono' ? 'Ej. Abono en efectivo' : 'Ej. Préstamo personal'} value={motivo} onChange={e => setMotivo(e.target.value)} />
          <Field label="Fecha" type="date" icon="calendar" value={fecha} onChange={e => setFecha(e.target.value)} />

          <Button size="lg" full onClick={save} style={{ marginTop: 6 }}>{tipo === 'abono' ? 'Registrar abono' : 'Registrar préstamo'}</Button>
        </div>
      </Sheet>
    );
  }

  window.Screens = Object.assign(window.Screens || {}, { Prestamos });
})();
