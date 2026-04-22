package com.smartcampus.backend.config;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.smartcampus.backend.entity.Role;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public OAuthSuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        System.out.println("=== OAuthSuccessHandler called ===");
        
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String name = oauthUser.getAttribute("name");
        String email = oauthUser.getAttribute("email");
        String providerId = oauthUser.getAttribute("sub");
        String picture = oauthUser.getAttribute("picture");

        System.out.println("User email: " + email);
        System.out.println("User name: " + name);

        User user = null;
        
        if (email != null) {
            Optional<User> existingUser = userRepository.findByEmail(email);

            if (existingUser.isEmpty()) {
                System.out.println("Creating new user...");
                user = new User();
                user.setName(name != null ? name : email.split("@")[0]);
                user.setEmail(email);
                user.setRole(Role.USER);
                user.setProvider("GOOGLE");
                user.setProviderId(providerId);
                user = userRepository.save(user);
                System.out.println("New user created with ID: " + user.getId());
            } else {
                user = existingUser.get();
                System.out.println("Existing user found with ID: " + user.getId());
            }
        }

        if (user == null) {
            System.out.println("User is null, redirecting to login with error");
            response.sendRedirect("http://localhost:3000/login?error=true");
            return;
        }

        if (picture == null) {
            picture = "";  // or just leave it null since you're not using it yet
        }

        // Create a simple token
        String token = "jwt-token-" + user.getId() + "-" + System.currentTimeMillis();
        String role = user.getRole() != null ? user.getRole().toString() : "USER";
        
        // Build JSON string manually (no Jackson dependency needed)
        String userJson = "{"
                + "\"id\":\"" + user.getId() + "\","
                + "\"name\":\"" + escapeJson(user.getName()) + "\","
                + "\"email\":\"" + escapeJson(user.getEmail()) + "\","
                + "\"role\":\"" + role + "\""
                + "}";
        
        System.out.println("User JSON: " + userJson);
        
        // URL encode the token and user data
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
        String encodedUser = URLEncoder.encode(userJson, StandardCharsets.UTF_8);
        
        // CRITICAL: Redirect to OAuth2RedirectHandler with token and user data
        String redirectUrl = "http://localhost:3000/oauth2/redirect?token=" + encodedToken + "&user=" + encodedUser;
        
        System.out.println("Redirecting to: " + redirectUrl);
        
        // Send the redirect
        response.sendRedirect(redirectUrl);
    }
    
    // Helper method to escape JSON strings
    private String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }
}