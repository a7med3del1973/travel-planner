package com.example.travel_planner.service;

import com.example.travel_planner.dto.BulkAddResponse;
import com.example.travel_planner.dto.CountryResponse;
import com.example.travel_planner.dto.DestinationRequest;
import com.example.travel_planner.dto.DestinationResponse;

import java.util.List;

public interface DestinationService {

    // Admin
    List<CountryResponse> fetchFromApi();

    void addDestination(DestinationRequest request);

    BulkAddResponse bulkAddDestinations(List<DestinationRequest> requests);

    void deleteDestination(Long id);

    // User
}
