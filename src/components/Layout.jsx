import { useNavigate, useLocation } from 'react-router-dom'
import { UsersIcon, CalendarIcon, CalcIcon, HistoryIcon, GearIcon } from './ui'
import { weekLabel, weekId, addWeeks } from '../utils/dates'

const NAV = [
  { path: '/empleados',  label: 'Empleados',  Icon: UsersIcon },
  { path: '/asistencia', label: 'Asistencia', Icon: CalendarIcon },
  { path: '/nomina',     label: 'Nómina',     Icon: CalcIcon, hero: true },
  { path: '/historial',  label: 'Historial',  Icon: HistoryIcon },
  { path: '/config',     label: 'Config',     Icon: GearIcon },
]

export function Layout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const active = NAV.find(n => pathname.startsWith(n.path))?.path

  return (
    <div className="flex flex-col w-full h-full bg-cream-100 relative overflow-x-hidden" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-none relative">
        {children}
      </main>
      <nav className="shrink-0 relative z-40 bg-white/90 backdrop-blur-lg border-t border-line">
        <div className="flex justify-around items-start px-1.5 pt-2 pb-2">
          {NAV.map(({ path, label, Icon, hero }) => {
            const on = active === path
            return (
              <button key={path} type="button" onClick={() => navigate(path)}
                className="flex-1 flex flex-col items-center gap-1 py-1 transition-colors"
                style={{ WebkitTapHighlightColor: 'transparent' }}>
                {hero ? (
                  <div className={`w-12 h-9 rounded-xl flex items-center justify-center transition-all
                    ${on ? 'bg-amber-500 shadow-md shadow-amber-900/30 text-amber-50' : 'bg-amber-100 text-amber-600'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                ) : (
                  <Icon className={`w-6 h-6 transition-colors ${on ? 'text-amber-600' : 'text-ink-3'}`} />
                )}
                <span className={`text-[10.5px] font-semibold ${on ? 'text-amber-600' : 'text-ink-3'}`}>{label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export function ScreenHeader({ title, subtitle, onBack, right, accessory, large }) {
  return (
    <div className="sticky top-0 z-30 bg-cream-100/85 backdrop-blur-md border-b border-line/60 px-4 pb-3 pt-4">
      <div className="flex items-center gap-2.5 min-h-[42px]">
        {onBack && (
          <button type="button" onClick={onBack} className="w-touch h-touch -ml-1.5 flex items-center justify-center rounded-card text-amber-600">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className={`font-extrabold text-ink leading-tight tracking-tight ${large ? 'text-[27px]' : 'text-xl'}`}>{title}</h1>
          {subtitle && <div className="text-[13px] text-ink-3 font-medium mt-0.5">{subtitle}</div>}
        </div>
        {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
      </div>
      {accessory && <div className="mt-3">{accessory}</div>}
    </div>
  )
}

export function WeekNav({ week, setWeek }) {
  const isCurrent = week === weekId(new Date())
  return (
    <div className="flex items-center gap-2 bg-surface border border-line rounded-[13px] p-1.5">
      <button type="button" onClick={() => setWeek(addWeeks(week, -1))} className="w-9 h-9 flex items-center justify-center rounded-card text-ink-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <div className="flex-1 text-center">
        <div className="text-[15px] font-bold text-ink tabular-nums">{weekLabel(week)}</div>
        <div className={`text-[11.5px] font-semibold ${isCurrent ? 'text-green-600' : 'text-ink-3'}`}>{isCurrent ? 'Semana actual' : ''}</div>
      </div>
      <button type="button" disabled={isCurrent} onClick={() => setWeek(addWeeks(week, 1))} className="w-9 h-9 flex items-center justify-center rounded-card text-ink-2 disabled:opacity-30">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  )
}
