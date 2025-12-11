package com.bess.engine;

import com.bess.model.SolarTelemetry;
import com.bess.service.TelemetryService;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Random;

public class SolarSimulationEngine {
    private final TelemetryService telemetryService;

    public SolarSimulationEngine(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    public void simulate(String solarId) {
        final Random rand = new Random();
        final Calendar calendar = Calendar.getInstance();
        
        try {
            calendar.setTimeInMillis(System.currentTimeMillis());
            int hour = calendar.get(Calendar.HOUR_OF_DAY);
            double generation = 0.0;
            
            if (hour >= 6 && hour < 9) {
                // Morning ramp-up
                generation = 400.0 + rand.nextDouble() * 200.0; // 400–600 W
            } else if (hour >= 9 && hour < 12) {
                // Mid-morning
                generation = 600.0 + rand.nextDouble() * 200.0; // 600–800 W
            } else if (hour >= 12 && hour < 15) {
                // Peak noon
                generation = 800.0 + rand.nextDouble() * 200.0; // 800–1000 W
            } else if (hour >= 15 && hour < 18) {
                // Afternoon decline
                generation = 500.0 + rand.nextDouble() * 200.0; // 500–700 W
            } else {
                generation = 0.0; // Night time
            }

            LocalDateTime currentTime = LocalDateTime.now();
            SolarTelemetry telemetry = new SolarTelemetry(solarId, generation, 
                hour >= 6 && hour <= 18 ? "active" : "inactive", currentTime);
            telemetryService.sendTelemetry("solar-telemetry", solarId, telemetry);
            System.out.println("Published solar telemetry: " + solarId + " Generation=" + String.format("%.1fkW", generation));
        } catch (Exception e) {
            System.err.println("Error in solar simulation " + solarId + ": " + e.getMessage());
        }
    }
}
