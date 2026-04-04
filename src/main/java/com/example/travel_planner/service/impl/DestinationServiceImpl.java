package com.example.travel_planner.service.impl;

import com.example.travel_planner.dto.CountryResponse;
import com.example.travel_planner.dto.RestCountryApiResponse;
import com.example.travel_planner.mapper.CountryMapper;
import com.example.travel_planner.service.DestinationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Fetches country data from the external RestCountries API and maps it to
 * the application's own {@link CountryResponse} DTO.
 */
@Service
public class DestinationServiceImpl implements DestinationService {

    private final RestTemplate restTemplate;
    private final CountryMapper countryMapper;

    @Value("${rest.countries.api.url}")
    private String apiUrl;

    public DestinationServiceImpl(RestTemplate restTemplate, CountryMapper countryMapper) {
        this.restTemplate = restTemplate;
        this.countryMapper = countryMapper;
    }

    /**
     * Calls the external RestCountries API, maps every raw entry to a
     * {@link CountryResponse}, and returns the full list.
     *
     * @return list of mapped country responses, or an empty list on failure
     */
    @Override
    public List<CountryResponse> fetchFromApi() {
        RestCountryApiResponse[] rawCountries =
                restTemplate.getForObject(apiUrl, RestCountryApiResponse[].class);

        return Optional.ofNullable(rawCountries)
                .map(Arrays::asList)
                .orElse(Collections.emptyList())
                .stream()
                .map(countryMapper::toCountryResponse)
                .toList();
    }
}

