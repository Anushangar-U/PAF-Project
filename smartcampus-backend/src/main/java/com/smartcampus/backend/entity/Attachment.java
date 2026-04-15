package com.smartcampus.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Attachment – file metadata for an uploaded ticket attachment.
 */
@Entity
@Table(name = "attachments")
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    private String fileType;

    @Column(nullable = false)
    private String fileUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    @JsonIgnore
    private Ticket ticket;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime uploadedAt;

    public Attachment() {}

    public Long getId()                          { return id; }
    public void setId(Long id)                   { this.id = id; }
    public String getFileName()                  { return fileName; }
    public void setFileName(String n)            { this.fileName = n; }
    public String getFileType()                  { return fileType; }
    public void setFileType(String t)            { this.fileType = t; }
    public String getFileUrl()                   { return fileUrl; }
    public void setFileUrl(String u)             { this.fileUrl = u; }
    public Ticket getTicket()                    { return ticket; }
    public void setTicket(Ticket t)              { this.ticket = t; }
    public LocalDateTime getUploadedAt()         { return uploadedAt; }
    public void setUploadedAt(LocalDateTime d)   { this.uploadedAt = d; }
}
