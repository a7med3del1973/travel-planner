package com.example.travel_planner.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "destinations")
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String capital;

    private String region;

    private Long population;

    private String currency;

    private String flagUrl;

    @Column(nullable = false)
    private Boolean approved=false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
