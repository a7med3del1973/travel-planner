package com.example.travel_planner.repository;

import com.example.travel_planner.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {

    @Query("SELECT d FROM Destination d WHERE d.approved = true")
    List<Destination> findByApprovedTrue();

    @Query("SELECT d FROM Destination d WHERE d.approved = true AND LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Destination> findByApprovedTrueAndNameContainingIgnoreCase(@Param("name") String name);

    @Query("SELECT COUNT(d) > 0 FROM Destination d WHERE LOWER(d.name) = LOWER(:name)")
    Boolean existsByName(@Param("name") String name);
}
