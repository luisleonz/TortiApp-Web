import { useState } from 'react'
import { ScreenHeader, WeekNav } from '../components/Layout'
import { Card, Avatar, EmptyState, CalendarIcon } from '../components/ui'
import { useStore, useEmpleados } from '../store/context'
import { weekId, DAYS } from '../utils/dates'
import { money0 } from '../utils/format'

function AsistRow({ emp, week }) {
  const { state, dispatch } = useStore()
  const rec = state.asistencia.find(a => a.empleadoId === emp.id && a.semana === week)
  const dias = rec ? rec.dias : [false, false, false, false, false, false, false]
  const total = dias.filter(Boolean).length
  const pago = total * (emp.sueldoDiario || 0)

  const toggle = i => {
    const next = dias.slice()
    next[i] = !next[i]
    dispatch({ type: 'SET_ASISTENCIA', payload: { empleadoId: emp.id, semana: week, dias: next } })
  }

  return (
    <Card>
      <div className="flex items-center gap-3 mb-3.5">
        <Avatar emp={emp} />
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-ink">{emp.nombre}</div>
          <div className="text-xs text-ink-3">{money0(emp.sueldoDiario || 0)} / día</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-extrabold text-green-700 tabular-nums">{total}/7</div>
          <div className="text-xs text-ink-3 tabular-nums">{money0(pago)}</div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((d, i) => {
          const on = dias[i]
          return (
            <button key={i} type="button" onClick={() => toggle(i)}
              className={`flex flex-col items-center gap-1 py-2 rounded-[11px] transition-all active:scale-95
                ${on ? 'bg-green-600 text-white' : 'bg-surface-2 text-ink-3 border border-line'}`}>
              <span className="text-[10px] font-bold">{d}</span>
              {on
                ? <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 6.5" /></svg>
                : <span className="w-3.5 h-3.5 rounded-full border border-line" />}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

export default function Asistencia() {
  const empleados = useEmpleados()
  const [week, setWeek] = useState(weekId(new Date()))
  const mostrador = empleados.filter(e => e.activo && e.tipo === 'Mostrador')

  return (
    <>
      <ScreenHeader title="Asistencia" large subtitle="Empleados de mostrador"
        accessory={<WeekNav week={week} setWeek={setWeek} />} />
      <div className="p-4 pb-8 flex flex-col gap-3">
        {mostrador.length === 0 ? (
          <EmptyState icon={CalendarIcon} title="Sin empleados de mostrador"
            sub="La asistencia solo aplica a empleados tipo Mostrador." />
        ) : (
          <>
            {mostrador.map(e => <AsistRow key={e.id} emp={e} week={week} />)}
            <p className="text-center text-xs text-ink-3 mt-2 leading-relaxed">
              Los días marcados se usan automáticamente al calcular la nómina.
            </p>
          </>
        )}
      </div>
    </>
  )
}
