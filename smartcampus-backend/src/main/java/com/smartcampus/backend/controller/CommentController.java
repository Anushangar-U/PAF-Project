package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.CommentRequest;
import com.smartcampus.backend.dto.CommentUpdateRequest;
import com.smartcampus.backend.entity.Comment;
import com.smartcampus.backend.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CommentController – REST endpoints for /api/comments
 *
 * Standalone comment URLs (legacy + viva-required):
 *  POST   /api/comments                   → addComment (body carries ticketId)
 *  GET    /api/comments/ticket/{ticketId} → getCommentsByTicket
 *  PUT    /api/comments/{commentId}       → updateComment  ⭐ new
 *  DELETE /api/comments/{commentId}       → deleteComment
 *
 * Ticket-nested URLs are handled in TicketController:
 *  POST /api/tickets/{id}/comments
 *  GET  /api/tickets/{id}/comments
 */
@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * GET /api/comments/ticket/{ticketId}
     * 200 OK – returns list of comments for a ticket
     */
    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<Comment>> getCommentsByTicket(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    /**
     * POST /api/comments
     * Body: { ticketId, authorName, authorRole, content }
     * 201 CREATED
     */
    @PostMapping
    public ResponseEntity<Comment> addComment(@Valid @RequestBody CommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(commentService.addComment(request));
    }

    /**
     * PUT /api/comments/{commentId}
     * Body: { "message": "Updated message" }
     * 200 OK  (owner-only – role checked at security layer)
     */
    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable String commentId,
            @Valid @RequestBody CommentUpdateRequest request
    ) {
        return ResponseEntity.ok(commentService.updateComment(commentId, request));
    }

    /**
     * DELETE /api/comments/{commentId}
     * 204 NO CONTENT
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
