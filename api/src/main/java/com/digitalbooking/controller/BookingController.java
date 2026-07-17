package com.digitalbooking.controller;

import com.digitalbooking.model.Booking;
import com.digitalbooking.repository.BookingRepository;
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

    @Autowired
    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Booking>> getBookingsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(bookingRepository.findByProductId(productId));
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
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
