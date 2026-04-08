package com.example.travel_planner.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.travel_planner.model.Visit;
import java.util.Optional;
import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {

    @Query("SELECT w FROM Visit w WHERE w.user.id =:userId")
    List<Visit> findByUserId(@Param("userId") Long userId);

    @Query("SELECT w FROM Visit w WHERE w.user.id = :userId AND w.destination.id = :destinationId")
    Optional<Visit> findByUserIdAndDestinationId(
            @Param("userId") Long userId,
            @Param("destinationId") Long destinationId
    );

    @Query("SELECT COUNT(w) > 0 FROM Visit w WHERE w.user.id = :userId AND w.destination.id =:destinationId")
    Boolean existsByUserIdAndDestinationId(
            @Param("userId") Long userId,
            @Param("destinationId") Long destinationId
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM Visit w WHERE w.user.id = :userId AND w.destination.id = :destinationId")
    void deleteByUserIdAndDestinationId(
            @Param("userId") Long userId,
            @Param("destinationId") Long destinationId
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM Visit w WHERE w.destination.id = :destinationId")
    void deleteByDestinationId(@Param("destinationId") Long destinationId);
}