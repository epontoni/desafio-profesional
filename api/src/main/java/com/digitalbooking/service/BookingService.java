package com.digitalbooking.service;

import com.digitalbooking.dto.BookingRequest;
import com.digitalbooking.dto.BookingResponse;
import com.digitalbooking.exception.BadRequestException;
import com.digitalbooking.model.Booking;
import com.digitalbooking.model.Product;
import com.digitalbooking.model.User;
import com.digitalbooking.repository.BookingRepository;
import com.digitalbooking.util.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ProductService productService;
    private final UserService userService;
    private final EmailService emailService;
    private final DtoMapper dtoMapper;

    @Autowired
    public BookingService(BookingRepository bookingRepository,
                          ProductService productService,
                          UserService userService,
                          EmailService emailService,
                          DtoMapper dtoMapper) {
        this.bookingRepository = bookingRepository;
        this.productService = productService;
        this.userService = userService;
        this.emailService = emailService;
        this.dtoMapper = dtoMapper;
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByStartDateDesc().stream()
                .map(dtoMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByProductId(Long productId) {
        return bookingRepository.findByProductIdOrderByStartDateDesc(productId).stream()
                .map(dtoMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsByUserEmail(String email) {
        return bookingRepository.findByUserEmailOrderByStartDateDesc(email).stream()
                .map(dtoMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String authenticatedUserEmail) {
        if (request.getProductId() == null) {
            throw new BadRequestException("El producto de la reserva es obligatorio.");
        }
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new BadRequestException("Las fechas de check-in y check-out son obligatorias.");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("La fecha de check-in debe ser anterior a la de check-out.");
        }

        Product product = productService.getProductEntityById(request.getProductId());

        User user = null;
        if (authenticatedUserEmail != null && !authenticatedUserEmail.isBlank()) {
            user = userService.getUserEntityByEmail(authenticatedUserEmail);
        } else if (request.getUserId() != null) {
            user = userService.getUserEntityById(request.getUserId());
        }

        // Validate overlap
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                product.getId(),
                request.getStartDate(),
                request.getEndDate()
        );

        if (!overlapping.isEmpty()) {
            throw new BadRequestException("El alojamiento ya se encuentra reservado en el rango de fechas seleccionado.");
        }

        Booking booking = new Booking(
                request.getStartDate(),
                request.getEndDate(),
                product,
                user
        );
        booking.setEstimatedArrivalTime(request.getEstimatedArrivalTime());
        booking.setNotes(request.getNotes());

        Booking saved = bookingRepository.save(booking);

        // Send booking confirmation email
        try {
            emailService.sendBookingConfirmationEmail(saved);
        } catch (Exception e) {
            System.err.println("BookingService: Falló el envío de correo de confirmación: " + e.getMessage());
        }

        return dtoMapper.toBookingResponse(saved);
    }
}
