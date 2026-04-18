package com.smartcampus.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.repository.BookingRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Booking booking) {
        validateBooking(booking);

        List<Booking> conflicts = bookingRepository.findConflictingApprovedBookings(
                booking.getResourceId(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Time slot already booked!");
        }

        booking.setStatus("PENDING");
        booking.setRejectionReason(null);
        booking.setCreatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking approveBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if ("APPROVED".equalsIgnoreCase(booking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking is already approved");
        }

        if ("REJECTED".equalsIgnoreCase(booking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rejected booking cannot be approved");
        }

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cancelled booking cannot be approved");
        }

        List<Booking> conflicts = bookingRepository.findConflictingApprovedBookings(
                booking.getResourceId(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        conflicts.removeIf(conflict -> conflict.getId().equals(booking.getId()));

        if (!conflicts.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot approve booking due to time conflict");
        }

        booking.setStatus("APPROVED");
        booking.setRejectionReason(null);

        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if ("APPROVED".equalsIgnoreCase(booking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Approved booking cannot be rejected");
        }

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cancelled booking cannot be rejected");
        }

        if (reason == null || reason.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rejection reason is required");
        }

        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason.trim());

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking is already cancelled");
        }

        if ("REJECTED".equalsIgnoreCase(booking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rejected booking cannot be cancelled");
        }

        booking.setStatus("CANCELLED");
        booking.setRejectionReason(null);

        return bookingRepository.save(booking);
    }

    private void validateBooking(Booking booking) {
        if (booking.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required");
        }

        if (booking.getResourceId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Resource ID is required");
        }

        if (booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time and end time are required");
        }

        if (!booking.getStartTime().isBefore(booking.getEndTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time must be before end time");
        }

        if (booking.getStartTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking cannot be created for a past time");
        }

        if (booking.getAttendees() != null && booking.getAttendees() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attendees must be greater than 0");
        }

        if (booking.getPurpose() == null || booking.getPurpose().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Purpose is required");
        }
    }
}