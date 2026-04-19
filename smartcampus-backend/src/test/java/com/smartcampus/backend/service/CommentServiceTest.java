package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.CommentRequest;
import com.smartcampus.backend.dto.CommentUpdateRequest;
import com.smartcampus.backend.entity.Comment;
import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.exception.ResourceNotFoundException;
import com.smartcampus.backend.repository.CommentRepository;
import com.smartcampus.backend.repository.TicketRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private TicketRepository ticketRepository;

    @InjectMocks
    private CommentService commentService;

    @Test
    void getCommentsByTicket_throwsWhenTicketMissing() {
        when(ticketRepository.findById("10")).thenReturn(Optional.empty());

        ResourceNotFoundException ex = assertThrows(
            ResourceNotFoundException.class,
            () -> commentService.getCommentsByTicket("10")
        );

        assertTrue(ex.getMessage().contains("Ticket not found"));
    }

    @Test
    void getCommentsByTicket_returnsCommentsWhenTicketExists() {
        when(ticketRepository.findById("3")).thenReturn(Optional.of(new Ticket()));
        List<Comment> expected = List.of(new Comment(), new Comment());
        when(commentRepository.findByTicketIdOrderByCreatedAtAsc("3")).thenReturn(expected);

        List<Comment> result = commentService.getCommentsByTicket("3");

        assertEquals(2, result.size());
        verify(commentRepository).findByTicketIdOrderByCreatedAtAsc("3");
    }

    @Test
    void addComment_mapsPayloadAndPersists() {
        Ticket ticket = new Ticket();
        ticket.setId("7");
        CommentRequest request = new CommentRequest();
        request.setTicketId("7");
        request.setAuthorName("Ali");
        request.setAuthorRole("USER");
        request.setContent("Need update");

        when(ticketRepository.findById("7")).thenReturn(Optional.of(ticket));
        when(commentRepository.save(any(Comment.class))).thenAnswer(inv -> inv.getArgument(0));

        Comment saved = commentService.addComment(request);

        assertEquals("Need update", saved.getContent());
        assertEquals("Ali", saved.getAuthorName());
        assertEquals("USER", saved.getAuthorRole());
        assertEquals("7", saved.getTicketId());
    }

    @Test
    void addCommentToTicket_overridesTicketIdFromPath() {
        Ticket ticket = new Ticket();
        ticket.setId("11");

        CommentRequest request = new CommentRequest();
        request.setTicketId("1");
        request.setAuthorName("Sara");
        request.setAuthorRole("TECHNICIAN");
        request.setContent("Investigating");

        when(ticketRepository.findById("11")).thenReturn(Optional.of(ticket));
        when(commentRepository.save(any(Comment.class))).thenAnswer(inv -> inv.getArgument(0));

        Comment saved = commentService.addCommentToTicket("11", request);

        assertEquals("11", request.getTicketId());
        assertEquals("11", saved.getTicketId());
    }

    @Test
    void updateComment_updatesMessageAndSaves() {
        Comment existing = new Comment();
        existing.setId("5");
        existing.setContent("Old");

        CommentUpdateRequest req = new CommentUpdateRequest();
        req.setMessage("Updated");

        when(commentRepository.findById("5")).thenReturn(Optional.of(existing));
        when(commentRepository.save(existing)).thenReturn(existing);

        Comment updated = commentService.updateComment("5", req);

        assertEquals("Updated", updated.getContent());
        verify(commentRepository).save(existing);
    }

    @Test
    void deleteComment_findsAndDeletes() {
        Comment existing = new Comment();
        existing.setId("12");
        when(commentRepository.findById("12")).thenReturn(Optional.of(existing));

        commentService.deleteComment("12");

        verify(commentRepository).delete(existing);
    }
}
