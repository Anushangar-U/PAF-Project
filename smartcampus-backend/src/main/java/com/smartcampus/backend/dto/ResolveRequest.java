package com.smartcampus.backend.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Payload for PATCH /api/tickets/{id}/resolve
 * Body: { "resolutionNotes": "Replaced HDMI cable" }
 */
public class ResolveRequest {

    @NotBlank(message = "resolutionNotes cannot be empty")
    private String resolutionNotes;

    public String getResolutionNotes()          { return resolutionNotes; }
    public void setResolutionNotes(String r)    { this.resolutionNotes = r; }
}
