package com.digitalbooking.config;

import com.digitalbooking.controller.AuthController;
import com.digitalbooking.model.*;
import com.digitalbooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CharacteristicRepository characteristicRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    @Autowired
    public DataInitializer(ProductRepository productRepository, 
                           CategoryRepository categoryRepository,
                           CharacteristicRepository characteristicRepository,
                           UserRepository userRepository,
                           BookingRepository bookingRepository,
                           ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.characteristicRepository = characteristicRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Categories if empty
        if (categoryRepository.count() == 0) {
            categoryRepository.saveAll(Arrays.asList(
                new Category("Hoteles", "Alojamientos con servicio a la habitación, recepción 24hs y comodidades premium.", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80"),
                new Category("Hostels", "Dormitorios compartidos, cocinas comunes y ambientes ideales para conocer viajeros.", "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&auto=format&fit=crop&q=80"),
                new Category("Departamentos", "Espacios privados totalmente equipados con cocina y living. Sintiéndote como en casa.", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&auto=format&fit=crop&q=80"),
                new Category("Bed and breakfast", "Ambiente acogedor atendido por sus propios dueños, con un desayuno artesanal incluido.", "https://images.unsplash.com/photo-1549294413-26f195afcbce?w=500&auto=format&fit=crop&q=80")
            ));
        }

        // 2. Seed Characteristics if empty
        if (characteristicRepository.count() == 0) {
            characteristicRepository.saveAll(Arrays.asList(
                new Characteristic("Wi-Fi gratuito", "wifi"),
                new Characteristic("Piscina exterior", "waves"),
                new Characteristic("Estacionamiento", "car"),
                new Characteristic("Televisión", "tv"),
                new Characteristic("Aire acondicionado", "wind"),
                new Characteristic("Gimnasio", "dumbbell")
            ));
        }

        // 3. Seed Users if empty
        User admin = null;
        User normalUser = null;
        if (userRepository.count() == 0) {
            String hashedAdminPass = AuthController.hashPassword("admin123");
            String hashedUserPass = AuthController.hashPassword("user123");

            admin = new User("Admin", "Digital", "admin@digitalbooking.com", hashedAdminPass, "ROLE_ADMIN");
            normalUser = new User("Juan", "Pérez", "user@digitalbooking.com", hashedUserPass, "ROLE_USER");

            userRepository.saveAll(Arrays.asList(admin, normalUser));
            System.out.println("DataInitializer: Seeded default Admin (admin@digitalbooking.com / admin123) and User (user@digitalbooking.com / user123).");
        } else {
            admin = userRepository.findByEmail("admin@digitalbooking.com").orElse(null);
            normalUser = userRepository.findByEmail("user@digitalbooking.com").orElse(null);
        }

        // 4. Seed Products if empty
        if (productRepository.count() == 0) {
            Category hotelCat = categoryRepository.findByTitle("Hoteles").orElse(null);
            Category hostelCat = categoryRepository.findByTitle("Hostels").orElse(null);
            Category aptCat = categoryRepository.findByTitle("Departamentos").orElse(null);
            Category bbCat = categoryRepository.findByTitle("Bed and breakfast").orElse(null);

            Characteristic wifiChar = characteristicRepository.findByName("Wi-Fi gratuito").orElse(null);
            Characteristic poolChar = characteristicRepository.findByName("Piscina exterior").orElse(null);
            Characteristic tvChar = characteristicRepository.findByName("Televisión").orElse(null);
            Characteristic acChar = characteristicRepository.findByName("Aire acondicionado").orElse(null);

            List<Characteristic> hotelAmenities = Arrays.asList(wifiChar, poolChar, tvChar, acChar);
            List<Characteristic> aptAmenities = Arrays.asList(wifiChar, poolChar, tvChar);
            List<Characteristic> hostelAmenities = Arrays.asList(wifiChar, tvChar);
            List<Characteristic> bbAmenities = Collections.singletonList(wifiChar);

            Product p1 = new Product(
                    "Hermitage Hotel",
                    "Ubicado frente al mar, el Hermitage Hotel ofrece suites clásicas con vistas panorámicas, un spa de nivel internacional y una exquisita oferta gastronómica. Perfecto para relajarse escuchando las olas del Atlántico.",
                    hotelCat,
                    "Mar del Plata, Argentina",
                    8.5,
                    "Excelente",
                    hotelAmenities,
                    Arrays.asList(
                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                            "https://images.unsplash.com/photo-1582719478250-c89cae4db85b?w=800",
                            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
                            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
                            "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"
                    )
            );

            Product p2 = new Product(
                    "Apartment Premium Palermo",
                    "Disfruta de la vibrante vida urbana de Buenos Aires en este loft de diseño exclusivo. Equipado con balcón privado, piscina en la terraza y rodeado de los mejores bares y locales de moda.",
                    aptCat,
                    "Buenos Aires, Argentina",
                    9.2,
                    "Magnífico",
                    aptAmenities,
                    Arrays.asList(
                            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
                            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
                            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
                            "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?w=800",
                            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"
                    )
            );

            Product p3 = new Product(
                    "La Casa del Sol B&B",
                    "Cálida hostería rodeada de bosques y lagos en Bariloche. Ofrece un exquisito desayuno artesanal, habitaciones con detalles de madera de la región y chimenea a leña en el lobby común.",
                    bbCat,
                    "San Carlos de Bariloche, Argentina",
                    8.9,
                    "Excelente",
                    bbAmenities,
                    Arrays.asList(
                            "https://images.unsplash.com/photo-1549294413-26f195afcbce?w=800",
                            "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800",
                            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                            "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=800",
                            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800"
                    )
            );

            Product p4 = new Product(
                    "Hostel Patagonia Wave",
                    "El punto de encuentro ideal para mochileros y amantes del trekking. Ofrece dormitorios compartidos y privados, cocina común equipada, fogón nocturno y asesoramiento para excursiones al glaciar Perito Moreno.",
                    hostelCat,
                    "El Calafate, Argentina",
                    7.8,
                    "Bueno",
                    hostelAmenities,
                    Arrays.asList(
                            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
                            "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800",
                            "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
                            "https://images.unsplash.com/photo-1596563400594-2410945a8229?w=800",
                            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
                    )
            );

            Product p5 = new Product(
                    "Sheraton Executive Suites",
                    "Lujo contemporáneo en el centro de Mendoza. Cuenta con una piscina climatizada de borde infinito, spa y gimnasio de última generación, y una espectacular cava privada para cata de vinos locales.",
                    hotelCat,
                    "Mendoza, Argentina",
                    9.5,
                    "Excepcional",
                    hotelAmenities,
                    Arrays.asList(
                            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
                            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
                            "https://images.unsplash.com/photo-1554009975-d74653b849f1?w=800",
                            "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800",
                            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
                    )
            );

            Product p6 = new Product(
                    "Llao Llao Resort & Spa",
                    "Un clásico de renombre mundial enclavado en la cima de una colina rodeada de lagos y picos nevados. Ofrece campo de golf propio, piscina climatizada in/out y servicios de spa premium.",
                    hotelCat,
                    "San Carlos de Bariloche, Argentina",
                    9.8,
                    "Excepcional",
                    hotelAmenities,
                    Arrays.asList(
                            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
                            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
                            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
                            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
                            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800"
                    )
            );

            Product p7 = new Product(
                    "Hostel del Glaciar",
                    "Ambiente rústico y acogedor en el corazón de El Chaltén. Ideal para excursionistas, con desayuno buffet incluido, zona de secado de ropa de montaña y un bar con cervezas artesanales locales.",
                    hostelCat,
                    "El Chaltén, Argentina",
                    8.1,
                    "Muy bueno",
                    hostelAmenities,
                    Arrays.asList(
                            "https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800",
                            "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800",
                            "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
                            "https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?w=800",
                            "https://images.unsplash.com/photo-1521401830884-6c03c1c87efa?w=800"
                    )
            );

            Product p8 = new Product(
                    "Departamentos Céntricos Córdoba",
                    "Apartamentos modernos totalmente amueblados y ubicados en la zona céntrica. Cuentan con cocina completa, conexión de alta velocidad y cercanía a los principales museos e iglesias jesuíticas.",
                    aptCat,
                    "Córdoba, Argentina",
                    8.3,
                    "Muy bueno",
                    aptAmenities,
                    Arrays.asList(
                            "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
                            "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800",
                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
                            "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800",
                            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
                    )
            );

            Product p9 = new Product(
                    "B&B Colinas Verdes",
                    "Disfruta de la paz y las vistas serranas en Tandil. Habitaciones confortables con deck de madera privado, parque arbolado de una hectárea y una piscina exterior ideal para los días templados.",
                    bbCat,
                    "Tandil, Argentina",
                    8.7,
                    "Excelente",
                    bbAmenities,
                    Arrays.asList(
                            "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
                            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
                            "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
                            "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
                            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
                    )
            );

            Product p10 = new Product(
                    "Ibis Style Loft",
                    "Loft industrial remodelado a metros del río Paraná en Rosario. Posee detalles de ladrillo visto, mobiliario minimalista y está a distancia caminable del Monumento a la Bandera.",
                    aptCat,
                    "Rosario, Argentina",
                    8.0,
                    "Bueno",
                    aptAmenities,
                    Arrays.asList(
                            "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800",
                            "https://images.unsplash.com/photo-1560184897-ae756287534d?w=800",
                            "https://images.unsplash.com/photo-1560185893-a55cbc2c78a9?w=800",
                            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
                            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"
                    )
            );

            Product p11 = new Product(
                    "Design Suites Calafate",
                    "Elegante hotel boutique con arquitectura de vanguardia integrada a la estepa patagónica. Ofrece piscina climatizada, gimnasio con vista al Lago Argentino y sauna seco.",
                    hotelCat,
                    "El Calafate, Argentina",
                    9.0,
                    "Excelente",
                    hotelAmenities,
                    Arrays.asList(
                            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                            "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
                            "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
                            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
                            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800"
                    )
            );

            Product p12 = new Product(
                    "Camping & Cabins Huechulafquen",
                    "Cabañas acogedoras y parcelas de acampar a orillas del majestuoso Lago Huechulafquen, con vistas directas al Volcán Lanín. Una verdadera inmersión en la naturaleza salvaje.",
                    bbCat,
                    "Junín de los Andes, Argentina",
                    9.1,
                    "Magnífico",
                    bbAmenities,
                    Arrays.asList(
                            "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
                            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
                            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
                            "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800",
                            "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800"
                    )
            );

            productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12));
            System.out.println("DataInitializer: Dynamic Category-linked and Characteristic-linked products loaded successfully into H2 Database.");

            // 5. Seed Bookings
            LocalDate today = LocalDate.now();
            bookingRepository.saveAll(Arrays.asList(
                new Booking(today.plusDays(1), today.plusDays(4), p1, normalUser), // Hermitage Hotel booked next week
                new Booking(today.plusDays(10), today.plusDays(15), p1, normalUser),
                new Booking(today.plusDays(3), today.plusDays(7), p2, normalUser) // Apartment Premium Palermo booked
            ));
            System.out.println("DataInitializer: Seeded sample bookings for availability testing.");

            // 6. Seed Reviews (pre-populates stars and average rating calculations)
            reviewRepository.saveAll(Arrays.asList(
                new Review(5, "¡Excelente estadía! Las vistas al mar son de ensueño y el spa es sumamente relajante.", "Maria Gomez", today.minusDays(5), p1),
                new Review(4, "Muy lindo hotel, el desayuno es espectacular y la atención de primera. Volveremos.", "Carlos Ruiz", today.minusDays(2), p1),
                new Review(5, "Espectacular departamento en una zona inmejorable. Súper moderno y cómodo.", "Ana Clara", today.minusDays(1), p2),
                new Review(4, "Muy buena ubicación y conectividad. Ideal para viajes cortos de trabajo.", "Santiago Peralta", today.minusDays(10), p8)
            ));
            System.out.println("DataInitializer: Seeded reviews.");
        }
    }
}
