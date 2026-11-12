/**
 * Reporte de negocio de Café Origen (v0.1).
 *
 * Ejecutable con: node src/reporte.js
 *
 * El reporte integra el módulo de datos (datos.js) con el motor de analítica
 * (analitica.js) y presenta cuatro secciones más el resumen por día, en un
 * formato de informe legible por consola para la gerencia.
 */

const { VENTAS } = require("./datos.js");
const {
  fechasConVentas,
  formatearMoneda,
  formatearNumero,
  resumenDelDia,
  resumenPorCiudad,
  resumenPorProducto,
  ticketPromedio,
  topProductosPorValor,
  totalVendidoM,
  unidadesVendidasM,
  ventaMayor,
} = require("./analitica.js");

const ANCHO = 78;
const ETIQUETAS = 38;

const LINEA = "═".repeat(ANCHO);
const SEPARADOR = "─".repeat(ANCHO);

/**
 * Imprime el encabezado del reporte.
 * @returns {void}
 */
function encabezado() {
  const generado = new Date().toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  console.log(LINEA);
  console.log("  CAFÉ ORIGEN · REPORTE DE VENTAS · v0.1");
  console.log(`  Generado: ${generado} · Registros analizados: ${formatearNumero(VENTAS.length)}`);
  console.log(LINEA);
}

/**
 * Imprime el título de una sección.
 * @param {string | number} numero - Número de la sección.
 * @param {string} titulo - Título de la sección.
 * @returns {void}
 */
function seccion(numero, titulo) {
  console.log("");
  console.log(SEPARADOR);
  console.log(` ${numero}. ${titulo.toLocaleUpperCase("es")}`);
  console.log(SEPARADOR);
}

/**
 * Imprime una fila con puntitos de guía entre la etiqueta y el valor.
 * @param {string} etiqueta - Texto de la etiqueta.
 * @param {string} valor - Texto del valor.
 * @returns {void}
 */
function fila(etiqueta, valor) {
  const puntos = ".".repeat(Math.max(3, ETIQUETAS - etiqueta.length));
  console.log(`  ${etiqueta} ${puntos} ${valor}`);
}

/**
 * Formatea una fecha "YYYY-MM-DD" en el formato colombiano dd/mm/aaaa.
 * @param {string} fecha - Fecha en formato "YYYY-MM-DD".
 * @returns {string} La fecha formateada, o el texto original si no es válida.
 */
function formatearFecha(fecha) {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);

  if (!coincidencia) {
    return fecha;
  }

  return `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`;
}

/**
 * Calcula la fecha del día siguiente a la última venta registrada.
 * @param {string} fecha - Fecha en formato "YYYY-MM-DD".
 * @returns {string} La fecha del día siguiente en formato "YYYY-MM-DD".
 */
function diaSiguiente(fecha) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const siguiente = new Date(Date.UTC(anio, mes - 1, dia + 1));
  return siguiente.toISOString().slice(0, 10);
}

/**
 * Imprime la sección 1: resumen general de las ventas.
 * @returns {void}
 */
function seccionResumenGeneral() {
  const total = totalVendidoM(VENTAS);
  const unidades = unidadesVendidasM(VENTAS);
  const ticket = ticketPromedio(VENTAS);
  const mayor = ventaMayor(VENTAS);

  seccion(1, "Resumen general");

  fila("Ventas registradas", formatearNumero(VENTAS.length));
  fila("Unidades vendidas", formatearNumero(unidades));
  fila("Total vendido", formatearMoneda(total));
  fila("Ticket promedio", formatearMoneda(ticket));

  if (mayor) {
    fila(
      "Venta mayor",
      `${formatearMoneda(mayor.cantidad * mayor.precio)} · #${mayor.id} · ${mayor.producto}`
    );
    fila("  Fecha de la venta mayor", formatearFecha(mayor.fecha));
  } else {
    fila("Venta mayor", "Sin ventas registradas");
  }

  const ciudades = resumenPorCiudad(VENTAS);
  fila("Ciudades con ventas", formatearNumero(ciudades.length));
  fila(
    "Ciudad líder",
    ciudades.length > 0 ? `${ciudades[0].ciudad} (${formatearMoneda(ciudades[0].total)})` : "—"
  );
}

/**
 * Imprime la sección 2: ventas por ciudad.
 * @returns {void}
 */
function seccionVentasPorCiudad() {
  const ciudades = resumenPorCiudad(VENTAS);
  const total = totalVendidoM(VENTAS);

  seccion(2, "Ventas por ciudad");

  console.table(
    ciudades.map((ciudad) => ({
      Ciudad: ciudad.ciudad,
      Ventas: formatearNumero(ciudad.ventas),
      Unidades: formatearNumero(ciudad.unidades),
      Total: formatearMoneda(ciudad.total),
      Participación: `${total > 0 ? ((ciudad.total / total) * 100).toFixed(1) : "0.0"}%`,
    }))
  );
}

/**
 * Imprime la sección 3: unidades por producto.
 * @returns {void}
 */
function seccionUnidadesPorProducto() {
  const productos = resumenPorProducto(VENTAS);

  seccion(3, "Unidades por producto");

  console.table(
    productos.map((producto) => ({
      Producto: producto.producto,
      Unidades: formatearNumero(producto.unidades),
      Valor: formatearMoneda(producto.total),
      Participación: `${producto.participacion.toFixed(1)}%`,
    }))
  );
}

/**
 * Imprime la sección 4: top 3 de productos por valor.
 * @returns {void}
 */
function seccionTopProductos() {
  const top = topProductosPorValor(VENTAS, 3);
  const total = totalVendidoM(VENTAS);

  seccion(4, "Top 3 de productos por valor");

  if (top.length === 0) {
    fila("Resultado", "Sin ventas registradas");
    return;
  }

  top.forEach((producto, indice) => {
    const participacion = total > 0 ? (producto.total / total) * 100 : 0;
    const etiqueta = `${indice + 1}. ${producto.producto}`;
    const puntos = ".".repeat(Math.max(3, ETIQUETAS + 2 - etiqueta.length));
    console.log(
      `  ${etiqueta} ${puntos} ${formatearMoneda(producto.total)} (${participacion.toFixed(1)}%)`
    );
  });
}

/**
 * Imprime la sección 5: resumen de un día con ventas y de un día sin ventas.
 * @returns {void}
 */
function seccionResumenPorDia() {
  const fechas = fechasConVentas(VENTAS);
  const diaConVentas = fechas[0];
  const diaSinVentas = diaSiguiente(fechas[fechas.length - 1]);

  seccion(5, "Resumen por día (día con ventas y día sin ventas)");

  const conVentas = resumenDelDia(VENTAS, diaConVentas);
  const sinVentas = resumenDelDia(VENTAS, diaSinVentas);

  console.log(`  Día con ventas · ${formatearFecha(conVentas.fecha)}`);
  fila("    Ventas registradas", formatearNumero(conVentas.ventas));
  fila("    Unidades vendidas", formatearNumero(conVentas.unidades));
  fila("    Total vendido", formatearMoneda(conVentas.total));
  fila("    Ticket promedio", formatearMoneda(conVentas.ticketPromedio));
  fila(
    "    Venta mayor",
    conVentas.ventaMayor
      ? `${formatearMoneda(conVentas.ventaMayor.cantidad * conVentas.ventaMayor.precio)} · #${conVentas.ventaMayor.id} · ${conVentas.ventaMayor.producto}`
      : "Sin ventas registradas"
  );

  console.log("");
  console.log(`  Día sin ventas · ${formatearFecha(sinVentas.fecha)}`);
  fila("    Ventas registradas", formatearNumero(sinVentas.ventas));
  fila("    Unidades vendidas", formatearNumero(sinVentas.unidades));
  fila("    Total vendido", formatearMoneda(sinVentas.total));
  fila("    Ticket promedio", formatearMoneda(sinVentas.ticketPromedio));
  fila(
    "    Estado",
    sinVentas.ventas === 0
      ? "Sin ventas registradas para esta fecha (valores en cero, no es un error)"
      : "Con ventas registradas"
  );

  console.log("");
  console.table([
    {
      Fecha: formatearFecha(conVentas.fecha),
      Situación: "Con ventas",
      Ventas: formatearNumero(conVentas.ventas),
      Unidades: formatearNumero(conVentas.unidades),
      Total: formatearMoneda(conVentas.total),
      "Ticket promedio": formatearMoneda(conVentas.ticketPromedio),
    },
    {
      Fecha: formatearFecha(sinVentas.fecha),
      Situación: "Sin ventas",
      Ventas: formatearNumero(sinVentas.ventas),
      Unidades: formatearNumero(sinVentas.unidades),
      Total: formatearMoneda(sinVentas.total),
      "Ticket promedio": formatearMoneda(sinVentas.ticketPromedio),
    },
  ]);
}

encabezado();
seccionResumenGeneral();
seccionVentasPorCiudad();
seccionUnidadesPorProducto();
seccionTopProductos();
seccionResumenPorDia();
console.log("");
console.log(LINEA);
console.log("  Fin del reporte · Café Origen · v0.1");
console.log(LINEA);
