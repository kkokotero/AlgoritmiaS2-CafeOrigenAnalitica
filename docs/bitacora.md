# Cafe Origen Analitica

## Diccionario de datos

El historial de ventas de Café Origen está representado mediante un arreglo de objetos llamado ventas. Cada objeto representa una venta realizada por un cliente y contiene las siguientes propiedades:

| Propiedad | Tipo de dato | Significado |
|-----------|--------------|-------------|
| id        | Number       | Identificador único de cada registro de venta. Permite diferenciar una venta de otra. |
| fecha     | String       | Fecha en la que se realizó la venta, expresada en formato YYYY-MM-DD. |
| cliente   | String       | Código que identifica al cliente que realizó la compra (por ejemplo, C01, C02). |
| producto  | String       | Nombre del producto que compró el cliente. |
| ciudad    | String       | Ciudad donde se realizó la venta. |
| cantidad  | Number       | Número de unidades del producto que se vendieron en esa transacción. |
| precio    | Number       | Precio unitario del producto, expresado en pesos colombianos (COP). |

### Estructura de los datos

- El historial contiene 12 registros de ventas.
- Cada registro es un objeto de JavaScript.
- Todos los objetos tienen las mismas siete propiedades.
- Los campos id, cantidad y precio son de tipo numérico (Number).
- Los campos fecha, cliente, producto y ciudad son de tipo texto (String).

### Observación

El precio corresponde al valor de una unidad del producto. Por lo tanto, para calcular el valor total de cada venta se debe multiplicar la cantidad por el precio.