package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.*;
import com.smartcampus.backend.service.CommentService;
import com.smartcampus.backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * TicketController – handles all /api/tickets/** requests.
 *
 * Architecture:  HTTP Request → Controller → Service → Repository → DB
 *
 * Endpoints:
 *   GET    /api/tickets                  – list all (+ ?status & ?priority filter)
 *   GET    /api/tickets/{id}             – get by ID
 *   POST   /api/tickets                  – create (multipart/form-data)
 *   PATCH  /api/tickets/{id}/status      – update status   ⭐
 *   PATCH  /api/tickets/{id}/assign      – assign technician
 *   PATCH  /api/tickets/{id}/resolve     – add resolution notes
 *   DELETE /api/tickets/{id}             – delete (204)
 *   POST   /api/tickets/{id}/comments    – add comment     ⭐
 *   GET    /api/tickets/{id}/comments    – list comments
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService  ticketService;
    private final CommentService commentService;

    // Constructor injection (no @Autowired needed – Spring auto-wires when 1 constructor)
    public TicketController(TicketService ticketService, CommentService commentService) {
        this.ticketService  = ticketService;
        this.commentService = commentService;
    }

    // ══════════════════════════════════════════════════════════
    // 1. GET ALL TICKETS  (with optional query-param filters)
    // ══════════════════════════════════════════════════════════

    /**
     * GET /api/tickets
     * GET /api/tickets?status=OPEN
     * GET /api/tickets?status=OPEN&priority=HIGH
     *
     * Returns 200 OK with list of tickets.
     */
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestParam(value = "status",   required = false) String status,
            @RequestParam(value = "priority", required = false) String priority
    ) {
        return ResponseEntity.ok(ticketService.getFilteredTickets(status, priority));
    }

    // ══════════════════════════════════════════════════════════
    // 2. GET TICKET BY ID
    // ══════════════════════════════════════════════════════════

    /**
     * GET /api/tickets/{id}
     * Returns 200 OK  or  404 NOT FOUND.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // ══════════════════════════════════════════════════════════
    // 3. CREATE TICKET
    // ══════════════════════════════════════════════════════════

    /**
     * POST /api/tickets   Content-Type: multipart/form-data
     *
     * Form fields:
     *   title, description, location, category, priority (default MEDIUM),
     *   contactName, contactEmail, reportedById, attachments (0–3 files)
     *
     * Returns 201 CREATED with the saved ticket.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponse> createTicket(
            @RequestParam("title")                                         String title,
            @RequestParam("description")                                   String description,
            @RequestParam("location")                                      String location,
            @RequestParam("category")                                      String category,
            @RequestParam(value = "priority",     defaultValue = "MEDIUM") String priority,
            @RequestParam(value = "contactName",  required = false)        String contactName,
            @RequestParam(value = "contactEmail", required = false)        String contactEmail,
            @RequestParam(value = "reportedById", required = false)        String reportedById,
            @RequestParam(value = "attachments",  required = false)        List<MultipartFile> attachments
    ) {
        TicketResponse created = ticketService.createTicket(
            title, description, location, category, priority,
            contactName, contactEmail, reportedById, attachments
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ══════════════════════════════════════════════════════════
    // 4. UPDATE TICKET STATUS  ⭐ (important for marks)
    // ══════════════════════════════════════════════════════════

    /**
     * PATCH /api/tickets/{id}/status
     * Body: { "status": "IN_PROGRESS" }
     *
     * Enforces allowed transitions:
     *   OPEN → IN_PROGRESS | REJECTED
     *   IN_PROGRESS → RESOLVED | OPEN
     *   RESOLVED → CLOSED | IN_PROGRESS
     *
     * Returns 200 OK  or  400 BAD REQUEST (invalid transition).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody TicketStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(ticketService.updateStatus(id, request));
    }

    // ══════════════════════════════════════════════════════════
    // 5. ASSIGN TECHNICIAN
    // ══════════════════════════════════════════════════════════

    /**
     * PATCH /api/tickets/{id}/assign
     * Body: { "technicianId": 2 }
     *
     * Looks up the technician by ID, stores their name on the ticket,
     * and auto-advances OPEN → IN_PROGRESS.
     * Returns 200 OK  or  404 NOT FOUND (technician not found).
     */
    @PatchMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> assignTechnician(
            @PathVariable String id,
            @Valid @RequestBody AssignTechnicianRequest request
    ) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, request));
    }

    // ══════════════════════════════════════════════════════════
    // 6. ADD RESOLUTION NOTES
    // ══════════════════════════════════════════════════════════

    /**
     * PATCH /api/tickets/{id}/resolve
     * Body: { "resolutionNotes": "Replaced HDMI cable" }
     *
     * Sets resolution notes and marks ticket as RESOLVED.
     * Returns 200 OK.
     */
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<TicketResponse> resolveTicket(
            @PathVariable String id,
            @Valid @RequestBody ResolveRequest request
    ) {
        return ResponseEntity.ok(ticketService.resolveTicket(id, request));
    }

    // ══════════════════════════════════════════════════════════
    // 7. DELETE TICKET
    // ══════════════════════════════════════════════════════════

    /**
     * DELETE /api/tickets/{id}
     * Returns 204 NO CONTENT  or  404 NOT FOUND.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // ══════════════════════════════════════════════════════════
    // 8. COMMENT SUB-RESOURCE  (ticket-nested URLs)  ⭐
    // ══════════════════════════════════════════════════════════

    /**
     * POST /api/tickets/{id}/comments
     * Body: { "authorName": "...", "authorRole": "TECHNICIAN", "content": "..." }
     * Returns 201 CREATED.
     */
    @PostMapping("/{id}/comments")
    public ResponseEntity<com.smartcampus.backend.entity.Comment> addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentRequest request
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(commentService.addCommentToTicket(id, request));
    }

    /**
     * GET /api/tickets/{id}/comments
     * Returns 200 OK with list of comments (ordered by createdAt ASC).
     */
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<com.smartcampus.backend.entity.Comment>> getComments(
            @PathVariable String id
    ) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(id));
    }
}
