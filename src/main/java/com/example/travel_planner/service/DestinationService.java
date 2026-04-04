package com.example.travel_planner.service;

import com.example.travel_planner.dto.BulkAddResponse;
import com.example.travel_planner.dto.CountryResponse;
import com.example.travel_planner.dto.request.DestinationRequest;
import com.example.travel_planner.dto.DestinationResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface DestinationService {

    // Admin
    Page<CountryResponse> fetchFromApi(int page, int size);
    void addDestination(DestinationRequest request);
    BulkAddResponse bulkAddDestinations(List<DestinationRequest> requests);
    void deleteDestination(Long id);

    // User
    Page<DestinationResponse> getDestinations(int page, int size);
    DestinationResponse getDestinationById(Long id);
    List<DestinationResponse> getDestinationsByName(String name);
}
