package com.smartcampus.backend.dto;

import com.smartcampus.backend.entity.Attachment;

import java.time.LocalDateTime;

/**
 * AttachmentResponse – JSON shape returned from:
 * GET  /api/tickets/{id}/attachments
 * POST /api/tickets/{id}/attachments
 */
public class AttachmentResponse {

    private String           id;
    private String           fileName;
    private String           fileType;
    private String           fileUrl;
    private LocalDateTime    uploadedAt;

    // ── Factory ──────────────────────────────────────────────
    public static AttachmentResponse from(Attachment a) {
        AttachmentResponse r = new AttachmentResponse();
        r.id         = a.getId();
        r.fileName   = a.getFileName();
        r.fileType   = a.getFileType();
        r.fileUrl    = a.getFileUrl();
        r.uploadedAt = a.getUploadedAt();
        return r;
    }

    // ── Getters & Setters ──────────────────────────────────────
    public String getId()                         { return id; }
    public void setId(String id)                  { this.id = id; }
    public String getFileName()                   { return fileName; }
    public void setFileName(String n)             { this.fileName = n; }
    public String getFileType()                   { return fileType; }
    public void setFileType(String t)             { this.fileType = t; }
    public String getFileUrl()                    { return fileUrl; }
    public void setFileUrl(String u)              { this.fileUrl = u; }
    public LocalDateTime getUploadedAt()          { return uploadedAt; }
    public void setUploadedAt(LocalDateTime d)    { this.uploadedAt = d; }
}
