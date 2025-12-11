package com.bess.model;

import java.time.LocalDateTime;

public class SolarTelemetry {
    public String solarId;
    public double generation;
    public String status;
    public LocalDateTime timestamp;

    public SolarTelemetry(String solarId, double generation, String status, LocalDateTime timestamp) {
        this.solarId = solarId;
        this.generation = generation;
        this.status = status;
        this.timestamp = timestamp;
    }
}