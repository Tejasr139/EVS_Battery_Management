package com.example.usermanagement.service;

import com.example.usermanagement.entity.User;
import com.example.usermanagement.models.LoginRequest;
import com.example.usermanagement.models.RegisterRequest;
import com.example.usermanagement.models.Role;
import com.example.usermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ✅ Register User
    public String registerUser(RegisterRequest request) {
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            return "Email already registered!";
        }

        // Validate confirm password
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return "Password and Confirm Password do not match!";
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setGender(request.getGender());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encrypt password
        user.setRole(Role.valueOf(request.getRole().toUpperCase())); // Convert string to enum

        userRepository.save(user);
        return "User registered successfully!";
    }

    // ✅ Login User
    public String loginUser(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            return "Invalid email!";
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return "Invalid password!";
        }

        return "Login successful!";
    }
}