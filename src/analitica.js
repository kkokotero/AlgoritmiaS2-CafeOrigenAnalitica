
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
 * Normaliza el nombre de un producto.
 * @param {string} nombre - El nombre del producto a normalizar.
 * @returns {string} El nombre del producto normalizado.
 */
export const normalizarNombre = (nombre) => {
  return nombre
    .trim()
    .replace(/\b\p{L}/gu, (letra) => letra.toUpperCase());
}

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
 * Calcula el total vendido.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @returns {number} El total vendido.
 */
export function totalVendidoM(ventas) {
    return ventas.reduce((total, venta) => total + valorVenta(venta), 0);
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
 * Calcula la cantidad total de unidades vendidas.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular las unidades vendidas.
 * @returns {number} La cantidad total de unidades vendidas.
 */
export function unidadesVendidasM(ventas) {
    return ventas.reduce((total, venta) => total + venta.cantidad, 0);
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

/**
 * Calcula el total de ventas para una ciudad específica.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @param {string} ciudad - La ciudad para la cual calcular el total de ventas.
 * @returns {number} El total de ventas para la ciudad especificada.
 */
export function ventasPorCiudadM(ventas, ciudad) {
    const ciudadNormalizada = normalizarCiudad(ciudad);
    return ventas.reduce((total, venta) => {
        if (normalizarCiudad(venta.ciudad) === ciudadNormalizada) {
            return total + valorVenta(venta);
        }
        return total;
    }, 0);
}

/**
 * Calcula el total de ventas para una ciudad específica.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @returns {Record<string, number>} Un objeto con las ciudades como claves y el total de ventas como valores.
 */
export function totalPorCiudad(ventas) {
    /** @type {Record<string, number>} */
    const acumulador = {};

    for (const venta of ventas) {
        const ciudadNormalizada = normalizarCiudad(venta.ciudad);

        if (!acumulador[ciudadNormalizada]) {
            acumulador[ciudadNormalizada] = 0;
        }

        acumulador[ciudadNormalizada] += valorVenta(venta);
    }

    return acumulador;
}

/**
 * Calcula el total de ventas para una ciudad específica.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @returns {Record<string, number>} Un objeto con las ciudades como claves y el total de ventas como valores.
 */
export function unidadesPorProducto(ventas) {
    /** @type {Record<string, number>} */
    const acumulador = {};

    for (const venta of ventas) {
        const producto = normalizarNombre(venta.producto);

        if (!acumulador[producto]) {
            acumulador[producto] = 0;
        }

        acumulador[producto] += venta.cantidad;
    }

    return acumulador;
}

/**
 * Obtiene los productos con más valor de venta.
 * @param {import('./datos.js').Venta[]} ventas - El array de ventas para calcular el total.
 * @param {number} topN - El número de productos top a devolver.
 * @returns {Array<{producto: string, total: number}>} Un array con los productos top y su total de ventas.
 */
export function topProductosPorValor(ventas, topN = 5) {
    /** @type {Record<string, number>} */
    const acumulador = {};

    for (const venta of ventas) {
        const producto = normalizarNombre(venta.producto);

        if (!acumulador[producto]) {
            acumulador[producto] = 0;
        }

        acumulador[producto] += valorVenta(venta);
    }

    const productosOrdenados = Object.entries(acumulador)
        .sort(([, valorA], [, valorB]) => valorB - valorA)
        .slice(0, topN);

    return productosOrdenados.map(([producto, total]) => ({ producto, total }));
}