package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Booking booking) {
        validateBooking(booking);

        List<Booking> conflicts = bookingRepository.findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                booking.getResourceId(),
                "APPROVED",
                booking.getEndTime(),
                booking.getStartTime()
        );

        if (!conflicts.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Time slot already booked!");
        }

        booking.setStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // ✅ CHANGE Long TO String
    public List<Booking> getMyBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking approveBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        List<Booking> conflicts = bookingRepository.findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                booking.getResourceId(),
                "APPROVED",
                booking.getEndTime(),
                booking.getStartTime()
        );

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

        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason);

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    public List<Map<String, String>> getBookedSlots(String resourceId, String date) {
        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime dayStart = localDate.atStartOfDay();
        LocalDateTime dayEnd = localDate.plusDays(1).atStartOfDay();

        return bookingRepository.findApprovedBookingsForResourceOnDate(resourceId, dayStart, dayEnd)
                .stream()
                .map(b -> Map.of(
                        "startTime", b.getStartTime().toLocalTime().toString(),
                        "endTime", b.getEndTime().toLocalTime().toString()
                ))
                .collect(Collectors.toList());
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
        if (booking.getStartTime().isBefore(LocalDateTime.now().minusMinutes(5))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking cannot be created for a past time. Please select a future date and time.");
        }
    }
}