package com.smartcampus.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.entity.Notification;
import com.smartcampus.backend.repository.NotificationRepository;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/{userId}")
    public List<Notification> getNotificationsByUserId(@PathVariable String userId) {
        return notificationRepository.findByUserId(userId);
    }

    @PostMapping("/test/{userId}")
    public Notification createTestNotification(@PathVariable String userId) {
        Notification notification = new Notification(
            userId,
            "Booking Approved",
            "Your booking has been approved."
        );

        return notificationRepository.save(notification);
    }

    @PatchMapping("/{id}/read")
    public Notification markAsRead(@PathVariable String id) {
        Notification notification = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}