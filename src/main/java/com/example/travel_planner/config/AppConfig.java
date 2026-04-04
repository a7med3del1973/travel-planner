package com.example.travel_planner.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Central application configuration.
 * Registers infrastructure beans shared across services.
 */
@Configuration
public class AppConfig {

    /**
     * Provides a shared {@link RestTemplate} instance for outbound HTTP calls.
     * Defined as a bean so it can be injected and easily mocked in tests.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
