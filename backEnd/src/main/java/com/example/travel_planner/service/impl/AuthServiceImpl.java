package com.example.travel_planner.service.impl;

import com.example.travel_planner.dto.AuthResponse;
import com.example.travel_planner.dto.request.LoginRequest;
import com.example.travel_planner.dto.request.RegisterRequest;
import com.example.travel_planner.model.Role;
import com.example.travel_planner.model.User;
import com.example.travel_planner.repository.UserRepository;
import com.example.travel_planner.service.AuthService;
import com.example.travel_planner.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        User user = userRepository.findByEmail(request.username())
                .orElseGet(() -> userRepository.findByUsername(request.username())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid credentials")));

        String token = jwtService.generateToken(Map.of("id", user.getId()), user);

        return AuthResponse.builder()
                .username(user.getUsername())
                .role(user.getRole().name())
                .token(token)
                .build();
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(Map.of("id", user.getId()), user);

        return AuthResponse.builder()
                .username(user.getUsername())
                .role(user.getRole().name())
                .token(token)
                .build();
    }
}
