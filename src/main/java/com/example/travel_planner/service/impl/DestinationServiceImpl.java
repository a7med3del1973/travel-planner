package com.example.travel_planner.service.impl;

import com.example.travel_planner.dto.CountryResponse;
import com.example.travel_planner.dto.DestinationRequest;
import com.example.travel_planner.dto.RestCountryApiResponse;
import com.example.travel_planner.mapper.CountryMapper;
import com.example.travel_planner.mapper.DestinationMapper;
import com.example.travel_planner.repository.DestinationRepository;
import com.example.travel_planner.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DestinationServiceImpl implements DestinationService {

    private final RestTemplate restTemplate;
    private final CountryMapper countryMapper;
    private final DestinationMapper destinationMapper;
    private final DestinationRepository destinationRepository;

    @Value("${rest.countries.api.url}")
    private String apiUrl;

    // ── Admin ──────────────────────────────────────────────────────────────────

    @Override
    public List<CountryResponse> fetchFromApi() {
        RestCountryApiResponse[] rawCountries =
                restTemplate.getForObject(apiUrl, RestCountryApiResponse[].class);

        return Optional.ofNullable(rawCountries).map(Arrays::asList)
                .orElse(Collections.emptyList())
                .stream()
                .map(countryMapper::toCountryResponse)
                .toList();
    }

    @Override
    public void addDestination(DestinationRequest request) {
        if (destinationRepository.existsByName(request.name())) {
            throw new IllegalArgumentException(
                    "Destination with name '" + request.name() + "' already exists.");
        }

        destinationRepository.save(destinationMapper.toEntity(request));
    }

    @Override
    public void deleteDestination(Long id) {
        if (!destinationRepository.existsById(id)) {
            throw new jakarta.persistence.EntityNotFoundException(
                    "Destination with id '" + id + "' not found.");
        }

        destinationRepository.deleteById(id);
    }
}
