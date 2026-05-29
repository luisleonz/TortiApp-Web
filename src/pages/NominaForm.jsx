import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ScreenHeader } from '../components/Layout'
import {
  Button, Card, SectionLabel, Avatar, TipoBadge, NumField,
  PlusIcon, XIcon, ReceiptIcon, PDFIcon
} from '../components/ui'
import { useStore, useEmpleado, useTarifas, useNomina, usePrestamo, useCredito, useAsistencia } from '../store/context'
import { calcNomina, buildProduccion, PANES } from '../utils/calc'
import { weekId, weekLabel, weekLong } from '../utils/dates'
import { money, money0 } from '../utils/format'
import { generarRecibo } from '../utils/pdf'

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

  // Producción state
  const [panDulce, setPanDulce] = useState(0)
  const [panBlanco, setPanBlanco] = useState(0)
  const [panAjonjoli, setPanAjonjoli] = useState(0)
  const [galletas, setGalletas] = useState(0)
  const [sacos, setSacos] = useState(0)
  const [precioSaco, setPrecioSaco] = useState('')
  const [dias, setDias] = useState(0)
  const [sueldoDiario, setSueldoDiario] = useState('')

  // Ajustes state
  const [bonos, setBonos] = useState([])
  const [extras, setExtras] = useState([])
  const [abonosPrestamo, setAbonosPrestamo] = useState('')
  const [abonoCreditoTienda, setAbonoCreditoTienda] = useState('')

  const [toast, setToast] = useState('')

  const showToast = m => { setToast(m); setTimeout(() => setToast(''), 2500) }

  // Cargar datos existentes o defaults
  useEffect(() => {
    if (!emp) return
    if (existente) {
      // Rellenar desde nómina guardada
      const prod = existente.produccion || []
      if (emp.tipo === 'Panadero') {
        setPanDulce(prod.find(p => p.tipo === 'panDulce')?.cantidad || 0)
        setPanBlanco(prod.find(p => p.tipo === 'panBlanco')?.cantidad || 0)
        setPanAjonjoli(prod.find(p => p.tipo === 'panAjonjoli')?.cantidad || 0)
        setGalletas(prod.find(p => p.tipo === 'galletas')?.cantidad || 0)
      } else if (emp.tipo === 'Tortillero') {
        setSacos(prod[0]?.cantidad || 0)
        setPrecioSaco(String(prod[0]?.precioUnitario || tarifas.precioPorSaco))
      } else {
        setDias(prod[0]?.cantidad || 0)
        setSueldoDiario(String(prod[0]?.precioUnitario || emp.sueldoDiario || tarifas.sueldoDiarioMostrador))
      }
      setBonos(existente.bonos || [])
      setExtras(existente.extras || [])
      setAbonosPrestamo(String(existente.abonosPrestamo || ''))
      setAbonoCreditoTienda(String(existente.abonoCreditoTienda || ''))
    } else {
      // Defaults frescos — resetear todos los campos
      setPanDulce(0); setPanBlanco(0); setPanAjonjoli(0); setGalletas(0)
      setSacos(0); setBonos([]); setExtras([])
      setAbonosPrestamo(''); setAbonoCreditoTienda('')
      if (emp.tipo === 'Tortillero') setPrecioSaco(String(tarifas.precioPorSaco))
      else if (emp.tipo === 'Mostrador') {
        setSueldoDiario(String(emp.sueldoDiario || tarifas.sueldoDiarioMostrador))
        // Auto-cargar días de asistencia registrados
        setDias(asistenciaDias.filter(Boolean).length)
      }
    }
  }, [emp?.id, week])

  // Construir objeto nómina para calcular
  const nominaData = useMemo(() => {
    if (!emp) return null
    const produccion = buildProduccion(emp.tipo,
      { panDulce, panBlanco, panAjonjoli, galletas, sacos, precioSaco: +precioSaco || tarifas.precioPorSaco, dias, sueldoDiario: +sueldoDiario || emp.sueldoDiario || tarifas.sueldoDiarioMostrador },
      tarifas
    )
    return { tipo: emp.tipo, produccion, bonos, extras, abonosPrestamo: +abonosPrestamo || 0, abonoCreditoTienda: +abonoCreditoTienda || 0 }
  }, [emp, panDulce, panBlanco, panAjonjoli, galletas, sacos, precioSaco, dias, sueldoDiario, bonos, extras, abonosPrestamo, abonoCreditoTienda, tarifas])

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
      ...calc,
      totalNeto: calc.neto,
      salarioBase: calc.base,
    }
    dispatch({ type: 'SAVE_NOMINA', payload: nomina })
    showToast('Nómina guardada')
  }

  const generarPDF = () => {
    if (!calc) return
    generarRecibo({ empNombre: emp.nombre, semana: week, tipo: emp.tipo, ...calc })
  }

  // Helpers para bonos/extras
  const addItem = (setter) => setter(prev => [...prev, { desc: '', monto: '' }])
  const updItem = (setter, i, field, val) => setter(prev => prev.map((it, j) => j === i ? { ...it, [field]: val } : it))
  const delItem = (setter, i) => setter(prev => prev.filter((_, j) => j !== i))

  const ItemList = ({ items, setItems, label, placeholder }) => (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[15px] font-bold text-ink">{label}</span>
        <button type="button" onClick={() => addItem(setItems)} className="text-sm font-bold text-amber-600 flex items-center gap-1">
          <PlusIcon className="w-4 h-4" /> Agregar
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <input placeholder={placeholder} value={it.desc}
              onChange={e => updItem(setItems, i, 'desc', e.target.value)}
              className="flex-1 h-11 border border-line rounded-field bg-surface-2 px-3 text-[15px] text-ink font-sans outline-none focus:border-amber-500 transition-colors" />
            <div className="flex items-center h-11 border border-line rounded-field bg-surface-2 px-3 w-28 shrink-0">
              <span className="text-ink-3 font-bold text-sm mr-1">$</span>
              <input inputMode="decimal" placeholder="0" value={it.monto}
                onChange={e => updItem(setItems, i, 'monto', e.target.value.replace(/[^\d.]/g, ''))}
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-right font-bold text-[15px] text-ink tabular-nums" />
            </div>
            <button type="button" onClick={() => delItem(setItems, i)} className="w-9 h-9 flex items-center justify-center rounded-card text-ink-3">
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  )

  return (
    <>
      <ScreenHeader title={emp.nombre} subtitle={weekLabel(week)} onBack={() => navigate(-1)}
        right={
          <button type="button" onClick={generarPDF} className="h-touch px-3 flex items-center gap-1.5 bg-surface border border-line rounded-card text-sm font-semibold text-ink-2">
            <PDFIcon className="w-4 h-4" /> PDF
          </button>
        }
      />
      <div className="p-4 pb-28 flex flex-col gap-5">
        {/* Empleado info */}
        <div className="flex items-center gap-3">
          <Avatar emp={emp} size="lg" />
          <div>
            <div className="font-extrabold text-lg text-ink">{emp.nombre}</div>
            <TipoBadge tipo={emp.tipo} />
          </div>
        </div>

        {/* Producción */}
        <div>
          <SectionLabel>Producción</SectionLabel>
          {emp.tipo === 'Panadero' && (
            <div className="flex flex-col gap-3">
              {[
                { k: 'panDulce', label: 'Pan dulce', val: panDulce, set: setPanDulce },
                { k: 'panBlanco', label: 'Pan blanco', val: panBlanco, set: setPanBlanco },
                { k: 'panAjonjoli', label: 'Ajonjolí', val: panAjonjoli, set: setPanAjonjoli },
                { k: 'galletas', label: 'Galletas', val: galletas, set: setGalletas },
              ].map(p => (
                <Card key={p.k} className="!p-3.5">
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="font-bold text-[15px] text-ink">{p.label}</span>
                    </div>
                    <span className="text-sm text-ink-3 font-semibold tabular-nums">
                      {money(tarifas[p.k])} c/u → <b className="text-amber-600">{money0(p.val * tarifas[p.k])}</b>
                    </span>
                  </div>
                  <NumField value={p.val} onChange={p.set} suffix="piezas" />
                </Card>
              ))}
            </div>
          )}

          {emp.tipo === 'Tortillero' && (
            <div className="flex flex-col gap-3">
              <Card className="!p-3.5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-brown-500 shrink-0" />
                  <span className="font-bold text-[15px] text-ink">Sacos producidos</span>
                  <span className="ml-auto text-xs text-ink-3 font-semibold">esta semana</span>
                </div>
                <NumField value={sacos} onChange={setSacos} suffix="sacos" />
              </Card>
              <Card className="!p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[15px] text-ink">Precio por saco</div>
                    <div className="text-xs text-ink-3 mt-0.5">Solo para esta nómina</div>
                  </div>
                  <div className="flex items-center h-12 border border-line rounded-[11px] bg-surface-2 px-3 w-28">
                    <span className="text-ink-3 font-bold mr-1">$</span>
                    <input inputMode="decimal" value={precioSaco}
                      onChange={e => setPrecioSaco(e.target.value.replace(/[^\d.]/g, ''))}
                      className="flex-1 bg-transparent border-none outline-none text-right font-bold text-base text-ink tabular-nums" />
                  </div>
                </div>
              </Card>
              <div className="flex justify-between text-sm px-1.5">
                <span className="font-semibold text-ink-2 tabular-nums">{sacos} sacos × {money(+precioSaco || tarifas.precioPorSaco)}</span>
                <span className="font-extrabold text-brown-600 tabular-nums">{money(sacos * (+precioSaco || tarifas.precioPorSaco))}</span>
              </div>
            </div>
          )}

          {emp.tipo === 'Mostrador' && (
            <div className="flex flex-col gap-3">
              <Card className="!p-3.5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  <span className="font-bold text-[15px] text-ink">Días asistidos</span>
                  <span className="ml-auto text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">desde asistencia</span>
                </div>
                <NumField value={dias} onChange={v => setDias(Math.min(7, v))} max={7} suffix="de 7 días" />
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
              <div className="flex items-center h-11 border border-line rounded-[11px] bg-surface-2 px-3 w-28 shrink-0">
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
              <div className="flex items-center h-11 border border-line rounded-[11px] bg-surface-2 px-3 w-28 shrink-0">
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
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md border-t border-line px-4 py-3 flex items-center gap-3">
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
        <div className="absolute left-1/2 -translate-x-1/2 bottom-28 z-[300] bg-ink text-surface text-sm font-semibold px-5 py-3 rounded-full shadow-xl whitespace-nowrap">
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
