package com.smartcampus.backend.dto;

import com.smartcampus.backend.entity.TicketStatus;
import jakarta.validation.constraints.NotNull;

/**
 * Payload for PATCH /api/tickets/{id}/status
 */
public class TicketStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private TicketStatus status;
    private String resolutionNotes;
    private String assignedTechnician;

    public TicketStatus getStatus()                      { return status; }
    public void setStatus(TicketStatus s)                { this.status = s; }
    public String getResolutionNotes()                   { return resolutionNotes; }
    public void setResolutionNotes(String r)             { this.resolutionNotes = r; }
    public String getAssignedTechnician()                { return assignedTechnician; }
    public void setAssignedTechnician(String t)          { this.assignedTechnician = t; }
}
