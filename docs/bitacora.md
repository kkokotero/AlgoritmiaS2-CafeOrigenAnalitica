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

## Casos borde detectados

Después de revisar los 12 registros del historial de ventas de Café Origen, identifiqué los siguientes problemas de calidad en los datos y las decisiones que tomaré para solucionarlos durante el análisis.

### 1. Diferencias en los nombres de las ciudades

Problema:
En los registros aparecen ciudades escritas de diferentes maneras. Por ejemplo, "Medellín" y "medellín". Esto puede provocar que el programa las interprete como dos ciudades diferentes al momento de agrupar las ventas.

Registro afectado:
- Venta con ID 5: ciudad "medellín".
- Otras ventas: ciudad "Medellín".

Decisión:
Utilizaré los métodos trim() y toLowerCase() para eliminar espacios innecesarios y comparar los nombres sin distinguir entre mayúsculas y minúsculas. Al generar los reportes, mostraré el nombre de la ciudad correctamente como "Medellín".

### 2. Venta con cantidad igual a cero

Problema:
El registro con ID 8 tiene una cantidad de 0 unidades. Esto significa que no se vendió ningún producto en esa transacción, aunque existe un precio registrado de $42.000.

Registro afectado:
- Venta con ID 8: cantidad 0, precio 42000.

Decisión:
Conservaré el registro original para no perder información del historial. Sin embargo, no lo consideraré una venta válida para calcular el ticket promedio. Su valor total será cero porque cantidad × precio = 0.

### 3. Clientes repetidos en diferentes ventas

Problema:
Algunos clientes aparecen varias veces en el historial. Por ejemplo, el cliente C01 aparece en las ventas con ID 1, 4 y 11. Esto podría generar confusión si se interpreta cada registro como un cliente diferente.

Registros afectados:
- Cliente C01: ventas 1, 4 y 11.
- Cliente C02: ventas 2 y 7.
- Cliente C03: ventas 3 y 9.

Decisión:
No eliminaré los registros repetidos, porque representan compras diferentes realizadas por un mismo cliente. Mantendré cada venta como un registro independiente y utilizaré el código del cliente para identificar las compras de una misma persona.

### Conclusión

Los datos originales se conservarán sin modificaciones en el archivo datos.js. Las correcciones y normalizaciones se realizarán mediante las funciones de análisis cuando sean necesarias.

De esta manera evitaré perder información y garantizaré que los resultados de los reportes sean más precisos.