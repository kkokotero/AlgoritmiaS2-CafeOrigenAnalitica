
/**
 * Normaliza el nombre de una ciudad.
 * @param {string} ciudad - El nombre de la ciudad a normalizar.
 * @returns {string} El nombre de la ciudad normalizado.
 */
export const normalizarCiudad = (ciudad) => {
  return ciudad
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\p{L}/gu, (letra) => letra.toUpperCase());
};
/**
 * Calcula el valor total de una venta.
 * @param {import('./datos.js').Venta} venta - La venta para la cual calcular el valor.
 * @returns {number} El valor total de la venta.
 */
export function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

/**
 * Calcula el total vendido.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @returns {number} El total vendido.
 */
export function totalVendido(ventas) {
  let total = 0;

  for (const venta of ventas) {
    total += valorVenta(venta);
  }

  return total;
}

/**
 * Calcula la cantidad total de unidades vendidas.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular las unidades vendidas.
 * @returns {number} La cantidad total de unidades vendidas.
 */
export function unidadesVendidas(ventas) {
  let unidades = 0;

  for (const venta of ventas) {
    unidades += venta.cantidad;
  }

  return unidades;
}

/**
 * Encuentra la venta con el valor total más alto.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para buscar la venta mayor.
 * @returns {import('./datos.js').Venta | undefined} La venta con el valor total más alto, o undefined si no hay ventas.
 */
export function ventaMayor(ventas) {
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
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el ticket promedio.
 * @returns {number} El ticket promedio, o 0 si no hay ventas con cantidad mayor a 0.
 */
export function ticketPromedio(ventas) {
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
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @param {string} ciudad - La ciudad para la cual calcular el total de ventas.
 * @returns {number} El total de ventas para la ciudad especificada.
 */
export function ventasPorCiudad(ventas, ciudad) {
  let total = 0;
  const ciudadNormalizada = normalizarCiudad(ciudad);

  for (const venta of ventas) {
    if (normalizarCiudad(venta.ciudad) === ciudadNormalizada) {
      total += valorVenta(venta);
    }
  }

  return total;
}
