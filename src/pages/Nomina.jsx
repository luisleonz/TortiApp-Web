import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenHeader, WeekNav } from '../components/Layout'
import { Card, Avatar, TipoBadge, Button, EmptyState, CalcIcon, CheckIcon, ChevRIcon } from '../components/ui'
import { useEmpleados, useNominas, useTarifas } from '../store/context'
import { weekId, weekLabel } from '../utils/dates'
import { money0 } from '../utils/format'

export default function Nomina() {
  const navigate = useNavigate()
  const empleados = useEmpleados()
  const nominas = useNominas()
  const tarifas = useTarifas()
  const [week, setWeek] = useState(weekId(new Date()))
  const activos = empleados.filter(e => e.activo)

  const nominasSemana = useMemo(() => nominas.filter(n => n.semana === week), [nominas, week])
  const totalSemana = nominasSemana.reduce((s, n) => s + (n.totalNeto || 0), 0)

  return (
    <>
      <ScreenHeader title="Nómina semanal" large
        accessory={<WeekNav week={week} setWeek={setWeek} />} />
      <div className="p-4 pb-8 flex flex-col gap-4">
        {/* Resumen de semana */}
        {nominasSemana.length > 0 && (
          <div className="bg-ink rounded-card p-4 text-white">
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1">Pagado esta semana</div>
            <div className="text-3xl font-extrabold tabular-nums">{money0(totalSemana)}</div>
            <div className="text-xs text-white/50 mt-1">{nominasSemana.length} nómina{nominasSemana.length !== 1 ? 's' : ''} guardada{nominasSemana.length !== 1 ? 's' : ''}</div>
          </div>
        )}

        <div className="text-xs font-bold text-ink-3 uppercase tracking-wide mx-1 mb-1">Empleados</div>
        {activos.length === 0 ? (
          <EmptyState icon={CalcIcon} title="Sin empleados" sub="Agrega empleados para calcular nóminas." />
        ) : activos.map(e => {
          const nomina = nominasSemana.find(n => n.empleadoId === e.id)
          return (
            <Card key={e.id} onClick={() => navigate(`/nomina/${e.id}?semana=${week}`)}
              className="flex items-center gap-3 !p-3">
              <Avatar emp={e} />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold text-ink truncate">{e.nombre}</div>
                <TipoBadge tipo={e.tipo} size="sm" />
              </div>
              <div className="text-right shrink-0">
                {nomina ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-ink tabular-nums">{money0(nomina.totalNeto)}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      <CheckIcon className="w-3 h-3" /> Lista
                    </span>
                  </div>
                ) : (
                  <ChevRIcon className="w-5 h-5 text-ink-3/50" />
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}
