package com.example.travel_planner.controller;

import com.example.travel_planner.dto.CountryResponse;
import com.example.travel_planner.dto.DestinationRequest;
import com.example.travel_planner.dto.DestinationResponse;
import com.example.travel_planner.dto.MessageResponse;
import com.example.travel_planner.service.DestinationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/admin")
public class AdminController {

    private final DestinationService destinationService;

    @GetMapping("/fetch-from-api")
    public ResponseEntity<List<CountryResponse>> fetchFromApi() {
        return ResponseEntity.ok(destinationService.fetchFromApi());
    }

    @PostMapping("/destinations")
    public ResponseEntity<String> addDestination(@Valid @RequestBody DestinationRequest request) {
        destinationService.addDestination(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Destination created successfully");
    }

    @DeleteMapping("/destinations/{id}")
    public ResponseEntity<MessageResponse> deleteDestination(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.ok(MessageResponse.builder().message("Destination Deleted successfully").build());
    }
}
