import { VENTAS } from "./datos.js";

console.log(`Cantidad de ventas: ${VENTAS.length}`);

console.log(`Primer venta: ${JSON.stringify(VENTAS[0])}`);
console.log(`Última venta: ${JSON.stringify(VENTAS[VENTAS.length - 1])}`);

console.log(`Propiedades del producto: ${Object.keys(VENTAS[0]).join(", ")}`);

console.log("Ventas totales:");
console.table(VENTAS);