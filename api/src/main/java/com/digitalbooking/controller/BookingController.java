package com.digitalbooking.controller;

import com.digitalbooking.dto.BookingRequest;
import com.digitalbooking.dto.BookingResponse;
import com.digitalbooking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(@RequestParam(required = false) Long productId) {
        if (productId != null) {
            return ResponseEntity.ok(bookingService.getBookingsByProductId(productId));
        }
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(bookingService.getBookingsByProductId(productId));
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserEmail(@PathVariable String email) {
        return ResponseEntity.ok(bookingService.getBookingsByUserEmail(email));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request,
                                                         Authentication authentication) {
        String authEmail = authentication != null ? authentication.getName() : null;
        BookingResponse saved = bookingService.createBooking(request, authEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
