// Lógica de cálculo de nómina
export const TIPOS = ['Panadero', 'Tortillero', 'Mostrador']
export const PANES = [
  { k: 'panDulce',    label: 'Pan dulce' },
  { k: 'panGlaseado', label: 'Pan glaseado' },
  { k: 'panBlanco',   label: 'Pan blanco' },
  { k: 'panAjonjoli', label: 'Ajonjolí' },
  { k: 'galletas',    label: 'Galletas' },
]

/**
 * Pago por pieza desde una tarifa de pan.
 * Soporta { precioVenta, porcentaje } (nuevo) y número plano (legado).
 */
export function tarifaRate(tier) {
  if (!tier) return 0
  if (typeof tier === 'number') return tier
  return Math.round((+(tier.precioVenta || 0) * +(tier.porcentaje || 0)) / 100 * 100) / 100
}

/**
 * Calcula el total de la nómina.
 * @param {{ tipo, produccion, bonos, extras, abonosPrestamo, abonoCreditoTienda }} n
 * @returns {{ baseLineas, base, bonos, extras, abono, credito, ingresos, deducciones, neto }}
 */
export function calcNomina(n) {
  const tipo = n.tipo
  const prod = n.produccion || []
  const bonosArr = Array.isArray(n.bonos) ? n.bonos : []
  const extrasArr = Array.isArray(n.extras) ? n.extras : []
  const bonos = bonosArr.reduce((s, b) => s + (+b.monto || 0), 0)
  const extras = extrasArr.reduce((s, b) => s + (+b.monto || 0), 0)
  const abono = +n.abonosPrestamo || 0
  const credito = +n.abonoCreditoTienda || 0

  let baseLineas = []
  let base = 0

  if (tipo === 'Panadero') {
    PANES.forEach(p => {
      const lineDd = prod.find(l => l.tipo === `${p.k}_dd`)
      const lineDa = prod.find(l => l.tipo === `${p.k}_da`)
      const lineOld = prod.find(l => l.tipo === p.k)

      if (lineDd !== undefined || lineDa !== undefined) {
        // Two-price format (_dd / _da)
        const qtyDd = +(lineDd?.cantidad) || 0
        const rateDd = +(lineDd?.precioUnitario) || 0
        baseLineas.push({ label: `${p.label} – del día`, qty: qtyDd, rate: rateDd, sub: qtyDd * rateDd })
        base += qtyDd * rateDd

        const qtyDa = +(lineDa?.cantidad) || 0
        const rateDa = +(lineDa?.precioUnitario) || 0
        baseLineas.push({ label: `${p.label} – día ant.`, qty: qtyDa, rate: rateDa, sub: qtyDa * rateDa })
        base += qtyDa * rateDa
      } else {
        // Legacy single-price format (backward compat)
        const line = lineOld || {}
        const qty = +line.cantidad || 0
        const rate = +line.precioUnitario || 0
        const sub = qty * rate
        baseLineas.push({ label: p.label, qty, rate, sub })
        base += sub
      }
    })
  } else if (tipo === 'Tortillero') {
    const lineN = prod.find(l => l.tipo === 'sacos') || prod[0] || {}
    const lineD = prod.find(l => l.tipo === 'sacos_desc')
    const qtyN = +lineN.cantidad || 0
    const rateN = +lineN.precioUnitario || 0
    baseLineas.push({ label: 'Sacos de harina', qty: qtyN, rate: rateN, sub: qtyN * rateN })
    base += qtyN * rateN
    if (lineD && +lineD.cantidad > 0) {
      const qtyD = +lineD.cantidad || 0
      const rateD = +lineD.precioUnitario || 0
      baseLineas.push({ label: 'Sacos c/precio especial', qty: qtyD, rate: rateD, sub: qtyD * rateD })
      base += qtyD * rateD
    }
  } else {
    // Mostrador
    const line = prod[0] || {}
    const qty = +line.cantidad || 0
    const rate = +line.precioUnitario || 0
    const sub = qty * rate
    baseLineas.push({ label: 'Días asistidos', qty, rate, sub })
    base = sub
  }

  const ingresos = base + bonos + extras
  const deducciones = abono + credito
  const neto = ingresos - deducciones

  return { baseLineas, base, bonos, extras, abono, credito, ingresos, deducciones, neto }
}

/**
 * Construye el array de producción para una nómina al guardar
 * (snapshot de precios en el momento del cálculo).
 */
export function buildProduccion(tipo, data, tarifas) {
  if (tipo === 'Panadero') {
    const lines = []
    PANES.forEach(p => {
      const t = tarifas[p.k] || {}
      lines.push({ tipo: `${p.k}_dd`, cantidad: +data[`${p.k}_dd`] || 0, precioUnitario: tarifaRate(t.delDia) })
      lines.push({ tipo: `${p.k}_da`, cantidad: +data[`${p.k}_da`] || 0, precioUnitario: tarifaRate(t.diaAnterior) })
    })
    return lines
  }
  if (tipo === 'Tortillero') {
    const normalPrice = +data.precioSaco || tarifas.precioPorSaco
    const sacosN = +(data.sacosNormal ?? data.sacos) || 0
    const lines = [{ tipo: 'sacos', cantidad: sacosN, precioUnitario: normalPrice }]
    if (+data.sacosDescuento > 0) {
      const descPrice = +data.precioSacoDescuento || normalPrice
      lines.push({ tipo: 'sacos_desc', cantidad: +data.sacosDescuento, precioUnitario: descPrice })
    }
    return lines
  }
  // Mostrador
  return [{ tipo: 'dias', cantidad: +data.dias || 0, precioUnitario: +data.sueldoDiario || tarifas.sueldoDiarioMostrador }]
}
