import { useState, useEffect } from 'react'
import { ScreenHeader } from '../components/Layout'
import { Button, Card, SectionLabel } from '../components/ui'
import { useStore, useTarifas } from '../store/context'
import { PANES } from '../utils/calc'

function PriceRow({ label, value, onChange, dotColor }) {
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-line last:border-0">
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
      <div className="flex-1 text-[15px] font-semibold text-ink">{label}</div>
      <div className="flex items-center gap-1 bg-surface-2 border border-line rounded-[11px] h-11 w-28 px-3">
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
    const clean = {}
    Object.entries(t).forEach(([k, v]) => { clean[k] = +v || 0 })
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
            {PANES.map(p => (
              <PriceRow key={p.k} label={p.label} dotColor="bg-amber-500" value={t[p.k] ?? ''} onChange={v => upd(p.k, v)} />
            ))}
          </Card>
        </div>

        <div>
          <SectionLabel>Tortilleros</SectionLabel>
          <Card>
            <PriceRow label="Precio base por saco" dotColor="bg-brown-500" value={t.precioPorSaco ?? ''} onChange={v => upd('precioPorSaco', v)} />
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
