// Lógica de cálculo de nómina (portada de prototype/app/store.js)
export const TIPOS = ['Panadero', 'Tortillero', 'Mostrador']
export const PANES = [
  { k: 'panDulce',   label: 'Pan dulce' },
  { k: 'panBlanco',  label: 'Pan blanco' },
  { k: 'panAjonjoli', label: 'Ajonjolí' },
  { k: 'galletas',   label: 'Galletas' },
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
      const line = prod.find(l => l.tipo === p.k) || {}
      const qty = +line.cantidad || 0
      const rate = +line.precioUnitario || 0
      const sub = qty * rate
      baseLineas.push({ label: p.label, qty, rate, sub })
      base += sub
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
    return PANES.map(p => ({
      tipo: p.k,
      cantidad: +data[p.k] || 0,
      precioUnitario: tarifas[p.k] || 0,
    }))
  }
  if (tipo === 'Tortillero') {
    return [{ tipo: 'sacos', cantidad: +data.sacos || 0, precioUnitario: +data.precioSaco || tarifas.precioPorSaco }]
  }
  // Mostrador
  return [{ tipo: 'dias', cantidad: +data.dias || 0, precioUnitario: +data.sueldoDiario || tarifas.sueldoDiarioMostrador }]
}
