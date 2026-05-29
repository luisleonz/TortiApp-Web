import { createContext, useContext, useReducer, useEffect } from 'react'
import { loadState, saveState, newId } from '../utils/storage'
import { weekId } from '../utils/dates'

const Ctx = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    // ── Empleados ──────────────────────────────────────────────
    case 'UPSERT_EMPLEADO': {
      const emp = action.payload
      if (emp.id) {
        return { ...state, empleados: state.empleados.map(e => e.id === emp.id ? { ...e, ...emp } : e) }
      }
      return { ...state, empleados: [...state.empleados, { ...emp, id: newId('e'), activo: true }] }
    }
    case 'TOGGLE_EMPLEADO_ACTIVO': {
      const { id } = action.payload
      return { ...state, empleados: state.empleados.map(e => e.id === id ? { ...e, activo: !e.activo } : e) }
    }
    case 'DELETE_EMPLEADO': {
      return { ...state, empleados: state.empleados.filter(e => e.id !== action.payload.id) }
    }

    // ── Tarifas ────────────────────────────────────────────────
    case 'SET_TARIFAS': {
      return { ...state, tarifas: { ...state.tarifas, ...action.payload } }
    }

    // ── Asistencia ─────────────────────────────────────────────
    case 'SET_ASISTENCIA': {
      const { empleadoId, semana, dias } = action.payload
      const filtered = state.asistencia.filter(a => !(a.empleadoId === empleadoId && a.semana === semana))
      return { ...state, asistencia: [...filtered, { empleadoId, semana, dias }] }
    }

    // ── Nóminas ────────────────────────────────────────────────
    case 'SAVE_NOMINA': {
      const n = action.payload
      const id = n.id || newId('n')
      const rec = { ...n, id, fechaGeneracion: new Date().toISOString() }
      const filtered = state.nominas.filter(x => x.id !== id)

      // Actualizar saldo de préstamos
      let prestamos = state.prestamos.map(p => {
        if (p.empleadoId !== n.empleadoId) return p
        const abono = +n.abonosPrestamo || 0
        return { ...p, saldoPendiente: Math.max(0, p.saldoPendiente - abono) }
      })
      // Si no existía registro de préstamo y el empleado tiene abono, crear con saldo 0
      if (!prestamos.find(p => p.empleadoId === n.empleadoId)) {
        prestamos = [...prestamos, { empleadoId: n.empleadoId, saldoPendiente: 0 }]
      }

      // Actualizar crédito de tienda
      let creditoTienda = state.creditoTienda.map(c => {
        if (c.empleadoId !== n.empleadoId) return c
        const abono = +n.abonoCreditoTienda || 0
        return { ...c, saldoPendiente: Math.max(0, c.saldoPendiente - abono) }
      })

      return { ...state, nominas: [rec, ...filtered], prestamos, creditoTienda }
    }
    case 'DELETE_NOMINA': {
      return { ...state, nominas: state.nominas.filter(n => n.id !== action.payload.id) }
    }

    // ── Préstamos ──────────────────────────────────────────────
    case 'SET_PRESTAMO': {
      const { empleadoId, saldoPendiente } = action.payload
      const filtered = state.prestamos.filter(p => p.empleadoId !== empleadoId)
      return { ...state, prestamos: [...filtered, { empleadoId, saldoPendiente: Math.max(0, saldoPendiente) }] }
    }
    case 'ADD_PRESTAMO': {
      const { empleadoId, monto } = action.payload
      const prestamos = state.prestamos.map(p => {
        if (p.empleadoId !== empleadoId) return p
        return { ...p, saldoPendiente: p.saldoPendiente + monto }
      })
      if (!state.prestamos.find(p => p.empleadoId === empleadoId)) {
        prestamos.push({ empleadoId, saldoPendiente: monto })
      }
      return { ...state, prestamos }
    }

    // ── Crédito de tienda ──────────────────────────────────────
    case 'SET_CREDITO': {
      const { empleadoId, saldoPendiente } = action.payload
      const filtered = state.creditoTienda.filter(c => c.empleadoId !== empleadoId)
      return { ...state, creditoTienda: [...filtered, { empleadoId, saldoPendiente: Math.max(0, saldoPendiente) }] }
    }
    case 'ADD_CREDITO': {
      const { empleadoId, monto } = action.payload
      const creditoTienda = state.creditoTienda.map(c => {
        if (c.empleadoId !== empleadoId) return c
        return { ...c, saldoPendiente: c.saldoPendiente + monto }
      })
      if (!state.creditoTienda.find(c => c.empleadoId === empleadoId)) {
        creditoTienda.push({ empleadoId, saldoPendiente: monto })
      }
      return { ...state, creditoTienda }
    }

    case 'RESET':
      return action.payload

    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  useEffect(() => { saveState(state) }, [state])

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useStore() {
  return useContext(Ctx)
}

// ── Selectors ──────────────────────────────────────────────────
export function useEmpleados() {
  const { state } = useStore()
  return state.empleados
}

export function useEmpleado(id) {
  const { state } = useStore()
  return state.empleados.find(e => e.id === id)
}

export function useTarifas() {
  const { state } = useStore()
  return state.tarifas
}

export function useAsistencia(empleadoId, semana) {
  const { state } = useStore()
  const rec = state.asistencia.find(a => a.empleadoId === empleadoId && a.semana === semana)
  return rec ? rec.dias : [false, false, false, false, false, false, false]
}

export function useNominas() {
  const { state } = useStore()
  return state.nominas
}

export function useNomina(empleadoId, semana) {
  const { state } = useStore()
  return state.nominas.find(n => n.empleadoId === empleadoId && n.semana === semana)
}

export function usePrestamo(empleadoId) {
  const { state } = useStore()
  return state.prestamos.find(p => p.empleadoId === empleadoId)?.saldoPendiente ?? 0
}

export function useCredito(empleadoId) {
  const { state } = useStore()
  return state.creditoTienda.find(c => c.empleadoId === empleadoId)?.saldoPendiente ?? 0
}
