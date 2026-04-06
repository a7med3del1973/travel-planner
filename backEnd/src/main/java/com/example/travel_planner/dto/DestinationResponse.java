package com.example.travel_planner.dto;

public record DestinationResponse(
        Long id,
        String name,
        String capital,
        String region,
        Long population,
        String currency,
        String flagUrl,
        Boolean approved
) {
}

