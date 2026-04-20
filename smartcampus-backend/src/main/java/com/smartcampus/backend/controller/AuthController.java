package com.smartcampus.backend.controller;

import java.util.Optional;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal OAuth2User oauth2User) {
        if (oauth2User == null) {
            return null;
        }

        String email = oauth2User.getAttribute("email");
        Optional<User> user = userRepository.findByEmail(email);

        return user.orElse(null);
    }
}