package com.smartcampus.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.entity.Role;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id,
                                            @RequestBody Map<String, String> request) {

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        String roleValue = request.get("role");
        if (roleValue == null || roleValue.isBlank()) {
            return ResponseEntity.badRequest().body("Role is required");
        }

        try {
            Role newRole = Role.valueOf(roleValue.toUpperCase());
            user.setRole(newRole);
            userRepository.save(user);

            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role value");
        }
    }
    @PostMapping("/test")
        public User createTestUser() {
        User user = new User();
        user.setName("Holly");
        user.setEmail("holly@gmail.com");
        user.setRole(Role.USER);
        user.setProvider("LOCAL");
        user.setProviderId("TEST001");

        return userRepository.save(user);
    }
}