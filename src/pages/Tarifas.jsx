import { useState, useEffect } from 'react'
import { ScreenHeader } from '../components/Layout'
import { Button, Card, SectionLabel } from '../components/ui'
import { useStore, useTarifas } from '../store/context'
import { PANES, tarifaRate } from '../utils/calc'
import { money } from '../utils/format'

// Fila con precio de venta + porcentaje para un tier de pan (del día / día anterior)
function BreadTier({ label, dot, tier, onChange }) {
  const pv  = tier?.precioVenta  ?? ''
  const pct = tier?.porcentaje   ?? ''
  const rate = tarifaRate(tier)
  return (
    <div className="py-2.5 border-b border-line last:border-0">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
        <span className="text-[11px] font-bold text-ink-2 uppercase tracking-wide">{label}</span>
        {+pv > 0 && +pct > 0 && (
          <span className="ml-auto text-[11px] font-bold text-amber-600 tabular-nums">
            = {money(rate)}/pza
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <div className="text-[10px] font-semibold text-ink-3 mb-1">Precio de venta</div>
          <div className="flex items-center h-10 border border-line rounded-field bg-surface-2 px-2.5 overflow-hidden">
            <span className="text-ink-3 font-bold text-sm mr-1">$</span>
            <input inputMode="decimal" placeholder="0" value={pv}
              onChange={e => onChange({ ...tier, precioVenta: e.target.value.replace(/[^\d.]/g, '') })}
              className="flex-1 bg-transparent border-none outline-none text-right font-bold text-[15px] text-ink tabular-nums" />
          </div>
        </div>
        <div className="w-24 shrink-0">
          <div className="text-[10px] font-semibold text-ink-3 mb-1">% al panadero</div>
          <div className="flex items-center h-10 border border-line rounded-field bg-surface-2 px-2.5 overflow-hidden">
            <input inputMode="decimal" placeholder="0" value={pct}
              onChange={e => onChange({ ...tier, porcentaje: e.target.value.replace(/[^\d.]/g, '') })}
              className="flex-1 bg-transparent border-none outline-none text-right font-bold text-[15px] text-ink tabular-nums" />
            <span className="text-ink-3 font-bold text-sm ml-1">%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PriceRow({ label, value, onChange, dotColor }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-line last:border-0">
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
      <div className="flex-1 text-[14px] font-semibold text-ink-2">{label}</div>
      <div className="flex items-center gap-1 bg-surface-2 border border-line rounded-[11px] h-10 w-28 px-3 overflow-hidden">
        <span className="text-ink-3 font-bold text-sm">$</span>
        <input inputMode="decimal" value={value}
          onChange={e => onChange(e.target.value.replace(/[^\d.]/g, ''))}
          className="w-full bg-transparent border-none outline-none text-right font-bold text-base text-ink tabular-nums" />
      </div>
    </div>
  )
}

export default function Tarifas({ embedded = false }) {
  const { dispatch } = useStore()
  const tarifas = useTarifas()
  const [t, setT] = useState(tarifas)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setT({ ...tarifas }) }, [tarifas])

  const upd = (k, v) => setT(p => ({ ...p, [k]: v }))

  const emptyTier = { precioVenta: '', porcentaje: '' }
  const getTier = (tarifa, side) => {
    const tier = tarifa?.[side]
    if (!tier || typeof tier !== 'object') return emptyTier
    return tier
  }

  const save = () => {
    const clean = { ...t }
    PANES.forEach(p => {
      const val = t[p.k] || {}
      clean[p.k] = {
        delDia:      { precioVenta: +(val.delDia?.precioVenta || 0),      porcentaje: +(val.delDia?.porcentaje || 0) },
        diaAnterior: { precioVenta: +(val.diaAnterior?.precioVenta || 0), porcentaje: +(val.diaAnterior?.porcentaje || 0) },
      }
    })
    clean.precioPorSaco = +t.precioPorSaco || 0
    clean.sueldoDiarioMostrador = +t.sueldoDiarioMostrador || 0
    dispatch({ type: 'SET_TARIFAS', payload: clean })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      {!embedded && <ScreenHeader title="Tarifas y precios" large />}
      <div className={`${embedded ? '' : 'p-4 pb-8'} flex flex-col gap-5`}>
        <p className="text-sm text-ink-3 leading-relaxed">
          Estos precios se usan al calcular la nómina. Solo afectan nóminas futuras, no las ya guardadas.
        </p>

        <div>
          <SectionLabel>Pan — precio por pieza (Panaderos)</SectionLabel>
          <Card>
            {PANES.map((p, i) => {
              const tarifa = t[p.k] || {}
              return (
                <div key={p.k} className={i > 0 ? 'border-t border-line mt-1 pt-1' : ''}>
                  <div className="flex items-center gap-2 pt-2.5 pb-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-[14px] font-bold text-ink">{p.label}</span>
                  </div>
                  <BreadTier label="Del día" dot="bg-amber-400"
                    tier={getTier(tarifa, 'delDia')}
                    onChange={tier => upd(p.k, { ...tarifa, delDia: tier })} />
                  <BreadTier label="Día anterior" dot="bg-amber-200"
                    tier={getTier(tarifa, 'diaAnterior')}
                    onChange={tier => upd(p.k, { ...tarifa, diaAnterior: tier })} />
                </div>
              )
            })}
          </Card>
        </div>

        <div>
          <SectionLabel>Tortilleros</SectionLabel>
          <Card>
            <PriceRow label="Precio base por saco" dotColor="bg-stone-500" value={t.precioPorSaco ?? ''} onChange={v => upd('precioPorSaco', v)} />
          </Card>
        </div>

        <div>
          <SectionLabel>Mostrador</SectionLabel>
          <Card>
            <PriceRow label="Sueldo diario predeterminado" dotColor="bg-green-500" value={t.sueldoDiarioMostrador ?? ''} onChange={v => upd('sueldoDiarioMostrador', v)} />
          </Card>
        </div>

        <Button size="lg" full onClick={save}>
          {saved ? '✓ Tarifas guardadas' : 'Guardar tarifas'}
        </Button>
      </div>
    </>
  )
}
