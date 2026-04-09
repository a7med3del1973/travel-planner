package com.example.travel_planner.dto;


import lombok.Builder;

@Builder
public record DestinationResponse(
        Long id,
        String name,
        String capital,
        String region,
        Long population,
        String currency,
        String flagUrl,
        Boolean approved,
        Boolean isLiked
) {
}

