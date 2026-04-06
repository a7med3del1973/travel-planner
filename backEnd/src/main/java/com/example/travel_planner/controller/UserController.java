package com.example.travel_planner.controller;

import com.example.travel_planner.dto.DestinationResponse;
import com.example.travel_planner.dto.MessageResponse;
import com.example.travel_planner.service.DestinationService;
import com.example.travel_planner.service.VisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/user")
public class UserController {

    private final DestinationService destinationService;
    private final VisitService visitService;

    @GetMapping("/approved-destinations")
    public ResponseEntity<Page<DestinationResponse>> getDestinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(destinationService.getDestinations(page, size));
    }

    @GetMapping("/destination/{id}")
    public ResponseEntity<DestinationResponse> getDestinationById(@PathVariable Long id) {
        return ResponseEntity.ok(destinationService.getDestinationById(id));
    }

    @GetMapping("/destinations/search")
    public ResponseEntity<List<DestinationResponse>> searchDestinationsByName(
            @RequestParam("name") String name) {
        return ResponseEntity.ok(destinationService.getDestinationsByName(name));
    }

    @PostMapping("/destination/{id}/want-to-visit")
    public ResponseEntity<MessageResponse> markWantToVisit(
            @PathVariable Long id,
            @RequestParam("userId") Long userId) {
        visitService.markWantToVisit(userId, id);
        return ResponseEntity.ok(MessageResponse.builder().message("Destination marked as Want to Visit").build());
    }
}
