# Café Origen — Analítica de ventas (v0.1)

Motor de analítica de ventas y **reporte de negocio por consola** para Café Origen.
La gerencia puede ejecutar el análisis por su cuenta, sin abrir el código: basta con
un comando en la terminal.

**Versión actual: v0.1**

---

## ¿Qué es este proyecto?

Café Origen vende café de origen y accesorios en varias ciudades de Colombia. Este
proyecto toma su historial de ventas (12 registros en `src/datos.js`) y lo convierte en
un informe legible: cuánto se vendió, en qué ciudades, qué productos rinden más y cómo
fue cada día.

El proyecto tiene dos piezas:

| Pieza | Archivo | Para quién |
|-------|---------|-----------|
| Motor de analítica | `src/analitica.js` | Para el equipo de desarrollo: funciones puras y reutilizables. |
| Reporte de negocio | `src/reporte.js` | Para la gerencia: se ejecuta y se lee, sin tocar código. |

Todo el dinero se formatea en pesos colombianos con `toLocaleString("es-CO")` y las
secciones del reporte están alineadas para que se lea como un informe.

---

## ¿Cómo se ejecuta?

### Requisito

Node.js 18 o superior. No hay dependencias externas: no se necesita `npm install`.

### Reporte de negocio (lo que ejecuta la gerencia)

```bash
node src/reporte.js
```

O, usando los scripts de `package.json`:

```bash
npm run reporte
```

### Los demás scripts

```bash
npm run depuracion   # node src/depuracion.js  → reproduce los errores reportados y verifica la v0.1
npm run verificar    # node src/verificar.js   → compara la versión con ciclo contra la de métodos
npm run explorar     # node src/explorar.js    → exploración de datos y pruebas con arreglos vacíos
npm test             # ejecuta verificar + depuración (debe terminar en "RESULTADO: OK")
```

### Ejemplo de salida (resumen)

```
══════════════════════════════════════════════════════════════════════════════
  CAFÉ ORIGEN · REPORTE DE VENTAS · v0.1
  Generado: 12/11/2026, 6:27 a. m. · Registros analizados: 12
══════════════════════════════════════════════════════════════════════════════

 1. RESUMEN GENERAL
  Ventas registradas .................... 12
  Unidades vendidas ..................... 21
  Total vendido ......................... $ 985.000
  Ticket promedio ....................... $ 89.545
  Venta mayor ........................... $ 168.000 · #10 · Origen Huila 500 g
```

El reporte completo tiene cinco secciones: **resumen general**, **ventas por ciudad**,
**unidades por producto**, **top 3 de productos por valor** y **resumen por día** (con un
día con ventas y uno sin ventas).

---

## ¿Qué preguntas responde el reporte?

1. **¿Cuánto dinero entrée en el período?** → Total vendido, unidades vendidas y ticket
   promedio en la sección *Resumen general*.
2. **¿En qué ciudades se vende más?** → *Ventas por ciudad*, con ventas, unidades, total y
   participación porcentual de cada ciudad.
3. **¿Qué productos se venden más y qué peso tienen?** → *Unidades por producto* (unidades
   y valor por producto) y *Top 3 de productos por valor* (ranking con participación).
4. **¿Cómo fue un día concreto?** → *Resumen por día*: ventas, unidades, total, ticket
   promedio y venta mayor de la fecha, tanto para un día con ventas como para uno sin
   ventas (en ese caso muestra valores en cero y un mensaje explícito, no un error).
5. **¿Cuál fue la venta más grande?** → Venta mayor en el *Resumen general* y en el resumen
   de cada día.

---

## Estructura del proyecto

```
.
├── src/
│   ├── datos.js        # Historial de ventas (12 registros, dato original sin modificar)
│   ├── analitica.js    # Motor de analítica: funciones puras (v0.1)
│   ├── reporte.js      # Reporte de negocio por consola (punto de entrada de la gerencia)
│   ├── depuracion.js   # Reproducción de los errores reportados + verificación final
│   ├── verificar.js    # Compara la versión con ciclo contra la versión con métodos
│   └── explorar.js     # Exploración de datos y pruebas con arreglos vacíos
├── docs/
│   ├── semana-1/
│   │   ├── bitacora-dia-1.md   # Diccionario de datos, plan de indicadores y agrupaciones
│   │   └── bitacora-dia-2.md   # v0.1: motor, reporte y depuración de los errores
│   └── semana-2/
├── package.json
└── jsconfig.json
```

---

## Decisiones de diseño

- **Funciones puras.** Toda función de `analitica.js` recibe los datos por parámetro, no
  modifica los arreglos de entrada y siempre devuelve un resultado determinista.
- **Nunca `NaN` ni `undefined`.** Los casos degenerados (día sin ventas, arreglo vacío)
  devuelven `0`, `[]` o un mensaje claro. `ticketPromedio` tiene una guardia que evita la
  división entre cero.
- **Clave canónica vs. etiqueta visible.** Al agrupar se usa una clave canónica
  (`claveCiudad`, `claveProducto`: minúsculas, sin tildes, sin espacios sobrantes) para que
  "Bogotá", " bogotá " y "Bogota" queden en un solo grupo; pero lo que se muestra es la
  forma legible (`normalizarCiudad`, `normalizarNombre`).
- **Fechas sin zonas horarias.** `ventasDelDia` compara la clave de día "YYYY-MM-DD" en
  lugar de usar `new Date("YYYY-MM-DD")`, que se interpreta como UTC y desplazaba el día
  un día hacia atrás en `America/Bogota`.
- **Los datos no se tocan.** `src/datos.js` conserva el historial original; toda corrección
  ocurre dentro de las funciones de análisis.

---

## Errores reportados por la gerencia (resueltos en la v0.1)

| Error reportado | Causa | Corrección |
|-----------------|-------|------------|
| «Bogotá aparecía dos veces» | El agrupamiento usaba el texto crudo de la ciudad como clave. | Clave canónica para agrupar + etiqueta legible para mostrar. |
| «El ticket promedio daba NaN al filtrar un día sin ventas» | División entre cero (`0 / 0`). | Guardia en `ticketPromedio` (devuelve `0`) y mensaje explícito en el reporte. |

Durante la verificación de la v0.1 se detectaron y corrigieron además dos errores propios:
el desfase de un día en `ventasDelDia` por interpretación UTC y la deformación de tildes y
unidades en las funciones de normalización.

El detalle completo (síntoma, entrada, hipótesis, prueba, causa y corrección de cada error)
está en [`docs/semana-1/bitacora-dia-2.md`](docs/semana-1/bitacora-dia-2.md), y la
reproducción ejecutable está en `src/depuracion.js`.
