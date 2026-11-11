import { ticketPromedio, totalVendido, unidadesVendidas, valorVenta, ventaMayor, ventasPorCiudad } from "./analitica.js";
import { VENTAS_CORREGIDAS } from "./datos.js";

console.log("Valor de la primera venta:", valorVenta(VENTAS_CORREGIDAS[0]));
console.log("Total vendido:", totalVendido(VENTAS_CORREGIDAS));
console.log("Unidades vendidas:", unidadesVendidas(VENTAS_CORREGIDAS));
console.log("Venta mayor:", ventaMayor(VENTAS_CORREGIDAS));
console.log("Ticket promedio:", ticketPromedio(VENTAS_CORREGIDAS));
console.log("Ventas Medellín:", ventasPorCiudad(VENTAS_CORREGIDAS, "Medellín"));

console.log(`Propiedades del producto: ${Object.keys(VENTAS_CORREGIDAS[0]).join(", ")}`);

console.log("Ventas totales:");
console.table(VENTAS_CORREGIDAS);

// Pruebas con arreglos vacíos
console.log("\nPRUEBAS CON ARREGLO VACÍO");

console.log("Total:", totalVendido([]));
console.log("Unidades:", unidadesVendidas([]));
console.log("Venta mayor:", ventaMayor([]));
console.log("Ticket promedio:", ticketPromedio([]));
console.log("Ventas ciudad:", ventasPorCiudad([], "Medellín"));