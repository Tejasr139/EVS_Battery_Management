package com.bess.model;
import java.time.LocalDateTime;


public class BatteryTelemetry {
    public String batteryId;
    public double soc;
    public double soh;
    public double temperature;
    public boolean charging;
    public String source;
    public LocalDateTime timestamp;

    public BatteryTelemetry(String batteryId, double soc, double soh, double temperature, 
                           boolean charging, String source, LocalDateTime timestamp) {
        this.batteryId = batteryId;
        this.soc = soc;
        this.soh = soh;
        this.temperature = temperature;
        this.charging = charging;
        this.source = source;
        this.timestamp = timestamp;
    }
}