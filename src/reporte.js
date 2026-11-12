import { VENTAS } from "./datos.js";
import { formatearMoneda, totalVendidoM, unidadesVendidasM, ventaMayor, totalPorCiudad } from "./analitica.js";

const resumen = {
    total: totalVendidoM(VENTAS),
    unidades: unidadesVendidasM(VENTAS),
    ventas: {
        mayor: ventaMayor(VENTAS),
        "por-ciudad": totalPorCiudad(VENTAS)
    }
};

