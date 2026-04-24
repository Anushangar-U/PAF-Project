package com.smartcampus.backend.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Payload for PUT /api/comments/{commentId}
 * Body: { "message": "Updated message here" }
 */
public class CommentUpdateRequest {

    @NotBlank(message = "message cannot be empty")
    private String message;

    public String getMessage()          { return message; }
    public void setMessage(String m)    { this.message = m; }
}
