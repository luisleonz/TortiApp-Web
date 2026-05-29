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
 * Calcula el total de la nómina.
 * @param {{ tipo, produccion, bonos, extras, abonosPrestamo, abonoCreditoTienda }} n
 * @returns {{ baseLineas, base, bonos, extras, abono, credito, ingresos, deducciones, neto }}
 */
export function calcNomina(n) {
  const tipo = n.tipo
  const prod = n.produccion || []
  const bonos = (n.bonos || []).reduce((s, b) => s + (+b.monto || 0), 0)
  const extras = (n.extras || []).reduce((s, b) => s + (+b.monto || 0), 0)
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
    const line = prod[0] || {}
    const qty = +line.cantidad || 0
    const rate = +line.precioUnitario || 0
    const sub = qty * rate
    baseLineas.push({ label: 'Sacos de harina', qty, rate, sub })
    base = sub
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
      const t = tarifas[p.k] || { delDia: 0, diaAnterior: 0 }
      lines.push({ tipo: `${p.k}_dd`, cantidad: +data[`${p.k}_dd`] || 0, precioUnitario: t.delDia || 0 })
      lines.push({ tipo: `${p.k}_da`, cantidad: +data[`${p.k}_da`] || 0, precioUnitario: t.diaAnterior || 0 })
    })
    return lines
  }
  if (tipo === 'Tortillero') {
    return [{ tipo: 'sacos', cantidad: +data.sacos || 0, precioUnitario: +data.precioSaco || tarifas.precioPorSaco }]
  }
  // Mostrador
  return [{ tipo: 'dias', cantidad: +data.dias || 0, precioUnitario: +data.sueldoDiario || tarifas.sueldoDiarioMostrador }]
}
