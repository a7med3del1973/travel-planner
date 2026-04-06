package com.example.travel_planner.dto;

import lombok.Builder;

@Builder
public record AuthResponse(
        String username,
        String role,
        String token
) {}
