package com.example.travel_planner.mapper;

import com.example.travel_planner.dto.request.DestinationRequest;
import com.example.travel_planner.dto.DestinationResponse;
import com.example.travel_planner.model.Destination;
import org.springframework.stereotype.Component;

@Component
public class DestinationMapper {

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
        return new DestinationResponse(
                destination.getId(),
                destination.getName(),
                destination.getCapital(),
                destination.getRegion(),
                destination.getPopulation(),
                destination.getCurrency(),
                destination.getFlagUrl(),
                destination.getApproved());
    }
}
