package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    List<Booking> findByUserId(Long userId);
    
    @Query("{ 'resourceId': ?0, 'status': ?1, 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?3 } }")
    List<Booking> findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
        String resourceId,  // ✅ String
        String status,
        LocalDateTime endTime,
        LocalDateTime startTime
    );
}