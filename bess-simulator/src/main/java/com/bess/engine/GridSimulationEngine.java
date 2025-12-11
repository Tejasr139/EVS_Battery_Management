package com.bess.engine;

import com.bess.model.GridTelemetry;
import com.bess.service.TelemetryService;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Random;

public class GridSimulationEngine {
    private final TelemetryService telemetryService;

    public GridSimulationEngine(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    public void simulate() {
        final Random rand = new Random();
        final Calendar calendar = Calendar.getInstance();
        
        try {
            calendar.setTimeInMillis(System.currentTimeMillis());
            int hour = calendar.get(Calendar.HOUR_OF_DAY);
            
            double baseOutput;
            String period;
            
            if (hour >= 6 && hour < 12) {
                // Morning: 6AM-12PM - Medium output
                baseOutput = 800.0 + rand.nextDouble() * 200.0; // 800-1000kW
                period = "morning";
            } else if (hour >= 12 && hour < 18) {
                // Afternoon: 12PM-6PM - High output
                baseOutput = 1200.0 + rand.nextDouble() * 300.0; // 1200-1500kW
                period = "afternoon";
            } else if (hour >= 18 && hour < 22) {
                // Peak Evening: 6PM-10PM - Maximum output
                baseOutput = 1500.0 + rand.nextDouble() * 500.0; // 1500-2000kW
                period = "peak";
            } else {
                // Night/Early Morning: 10PM-6AM - Low output
                baseOutput = 400.0 + rand.nextDouble() * 200.0; // 400-600kW
                period = "night";
            }
            
            LocalDateTime currentTime = LocalDateTime.now();
            GridTelemetry telemetry = new GridTelemetry("GRID-001", baseOutput, currentTime);
            telemetryService.sendTelemetry("grid-telemetry", "GRID-001", telemetry);
            System.out.println("Published grid telemetry: GRID-001 Output=" + String.format("%.1fkW", baseOutput) + " Period=" + period);
        } catch (Exception e) {
            System.err.println("Error in grid simulation: " + e.getMessage());
        }
    }
}
