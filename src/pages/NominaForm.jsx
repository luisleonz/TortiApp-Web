import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ScreenHeader } from '../components/Layout'
import {
  Button, Card, SectionLabel, Avatar, TipoBadge,
  PlusIcon, XIcon, ReceiptIcon, PDFIcon
} from '../components/ui'
import { useStore, useEmpleado, useTarifas, useNomina, usePrestamo, useCredito, useAsistencia } from '../store/context'
import { calcNomina, buildProduccion, PANES } from '../utils/calc'
import { weekId, weekLabel, PAYROLL_DAYS } from '../utils/dates'
import { money, money0 } from '../utils/format'
import { generarRecibo } from '../utils/pdf'

const defaultProdDiaria = () => Object.fromEntries(
  PANES.flatMap(p => [
    [`${p.k}_dd`, Array(7).fill(0)],
    [`${p.k}_da`, Array(7).fill(0)],
  ])
)

function ItemList({ items, setItems, label, placeholder }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[15px] font-bold text-ink">{label}</span>
        <button type="button"
          onClick={() => setItems(prev => [...prev, { desc: '', monto: '' }])}
          className="text-sm font-bold text-amber-600 flex items-center gap-1">
          <PlusIcon className="w-4 h-4" /> Agregar
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <input placeholder={placeholder} value={it.desc}
              onChange={e => {
                const v = e.target.value
                setItems(prev => prev.map((x, j) => j === i ? { ...x, desc: v } : x))
              }}
              className="flex-1 h-11 border border-line rounded-field bg-surface-2 px-3 text-[15px] text-ink font-sans outline-none focus:border-amber-500 transition-colors" />
            <div className="flex items-center h-11 border border-line rounded-field bg-surface-2 px-3 w-28 shrink-0 overflow-hidden">
              <span className="text-ink-3 font-bold text-sm mr-1">$</span>
              <input inputMode="decimal" placeholder="0" value={it.monto}
                onChange={e => {
                  const v = e.target.value.replace(/[^\d.]/g, '')
                  setItems(prev => prev.map((x, j) => j === i ? { ...x, monto: v } : x))
                }}
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-right font-bold text-[15px] text-ink tabular-nums" />
            </div>
            <button type="button"
              onClick={() => setItems(prev => prev.filter((_, j) => j !== i))}
              className="w-9 h-9 flex items-center justify-center rounded-card text-ink-3">
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function NominaForm() {
  const { id: empId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { dispatch } = useStore()

  const week = params.get('semana') || weekId(new Date())
  const emp = useEmpleado(empId)
  const tarifas = useTarifas()
  const existente = useNomina(empId, week)
  const saldoPrestamo = usePrestamo(empId)
  const saldoCredito = useCredito(empId)
  const asistenciaDias = useAsistencia(empId, week)

  // Panadero: 7-day arrays per bread type
  const [prodDiaria, setProdDiaria] = useState(defaultProdDiaria)
  const updDia = (key, dayIdx, val) => {
    setProdDiaria(prev => {
      const arr = [...prev[key]]
      arr[dayIdx] = Math.max(0, val)
      return { ...prev, [key]: arr }
    })
  }

  // Tortillero: 7-day array for sacos
  const [sacosArr, setSacosArr] = useState(Array(7).fill(0))
  const updSacos = (i, val) => setSacosArr(prev => {
    const a = [...prev]; a[i] = Math.max(0, val); return a
  })
  const [precioSaco, setPrecioSaco] = useState('')
  const [diasConDescuento, setDiasConDescuento] = useState(Array(7).fill(false))
  const [precioSacoDescuento, setPrecioSacoDescuento] = useState('')
  const toggleDescuento = i => setDiasConDescuento(prev => { const a = [...prev]; a[i] = !a[i]; return a })

  // Mostrador
  const [dias, setDias] = useState(0)
  const [sueldoDiario, setSueldoDiario] = useState('')

  // Ajustes
  const [bonos, setBonos] = useState([])
  const [extras, setExtras] = useState([])
  const [abonosPrestamo, setAbonosPrestamo] = useState('')
  const [abonoCreditoTienda, setAbonoCreditoTienda] = useState('')

  const [toast, setToast] = useState('')
  const showToast = m => { setToast(m); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    if (!emp) return
    if (existente) {
      const p = existente.produccion || []
      if (emp.tipo === 'Panadero') {
        if (existente.produccionDiaria && typeof existente.produccionDiaria === 'object' && !existente.produccionDiaria.sacos) {
          // New daily format
          setProdDiaria({ ...defaultProdDiaria(), ...existente.produccionDiaria })
        } else {
          // Backward compat: load totals into first day slot
          const loaded = defaultProdDiaria()
          PANES.forEach(pan => {
            const dd = p.find(l => l.tipo === `${pan.k}_dd`)
            const da = p.find(l => l.tipo === `${pan.k}_da`)
            const old = p.find(l => l.tipo === pan.k)
            if (dd?.cantidad) loaded[`${pan.k}_dd`][0] = dd.cantidad
            if (da?.cantidad) loaded[`${pan.k}_da`][0] = da.cantidad
            if (!dd && !da && old?.cantidad) loaded[`${pan.k}_dd`][0] = old.cantidad
          })
          setProdDiaria(loaded)
        }
      } else if (emp.tipo === 'Tortillero') {
        if (existente.produccionDiaria?.sacos) {
          setSacosArr([...existente.produccionDiaria.sacos])
          setDiasConDescuento(existente.produccionDiaria.diasConDescuento
            ? [...existente.produccionDiaria.diasConDescuento]
            : Array(7).fill(false))
          setPrecioSacoDescuento(String(existente.produccionDiaria.precioSacoDescuento || ''))
        } else {
          const arr = Array(7).fill(0)
          const total = p[0]?.cantidad || 0
          if (total) arr[0] = total
          setSacosArr(arr)
          setDiasConDescuento(Array(7).fill(false))
          setPrecioSacoDescuento('')
        }
        setPrecioSaco(String(p[0]?.precioUnitario || tarifas.precioPorSaco))
      } else {
        setDias(p[0]?.cantidad || 0)
        setSueldoDiario(String(p[0]?.precioUnitario || emp.sueldoDiario || tarifas.sueldoDiarioMostrador))
      }
      setBonos(Array.isArray(existente.bonos) ? existente.bonos : [])
      setExtras(Array.isArray(existente.extras) ? existente.extras : [])
      setAbonosPrestamo(String(existente.abonosPrestamo || ''))
      setAbonoCreditoTienda(String(existente.abonoCreditoTienda || ''))
    } else {
      setProdDiaria(defaultProdDiaria())
      setSacosArr(Array(7).fill(0))
      setDiasConDescuento(Array(7).fill(false))
      setPrecioSacoDescuento('')
      setDias(0); setBonos([]); setExtras([])
      setAbonosPrestamo(''); setAbonoCreditoTienda('')
      if (emp.tipo === 'Tortillero') setPrecioSaco(String(tarifas.precioPorSaco))
      else if (emp.tipo === 'Mostrador') {
        setSueldoDiario(String(emp.sueldoDiario || tarifas.sueldoDiarioMostrador))
        setDias(asistenciaDias.filter(Boolean).length)
      }
    }
  }, [emp?.id, week])

  const nominaData = useMemo(() => {
    if (!emp) return null
    let prodData = {}
    if (emp.tipo === 'Panadero') {
      PANES.forEach(p => {
        prodData[`${p.k}_dd`] = prodDiaria[`${p.k}_dd`].reduce((s, v) => s + v, 0)
        prodData[`${p.k}_da`] = prodDiaria[`${p.k}_da`].reduce((s, v) => s + v, 0)
      })
    } else if (emp.tipo === 'Tortillero') {
      const sacosNormal = sacosArr.reduce((s, v, i) => s + (diasConDescuento[i] ? 0 : v), 0)
      const sacosDescuento = sacosArr.reduce((s, v, i) => s + (diasConDescuento[i] ? v : 0), 0)
      prodData = {
        sacosNormal,
        sacosDescuento,
        precioSaco: +precioSaco || tarifas.precioPorSaco,
        precioSacoDescuento: +precioSacoDescuento || undefined,
      }
    } else {
      prodData = { dias, sueldoDiario: +sueldoDiario || emp.sueldoDiario || tarifas.sueldoDiarioMostrador }
    }
    const produccion = buildProduccion(emp.tipo, prodData, tarifas)
    const produccionDiaria = emp.tipo === 'Panadero'
      ? { ...prodDiaria }
      : emp.tipo === 'Tortillero'
      ? { sacos: [...sacosArr], diasConDescuento: [...diasConDescuento], precioSacoDescuento: precioSacoDescuento || undefined }
      : null
    return { tipo: emp.tipo, produccion, bonos, extras, abonosPrestamo: +abonosPrestamo || 0, abonoCreditoTienda: +abonoCreditoTienda || 0, produccionDiaria }
  }, [emp, prodDiaria, sacosArr, diasConDescuento, precioSaco, precioSacoDescuento, dias, sueldoDiario, bonos, extras, abonosPrestamo, abonoCreditoTienda, tarifas])

  const calc = useMemo(() => nominaData ? calcNomina(nominaData) : null, [nominaData])

  if (!emp) return <div className="p-8 text-center text-ink-3">Empleado no encontrado</div>

  const save = () => {
    const nomina = {
      id: existente?.id,
      empleadoId: empId,
      empNombre: emp.nombre,
      semana: week,
      tipo: emp.tipo,
      ...nominaData,
      // Resumen calculado — nombres distintos a bonos/extras (arrays) para no pisar
      totalNeto: calc.neto,
      salarioBase: calc.base,
      abono: calc.abono,
      credito: calc.credito,
      ingresos: calc.ingresos,
      deducciones: calc.deducciones,
    }
    dispatch({ type: 'SAVE_NOMINA', payload: nomina })
    showToast('Nómina guardada')
  }

  const generarPDF = () => {
    if (!calc) return
    generarRecibo({ empNombre: emp.nombre, semana: week, tipo: emp.tipo, ...calc })
  }

  // Shared day-grid input styles
  const dayInput = (focusColor = 'focus:border-amber-400') =>
    `w-full text-center border border-line rounded-[8px] bg-surface-2 h-10 text-sm font-bold text-ink tabular-nums outline-none ${focusColor} transition-colors`

  return (
    <>
      <ScreenHeader title={emp.nombre} subtitle={weekLabel(week)} onBack={() => navigate(-1)}
        right={
          <button type="button" onClick={generarPDF} className="h-touch px-3 flex items-center gap-1.5 bg-surface border border-line rounded-card text-sm font-semibold text-ink-2">
            <PDFIcon className="w-4 h-4" /> PDF
          </button>
        }
      />
      <div className="p-4 pb-44 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Avatar emp={emp} size="lg" />
          <div>
            <div className="font-extrabold text-lg text-ink">{emp.nombre}</div>
            <TipoBadge tipo={emp.tipo} />
          </div>
        </div>

        {/* ── Producción ── */}
        <div>
          <SectionLabel>Producción semanal</SectionLabel>

          {/* PANADERO — cuadrícula 7 días por tipo de pan */}
          {emp.tipo === 'Panadero' && (
            <div className="flex flex-col gap-3">
              {PANES.map(p => {
                const tarifa = tarifas[p.k] || { delDia: 0, diaAnterior: 0 }
                const totDd = prodDiaria[`${p.k}_dd`].reduce((s, v) => s + v, 0)
                const totDa = prodDiaria[`${p.k}_da`].reduce((s, v) => s + v, 0)
                const subtotal = totDd * (tarifa.delDia || 0) + totDa * (tarifa.diaAnterior || 0)
                return (
                  <Card key={p.k} className="!p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="font-bold text-[14px] text-ink">{p.label}</span>
                      </div>
                      <span className="text-sm font-extrabold text-amber-600 tabular-nums">{money0(subtotal)}</span>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {PAYROLL_DAYS.map(d => (
                        <div key={d} className="text-center text-[9px] font-bold text-ink-3">{d}</div>
                      ))}
                    </div>

                    {/* Del día row */}
                    <div className="mb-1.5">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-semibold text-ink-2">Del día · {money(tarifa.delDia || 0)}/pza</span>
                        <span className="text-[11px] font-bold text-amber-600 tabular-nums">= {totDd} pzas</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {prodDiaria[`${p.k}_dd`].map((v, i) => (
                          <input key={i} inputMode="numeric" value={v || ''} placeholder="0"
                            onChange={e => updDia(`${p.k}_dd`, i, parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                            className={dayInput()} />
                        ))}
                      </div>
                    </div>

                    {/* Día anterior row */}
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-semibold text-ink-2">Día ant. · {money(tarifa.diaAnterior || 0)}/pza</span>
                        <span className="text-[11px] font-bold text-amber-600 tabular-nums">= {totDa} pzas</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {prodDiaria[`${p.k}_da`].map((v, i) => (
                          <input key={i} inputMode="numeric" value={v || ''} placeholder="0"
                            onChange={e => updDia(`${p.k}_da`, i, parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                            className={dayInput()} />
                        ))}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* TORTILLERO — cuadrícula 7 días para sacos */}
          {emp.tipo === 'Tortillero' && (() => {
            const pN = +precioSaco || tarifas.precioPorSaco
            const pD = +precioSacoDescuento || pN
            const sacosN = sacosArr.reduce((s, v, i) => s + (diasConDescuento[i] ? 0 : v), 0)
            const sacosD = sacosArr.reduce((s, v, i) => s + (diasConDescuento[i] ? v : 0), 0)
            const hayDescuento = diasConDescuento.some(Boolean)
            return (
              <div className="flex flex-col gap-3">
                <Card className="!p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-500 shrink-0" />
                      <span className="font-bold text-[14px] text-ink">Sacos producidos</span>
                    </div>
                    <span className="text-sm font-extrabold text-stone-700 tabular-nums">
                      = {+sacosArr.reduce((s, v) => s + v, 0).toFixed(2).replace(/\.?0+$/, '')} sacos
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {PAYROLL_DAYS.map(d => (
                      <div key={d} className="text-center text-[9px] font-bold text-ink-3">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {sacosArr.map((v, i) => (
                      <input key={i} inputMode="decimal" value={v === 0 ? '' : v} placeholder="0"
                        onChange={e => {
                          const raw = e.target.value.replace(/[^\d.]/g, '')
                          updSacos(i, parseFloat(raw) || 0)
                        }}
                        className={[
                          'w-full text-center border rounded-[8px] h-10 text-[13px] font-bold tabular-nums outline-none transition-colors',
                          diasConDescuento[i]
                            ? 'border-orange-300 bg-orange-50 text-orange-700 focus:border-orange-400'
                            : 'border-line bg-surface-2 text-ink focus:border-stone-400'
                        ].join(' ')} />
                    ))}
                  </div>
                  {/* Toggles de descuento por día */}
                  <div className="grid grid-cols-7 gap-1">
                    {diasConDescuento.map((on, i) => (
                      <button key={i} type="button" onClick={() => toggleDescuento(i)}
                        title="Marcar día con precio especial"
                        className={`h-6 rounded-[6px] text-[9px] font-bold border transition-colors ${
                          on
                            ? 'bg-orange-100 text-orange-600 border-orange-200'
                            : 'bg-surface-2 text-ink-3 border-line/50'
                        }`}>
                        {on ? '↓$' : '·'}
                      </button>
                    ))}
                  </div>

                  {/* Precio especial para días marcados */}
                  {hayDescuento && (
                    <div className="mt-2.5 p-2.5 bg-orange-50 rounded-[10px] border border-orange-100 flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold text-orange-700 leading-tight">Precio especial</div>
                        <div className="text-[10px] text-orange-500 mt-0.5">{sacosD.toFixed(1).replace(/\.0$/, '')} sacos marcados</div>
                      </div>
                      <div className="flex items-center h-9 border border-orange-200 rounded-[9px] bg-white px-2.5 w-24 overflow-hidden shrink-0">
                        <span className="text-orange-400 font-bold text-sm mr-1">$</span>
                        <input inputMode="decimal" value={precioSacoDescuento} placeholder="0"
                          onChange={e => setPrecioSacoDescuento(e.target.value.replace(/[^\d.]/g, ''))}
                          className="flex-1 min-w-0 bg-transparent border-none outline-none text-right font-bold text-sm text-orange-700 tabular-nums" />
                      </div>
                    </div>
                  )}
                </Card>

                <Card className="!p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[15px] text-ink">Precio por saco</div>
                      <div className="text-xs text-ink-3 mt-0.5">Precio normal</div>
                    </div>
                    <div className="flex items-center h-12 border border-line rounded-[11px] bg-surface-2 px-3 w-28 overflow-hidden">
                      <span className="text-ink-3 font-bold mr-1">$</span>
                      <input inputMode="decimal" value={precioSaco}
                        onChange={e => setPrecioSaco(e.target.value.replace(/[^\d.]/g, ''))}
                        className="flex-1 bg-transparent border-none outline-none text-right font-bold text-base text-ink tabular-nums" />
                    </div>
                  </div>
                </Card>

                {/* Resumen de producción */}
                <div className="flex flex-col gap-1 px-1.5">
                  {sacosN > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-ink-2 tabular-nums">
                        {+sacosN.toFixed(2).replace(/\.?0+$/, '')} sacos × {money(pN)}
                      </span>
                      <span className="font-extrabold text-stone-700 tabular-nums">{money(sacosN * pN)}</span>
                    </div>
                  )}
                  {sacosD > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-orange-600 tabular-nums">
                        {+sacosD.toFixed(2).replace(/\.?0+$/, '')} sacos × {money(pD)} (especial)
                      </span>
                      <span className="font-extrabold text-orange-600 tabular-nums">{money(sacosD * pD)}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })()}

          {/* MOSTRADOR */}
          {emp.tipo === 'Mostrador' && (
            <div className="flex flex-col gap-3">
              <Card className="!p-3.5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  <span className="font-bold text-[15px] text-ink">Días asistidos</span>
                  <span className="ml-auto text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">desde asistencia</span>
                </div>
                <div className="flex items-center gap-2 bg-surface border border-line rounded-field px-3.5 h-touch-lg focus-within:border-amber-500 transition-all">
                  <input inputMode="numeric" placeholder="0" value={dias === 0 ? '' : dias}
                    onChange={e => setDias(Math.min(7, parseInt(e.target.value.replace(/\D/g, '')) || 0))}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans text-2xl font-bold text-ink tabular-nums h-full" />
                  <span className="text-ink-3 text-sm font-semibold shrink-0">de 7 días</span>
                </div>
              </Card>
              <div className="flex justify-between text-sm px-1.5">
                <span className="font-semibold text-ink-2 tabular-nums">{dias} días × {money(+sueldoDiario || emp.sueldoDiario)}</span>
                <span className="font-extrabold text-green-700 tabular-nums">{money(dias * (+sueldoDiario || emp.sueldoDiario))}</span>
              </div>
            </div>
          )}
        </div>

        {/* Ingresos adicionales */}
        <div>
          <SectionLabel>Ingresos adicionales</SectionLabel>
          <div className="flex flex-col gap-2.5">
            <ItemList items={bonos} setItems={setBonos} label="Bonos" placeholder="Ej. Bono de puntualidad" />
            <ItemList items={extras} setItems={setExtras} label="Conceptos extra" placeholder="Ej. Hora extra" />
          </div>
        </div>

        {/* Descuentos */}
        <div>
          <SectionLabel>Descuentos</SectionLabel>
          <Card>
            <div className="flex items-center justify-between py-3 border-b border-line gap-3">
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-ink">Abono a préstamo</div>
                {saldoPrestamo > 0 && <div className="text-xs text-amber-600 font-semibold mt-0.5">Saldo: {money0(saldoPrestamo)}</div>}
              </div>
              <div className="flex items-center h-11 border border-line rounded-[11px] bg-surface-2 px-3 w-28 shrink-0 overflow-hidden">
                <span className="text-red-500 font-bold text-sm mr-0.5">−$</span>
                <input inputMode="decimal" placeholder="0" value={abonosPrestamo}
                  onChange={e => setAbonosPrestamo(e.target.value.replace(/[^\d.]/g, ''))}
                  className="flex-1 bg-transparent border-none outline-none text-right font-bold text-base text-ink tabular-nums" />
              </div>
            </div>
            <div className="flex items-center justify-between py-3 gap-3">
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-ink">Crédito de tienda</div>
                {saldoCredito > 0 && <div className="text-xs text-amber-600 font-semibold mt-0.5">Saldo: {money0(saldoCredito)}</div>}
              </div>
              <div className="flex items-center h-11 border border-line rounded-[11px] bg-surface-2 px-3 w-28 shrink-0 overflow-hidden">
                <span className="text-red-500 font-bold text-sm mr-0.5">−$</span>
                <input inputMode="decimal" placeholder="0" value={abonoCreditoTienda}
                  onChange={e => setAbonoCreditoTienda(e.target.value.replace(/[^\d.]/g, ''))}
                  className="flex-1 bg-transparent border-none outline-none text-right font-bold text-base text-ink tabular-nums" />
              </div>
            </div>
          </Card>
        </div>

        {/* Resumen */}
        {calc && (
          <div>
            <SectionLabel>Resumen</SectionLabel>
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
              {calc.bonos > 0 && <ResRow label="Bonos" val={calc.bonos} />}
              {calc.extras > 0 && <ResRow label="Conceptos extra" val={calc.extras} />}
              {calc.abono > 0 && <ResRow label="Abono a préstamo" val={calc.abono} neg />}
              {calc.credito > 0 && <ResRow label="Crédito de tienda" val={calc.credito} neg />}
              <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-line">
                <span className="text-base font-bold text-ink">Total neto</span>
                <span className="text-[28px] font-extrabold text-amber-600 tabular-nums">{money(calc.neto)}</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Barra fija inferior */}
      {calc && (
        <div className="fixed bottom-16 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-line px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-ink-3 font-semibold uppercase tracking-wide">Total neto</div>
            <div className="text-2xl font-extrabold text-ink tabular-nums">{money(calc.neto)}</div>
          </div>
          <button type="button" onClick={generarPDF} className="h-touch flex items-center gap-2 px-4 bg-surface border border-line rounded-card font-semibold text-sm text-ink-2">
            <PDFIcon className="w-4 h-4" /> PDF
          </button>
          <Button size="lg" icon={ReceiptIcon} onClick={save}>{existente ? 'Actualizar' : 'Guardar'}</Button>
        </div>
      )}

      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-36 z-[300] bg-ink text-surface text-sm font-semibold px-5 py-3 rounded-full shadow-xl whitespace-nowrap">
          {toast}
        </div>
      )}
    </>
  )
}

function ResRow({ label, val, neg }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className={`text-sm font-medium ${neg ? 'text-red-600' : 'text-ink-2'}`}>{label}</span>
      <span className={`text-sm font-bold tabular-nums ${neg ? 'text-red-600' : 'text-ink'}`}>
        {neg ? '−' : ''}{money(Math.abs(val))}
      </span>
    </div>
  )
}
