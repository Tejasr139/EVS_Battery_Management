package com.ev.batterymanagementsystem.service;

import com.ev.batterymanagementsystem.dto.LoginDto;
import com.ev.batterymanagementsystem.model.User;
import com.ev.batterymanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    private final String SECRET_KEY = "MySecretKey12345";
    
    private String encrypt(String plainText) {
        try {
            SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting password", e);
        }
    }
    
    private String decrypt(String encryptedText) {
        try {
            SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedText));
            return new String(decryptedBytes);
        } catch (Exception e) {
            return encryptedText;
        }
    }
    
    public User signup(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(encrypt(user.getPassword()));
        user.setConfirmPassword(encrypt(user.getConfirmPassword()));
        return userRepository.save(user);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll().stream()
            .map(user -> {
                if (user.getPassword() != null) {
                    user.setPassword(decrypt(user.getPassword()));
                }
                if (user.getConfirmPassword() != null) {
                    user.setConfirmPassword(decrypt(user.getConfirmPassword()));
                }
                return user;
            })
            .collect(Collectors.toList());
    }
    
    public User login(LoginDto loginDto) {
        return userRepository.findAll().stream()
            .filter(user -> user.getEmail().equals(loginDto.getEmail()))
            .filter(user -> decrypt(user.getPassword()).equals(loginDto.getPassword()))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }
    
    public List<String> getAllEmails() {
        return userRepository.findAll().stream()
            .map(User::getEmail)
            .collect(Collectors.toList());
    }
    
    public List<User> getUsersByNameContaining(String name) {
        return userRepository.findAll().stream()
            .filter(user -> user.getName().toLowerCase().contains(name.toLowerCase()))
            .map(user -> {
                user.setPassword(decrypt(user.getPassword()));
                user.setConfirmPassword(decrypt(user.getConfirmPassword()));
                return user;
            })
            .collect(Collectors.toList());
    }
    
    public long getUserCount() {
        return userRepository.findAll().stream().count();
    }
}