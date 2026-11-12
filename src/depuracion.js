/**
 * Depuración sistemática de los errores reportados por la gerencia (v0.1).
 *
 * Ejecutable con: node src/depuracion.js
 *
 * Este script reproduce los dos errores reportados contra las implementaciones
 * de la versión preliminar y contrasta el resultado con el motor de v0.1
 * (src/analitica.js). Termina con una verificación automática del reporte
 * completo: busca NaN, undefined y grupos duplicados en la salida real.
 */

const { execFileSync } = require("child_process");
const path = require("path");

const { VENTAS } = require("./datos.js");
const {
  claveCiudad,
  resumenDelDia,
  resumenPorCiudad,
  ticketPromedio,
  totalVendido,
  ventasDelDia,
} = require("./analitica.js");

const LINEA = "═".repeat(78);
const SEPARADOR = "─".repeat(78);

/**
 * Versión preliminar: agrupa por el texto crudo de la ciudad.
 * @param {import('./datos.js').Venta[]} ventas - Ventas a agrupar.
 * @returns {Record<string, number>} Totales por ciudad sin normalizar.
 */
function versionPreliminarTotalPorCiudad(ventas) {
  const acumulador = {};

  for (const venta of ventas) {
    if (!acumulador[venta.ciudad]) {
      acumulador[venta.ciudad] = 0;
    }

    acumulador[venta.ciudad] += venta.cantidad * venta.precio;
  }

  return acumulador;
}

/**
 * Versión preliminar: divide el total entre la cantidad de ventas sin validar
 * que exista al menos una venta.
 * @param {import('./datos.js').Venta[]} ventas - Ventas del día.
 * @returns {number} El ticket promedio (puede ser NaN).
 */
function versionPreliminarTicketPromedio(ventas) {
  return totalVendido(ventas) / ventas.length;
}

/**
 * Versión preliminar: interpreta "YYYY-MM-DD" como UTC y compara en hora local.
 * @param {import('./datos.js').Venta[]} ventas - Ventas a filtrar.
 * @param {Date} fecha - Fecha objetivo.
 * @returns {import('./datos.js').Venta[]} Ventas del día.
 */
function versionPreliminarVentasDelDia(ventas, fecha) {
  return ventas.filter((venta) => {
    const fechaVenta = new Date(venta.fecha);
    return (
      fechaVenta.getDate() === fecha.getDate() &&
      fechaVenta.getMonth() === fecha.getMonth() &&
      fechaVenta.getFullYear() === fecha.getFullYear()
    );
  });
}

/**
 * Versión preliminar: capitaliza la primera letra "de palabra" con \b, que en
 * JavaScript no reconoce las letras acentuadas como caracteres de palabra.
 * @param {string} ciudad - Ciudad a normalizar.
 * @returns {string} Ciudad normalizada (con las tildes deformadas).
 */
function versionPreliminarNormalizarCiudad(ciudad) {
  return ciudad
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\p{L}/gu, (letra) => letra.toUpperCase());
}

/**
 * Imprime un bloque de texto con título.
 * @param {string} titulo - Título del bloque.
 * @param {string[]} lineas - Líneas del bloque.
 * @returns {void}
 */
function bloque(titulo, lineas) {
  console.log("");
  console.log(SEPARADOR);
  console.log(` ${titulo}`);
  console.log(SEPARADOR);
  for (const linea of lineas) {
    console.log(`  ${linea}`);
  }
}

/**
 * Imprime el resultado de una comparación entre la versión preliminar y v0.1.
 * @param {string} nombre - Nombre de la comparación.
 * @param {string} preliminar - Resultado de la versión preliminar.
 * @param {string} versionV01 - Resultado de la versión v0.1.
 * @returns {void}
 */
function comparar(nombre, preliminar, versionV01) {
  console.log(`  ${nombre}`);
  console.log(`    Versión preliminar : ${preliminar}`);
  console.log(`    Versión v0.1       : ${versionV01}`);
}

console.log(LINEA);
console.log("  CAFÉ ORIGEN · DEPURACIÓN DE ERRORES REPORTADOS · v0.1");
console.log(LINEA);

// ---------------------------------------------------------------------------
// Error 1 (reportado por la gerencia): "Bogotá aparecía dos veces".
// ---------------------------------------------------------------------------
const VENTAS_PRELIMINARES = [
  { id: 101, fecha: "2026-09-01", cliente: "C02", producto: "Origen Nariño 250 g", ciudad: "Bogotá", cantidad: 1, precio: 26000 },
  { id: 102, fecha: "2026-09-02", cliente: "C03", producto: "Prensa francesa", ciudad: " bogotá ", cantidad: 1, precio: 95000 },
  { id: 103, fecha: "2026-09-03", cliente: "C04", producto: "Origen Huila 500 g", ciudad: "Bogota", cantidad: 2, precio: 42000 },
  { id: 104, fecha: "2026-09-04", cliente: "C05", producto: "Origen Sierra 500 g", ciudad: "Medellín", cantidad: 1, precio: 45000 },
  { id: 105, fecha: "2026-09-04", cliente: "C06", producto: "Origen Sierra 500 g", ciudad: "medellín", cantidad: 3, precio: 45000 },
];

const ciudadFalsa = "Bogotá";
const preliminaryGroups = versionPreliminarTotalPorCiudad(VENTAS_PRELIMINARES);
const gruposPreliminares = Object.keys(preliminaryGroups).filter(
  (ciudad) => claveCiudad(ciudad) === claveCiudad(ciudadFalsa)
);
const gruposV01 = resumenPorCiudad(VENTAS_PRELIMINARES).filter(
  (grupo) => claveCiudad(grupo.ciudad) === claveCiudad(ciudadFalsa)
);

bloque("ERROR 1 · Ciudades duplicadas en el reporte", [
  "Síntoma: en 'Ventas por ciudad' la ciudad Bogotá aparecía dos veces.",
  "Entrada: ventas con la ciudad escrita como 'Bogotá', ' bogotá ' y 'Bogota'.",
  "",
  "Prueba A — versión preliminar (agrupa por el texto crudo):",
  ...Object.entries(preliminaryGroups).map(([ciudad, total]) => `  · ${JSON.stringify(ciudad)} → $ ${total.toLocaleString("es-CO")}`),
  `  Filas para Bogotá en la versión preliminar: ${gruposPreliminares.length}`,
  "",
  "Prueba B — versión v0.1 (agrupa por clave canónica):",
  ...gruposV01.map((grupo) => `  · ${grupo.ciudad} → $ ${grupo.total.toLocaleString("es-CO")} (${grupo.ventas} ventas)`),
  `  Filas para Bogotá en la versión v0.1: ${gruposV01.length}`,
  "",
  "Prueba C — datos reales del historial:",
  `  · Ciudades distintas en el historial: ${[...new Set(VENTAS.map((v) => v.ciudad))].join(", ")}`,
  `  · Grupos en la versión preliminar: ${Object.keys(versionPreliminarTotalPorCiudad(VENTAS)).length}`,
  `  · Grupos en la versión v0.1: ${resumenPorCiudad(VENTAS).length}`,
]);

// ---------------------------------------------------------------------------
// Error 2 (reportado por la gerencia): ticket promedio NaN en un día sin ventas.
// ---------------------------------------------------------------------------
const diaSinVentas = "2026-09-07";
const ventasDelDiaSinVentas = ventasDelDia(VENTAS, diaSinVentas);
const ticketPreliminar = versionPreliminarTicketPromedio(ventasDelDiaSinVentas);
const ticketV01 = ticketPromedio(ventasDelDiaSinVentas);

bloque("ERROR 2 · Ticket promedio NaN al filtrar un día sin ventas", [
  "Síntoma: el ticket promedio mostraba NaN al filtrar un día sin ventas.",
  `Entrada: ventas del ${diaSinVentas} (0 registros) sobre el historial de ${VENTAS.length} ventas.`,
  "",
  "Prueba A — versión preliminar (total / cantidad de ventas):",
  `  · Total vendido del día: $ ${totalVendido(ventasDelDiaSinVentas).toLocaleString("es-CO")}`,
  `  · Registros del día: ${ventasDelDiaSinVentas.length}`,
  `  · Ticket promedio: ${ticketPreliminar}`,
  `  · ¿Es NaN? ${Number.isNaN(ticketPreliminar) ? "SÍ (error reportado)" : "no"}`,
  "",
  "Prueba B — versión v0.1 (ticketPromedio con guardia de divisor):",
  `  · Ticket promedio: ${ticketV01}`,
  `  · ¿Es NaN? ${Number.isNaN(ticketV01) ? "SÍ" : "no"}`,
  `  · Resumen completo del día: ${JSON.stringify(resumenDelDia(VENTAS, diaSinVentas))}`,
]);

// ---------------------------------------------------------------------------
// Error 3 (encontrado durante la verificación de v0.1): ventasDelDia con un
// día de desfase porque "YYYY-MM-DD" se interpreta como UTC.
// ---------------------------------------------------------------------------
const diaObjetivo = "2026-09-01";
const ventasPreliminaresDia = versionPreliminarVentasDelDia(VENTAS, new Date(2026, 8, 1));
const ventasV01Dia = ventasDelDia(VENTAS, new Date(2026, 8, 1));

bloque("ERROR 3 · ventasDelDia devolvía el día equivocado (desfase de zona horaria)", [
  "Síntoma: el resumen de un día con ventas mostraba los datos del día siguiente.",
  "Entrada: VENTAS y la fecha local new Date(2026, 8, 1) (1 de septiembre de 2026).",
  "",
  "Prueba A — versión preliminar (new Date('YYYY-MM-DD') se interpreta como UTC):",
  `  · new Date('2026-09-01') en hora local: ${new Date("2026-09-01").toString()}`,
  `  · Ventas devueltas: [${ventasPreliminaresDia.map((venta) => venta.id).join(", ")}] (fechas: ${[...new Set(ventasPreliminaresDia.map((venta) => venta.fecha))].join(", ")})`,
  "",
  "Prueba B — versión v0.1 (comparación de la clave de día 'YYYY-MM-DD'):",
  `  · Ventas devueltas: [${ventasV01Dia.map((venta) => venta.id).join(", ")}] (fechas: ${[...new Set(ventasV01Dia.map((venta) => venta.fecha))].join(", ")})`,
  `  · Dia esperado: ${diaObjetivo} → ${ventasV01Dia.length === 2 ? "OK" : "FALLA"}`,
]);

// ---------------------------------------------------------------------------
// Error 4 (encontrado durante la verificación de v0.1): la normalización
// deformaba las tildes y las unidades de medida.
// ---------------------------------------------------------------------------
bloque("ERROR 4 · La normalización deformaba tildes y unidades de medida", [
  "Síntoma: los nombres salían como 'BogotÁ' y los productos como 'Origen Huila 500 G'.",
  "Entrada: los textos 'Bogotá', 'Medellín' y 'Origen Huila 500 g'.",
  "",
  "Prueba A — versión preliminar (\\b no reconoce letras acentuadas):",
  `  · normalizarCiudad('Bogotá')   → ${JSON.stringify(versionPreliminarNormalizarCiudad("Bogotá"))}`,
  `  · normalizarCiudad('Medellín') → ${JSON.stringify(versionPreliminarNormalizarCiudad("Medellín"))}`,
  "",
  "Prueba B — versión v0.1:",
  `  · claveCiudad('Bogotá')   → ${JSON.stringify(claveCiudad("Bogotá"))}`,
  `  · Ciudades en el reporte: ${JSON.stringify(resumenPorCiudad(VENTAS).map((grupo) => grupo.ciudad))}`,
]);

// ---------------------------------------------------------------------------
// Verificación final del reporte completo.
// ---------------------------------------------------------------------------
const rutaReporte = path.join(__dirname, "reporte.js");
const salida = execFileSync(process.execPath, [rutaReporte], { encoding: "utf8" });

const bloqueCiudad = salida.split("2. VENTAS POR CIUDAD")[1].split("3. UNIDADES POR PRODUCTO")[0];
const ciudadesEnTabla = bloqueCiudad
  .split("\n")
  .filter((linea) => linea.includes("│"))
  .map((linea) => {
    const coincidencia = /│\s*'([^']*)'\s*│/.exec(linea);
    return coincidencia ? coincidencia[1] : null;
  })
  .filter(Boolean);

const ciudadesUnicas = new Set(ciudadesEnTabla);
const hayNaN = salida.includes("NaN");
const hayUndefined = salida.includes("undefined");

console.log("");
console.log(SEPARADOR);
console.log(" VERIFICACIÓN FINAL DEL REPORTE COMPLETO (node src/reporte.js)");
console.log(SEPARADOR);
console.log(`  · ¿Aparece "NaN" en la salida?        ${hayNaN ? "SÍ → FALLA" : "no"}`);
console.log(`  · ¿Aparece "undefined" en la salida?  ${hayUndefined ? "SÍ → FALLA" : "no"}`);
console.log(`  · Ciudades en la tabla del reporte:   ${ciudadesEnTabla.length}`);
console.log(`  · Ciudades distintas:                 ${ciudadesUnicas.size}`);
console.log(`  · ¿Hay ciudades duplicadas?           ${ciudadesUnicas.size === ciudadesEnTabla.length ? "no" : "SÍ → FALLA"}`);
console.log(`  · ¿Las 4 secciones están presentes?   ${["1. RESUMEN GENERAL", "2. VENTAS POR CIUDAD", "3. UNIDADES POR PRODUCTO", "4. TOP 3 DE PRODUCTOS POR VALOR"].every((titulo) => salida.includes(titulo)) ? "sí" : "no → FALLA"}`);

const todoCorrecto = !hayNaN && !hayUndefined && ciudadesUnicas.size === ciudadesEnTabla.length;
console.log("");
console.log(`  RESULTADO: ${todoCorrecto ? "OK — la v0.1 no presenta ninguno de los errores reportados" : "FALLA — revisar"}`);
console.log(LINEA);

process.exitCode = todoCorrecto ? 0 : 1;
