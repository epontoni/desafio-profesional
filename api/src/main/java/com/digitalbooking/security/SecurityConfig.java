package com.digitalbooking.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final Environment environment;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
                          JwtAccessDeniedHandler jwtAccessDeniedHandler,
                          Environment environment) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.jwtAccessDeniedHandler = jwtAccessDeniedHandler;
        this.environment = environment;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        boolean isDev = environment.acceptsProfiles(Profiles.of("dev", "default"));

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler)
            )
            .authorizeHttpRequests(auth -> {
                auth
                    // Preflight CORS requests
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                    // Root and static/dashboard documentation
                    .requestMatchers(HttpMethod.GET, "/").permitAll()

                    // Public Auth endpoints
                    .requestMatchers("/api/auth/**").permitAll()

                    // Public Catalog read-only endpoints
                    .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/characteristics/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/bookings/product/**").permitAll()

                    // User Reviews submission (must precede POST /api/products/**)
                    .requestMatchers(HttpMethod.POST, "/api/products/*/reviews").authenticated()

                    // Admin only - Product management
                    .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                    // Admin only - Category management
                    .requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")

                    // Admin only - Characteristic management
                    .requestMatchers(HttpMethod.POST, "/api/characteristics/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/characteristics/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/characteristics/**").hasRole("ADMIN")

                    // User profile and management
                    .requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/users/*/role").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/users/**").authenticated()
                    .requestMatchers("/api/users/**").hasRole("ADMIN");

                // H2 console allowed only in dev profile
                if (isDev) {
                    auth.requestMatchers("/h2-console/**").permitAll();
                } else {
                    auth.requestMatchers("/h2-console/**").denyAll();
                }

                // Authenticated requests for Bookings, Favorites
                auth.requestMatchers(HttpMethod.GET, "/api/bookings").hasRole("ADMIN")
                    .requestMatchers("/api/bookings/**").authenticated()
                    .requestMatchers("/api/favorites/**").authenticated()
                    .anyRequest().authenticated();
            });

        // Configure frame options for H2 console in dev
        if (isDev) {
            http.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));
        }

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
