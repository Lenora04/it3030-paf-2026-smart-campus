package com.smartcampus.service;

import com.smartcampus.dto.*;
import com.smartcampus.model.*;
import com.smartcampus.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    @Transactional
    public synchronized BookingResponseDTO createBooking(BookingRequestDTO dto, String userEmail, String userName) {

        if (!dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        if (!dto.getStartTime().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Start time must be in the future");
        }

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
            dto.getResourceId(), dto.getStartTime(), dto.getEndTime()
        );
        if (!conflicts.isEmpty()) {
            throw new IllegalStateException(
                "This resource is already booked for the selected time slot. Please choose a different time."
            );
        }

        Booking booking = new Booking();
        booking.setResourceId(dto.getResourceId());
        booking.setResourceName(dto.getResourceName());
        booking.setUserEmail(userEmail);
        booking.setUserName(userName);
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setPurpose(dto.getPurpose());
        booking.setExpectedAttendees(dto.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        return toDTO(bookingRepository.save(booking));
    }

    public List<BookingResponseDTO> getMyBookings(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail)
            .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getAllBookings(BookingStatus status) {
        List<Booking> bookings = (status != null)
            ? bookingRepository.findByStatus(status)
            : bookingRepository.findAll();
        return bookings.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public synchronized BookingResponseDTO decideBooking(Long bookingId, BookingDecisionDTO dto) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be approved or rejected");
        }

        if (dto.getApproved()) {
            List<Booking> conflicts = bookingRepository.findConflictingBookings(
                booking.getResourceId(), booking.getStartTime(), booking.getEndTime()
            );
            if (!conflicts.isEmpty()) {
                throw new IllegalStateException("Cannot approve: a conflicting booking already exists for this slot");
            }
            booking.setStatus(BookingStatus.APPROVED);
        } else {
            if (dto.getReason() == null || dto.getReason().isBlank()) {
                throw new IllegalArgumentException("A reason is required when rejecting a booking");
            }
            booking.setStatus(BookingStatus.REJECTED);
        }

        booking.setAdminReason(dto.getReason());
        return toDTO(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return toDTO(bookingRepository.save(booking));
    }

    private BookingResponseDTO toDTO(Booking b) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(b.getId());
        dto.setResourceId(b.getResourceId());
        dto.setResourceName(b.getResourceName());
        dto.setUserEmail(b.getUserEmail());
        dto.setUserName(b.getUserName());
        dto.setStartTime(b.getStartTime());
        dto.setEndTime(b.getEndTime());
        dto.setPurpose(b.getPurpose());
        dto.setExpectedAttendees(b.getExpectedAttendees());
        dto.setStatus(b.getStatus());
        dto.setAdminReason(b.getAdminReason());
        dto.setCreatedAt(b.getCreatedAt());
        return dto;
    }
}