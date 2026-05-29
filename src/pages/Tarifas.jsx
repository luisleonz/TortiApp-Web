import { useState, useEffect } from 'react'
import { ScreenHeader } from '../components/Layout'
import { Button, Card, SectionLabel } from '../components/ui'
import { useStore, useTarifas } from '../store/context'
import { PANES } from '../utils/calc'

function PriceRow({ label, value, onChange, dotColor }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-line last:border-0">
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
      <div className="flex-1 text-[14px] font-semibold text-ink-2">{label}</div>
      <div className="flex items-center gap-1 bg-surface-2 border border-line rounded-[11px] h-10 w-28 px-3">
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

  const save = () => {
    const clean = { ...t }
    PANES.forEach(p => {
      const val = t[p.k]
      if (val && typeof val === 'object') {
        clean[p.k] = { delDia: +val.delDia || 0, diaAnterior: +val.diaAnterior || 0 }
      } else {
        clean[p.k] = { delDia: +val || 0, diaAnterior: +val || 0 }
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
              const tarifa = t[p.k] || { delDia: '', diaAnterior: '' }
              return (
                <div key={p.k} className={i > 0 ? 'border-t border-line mt-1 pt-1' : ''}>
                  <div className="flex items-center gap-2 pt-2.5 pb-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-[14px] font-bold text-ink">{p.label}</span>
                  </div>
                  <PriceRow label="Del día" dotColor="bg-amber-400"
                    value={typeof tarifa === 'object' ? (tarifa.delDia ?? '') : (tarifa ?? '')}
                    onChange={v => upd(p.k, { ...(typeof tarifa === 'object' ? tarifa : { delDia: tarifa, diaAnterior: tarifa }), delDia: v })} />
                  <PriceRow label="Día anterior" dotColor="bg-amber-200"
                    value={typeof tarifa === 'object' ? (tarifa.diaAnterior ?? '') : (tarifa ?? '')}
                    onChange={v => upd(p.k, { ...(typeof tarifa === 'object' ? tarifa : { delDia: tarifa, diaAnterior: tarifa }), diaAnterior: v })} />
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
