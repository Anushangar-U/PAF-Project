package com.smartcampus.backend.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Payload for PATCH /api/tickets/{id}/assign
 * Body: { "technicianId": 5 }
 */
public class AssignTechnicianRequest {

    @NotNull(message = "technicianId is required")
    private String technicianId;

    public String getTechnicianId()         { return technicianId; }
    public void setTechnicianId(String id)  { this.technicianId = id; }
}
