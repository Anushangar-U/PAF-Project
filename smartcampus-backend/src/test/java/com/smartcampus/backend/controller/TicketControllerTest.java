package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.AssignTechnicianRequest;
import com.smartcampus.backend.dto.CommentRequest;
import com.smartcampus.backend.dto.ResolveRequest;
import com.smartcampus.backend.dto.TicketResponse;
import com.smartcampus.backend.dto.TicketStatusUpdateRequest;
import com.smartcampus.backend.entity.Comment;
import com.smartcampus.backend.entity.TicketStatus;
import com.smartcampus.backend.service.CommentService;
import com.smartcampus.backend.service.TicketService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketControllerTest {

    @Mock
    private TicketService ticketService;

    @Mock
    private CommentService commentService;

    @InjectMocks
    private TicketController ticketController;

    @Test
    void getAllTickets_returnsOk() {
        TicketResponse response = new TicketResponse();
        response.setId("T-1");
        when(ticketService.getFilteredTickets("OPEN", "HIGH")).thenReturn(List.of(response));

        ResponseEntity<List<TicketResponse>> result = ticketController.getAllTickets("OPEN", "HIGH");

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(1, result.getBody().size());
    }

    @Test
    void createTicket_returnsCreated() {
        TicketResponse created = new TicketResponse();
        created.setId("T-2");

        when(ticketService.createTicket(
            eq("Projector"), eq("No display"), eq("Lab 3"), eq("IT_EQUIPMENT"),
            eq("HIGH"), eq("Ali"), eq("ali@campus.edu"), eq("U-1"), any()
        )).thenReturn(created);

        ResponseEntity<TicketResponse> result = ticketController.createTicket(
            "Projector",
            "No display",
            "Lab 3",
            "IT_EQUIPMENT",
            "HIGH",
            "Ali",
            "ali@campus.edu",
            "U-1",
            List.of()
        );

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertEquals("T-2", result.getBody().getId());
    }

    @Test
    void updateStatus_returnsOk() {
        TicketStatusUpdateRequest request = new TicketStatusUpdateRequest();
        request.setStatus(TicketStatus.IN_PROGRESS);

        TicketResponse updated = new TicketResponse();
        updated.setStatus(TicketStatus.IN_PROGRESS);
        when(ticketService.updateStatus("T-3", request)).thenReturn(updated);

        ResponseEntity<TicketResponse> result = ticketController.updateStatus("T-3", request);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(TicketStatus.IN_PROGRESS, result.getBody().getStatus());
    }

    @Test
    void assignTechnician_returnsOk() {
        AssignTechnicianRequest request = new AssignTechnicianRequest();
        request.setTechnicianId("U-99");

        TicketResponse updated = new TicketResponse();
        updated.setAssignedTechnician("Tech Name");
        when(ticketService.assignTechnician("T-4", request)).thenReturn(updated);

        ResponseEntity<TicketResponse> result = ticketController.assignTechnician("T-4", request);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("Tech Name", result.getBody().getAssignedTechnician());
    }

    @Test
    void resolveTicket_returnsOk() {
        ResolveRequest request = new ResolveRequest();
        request.setResolutionNotes("Replaced cable");

        TicketResponse updated = new TicketResponse();
        updated.setResolutionNotes("Replaced cable");
        when(ticketService.resolveTicket("T-5", request)).thenReturn(updated);

        ResponseEntity<TicketResponse> result = ticketController.resolveTicket("T-5", request);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("Replaced cable", result.getBody().getResolutionNotes());
    }

    @Test
    void deleteTicket_returnsNoContent() {
        ResponseEntity<Void> result = ticketController.deleteTicket("T-6");

        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        verify(ticketService).deleteTicket("T-6");
    }

    @Test
    void addComment_returnsCreated() {
        CommentRequest request = new CommentRequest();
        request.setAuthorName("Sara");
        request.setAuthorRole("TECHNICIAN");
        request.setContent("On the way");

        Comment saved = new Comment();
        saved.setId("C-1");
        when(commentService.addCommentToTicket("T-7", request)).thenReturn(saved);

        ResponseEntity<Comment> result = ticketController.addComment("T-7", request);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertEquals("C-1", result.getBody().getId());
    }

    @Test
    void getComments_returnsOk() {
        Comment c = new Comment();
        c.setId("C-2");
        when(commentService.getCommentsByTicket("T-8")).thenReturn(List.of(c));

        ResponseEntity<List<Comment>> result = ticketController.getComments("T-8");

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(1, result.getBody().size());
    }
}
