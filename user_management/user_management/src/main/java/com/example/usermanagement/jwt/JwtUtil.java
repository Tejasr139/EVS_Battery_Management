//package com.example.usermanagement.util;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.SecretKey;
//import java.util.Date;
//
//@Component
//public class JwtUtil {
//
//    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
//    private final long jwtExpiration = 86400000; // 24 hours
//
//    public String generateToken(String email) {
//        return Jwts.builder()
//                .subject(email)
//                .issuedAt(new Date())
//                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
//                .signWith(secretKey)
//                .compact();
//    }
//
//    public String extractEmail(String token) {
//        return extractClaims(token).getSubject();
//    }
//
//    public boolean isTokenValid(String token) {
//        try {
//            return !isTokenExpired(token);
//        } catch (Exception e) {
//            return false;
//        }
//    }
//
//    private Claims extractClaims(String token) {
//        return Jwts.parser()
//                .verifyWith(secretKey)
//                .build()
//                .parseSignedClaims(token)
//                .getPayload();
//    }
//
//    private boolean isTokenExpired(String token) {
//        return extractClaims(token).getExpiration().before(new Date());
//    }
//}