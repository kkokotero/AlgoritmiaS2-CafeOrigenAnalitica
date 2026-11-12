# Café Origen Analítica — Bitácora Semana 1, día 2

**Versión entregada: v0.1** · Motor de analítica + reporte de negocio por consola.

La gerencia necesita ejecutar el análisis por su cuenta, sin abrir el código. Por eso
la v0.1 se entrega como un reporte ejecutable (`node src/reporte.js`) y como un módulo
de funciones puras reutilizables (`src/analitica.js`).

Además, la gerencia reportó dos errores de una versión preliminar compartida por un
compañero. Este día se reprodujeron ambos, se depuraron de forma sistemática y se
verificó que la v0.1 no los presenta.

## MiniReto 1: Motor de analítica y reporte de negocio (v0.1)

### Qué hace el motor

`src/analitica.js` expone funciones puras: reciben los datos por parámetro, no modifican
los arreglos de entrada y devuelven siempre un resultado determinista. Ninguna devuelve
`NaN` ni `undefined` por datos vacíos o mal formados.

| Función | Qué responde |
|---------|--------------|
| `valorVenta(venta)` | Cuánto dinero generó una venta (cantidad × precio). |
| `totalVendido(ventas)` / `totalVendidoM(ventas)` | Cuánto se vendió en total. |
| `unidadesVendidas(ventas)` / `unidadesVendidasM(ventas)` | Cuántas unidades se vendieron. |
| `ticketPromedio(ventas)` | Cuánto promedio gastó cada compra válida. |
| `ventaMayor(ventas)` | Cuál fue la venta más grande. |
| `ventasPorCiudad(ventas, ciudad)` | Cuánto se vendió en una ciudad. |
| `totalPorCiudad(ventas)` / `resumenPorCiudad(ventas)` | Cuánto se vendió en cada ciudad. |
| `unidadesPorProducto(ventas)` / `resumenPorProducto(ventas)` | Cuántas unidades y cuánto dinero dio cada producto. |
| `topProductosPorValor(ventas, topN)` | Cuáles productos generan más dinero. |
| `ventasDelDia(ventas, fecha)` | Qué ventas hubo en una fecha concreta. |
| `resumenDelDia(ventas, fecha)` | Resumen completo (ventas, unidades, total, ticket, venta mayor) de un día. |
| `fechasConVentas(ventas)` | Qué días tienen ventas registradas. |
| `formatearMoneda(valor)` / `formatearNumero(valor)` | Cómo se ve un valor en pesos colombianos. |

### Cómo se ejecuta

```bash
node src/reporte.js      # reporte de negocio (lo que ejecuta la gerencia)
node src/depuracion.js   # reproducción de los errores reportados y verificación final
node src/verificar.js    # compara la versión con ciclo contra la versión con métodos
node src/explorar.js     # exploración de datos y pruebas con arreglos vacíos
```

### Estructura del reporte

`src/reporte.js` integra `datos.js` con `analitica.js` y muestra cinco secciones:

1. **Resumen general**: total vendido, unidades, ticket promedio, venta mayor, ciudad líder.
2. **Ventas por ciudad**: tabla con ventas, unidades, total y participación de cada ciudad.
3. **Unidades por producto**: tabla con unidades, valor y participación de cada producto.
4. **Top 3 de productos por valor**: ranking con valor y participación porcentual.
5. **Resumen por día**: un día con ventas y un día sin ventas.

Los valores se formatean con `toLocaleString("es-CO")` y las secciones se alinean con
líneas de puntitos para que el reporte se lea como un informe.

### Decisión de diseño: separar la clave de agrupación de la etiqueta visible

Para que una ciudad escrita de varias formas ("Bogota", "Bogotá", " bogotá ") caiga en un
solo grupo, la agrupación no puede usar el texto crudo. La v0.1 separa dos conceptos:

- **Clave canónica** (`claveCiudad`, `claveProducto`): minúsculas, sin tildes y sin espacios
  sobrantes. Solo se usa para agrupar y comparar.
- **Etiqueta visible** (`normalizarCiudad`, `normalizarNombre`): el texto que ve la gerencia,
  con mayúsculas y tildes correctas.

## MiniReto 2: Depuración sistemática de los errores reportados

La reproducción vive en `src/depuracion.js`, que contrasta cada implementación de la
versión preliminar (copiada en el propio script) contra la v0.1.

### Error 1 (reportado por la gerencia): «Bogotá aparecía dos veces»

- **Síntoma**: en la sección "Ventas por ciudad" la ciudad Bogotá aparecía dos veces, con
  dos filas y dos totales distintos. La gerencia pensó que había dos ciudades.
- **Entrada que lo produce**: ventas cuya ciudad está escrita de más de una forma. En el
  historial real hay "Medellín" y "medellín" (ventas 1, 4, 5 y 11). Para reproducir
  exactamente el síntoma reportado se usa una entrada con "Bogotá", " bogotá " y "Bogota".
- **Hipótesis**: el agrupamiento usa el texto crudo de `venta.ciudad` como clave del
  diccionario, así que cada forma escrita del mismo topónimo crea su propio grupo. No es
  un problema de los datos sino de la clave de agrupación.
- **Prueba realizada**: `node src/depuracion.js`, bloque "ERROR 1". Se ejecutaron tres
  pruebas: (A) la versión preliminar sobre la entrada con "Bogotá" / " bogotá " / "Bogota"
  produce 3 filas para Bogotá; (B) la v0.1 sobre la misma entrada produce 1 fila
  (`Bogotá → $ 205.000 (3 ventas)`); (C) sobre el historial real la versión preliminar
  produce 5 grupos de ciudad y la v0.1 produce 4.
- **Causa raíz**: `totalPorCiudad` (y el resto de funciones de agrupación) indexaban el
  acumulador con `venta.ciudad` sin normalizar, de modo que el diccionario trataba
  "Medellín" y "medellín" como dos ciudades diferentes.
- **Corrección**: se introdujo la clave canónica `claveCiudad()` (minúsculas, sin tildes, sin
  espacios sobrantes) y se usa como índice del agrupador en `totalPorCiudad`,
  `resumenPorCiudad`, `unidadesPorProducto`, `resumenPorProducto` y `topProductosPorValor`.
  La etiqueta que se muestra es la forma normalizada de la primera venta del grupo.
  `ventasPorCiudad` y `ventasPorCiudadM` también comparan por clave canónica.
- **Prueba de no reproducción en la v0.1**: la tabla de ciudades del reporte real
  (`node src/reporte.js`) contiene 4 filas y 4 ciudades distintas, y el detector de
  duplicados de `src/depuracion.js` confirma `¿Hay ciudades duplicadas? no`.

### Error 2 (reportado por la gerencia): «el ticket promedio daba NaN con un día sin ventas»

- **Síntoma**: al filtrar un día en el que no hubo ventas, el ticket promedio mostraba
  `NaN` en el reporte.
- **Entrada que lo produce**: las ventas de un día sin registros. En el historial el
  rango es del 01/09/2026 al 06/09/2026, así que el 07/09/2026 devuelve 0 ventas.
- **Hipótesis**: el ticket promedio se calculaba como `total / cantidad de ventas` sin
  validar el divisor. Con 0 ventas el resultado es `0 / 0`, es decir `NaN`.
- **Prueba realizada**: `node src/depuracion.js`, bloque "ERROR 2".
  - Versión preliminar sobre el 07/09/2026: total `$ 0`, 0 registros, ticket `NaN`
    (`¿Es NaN? SÍ`).
  - Versión v0.1 sobre el mismo día: ticket `0` (`¿Es NaN? no`) y resumen
    `{"fecha":"2026-09-07","ventas":0,"unidades":0,"total":0,"ticketPromedio":0,"ventaMayor":null}`.
- **Causa raíz**: división entre cero en `ticketPromedio`, sin guardia para el caso en que
  no exista ninguna venta válida (cantidad mayor a cero).
- **Corrección**: `ticketPromedio` cuenta las ventas válidas y devuelve `0` cuando el
  contador es cero (`return contador > 0 ? total / contador : 0`). El reporte ya no imprime
  el resultado crudo de la división: usa `formatearMoneda`, que devuelve `$ 0` ante un valor
  no numérico, y la sección "Resumen por día" imprime un mensaje explícito
  («Sin ventas registradas para esta fecha (valores en cero, no es un error)»).
- **Prueba de no reproducción en la v0.1**: la verificación final de `src/depuracion.js`
  ejecuta `node src/reporte.js` y confirma que la salida no contiene "NaN" ni "undefined".
  El día sin ventas aparece con valores en cero ($ 0, 0 ventas, 0 unidades) y sin error.

### Error 3 (encontrado durante la verificación de la v0.1): `ventasDelDia` devolvía el día equivocado

- **Síntoma**: al pedir el resumen de un día con ventas, el reporte mostraba los datos del
  día siguiente. Era el error más grave, porque hacía que el "día con ventas" pareciera un
  "día sin ventas".
- **Entrada que lo produce**: `VENTAS` y la fecha local `new Date(2026, 8, 1)`, es decir el
  1 de septiembre de 2026 creado en hora local.
- **Hipótesis**: la comparación se hacía sobre `new Date(venta.fecha)`. El texto
  "YYYY-MM-DD" se interpreta como **UTC**, así que en `America/Bogota` el 01/09/2026 se
  convierte en el 31/08/2026 a las 19:00. Al comparar día, mes y año locales, la venta
  quedaba un día antes y el filtro devolvía las ventas del 02/09/2026.
- **Prueba realizada**: `node src/depuracion.js`, bloque "ERROR 3".
  - Versión preliminar: `new Date('2026-09-01')` es `Mon Aug 31 2026 19:00:00 GMT-0500` y las
    ventas devueltas son las IDs 3 y 4, con fecha 2026-09-02.
  - Versión v0.1: las ventas devueltas son las IDs 1 y 2, con fecha 2026-09-01 (`OK`).
- **Causa raíz**: mezcla entre una fecha interpretada en UTC (el dato) y una fecha
  interpretada en hora local (el filtro). El desfase depende de la zona horaria de la
  máquina que ejecuta el reporte.
- **Corrección**: se creó `claveDia(fecha)`, que convierte cualquier fecha a la clave de día
  "YYYY-MM-DD" sin pasar por un `Date` interpretado en UTC: si la fecha es un texto se usa
  tal cual y si es un objeto `Date` se toman sus componentes locales. `ventasDelDia` compara
  claves de día, por lo que el resultado es el mismo en cualquier zona horaria.
- **Prueba de no reproducción en la v0.1**: el reporte muestra el 01/09/2026 con 2 ventas,
  3 unidades y `$ 110.000`, que son exactamente las ventas 1 y 2 del historial.

### Error 4 (encontrado durante la verificación de la v0.1): la normalización deformaba tildes y unidades

- **Síntoma**: los nombres de las ciudades salían como "BogotÁ" y "MedellÍN", y los
  productos como "Origen Huila 500 G" (la unidad de peso en mayúscula).
- **Entrada que lo produce**: los textos "Bogotá", "Medellín" y "Origen Huila 500 g".
- **Hipótesis**: la expresión regular `\b` (límite de palabra) en JavaScript solo reconoce
  como caracteres de palabra las letras ASCII, por lo que la tilde cuenta como separador y
  la letra acentuada se capitaliza: "bogotá" → "BogotÁ". En los productos, capitalizar la
  primera letra de "cada palabra" convertía la unidad "g" en "G".
- **Prueba realizada**: `node src/depuracion.js`, bloque "ERROR 4".
  - Versión preliminar: `normalizarCiudad('Bogotá')` devuelve `"BogotÁ"` y
    `normalizarCiudad('Medellín')` devuelve `"MedellÍN"`.
  - Versión v0.1: la clave canónica de "Bogotá" es `"bogota"` y las ciudades del reporte son
    `["Medellín","Bogotá","Cali","Pereira"]`, con las tildes correctas y "Origen Huila 500 g"
    intacto.
- **Causa raíz**: uso de `\b` con letras no ASCII para poner en mayúscula, y una regla de
  "título" aplicada a nombres que no son títulos (los productos llevan unidades).
- **Corrección**: `normalizarCiudad` ahora pasa el texto a minúsculas y capitaliza solo la
  primera letra de cada palabra usando `(^|\s)(\p{L})`, que sí reconoce las letras
  acentuadas. `normalizarNombre` ya no invierte las mayúsculas: solo recorta y colapsa
  espacios, de modo que las unidades se conservan ("500 g").

### Verificación final del reporte

`node src/depuracion.js` ejecuta el reporte completo como proceso hijo y revisa su salida:

```
· ¿Aparece "NaN" en la salida?        no
· ¿Aparece "undefined" en la salida?  no
· Ciudades en la tabla del reporte:   4
· Ciudades distintas:                 4
· ¿Hay ciudades duplicadas?           no
· ¿Las 4 secciones están presentes?   sí
```

El detector de duplicados no es vacío: con una salida que contiene "Bogotá" dos veces
marca `¿Hay ciudades duplicadas? SÍ`, tal como se comprobó de forma aislada.

## MiniReto 3: Entrega de la v0.1

- `README.md` explica qué es el proyecto, cómo se ejecuta y qué preguntas de negocio
  responde el reporte.
- `package.json` expone los comandos `npm run reporte`, `npm run depuracion`,
  `npm run verificar`, `npm run explorar` y `npm test`.
- El historial de Git queda con un commit por cada MiniReto del día.

### Cambios técnicos que acompañaron la v0.1

- Los módulos pasaron de `import`/`export` a `require`/`module.exports`, según el requisito
  de integración de módulos con `require`. Se actualizó `package.json` (se retiró
  `"type": "module"`) y `jsconfig.json` (`module: CommonJS`, `moduleResolution: Node`).
- Se eliminó de `src/datos.js` el `import` de `normalizarCiudad`, que no se usaba en ese
  archivo y creaba una dependencia circular entre `datos.js` y `analitica.js`.
- El historial de ventas (`VENTAS`) se conserva sin modificar: los 12 registros originales
  siguen siendo la fuente de datos del reporte.
