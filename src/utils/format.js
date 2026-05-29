const _mx = new Intl.NumberFormat('es-MX', {
  style: 'currency', currency: 'MXN', minimumFractionDigits: 2,
})

export const money = (n) => _mx.format(isFinite(n) ? n : 0)
export const money0 = (n) => money(n).replace(/\.00$/, '')
export const num = (n) => new Intl.NumberFormat('es-MX').format(isFinite(n) ? n : 0)
