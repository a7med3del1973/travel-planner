package com.example.travel_planner.dto;

public record CountryResponse(
         String name,
         String capital,
         String region,
         Long population,
         String currency,
         String flagUrl
) {
}
