# Cafe Origen Analitica - Bitacora Semana 1, dia 1

## MiniReto 1: Diccionario de datos

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

## MiniReto 2: Plan de indicadores en pseudocódigo

Antes de comenzar a programar las funciones de análisis, definí el siguiente plan para calcular los indicadores solicitados por la gerente de Café Origen.

### 1. valorVenta(venta)

Objetivo: Calcular el valor total de una venta multiplicando la cantidad por el precio unitario.

Pseudocódigo:

INICIO
    RECIBIR una venta
    OBTENER la cantidad de productos
    OBTENER el precio unitario
    MULTIPLICAR cantidad por precio
    DEVOLVER el resultado
FIN

- Qué recorro: No recorro un arreglo, recibo un solo objeto.
- Condición: No necesita una condición.
- Qué acumulo: No acumulo valores.
- Valor inicial: No necesita un acumulador.

### 2. totalVendido(ventas)

Objetivo: Calcular cuánto dinero ha vendido Café Origen en total.

Pseudocódigo:

INICIO
    total = 0

    PARA CADA venta EN ventas HACER
        valor = cantidad * precio
        total = total + valor
    FIN PARA

    DEVOLVER total
FIN

- Qué recorro: Todos los registros del arreglo ventas.
- Condición: No se necesita una condición adicional porque las ventas con cantidad 0 aportan cero al total.
- Qué acumulo: El valor de todas las ventas.
- Valor inicial: 0.

### 3. unidadesVendidas(ventas)

Objetivo: Calcular la cantidad total de unidades vendidas.

Pseudocódigo:

INICIO
    unidades = 0

    PARA CADA venta EN ventas HACER
        SI cantidad > 0 ENTONCES
            unidades = unidades + cantidad
        FIN SI
    FIN PARA

    DEVOLVER unidades
FIN

- Qué recorro: Todos los registros del arreglo ventas.
- Condición: La cantidad debe ser mayor que 0.
- Qué acumulo: La cantidad de unidades vendidas.
- Valor inicial: 0.

### 4. ventaMayor(ventas)

Objetivo: Encontrar la venta que generó la mayor cantidad de dinero.

Pseudocódigo:

INICIO
    ventaMayor = NULO
    mayorValor = 0

    PARA CADA venta EN ventas HACER
        valor = cantidad * precio

        SI valor > mayorValor ENTONCES
            mayorValor = valor
            ventaMayor = venta
        FIN SI
    FIN PARA

    DEVOLVER ventaMayor
FIN

- Qué recorro: Todos los registros del arreglo ventas.
- Condición: El valor de la venta debe ser mayor que el valor máximo encontrado.
- Qué acumulo: Guardo el mayor valor y el objeto de la venta correspondiente.
- Valor inicial: mayorValor = 0 y ventaMayor = null.

Caso especial: Si el arreglo está vacío, devolveré null porque no existe una venta que pueda considerarse la mayor.

### 5. ticketPromedio(ventas)

Objetivo: Calcular el promedio de dinero generado por cada venta válida.

Pseudocódigo:

INICIO
    total = 0
    contador = 0

    PARA CADA venta EN ventas HACER
        SI cantidad > 0 ENTONCES
            valor = cantidad * precio
            total = total + valor
            contador = contador + 1
        FIN SI
    FIN PARA

    SI contador > 0 ENTONCES
        promedio = total / contador
    SINO
        promedio = 0
    FIN SI

    DEVOLVER promedio
FIN

- Qué recorro: Todos los registros del arreglo ventas.
- Condición: Solo se consideran ventas con cantidad mayor que 0.
- Qué acumulo: El dinero total de las ventas válidas y la cantidad de ventas válidas.
- Valor inicial: total = 0 y contador = 0.

Caso especial: Si no existen ventas válidas, devolveré 0 para evitar una división entre cero y el resultado NaN.

### 6. ventasPorCiudad(ventas, ciudad)

Objetivo: Calcular cuánto dinero se vendió en una ciudad específica.

Pseudocódigo:

INICIO
    total = 0
    ciudadBuscada = convertir ciudad a minúsculas
    eliminar espacios sobrantes de ciudadBuscada

    PARA CADA venta EN ventas HACER
        ciudadVenta = convertir venta.ciudad a minúsculas
        eliminar espacios sobrantes de ciudadVenta

        SI ciudadVenta ES IGUAL a ciudadBuscada ENTONCES
            valor = cantidad * precio
            total = total + valor
        FIN SI
    FIN PARA

    DEVOLVER total
FIN

- Qué recorro: Todos los registros del arreglo ventas.
- Condición: La ciudad de la venta debe coincidir con la ciudad solicitada, ignorando mayúsculas y espacios sobrantes.
- Qué acumulo: El valor total de las ventas de la ciudad seleccionada.
- Valor inicial: 0.

Caso especial: Si no hay ventas en la ciudad solicitada o el arreglo está vacío, devolveré 0.

### Conclusión

Antes de implementar las funciones, definí cómo recorrer los datos, qué condiciones aplicar y qué valores utilizar para iniciar los acumuladores y contadores.

Utilizaré ciclos for...of para recorrer los registros y mantendré las funciones independientes, recibiendo el arreglo de ventas como parámetro.

También tendré en cuenta los arreglos vacíos y las ventas con cantidad igual a cero para evitar errores en los cálculos.

## MiniReto 3: Del ciclo al método, rankings y agrupaciones

### 1. totalVendidoM(ventas)

- ¿Qué recorro? Todos los registros del arreglo ventas.
- ¿Qué filtro? No filtro registros.
- ¿Qué transformo? Cada venta en su valor total mediante valorVenta().
- ¿Qué acumulo? El dinero total de todas las ventas.
- ¿Cómo agrupo? No realizo agrupaciones, solamente una suma con reduce().

### 2. unidadesVendidasM(ventas)

- ¿Qué recorro? Todos los registros de ventas.
- ¿Qué filtro? Ventas con cantidad mayor que cero.
- ¿Qué transformo? Los registros en cantidades de unidades.
- ¿Qué acumulo? El total de unidades vendidas.
- ¿Cómo agrupo? No agrupo, sumo las unidades con reduce().

### 3. ventasPorCiudadM(ventas, ciudad)

- ¿Qué recorro? Todos los registros de ventas.
- ¿Qué filtro? Selecciono las ventas que coinciden con la ciudad solicitada.
- ¿Qué transformo? Normalizo los nombres de las ciudades con trim() y toLowerCase().
- ¿Qué acumulo? El dinero vendido en la ciudad seleccionada.
- ¿Cómo agrupo? No agrupo todas las ciudades, calculo el total de una ciudad específica.

### 4. totalPorCiudad(ventas)

- ¿Qué recorro? Todos los registros de ventas.
- ¿Qué filtro? No filtro registros.
- ¿Qué transformo? Normalizo los nombres de las ciudades para evitar duplicados.
- ¿Qué acumulo? El valor total de las ventas de cada ciudad.
- ¿Cómo agrupo? Utilizo un objeto como diccionario y reduce() para guardar el total de cada ciudad.

### 5. unidadesPorProducto(ventas)

- ¿Qué recorro? Todos los registros de ventas.
- ¿Qué filtro? No filtro registros.
- ¿Qué transformo? Cada registro en una cantidad asociada a un producto.
- ¿Qué acumulo? Las unidades vendidas de cada producto.
- ¿Cómo agrupo? Utilizo el nombre del producto como clave de un objeto y sumo sus cantidades.

### 6. topProductosPorValor(ventas, k)

- ¿Qué recorro? Todos los registros de ventas.
- ¿Qué filtro? No filtro registros.
- ¿Qué transformo? Agrupo los productos y convierto los resultados en objetos mediante map().
- ¿Qué acumulo? El dinero generado por cada producto.
- ¿Cómo agrupo? Utilizo reduce() y Object.entries().
- ¿Cómo ordeno? Utilizo sort() para ordenar de mayor a menor.
- ¿Cómo selecciono? Utilizo slice() para obtener los primeros k productos.

### Conclusión

En este MiniReto aprendí a utilizar métodos de arreglos para simplificar
los recorridos y agrupaciones de datos.

También aprendí a utilizar objetos como diccionarios para agrupar
información por ciudad y producto.

Para realizar los rankings utilicé reduce(), map(), Object.entries(),
sort() y slice().

Las funciones nuevas se comparan con las versiones anteriores
para comprobar que producen los mismos resultados.

El arreglo original se conserva sin modificaciones.