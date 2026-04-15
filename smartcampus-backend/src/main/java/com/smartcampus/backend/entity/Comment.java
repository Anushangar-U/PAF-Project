package com.smartcampus.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Comment – a message posted on a Ticket by any user or technician.
 */
@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Comment content cannot be empty")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String authorName;

    private String authorRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    @JsonIgnore
    private Ticket ticket;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Comment() {}

    public Long getId()                        { return id; }
    public void setId(Long id)                 { this.id = id; }
    public String getContent()                 { return content; }
    public void setContent(String c)           { this.content = c; }
    public String getAuthorName()              { return authorName; }
    public void setAuthorName(String n)        { this.authorName = n; }
    public String getAuthorRole()              { return authorRole; }
    public void setAuthorRole(String r)        { this.authorRole = r; }
    public Ticket getTicket()                  { return ticket; }
    public void setTicket(Ticket t)            { this.ticket = t; }
    public LocalDateTime getCreatedAt()        { return createdAt; }
    public void setCreatedAt(LocalDateTime d)  { this.createdAt = d; }
}
