package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    /** Returns all comments for a given ticket, ordered by creation time */
    List<Comment> findByTicketIdOrderByCreatedAtAsc(String ticketId);
}
