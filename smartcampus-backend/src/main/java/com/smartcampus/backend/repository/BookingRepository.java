package com.smartcampus.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.smartcampus.backend.entity.Booking;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
        Long resourceId, String status, LocalDateTime endTime, LocalDateTime startTime);
}