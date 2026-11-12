/**
 * Motor de analítica de ventas de Café Origen (v0.1).
 *
 * Todas las funciones de este módulo son puras: reciben los datos por parámetro,
 * nunca modifican los arreglos de entrada y siempre devuelven un resultado
 * determinista. Ninguna función devuelve NaN ni undefined por datos vacíos o
 * mal formados: los casos degenerados devuelven 0, [] o un texto vacío.
 */

/**
 * Normaliza el nombre de una ciudad para mostrarlo de forma consistente.
 *
 * Reglas: recorta espacios, colapsa espacios repetidos, pasa a minúsculas y
 * capitaliza únicamente la primera letra de cada palabra. No se deforman las
 * tildes: "Bogotá" sigue siendo "Bogotá" y no "BogotÁ".
 *
 * @param {string} ciudad - El nombre de la ciudad a normalizar.
 * @returns {string} El nombre de la ciudad normalizado.
 */
function normalizarCiudad(ciudad) {
  if (typeof ciudad !== "string") {
    return "";
  }

  return ciudad
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("es")
    .replace(/(^|\s)(\p{L})/gu, (match, espacio, letra) => {
      return espacio + letra.toLocaleUpperCase("es");
    });
}

/**
 * Calcula la clave canónica de una ciudad, usada para agrupar ventas.
 *
 * La clave ignora mayúsculas, tildes y espacios sobrantes, de modo que
 * "Bogotá", " bogota " y "BOGOTÁ" pertenecen al mismo grupo.
 *
 * @param {string} ciudad - El nombre de la ciudad.
 * @returns {string} La clave canónica de la ciudad.
 */
function claveCiudad(ciudad) {
  return normalizarCiudad(ciudad)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es");
}

/**
 * Normaliza el nombre de un producto para mostrarlo de forma consistente.
 *
 * Reglas: recorta espacios y colapsa espacios repetidos, pero respeta las
 * mayúsculas del dato original para no deformar las unidades de medida
 * ("Origen Huila 500 g" no debe convertirse en "Origen Huila 500 G").
 *
 * @param {string} nombre - El nombre del producto a normalizar.
 * @returns {string} El nombre del producto normalizado.
 */
function normalizarNombre(nombre) {
  if (typeof nombre !== "string") {
    return "";
  }

  return nombre.trim().replace(/\s+/g, " ");
}

/**
 * Calcula la clave canónica de un producto, usada para agrupar ventas.
 *
 * La clave ignora mayúsculas y tildes, de modo que "Prensa Francesa" y
 * "prensa francesa" pertenecen al mismo grupo.
 *
 * @param {string} nombre - El nombre del producto.
 * @returns {string} La clave canónica del producto.
 */
function claveProducto(nombre) {
  return normalizarNombre(nombre)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es");
}

/**
 * Calcula el valor total de una venta.
 * @param {import('./datos.js').Venta} venta - La venta para la cual calcular el valor.
 * @returns {number} El valor total de la venta.
 */
function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

/**
 * Calcula el total vendido.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @returns {number} El total vendido.
 */
function totalVendido(ventas) {
  let total = 0;

  for (const venta of ventas) {
    total += valorVenta(venta);
  }

  return total;
}

/**
 * Calcula el total vendido.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @returns {number} El total vendido.
 */
function totalVendidoM(ventas) {
  return ventas.reduce((total, venta) => total + valorVenta(venta), 0);
}

/**
 * Calcula la cantidad total de unidades vendidas.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular las unidades vendidas.
 * @returns {number} La cantidad total de unidades vendidas.
 */
function unidadesVendidas(ventas) {
  let unidades = 0;

  for (const venta of ventas) {
    unidades += venta.cantidad;
  }

  return unidades;
}

/**
 * Calcula la cantidad total de unidades vendidas.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular las unidades vendidas.
 * @returns {number} La cantidad total de unidades vendidas.
 */
function unidadesVendidasM(ventas) {
  return ventas.reduce((total, venta) => total + venta.cantidad, 0);
}

/**
 * Encuentra la venta con el valor total más alto.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para buscar la venta mayor.
 * @returns {import('./datos.js').Venta | undefined} La venta con el valor total más alto, o undefined si no hay ventas.
 */
function ventaMayor(ventas) {
  /** @type {import('./datos.js').Venta | undefined} */
  let mayor = undefined;
  let maxValor = -Infinity;

  for (const venta of ventas) {
    const valor = valorVenta(venta);

    if (valor > maxValor) {
      maxValor = valor;
      mayor = venta;
    }
  }

  return mayor;
}

/**
 * Calcula el ticket promedio de las ventas.
 *
 * Solo considera ventas con cantidad mayor a cero. Si no hay ventas válidas
 * devuelve 0 (nunca NaN): este es el cálculo que fallaba cuando se filtraba
 * un día sin ventas.
 *
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el ticket promedio.
 * @returns {number} El ticket promedio, o 0 si no hay ventas con cantidad mayor a 0.
 */
function ticketPromedio(ventas) {
  let total = 0;
  let contador = 0;

  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      total += valorVenta(venta);
      contador++;
    }
  }

  return contador > 0 ? total / contador : 0;
}

/**
 * Calcula el total de ventas para una ciudad específica.
 *
 * La comparación ignora mayúsculas, tildes y espacios sobrantes.
 *
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @param {string} ciudad - La ciudad para la cual calcular el total de ventas.
 * @returns {number} El total de ventas para la ciudad especificada.
 */
function ventasPorCiudad(ventas, ciudad) {
  let total = 0;
  const ciudadNormalizada = claveCiudad(ciudad);

  for (const venta of ventas) {
    if (claveCiudad(venta.ciudad) === ciudadNormalizada) {
      total += valorVenta(venta);
    }
  }

  return total;
}

/**
 * Calcula el total de ventas para una ciudad específica.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @param {string} ciudad - La ciudad para la cual calcular el total de ventas.
 * @returns {number} El total de ventas para la ciudad especificada.
 */
function ventasPorCiudadM(ventas, ciudad) {
  const ciudadNormalizada = claveCiudad(ciudad);
  return ventas.reduce((total, venta) => {
    if (claveCiudad(venta.ciudad) === ciudadNormalizada) {
      return total + valorVenta(venta);
    }
    return total;
  }, 0);
}

/**
 * Calcula el total de ventas por ciudad.
 *
 * Agrupa por la clave canónica de la ciudad, de modo que una misma ciudad
 * escrita de varias formas ("Bogotá", " bogotá ", "Bogota") produce un único
 * grupo. La etiqueta mostrada es la primera forma normalizada encontrada.
 *
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @returns {Record<string, number>} Un objeto con las ciudades como claves y el total de ventas como valores.
 */
function totalPorCiudad(ventas) {
  const totales = new Map();
  const etiquetas = new Map();

  for (const venta of ventas) {
    const clave = claveCiudad(venta.ciudad);

    if (!totales.has(clave)) {
      totales.set(clave, 0);
      etiquetas.set(clave, normalizarCiudad(venta.ciudad));
    }

    totales.set(clave, totales.get(clave) + valorVenta(venta));
  }

  /** @type {Record<string, number>} */
  const resultado = {};

  for (const [clave, total] of totales) {
    resultado[etiquetas.get(clave)] = total;
  }

  return resultado;
}

/**
 * Calcula el detalle de ventas por ciudad: cantidad de ventas, unidades y valor.
 *
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas a resumir.
 * @returns {Array<{ciudad: string, ventas: number, unidades: number, total: number}>} El resumen por ciudad, ordenado de mayor a menor por valor.
 */
function resumenPorCiudad(ventas) {
  const grupos = new Map();

  for (const venta of ventas) {
    const clave = claveCiudad(venta.ciudad);

    if (!grupos.has(clave)) {
      grupos.set(clave, {
        ciudad: normalizarCiudad(venta.ciudad),
        ventas: 0,
        unidades: 0,
        total: 0,
      });
    }

    const grupo = grupos.get(clave);
    grupo.ventas++;
    grupo.unidades += venta.cantidad;
    grupo.total += valorVenta(venta);
  }

  return [...grupos.values()].sort((a, b) => b.total - a.total || a.ciudad.localeCompare(b.ciudad, "es"));
}

/**
 * Calcula la cantidad de unidades vendidas por producto.
 *
 * Agrupa por la clave canónica del producto para no duplicar grupos.
 *
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @returns {Record<string, number>} Un objeto con los productos como claves y las unidades como valores.
 */
function unidadesPorProducto(ventas) {
  const unidades = new Map();
  const etiquetas = new Map();

  for (const venta of ventas) {
    const clave = claveProducto(venta.producto);

    if (!unidades.has(clave)) {
      unidades.set(clave, 0);
      etiquetas.set(clave, normalizarNombre(venta.producto));
    }

    unidades.set(clave, unidades.get(clave) + venta.cantidad);
  }

  /** @type {Record<string, number>} */
  const resultado = {};

  for (const [clave, total] of unidades) {
    resultado[etiquetas.get(clave)] = total;
  }

  return resultado;
}

/**
 * Calcula el detalle de ventas por producto: unidades, valor y participación.
 *
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas a resumir.
 * @returns {Array<{producto: string, unidades: number, total: number, participacion: number}>} El resumen por producto, ordenado de mayor a menor por valor.
 */
function resumenPorProducto(ventas) {
  const grupos = new Map();
  const totalGeneral = totalVendido(ventas);

  for (const venta of ventas) {
    const clave = claveProducto(venta.producto);

    if (!grupos.has(clave)) {
      grupos.set(clave, {
        producto: normalizarNombre(venta.producto),
        unidades: 0,
        total: 0,
      });
    }

    const grupo = grupos.get(clave);
    grupo.unidades += venta.cantidad;
    grupo.total += valorVenta(venta);
  }

  return [...grupos.values()]
    .map((grupo) => ({
      ...grupo,
      participacion: totalGeneral > 0 ? (grupo.total / totalGeneral) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total || a.producto.localeCompare(b.producto, "es"));
}

/**
 * Obtiene los productos con más valor de venta.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @param {number} topN - El número de productos top a devolver.
 * @returns {Array<{producto: string, total: number}>} Un array con los productos top y su total de ventas.
 */
function topProductosPorValor(ventas, topN = 5) {
  return resumenPorProducto(ventas)
    .slice(0, topN)
    .map((grupo) => ({ producto: grupo.producto, total: grupo.total }));
}

/**
 * Convierte una fecha a la clave de día "YYYY-MM-DD" sin cruzar zonas horarias.
 *
 * Si la fecha es un texto "YYYY-MM-DD" se usa tal cual. Si es un objeto Date
 * se toman sus componentes locales. Nunca se usa new Date("YYYY-MM-DD") para
 * comparar, porque esa cadena se interpreta como UTC y desplaza el día un día
 * hacia atrás en zonas horarias como America/Bogota.
 *
 * @param {string | Date} fecha - La fecha a convertir.
 * @returns {string} La clave de día "YYYY-MM-DD", o "" si la fecha no es válida.
 */
function claveDia(fecha) {
  if (typeof fecha === "string") {
    const coincidencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(fecha.trim());
    return coincidencia ? `${coincidencia[1]}-${coincidencia[2]}-${coincidencia[3]}` : "";
  }

  if (fecha instanceof Date) {
    if (Number.isNaN(fecha.getTime())) {
      return "";
    }

    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }

  return "";
}

/**
 * Obtiene las ventas para una fecha específica.
 *
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para filtrar.
 * @param {string | Date} fecha - La fecha para filtrar las ventas ("YYYY-MM-DD" o Date).
 * @returns {import('./datos.js').Venta[]} Un array con las ventas para la fecha especificada.
 */
function ventasDelDia(ventas, fecha) {
  const objetivo = claveDia(fecha);

  if (!objetivo) {
    return [];
  }

  return ventas.filter((venta) => claveDia(venta.fecha) === objetivo);
}

/**
 * Lista las fechas con ventas registradas, ordenadas de menor a mayor.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas a revisar.
 * @returns {string[]} Las fechas con ventas en formato "YYYY-MM-DD".
 */
function fechasConVentas(ventas) {
  const fechas = new Set();

  for (const venta of ventas) {
    const clave = claveDia(venta.fecha);

    if (clave) {
      fechas.add(clave);
    }
  }

  return [...fechas].sort();
}

/**
 * Calcula el resumen de las ventas de un día concreto.
 *
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas a resumir.
 * @param {string | Date} fecha - La fecha a resumir ("YYYY-MM-DD" o Date).
 * @returns {{fecha: string, ventas: number, unidades: number, total: number, ticketPromedio: number, ventaMayor: import('./datos.js').Venta | null}} El resumen del día.
 */
function resumenDelDia(ventas, fecha) {
  const delDia = ventasDelDia(ventas, fecha);

  return {
    fecha: claveDia(fecha),
    ventas: delDia.length,
    unidades: unidadesVendidas(delDia),
    total: totalVendido(delDia),
    ticketPromedio: ticketPromedio(delDia),
    ventaMayor: ventaMayor(delDia) ?? null,
  };
}

/**
 * Formatea un número con separadores de miles Colombianos.
 * @param {number | bigint | string} valor - El valor a formatear.
 * @returns {string} El número formateado.
 */
function formatearNumero(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero.toLocaleString("es-CO") : "0";
}

/**
 * Formatea un valor como moneda colombiana.
 * @param {number | bigint | string} moneda - El valor a formatear como moneda.
 * @returns {string} La moneda formateada.
 */
function formatearMoneda(moneda) {
  const numero = Number(moneda);

  if (!Number.isFinite(numero)) {
    return (0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  return numero.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

module.exports = {
  claveCiudad,
  claveDia,
  claveProducto,
  fechasConVentas,
  formatearMoneda,
  formatearNumero,
  normalizarCiudad,
  normalizarNombre,
  resumenDelDia,
  resumenPorCiudad,
  resumenPorProducto,
  ticketPromedio,
  topProductosPorValor,
  totalPorCiudad,
  totalVendido,
  totalVendidoM,
  unidadesPorProducto,
  unidadesVendidas,
  unidadesVendidasM,
  valorVenta,
  ventaMayor,
  ventasDelDia,
  ventasPorCiudad,
  ventasPorCiudadM,
};
