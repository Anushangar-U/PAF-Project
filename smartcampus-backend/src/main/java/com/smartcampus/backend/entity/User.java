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

    private String provider;     // GOOGLE or LOCAL
    private String providerId;   // Google unique ID

    public User() {
    }

    public User(String id, String name, String email, UserRole role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public User(String name, String email, Role role, String provider, String providerId) {
        this.name = name;
        this.email = email;
        this.role = role == null ? UserRole.USER : UserRole.valueOf(role.name());
        this.provider = provider;
        this.providerId = providerId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public void setRole(Role role) {
        this.role = role == null ? UserRole.USER : UserRole.valueOf(role.name());
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }
}
