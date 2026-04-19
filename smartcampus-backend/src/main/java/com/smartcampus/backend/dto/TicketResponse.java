package com.smartcampus.backend.dto;

import com.smartcampus.backend.entity.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * TicketResponse – JSON shape sent back to the React frontend.
 *
 * The frontend reads: id, title, description, location, category, priority,
 * status, contactName, contactEmail, reportedBy { name, role },
 * assignedTechnician, resolutionNotes, attachmentUrls[], createdAt, updatedAt
 */
public class TicketResponse {

    private String id;
    private String title;
    private String description;
    private String location;
    private Category category;
    private Priority priority;
    private TicketStatus status;
    private String contactName;
    private String contactEmail;
    private UserSummary reportedBy;
    private String assignedTechnician;
    private String resolutionNotes;
    private List<String> attachmentUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String slaStatus; // NORMAL, WARNING, CRITICAL, RESOLVED

    /** Inner summary mirrors the { name, role } shape the frontend reads */
    public static class UserSummary {
        private String id;
        private String name;
        private String email;
        private UserRole role;

        public String getId()           { return id; }
        public void setId(String id)    { this.id = id; }
        public String getName()         { return name; }
        public void setName(String n)   { this.name = n; }
        public String getEmail()        { return email; }
        public void setEmail(String e)  { this.email = e; }
        public UserRole getRole()       { return role; }
        public void setRole(UserRole r) { this.role = r; }
    }

    // ── Factory ──────────────────────────────────────────────
    public static TicketResponse from(Ticket t) {
        TicketResponse r = new TicketResponse();
        r.id = t.getId();
        r.title = t.getTitle();
        r.description = t.getDescription();
        r.location = t.getLocation();
        r.category = t.getCategory();
        r.priority = t.getPriority();
        r.status = t.getStatus();
        r.contactName = t.getContactName();
        r.contactEmail = t.getContactEmail();
        r.assignedTechnician = t.getAssignedTechnician();
        r.resolutionNotes = t.getResolutionNotes();
        r.createdAt = t.getCreatedAt();
        r.updatedAt = t.getUpdatedAt();

        if (t.getReportedById() != null) {
            UserSummary u = new UserSummary();
            u.id = t.getReportedById();
            u.name = t.getReportedByName();
            u.email = t.getReportedByEmail();
            u.role = t.getReportedByRole();
            r.reportedBy = u;
        }

        return r;
    }

    // ── Getters & Setters ──────────────────────────────────────
    public String getId()                            { return id; }
    public void setId(String id)                     { this.id = id; }
    public String getTitle()                         { return title; }
    public void setTitle(String t)                   { this.title = t; }
    public String getDescription()                   { return description; }
    public void setDescription(String d)             { this.description = d; }
    public String getLocation()                      { return location; }
    public void setLocation(String l)                { this.location = l; }
    public Category getCategory()                    { return category; }
    public void setCategory(Category c)              { this.category = c; }
    public Priority getPriority()                    { return priority; }
    public void setPriority(Priority p)              { this.priority = p; }
    public TicketStatus getStatus()                  { return status; }
    public void setStatus(TicketStatus s)            { this.status = s; }
    public String getContactName()                   { return contactName; }
    public void setContactName(String n)             { this.contactName = n; }
    public String getContactEmail()                  { return contactEmail; }
    public void setContactEmail(String e)            { this.contactEmail = e; }
    public UserSummary getReportedBy()               { return reportedBy; }
    public void setReportedBy(UserSummary u)         { this.reportedBy = u; }
    public String getAssignedTechnician()            { return assignedTechnician; }
    public void setAssignedTechnician(String t)      { this.assignedTechnician = t; }
    public String getResolutionNotes()               { return resolutionNotes; }
    public void setResolutionNotes(String r)         { this.resolutionNotes = r; }
    public List<String> getAttachmentUrls()          { return attachmentUrls; }
    public void setAttachmentUrls(List<String> urls) { this.attachmentUrls = urls; }
    public LocalDateTime getCreatedAt()              { return createdAt; }
    public void setCreatedAt(LocalDateTime d)        { this.createdAt = d; }
    public LocalDateTime getUpdatedAt()              { return updatedAt; }
    public void setUpdatedAt(LocalDateTime d)        { this.updatedAt = d; }
    public String getSlaStatus()                     { return slaStatus; }
    public void setSlaStatus(String s)               { this.slaStatus = s; }
}
