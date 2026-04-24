package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.AttachmentResponse;
import com.smartcampus.backend.service.TicketService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AttachmentControllerTest {

    @Mock
    private TicketService ticketService;

    @InjectMocks
    private AttachmentController attachmentController;

    @Test
    void uploadAttachments_returnsCreated() {
        MultipartFile file = mock(MultipartFile.class);
        AttachmentResponse response = new AttachmentResponse();
        response.setId("A-1");

        when(ticketService.addAttachments("T-1", List.of(file))).thenReturn(List.of(response));

        ResponseEntity<List<AttachmentResponse>> result = attachmentController.uploadAttachments("T-1", List.of(file));

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertEquals(1, result.getBody().size());
        assertEquals("A-1", result.getBody().get(0).getId());
    }

    @Test
    void getAttachments_returnsOk() {
        AttachmentResponse response = new AttachmentResponse();
        response.setId("A-2");
        when(ticketService.getAttachments("T-2")).thenReturn(List.of(response));

        ResponseEntity<List<AttachmentResponse>> result = attachmentController.getAttachments("T-2");

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("A-2", result.getBody().get(0).getId());
    }

    @Test
    void deleteAttachment_returnsNoContent() {
        ResponseEntity<Void> result = attachmentController.deleteAttachment("A-3");

        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        verify(ticketService).deleteAttachment("A-3");
    }
}
