/* store.js — datos, persistencia (localStorage), formato y cálculo de nómina.
   Plain JS (sin JSX). Exporta a window.Store. */
(function () {
  const KEY = 'tortiapp_v2';

  // ── Formato ──────────────────────────────────────────────
  const _mx = new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', minimumFractionDigits: 2,
  });
  const money = (n) => _mx.format(isFinite(n) ? n : 0);
  const money0 = (n) => _mx.format(isFinite(n) ? n : 0).replace(/\.00$/, '');
  const num = (n) => new Intl.NumberFormat('es-MX').format(isFinite(n) ? n : 0);

  // ── Semanas (lunes como inicio) ─────────────────────────
  const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  function mondayOf(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    const day = (x.getDay() + 6) % 7; // 0 = lunes
    x.setDate(x.getDate() - day);
    return x;
  }
  function weekId(d) {
    const m = mondayOf(d);
    return `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}-${String(m.getDate()).padStart(2, '0')}`;
  }
  function weekFromId(id) {
    const [y, m, d] = id.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  function weekLabel(id) {
    const a = weekFromId(id);
    const b = new Date(a); b.setDate(b.getDate() + 6);
    if (a.getMonth() === b.getMonth())
      return `${a.getDate()}–${b.getDate()} ${MONTHS[a.getMonth()]}`;
    return `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]}`;
  }
  function weekLong(id) {
    const a = weekFromId(id);
    const b = new Date(a); b.setDate(b.getDate() + 6);
    return `Semana del ${a.getDate()} al ${b.getDate()} de ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
  }
  function addWeeks(id, n) { const d = weekFromId(id); d.setDate(d.getDate() + n * 7); return weekId(d); }
  function dayDate(id, i) { const d = weekFromId(id); d.setDate(d.getDate() + i); return d; }

  const TIPOS = ['Panadero', 'Tortillero', 'Mostrador'];
  const PANES = [
    { k: 'dulce', label: 'Pan dulce' },
    { k: 'blanco', label: 'Pan blanco' },
    { k: 'ajonjoli', label: 'Ajonjolí' },
    { k: 'galletas', label: 'Galletas' },
  ];

  // ── Semilla ──────────────────────────────────────────────
  function seed() {
    const thisWeek = weekId(new Date());
    const lastWeek = addWeeks(thisWeek, -1);
    const twoWeeks = addWeeks(thisWeek, -2);
    const wk = (n) => weekFromId(addWeeks(thisWeek, n)).toISOString();
    return {
      employees: [
        { id: 'e1', nombre: 'Ramiro García', tipo: 'Panadero', fechaIngreso: '2019-03-12', nss: '12345678901', direccion: 'Calle Hidalgo 23, Centro', telefono: '729 112 3344', foto: null, sueldoDiario: 0, activo: true },
        { id: 'e2', nombre: 'Lucía Hernández', tipo: 'Panadero', fechaIngreso: '2021-07-01', nss: '23456789012', direccion: 'Av. Juárez 110', telefono: '729 220 4455', foto: null, sueldoDiario: 0, activo: true },
        { id: 'e3', nombre: 'José Martínez', tipo: 'Tortillero', fechaIngreso: '2018-01-15', nss: '34567890123', direccion: 'Privada del Maíz 4', telefono: '729 331 5566', foto: null, sueldoDiario: 0, activo: true },
        { id: 'e4', nombre: 'Pedro Sánchez', tipo: 'Tortillero', fechaIngreso: '2022-09-20', nss: '', direccion: '', telefono: '729 440 6677', foto: null, sueldoDiario: 0, activo: true },
        { id: 'e5', nombre: 'Marisol Vega', tipo: 'Mostrador', fechaIngreso: '2020-11-05', nss: '45678901234', direccion: 'Calle Morelos 88', telefono: '729 550 7788', foto: null, sueldoDiario: 280, activo: true },
        { id: 'e6', nombre: 'Ana López', tipo: 'Mostrador', fechaIngreso: '2023-02-10', nss: '', direccion: '', telefono: '729 660 8899', foto: null, sueldoDiario: 260, activo: true },
      ],
      tarifas: {
        pan: { dulce: 1.5, blanco: 1.2, ajonjoli: 1.8, galletas: 2.0 },
        sacoHarina: 180,
        sueldoDiarioMostrador: 280,
      },
      asistencia: {
        [thisWeek]: { e5: [true, true, true, false, true, true, false], e6: [true, true, false, true, true, false, false] },
        [lastWeek]: { e5: [true, true, true, true, true, true, false], e6: [true, false, true, true, true, true, false] },
      },
      nominas: [
        nominaEjemplo('e1', 'Ramiro García', 'Panadero', lastWeek, { panes: { dulce: 1240, blanco: 980, ajonjoli: 320, galletas: 210 } }, { bonos: [{ desc: 'Bono puntualidad', monto: 150 }], extras: [], abono: 200, credito: 80 }),
        nominaEjemplo('e3', 'José Martínez', 'Tortillero', lastWeek, { sacos: 38, precioSaco: 180 }, { bonos: [], extras: [{ desc: 'Hora extra domingo', monto: 220 }], abono: 0, credito: 120 }),
        nominaEjemplo('e5', 'Marisol Vega', 'Mostrador', lastWeek, { dias: 6, sueldoDiario: 280 }, { bonos: [], extras: [], abono: 300, credito: 0 }),
        nominaEjemplo('e1', 'Ramiro García', 'Panadero', twoWeeks, { panes: { dulce: 1100, blanco: 900, ajonjoli: 280, galletas: 180 } }, { bonos: [], extras: [], abono: 200, credito: 0 }),
        nominaEjemplo('e3', 'José Martínez', 'Tortillero', twoWeeks, { sacos: 35, precioSaco: 175 }, { bonos: [], extras: [], abono: 0, credito: 60 }),
      ],
      prestamos: [
        { id: 'p1', empId: 'e1', tipo: 'prestamo', monto: 3000, motivo: 'Préstamo personal', fecha: wk(-6) },
        { id: 'p2', empId: 'e3', tipo: 'prestamo', monto: 1500, motivo: 'Adelanto para medicinas', fecha: wk(-5) },
        { id: 'p3', empId: 'e5', tipo: 'prestamo', monto: 2000, motivo: 'Préstamo personal', fecha: wk(-4) },
        { id: 'abono_n_e1_' + twoWeeks, empId: 'e1', tipo: 'abono', monto: 200, motivo: 'Abono vía nómina', fecha: wk(-1), nominaId: 'n_e1_' + twoWeeks },
        { id: 'abono_n_e1_' + lastWeek, empId: 'e1', tipo: 'abono', monto: 200, motivo: 'Abono vía nómina', fecha: wk(0), nominaId: 'n_e1_' + lastWeek },
        { id: 'abono_n_e5_' + lastWeek, empId: 'e5', tipo: 'abono', monto: 300, motivo: 'Abono vía nómina', fecha: wk(0), nominaId: 'n_e5_' + lastWeek },
      ],
      session: false,
    };
  }

  function nominaEjemplo(empId, empNombre, tipo, week, prod, ajustes) {
    const r = calc({ tipo, prod, ajustes });
    return {
      id: 'n_' + empId + '_' + week, empId, empNombre, tipo, weekId: week,
      fecha: weekFromId(addWeeks(week, 1)).toISOString(),
      prod, ajustes, ...r,
    };
  }

  // ── Cálculo ──────────────────────────────────────────────
  // Recibe tarifas opcionales; usa snapshot de prod (panes/sacos/dias).
  function calc({ tipo, prod = {}, ajustes = {}, tarifas }) {
    let baseLineas = [];
    let base = 0;
    if (tipo === 'Panadero') {
      const rates = (tarifas && tarifas.pan) || prod.rates || { dulce: 1.5, blanco: 1.2, ajonjoli: 1.8, galletas: 2.0 };
      PANES.forEach(p => {
        const u = (prod.panes && prod.panes[p.k]) || 0;
        const rate = (prod.rates && prod.rates[p.k]) != null ? prod.rates[p.k] : rates[p.k];
        const sub = u * rate;
        baseLineas.push({ label: p.label, qty: u, rate, sub });
        base += sub;
      });
    } else if (tipo === 'Tortillero') {
      const sacos = prod.sacos || 0;
      const precio = prod.precioSaco != null ? prod.precioSaco : (tarifas ? tarifas.sacoHarina : 180);
      const sub = sacos * precio;
      baseLineas.push({ label: 'Sacos de harina', qty: sacos, rate: precio, sub });
      base = sub;
    } else { // Mostrador
      const dias = prod.dias || 0;
      const sd = prod.sueldoDiario != null ? prod.sueldoDiario : (tarifas ? tarifas.sueldoDiarioMostrador : 280);
      const sub = dias * sd;
      baseLineas.push({ label: 'Días asistidos', qty: dias, rate: sd, sub });
      base = sub;
    }
    const bonos = (ajustes.bonos || []).reduce((s, b) => s + (+b.monto || 0), 0);
    const extras = (ajustes.extras || []).reduce((s, b) => s + (+b.monto || 0), 0);
    const abono = +ajustes.abono || 0;
    const credito = +ajustes.credito || 0;
    const ingresos = base + bonos + extras;
    const deducciones = abono + credito;
    const neto = ingresos - deducciones;
    return { baseLineas, base, bonos, extras, abono, credito, ingresos, deducciones, neto };
  }

  // ── Persistencia ─────────────────────────────────────────
  let state = null;
  const subs = new Set();
  function load() {
    if (state) return state;
    try {
      const raw = localStorage.getItem(KEY);
      state = raw ? JSON.parse(raw) : seed();
    } catch (e) { state = seed(); }
    return state;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    subs.forEach(fn => fn(state));
  }
  function get() { return load(); }
  function set(mut) { load(); mut(state); save(); }
  function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }
  function reset() { state = seed(); save(); }

  // ── Mutaciones de alto nivel ─────────────────────────────
  function upsertEmployee(emp) {
    set(s => {
      if (emp.id) {
        const i = s.employees.findIndex(e => e.id === emp.id);
        if (i >= 0) s.employees[i] = { ...s.employees[i], ...emp };
        else s.employees.push(emp);
      } else {
        s.employees.push({ ...emp, id: 'e' + Date.now(), activo: true });
      }
    });
  }
  function removeEmployee(id) { set(s => { s.employees = s.employees.filter(e => e.id !== id); }); }
  function setTarifas(t) { set(s => { s.tarifas = { ...s.tarifas, ...t }; }); }
  function setAsistencia(week, empId, arr) {
    set(s => {
      if (!s.asistencia[week]) s.asistencia[week] = {};
      s.asistencia[week][empId] = arr;
    });
  }
  function getAsistencia(week, empId) {
    const w = get().asistencia[week];
    return (w && w[empId]) || [false, false, false, false, false, false, false];
  }
  function saveNomina(n) {
    const id = n.id || ('n_' + n.empId + '_' + n.weekId);
    set(s => {
      const i = s.nominas.findIndex(x => x.id === id);
      const rec = { ...n, id, fecha: new Date().toISOString() };
      if (i >= 0) s.nominas[i] = rec; else s.nominas.unshift(rec);
    });
    // Vincular el abono a préstamo con el libro de préstamos
    linkAbonoNomina(id, n.empId, (n.ajustes && +n.ajustes.abono) || 0, n.weekId);
  }
  function getNomina(empId, week) { return get().nominas.find(n => n.empId === empId && n.weekId === week); }

  // ── Préstamos (libro de movimientos) ─────────────────────
  function getMovimientos(empId) {
    return get().prestamos.filter(m => !empId || m.empId === empId).slice().sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }
  function getSaldo(empId) {
    return get().prestamos.filter(m => m.empId === empId)
      .reduce((s, m) => s + (m.tipo === 'abono' ? -(+m.monto || 0) : (+m.monto || 0)), 0);
  }
  function getSaldoTotal() { return get().employees.reduce((s, e) => s + Math.max(0, getSaldo(e.id)), 0); }
  function getConDeuda() { return get().employees.filter(e => getSaldo(e.id) > 0.005).length; }
  function addMovimiento({ empId, tipo, monto, motivo, fecha }) {
    set(s => {
      s.prestamos.unshift({
        id: (tipo === 'abono' ? 'a_' : 'p_') + Date.now(), empId, tipo,
        monto: +monto || 0, motivo: motivo || (tipo === 'abono' ? 'Abono' : 'Préstamo'),
        fecha: fecha ? new Date(fecha + 'T12:00:00').toISOString() : new Date().toISOString(),
      });
    });
  }
  function removeMovimiento(id) { set(s => { s.prestamos = s.prestamos.filter(m => m.id !== id); }); }
  function linkAbonoNomina(nominaId, empId, monto, week) {
    set(s => {
      const id = 'abono_' + nominaId;
      s.prestamos = s.prestamos.filter(m => m.id !== id);
      if ((+monto || 0) > 0) s.prestamos.unshift({ id, empId, tipo: 'abono', monto: +monto, motivo: 'Abono vía nómina (' + weekLabel(week) + ')', fecha: new Date().toISOString(), nominaId });
    });
  }

  // Hook reactivo: re-render al cambiar el estado
  function useDB() {
    const [, force] = React.useReducer(x => x + 1, 0);
    React.useEffect(() => subscribe(() => force()), []);
    return get();
  }

  window.Store = {
    KEY, money, money0, num, DAYS, MONTHS, TIPOS, PANES, useDB,
    mondayOf, weekId, weekFromId, weekLabel, weekLong, addWeeks, dayDate,
    calc, get, set, subscribe, reset, load,
    upsertEmployee, removeEmployee, setTarifas, setAsistencia, getAsistencia, saveNomina, getNomina,
    getMovimientos, getSaldo, getSaldoTotal, getConDeuda, addMovimiento, removeMovimiento, linkAbonoNomina,
  };
})();
