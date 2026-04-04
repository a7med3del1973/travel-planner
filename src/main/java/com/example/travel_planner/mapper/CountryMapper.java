package com.example.travel_planner.mapper;

import com.example.travel_planner.dto.CountryResponse;
import com.example.travel_planner.dto.RestCountryApiResponse;
import org.springframework.stereotype.Component;

import java.util.Optional;


@Component
public class CountryMapper {

    public CountryResponse toCountryResponse(RestCountryApiResponse raw) {

        String name = Optional.ofNullable(raw.name())
                .map(RestCountryApiResponse.Name::common)
                .orElse("N/A");

        String capital = Optional.ofNullable(raw.capital())
                .filter(list -> !list.isEmpty())
                .map(list -> list.get(0))
                .orElse("N/A");

        String region = Optional.ofNullable(raw.region())
                .orElse("N/A");

        Long population = Optional.ofNullable(raw.population())
                .orElse(0L);

        String currency = Optional.ofNullable(raw.currencies()).flatMap(map -> map.values().stream().findFirst())
                .map(RestCountryApiResponse.Currency::name)
                .orElse("N/A");

        String flagUrl = Optional.ofNullable(raw.flags()).map(RestCountryApiResponse.Flags::png)
                .orElse("N/A");

        CountryResponse countryResponse= CountryResponse.builder()
                .name(name)
                .capital(capital)
                .region(region)
                .population(population)
                .currency(currency)
                .flagUrl(flagUrl)
                .build();


        return countryResponse;
    }
}
