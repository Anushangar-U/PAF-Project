package com.smartcampus.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * User – system user with a role.
 */
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    private String email;

    private UserRole role = UserRole.USER;

    public User() {}

    public User(String id, String name, String email, UserRole role) {
        this.id = id; this.name = name; this.email = email; this.role = role;
    }

    public String getId()            { return id; }
    public void setId(String id)     { this.id = id; }
    public String getName()          { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail()         { return email; }
    public void setEmail(String e)   { this.email = e; }
    public UserRole getRole()        { return role; }
    public void setRole(UserRole r)  { this.role = r; }
}
