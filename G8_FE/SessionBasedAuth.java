package com.example.usermanagement.util;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class SessionBasedAuth {

    private final Map<String, String> sessions = new HashMap<>();
    private final Map<String, Long> sessionExpiry = new HashMap<>();
    private final long sessionTimeout = 86400000; // 24 hours

    public String createSession(String email) {
        String sessionId = UUID.randomUUID().toString();
        sessions.put(sessionId, email);
        sessionExpiry.put(sessionId, System.currentTimeMillis() + sessionTimeout);
        return sessionId;
    }

    public String getEmailFromSession(String sessionId) {
        if (isSessionValid(sessionId)) {
            return sessions.get(sessionId);
        }
        return null;
    }

    public boolean isSessionValid(String sessionId) {
        if (!sessions.containsKey(sessionId)) {
            return false;
        }
        
        Long expiry = sessionExpiry.get(sessionId);
        if (expiry == null || System.currentTimeMillis() > expiry) {
            sessions.remove(sessionId);
            sessionExpiry.remove(sessionId);
            return false;
        }
        
        return true;
    }

    public void invalidateSession(String sessionId) {
        sessions.remove(sessionId);
        sessionExpiry.remove(sessionId);
    }
}