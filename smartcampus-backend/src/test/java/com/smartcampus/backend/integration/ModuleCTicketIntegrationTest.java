package com.smartcampus.backend.integration;

import com.smartcampus.backend.dto.AssignTechnicianRequest;
import com.smartcampus.backend.dto.CommentRequest;
import com.smartcampus.backend.dto.ResolveRequest;
import com.smartcampus.backend.dto.TicketResponse;
import com.smartcampus.backend.entity.Attachment;
import com.smartcampus.backend.entity.Comment;
import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.entity.TicketStatus;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.entity.UserRole;
import com.smartcampus.backend.repository.AttachmentRepository;
import com.smartcampus.backend.repository.CommentRepository;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.service.CommentService;
import com.smartcampus.backend.service.TicketService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("integration")
@EnabledIfSystemProperty(named = "run.modulec.integration", matches = "true")
class ModuleCTicketIntegrationTest {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanBefore() {
        cleanAllCollections();
    }

    @AfterEach
    void cleanAfter() {
        cleanAllCollections();
    }

    @Test
    void ticketLifecycle_createCommentAssignResolveDelete() {
        User tech = new User("TECH-IT-1", "Integration Tech", "integration-tech@campus.edu", UserRole.TECHNICIAN);
        userRepository.save(tech);

        TicketResponse created = ticketService.createTicket(
            "Integration test ticket",
            "Validate module C flow with database",
            "Integration Lab",
            "IT_EQUIPMENT",
            "HIGH",
            "Integration User",
            "integration-user@campus.edu",
            null,
            null
        );

        assertNotNull(created.getId());
        String ticketId = created.getId();

        CommentRequest commentRequest = new CommentRequest();
        commentRequest.setTicketId(ticketId);
        commentRequest.setAuthorName("Integration User");
        commentRequest.setAuthorRole("USER");
        commentRequest.setContent("Initial integration comment");

        Comment savedComment = commentService.addComment(commentRequest);
        assertNotNull(savedComment.getId());

        AssignTechnicianRequest assignRequest = new AssignTechnicianRequest();
        assignRequest.setTechnicianId("TECH-IT-1");

        TicketResponse assigned = ticketService.assignTechnician(ticketId, assignRequest);
        assertEquals("Integration Tech", assigned.getAssignedTechnician());
        assertEquals(TicketStatus.IN_PROGRESS, assigned.getStatus());

        ResolveRequest resolveRequest = new ResolveRequest();
        resolveRequest.setResolutionNotes("Resolved in integration flow");

        TicketResponse resolved = ticketService.resolveTicket(ticketId, resolveRequest);
        assertEquals(TicketStatus.RESOLVED, resolved.getStatus());
        assertEquals("Resolved in integration flow", resolved.getResolutionNotes());

        ticketService.deleteTicket(ticketId);

        assertTrue(ticketRepository.findById(ticketId).isEmpty());
        assertTrue(commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).isEmpty());
        assertTrue(attachmentRepository.findByTicketId(ticketId).isEmpty());
    }

    private void cleanAllCollections() {
        attachmentRepository.deleteAll();
        commentRepository.deleteAll();
        ticketRepository.deleteAll();
        userRepository.deleteAll();

        List<Ticket> tickets = ticketRepository.findAll();
        List<Comment> comments = commentRepository.findAll();
        List<Attachment> attachments = attachmentRepository.findAll();

        assertTrue(tickets.isEmpty());
        assertTrue(comments.isEmpty());
        assertTrue(attachments.isEmpty());
        assertFalse(userRepository.findAll().stream().anyMatch(u -> "TECH-IT-1".equals(u.getId())));
    }
}
