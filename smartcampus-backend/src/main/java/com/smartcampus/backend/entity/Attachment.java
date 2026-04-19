package com.smartcampus.backend.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Attachment – file metadata for an uploaded ticket attachment.
 */
@Document(collection = "attachments")
public class Attachment {

    @Id
    private String id;

    private String fileName;

    private String fileType;

    private String fileUrl;

    private String ticketId;

    @CreatedDate
    private LocalDateTime uploadedAt;

    public Attachment() {}

    public String getId()                        { return id; }
    public void setId(String id)                 { this.id = id; }
    public String getFileName()                  { return fileName; }
    public void setFileName(String n)            { this.fileName = n; }
    public String getFileType()                  { return fileType; }
    public void setFileType(String t)            { this.fileType = t; }
    public String getFileUrl()                   { return fileUrl; }
    public void setFileUrl(String u)             { this.fileUrl = u; }
    public String getTicketId()                  { return ticketId; }
    public void setTicketId(String t)            { this.ticketId = t; }
    public LocalDateTime getUploadedAt()         { return uploadedAt; }
    public void setUploadedAt(LocalDateTime d)   { this.uploadedAt = d; }
}
