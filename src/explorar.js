const {
  ticketPromedio,
  totalVendido,
  unidadesVendidas,
  valorVenta,
  ventaMayor,
  ventasPorCiudad,
} = require("./analitica.js");
const { VENTAS } = require("./datos.js");

console.log("Valor de la primera venta:", valorVenta(VENTAS[0]));
console.log("Total vendido:", totalVendido(VENTAS));
console.log("Unidades vendidas:", unidadesVendidas(VENTAS));
console.log("Venta mayor:", ventaMayor(VENTAS));
console.log("Ticket promedio:", ticketPromedio(VENTAS));
console.log("Ventas Medellín:", ventasPorCiudad(VENTAS, "Medellín"));

console.log(`Propiedades del producto: ${Object.keys(VENTAS[0]).join(", ")}`);

console.log("Ventas totales:");
console.table(VENTAS);

// Pruebas con arreglos vacíos
console.log("\nPRUEBAS CON ARREGLO VACÍO");

console.log("Total:", totalVendido([]));
console.log("Unidades:", unidadesVendidas([]));
console.log("Venta mayor:", ventaMayor([]));
console.log("Ticket promedio:", ticketPromedio([]));
console.log("Ventas ciudad:", ventasPorCiudad([], "Medellín"));
