package com.smartcampus.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * FileController – serves uploaded attachment files.
 * Endpoint: GET /api/files/tickets/{ticketId}/{filename}
 */
@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * GET /api/files/tickets/{ticketId}/{filename}
     * Serves uploaded attachment files.
     * Returns 200 OK with file content or 404 if not found.
     */
    @GetMapping("/tickets/{ticketId}/{filename}")
    public ResponseEntity<byte[]> getFile(
            @PathVariable String ticketId,
            @PathVariable String filename
    ) throws IOException {
        Path filePath = Paths.get(uploadDir, "tickets", String.valueOf(ticketId), filename);

        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        byte[] fileBytes = Files.readAllBytes(filePath);

        // Detect content type from filename
        String contentType = detectContentType(filename);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(fileBytes);
    }

    /**
     * Detect MIME type based on file extension.
     */
    private String detectContentType(String filename) {
        if (filename == null) return "application/octet-stream";

        String lower = filename.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg"))  return "image/jpeg";
        if (lower.endsWith(".png"))   return "image/png";
        if (lower.endsWith(".gif"))   return "image/gif";
        if (lower.endsWith(".webp"))  return "image/webp";
        if (lower.endsWith(".pdf"))   return "application/pdf";
        if (lower.endsWith(".txt"))   return "text/plain";

        return "application/octet-stream";
    }
}
