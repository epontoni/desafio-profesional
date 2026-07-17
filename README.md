# Digital Booking - Plataforma de Reservas

Este proyecto es una plataforma web para la reserva de alojamientos (Hoteles, Hostels, Departamentos y Bed and Breakfast) que permite gestionar de forma robusta la disponibilidad de los servicios. Está desarrollado bajo una arquitectura moderna desacoplada con un **Backend en Java Spring Boot** y un **Frontend en React (Vite)**.

---

## 01. Definición del Proyecto

**Digital Booking** es una solución digital diseñada para conectar a viajeros con su alojamiento ideal. La plataforma provee:
*   **Búsqueda interactiva** de ofertas en base a ubicación y fechas.
*   **Clasificación por categorías** (Hoteles, Departamentos, Hostels, B&B) para facilitar el filtrado.
*   **Detalle completo del producto** con descripciones detalladas, listado de comodidades (Wi-Fi, piscina) y galería de imágenes responsiva de 5 fotos con visualizador (Lightbox/Slideshow).
*   **Panel de administración** en escritorio para registrar nuevos alojamientos con múltiples imágenes, verificar duplicidad de nombres y listar/eliminar productos de la base de datos de manera dinámica.

---

## 02. Diseño de Identidad de Marca

La identidad de la marca está alineada con valores de confort, seguridad y modernidad.

### Logotipo e Isologotipo
*   **Logo ("Db")**: Un isotipo minimalista cuadrado en color pizarra con letras blancas que simboliza una base de datos segura y una reserva sólida.
*   **Lema (Slogan)**: *"Sentite como en tu hogar"*, transmitiendo calidez y hospitalidad.

### Paleta de Colores
*   **Pizarra Oscuro (Primary Dark)**: `#383B58` (Representa profesionalismo, estabilidad y elegancia).
*   **Teal Vibrante (Accent)**: `#1DBEB4` (Representa frescura, dinamismo e innovación tecnológica).
*   **Gris Suave (Background)**: `#F3F3F4` (Mantiene el fondo limpio y permite que las imágenes del catálogo resalten).
*   **Carbono (Text Dark)**: `#1A1B2F` (Asegura un alto contraste y legibilidad óptima).

---

## 03. Estructura del Repositorio

```text
desafio-profesional/
├── api/             # Backend en Spring Boot 3.x/4.x (Java 21, Maven, H2 DB)
└── frontend/        # Frontend en React (Vite, React Router, Lucide, Vanilla CSS)
```

---

## 04. Instrucciones de Ejecución

### Backend (Spring Boot API)
El backend requiere Java 17 o superior (desarrollado con Java 21) y utiliza una base de datos **H2** en memoria autosebrada con 12 productos reales al iniciar.

1.  Navegar a la carpeta `api`:
    ```bash
    cd api
    ```
2.  Compilar y ejecutar la aplicación (ejemplo usando el wrapper de Maven):
    ```bash
    ./mvnw spring-boot:run
    ```
3.  La API estará disponible en `http://localhost:8080`.
4.  La consola de H2 se puede acceder en `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:digitalbookingdb`, usuario: `sa`, sin contraseña).

### Frontend (React)
El frontend se ejecuta sobre Node.js utilizando Vite.

1.  Navegar a la carpeta `frontend`:
    ```bash
    cd frontend
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Iniciar el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abrir en el navegador `http://localhost:5173`.

---

## 05. Planificación y Ejecución de los Tests (QA)

Se planificaron y ejecutaron pruebas manuales sobre las 11 User Stories de este Sprint. Todos los criterios de aceptación fueron validados exitosamente.

### Matriz de Casos de Prueba (Sprint 1)

| ID Story | Historia de Usuario | Casos de Prueba Planificados | Resultado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **#1** | Colocar encabezado | 1. Verificar visualización del logo y lema a la izquierda.<br>2. Probar redirección al hacer clic en el logo.<br>3. Verificar botones de cuenta en resoluciones desktop/mobile. | Redirecciona a `/` correctamente. Ocupa el 100% de la pantalla y queda sticky al hacer scroll. | **PASS** |
| **#2** | Definir el cuerpo | 1. Verificar color de fondo `#F3F3F4` en toda la web.<br>2. Validar que la sección ocupe el 100% del alto disponible.<br>3. Validar presencia de las 3 secciones (buscador, categorías, recomendaciones). | Cumple con la paleta corporativa y muestra todas las secciones de manera fluida. | **PASS** |
| **#3** | Registrar producto | 1. Intentar agregar un producto con nombre único.<br>2. Intentar agregar un producto con un nombre que ya existe en la DB.<br>3. Validar la inserción de múltiples URLs de imagen. | Bloquea nombres duplicados y arroja error 400 *"El nombre del producto ya está en uso"* en pantalla. Guarda correctamente en H2. | **PASS** |
| **#4** | Visualizar aleatorios | 1. Verificar que al cargar la sección "Recomendaciones Aleatorias" se muestren máximo 10 productos.<br>2. Validar que no haya duplicados.<br>3. Verificar distribución de grilla. | Muestra hasta 10 productos aleatorios distintos barajados desde el backend. | **PASS** |
| **#5** | Detalle de producto | 1. Hacer clic en "Ver detalle" e ingresar al producto.<br>2. Validar header del detalle (título a la izquierda, flecha a la derecha).<br>3. Verificar descripción e imágenes. | Navegación e información de producto cargan fluidamente desde la API. | **PASS** |
| **#6** | Galería de imágenes | 1. Validar grilla de 5 imágenes (1 grande a la izquierda, 4 pequeñas a la derecha en Desktop).<br>2. Probar botón "Ver más".<br>3. Probar que el visualizador (slideshow/modal) permita recorrer las fotos y cerrarse. | Galería responsiva colapsa en mobile y expande en modal carrusel interactivo al presionar "Ver más". | **PASS** |
| **#7** | Pie de página | 1. Verificar footer al final de la página (ancho 100%).<br>2. Validar isologotipo, año actual y copyright.<br>3. Validar íconos sociales. | Footer responsivo color `#1DBEB4` con año actualizado y links a redes sociales. | **PASS** |
| **#8** | Paginar productos | 1. Entrar en la pestaña "Catálogo Completo".<br>2. Validar la limitación a 10 productos por página.<br>3. Probar botones de navegación (Inicio, Anterior, Siguiente). | Control de páginas operativo en base al paginado de Spring Boot. | **PASS** |
| **#9** | Panel de administración | 1. Acceder a `/administracion` desde PC (Ver panel).<br>2. Acceder a `/administracion` desde dispositivo móvil (Verificar bloqueo). | En pantallas móviles (<768px) bloquea el panel y muestra el mensaje indicando no estar disponible. | **PASS** |
| **#10** | Listar productos | 1. Ingresar a "Lista de productos" en el panel.<br>2. Validar columnas: Id, Nombre y Acciones. | Tabla muestra todos los alojamientos de la DB listados en orden. | **PASS** |
| **#11** | Eliminar producto | 1. Presionar "Eliminar" en un producto de la lista.<br>2. Seleccionar "Cancelar" en el modal de confirmación (No borrar).<br>3. Seleccionar "Confirmar" (Eliminar de DB y actualizar lista). | Modal de doble confirmación bloquea eliminaciones accidentales y borra definitivamente de H2 al confirmar. | **PASS** |

### Matriz de Casos de Prueba (Sprint 2)

| ID Story | Historia de Usuario | Casos de Prueba Planificados | Resultado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **#12** | Categorizar productos | 1. Crear producto nuevo seleccionando categoría desde combo.<br>2. Validar que se persista en DB correctamente. | Combo box carga categorías desde la API; persiste la relación Many-to-One. | **PASS** |
| **#13** | Registrar usuario | 1. Probar registro con datos vacíos.<br>2. Probar formato incorrecto de email.<br>3. Validar longitud de contraseña menor a 6 caracteres.<br>4. Registrar usuario válido. | Frena inputs erróneos y muestra mensajes específicos. Cifra el password en SHA-256 en base de datos. | **PASS** |
| **#14** | Identificar usuario | 1. Probar login con credenciales erróneas.<br>2. Loguearse con cuenta registrada.<br>3. Verificar avatar con iniciales (e.g. "JP" para Juan Pérez). | Rechaza accesos inválidos con banner de error. Inicia sesión mostrando avatar circular y nombre. | **PASS** |
| **#15** | Cerrar sesión | 1. Hacer clic en el avatar para abrir dropdown.<br>2. Presionar "Cerrar sesión".<br>3. Comprobar que limpie sesión e impida acceso a páginas restringidas. | Remueve el token de localStorage y redirecciona de forma segura a Home en modo anónimo. | **PASS** |
| **#16** | Identificar administrador | 1. Loguearse con usuario común y forzar URL `/administracion`.<br>2. Loguearse con admin y promover usuario común.<br>3. Comprobar permisos. | Bloquea usuarios comunes con aviso de Acceso Denegado. Dashboard de asignación de roles operativo. | **PASS** |
| **#17** | Administrar característica | 1. Ingresar a sección características en Admin.<br>2. Añadir característica (ej. "Gimnasio") y elegir ícono.<br>3. Vincular característica a un nuevo producto. | Guarda la característica en DB y permite seleccionarla vía checkbox al crear alojamientos. | **PASS** |
| **#18** | Visualizar características | 1. Abrir detalle de un alojamiento.<br>2. Verificar grilla "Características" con sus íconos correspondientes. | Renderiza grilla responsiva mapeando nombres a íconos Lucide. | **PASS** |
| **#19** | Notificación (Opcional) | 1. Registrar usuario exitosamente.<br>2. Validar en logs de backend que se intente enviar / simule correo de bienvenida. | Captura la acción y loguea/simula el correo de bienvenida con credenciales y link de login. | **PASS** |
| **#20** | Sección de categorías | 1. Clic en tarjeta de categoría (ej. "Departamentos").<br>2. Comprobar filtrado e indicador de cantidades.<br>3. Presionar "Quitar filtro". | Filtra catálogo en base a la API paginada, mostrando conteos exactos e interactivos. | **PASS** |
| **#21** | Agregar categoría | 1. Ingresar a sección categorías en Admin.<br>2. Añadir título, descripción y URL de foto.<br>3. Confirmar persistencia en catálogo Home. | Registra la nueva categoría dinámicamente y la renderiza de inmediato en las tarjetas superiores del Home. | **PASS** |

