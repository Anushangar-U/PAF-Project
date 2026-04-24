package com.smartcampus.backend.entity;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Comment – a message posted on a Ticket by any user or technician.
 */
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    @NotBlank(message = "Comment content cannot be empty")
    private String content;

    private String authorName;

    private String authorRole;

    private String ticketId;

    @CreatedDate
    private LocalDateTime createdAt;

    public Comment() {}

    public String getId()                      { return id; }
    public void setId(String id)               { this.id = id; }
    public String getContent()                 { return content; }
    public void setContent(String c)           { this.content = c; }
    public String getAuthorName()              { return authorName; }
    public void setAuthorName(String n)        { this.authorName = n; }
    public String getAuthorRole()              { return authorRole; }
    public void setAuthorRole(String r)        { this.authorRole = r; }
    public String getTicketId()                { return ticketId; }
    public void setTicketId(String t)          { this.ticketId = t; }
    public LocalDateTime getCreatedAt()        { return createdAt; }
    public void setCreatedAt(LocalDateTime d)  { this.createdAt = d; }
}
