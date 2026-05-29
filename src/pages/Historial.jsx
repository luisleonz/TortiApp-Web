import { useState, useMemo } from 'react'
import { ScreenHeader } from '../components/Layout'
import { Card, Avatar, TipoBadge, Segmented, EmptyState, Sheet, Button, PDFIcon, HistoryIcon } from '../components/ui'
import { useNominas, useEmpleados } from '../store/context'
import { weekLabel, weekLong } from '../utils/dates'
import { money, money0 } from '../utils/format'
import { generarRecibo } from '../utils/pdf'
import { calcNomina } from '../utils/calc'

export default function Historial() {
  const nominas = useNominas()
  const empleados = useEmpleados()
  const [mode, setMode] = useState('semana')
  const [detail, setDetail] = useState(null)

  const groups = useMemo(() => {
    const sorted = [...nominas].sort((a, b) => b.semana.localeCompare(a.semana))
    const map = {}
    sorted.forEach(n => {
      const k = mode === 'semana' ? n.semana : n.empleadoId
      if (!map[k]) map[k] = []
      map[k].push(n)
    })
    return Object.entries(map)
  }, [nominas, mode])

  const getEmp = id => empleados.find(e => e.id === id) || { nombre: '?', tipo: 'Panadero' }

  return (
    <>
      <ScreenHeader title="Historial" large
        accessory={<Segmented full value={mode} onChange={setMode} options={[{ value: 'semana', label: 'Por semana' }, { value: 'empleado', label: 'Por empleado' }]} />} />
      <div className="p-4 pb-8 flex flex-col gap-5">
        {groups.length === 0 ? (
          <EmptyState icon={HistoryIcon} title="Sin nóminas aún" sub="Las nóminas guardadas aparecerán aquí, filtrables por semana o empleado." />
        ) : groups.map(([key, items]) => {
          const total = items.reduce((s, n) => s + (n.totalNeto || 0), 0)
          const head = mode === 'semana' ? weekLabel(key) : (getEmp(key)?.nombre || '?')
          const sub = mode === 'semana' ? `${items.length} pago${items.length !== 1 ? 's' : ''}` : `${items.length} semana${items.length !== 1 ? 's' : ''}`
          return (
            <div key={key}>
              <div className="flex items-baseline justify-between mx-1 mb-2.5">
                <div>
                  <div className="text-[14.5px] font-bold text-ink">{head}</div>
                  <div className="text-xs text-ink-3 mt-0.5">{sub}</div>
                </div>
                <div className="text-[15px] font-extrabold text-ink-2 tabular-nums">{money0(total)}</div>
              </div>
              <div className="flex flex-col gap-2">
                {items.map(n => {
                  const emp = getEmp(n.empleadoId)
                  return (
                    <Card key={n.id} onClick={() => setDetail(n)} className="flex items-center gap-3 !p-3">
                      <Avatar emp={emp} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-bold text-ink truncate">
                          {mode === 'semana' ? n.empNombre || emp.nombre : weekLabel(n.semana)}
                        </div>
                        <TipoBadge tipo={n.tipo} size="sm" />
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-extrabold text-ink tabular-nums">{money(n.totalNeto || 0)}</div>
                        {(n.abono + n.credito > 0) && (
                          <div className="text-[11px] text-red-500 tabular-nums">−{money0((n.abono || 0) + (n.credito || 0))} desc.</div>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail sheet */}
      <Sheet open={!!detail} onClose={() => setDetail(null)} title="Detalle de nómina" full>
        {detail && <NominaDetail n={detail} emp={getEmp(detail.empleadoId)} />}
      </Sheet>
    </>
  )
}

function NominaDetail({ n, emp }) {
  const calc = useMemo(() => calcNomina(n), [n])

  const generarPDF = () => generarRecibo({ empNombre: n.empNombre || emp.nombre, semana: n.semana, tipo: n.tipo, ...calc })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar emp={emp} size="lg" />
        <div>
          <div className="text-lg font-extrabold text-ink">{n.empNombre || emp.nombre}</div>
          <div className="text-sm text-ink-3">{n.tipo} · {weekLong(n.semana)}</div>
        </div>
      </div>

      <Card>
        <div className="border-b border-line pb-1">
          {calc.baseLineas.filter(l => l.qty > 0).map((l, i) => (
            <div key={i} className="flex justify-between items-center py-2">
              <div>
                <div className="text-sm font-medium text-ink-2">{l.label}</div>
                <div className="text-xs text-ink-3">{l.qty} × {money(l.rate)}</div>
              </div>
              <span className="text-sm font-bold text-ink tabular-nums">{money(l.sub)}</span>
            </div>
          ))}
          {calc.base === 0 && <div className="text-sm text-ink-3 py-2">Sin producción registrada</div>}
        </div>
        {calc.bonos > 0 && <DetRow label="Bonos" val={calc.bonos} />}
        {calc.extras > 0 && <DetRow label="Extras" val={calc.extras} />}
        {calc.abono > 0 && <DetRow label="Abono a préstamo" val={calc.abono} neg />}
        {calc.credito > 0 && <DetRow label="Crédito de tienda" val={calc.credito} neg />}
        <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-line">
          <span className="text-base font-bold text-ink">Total neto</span>
          <span className="text-[28px] font-extrabold text-amber-600 tabular-nums">{money(calc.neto)}</span>
        </div>
      </Card>

      <Button variant="outline" full icon={PDFIcon} onClick={generarPDF}>Descargar recibo PDF</Button>
    </div>
  )
}

function DetRow({ label, val, neg }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className={`text-sm font-medium ${neg ? 'text-red-600' : 'text-ink-2'}`}>{label}</span>
      <span className={`text-sm font-bold tabular-nums ${neg ? 'text-red-600' : 'text-ink'}`}>
        {neg ? '−' : ''}{money(Math.abs(val))}
      </span>
    </div>
  )
}
