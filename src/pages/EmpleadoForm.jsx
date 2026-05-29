import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ScreenHeader } from '../components/Layout'
import { Button, Field, Segmented, Avatar, TrashIcon, UserIcon } from '../components/ui'
import { useStore, useEmpleado } from '../store/context'
import { TIPOS } from '../utils/calc'

const EMPTY = { nombre: '', tipo: 'Panadero', sueldoDiario: '', fechaIngreso: '', nss: '', direccion: '', telefono: '', fotoUrl: null, activo: true }

export default function EmpleadoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dispatch } = useStore()
  const existing = useEmpleado(id)
  const isNew = !id || id === 'nuevo'
  const [f, setF] = useState(EMPTY)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!isNew && existing) setF({ ...EMPTY, ...existing, sueldoDiario: String(existing.sueldoDiario || '') })
  }, [existing, isNew])

  const upd = (k, v) => setF(p => ({ ...p, [k]: v }))
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2200) }

  const save = () => {
    if (!f.nombre.trim()) { showToast('El nombre es obligatorio'); return }
    dispatch({ type: 'UPSERT_EMPLEADO', payload: { ...f, id: isNew ? undefined : id, sueldoDiario: +f.sueldoDiario || 0 } })
    showToast(isNew ? 'Empleado agregado' : 'Cambios guardados')
    setTimeout(() => navigate(-1), 700)
  }

  const del = () => {
    dispatch({ type: 'DELETE_EMPLEADO', payload: { id } })
    navigate('/empleados', { replace: true })
  }

  return (
    <>
      <ScreenHeader title={isNew ? 'Nuevo empleado' : 'Editar empleado'} onBack={() => navigate(-1)} />
      <div className="p-4 pb-8 flex flex-col gap-4">
        {/* Avatar / foto placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-2 border-2 border-dashed border-line flex items-center justify-center text-ink-3 shrink-0">
            {f.nombre ? <Avatar emp={f} size="lg" /> : <UserIcon className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-sm font-semibold text-amber-600">Agregar foto</div>
            <div className="text-xs text-ink-3">Opcional</div>
          </div>
        </div>

        <Field label="Nombre completo *" placeholder="Ej. Ramiro García" value={f.nombre}
          onChange={e => upd('nombre', e.target.value)} autoFocus={isNew} />

        <div>
          <div className="text-sm font-semibold text-ink-2 mb-1.5 pl-0.5">Tipo de empleado</div>
          <Segmented full value={f.tipo} onChange={v => upd('tipo', v)} options={TIPOS} />
        </div>

        {f.tipo === 'Mostrador' && (
          <Field label="Sueldo diario" prefix="$" inputMode="decimal" suffix="MXN"
            value={f.sueldoDiario} onChange={e => upd('sueldoDiario', e.target.value.replace(/[^\d.]/g, ''))}
            placeholder="0.00" />
        )}

        <div className="h-px bg-line my-1" />
        <div className="text-xs font-bold text-ink-3 uppercase tracking-wider pl-0.5">Datos opcionales</div>

        <Field label="Fecha de ingreso" type="date" value={f.fechaIngreso || ''}
          onChange={e => upd('fechaIngreso', e.target.value)} />
        <Field label="Teléfono" inputMode="tel" placeholder="729 000 0000"
          value={f.telefono || ''} onChange={e => upd('telefono', e.target.value)} />
        <Field label="NSS" inputMode="numeric" placeholder="11 dígitos"
          value={f.nss || ''} onChange={e => upd('nss', e.target.value.replace(/\D/g, ''))} />
        <Field label="Dirección" placeholder="Calle, número, colonia"
          value={f.direccion || ''} onChange={e => upd('direccion', e.target.value)} />

        <Button size="lg" full onClick={save} className="mt-2">{isNew ? 'Agregar empleado' : 'Guardar cambios'}</Button>
        {!isNew && (
          <Button variant="danger" full icon={TrashIcon} onClick={del}>Eliminar empleado</Button>
        )}
      </div>

      {toast && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-50 bg-ink text-surface text-sm font-semibold px-5 py-3 rounded-full shadow-xl">
          {toast}
        </div>
      )}
    </>
  )
}
