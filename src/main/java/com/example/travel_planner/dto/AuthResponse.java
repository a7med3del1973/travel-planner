package com.example.travel_planner.dto;

public record AuthResponse(
        String username,
        String role,
        String token
) {}
