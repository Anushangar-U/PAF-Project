package com.smartcampus.backend.exception;

import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * GlobalExceptionHandler – centralised error handling for the REST API.
 *
 * Every thrown exception is caught here and converted into a clean JSON
 * response body so the frontend (and Postman) always gets structured errors:
 *
 * {
 *   "timestamp": "2026-04-13T09:00:00",
 *   "status":    404,
 *   "error":     "Not Found",
 *   "message":   "Ticket not found: 99"
 * }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── 404 Resource Not Found ────────────────────────────────
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // ── 400 Bad Request (business rule violations) ────────────
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(BadRequestException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // ── 400 Validation errors (@Valid on @RequestBody) ────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex) {

        // Collect all field-level validation messages
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .toList();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status",    HttpStatus.BAD_REQUEST.value());
        body.put("error",     "Validation Failed");
        body.put("messages",  errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // ── 500 Catch-all ─────────────────────────────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,
            "An unexpected error occurred: " + ex.getMessage());
    }

    // ── Helper ────────────────────────────────────────────────
    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status",    status.value());
        body.put("error",     status.getReasonPhrase());
        body.put("message",   message);
        return ResponseEntity.status(status).body(body);
    }
}
