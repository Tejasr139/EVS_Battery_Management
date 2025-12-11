package com.example.usermanagement.util;

import org.springframework.stereotype.Component;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class SimpleJwtUtil {

    private final String secret = "mySecretKey123456789";
    private final long expiration = 86400000; // 24 hours

    public String generateToken(String email) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("exp", System.currentTimeMillis() + expiration);
        
        String payloadJson = mapToJson(payload);
        return Base64.getEncoder().encodeToString(payloadJson.getBytes());
    }

    public String extractEmail(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            return extractFromJson(decoded, "email");
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isTokenValid(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            long exp = Long.parseLong(extractFromJson(decoded, "exp"));
            return System.currentTimeMillis() < exp;
        } catch (Exception e) {
            return false;
        }
    }

    private String mapToJson(Map<String, Object> map) {
        StringBuilder json = new StringBuilder("{");
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            json.append("\"").append(entry.getKey()).append("\":\"")
                .append(entry.getValue()).append("\",");
        }
        if (json.length() > 1) json.setLength(json.length() - 1);
        json.append("}");
        return json.toString();
    }

    private String extractFromJson(String json, String key) {
        String searchKey = "\"" + key + "\":\"";
        int start = json.indexOf(searchKey) + searchKey.length();
        int end = json.indexOf("\"", start);
        return json.substring(start, end);
    }
}