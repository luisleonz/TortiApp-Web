const KEY = 'tortiapp_v3'

function now() { return new Date().toISOString() }

// ── Seed data ─────────────────────────────────────────────────
function seed() {
  return {
    empleados: [
      { id: 'e1', nombre: 'Ramiro García', tipo: 'Panadero', sueldoDiario: 0, fechaIngreso: '2019-03-12', nss: '12345678901', direccion: 'Calle Hidalgo 23, Centro', telefono: '729 112 3344', fotoUrl: null, activo: true },
      { id: 'e2', nombre: 'Lucía Hernández', tipo: 'Panadero', sueldoDiario: 0, fechaIngreso: '2021-07-01', nss: '23456789012', direccion: 'Av. Juárez 110', telefono: '729 220 4455', fotoUrl: null, activo: true },
      { id: 'e3', nombre: 'José Martínez', tipo: 'Tortillero', sueldoDiario: 0, fechaIngreso: '2018-01-15', nss: '34567890123', direccion: 'Privada del Maíz 4', telefono: '729 331 5566', fotoUrl: null, activo: true },
      { id: 'e4', nombre: 'Pedro Sánchez', tipo: 'Tortillero', sueldoDiario: 0, fechaIngreso: '2022-09-20', nss: '', direccion: '', telefono: '729 440 6677', fotoUrl: null, activo: true },
      { id: 'e5', nombre: 'Marisol Vega', tipo: 'Mostrador', sueldoDiario: 280, fechaIngreso: '2020-11-05', nss: '45678901234', direccion: 'Calle Morelos 88', telefono: '729 550 7788', fotoUrl: null, activo: true },
      { id: 'e6', nombre: 'Ana López', tipo: 'Mostrador', sueldoDiario: 260, fechaIngreso: '2023-02-10', nss: '', direccion: '', telefono: '729 660 8899', fotoUrl: null, activo: true },
    ],
    tarifas: {
      panDulce: 1.5,
      panBlanco: 1.2,
      panAjonjoli: 1.8,
      galletas: 2.0,
      precioPorSaco: 180,
      sueldoDiarioMostrador: 280,
    },
    asistencia: [],
    nominas: [],
    prestamos: [
      { empleadoId: 'e1', saldoPendiente: 2600 },
      { empleadoId: 'e3', saldoPendiente: 1500 },
      { empleadoId: 'e5', saldoPendiente: 1700 },
    ],
    creditoTienda: [],
  }
}

// ── Load / save ────────────────────────────────────────────────
export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : seed()
    // Migrate older keys
    if (!parsed.creditoTienda) parsed.creditoTienda = []
    if (!parsed.prestamos) parsed.prestamos = []
    return parsed
  } catch {
    return seed()
  }
}

export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
}

export function resetState() {
  localStorage.removeItem(KEY)
  return seed()
}

// ── Auth ───────────────────────────────────────────────────────
export const auth = {
  get() { try { return localStorage.getItem('tortiapp_auth') === '1' } catch { return false } },
  set(v) { try { localStorage.setItem('tortiapp_auth', v ? '1' : '0') } catch {} },
}

// ── ID generators ──────────────────────────────────────────────
export const newId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
