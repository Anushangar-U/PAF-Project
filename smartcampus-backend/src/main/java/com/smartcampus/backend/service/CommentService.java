package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.CommentRequest;
import com.smartcampus.backend.dto.CommentUpdateRequest;
import com.smartcampus.backend.entity.Comment;
import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.exception.ResourceNotFoundException;
import com.smartcampus.backend.repository.CommentRepository;
import com.smartcampus.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * CommentService – business logic for comment endpoints.
 *
 * Supports:
 *   GET    comments by ticket
 *   POST   add comment
 *   PUT    update comment (owner only – enforced at controller/security layer)
 *   DELETE delete comment
 */
@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository  ticketRepository;

    public CommentService(CommentRepository commentRepository,
                          TicketRepository ticketRepository) {
        this.commentRepository = commentRepository;
        this.ticketRepository  = ticketRepository;
    }

    // ── GET ──────────────────────────────────────────────────

    public List<Comment> getCommentsByTicket(String ticketId) {
        ticketRepository.findById(ticketId)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + ticketId));
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    // ── POST ─────────────────────────────────────────────────

    /**
     * Adds a comment to the ticket identified by req.getTicketId().
     * Used by legacy POST /api/comments and new POST /api/tickets/{id}/comments.
     */
    public Comment addComment(CommentRequest req) {
        Ticket ticket = ticketRepository.findById(req.getTicketId())
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + req.getTicketId()));

        Comment comment = new Comment();
        comment.setContent(req.getContent());
        comment.setAuthorName(req.getAuthorName());
        comment.setAuthorRole(req.getAuthorRole());
        comment.setTicketId(ticket.getId());

        return commentRepository.save(comment);
    }

    /**
     * Convenience overload: adds a comment where the ticketId is supplied
     * via the URL path (used by POST /api/tickets/{ticketId}/comments).
     */
    public Comment addCommentToTicket(String ticketId, CommentRequest req) {
        req.setTicketId(ticketId);   // inject path variable into request
        return addComment(req);
    }

    // ── PUT ──────────────────────────────────────────────────

    public Comment updateComment(String commentId, CommentUpdateRequest req) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + commentId));
        comment.setContent(req.getMessage());
        return commentRepository.save(comment);
    }

    // ── DELETE ───────────────────────────────────────────────

    public void deleteComment(String id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + id));
        commentRepository.delete(comment);
    }
}
