package com.smartcampus.controller;

import com.smartcampus.dto.*;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // Endpoint 1: POST - User creates a booking request
    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO dto,
            @RequestParam String userEmail,
            @RequestParam String userName) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(bookingService.createBooking(dto, userEmail, userName));
    }

    // Endpoint 2: GET - User views their own bookings
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @RequestParam String userEmail) {
        return ResponseEntity.ok(bookingService.getMyBookings(userEmail));
    }

    // Endpoint 3: GET - Admin views all bookings
    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings(
            @RequestParam(required = false) BookingStatus status) {
        return ResponseEntity.ok(bookingService.getAllBookings(status));
    }

    // Endpoint 4: PATCH - Admin approves or rejects a booking
    @PatchMapping("/{id}/decision")
    public ResponseEntity<BookingResponseDTO> decideBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingDecisionDTO dto) {
        return ResponseEntity.ok(bookingService.decideBooking(id, dto));
    }

    // Endpoint 5: DELETE - User cancels their own booking
    @DeleteMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
            @RequestParam String userEmail) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userEmail));
    }
}