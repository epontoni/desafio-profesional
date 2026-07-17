package com.digitalbooking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class IndexController {

    @GetMapping(value = "/", produces = "text/html;charset=UTF-8")
    public ResponseEntity<String> getIndexPage() {
        String html = "<!DOCTYPE html>\n" +
                "<html lang=\"es\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>Digital Booking API - Index Dashboard</title>\n" +
                "    <link href=\"https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap\" rel=\"stylesheet\">\n" +
                "    <style>\n" +
                "        :root {\n" +
                "            --primary: #383B58;\n" +
                "            --accent: #1DBEB4;\n" +
                "            --bg: #F3F3F4;\n" +
                "            --text-dark: #1A1B2F;\n" +
                "            --text-medium: #4F5E74;\n" +
                "            --card-bg: #FFFFFF;\n" +
                "            --border: #E2E8F0;\n" +
                "            --radius: 12px;\n" +
                "            --shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);\n" +
                "            --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);\n" +
                "        }\n" +
                "        \n" +
                "        * {\n" +
                "            box-sizing: border-box;\n" +
                "            margin: 0;\n" +
                "            padding: 0;\n" +
                "        }\n" +
                "        \n" +
                "        body {\n" +
                "            font-family: 'Outfit', sans-serif;\n" +
                "            background-color: var(--bg);\n" +
                "            color: var(--text-dark);\n" +
                "            line-height: 1.6;\n" +
                "            padding: 40px 20px;\n" +
                "        }\n" +
                "        \n" +
                "        .container {\n" +
                "            max-width: 1000px;\n" +
                "            margin: 0 auto;\n" +
                "        }\n" +
                "        \n" +
                "        header {\n" +
                "            text-align: center;\n" +
                "            margin-bottom: 40px;\n" +
                "            padding: 30px;\n" +
                "            background: linear-gradient(135deg, var(--primary) 0%, #202236 100%);\n" +
                "            border-radius: var(--radius);\n" +
                "            color: white;\n" +
                "            box-shadow: var(--shadow-lg);\n" +
                "        }\n" +
                "        \n" +
                "        .logo {\n" +
                "            display: inline-flex;\n" +
                "            align-items: center;\n" +
                "            justify-content: center;\n" +
                "            background-color: var(--accent);\n" +
                "            color: white;\n" +
                "            font-size: 32px;\n" +
                "            font-weight: 800;\n" +
                "            width: 60px;\n" +
                "            height: 60px;\n" +
                "            border-radius: 8px;\n" +
                "            margin-bottom: 16px;\n" +
                "            box-shadow: 0 4px 10px rgba(29, 190, 180, 0.3);\n" +
                "        }\n" +
                "        \n" +
                "        h1 {\n" +
                "            font-size: 28px;\n" +
                "            font-weight: 800;\n" +
                "            margin-bottom: 8px;\n" +
                "        }\n" +
                "        \n" +
                "        .subtitle {\n" +
                "            font-size: 15px;\n" +
                "            color: rgba(255, 255, 255, 0.8);\n" +
                "            font-weight: 600;\n" +
                "        }\n" +
                "        \n" +
                "        .section-title {\n" +
                "            font-size: 20px;\n" +
                "            font-weight: 700;\n" +
                "            color: var(--primary);\n" +
                "            margin-bottom: 20px;\n" +
                "            border-left: 4px solid var(--accent);\n" +
                "            padding-left: 12px;\n" +
                "        }\n" +
                "        \n" +
                "        .grid {\n" +
                "            display: grid;\n" +
                "            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n" +
                "            gap: 20px;\n" +
                "            margin-bottom: 30px;\n" +
                "        }\n" +
                "        \n" +
                "        .card {\n" +
                "            background-color: var(--card-bg);\n" +
                "            border: 1px solid var(--border);\n" +
                "            border-radius: var(--radius);\n" +
                "            padding: 24px;\n" +
                "            box-shadow: var(--shadow);\n" +
                "            transition: transform 0.2s ease, box-shadow 0.2s ease;\n" +
                "        }\n" +
                "        \n" +
                "        .card:hover {\n" +
                "            transform: translateY(-3px);\n" +
                "            box-shadow: var(--shadow-lg);\n" +
                "        }\n" +
                "        \n" +
                "        .card h3 {\n" +
                "            font-size: 17px;\n" +
                "            font-weight: 700;\n" +
                "            color: var(--primary);\n" +
                "            margin-bottom: 14px;\n" +
                "            display: flex;\n" +
                "            justify-content: space-between;\n" +
                "            align-items: center;\n" +
                "        }\n" +
                "        \n" +
                "        .badge {\n" +
                "            font-size: 11px;\n" +
                "            font-weight: 700;\n" +
                "            padding: 4px 8px;\n" +
                "            border-radius: 4px;\n" +
                "            text-transform: uppercase;\n" +
                "        }\n" +
                "        \n" +
                "        .badge-get { background-color: #EBF8FF; color: #2B6CB0; }\n" +
                "        .badge-post { background-color: #E6FFFA; color: #319795; }\n" +
                "        .badge-put { background-color: #FEFCBF; color: #B7791F; }\n" +
                "        .badge-delete { background-color: #FFF5F5; color: #C53030; }\n" +
                "        .badge-console { background-color: #E2E8F0; color: #4A5568; }\n" +
                "        \n" +
                "        .endpoint-link {\n" +
                "            display: inline-block;\n" +
                "            color: var(--accent);\n" +
                "            font-weight: 700;\n" +
                "            text-decoration: none;\n" +
                "            font-size: 14px;\n" +
                "            margin-bottom: 8px;\n" +
                "            word-break: break-all;\n" +
                "        }\n" +
                "        \n" +
                "        .endpoint-link:hover {\n" +
                "            text-decoration: underline;\n" +
                "        }\n" +
                "        \n" +
                "        .description {\n" +
                "            font-size: 13px;\n" +
                "            color: var(--text-medium);\n" +
                "            font-weight: 500;\n" +
                "        }\n" +
                "        \n" +
                "        .divider {\n" +
                "            margin: 20px 0;\n" +
                "            border-bottom: 1px dashed var(--border);\n" +
                "        }\n" +
                "        \n" +
                "        footer {\n" +
                "            text-align: center;\n" +
                "            margin-top: 50px;\n" +
                "            font-size: 12px;\n" +
                "            color: var(--text-medium);\n" +
                "            font-weight: 600;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <header>\n" +
                "            <div class=\"logo\">Db</div>\n" +
                "            <h1>Digital Booking - Backend API REST</h1>\n" +
                "            <p class=\"subtitle\">Índice de Enlaces Disponibles del Servidor Local</p>\n" +
                "        </header>\n" +
                "        \n" +
                "        <h2 class=\"section-title\">Endpoints Públicos del Catálogo</h2>\n" +
                "        <div class=\"grid\">\n" +
                "            <div class=\"card\">\n" +
                "                <h3><span>Ver todo el Catálogo</span> <span class=\"badge badge-get\">GET</span></h3>\n" +
                "                <a href=\"/api/products\" class=\"endpoint-link\" target=\"_blank\">/api/products</a>\n" +
                "                <p class=\"description\">Retorna el listado completo de todos los alojamientos presembrados.</p>\n" +
                "            </div>\n" +
                "            <div class=\"card\">\n" +
                "                <h3><span>Recomendaciones Aleatorias</span> <span class=\"badge badge-get\">GET</span></h3>\n" +
                "                <a href=\"/api/products/random\" class=\"endpoint-link\" target=\"_blank\">/api/products/random</a>\n" +
                "                <p class=\"description\">Retorna hasta 10 alojamientos barajados al azar para el home.</p>\n" +
                "            </div>\n" +
                "            <div class=\"card\">\n" +
                "                <h3><span>Ficha de Producto</span> <span class=\"badge badge-get\">GET</span></h3>\n" +
                "                <a href=\"/api/products/1\" class=\"endpoint-link\" target=\"_blank\">/api/products/1</a>\n" +
                "                <p class=\"description\">Detalles del producto 1 (Hermitage Hotel), incluyendo características e imágenes.</p>\n" +
                "            </div>\n" +
                "            <div class=\"card\">\n" +
                "                <h3><span>Lista de Categorías</span> <span class=\"badge badge-get\">GET</span></h3>\n" +
                "                <a href=\"/api/categories\" class=\"endpoint-link\" target=\"_blank\">/api/categories</a>\n" +
                "                <p class=\"description\">Listado dinámico de tipos de alojamiento (Hoteles, Hostels, Departamentos, B&B).</p>\n" +
                "            </div>\n" +
                "            <div class=\"card\">\n" +
                "                <h3><span>Lista de Comodidades</span> <span class=\"badge badge-get\">GET</span></h3>\n" +
                "                <a href=\"/api/characteristics\" class=\"endpoint-link\" target=\"_blank\">/api/characteristics</a>\n" +
                "                <p class=\"description\">Listado global de características/amenities (Wifi, Piscina, Estacionamiento, etc.).</p>\n" +
                "            </div>\n" +
                "            <div class=\"card\">\n" +
                "                <h3><span>Reseñas del Alojamiento</span> <span class=\"badge badge-get\">GET</span></h3>\n" +
                "                <a href=\"/api/products/1/reviews\" class=\"endpoint-link\" target=\"_blank\">/api/products/1/reviews</a>\n" +
                "                <p class=\"description\">Obtiene la lista de reseñas y comentarios ordenados cronológicamente del hotel 1.</p>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        \n" +
                "        <h2 class=\"section-title\">Reservas e Historiales</h2>\n" +
                "        <div class=\"grid\">\n" +
                "            <div class=\"card\">\n" +
                "                <h3><span>Reservas por Producto</span> <span class=\"badge badge-get\">GET</span></h3>\n" +
                "                <a href=\"/api/bookings/product/1\" class=\"endpoint-link\" target=\"_blank\">/api/bookings/product/1</a>\n" +
                "                <p class=\"description\">Visualiza el listado de reservas tomadas para el producto 1 (útil para el calendario).</p>\n" +
                "            </div>\n" +
                "            <div class=\"card\">\n" +
                "                <h3><span>Historial de Reservas del Usuario</span> <span class=\"badge badge-get\">GET</span></h3>\n" +
                "                <a href=\"/api/bookings/user/user@digitalbooking.com\" class=\"endpoint-link\" target=\"_blank\">/api/bookings/user/user@digitalbooking.com</a>\n" +
                "                <p class=\"description\">Retorna el historial completo del usuario presembrado ordenado de más reciente a más antiguo.</p>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        \n" +
                "        <h2 class=\"section-title\">Base de Datos Local</h2>\n" +
                "        <div class=\"grid\">\n" +
                "            <div class=\"card\">\n" +
                "                <h3><span>Consola Visual H2</span> <span class=\"badge badge-console\">H2 CONSOLE</span></h3>\n" +
                "                <a href=\"/h2-console\" class=\"endpoint-link\" target=\"_blank\">/h2-console</a>\n" +
                "                <p class=\"description\">Consola interactiva SQL. Ingresa con los parámetros:<br><strong>JDBC URL</strong>: jdbc:h2:mem:digitalbookingdb<br><strong>Usuario</strong>: sa (contraseña vacía).</p>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        \n" +
                "        <footer>\n" +
                "            <p>© 2026 Digital Booking. Todos los derechos reservados. Desarrollado con Spring Boot 3.x/4.x</p>\n" +
                "        </footer>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
        return ResponseEntity.ok(html);
    }
}
