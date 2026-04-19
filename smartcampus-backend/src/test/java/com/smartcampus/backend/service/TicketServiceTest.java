package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.AssignTechnicianRequest;
import com.smartcampus.backend.dto.ResolveRequest;
import com.smartcampus.backend.dto.AttachmentResponse;
import com.smartcampus.backend.dto.TicketResponse;
import com.smartcampus.backend.dto.TicketStatusUpdateRequest;
import com.smartcampus.backend.entity.Attachment;
import com.smartcampus.backend.entity.Category;
import com.smartcampus.backend.entity.Priority;
import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.entity.TicketStatus;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.entity.UserRole;
import com.smartcampus.backend.exception.BadRequestException;
import com.smartcampus.backend.exception.ResourceNotFoundException;
import com.smartcampus.backend.repository.AttachmentRepository;
import com.smartcampus.backend.repository.CommentRepository;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AttachmentRepository attachmentRepository;

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private TicketService ticketService;

    @Test
    void updateStatus_rejectsInvalidTransition() {
        Ticket ticket = baseTicket("T-1", TicketStatus.CLOSED);
        when(ticketRepository.findById("T-1")).thenReturn(Optional.of(ticket));

        TicketStatusUpdateRequest request = new TicketStatusUpdateRequest();
        request.setStatus(TicketStatus.OPEN);

        BadRequestException ex = assertThrows(
            BadRequestException.class,
            () -> ticketService.updateStatus("T-1", request)
        );

        assertTrue(ex.getMessage().contains("Invalid transition"));
        verify(ticketRepository, never()).save(any(Ticket.class));
    }

    @Test
    void assignTechnician_setsNameAndMovesOpenToInProgress() {
        Ticket ticket = baseTicket("T-2", TicketStatus.OPEN);
        User tech = new User("U-1", "Sara Tech", "sara@campus.edu", UserRole.TECHNICIAN);

        when(ticketRepository.findById("T-2")).thenReturn(Optional.of(ticket));
        when(userRepository.findById("U-1")).thenReturn(Optional.of(tech));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(inv -> inv.getArgument(0));
        when(attachmentRepository.findByTicketId("T-2")).thenReturn(List.of());

        AssignTechnicianRequest request = new AssignTechnicianRequest();
        request.setTechnicianId("U-1");

        TicketResponse response = ticketService.assignTechnician("T-2", request);

        assertEquals("Sara Tech", response.getAssignedTechnician());
        assertEquals(TicketStatus.IN_PROGRESS, response.getStatus());
    }

    @Test
    void assignTechnician_throwsWhenTechnicianMissing() {
        Ticket ticket = baseTicket("T-3", TicketStatus.OPEN);
        when(ticketRepository.findById("T-3")).thenReturn(Optional.of(ticket));
        when(userRepository.findById("U-404")).thenReturn(Optional.empty());

        AssignTechnicianRequest request = new AssignTechnicianRequest();
        request.setTechnicianId("U-404");

        ResourceNotFoundException ex = assertThrows(
            ResourceNotFoundException.class,
            () -> ticketService.assignTechnician("T-3", request)
        );

        assertTrue(ex.getMessage().contains("Technician not found"));
        verify(ticketRepository, never()).save(any(Ticket.class));
    }

    @Test
    void deleteTicket_removesCommentsAndAttachmentsThenTicket() {
        Ticket ticket = baseTicket("T-4", TicketStatus.OPEN);
        when(ticketRepository.findById("T-4")).thenReturn(Optional.of(ticket));

        ticketService.deleteTicket("T-4");

        verify(commentRepository).deleteByTicketId("T-4");
        verify(attachmentRepository).deleteByTicketId("T-4");
        verify(ticketRepository).delete(ticket);
    }

    @Test
    void addAttachments_rejectsWhenWouldExceedLimit() {
        Ticket ticket = baseTicket("T-5", TicketStatus.OPEN);
        when(ticketRepository.findById("T-5")).thenReturn(Optional.of(ticket));
        when(attachmentRepository.findByTicketId("T-5")).thenReturn(List.of(new Attachment(), new Attachment()));

        MultipartFile f1 = org.mockito.Mockito.mock(MultipartFile.class);
        MultipartFile f2 = org.mockito.Mockito.mock(MultipartFile.class);

        BadRequestException ex = assertThrows(
            BadRequestException.class,
            () -> ticketService.addAttachments("T-5", List.of(f1, f2))
        );

        assertTrue(ex.getMessage().contains("3-attachment limit"));
    }

    @Test
    void createTicket_mapsReporterFieldsWhenUserExists() {
        User reporter = new User("U-7", "Ali", "ali@campus.edu", UserRole.USER);
        when(userRepository.findById("U-7")).thenReturn(Optional.of(reporter));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(inv -> {
            Ticket t = inv.getArgument(0);
            t.setId("T-7");
            return t;
        });
        when(attachmentRepository.findByTicketId("T-7")).thenReturn(List.of());

        ticketService.createTicket(
            "Projector issue",
            "No display",
            "Lab 1",
            "IT_EQUIPMENT",
            "HIGH",
            "Ali",
            "ali@campus.edu",
            "U-7",
            null
        );

        ArgumentCaptor<Ticket> captor = ArgumentCaptor.forClass(Ticket.class);
        verify(ticketRepository).save(captor.capture());
        Ticket saved = captor.getValue();

        assertEquals("U-7", saved.getReportedById());
        assertEquals("Ali", saved.getReportedByName());
        assertEquals("ali@campus.edu", saved.getReportedByEmail());
        assertEquals(UserRole.USER, saved.getReportedByRole());
        assertEquals(Priority.HIGH, saved.getPriority());
        assertEquals(Category.IT_EQUIPMENT, saved.getCategory());
    }

    @Test
    void createTicket_rejectsWhenMoreThanThreeAttachmentsRequested() {
        MultipartFile f1 = org.mockito.Mockito.mock(MultipartFile.class);
        MultipartFile f2 = org.mockito.Mockito.mock(MultipartFile.class);
        MultipartFile f3 = org.mockito.Mockito.mock(MultipartFile.class);
        MultipartFile f4 = org.mockito.Mockito.mock(MultipartFile.class);

        BadRequestException ex = assertThrows(
            BadRequestException.class,
            () -> ticketService.createTicket(
                "Title",
                "Description",
                "Location",
                "OTHER",
                "LOW",
                "A",
                "a@campus.edu",
                null,
                List.of(f1, f2, f3, f4)
            )
        );

        assertTrue(ex.getMessage().contains("Maximum 3 attachments"));
    }

    @Test
    void getAllTickets_returnsEnrichedResponses() {
        Ticket t1 = baseTicket("T-8", TicketStatus.OPEN);
        t1.setCreatedAt(LocalDateTime.now().minusHours(1));
        Ticket t2 = baseTicket("T-9", TicketStatus.RESOLVED);
        t2.setCreatedAt(LocalDateTime.now().minusHours(8));

        when(ticketRepository.findAll()).thenReturn(List.of(t1, t2));
        when(attachmentRepository.findByTicketId("T-8")).thenReturn(List.of());
        when(attachmentRepository.findByTicketId("T-9")).thenReturn(List.of());

        List<TicketResponse> result = ticketService.getAllTickets();

        assertEquals(2, result.size());
        assertEquals("T-8", result.get(0).getId());
        assertNotNull(result.get(0).getSlaStatus());
    }

    @Test
    void getFilteredTickets_withStatusAndPriority_returnsMatch() {
        Ticket t1 = baseTicket("T-10", TicketStatus.OPEN);
        t1.setPriority(Priority.HIGH);
        Ticket t2 = baseTicket("T-11", TicketStatus.OPEN);
        t2.setPriority(Priority.LOW);

        when(ticketRepository.findByStatus(TicketStatus.OPEN)).thenReturn(List.of(t1, t2));
        when(attachmentRepository.findByTicketId(anyString())).thenReturn(List.of());

        List<TicketResponse> result = ticketService.getFilteredTickets("OPEN", "HIGH");

        assertEquals(1, result.size());
        assertEquals("T-10", result.get(0).getId());
    }

    @Test
    void getFilteredTickets_rejectsUnknownStatus() {
        BadRequestException ex = assertThrows(
            BadRequestException.class,
            () -> ticketService.getFilteredTickets("NOT_A_STATUS", null)
        );

        assertTrue(ex.getMessage().contains("Unknown status"));
    }

    @Test
    void getTicketById_returnsMappedResponse() {
        Ticket ticket = baseTicket("T-12", TicketStatus.OPEN);
        when(ticketRepository.findById("T-12")).thenReturn(Optional.of(ticket));
        when(attachmentRepository.findByTicketId("T-12")).thenReturn(List.of());

        TicketResponse response = ticketService.getTicketById("T-12");

        assertEquals("T-12", response.getId());
        assertEquals(TicketStatus.OPEN, response.getStatus());
    }

    @Test
    void resolveTicket_setsResolvedStatusAndNotes() {
        Ticket ticket = baseTicket("T-13", TicketStatus.IN_PROGRESS);
        when(ticketRepository.findById("T-13")).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(inv -> inv.getArgument(0));
        when(attachmentRepository.findByTicketId("T-13")).thenReturn(List.of());

        ResolveRequest request = new ResolveRequest();
        request.setResolutionNotes("Fixed and tested");

        TicketResponse response = ticketService.resolveTicket("T-13", request);

        assertEquals(TicketStatus.RESOLVED, response.getStatus());
        assertEquals("Fixed and tested", response.getResolutionNotes());
    }

    @Test
    void getAttachments_returnsMappedList() {
        Ticket ticket = baseTicket("T-14", TicketStatus.OPEN);
        Attachment a = new Attachment();
        a.setId("A-14");
        a.setFileName("photo.png");
        a.setFileUrl("/api/files/tickets/T-14/photo.png");
        a.setTicketId("T-14");

        when(ticketRepository.findById("T-14")).thenReturn(Optional.of(ticket));
        when(attachmentRepository.findByTicketId("T-14")).thenReturn(List.of(a));

        List<AttachmentResponse> result = ticketService.getAttachments("T-14");

        assertEquals(1, result.size());
        assertEquals("A-14", result.get(0).getId());
    }

    @Test
    void deleteAttachment_whenExists_deletesEntity() {
        Attachment a = new Attachment();
        a.setId("A-15");
        when(attachmentRepository.findById("A-15")).thenReturn(Optional.of(a));

        ticketService.deleteAttachment("A-15");

        verify(attachmentRepository).delete(a);
    }

    @Test
    void deleteAttachment_whenMissing_throws() {
        when(attachmentRepository.findById("A-404")).thenReturn(Optional.empty());

        ResourceNotFoundException ex = assertThrows(
            ResourceNotFoundException.class,
            () -> ticketService.deleteAttachment("A-404")
        );

        assertTrue(ex.getMessage().contains("Attachment not found"));
    }

    @Test
    void addAttachments_withValidFile_savesAndReturnsResponse() throws Exception {
        Path tempDir = Files.createTempDirectory("ticket-service-test");
        ReflectionTestUtils.setField(ticketService, "uploadDir", tempDir.toString());

        Ticket ticket = baseTicket("T-16", TicketStatus.OPEN);
        when(ticketRepository.findById("T-16")).thenReturn(Optional.of(ticket));
        when(attachmentRepository.findByTicketId("T-16")).thenReturn(List.of());
        when(attachmentRepository.save(any(Attachment.class))).thenAnswer(inv -> {
            Attachment saved = inv.getArgument(0);
            saved.setId("A-16");
            return saved;
        });

        MockMultipartFile file = new MockMultipartFile(
            "files",
            "proof.png",
            "image/png",
            "png-binary".getBytes()
        );

        List<AttachmentResponse> result = ticketService.addAttachments("T-16", List.of(file));

        assertEquals(1, result.size());
        assertEquals("A-16", result.get(0).getId());
        assertTrue(result.get(0).getFileUrl().contains("/api/files/tickets/T-16/"));
    }

    @Test
    void createTicket_withAttachment_savesMetadata() throws Exception {
        Path tempDir = Files.createTempDirectory("ticket-create-test");
        ReflectionTestUtils.setField(ticketService, "uploadDir", tempDir.toString());

        when(ticketRepository.save(any(Ticket.class))).thenAnswer(inv -> {
            Ticket t = inv.getArgument(0);
            t.setId("T-17");
            return t;
        });
        when(attachmentRepository.save(any(Attachment.class))).thenAnswer(inv -> inv.getArgument(0));
        when(attachmentRepository.findByTicketId("T-17")).thenReturn(List.of());

        MockMultipartFile file = new MockMultipartFile(
            "attachments",
            "evidence.jpg",
            "image/jpeg",
            "jpeg-binary".getBytes()
        );

        ticketService.createTicket(
            "Network outage",
            "No internet",
            "Lab 2",
            "OTHER",
            "MEDIUM",
            "User",
            "user@campus.edu",
            null,
            List.of(file)
        );

        verify(attachmentRepository).save(any(Attachment.class));
    }

    private Ticket baseTicket(String id, TicketStatus status) {
        Ticket ticket = new Ticket();
        ticket.setId(id);
        ticket.setTitle("Ticket " + id);
        ticket.setDescription("Description");
        ticket.setLocation("Location");
        ticket.setCategory(Category.OTHER);
        ticket.setPriority(Priority.MEDIUM);
        ticket.setStatus(status);
        return ticket;
    }
}
