/* screens-core.jsx — Login, Inicio, Empleados, Tarifas. window.Screens (core) */
(function () {
  const { useState, useMemo } = React;
  const S = window.Store, Icon = window.Icon;
  const { Button, IconButton, Avatar, TipoBadge, Field, Segmented, Card, SectionLabel, Sheet, EmptyState } = window.UI;
  const { ScreenHeader } = window.Shell;

  const BRAND = { app: 'TortiApp', negocio: 'Tortillería y Panadería León' };

  // ── Marca / logotipo simple ──────────────────────────────
  function Logo({ size = 64 }) {
    return (
      <div style={{
        width: size, height: size, borderRadius: size * 0.32, flexShrink: 0,
        background: 'linear-gradient(150deg, var(--amber) 0%, var(--brown) 115%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#FFF8EA', boxShadow: '0 8px 22px -8px rgba(120,75,20,.6)',
      }}>
        <Icon name="wheat" size={size * 0.56} stroke={2} />
      </div>
    );
  }

  // ════════════════════════════ LOGIN ════════════════════════════
  function Login({ onLogin }) {
    const [u, setU] = useState('admin');
    const [p, setP] = useState('••••••');
    const [show, setShow] = useState(false);
    return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: '0 26px', background: 'var(--bg)' }}>
        <div style={{ flex: '0 0 auto', height: 92 }} />
        <div style={{ textAlign: 'center', marginBottom: 38 }}>
          <div style={{ display: 'inline-block' }}><Logo size={76} /></div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, color: 'var(--ink)', marginTop: 20, letterSpacing: -1 }}>{BRAND.app}</div>
          <div style={{ fontSize: 15, color: 'var(--ink-3)', marginTop: 4, fontWeight: 500 }}>{BRAND.negocio}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Usuario" icon="user" value={u} onChange={e => setU(e.target.value)} placeholder="Tu usuario" autoCapitalize="none" />
          <Field label="Contraseña" icon="lock" type={show ? 'text' : 'password'} value={p} onChange={e => setP(e.target.value)} placeholder="Tu contraseña"
            suffix={<span onClick={() => setShow(!show)} style={{ cursor: 'pointer', display: 'flex' }}><Icon name={show ? 'eyeoff' : 'eye'} size={19} /></span>} />
          <Button size="lg" full onClick={onLogin} style={{ marginTop: 8 }}>Entrar</Button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13.5, color: 'var(--primary-ink)', fontWeight: 600 }}>¿Olvidaste tu contraseña?</div>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-3)', paddingBottom: 30, lineHeight: 1.5 }}>
          Demo — toca <b style={{ color: 'var(--ink-2)' }}>Entrar</b> para continuar
        </div>
      </div>
    );
  }

  // ════════════════════════════ INICIO ════════════════════════════
  function Inicio({ go, onLogout, openTarifas }) {
    const db = S.useDB();
    const week = S.weekId(new Date());
    const activos = db.employees.filter(e => e.activo);
    const nominasSemana = db.nominas.filter(n => n.weekId === week);
    const pendientes = activos.length - new Set(nominasSemana.map(n => n.empId)).size;
    const totalSemana = nominasSemana.reduce((s, n) => s + n.neto, 0);
    const hora = new Date().getHours();
    const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

    const counts = S.TIPOS.map(t => ({ t, n: activos.filter(e => e.tipo === t).length }));

    const Quick = ({ icon, label, sub, onClick, hero }) => (
      <button className="ta-btn" onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', cursor: 'pointer',
        background: hero ? 'var(--primary)' : 'var(--surface)', color: hero ? 'var(--on-primary)' : 'var(--ink)',
        border: hero ? 'none' : '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: 15,
        boxShadow: hero ? '0 8px 22px -10px rgba(120,75,20,.6)' : '0 1px 2px rgba(60,40,10,.04)',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: hero ? 'rgba(255,255,255,.18)' : 'var(--primary-soft)', color: hero ? 'var(--on-primary)' : 'var(--primary-ink)',
        }}><Icon name={icon} size={23} stroke={2} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{label}</div>
          <div style={{ fontSize: 13, marginTop: 1, opacity: hero ? 0.85 : 0.6 }}>{sub}</div>
        </div>
        <Icon name="chevR" size={20} stroke={2.2} style={{ opacity: hero ? 0.8 : 0.4 }} />
      </button>
    );

    return (
      <React.Fragment>
        <ScreenHeader
          title={`${saludo} 👋`} subtitle={S.weekLong(week)} large
          right={<IconButton name="logout" size={42} variant="surface" onClick={onLogout} iconSize={20} />}
        />
        <div style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Resumen semana */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Card pad={16}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--ink-3)', fontSize: 12.5, fontWeight: 600 }}>
                <Icon name="users" size={16} /> Empleados
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{activos.length}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>activos</div>
            </Card>
            <Card pad={16} style={{ background: 'var(--ink)', border: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,.6)', fontSize: 12.5, fontWeight: 600 }}>
                <Icon name="coins" size={16} /> Pagado esta semana
              </div>
              <div style={{ fontSize: 27, fontWeight: 800, color: '#fff', marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>{S.money0(totalSemana)}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>{nominasSemana.length} nómina{nominasSemana.length === 1 ? '' : 's'}</div>
            </Card>
          </div>

          {/* Pendientes */}
          {pendientes > 0 && (
            <button className="ta-btn" onClick={() => go('nomina')} style={{
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer',
              background: 'var(--amber-soft)', border: '1px solid var(--amber-line)', borderRadius: 'var(--r-card)', padding: '13px 15px',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="calc" size={21} stroke={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--amber-ink)' }}>{pendientes} nómina{pendientes === 1 ? '' : 's'} por calcular</div>
                <div style={{ fontSize: 13, color: 'var(--amber-ink)', opacity: .8 }}>Esta semana</div>
              </div>
              <Icon name="chevR" size={20} stroke={2.2} style={{ color: 'var(--amber-ink)', opacity: .6 }} />
            </button>
          )}

          {/* Accesos rápidos */}
          <div>
            <SectionLabel>Acciones</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Quick hero icon="calc" label="Calcular nómina" sub="Producción, bonos y descuentos" onClick={() => go('nomina')} />
              <Quick icon="calendar" label="Registrar asistencia" sub="Empleados de mostrador" onClick={() => go('asistencia')} />
              <Quick icon="coins" label="Préstamos" sub={`Por cobrar · ${S.money0(S.getSaldoTotal())}`} onClick={() => go('prestamos')} />
              <Quick icon="tag" label="Tarifas y precios" sub="Pan, sacos y sueldo diario" onClick={openTarifas} />
            </div>
          </div>

          {/* Plantilla */}
          <div>
            <SectionLabel action={<span onClick={() => go('empleados')} style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-ink)', cursor: 'pointer' }}>Ver todos</span>}>Plantilla</SectionLabel>
            <Card pad={0}>
              {counts.map((c, i) => (
                <div key={c.t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderTop: i ? '1px solid var(--line)' : 'none' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 99, background: window.UI.TIPO_COLOR[c.t].dot }} />
                  <div style={{ flex: 1, fontSize: 15.5, fontWeight: 600, color: 'var(--ink)' }}>{c.t}s</div>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink-2)', fontVariantNumeric: 'tabular-nums' }}>{c.n}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ════════════════════════════ EMPLEADOS ════════════════════════════
  function Empleados({ toast }) {
    const db = S.useDB();
    const [q, setQ] = useState('');
    const [filter, setFilter] = useState('Todos');
    const [editing, setEditing] = useState(null); // emp obj or {} for new or null

    const list = useMemo(() => {
      return db.employees
        .filter(e => filter === 'Todos' || e.tipo === filter)
        .filter(e => e.nombre.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }, [db.employees, q, filter]);

    return (
      <React.Fragment>
        <ScreenHeader
          title="Empleados" large
          right={<IconButton name="plus" size={42} variant="soft" stroke={2.4} onClick={() => setEditing({})} />}
          accessory={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Field icon="search" placeholder="Buscar por nombre" value={q} onChange={e => setQ(e.target.value)} style={{ }} />
              <Segmented full value={filter} onChange={setFilter} options={['Todos', ...S.TIPOS]} />
            </div>
          }
        />
        <div style={{ padding: '14px 16px 28px' }}>
          {list.length === 0 ? (
            <EmptyState icon="users" title="Sin empleados" sub="Agrega a tu primer empleado con el botón +"
              action={<Button icon="plus" onClick={() => setEditing({})}>Agregar empleado</Button>} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {list.map(e => (
                <Card key={e.id} pad={13} onClick={() => setEditing(e)} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <Avatar emp={e} size={48} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.nombre}</div>
                    <div style={{ marginTop: 5 }}><TipoBadge tipo={e.tipo} size="sm" /></div>
                  </div>
                  <Icon name="chevR" size={20} stroke={2} style={{ color: 'var(--ink-3)', opacity: .5 }} />
                </Card>
              ))}
            </div>
          )}
        </div>
        <EmpForm emp={editing} onClose={() => setEditing(null)} toast={toast} />
      </React.Fragment>
    );
  }

  function EmpForm({ emp, onClose, toast }) {
    const open = emp != null;
    const isNew = emp && !emp.id;
    const [f, setF] = useState({});
    React.useEffect(() => { if (emp) setF({ tipo: 'Panadero', sueldoDiario: 280, ...emp }); }, [emp]);
    const upd = (k, v) => setF(p => ({ ...p, [k]: v }));
    const save = () => {
      if (!f.nombre || !f.nombre.trim()) { toast('El nombre es obligatorio'); return; }
      S.upsertEmployee(f);
      toast(isNew ? 'Empleado agregado' : 'Cambios guardados');
      onClose();
    };
    const del = () => { S.removeEmployee(f.id); toast('Empleado eliminado'); onClose(); };

    return (
      <Sheet open={open} onClose={onClose} title={isNew ? 'Nuevo empleado' : 'Editar empleado'} full>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Foto */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-2)', border: '1.5px dashed var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)', flexShrink: 0,
            }}>
              {f.nombre ? <Avatar emp={f} size={64} /> : <Icon name="camera" size={24} />}
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--primary-ink)' }}>Agregar foto</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Opcional</div>
            </div>
          </div>

          <Field label="Nombre completo *" placeholder="Ej. Ramiro García" value={f.nombre || ''} onChange={e => upd('nombre', e.target.value)} />

          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 7, paddingLeft: 2 }}>Tipo de empleado</div>
            <Segmented full value={f.tipo} onChange={v => upd('tipo', v)} options={S.TIPOS} />
          </div>

          {f.tipo === 'Mostrador' && (
            <Field label="Sueldo diario" prefix="$" inputMode="decimal" value={f.sueldoDiario || ''} onChange={e => upd('sueldoDiario', e.target.value.replace(/[^\d.]/g, ''))} suffix="MXN" />
          )}

          <div style={{ height: 1, background: 'var(--line)', margin: '2px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6, paddingLeft: 2 }}>Datos opcionales</div>

          <Field label="Fecha de ingreso" type="date" icon="calendar" value={f.fechaIngreso || ''} onChange={e => upd('fechaIngreso', e.target.value)} />
          <Field label="Teléfono" icon="phone" inputMode="tel" placeholder="729 000 0000" value={f.telefono || ''} onChange={e => upd('telefono', e.target.value)} />
          <Field label="NSS" icon="idcard" inputMode="numeric" placeholder="11 dígitos" value={f.nss || ''} onChange={e => upd('nss', e.target.value.replace(/\D/g, ''))} />
          <Field label="Dirección" icon="pin" placeholder="Calle, número, colonia" value={f.direccion || ''} onChange={e => upd('direccion', e.target.value)} />

          <Button size="lg" full onClick={save} style={{ marginTop: 6 }}>{isNew ? 'Agregar empleado' : 'Guardar cambios'}</Button>
          {!isNew && <Button variant="danger" full icon="trash" onClick={del}>Eliminar empleado</Button>}
        </div>
      </Sheet>
    );
  }

  // ════════════════════════════ TARIFAS ════════════════════════════
  function Tarifas({ open, onClose, toast }) {
    const db = S.useDB();
    const [t, setT] = useState(null);
    React.useEffect(() => { if (open) setT(JSON.parse(JSON.stringify(db.tarifas))); }, [open]);
    if (!t) return <Sheet open={open} onClose={onClose} title="Tarifas y precios" />;
    const updPan = (k, v) => setT(p => ({ ...p, pan: { ...p.pan, [k]: v } }));
    const save = () => {
      const clean = { pan: {}, sacoHarina: +t.sacoHarina || 0, sueldoDiarioMostrador: +t.sueldoDiarioMostrador || 0 };
      S.PANES.forEach(p => clean.pan[p.k] = +t.pan[p.k] || 0);
      S.setTarifas(clean); toast('Tarifas actualizadas'); onClose();
    };
    const Money = ({ label, sub, value, onChange, dot }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: '1px solid var(--line)' }}>
        {dot && <span style={{ width: 9, height: 9, borderRadius: 99, background: dot, flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
          {sub && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1 }}>{sub}</div>}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface-2)', border: '1px solid var(--line)',
          borderRadius: 11, padding: '0 12px', height: 46, width: 116,
        }}>
          <span style={{ color: 'var(--ink-3)', fontWeight: 700, fontSize: 15 }}>$</span>
          <input inputMode="decimal" value={value} onChange={e => onChange(e.target.value.replace(/[^\d.]/g, ''))} style={{
            width: '100%', border: 'none', outline: 'none', background: 'transparent', textAlign: 'right',
            fontFamily: 'var(--font)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums',
          }} />
        </div>
      </div>
    );
    return (
      <Sheet open={open} onClose={onClose} title="Tarifas y precios" full>
        <div style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.5, marginBottom: 14 }}>
          Estos precios se usan al calcular la nómina. Puedes editarlos en cualquier momento.
        </div>

        <SectionLabel>Pan — precio por pieza (panaderos)</SectionLabel>
        <Card pad={16} style={{ marginBottom: 20 }}>
          {S.PANES.map(p => (
            <Money key={p.k} label={p.label} dot="var(--amber)" value={t.pan[p.k]} onChange={v => updPan(p.k, v)} />
          ))}
          <div style={{ height: 0 }} />
        </Card>

        <SectionLabel>Tortilleros</SectionLabel>
        <Card pad={16} style={{ marginBottom: 20 }}>
          <Money label="Precio base por saco" sub="De harina — editable al calcular" dot="var(--brown)" value={t.sacoHarina} onChange={v => setT(p => ({ ...p, sacoHarina: v }))} />
        </Card>

        <SectionLabel>Mostrador</SectionLabel>
        <Card pad={16} style={{ marginBottom: 22 }}>
          <Money label="Sueldo diario predeterminado" sub="Se aplica a empleados nuevos" dot="var(--green)" value={t.sueldoDiarioMostrador} onChange={v => setT(p => ({ ...p, sueldoDiarioMostrador: v }))} />
        </Card>

        <Button size="lg" full onClick={save}>Guardar tarifas</Button>
      </Sheet>
    );
  }

  window.Screens = Object.assign(window.Screens || {}, { Login, Inicio, Empleados, Tarifas, Logo, BRAND });
})();
