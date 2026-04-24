package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.entity.TicketStatus;
import com.smartcampus.backend.entity.Priority;
import com.smartcampus.backend.entity.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    /** All tickets reported by a specific user */
    List<Ticket> findByReportedById(String userId);

    /** Filter by status */
    List<Ticket> findByStatus(TicketStatus status);

    /** Filter by priority */
    List<Ticket> findByPriority(Priority priority);

    /** Filter by category */
    List<Ticket> findByCategory(Category category);

    /** Search in title or description (case-insensitive) */
    List<Ticket> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String title, String description);
}
