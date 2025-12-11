package com.example.usermanagement.controller;

import com.example.usermanagement.entity.User;
import com.example.usermanagement.models.RegisterRequest;
import com.example.usermanagement.models.Role;
import com.example.usermanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class CrudController {


    private final UserService userService;


    // ✅ Add New User
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        String response = userService.registerUser(request);
        return ResponseEntity.ok(response);
    }

    // ✅ Edit User Details
    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody RegisterRequest request) {
        String response = userService.updateUser(id, request);
        return ResponseEntity.ok(response);
    }

    // ✅ Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        String response = userService.deleteUser(id);
        return ResponseEntity.ok(response);
    }

    // ✅ Assign Role
    @PutMapping("/{id}/role")
    public ResponseEntity<String> assignRole(@PathVariable Long id, @RequestParam String role) {
        String response = userService.assignRole(id, Role.valueOf(role.toUpperCase()));
        return ResponseEntity.ok(response);
    }

    // ✅ View All Users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ View User Status
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // ✅ Manage User Access (Activate/Deactivate)
    @PutMapping("/{id}/access")
    public ResponseEntity<String> manageAccess(@PathVariable Long id, @RequestParam boolean active) {
        String response = userService.manageAccess(id, active);
        return ResponseEntity.ok(response);
    }

}
