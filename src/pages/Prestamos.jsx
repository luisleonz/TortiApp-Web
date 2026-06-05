import { useState } from 'react'
import { ScreenHeader } from '../components/Layout'
import { Card, SectionLabel, Button, Sheet, Avatar, PlusIcon, MinusIcon, CoinsIcon, ChevRIcon } from '../components/ui'
import { useStore, useEmpleados } from '../store/context'
import { money0 } from '../utils/format'

export default function Prestamos() {
  const { state, dispatch } = useStore()
  const empleados = useEmpleados()
  const [selectedEmpId, setSelectedEmpId] = useState(null)
  const [moviForm, setMoviForm] = useState(null)

  const totalPrestamos = state.prestamos.reduce((s, p) => s + (p.saldoPendiente || 0), 0)
  const totalCredito = state.creditoTienda.reduce((s, c) => s + (c.saldoPendiente || 0), 0)

  const getBalance = (empId) => ({
    prestamo: state.prestamos.find(p => p.empleadoId === empId)?.saldoPendiente || 0,
    credito: state.creditoTienda.find(c => c.empleadoId === empId)?.saldoPendiente || 0,
  })

  const activeEmps = empleados.filter(e => e.activo)
  const withBalance = activeEmps.filter(e => {
    const b = getBalance(e.id)
    return b.prestamo > 0 || b.credito > 0
  })
  const withoutBalance = activeEmps.filter(e => {
    const b = getBalance(e.id)
    return b.prestamo === 0 && b.credito === 0
  })

  return (
    <>
      <ScreenHeader title="Préstamos" large
        right={
          <button type="button" onClick={() => setMoviForm({ tipo: 'prestamo' })}
            className="h-touch px-3 flex items-center gap-1.5 bg-amber-500 rounded-card text-amber-50 text-sm font-bold">
            <PlusIcon className="w-4 h-4" /> Registrar
          </button>
        }
      />
      <div className="p-4 pb-8 flex flex-col gap-5">

        {/* Summary card */}
        <Card className="!p-0 overflow-hidden">
          <div className="p-4 bg-ink text-white">
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wide">Total adeudos</div>
            <div className="text-2xl font-extrabold mt-1 tabular-nums">{money0(totalPrestamos + totalCredito)}</div>
            <div className="text-xs text-white/50 mt-0.5">{money0(totalPrestamos)} préstamos · {money0(totalCredito)} crédito tienda</div>
          </div>
        </Card>

        {/* Employees with balance */}
        {withBalance.length > 0 && (
          <div>
            <SectionLabel>Con adeudos</SectionLabel>
            <Card className="!p-0">
              {withBalance.map((e, i) => {
                const { prestamo, credito } = getBalance(e.id)
                return (
                  <button key={e.id} type="button" onClick={() => setSelectedEmpId(e.id)}
                    className={`w-full flex items-center gap-3 p-3.5 text-left ${i > 0 ? 'border-t border-line' : ''}`}>
                    <Avatar emp={e} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-bold text-ink truncate">{e.nombre}</div>
                      <div className="text-xs text-ink-3">
                        {prestamo > 0 && <span>Préstamo: {money0(prestamo)}</span>}
                        {prestamo > 0 && credito > 0 && ' · '}
                        {credito > 0 && <span>Tienda: {money0(credito)}</span>}
                      </div>
                    </div>
                    <ChevRIcon className="w-4 h-4 text-ink-3/50 shrink-0" />
                  </button>
                )
              })}
            </Card>
          </div>
        )}

        {withBalance.length === 0 && (
          <Card className="text-center py-6">
            <CoinsIcon className="w-8 h-8 text-ink-3/40 mx-auto mb-2" />
            <div className="text-sm font-semibold text-ink-3">Sin adeudos activos</div>
          </Card>
        )}

        {/* Employees without balance */}
        {withoutBalance.length > 0 && (
          <div>
            <SectionLabel>Sin adeudos</SectionLabel>
            <Card className="!p-0">
              {withoutBalance.map((e, i) => (
                <button key={e.id} type="button" onClick={() => setSelectedEmpId(e.id)}
                  className={`w-full flex items-center gap-3 p-3.5 text-left ${i > 0 ? 'border-t border-line' : ''}`}>
                  <Avatar emp={e} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-ink truncate">{e.nombre}</div>
                    <div className="text-xs text-green-600 font-semibold">Sin adeudos</div>
                  </div>
                  <PlusIcon className="w-4 h-4 text-ink-3/40 shrink-0" />
                </button>
              ))}
            </Card>
          </div>
        )}
      </div>

      {selectedEmpId && (
        <PrestamoDetail
          empId={selectedEmpId}
          onClose={() => setSelectedEmpId(null)}
          onRegister={(tipo) => { setMoviForm({ tipo, empId: selectedEmpId }); setSelectedEmpId(null) }}
        />
      )}

      {moviForm && (
        <MovimientoForm
          form={moviForm}
          onClose={() => setMoviForm(null)}
          empleados={activeEmps}
        />
      )}
    </>
  )
}

function PrestamoDetail({ empId, onClose, onRegister }) {
  const { state, dispatch } = useStore()
  const emp = state.empleados.find(e => e.id === empId)
  const saldoPrestamo = state.prestamos.find(p => p.empleadoId === empId)?.saldoPendiente || 0
  const saldoCredito = state.creditoTienda.find(c => c.empleadoId === empId)?.saldoPendiente || 0

  return (
    <Sheet open={!!empId} onClose={onClose} title={emp?.nombre} full>
      {emp && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar emp={emp} size="lg" />
            <div>
              <div className="text-lg font-extrabold text-ink">{emp.nombre}</div>
              <div className="text-sm text-ink-3">{emp.tipo}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 border border-amber-200 rounded-card p-4">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wide">Préstamo</div>
              <div className="text-2xl font-extrabold text-amber-700 mt-1 tabular-nums">{money0(saldoPrestamo)}</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-card p-4">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wide">Crédito tienda</div>
              <div className="text-2xl font-extrabold text-amber-700 mt-1 tabular-nums">{money0(saldoCredito)}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button full variant="soft" icon={PlusIcon} onClick={() => onRegister('prestamo')}>Agregar préstamo</Button>
            <Button full variant="outline" icon={MinusIcon} onClick={() => onRegister('credito')}>Agregar crédito</Button>
          </div>

          <div className="flex flex-col gap-2">
            <EditSaldo label="Ajustar saldo préstamo" value={saldoPrestamo}
              onSave={v => dispatch({ type: 'SET_PRESTAMO', payload: { empleadoId: empId, saldoPendiente: v } })} />
            <EditSaldo label="Ajustar saldo crédito tienda" value={saldoCredito}
              onSave={v => dispatch({ type: 'SET_CREDITO', payload: { empleadoId: empId, saldoPendiente: v } })} />
          </div>
        </div>
      )}
    </Sheet>
  )
}

function EditSaldo({ label, value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState('')
  if (!editing) return (
    <button type="button" onClick={() => { setVal(String(value)); setEditing(true) }}
      className="text-sm font-semibold text-amber-600 text-left px-1">
      {label}: {money0(value)} (editar)
    </button>
  )
  return (
    <div className="flex gap-2 items-center">
      <div className="flex items-center flex-1 h-touch border border-amber-500 rounded-field px-3 bg-surface">
        <span className="text-ink-3 font-bold mr-1">$</span>
        <input autoFocus inputMode="decimal" value={val} onChange={e => setVal(e.target.value.replace(/[^\d.]/g, ''))}
          className="flex-1 bg-transparent border-none outline-none font-bold text-base text-ink tabular-nums" />
      </div>
      <Button size="sm" onClick={() => { onSave(+val || 0); setEditing(false) }}>OK</Button>
      <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>✕</Button>
    </div>
  )
}

function MovimientoForm({ form, onClose, empleados }) {
  const { dispatch } = useStore()
  const [empId, setEmpId] = useState(form.empId || '')
  const [tipo, setTipo] = useState(form.tipo || 'prestamo')
  const [monto, setMonto] = useState('')
  const [toast, setToast] = useState('')

  const save = () => {
    if (!empId) { setToast('Elige un empleado'); return }
    if (!(+monto > 0)) { setToast('Monto inválido'); return }
    if (tipo === 'prestamo') dispatch({ type: 'ADD_PRESTAMO', payload: { empleadoId: empId, monto: +monto } })
    else dispatch({ type: 'ADD_CREDITO', payload: { empleadoId: empId, monto: +monto } })
    setToast(tipo === 'prestamo' ? 'Préstamo registrado' : 'Crédito registrado')
    setTimeout(onClose, 700)
  }

  return (
    <Sheet open={true} onClose={onClose} title={tipo === 'prestamo' ? 'Registrar préstamo' : 'Registrar crédito'} full>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          {['prestamo', 'credito'].map(t => (
            <button key={t} type="button" onClick={() => setTipo(t)}
              className={`flex-1 h-touch rounded-card font-semibold text-sm transition-all
                ${tipo === t ? 'bg-amber-500 text-amber-50' : 'bg-surface border border-line text-ink-2'}`}>
              {t === 'prestamo' ? 'Préstamo' : 'Crédito tienda'}
            </button>
          ))}
        </div>

        {!form.empId && (
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-ink-2 pl-0.5">Empleado</div>
            {empleados.map(e => (
              <button key={e.id} type="button" onClick={() => setEmpId(e.id)}
                className={`flex items-center gap-3 p-3 rounded-card border text-left transition-all
                  ${e.id === empId ? 'bg-amber-50 border-amber-300' : 'bg-surface border-line'}`}>
                <Avatar emp={e} size="sm" />
                <span className="font-semibold text-ink">{e.nombre}</span>
              </button>
            ))}
          </div>
        )}

        <div>
          <div className="text-sm font-semibold text-ink-2 mb-1.5 pl-0.5">Monto</div>
          <div className="flex items-center h-touch-lg border border-line rounded-field px-4 bg-surface">
            <span className="text-ink-3 font-bold mr-2">$</span>
            <input autoFocus inputMode="decimal" placeholder="0.00" value={monto}
              onChange={e => setMonto(e.target.value.replace(/[^\d.]/g, ''))}
              className="flex-1 bg-transparent border-none outline-none font-bold text-xl text-ink tabular-nums" />
          </div>
        </div>

        {toast && <p className="text-sm text-center font-semibold text-amber-600">{toast}</p>}
        <Button size="lg" full onClick={save}>Registrar</Button>
      </div>
    </Sheet>
  )
}
