package com.smartcampus.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Ticket – central entity for the maintenance/incident ticketing system.
 */
@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Description is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Category is required")
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.OPEN;

    private String contactName;
    private String contactEmail;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reported_by_id")
    private User reportedBy;

    private String assignedTechnician;

    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true,
               fetch = FetchType.EAGER)
    private List<Attachment> attachments = new ArrayList<>();

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true,
               fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Ticket() {}

    // ── Getters & Setters ──────────────────────────────────────
    public Long getId()                                 { return id; }
    public void setId(Long id)                          { this.id = id; }
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
    public User getReportedBy()                         { return reportedBy; }
    public void setReportedBy(User u)                   { this.reportedBy = u; }
    public String getAssignedTechnician()               { return assignedTechnician; }
    public void setAssignedTechnician(String t)         { this.assignedTechnician = t; }
    public String getResolutionNotes()                  { return resolutionNotes; }
    public void setResolutionNotes(String r)            { this.resolutionNotes = r; }
    public List<Attachment> getAttachments()            { return attachments; }
    public void setAttachments(List<Attachment> a)      { this.attachments = a; }
    public List<Comment> getComments()                  { return comments; }
    public void setComments(List<Comment> c)            { this.comments = c; }
    public LocalDateTime getCreatedAt()                 { return createdAt; }
    public void setCreatedAt(LocalDateTime d)           { this.createdAt = d; }
    public LocalDateTime getUpdatedAt()                 { return updatedAt; }
    public void setUpdatedAt(LocalDateTime d)           { this.updatedAt = d; }
}
