package com.bess.engine;
import com.bess.model.BatteryTelemetry;
import com.bess.service.TelemetryService;
import java.time.LocalDateTime;
import java.util.Random;

public class BatterySimulationEngine {
    private final TelemetryService telemetryService;

    public BatterySimulationEngine(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    public void simulate(String batteryId) {
        final Random rand = new Random();
        double soc ;
        switch (batteryId) {
            case "BATT-000":
                soc = 20.0;
                break;
            case "BATT-001":
                soc = 50.0;
                break;
            case "BATT-002":
                soc = 80.0;
                break;
            default:
                soc = 50.0 + rand.nextDouble() * 5.0;
        }
        double soh = 90.0 + rand.nextDouble() * 5.0;
        double temp = 25.0 + rand.nextDouble() * 5.0;
        
        try {
            LocalDateTime currentTime = LocalDateTime.now();
            BatteryTelemetry telemetry = new BatteryTelemetry(batteryId, soc, soh, temp, false, null, currentTime);
            telemetryService.sendTelemetry("battery-telemetry", batteryId, telemetry);
            System.out.println("Published battery telemetry: " + batteryId + " Charging=false Source=null SoC=" + String.format("%.1f%%", soc));
        } catch (Exception e) {
            System.err.println("Error in battery simulation " + batteryId + ": " + e.getMessage());
        }
    }
}