package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.CommentRequest;
import com.smartcampus.backend.dto.CommentUpdateRequest;
import com.smartcampus.backend.entity.Comment;
import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.exception.ResourceNotFoundException;
import com.smartcampus.backend.repository.CommentRepository;
import com.smartcampus.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional(readOnly = true)
    public List<Comment> getCommentsByTicket(Long ticketId) {
        ticketRepository.findById(ticketId)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + ticketId));
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    // ── POST ─────────────────────────────────────────────────

    /**
     * Adds a comment to the ticket identified by req.getTicketId().
     * Used by legacy POST /api/comments and new POST /api/tickets/{id}/comments.
     */
    @Transactional
    public Comment addComment(CommentRequest req) {
        Ticket ticket = ticketRepository.findById(req.getTicketId())
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + req.getTicketId()));

        Comment comment = new Comment();
        comment.setContent(req.getContent());
        comment.setAuthorName(req.getAuthorName());
        comment.setAuthorRole(req.getAuthorRole());
        comment.setTicket(ticket);

        return commentRepository.save(comment);
    }

    /**
     * Convenience overload: adds a comment where the ticketId is supplied
     * via the URL path (used by POST /api/tickets/{ticketId}/comments).
     */
    @Transactional
    public Comment addCommentToTicket(Long ticketId, CommentRequest req) {
        req.setTicketId(ticketId);   // inject path variable into request
        return addComment(req);
    }

    // ── PUT ──────────────────────────────────────────────────

    @Transactional
    public Comment updateComment(Long commentId, CommentUpdateRequest req) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + commentId));
        comment.setContent(req.getMessage());
        return commentRepository.save(comment);
    }

    // ── DELETE ───────────────────────────────────────────────

    @Transactional
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + id));
        commentRepository.delete(comment);
    }
}
