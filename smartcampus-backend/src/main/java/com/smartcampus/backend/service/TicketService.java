package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.AttachmentResponse;
import com.smartcampus.backend.dto.AssignTechnicianRequest;
import com.smartcampus.backend.dto.ResolveRequest;
import com.smartcampus.backend.dto.TicketResponse;
import com.smartcampus.backend.dto.TicketStatusUpdateRequest;
import com.smartcampus.backend.entity.*;
import com.smartcampus.backend.exception.BadRequestException;
import com.smartcampus.backend.exception.ResourceNotFoundException;
import com.smartcampus.backend.repository.AttachmentRepository;
import com.smartcampus.backend.repository.CommentRepository;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 * TicketService – core business logic for the ticketing system.
 *
 * Enforces:
 *  - Max 3 attachments per ticket
 *  - Valid status transitions
 *  - File storage in local uploads/ directory
 */
@Service
public class TicketService {

    private final TicketRepository     ticketRepository;
    private final UserRepository       userRepository;
    private final AttachmentRepository attachmentRepository;
    private final CommentRepository    commentRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public TicketService(TicketRepository ticketRepository,
                         UserRepository userRepository,
                         AttachmentRepository attachmentRepository,
                         CommentRepository commentRepository) {
        this.ticketRepository     = ticketRepository;
        this.userRepository       = userRepository;
        this.attachmentRepository = attachmentRepository;
        this.commentRepository    = commentRepository;
    }

    // ── Allowed status transitions ────────────────────────────
    private static final Map<TicketStatus, List<TicketStatus>> TRANSITIONS = Map.of(
        TicketStatus.OPEN,        List.of(TicketStatus.IN_PROGRESS, TicketStatus.REJECTED),
        TicketStatus.IN_PROGRESS, List.of(TicketStatus.RESOLVED, TicketStatus.OPEN),
        TicketStatus.RESOLVED,    List.of(TicketStatus.CLOSED, TicketStatus.IN_PROGRESS),
        TicketStatus.CLOSED,      List.of(),
        TicketStatus.REJECTED,    List.of()
    );

    // ──────────────────────────────────────────────────────────
    // READ
    // ──────────────────────────────────────────────────────────

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
            .stream()
            .map(this::enrichWithSLA)
            .toList();
    }

    /**
     * Filter tickets by status and/or priority (query-param support).
     * Any null param means "no filter on that field".
     */
    public List<TicketResponse> getFilteredTickets(String statusStr, String priorityStr) {
        List<Ticket> tickets;

        if (statusStr != null && priorityStr != null) {
            TicketStatus status   = parseStatus(statusStr);
            Priority     priority = parsePriority(priorityStr);
            tickets = ticketRepository.findByStatus(status).stream()
                .filter(t -> t.getPriority() == priority)
                .toList();
        } else if (statusStr != null) {
            tickets = ticketRepository.findByStatus(parseStatus(statusStr));
        } else if (priorityStr != null) {
            tickets = ticketRepository.findByPriority(parsePriority(priorityStr));
        } else {
            tickets = ticketRepository.findAll();
        }

        return tickets.stream().map(this::enrichWithSLA).toList();
    }

    public TicketResponse getTicketById(String id) {
        return enrichWithSLA(findOrThrow(id));
    }

    // ──────────────────────────────────────────────────────────
    // CREATE
    // ──────────────────────────────────────────────────────────

    public TicketResponse createTicket(
            String title, String description, String location,
            String categoryStr, String priorityStr,
            String contactName, String contactEmail,
            String reportedById, List<MultipartFile> attachmentFiles
    ) {
        if (attachmentFiles != null && attachmentFiles.size() > 3) {
            throw new BadRequestException("Maximum 3 attachments allowed per ticket.");
        }

        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setLocation(location);
        ticket.setCategory(Category.valueOf(categoryStr.toUpperCase()));
        ticket.setPriority(priorityStr != null
            ? Priority.valueOf(priorityStr.toUpperCase())
            : Priority.MEDIUM);
        ticket.setContactName(contactName);
        ticket.setContactEmail(contactEmail);

        if (reportedById != null) {
            userRepository.findById(reportedById).ifPresent(reporter -> {
                ticket.setReportedById(reporter.getId());
                ticket.setReportedByName(reporter.getName());
                ticket.setReportedByEmail(reporter.getEmail());
                ticket.setReportedByRole(reporter.getRole());
            });
        }

        Ticket saved = ticketRepository.save(ticket);

        if (attachmentFiles != null) {
            for (MultipartFile file : attachmentFiles) {
                if (file != null && !file.isEmpty()) {
                    try {
                        String url = storeFile(saved.getId(), file);
                        Attachment att = new Attachment();
                        att.setFileName(file.getOriginalFilename());
                        att.setFileType(file.getContentType());
                        att.setFileUrl(url);
                        att.setTicketId(saved.getId());
                        attachmentRepository.save(att);
                    } catch (IOException e) {
                        throw new BadRequestException("Could not store file: " + e.getMessage());
                    }
                }
            }
        }

        return enrichWithSLA(saved);
    }

    // ──────────────────────────────────────────────────────────
    // PATCH – status, assign, resolve
    // ──────────────────────────────────────────────────────────

    public TicketResponse updateStatus(String id, TicketStatusUpdateRequest req) {
        Ticket ticket        = findOrThrow(id);
        TicketStatus current = ticket.getStatus();
        TicketStatus next    = req.getStatus();

        if (!current.equals(next)) {
            List<TicketStatus> allowed = TRANSITIONS.getOrDefault(current, List.of());
            if (!allowed.contains(next)) {
                throw new BadRequestException(
                    "Invalid transition: " + current + " → " + next +
                    ". Allowed: " + allowed);
            }
        }

        ticket.setStatus(next);
        if (req.getResolutionNotes() != null)    ticket.setResolutionNotes(req.getResolutionNotes());
        if (req.getAssignedTechnician() != null) ticket.setAssignedTechnician(req.getAssignedTechnician());

        return enrichWithSLA(ticketRepository.save(ticket));
    }

    /**
     * PATCH /api/tickets/{id}/assign
     * Assigns a technician by ID – looks them up to store their name.
     */
    public TicketResponse assignTechnician(String id, AssignTechnicianRequest req) {
        Ticket ticket = findOrThrow(id);

        String techName = userRepository.findById(req.getTechnicianId())
            .map(u -> u.getName())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Technician not found: " + req.getTechnicianId()));

        ticket.setAssignedTechnician(techName);

        // Auto-advance to IN_PROGRESS if still OPEN
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        return enrichWithSLA(ticketRepository.save(ticket));
    }

    /**
     * PATCH /api/tickets/{id}/resolve
     * Sets resolution notes and marks the ticket RESOLVED.
     */
    public TicketResponse resolveTicket(String id, ResolveRequest req) {
        Ticket ticket = findOrThrow(id);
        ticket.setResolutionNotes(req.getResolutionNotes());
        ticket.setStatus(TicketStatus.RESOLVED);
        return enrichWithSLA(ticketRepository.save(ticket));
    }

    // ──────────────────────────────────────────────────────────
    // DELETE
    // ──────────────────────────────────────────────────────────

    public void deleteTicket(String id) {
        Ticket ticket = findOrThrow(id);
        commentRepository.deleteByTicketId(id);
        attachmentRepository.deleteByTicketId(id);
        ticketRepository.delete(ticket);
    }

    // ──────────────────────────────────────────────────────────
    // ATTACHMENT operations
    // ──────────────────────────────────────────────────────────

    /**
     * POST /api/tickets/{id}/attachments
     * Uploads files and stores them; enforces max-3 rule per ticket.
     */
    public List<AttachmentResponse> addAttachments(String ticketId, List<MultipartFile> files) {
        Ticket ticket = findOrThrow(ticketId);

        int currentCount = attachmentRepository.findByTicketId(ticketId).size();
        if (files == null || files.isEmpty()) {
            throw new BadRequestException("No files provided.");
        }
        if (currentCount + files.size() > 3) {
            throw new BadRequestException(
                "Adding " + files.size() + " file(s) would exceed the 3-attachment limit. " +
                "Current count: " + currentCount);
        }

        List<AttachmentResponse> responses = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                try {
                    String url = storeFile(ticketId, file);
                    Attachment att = new Attachment();
                    att.setFileName(file.getOriginalFilename());
                    att.setFileType(file.getContentType());
                    att.setFileUrl(url);
                    att.setTicketId(ticket.getId());
                    Attachment saved = attachmentRepository.save(att);
                    responses.add(AttachmentResponse.from(saved));
                } catch (IOException e) {
                    throw new BadRequestException("Could not store file: " + e.getMessage());
                }
            }
        }
        return responses;
    }

    /**
     * GET /api/tickets/{id}/attachments
     */
    public List<AttachmentResponse> getAttachments(String ticketId) {
        findOrThrow(ticketId); // ensure ticket exists → 404 if not
        return attachmentRepository.findByTicketId(ticketId)
            .stream()
            .map(AttachmentResponse::from)
            .toList();
    }

    /**
     * DELETE /api/attachments/{attachmentId}
     */
    public void deleteAttachment(String attachmentId) {
        Attachment att = attachmentRepository.findById(attachmentId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Attachment not found: " + attachmentId));
        attachmentRepository.delete(att);
    }

    // ── Helpers ───────────────────────────────────────────────
    /**
     * Enrich TicketResponse with SLA status.
     * SLA calculation: Based on priority and time elapsed.
     *   HIGH:   > 4 hours = CRITICAL, > 2 hours = WARNING, else NORMAL
     *   MEDIUM: > 8 hours = CRITICAL, > 4 hours = WARNING, else NORMAL
     *   LOW:    > 24 hours = CRITICAL, > 12 hours = WARNING, else NORMAL
     */
    private TicketResponse enrichWithSLA(Ticket ticket) {
        TicketResponse response = TicketResponse.from(ticket);
        response.setAttachmentUrls(
            attachmentRepository.findByTicketId(ticket.getId())
                .stream()
                .map(Attachment::getFileUrl)
                .toList()
        );
        response.setSlaStatus(calculateSLAStatus(ticket));
        return response;
    }

    private String calculateSLAStatus(Ticket ticket) {
        if (ticket.getCreatedAt() == null ||
            ticket.getStatus() == TicketStatus.RESOLVED ||
            ticket.getStatus() == TicketStatus.CLOSED) {
            return "RESOLVED";
        }

        LocalDateTime now = LocalDateTime.now();
        long hoursElapsed = ChronoUnit.HOURS.between(ticket.getCreatedAt(), now);

        Priority priority = ticket.getPriority();

        if (priority == Priority.HIGH) {
            if (hoursElapsed > 4) return "CRITICAL";
            if (hoursElapsed > 2) return "WARNING";
        } else if (priority == Priority.MEDIUM) {
            if (hoursElapsed > 8) return "CRITICAL";
            if (hoursElapsed > 4) return "WARNING";
        } else { // LOW
            if (hoursElapsed > 24) return "CRITICAL";
            if (hoursElapsed > 12) return "WARNING";
        }

        return "NORMAL";
    }

    private Ticket findOrThrow(String id) {
        return ticketRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + id));
    }

    private TicketStatus parseStatus(String s) {
        try { return TicketStatus.valueOf(s.toUpperCase()); }
        catch (IllegalArgumentException e) {
            throw new BadRequestException("Unknown status: " + s);
        }
    }

    private Priority parsePriority(String p) {
        try { return Priority.valueOf(p.toUpperCase()); }
        catch (IllegalArgumentException e) {
            throw new BadRequestException("Unknown priority: " + p);
        }
    }

    private String storeFile(String ticketId, MultipartFile file) throws IOException {
        String subDir  = "tickets/" + ticketId;
        Path   dirPath = Paths.get(uploadDir, subDir);
        Files.createDirectories(dirPath);

        String filename = System.currentTimeMillis() + "_" +
            Objects.requireNonNull(file.getOriginalFilename()).replaceAll("\\s+", "_");

        Files.copy(file.getInputStream(),
                   dirPath.resolve(filename),
                   StandardCopyOption.REPLACE_EXISTING);

        return "/api/files/" + subDir + "/" + filename;
    }
}
