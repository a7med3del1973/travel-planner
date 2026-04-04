package com.example.travel_planner.mapper;

import com.example.travel_planner.dto.CountryResponse;
import com.example.travel_planner.dto.RestCountryApiResponse;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Maps a raw {@link RestCountryApiResponse} (from restcountries.com) to the
 * clean {@link CountryResponse} DTO that the API exposes to consumers.
 */
@Component
public class CountryMapper {

    /**
     * Converts one raw API entry to the application's {@link CountryResponse}.
     *
     * @param raw the raw country object returned by restcountries.com
     * @return a clean, flat {@link CountryResponse}
     */
    public CountryResponse toCountryResponse(RestCountryApiResponse raw) {

        String name = Optional.ofNullable(raw.name())
                .map(RestCountryApiResponse.Name::common)
                .orElse("N/A");

        String capital = Optional.ofNullable(raw.capital())
                .filter(list -> !list.isEmpty())
                .map(list -> list.get(0))
                .orElse("N/A");

        String region = Optional.ofNullable(raw.region()).orElse("N/A");

        Long population = Optional.ofNullable(raw.population()).orElse(0L);

        // currencies is a map of currency-code -> Currency; grab the first entry's name
        String currency = Optional.ofNullable(raw.currencies())
                .flatMap(map -> map.values().stream().findFirst())
                .map(RestCountryApiResponse.Currency::name)
                .orElse("N/A");

        String flagUrl = Optional.ofNullable(raw.flags())
                .map(RestCountryApiResponse.Flags::png)
                .orElse("N/A");

        return new CountryResponse(name, capital, region, population, currency, flagUrl);
    }
}
