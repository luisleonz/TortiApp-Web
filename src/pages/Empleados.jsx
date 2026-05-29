import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenHeader } from '../components/Layout'
import { Card, Avatar, TipoBadge, IconButton, Button, Field, Segmented, EmptyState, SearchIcon, PlusIcon, ChevRIcon, UsersIcon } from '../components/ui'
import { useEmpleados } from '../store/context'
import { TIPOS } from '../utils/calc'

export default function Empleados() {
  const navigate = useNavigate()
  const empleados = useEmpleados()
  const [q, setQ] = useState('')
  const [filtro, setFiltro] = useState('Todos')

  const list = useMemo(() => {
    return empleados
      .filter(e => e.activo)
      .filter(e => filtro === 'Todos' || e.tipo === filtro)
      .filter(e => e.nombre.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [empleados, q, filtro])

  return (
    <>
      <ScreenHeader title="Empleados" large
        right={<IconButton icon={PlusIcon} variant="soft" onClick={() => navigate('/empleados/nuevo')} />}
        accessory={
          <div className="flex flex-col gap-2.5">
            <Field placeholder="Buscar por nombre…" value={q} onChange={e => setQ(e.target.value)} />
            <Segmented full value={filtro} onChange={setFiltro} options={['Todos', ...TIPOS]} />
          </div>
        }
      />
      <div className="p-4 pb-8 flex flex-col gap-3">
        {list.length === 0 ? (
          <EmptyState icon={UsersIcon} title="Sin empleados" sub="Agrega tu primer empleado con el botón +"
            action={<Button icon={PlusIcon} onClick={() => navigate('/empleados/nuevo')}>Agregar empleado</Button>} />
        ) : list.map(e => (
          <Card key={e.id} onClick={() => navigate(`/empleados/${e.id}`)} className="flex items-center gap-3 !p-3">
            <Avatar emp={e} />
            <div className="flex-1 min-w-0">
              <div className="text-[15.5px] font-bold text-ink truncate">{e.nombre}</div>
              <div className="mt-1"><TipoBadge tipo={e.tipo} size="sm" /></div>
            </div>
            <ChevRIcon className="w-5 h-5 text-ink-3/50 shrink-0" />
          </Card>
        ))}
      </div>
    </>
  )
}
