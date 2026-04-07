package com.example.travel_planner.service.impl;

import com.example.travel_planner.dto.*;
import com.example.travel_planner.dto.request.DestinationRequest;
import com.example.travel_planner.exception.EntityNotFoundException;
import com.example.travel_planner.mapper.CountryMapper;
import com.example.travel_planner.mapper.DestinationMapper;
import com.example.travel_planner.model.Destination;
import com.example.travel_planner.repository.DestinationRepository;
import com.example.travel_planner.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DestinationServiceImpl implements DestinationService {

    private final RestTemplate restTemplate;
    private final CountryMapper countryMapper;
    private final DestinationMapper destinationMapper;
    private final DestinationRepository destinationRepository;

    @Value("${rest.countries.api.url}")
    private String apiUrl;


    @Override
    public Page<CountryResponse> fetchFromApi(int page, int size) {
        RestCountryApiResponse[] rawCountries =
                restTemplate.getForObject(apiUrl, RestCountryApiResponse[].class);

        List<CountryResponse> allCountries = Optional.ofNullable(rawCountries).map(Arrays::asList)
                .orElse(Collections.emptyList())
                .stream()
                .map(countryMapper::toCountryResponse)
                .toList();

        Pageable pageable = PageRequest.of(page, size);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allCountries.size());

        List<CountryResponse> subList = (start <= allCountries.size()) 
                ? allCountries.subList(start, end) 
                : Collections.emptyList();

        return new PageImpl<>(subList, pageable, allCountries.size());
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
    public BulkAddResponse bulkAddDestinations(List<DestinationRequest> requests) {
        List<String> skippedNames = new ArrayList<>();
        List<DestinationRequest> newOnes = new ArrayList<>();

        for (DestinationRequest request : requests) {
            if (destinationRepository.existsByName(request.name())) {
                skippedNames.add(request.name());
            } else {
                newOnes.add(request);
            }
        }

        destinationRepository.saveAll(
                newOnes.stream().map(destinationMapper::toEntity).toList()
        );

        return BulkAddResponse.builder()
                .saved(newOnes.size())
                .skipped(skippedNames.size())
                .skippedNames(skippedNames)
                .build();
    }

    @Override
    public void deleteDestination(Long id) {
        if (!destinationRepository.existsById(id)) {
            throw new EntityNotFoundException("Destination", id);
        }
        destinationRepository.deleteById(id);
    }


    @Override
    public Page<DestinationResponse> getDestinations(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return destinationRepository.findAllApproved(pageable)
                .map(destinationMapper::toResponse);
    }

    @Override
    public DestinationResponse getDestinationById(Long id) {
        if (!destinationRepository.existsById(id)) {
            throw new EntityNotFoundException("Destination", id);
        }

        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Destination", id));

        return destinationMapper.toResponse(destination);
    }

    @Override
    public List<DestinationResponse> getDestinationsByName(String name) {
        return destinationRepository.findByApprovedTrueAndNameContainingIgnoreCase(name)
                .stream()
                .map(destinationMapper::toResponse)
                .toList();
    }
}


