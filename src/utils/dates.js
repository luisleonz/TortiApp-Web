// Week helpers — semana empieza el lunes
export const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
export const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function mondayOf(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const day = (x.getDay() + 6) % 7 // 0 = lunes
  x.setDate(x.getDate() - day)
  return x
}

export function weekId(d = new Date()) {
  const m = mondayOf(d)
  return `${m.getFullYear()}-W${String(isoWeekNum(m)).padStart(2, '0')}`
}

function isoWeekNum(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

export function weekFromId(id) {
  // id: "2026-W22"
  const [yearStr, weekStr] = id.split('-W')
  const year = parseInt(yearStr)
  const week = parseInt(weekStr)
  const jan4 = new Date(year, 0, 4) // Jan 4 is always in week 1
  const jan4Day = (jan4.getDay() + 6) % 7 // days since Monday
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - jan4Day + (week - 1) * 7)
  monday.setHours(0, 0, 0, 0)
  return monday
}

export function weekLabel(id) {
  const a = weekFromId(id)
  const b = new Date(a)
  b.setDate(b.getDate() + 6)
  if (a.getMonth() === b.getMonth())
    return `${a.getDate()}–${b.getDate()} ${MONTHS[a.getMonth()]}`
  return `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]}`
}

export function weekLong(id) {
  const a = weekFromId(id)
  const b = new Date(a)
  b.setDate(b.getDate() + 6)
  return `Semana del ${a.getDate()} al ${b.getDate()} de ${MONTHS[b.getMonth()]} ${b.getFullYear()}`
}

export function addWeeks(id, n) {
  const d = weekFromId(id)
  d.setDate(d.getDate() + n * 7)
  return weekId(d)
}

export function dayDate(id, i) {
  const d = weekFromId(id)
  d.setDate(d.getDate() + i)
  return d
}

export function isCurrentWeek(id) {
  return id === weekId(new Date())
}

export function sortedWeeks(ids) {
  return [...ids].sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))
}
