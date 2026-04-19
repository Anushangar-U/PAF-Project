package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.CommentRequest;
import com.smartcampus.backend.dto.CommentUpdateRequest;
import com.smartcampus.backend.entity.Comment;
import com.smartcampus.backend.service.CommentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentControllerTest {

    @Mock
    private CommentService commentService;

    @InjectMocks
    private CommentController commentController;

    @Test
    void getCommentsByTicket_returnsOk() {
        Comment comment = new Comment();
        comment.setId("C-1");
        when(commentService.getCommentsByTicket("T-1")).thenReturn(List.of(comment));

        ResponseEntity<List<Comment>> result = commentController.getCommentsByTicket("T-1");

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(1, result.getBody().size());
    }

    @Test
    void addComment_returnsCreated() {
        CommentRequest request = new CommentRequest();
        request.setTicketId("T-2");
        request.setAuthorName("Ali");
        request.setAuthorRole("USER");
        request.setContent("Need update");

        Comment saved = new Comment();
        saved.setId("C-2");
        when(commentService.addComment(request)).thenReturn(saved);

        ResponseEntity<Comment> result = commentController.addComment(request);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertEquals("C-2", result.getBody().getId());
    }

    @Test
    void updateComment_returnsOk() {
        CommentUpdateRequest request = new CommentUpdateRequest();
        request.setMessage("Updated text");

        Comment updated = new Comment();
        updated.setId("C-3");
        updated.setContent("Updated text");
        when(commentService.updateComment("C-3", request)).thenReturn(updated);

        ResponseEntity<Comment> result = commentController.updateComment("C-3", request);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("Updated text", result.getBody().getContent());
    }

    @Test
    void deleteComment_returnsNoContent() {
        ResponseEntity<Void> result = commentController.deleteComment("C-4");

        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        verify(commentService).deleteComment("C-4");
    }
}
