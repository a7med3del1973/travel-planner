package com.example.travel_planner.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record DestinationRequest(

        @NotBlank(message = "Name is required")
        String name,
        @NotBlank(message = "Capital is required")
        String capital,
        @NotBlank(message = "Region is required")
        String region,
        @Positive(message = "Population must be a positive number")
        Long population,
        @NotBlank(message = "Currency is required")
        String currency,
        String flagUrl
) {
}
