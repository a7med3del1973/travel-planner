package com.example.travel_planner.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.Map;


@JsonIgnoreProperties(ignoreUnknown = true)
public record RestCountryApiResponse(

        Name name,
        List<String> capital,
        String region,
        Long population,
        Map<String, Currency> currencies,
        Flags flags

) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Name(String common) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Currency(String name, String symbol) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Flags(String png) {
    }
}
