package com.smartcampus.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.smartcampus.backend.entity.Booking;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(Long userId);

    @Query("""
                { 'resourceId': ?0,
                    'status': 'APPROVED',
                    'startTime': { $lt: ?2 },
                    'endTime': { $gt: ?1 }
                }
    """)
    List<Booking> findConflictingApprovedBookings(Long resourceId, LocalDateTime startTime, LocalDateTime endTime);
}