package com.smartcampus.backend.config;

import java.util.List;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final OAuthSuccessHandler oAuthSuccessHandler;
    private final ObjectProvider<ClientRegistrationRepository> clientRegistrationRepositoryProvider;

    public SecurityConfig(
            OAuthSuccessHandler oAuthSuccessHandler,
            ObjectProvider<ClientRegistrationRepository> clientRegistrationRepositoryProvider) {
        this.oAuthSuccessHandler = oAuthSuccessHandler;
        this.clientRegistrationRepositoryProvider = clientRegistrationRepositoryProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/notifications/**").authenticated()
                .anyRequest().permitAll()
            );

        if (clientRegistrationRepositoryProvider.getIfAvailable() != null) {
            http.oauth2Login(oauth -> oauth.successHandler(oAuthSuccessHandler));
        }

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
