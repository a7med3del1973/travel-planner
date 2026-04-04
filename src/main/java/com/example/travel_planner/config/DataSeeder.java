package com.example.travel_planner.config;

import com.example.travel_planner.model.Role;
import com.example.travel_planner.model.User;
import com.example.travel_planner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        List<User> existingUsers = userRepository.findAll();
        for (User u : existingUsers) {
            String currentPassword = u.getPassword();
            // Basic check if the password is NOT a BCrypt hash (BCrypt starts with $2a$ or similar)
            if (currentPassword != null && !currentPassword.startsWith("$2a$")) {
                u.setPassword(passwordEncoder.encode(currentPassword));
                userRepository.save(u);
                System.out.println("Migrated plaintext password to BCrypt for user: " + u.getUsername());
            }
        }

        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@travel.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Default ADMIN account created - username: admin, password: admin123");
        }
    }
}
