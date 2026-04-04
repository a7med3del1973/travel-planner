package com.example.travel_planner.service;

import com.example.travel_planner.dto.CountryResponse;
import com.example.travel_planner.dto.DestinationRequest;
import com.example.travel_planner.dto.DestinationResponse;

import java.util.List;

public interface DestinationService {

    // Admin
    List<CountryResponse> fetchFromApi();
    DestinationResponse addDestination(DestinationRequest request);
    List<DestinationResponse> bulkAddDestinations(List<DestinationRequest> requests);
    void deleteDestination(Long id);

    // User
    List<DestinationResponse> getAllApprovedDestinations();
    List<DestinationResponse> searchDestinations(String name);
    DestinationResponse getDestinationById(Long id);
}
