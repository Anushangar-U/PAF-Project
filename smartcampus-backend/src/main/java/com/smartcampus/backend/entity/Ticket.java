package com.smartcampus.backend.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
/**
 * Ticket – central entity for the maintenance/incident ticketing system.
 */
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Category is required")
    private Category category;

    private Priority priority = Priority.MEDIUM;

    private TicketStatus status = TicketStatus.OPEN;

    private String contactName;
    private String contactEmail;

    private String reportedById;
    private String reportedByName;
    private String reportedByEmail;
    private UserRole reportedByRole;

    private String assignedTechnician;

    private String resolutionNotes;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public Ticket() {}

    // ── Getters & Setters ──────────────────────────────────────
    public String getId()                               { return id; }
    public void setId(String id)                        { this.id = id; }
    public String getTitle()                            { return title; }
    public void setTitle(String t)                      { this.title = t; }
    public String getDescription()                      { return description; }
    public void setDescription(String d)                { this.description = d; }
    public String getLocation()                         { return location; }
    public void setLocation(String l)                   { this.location = l; }
    public Category getCategory()                       { return category; }
    public void setCategory(Category c)                 { this.category = c; }
    public Priority getPriority()                       { return priority; }
    public void setPriority(Priority p)                 { this.priority = p; }
    public TicketStatus getStatus()                     { return status; }
    public void setStatus(TicketStatus s)               { this.status = s; }
    public String getContactName()                      { return contactName; }
    public void setContactName(String n)                { this.contactName = n; }
    public String getContactEmail()                     { return contactEmail; }
    public void setContactEmail(String e)               { this.contactEmail = e; }
    public String getReportedById()                     { return reportedById; }
    public void setReportedById(String v)               { this.reportedById = v; }
    public String getReportedByName()                   { return reportedByName; }
    public void setReportedByName(String v)             { this.reportedByName = v; }
    public String getReportedByEmail()                  { return reportedByEmail; }
    public void setReportedByEmail(String v)            { this.reportedByEmail = v; }
    public UserRole getReportedByRole()                 { return reportedByRole; }
    public void setReportedByRole(UserRole v)           { this.reportedByRole = v; }
    public String getAssignedTechnician()               { return assignedTechnician; }
    public void setAssignedTechnician(String t)         { this.assignedTechnician = t; }
    public String getResolutionNotes()                  { return resolutionNotes; }
    public void setResolutionNotes(String r)            { this.resolutionNotes = r; }
    public LocalDateTime getCreatedAt()                 { return createdAt; }
    public void setCreatedAt(LocalDateTime d)           { this.createdAt = d; }
    public LocalDateTime getUpdatedAt()                 { return updatedAt; }
    public void setUpdatedAt(LocalDateTime d)           { this.updatedAt = d; }
}
