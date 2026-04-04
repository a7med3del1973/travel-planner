package com.example.travel_planner.service;

import com.example.travel_planner.dto.CountryResponse;

import java.util.List;

public interface DestinationService {


    // Admin
    List<CountryResponse> fetchFromApi();

    // User
}
