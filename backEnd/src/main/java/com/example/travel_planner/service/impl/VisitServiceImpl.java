package com.example.travel_planner.service.impl;

import com.example.travel_planner.exception.EntityNotFoundException;
import com.example.travel_planner.model.Destination;
import com.example.travel_planner.model.User;
import com.example.travel_planner.model.Visit;
import com.example.travel_planner.repository.DestinationRepository;
import com.example.travel_planner.repository.UserRepository;
import com.example.travel_planner.repository.VisitRepository;
import com.example.travel_planner.service.VisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VisitServiceImpl implements VisitService {

    private final VisitRepository visitRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;

    @Override
    public void markWantToVisit(Long userId, Long destinationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User", userId));

        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new EntityNotFoundException("Destination", destinationId));

        if (visitRepository.existsByUserIdAndDestinationId(userId, destinationId)) {
            throw new IllegalArgumentException("Destination already marked as 'Want to Visit'");
        }

        Visit visit = Visit.builder()
                .user(user)
                .destination(destination)
                .build();

        visitRepository.save(visit);
    }
}
