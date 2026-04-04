package com.example.travel_planner.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.Map;

/**
 * Raw response model matching the nested JSON returned by restcountries.com v3.1.
 * Only the fields we care about are mapped; everything else is ignored.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record RestCountryApiResponse(

        Name name,
        List<String> capital,
        String region,
        Long population,

        /**
         * currencies: { "USD": { "name": "US dollar", "symbol": "$" }, ... }
         */
        Map<String, Currency> currencies,

        /**
         * flags: { "png": "https://...", "svg": "...", "alt": "..." }
         */
        Flags flags

) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Name(String common) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Currency(String name, String symbol) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Flags(String png) {}
}
