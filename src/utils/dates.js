// Semana de nómina: miércoles → martes
const pad = n => String(n).padStart(2, '0')
const toDateStr = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`

export const PAYROLL_DAYS = ['Mié', 'Jue', 'Vie', 'Sáb', 'Dom', 'Lun', 'Mar']
export const DAYS = PAYROLL_DAYS  // alias usado en Asistencia
export const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

// Miércoles que inicia el período de nómina que contiene a d
export function weekId(d = new Date()) {
  const date = new Date(d)
  date.setHours(12, 0, 0, 0)
  const dow = date.getDay() // 0=Dom,1=Lun,2=Mar,3=Mié,4=Jue,5=Vie,6=Sáb
  const daysBack = (dow - 3 + 7) % 7  // 0 si es Mié, 1 si es Jue, ..., 6 si es Mar
  date.setDate(date.getDate() - daysBack)
  return toDateStr(date)
}

// Convierte weekId a Date
export function weekFromId(id) {
  if (!id) return new Date()
  if (id.includes('W')) {
    // Formato legado "2026-W22"
    const [yearStr, weekStr] = id.split('-W')
    const year = parseInt(yearStr)
    const week = parseInt(weekStr)
    const jan4 = new Date(year, 0, 4)
    const jan4Day = (jan4.getDay() + 6) % 7
    const monday = new Date(jan4)
    monday.setDate(jan4.getDate() - jan4Day + (week - 1) * 7)
    monday.setHours(12, 0, 0, 0)
    return monday
  }
  // Formato nuevo "YYYY-MM-DD" (siempre miércoles)
  const [y, m, d] = id.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0)
}

// Etiqueta corta: "28 may – 3 jun"
export function weekLabel(id) {
  if (!id) return ''
  const a = weekFromId(id)
  const b = new Date(a)
  b.setDate(b.getDate() + 6)
  if (a.getMonth() === b.getMonth())
    return `${a.getDate()}–${b.getDate()} ${MONTHS[a.getMonth()]}`
  return `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]}`
}

// Etiqueta larga: "Mié 28 may – Mar 3 jun 2026"
export function weekLong(id) {
  if (!id) return ''
  const a = weekFromId(id)
  const b = new Date(a)
  b.setDate(b.getDate() + 6)
  const fmtA = `${a.getDate()} ${MONTHS[a.getMonth()]}`
  const fmtB = `${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`
  if (id.includes('W')) return `${fmtA} – ${fmtB}`
  return `Mié ${fmtA} – Mar ${fmtB}`
}

export function addWeeks(id, n) {
  const d = weekFromId(id)
  d.setDate(d.getDate() + n * 7)
  return weekId(d)
}

// Fecha del día i de la semana (0=Mié, 1=Jue, ..., 6=Mar)
export function dayDate(id, i) {
  const d = weekFromId(id)
  d.setDate(d.getDate() + i)
  return d
}

// ¿Es la semana en curso?
export function isCurrentWeek(id) {
  return id === weekId(new Date())
}

export function sortedWeeks(ids) {
  return [...ids].sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))
}
