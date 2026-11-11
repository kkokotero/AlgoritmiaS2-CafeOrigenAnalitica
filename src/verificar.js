import { VENTAS } from "./datos.js";

import {
    totalVendido,
    unidadesVendidas,
    ventasPorCiudad,
    totalVendidoM,
    unidadesVendidasM,
    ventasPorCiudadM
} from "./analitica.js";

/**
 * Verifica si dos resultados son iguales.
 * @template T
 * @param {string} nombre - El nombre del test.
 * @param {T} resultadoCiclo - El resultado del método con ciclo.
 * @param {T} resultadoMetodo - El resultado del método con método.
 */
function verificar(nombre, resultadoCiclo, resultadoMetodo) {
    if (resultadoCiclo === resultadoMetodo) {
        console.log(`${nombre}: OK`);
    } else {
        console.log(`${nombre}: DIFERENTE`);
        console.log("Ciclo:", resultadoCiclo);
        console.log("Método:", resultadoMetodo);
    }
}

// Comparaciones
verificar(
    "Total vendido",
    totalVendido(VENTAS),
    totalVendidoM(VENTAS)
);

verificar(
    "Unidades vendidas",
    unidadesVendidas(VENTAS),
    unidadesVendidasM(VENTAS)
);

verificar(
    "Ventas por Medellín",
    ventasPorCiudad(VENTAS, "Medellín"),
    ventasPorCiudadM(VENTAS, "Medellín")
);