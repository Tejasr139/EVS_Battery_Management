package com.example.usermanagement.controller;

import com.example.usermanagement.models.LoginRequest;
import com.example.usermanagement.models.RegisterRequest;
import com.example.usermanagement.service.UserService;
import com.example.usermanagement.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        String result = userService.registerUser(request);
        Map<String, String> response = new HashMap<>();
        
        if (result.equals("User registered successfully!")) {
            response.put("message", result);
            return ResponseEntity.ok(response);
        } else {
            response.put("error", result);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        String result = userService.loginUser(request);
        Map<String, String> response = new HashMap<>();
        
        if (result.equals("Login successful!")) {
            String token = jwtUtil.generateToken(request.getEmail());
            response.put("message", result);
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            response.put("error", result);
            return ResponseEntity.badRequest().body(response);
        }
    }
}