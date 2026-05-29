import { jsPDF } from 'jspdf'
import { money, money0 } from './format'
import { weekLong } from './dates'

const PAGE_W = 216  // carta mm
const PAGE_H = 279
const HALF_H = PAGE_H / 2
const MARGIN = 15
const COL = PAGE_W / 2

/**
 * Genera un PDF con dos copias del recibo en hoja carta.
 * @param {{ empNombre, semana, tipo, baseLineas, bonos, extras, abono, credito, neto }} data
 */
export function generarRecibo(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' })
  const { empNombre, semana, tipo, baseLineas, bonos, extras, abono, credito, neto } = data

  drawCopy(doc, 0, empNombre, semana, tipo, baseLineas, bonos, extras, abono, credito, neto)

  // Línea punteada al centro
  doc.setLineDashPattern([2, 2], 0)
  doc.setDrawColor(150, 150, 150)
  doc.line(MARGIN, HALF_H, PAGE_W - MARGIN, HALF_H)
  doc.setFontSize(7)
  doc.setTextColor(150)
  const scissors = '✂'
  doc.text(scissors, PAGE_W / 2, HALF_H, { align: 'center' })

  drawCopy(doc, HALF_H, empNombre, semana, tipo, baseLineas, bonos, extras, abono, credito, neto)

  doc.save(`nomina_${empNombre.replace(/\s+/g, '_')}_${semana}.pdf`)
}

function drawCopy(doc, offsetY, empNombre, semana, tipo, baseLineas, bonos, extras, abono, credito, neto) {
  const y0 = offsetY + 10
  const w = PAGE_W - MARGIN * 2
  const right = PAGE_W - MARGIN

  // Header
  doc.setFillColor(181, 116, 15)  // amber
  doc.rect(MARGIN, y0, w, 14, 'F')
  doc.setTextColor(255, 253, 247)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Tortillería y Panadería León', PAGE_W / 2, y0 + 5.5, { align: 'center' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Recibo de Nómina Semanal', PAGE_W / 2, y0 + 10.5, { align: 'center' })

  // Empleado info
  let y = y0 + 20
  doc.setTextColor(43, 34, 24)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(empNombre, MARGIN, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(110, 97, 76)
  doc.text(tipo, MARGIN, y + 5)
  doc.text(weekLong(semana), MARGIN, y + 10)

  // Separador
  y += 16
  doc.setDrawColor(235, 227, 210)
  doc.setLineDashPattern([], 0)
  doc.line(MARGIN, y, right, y)

  // Desglose
  y += 6
  doc.setFontSize(8)
  doc.setTextColor(43, 34, 24)

  const row = (label, amount, bold = false, negative = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(negative ? 180 : 43, negative ? 68 : 34, negative ? 47 : 24)
    doc.text(label, MARGIN, y)
    doc.text((negative ? '−' : '') + money0(Math.abs(amount)), right, y, { align: 'right' })
    y += 5.5
  }

  const secLabel = (label) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(156, 142, 120)
    doc.text(label.toUpperCase(), MARGIN, y)
    y += 4.5
    doc.setFontSize(8)
  }

  secLabel('Ingresos base')
  baseLineas.filter(l => l.qty > 0).forEach(l => {
    row(`${l.label} (${l.qty} × ${money(l.rate)})`, l.sub)
  })

  if (bonos > 0) {
    secLabel('Bonos')
    row('Bonos', bonos)
  }
  if (extras > 0) {
    secLabel('Extras')
    row('Conceptos extra', extras)
  }
  if (abono > 0 || credito > 0) {
    secLabel('Descuentos')
    if (abono > 0) row('Abono a préstamo', abono, false, true)
    if (credito > 0) row('Crédito de tienda', credito, false, true)
  }

  // Total
  y += 2
  doc.setDrawColor(235, 227, 210)
  doc.line(MARGIN, y, right, y)
  y += 5
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(43, 34, 24)
  doc.text('TOTAL NETO', MARGIN, y)
  doc.setFontSize(12)
  doc.setTextColor(138, 90, 12)
  doc.text(money(neto), right, y, { align: 'right' })

  // Firma
  y += 14
  const lineLen = 55
  const cx = PAGE_W / 2
  doc.setDrawColor(156, 142, 120)
  doc.setLineDashPattern([], 0)
  doc.line(cx - lineLen / 2, y, cx + lineLen / 2, y)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(156, 142, 120)
  doc.text('Firma del trabajador', cx, y + 4, { align: 'center' })
}
