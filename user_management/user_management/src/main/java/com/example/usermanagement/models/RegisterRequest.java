package com.example.usermanagement.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String FirstName;
    private String LastName;
    private String email;
    private String phoneNumber;
    private String password;
    private String confirmPassword;
    private String gender;
    private String role;

}
