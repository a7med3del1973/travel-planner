package com.example.travel_planner.service;

import com.example.travel_planner.dto.AuthResponse;
import com.example.travel_planner.dto.request.LoginRequest;
import com.example.travel_planner.dto.request.RegisterRequest;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
