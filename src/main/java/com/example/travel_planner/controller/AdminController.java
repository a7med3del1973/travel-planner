package com.example.travel_planner.controller;

import com.example.travel_planner.dto.CountryResponse;
import com.example.travel_planner.service.DestinationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/admin")
public class AdminController {

    private final DestinationService destinationService;


    public AdminController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping("/fetch-from-api")
    public ResponseEntity<List<CountryResponse>>fetchFromApi(){
        return ResponseEntity.ok(destinationService.fetchFromApi());
    }
}
