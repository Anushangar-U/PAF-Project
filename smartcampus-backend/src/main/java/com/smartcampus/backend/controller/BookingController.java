package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.Notification;
import com.smartcampus.backend.repository.NotificationRepository;
import com.smartcampus.backend.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final NotificationRepository notificationRepository;

    public BookingController(BookingService bookingService, NotificationRepository notificationRepository) {
        this.bookingService = bookingService;
        this.notificationRepository = notificationRepository;
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        Booking saved = bookingService.createBooking(booking);
        
        // Create notification for booking submitted
        if (booking.getUserId() != null) {
            Notification notification = new Notification(
                booking.getUserId(),
                "Booking Submitted",
                "Your booking for resource has been submitted and is pending approval."
            );
            notificationRepository.save(notification);
        }
        
        return saved;
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getMyBookings(@PathVariable String userId) {
        return bookingService.getMyBookings(userId);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}/approve")
    public Booking approveBooking(@PathVariable String id) {
        Booking booking = bookingService.approveBooking(id);
        
        // Create notification for booking approved
        if (booking.getUserId() != null) {
            Notification notification = new Notification(
                booking.getUserId(),
                "Booking Approved ✅",
                "Your booking has been approved!"
            );
            notificationRepository.save(notification);
        }
        
        return booking;
    }

    @PutMapping("/{id}/reject")
    public Booking rejectBooking(@PathVariable String id, @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        Booking booking = bookingService.rejectBooking(id, reason);
        
        // Create notification for booking rejected
        if (booking.getUserId() != null) {
            Notification notification = new Notification(
                booking.getUserId(),
                "Booking Rejected ❌",
                "Your booking was rejected. Reason: " + (reason != null ? reason : "Not specified")
            );
            notificationRepository.save(notification);
        }
        
        return booking;
    }

    @PatchMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable String id) {
        Booking booking = bookingService.cancelBooking(id);
        
        // Create notification for booking cancelled
        if (booking.getUserId() != null) {
            Notification notification = new Notification(
                booking.getUserId(),
                "Booking Cancelled",
                "Your booking has been cancelled."
            );
            notificationRepository.save(notification);
        }
        
        return booking;
    }

    @GetMapping("/resource/{resourceId}/slots")
    public List<Map<String, String>> getBookedSlots(
            @PathVariable String resourceId,
            @RequestParam String date) {
        return bookingService.getBookedSlots(resourceId, date);
    }
}