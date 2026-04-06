package com.smartcampus.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.smartcampus.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.resourceId = :resourceId
        AND b.status = 'APPROVED'
        AND b.startTime < :endTime
        AND b.endTime > :startTime
    """)
    List<Booking> findConflictingApprovedBookings(Long resourceId, LocalDateTime startTime, LocalDateTime endTime);
}