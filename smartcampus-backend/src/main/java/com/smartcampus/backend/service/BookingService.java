package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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
            throw new RuntimeException("Booking conflict: this resource is already booked for the selected time");
        }

        booking.setStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        List<Booking> conflicts = bookingRepository.findConflictingApprovedBookings(
                booking.getResourceId(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Cannot approve booking due to time conflict");
        }

        booking.setStatus("APPROVED");
        booking.setRejectionReason(null);

        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason);

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    private void validateBooking(Booking booking) {
        if (booking.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }
        if (booking.getResourceId() == null) {
            throw new RuntimeException("Resource ID is required");
        }
        if (booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new RuntimeException("Start time and end time are required");
        }
        if (!booking.getStartTime().isBefore(booking.getEndTime())) {
            throw new RuntimeException("Start time must be before end time");
        }
        if (booking.getStartTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Booking cannot be created for a past time");
        }
    }
}