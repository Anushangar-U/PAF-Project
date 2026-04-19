package com.smartcampus.backend.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Payload for POST /api/comments
 * { ticketId, authorName, authorRole, content }
 */
public class CommentRequest {

    private String ticketId;

    @NotBlank(message = "Author name is required")
    private String authorName;

    private String authorRole;

    @NotBlank(message = "Comment content cannot be empty")
    private String content;

    public String getTicketId()            { return ticketId; }
    public void setTicketId(String t)      { this.ticketId = t; }
    public String getAuthorName()          { return authorName; }
    public void setAuthorName(String n)    { this.authorName = n; }
    public String getAuthorRole()          { return authorRole; }
    public void setAuthorRole(String r)    { this.authorRole = r; }
    public String getContent()             { return content; }
    public void setContent(String c)       { this.content = c; }
}
