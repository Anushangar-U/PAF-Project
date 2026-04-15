package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.AttachmentResponse;
import com.smartcampus.backend.service.TicketService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * AttachmentController – manages file attachments for tickets.
 *
 * Architecture:  HTTP Request → Controller → Service → Repository → DB
 *
 * Endpoints:
 *   POST   /api/tickets/{ticketId}/attachments  – upload files (max 3)  → 201
 *   GET    /api/tickets/{ticketId}/attachments  – list attachments       → 200
 *   DELETE /api/attachments/{attachmentId}      – delete one attachment  → 204
 */
@RestController
@CrossOrigin(origins = "*")
public class AttachmentController {

    private final TicketService ticketService;

    // Constructor injection – Spring auto-wires single constructor
    public AttachmentController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // ══════════════════════════════════════════════════════════
    // 1. UPLOAD ATTACHMENTS
    // ══════════════════════════════════════════════════════════

    /**
     * POST /api/tickets/{ticketId}/attachments
     * Content-Type: multipart/form-data
     * Form field: files (1 or more files; total per ticket must stay ≤ 3)
     *
     * Business rule: a ticket may have at most 3 attachments in total.
     * Attempting to exceed that limit returns 400 BAD REQUEST.
     *
     * Returns 201 CREATED with list of saved AttachmentResponse objects.
     */
    @PostMapping(
        value    = "/api/tickets/{ticketId}/attachments",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<List<AttachmentResponse>> uploadAttachments(
            @PathVariable Long ticketId,
            @RequestParam("files") List<MultipartFile> files
    ) {
        List<AttachmentResponse> saved = ticketService.addAttachments(ticketId, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ══════════════════════════════════════════════════════════
    // 2. LIST ATTACHMENTS FOR A TICKET
    // ══════════════════════════════════════════════════════════

    /**
     * GET /api/tickets/{ticketId}/attachments
     * Returns 200 OK with list of AttachmentResponse.
     * Returns 404 NOT FOUND if the ticket does not exist.
     */
    @GetMapping("/api/tickets/{ticketId}/attachments")
    public ResponseEntity<List<AttachmentResponse>> getAttachments(
            @PathVariable Long ticketId
    ) {
        return ResponseEntity.ok(ticketService.getAttachments(ticketId));
    }

    // ══════════════════════════════════════════════════════════
    // 3. DELETE ONE ATTACHMENT
    // ══════════════════════════════════════════════════════════

    /**
     * DELETE /api/attachments/{attachmentId}
     * Returns 204 NO CONTENT on success.
     * Returns 404 NOT FOUND if the attachment does not exist.
     */
    @DeleteMapping("/api/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long attachmentId) {
        ticketService.deleteAttachment(attachmentId);
        return ResponseEntity.noContent().build();
    }
}
