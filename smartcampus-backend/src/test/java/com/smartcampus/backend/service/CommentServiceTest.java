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
        when(ticketRepository.findById(10L)).thenReturn(Optional.empty());

        ResourceNotFoundException ex = assertThrows(
            ResourceNotFoundException.class,
            () -> commentService.getCommentsByTicket(10L)
        );

        assertTrue(ex.getMessage().contains("Ticket not found"));
    }

    @Test
    void getCommentsByTicket_returnsCommentsWhenTicketExists() {
        when(ticketRepository.findById(3L)).thenReturn(Optional.of(new Ticket()));
        List<Comment> expected = List.of(new Comment(), new Comment());
        when(commentRepository.findByTicketIdOrderByCreatedAtAsc(3L)).thenReturn(expected);

        List<Comment> result = commentService.getCommentsByTicket(3L);

        assertEquals(2, result.size());
        verify(commentRepository).findByTicketIdOrderByCreatedAtAsc(3L);
    }

    @Test
    void addComment_mapsPayloadAndPersists() {
        Ticket ticket = new Ticket();
        ticket.setId(7L);
        CommentRequest request = new CommentRequest();
        request.setTicketId(7L);
        request.setAuthorName("Ali");
        request.setAuthorRole("USER");
        request.setContent("Need update");

        when(ticketRepository.findById(7L)).thenReturn(Optional.of(ticket));
        when(commentRepository.save(any(Comment.class))).thenAnswer(inv -> inv.getArgument(0));

        Comment saved = commentService.addComment(request);

        assertEquals("Need update", saved.getContent());
        assertEquals("Ali", saved.getAuthorName());
        assertEquals("USER", saved.getAuthorRole());
        assertEquals(ticket, saved.getTicket());
    }

    @Test
    void addCommentToTicket_overridesTicketIdFromPath() {
        Ticket ticket = new Ticket();
        ticket.setId(11L);

        CommentRequest request = new CommentRequest();
        request.setTicketId(1L);
        request.setAuthorName("Sara");
        request.setAuthorRole("TECHNICIAN");
        request.setContent("Investigating");

        when(ticketRepository.findById(11L)).thenReturn(Optional.of(ticket));
        when(commentRepository.save(any(Comment.class))).thenAnswer(inv -> inv.getArgument(0));

        Comment saved = commentService.addCommentToTicket(11L, request);

        assertEquals(11L, request.getTicketId());
        assertEquals(ticket, saved.getTicket());
    }

    @Test
    void updateComment_updatesMessageAndSaves() {
        Comment existing = new Comment();
        existing.setId(5L);
        existing.setContent("Old");

        CommentUpdateRequest req = new CommentUpdateRequest();
        req.setMessage("Updated");

        when(commentRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(commentRepository.save(existing)).thenReturn(existing);

        Comment updated = commentService.updateComment(5L, req);

        assertEquals("Updated", updated.getContent());
        verify(commentRepository).save(existing);
    }

    @Test
    void deleteComment_findsAndDeletes() {
        Comment existing = new Comment();
        existing.setId(12L);
        when(commentRepository.findById(12L)).thenReturn(Optional.of(existing));

        commentService.deleteComment(12L);

        verify(commentRepository).delete(existing);
    }
}
