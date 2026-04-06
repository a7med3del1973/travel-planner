package com.example.travel_planner.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record BulkAddResponse(
        int saved,
        int skipped,
        List<String> skippedNames
) {
}
