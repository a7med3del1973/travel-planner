package com.example.travel_planner.service.impl;

import com.example.travel_planner.dto.CountryResponse;
import com.example.travel_planner.dto.DestinationRequest;
import com.example.travel_planner.dto.DestinationResponse;
import com.example.travel_planner.service.DestinationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class DestinationServiceImpl implements DestinationService {



    @Override
    public List<CountryResponse> fetchFromApi() {
        return List.of();
    }

}
