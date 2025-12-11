package com.bess.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.CommandLineRunner;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class InitialTelemetryProducer implements CommandLineRunner {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public InitialTelemetryProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    }

    @Override
    public void run(String... args) {
        // Send initial telemetry only once for all batteries
        sendInitialTelemetry("BATT-000", 20.0);
        sendInitialTelemetry("BATT-001", 50.0);
        sendInitialTelemetry("BATT-002", 80.0);
    }

    private void sendInitialTelemetry(String batteryId, double initialSOC) {
        try {
            BatteryTelemetry telemetry = new BatteryTelemetry(
                batteryId, initialSOC, 90.0, 25.0, false, null, LocalDateTime.now()
            );
            
            String json = objectMapper.writeValueAsString(telemetry);
            kafkaTemplate.send("battery-telemetry", batteryId, json);
            
            System.out.println("Initial telemetry sent: " + batteryId + " SOC=" + initialSOC + "%");
        } catch (Exception e) {
            System.err.println("Error producing initial telemetry: " + e.getMessage());
        }
    }

    private static class BatteryTelemetry {
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
}