import { useState, useEffect, useRef } from 'react'
import { money } from '../utils/format'

export const TIPO_COLOR = {
  Panadero:  { bg: 'bg-amber-100 text-amber-600',  dot: 'bg-amber-500' },
  Tortillero: { bg: 'bg-brown-100 text-brown-600', dot: 'bg-brown-500' },
  Mostrador: { bg: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
}

// ── Button ────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', full, icon: Icon, onClick, disabled, type = 'button', className = '' }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-btn transition-all active:scale-[.97] disabled:opacity-40 disabled:cursor-default select-none'
  const sizes = { sm: 'h-touch text-sm px-3.5', md: 'h-touch text-base px-4', lg: 'h-touch-lg text-base px-5' }
  const variants = {
    primary: 'bg-amber-500 text-amber-50 shadow-sm shadow-amber-900/20',
    soft:    'bg-amber-100 text-amber-600',
    outline: 'bg-surface border border-line text-ink',
    ghost:   'bg-transparent text-ink',
    danger:  'bg-red-50 text-red-600',
    dark:    'bg-ink text-white',
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}>
      {Icon && <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />}
      {children}
    </button>
  )
}

// ── IconButton ────────────────────────────────────────────────
export function IconButton({ icon: Icon, onClick, variant = 'plain', size = 'md', className = '' }) {
  const variants = {
    plain:   'bg-transparent text-ink-2',
    surface: 'bg-surface border border-line text-ink',
    soft:    'bg-amber-100 text-amber-600',
    danger:  'bg-red-50 text-red-600',
  }
  const sizes = { sm: 'w-9 h-9', md: 'w-touch h-touch', lg: 'w-touch-lg h-touch-lg' }
  return (
    <button type="button" onClick={onClick}
      className={`${sizes[size]} flex items-center justify-center rounded-card transition-all active:scale-95 ${variants[variant]} ${className}`}>
      <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
    </button>
  )
}

// ── Avatar ────────────────────────────────────────────────────
export function Avatar({ emp, size = 'md' }) {
  const initials = (emp?.nombre || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const c = TIPO_COLOR[emp?.tipo] || TIPO_COLOR.Panadero
  const sz = { sm: 'w-10 h-10 text-sm', md: 'w-12 h-12 text-base', lg: 'w-14 h-14 text-lg' }
  if (emp?.fotoUrl) return <img src={emp.fotoUrl} alt="" className={`${sz[size]} rounded-full object-cover shrink-0`} />
  return (
    <div className={`${sz[size]} rounded-full shrink-0 flex items-center justify-center font-bold ${c.bg}`}>
      {initials}
    </div>
  )
}

// ── TipoBadge ─────────────────────────────────────────────────
export function TipoBadge({ tipo, size = 'md' }) {
  const c = TIPO_COLOR[tipo] || TIPO_COLOR.Panadero
  const sz = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sz} ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {tipo}
    </span>
  )
}

// ── Field ─────────────────────────────────────────────────────
export function Field({ label, hint, prefix, suffix, className = '', inputClassName = '', ...rest }) {
  return (
    <label className={`block ${className}`}>
      {label && <div className="text-sm font-semibold text-ink-2 mb-1.5 pl-0.5">{label}</div>}
      <div className="flex items-center gap-2 bg-surface border border-line rounded-field px-3.5 h-touch-lg focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
        {prefix && <span className="text-ink-3 font-semibold text-sm shrink-0">{prefix}</span>}
        <input className={`flex-1 min-w-0 bg-transparent border-none outline-none font-sans text-base text-ink placeholder-ink-3/60 h-full ${inputClassName}`} {...rest} />
        {suffix && <span className="text-ink-3 text-sm font-semibold shrink-0">{suffix}</span>}
      </div>
      {hint && <div className="text-xs text-ink-3 mt-1 pl-0.5">{hint}</div>}
    </label>
  )
}

// ── MoneyField ────────────────────────────────────────────────
export function MoneyField({ label, value, onChange, hint, placeholder = '0.00' }) {
  return (
    <Field label={label} hint={hint} prefix="$" suffix="MXN"
      inputMode="decimal" placeholder={placeholder} value={value}
      onChange={e => onChange(e.target.value.replace(/[^\d.]/g, ''))}
      inputClassName="text-right font-bold tabular-nums"
    />
  )
}

// ── NumField ──────────────────────────────────────────────────
export function NumField({ label, value, onChange, suffix, max, hint }) {
  return (
    <label className="block">
      {label && <div className="text-sm font-semibold text-ink-2 mb-1.5 pl-0.5">{label}</div>}
      <div className="flex items-center gap-2 bg-surface border border-line rounded-field px-3.5 h-touch-lg focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
        <input inputMode="numeric" placeholder="0" value={value === 0 ? '' : value}
          onChange={e => { let v = parseInt(e.target.value.replace(/\D/g, '')) || 0; if (max) v = Math.min(max, v); onChange(v) }}
          className="flex-1 min-w-0 bg-transparent border-none outline-none font-sans text-2xl font-bold text-ink tabular-nums h-full" />
        {suffix && <span className="text-ink-3 text-sm font-semibold shrink-0">{suffix}</span>}
      </div>
      {hint && <div className="text-xs text-ink-3 mt-1 pl-0.5">{hint}</div>}
    </label>
  )
}

// ── Stepper ───────────────────────────────────────────────────
export function Stepper({ value, onChange, step = 1, min = 0, max = 999999 }) {
  const v = +value || 0
  const set = nv => onChange(Math.max(min, Math.min(max, nv)))
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => set(v - step)} className="w-touch-lg h-touch-lg flex items-center justify-center rounded-card bg-amber-100 text-amber-600 font-bold text-xl active:scale-95 transition-transform">−</button>
      <input inputMode="numeric" value={v === 0 ? '' : v} placeholder="0"
        onChange={e => set(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
        className="flex-1 h-touch-lg text-center border border-line rounded-card bg-surface font-bold text-2xl text-ink tabular-nums outline-none focus:border-amber-500 transition-colors" />
      <button type="button" onClick={() => set(v + step)} className="w-touch-lg h-touch-lg flex items-center justify-center rounded-card bg-amber-100 text-amber-600 font-bold text-xl active:scale-95 transition-transform">+</button>
    </div>
  )
}

// ── Segmented ─────────────────────────────────────────────────
export function Segmented({ value, onChange, options, full }) {
  return (
    <div className={`flex gap-1 bg-surface-2 border border-line rounded-[13px] p-1 ${full ? 'w-full' : ''}`}>
      {options.map(o => {
        const val = typeof o === 'string' ? o : o.value
        const lbl = typeof o === 'string' ? o : o.label
        const on = val === value
        return (
          <button key={val} type="button" onClick={() => onChange(val)}
            className={`${full ? 'flex-1' : ''} px-3 py-2 rounded-[10px] text-sm font-semibold transition-all whitespace-nowrap
              ${on ? 'bg-surface text-ink shadow-sm' : 'text-ink-3'}`}>
            {lbl}
          </button>
        )
      })}
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────
export function Card({ children, onClick, className = '', pad = true }) {
  const base = `bg-surface border border-line rounded-card shadow-sm/5 ${pad ? 'p-4' : ''}`
  return onClick
    ? <div role="button" tabIndex={0} onClick={onClick} onKeyDown={e => e.key === 'Enter' && onClick()} className={`${base} cursor-pointer active:scale-[.99] transition-transform ${className}`}>{children}</div>
    : <div className={`${base} ${className}`}>{children}</div>
}

// ── SectionLabel ──────────────────────────────────────────────
export function SectionLabel({ children, action }) {
  return (
    <div className="flex items-center justify-between mx-1 mb-2.5 mt-1">
      <div className="text-xs font-bold text-ink-3 uppercase tracking-wide">{children}</div>
      {action}
    </div>
  )
}

// ── Sheet (bottom modal) ──────────────────────────────────────
export function Sheet({ open, onClose, children, title, full }) {
  const [mounted, setMounted] = useState(open)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (open) { setMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => setShow(true))) }
    else { setShow(false); const t = setTimeout(() => setMounted(false), 280); return () => clearTimeout(t) }
  }, [open])

  if (!mounted) return null
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div onClick={onClose} className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-[260ms] ${show ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`relative bg-cream-100 rounded-t-[26px] shadow-2xl transition-transform duration-[300ms] ease-[cubic-bezier(.32,.72,0,1)] ${show ? 'translate-y-0' : 'translate-y-full'} ${full ? 'max-h-[94%]' : 'max-h-[88%]'} flex flex-col`}>
        {/* Handle + header */}
        <div className="flex items-center justify-between px-4 pt-3.5 pb-1 shrink-0">
          <div className="absolute left-0 right-0 top-2 flex justify-center pointer-events-none">
            <div className="w-10 h-1.5 rounded-full bg-line" />
          </div>
          <div className="w-10" />
          <div className="text-lg font-bold text-ink mt-1">{title}</div>
          <button type="button" onClick={onClose} className="w-touch h-touch flex items-center justify-center rounded-card bg-surface border border-line text-ink-3">
            <XIcon />
          </button>
        </div>
        <div className="overflow-auto px-4 pb-5 pt-1 flex-1">{children}</div>
      </div>
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────
export function Toast({ msg }) {
  if (!msg) return null
  return (
    <div className="absolute left-1/2 bottom-24 -translate-x-1/2 z-[300] flex items-center gap-2 bg-ink text-surface px-5 py-3 rounded-full text-sm font-semibold whitespace-nowrap shadow-xl animate-[taFade_.3s_ease]">
      <CheckIcon className="w-4 h-4 shrink-0" /> {msg}
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, sub, action }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="inline-flex p-5 rounded-[20px] bg-surface-2 text-ink-3 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <div className="text-base font-bold text-ink-2 mb-1.5">{title}</div>
      {sub && <div className="text-sm text-ink-3 leading-relaxed max-w-xs mx-auto">{sub}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ── Inline SVG icons ──────────────────────────────────────────
const icon = d => ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {d.split('|').map((seg, i) => <path key={i} d={seg} />)}
  </svg>
)

export const HomeIcon    = icon('M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5')
export const UsersIcon   = icon('M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM22 20v-1.5a4 4 0 0 0-3-3.87M16 4.13a4 4 0 0 1 0 7.75')
export const CalcIcon    = icon('M6 2.5h12a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 20V4A1.5 1.5 0 0 1 6 2.5ZM8 6.5h8M8 11h0M12 11h0M16 11h0M8 14.5h0M12 14.5h0M16 14.5v3.5M8 18h4')
export const CalendarIcon = icon('M5 4.5h14a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1ZM4 9h16M8 3v3M16 3v3M8.5 14l2 2 4-4')
export const HistoryIcon = icon('M3.5 12a8.5 8.5 0 1 0 2.6-6.1M4 4.5V8h3.5M12 7.5V12l3 2')
export const GearIcon    = icon('M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z|M19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.2A1.6 1.6 0 0 0 7 19.3a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 0 1 0-4h.2A1.6 1.6 0 0 0 2.7 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 8 2.7h.1A1.6 1.6 0 0 0 9 1.2V1a2 2 0 0 1 4 0v.2A1.6 1.6 0 0 0 16.9 2.4a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1A1.6 1.6 0 0 0 22.8 9H23a2 2 0 0 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1Z')
export const PlusIcon    = icon('M12 5v14M5 12h14')
export const XIcon       = icon('M6 6l12 12M18 6L6 18')
export const CheckIcon   = icon('M5 12.5l4.5 4.5L19 6.5')
export const ChevRIcon   = icon('M9 5l7 7-7 7')
export const ChevLIcon   = icon('M15 5l-7 7 7 7')
export const ChevDIcon   = icon('M6 9l6 6 6-6')
export const SearchIcon  = icon('M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4')
export const EditIcon    = icon('M4 20h4L18.5 9.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4ZM13.5 6.5l4 4')
export const TrashIcon   = icon('M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M10 11v6M14 11v6')
export const TagIcon     = icon('M11 3H5a2 2 0 0 0-2 2v6l9.5 9.5a1.5 1.5 0 0 0 2.1 0l5.9-5.9a1.5 1.5 0 0 0 0-2.1L11 3ZM7.5 8.5h0')
export const CoinsIcon   = icon('M8 14.5a6 3 0 1 0 0-6 6 3 0 0 0 0 6ZM2 8.5v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-3M14 11.2c2.8-.2 5-1.4 5-2.9s-2.5-2.8-5.5-2.8c-1.4 0-2.7.3-3.6.7M16 13.8c1.8-.4 3-1.3 3-2.3')
export const ReceiptIcon = icon('M6 3h12a1 1 0 0 1 1 1v17l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21V4a1 1 0 0 1 1-1ZM8.5 8h7M8.5 12h7M8.5 16h4')
export const WheatIcon   = icon('M12 22V8M12 8c0-2 1.5-3.5 3.5-3.5M12 8c0-2-1.5-3.5-3.5-3.5M12 12.5c0-1.6 1.3-3 3-3M12 12.5c0-1.6-1.3-3-3-3M12 17c0-1.6 1.3-3 3-3M12 17c0-1.6-1.3-3-3-3')
export const LockIcon    = icon('M6 10.5h12a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1ZM8 10.5V8a4 4 0 0 1 8 0v2.5')
export const LogoutIcon  = icon('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9')
export const UserIcon    = icon('M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0')
export const PhoneIcon   = icon('M6.5 3.5h-2A1.5 1.5 0 0 0 3 5c0 8.5 7.5 16 16 16a1.5 1.5 0 0 0 1.5-1.5v-2a1 1 0 0 0-.8-1l-3.4-.7a1 1 0 0 0-1 .4l-1 1.3a13 13 0 0 1-6-6l1.3-1a1 1 0 0 0 .4-1l-.7-3.4a1 1 0 0 0-1-.8Z')
export const PinIcon     = icon('M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z')
export const EyeIcon     = icon('M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z')
export const EyeOffIcon  = icon('M9.9 5.2A9.5 9.5 0 0 1 12 5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.3 3M6.3 7.3A15 15 0 0 0 2.5 12S6 18.5 12 18.5c1 0 1.9-.1 2.7-.4M3 3l18 18M10 10a3 3 0 0 0 4 4')
export const MinusIcon   = icon('M5 12h14')
export const InfoIcon    = icon('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 7.5h0')
export const PDFIcon     = icon('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M8 13h8M8 17h5')
export const SlidersIcon = icon('M4 6h10M18 6h2M4 12h2M10 12h10M4 18h8M16 18h4M14 4v4M6 10v4M12 16v4')
