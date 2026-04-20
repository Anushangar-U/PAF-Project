package com.smartcampus.backend.config;

import java.io.IOException;
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

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String name = oauthUser.getAttribute("name");
        String email = oauthUser.getAttribute("email");
        String providerId = oauthUser.getAttribute("sub");

        if (email != null) {
            Optional<User> existingUser = userRepository.findByEmail(email);

            if (existingUser.isEmpty()) {
                User user = new User();
                user.setName(name);
                user.setEmail(email);
                user.setRole(Role.USER);
                user.setProvider("GOOGLE");
                user.setProviderId(providerId);

                userRepository.save(user);
            }
        }

        response.sendRedirect("http://localhost:3001");
    }
}