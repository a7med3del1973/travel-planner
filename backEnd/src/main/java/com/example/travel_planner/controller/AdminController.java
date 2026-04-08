package com.example.travel_planner.controller;

import com.example.travel_planner.dto.BulkAddResponse;
import com.example.travel_planner.dto.CountryResponse;
import com.example.travel_planner.dto.DestinationResponse;
import com.example.travel_planner.dto.MessageResponse;
import com.example.travel_planner.dto.request.DestinationRequest;
import com.example.travel_planner.service.DestinationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Page<CountryResponse>> fetchFromApi(@RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(destinationService.fetchFromApi(page, size));
    }

    @PostMapping("/destinations")
    public ResponseEntity<String> addDestination(@Valid @RequestBody DestinationRequest request) {
        destinationService.addDestination(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Destination created successfully");
    }

    @PostMapping("/destinations/bulk")
    public ResponseEntity<BulkAddResponse> bulkAddDestinations(
            @Valid @RequestBody List<DestinationRequest> requests) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(destinationService.bulkAddDestinations(requests));
    }

    @DeleteMapping("/destinations/{id}")
    public ResponseEntity<MessageResponse> deleteDestination(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity
                .ok(MessageResponse.builder().message("Destination Deleted successfully").build());
    }

    @GetMapping("/destinations")
    public ResponseEntity<Page<DestinationResponse>> getDestinations(@RequestParam(defaultValue = "0") int page,
                                                                     @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(destinationService.getDestinations(page, size));
    }
}
