package com.example.travel_planner.dto;

import lombok.Builder;

@Builder
public record MessageResponse(
        String message
) {
}

