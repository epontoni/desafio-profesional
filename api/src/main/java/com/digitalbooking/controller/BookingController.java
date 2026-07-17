package com.digitalbooking.controller;

import com.digitalbooking.model.Booking;
import com.digitalbooking.repository.BookingRepository;
import com.digitalbooking.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    @Autowired
    public BookingController(BookingRepository bookingRepository, EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Booking>> getBookingsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(bookingRepository.findByProductId(productId));
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Booking>> getBookingsByUserEmail(@PathVariable String email) {
        return ResponseEntity.ok(bookingRepository.findByUserEmailOrderByStartDateDesc(email));
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        if (booking.getProduct() == null || booking.getProduct().getId() == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "El producto de la reserva es obligatorio.");
            return ResponseEntity.badRequest().body(response);
        }
        if (booking.getStartDate() == null || booking.getEndDate() == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Las fechas de check-in y check-out son obligatorias.");
            return ResponseEntity.badRequest().body(response);
        }
        if (booking.getStartDate().isAfter(booking.getEndDate())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "La fecha de check-in debe ser anterior a la de check-out.");
            return ResponseEntity.badRequest().body(response);
        }

        // Validate overlap
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                booking.getProduct().getId(),
                booking.getStartDate(),
                booking.getEndDate()
        );

        if (!overlapping.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "El alojamiento ya se encuentra reservado en el rango de fechas seleccionado.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Booking saved = bookingRepository.save(booking);

        // Dispatches booking confirmation email (complying with User Story 35)
        try {
            emailService.sendBookingConfirmationEmail(saved);
        } catch (Exception e) {
            System.err.println("BookingController: Falló el envío de correo de confirmación: " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
