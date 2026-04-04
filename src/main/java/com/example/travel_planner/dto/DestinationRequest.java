package com.example.travel_planner.dto;

public record DestinationRequest(
        String name,
        String capital,
        String region,
        Long population,
        String currency,
        String flagUrl
) {
}

