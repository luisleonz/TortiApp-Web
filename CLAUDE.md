# TortiApp — notas del proyecto

App móvil (web) de nómina semanal para "Tortillería y Panadería León". React + Babel in-browser, persistencia en localStorage. Español, mobile-first, marco de iPhone.

## Arquitectura
- `index.html` — tokens CSS (tema cálido maíz/trigo), fuentes, carga de scripts.
- `app/store.js` — datos semilla, persistencia (localStorage `tortiapp_v2`), formato y **cálculo de nómina**.
- `app/icons.jsx`, `app/ui.jsx`, `app/shell.jsx` — primitivas, íconos de línea, header + bottom nav.
- `app/screens-core.jsx` — Login, Inicio, Empleados (CRUD), Tarifas.
- `app/screens-payroll.jsx` — Asistencia, **Nómina** (pantalla estrella con variaciones), Historial.
- `app/screens-prestamos.jsx` — Préstamos y abonos (libro de adeudos por empleado).
- `app/App.jsx` — raíz: tema, navegación, sesión, panel de **Tweaks**.

## ⚠️ Build: bundle único
Los archivos `app/*.jsx` + `ios-frame.jsx` + `tweaks-panel.jsx` se concatenan en **`app/bundle.jsx`**, que es lo único que carga `index.html`. Esto evita la colisión de helpers de Babel (`_excluded`, etc.) entre múltiples `<script type="text/babel">`.

**Tras editar cualquier fuente `.jsx`, regenera el bundle** (run_script):
```
const files=['ios-frame.jsx','tweaks-panel.jsx','app/icons.jsx','app/ui.jsx','app/shell.jsx','app/screens-core.jsx','app/screens-payroll.jsx','app/screens-prestamos.jsx','app/App.jsx'];
let out='/* GENERATED BUNDLE */\n';
for(const f of files){ out+=`\n/* === ${f} === */\n`+await readFile(f)+'\n'; }
await saveFile('app/bundle.jsx', out);
```

## Notas de captura
El tool de screenshot no renderiza contenido con `animation`/`transform` compositado (scroll fades, bottom-sheets). En un navegador real se ve perfecto — no es un defecto.
