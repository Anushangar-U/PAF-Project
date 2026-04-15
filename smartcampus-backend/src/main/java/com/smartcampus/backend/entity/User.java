package com.smartcampus.backend.entity;

import jakarta.persistence.*;

/**
 * User – system user with a role.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;

    public User() {}

    public User(Long id, String name, String email, UserRole role) {
        this.id = id; this.name = name; this.email = email; this.role = role;
    }

    public Long getId()              { return id; }
    public void setId(Long id)       { this.id = id; }
    public String getName()          { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail()         { return email; }
    public void setEmail(String e)   { this.email = e; }
    public UserRole getRole()        { return role; }
    public void setRole(UserRole r)  { this.role = r; }
}
