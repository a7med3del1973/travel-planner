package com.example.travel_planner.service.impl;

import com.example.travel_planner.dto.CountryResponse;
import com.example.travel_planner.dto.DestinationRequest;
import com.example.travel_planner.dto.DestinationResponse;
import com.example.travel_planner.repository.DestinationRepository;
import com.example.travel_planner.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class DestinationServiceImpl implements DestinationService {

    private final DestinationRepository destinationRepository;

    @Override
    public List<CountryResponse> fetchFromApi() {
        return List.of();
    }

    @Override
    public DestinationResponse addDestination(DestinationRequest request) {
        return null;
    }

    @Override
    public List<DestinationResponse> bulkAddDestinations(List<DestinationRequest> requests) {
        return List.of();
    }

    @Override
    public void deleteDestination(Long id) {

    }

    @Override
    public List<DestinationResponse> getAllApprovedDestinations() {
        return List.of();
    }

    @Override
    public List<DestinationResponse> searchDestinations(String name) {
        return List.of();
    }

    @Override
    public DestinationResponse getDestinationById(Long id) {
        return null;
    }
}
