import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../components/Layout'
import { Card, SectionLabel, Button, Sheet, CoinsIcon, ChevRIcon } from '../components/ui'
import { useStore } from '../store/context'
import { auth, resetState } from '../utils/storage'
import { money0 } from '../utils/format'
import Tarifas from './Tarifas'

export default function Config() {
  const navigate = useNavigate()
  const { dispatch, state } = useStore()
  const [showTarifas, setShowTarifas] = useState(false)

  const logout = () => { auth.set(false); navigate('/login', { replace: true }) }

  const handleReset = () => {
    if (window.confirm('¿Reiniciar todos los datos? Esta acción no se puede deshacer.')) {
      const fresh = resetState()
      dispatch({ type: 'RESET', payload: fresh })
    }
  }

  const totalPrestamos = state.prestamos.reduce((s, p) => s + (p.saldoPendiente || 0), 0)
  const totalCredito = state.creditoTienda.reduce((s, c) => s + (c.saldoPendiente || 0), 0)

  return (
    <>
      <ScreenHeader title="Configuración" large />
      <div className="p-4 pb-8 flex flex-col gap-5">

        {/* Tarifas */}
        <div>
          <SectionLabel>Precios</SectionLabel>
          <Card onClick={() => setShowTarifas(true)} className="flex items-center gap-3">
            <div className="w-touch h-touch rounded-card bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 3H5a2 2 0 0 0-2 2v6l9.5 9.5a1.5 1.5 0 0 0 2.1 0l5.9-5.9a1.5 1.5 0 0 0 0-2.1L11 3ZM7.5 8.5h0" /></svg>
            </div>
            <div className="flex-1">
              <div className="font-bold text-ink">Tarifas y precios</div>
              <div className="text-sm text-ink-3">Pan, sacos y sueldo diario</div>
            </div>
            <ChevRIcon className="w-5 h-5 text-ink-3/50" />
          </Card>
        </div>

        {/* Préstamos */}
        <div>
          <SectionLabel>Préstamos y crédito</SectionLabel>
          <Card onClick={() => navigate('/prestamos')} className="flex items-center gap-3">
            <div className="w-touch h-touch rounded-card bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <CoinsIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-ink">Préstamos y crédito tienda</div>
              <div className="text-sm text-ink-3">{money0(totalPrestamos + totalCredito)} en adeudos activos</div>
            </div>
            <ChevRIcon className="w-5 h-5 text-ink-3/50" />
          </Card>
        </div>

        {/* Sesión */}
        <div>
          <SectionLabel>Sesión</SectionLabel>
          <Card className="flex flex-col gap-3">
            <Button variant="outline" full onClick={logout}>Cerrar sesión</Button>
            <Button variant="danger" full onClick={handleReset}>Reiniciar datos de demo</Button>
          </Card>
        </div>

        <p className="text-center text-xs text-ink-3">TortiApp v0.1 · Tortillería y Panadería León</p>
      </div>

      <Sheet open={showTarifas} onClose={() => setShowTarifas(false)} title="Tarifas" full>
        <Tarifas embedded />
      </Sheet>
    </>
  )
}
