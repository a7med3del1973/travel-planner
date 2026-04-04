package com.example.travel_planner.dto;

import lombok.Builder;

@Builder
public record CountryResponse(
         String name,
         String capital,
         String region,
         Long population,
         String currency,
         String flagUrl
) {
}
