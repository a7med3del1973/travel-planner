package com.example.travel_planner.mapper;

import com.example.travel_planner.dto.request.DestinationRequest;
import com.example.travel_planner.dto.DestinationResponse;
import com.example.travel_planner.model.Destination;
import com.example.travel_planner.model.User;
import com.example.travel_planner.model.Visit;
import com.example.travel_planner.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DestinationMapper {

    private final VisitRepository visitRepository;

    public Destination toEntity(DestinationRequest request) {
        return Destination.builder()
                .name(request.name())
                .capital(request.capital())
                .region(request.region())
                .population(request.population())
                .currency(request.currency())
                .flagUrl(request.flagUrl())
                .approved(true)
                .build();
    }

    public DestinationResponse toResponse(Destination destination) {
        Boolean isLiked = false;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            Optional<Visit> visit = visitRepository.findByUserIdAndDestinationId(user.getId(), destination.getId());
            if (visit.isPresent() && Boolean.TRUE.equals(visit.get().getIsLiked())) {
                isLiked = true;
            }
        }

        return DestinationResponse.builder()
                .id(destination.getId())
                .name(destination.getName())
                .capital(destination.getCapital())
                .region(destination.getRegion())
                .population(destination.getPopulation())
                .currency(destination.getCurrency())
                .flagUrl(destination.getFlagUrl())
                .approved(destination.getApproved())
                .isLiked(isLiked)
                .build();
    }
}
