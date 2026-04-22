package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    // ✅ CHANGE Long TO String
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
        return bookingService.approveBooking(id);
    }

    @PutMapping("/{id}/reject")
    public Booking rejectBooking(@PathVariable String id, @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        return bookingService.rejectBooking(id, reason);
    }

    @PatchMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable String id) {
        return bookingService.cancelBooking(id);
    }

    @GetMapping("/resource/{resourceId}/slots")
    public List<Map<String, String>> getBookedSlots(
            @PathVariable String resourceId,
            @RequestParam String date) {
        return bookingService.getBookedSlots(resourceId, date);
    }
}