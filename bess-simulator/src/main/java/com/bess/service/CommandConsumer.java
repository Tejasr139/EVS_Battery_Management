package com.bess.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Service
public class CommandConsumer {
    private final Map<String, BatteryState> batteryStates = new ConcurrentHashMap<>();
    private final Map<String, ScheduledFuture<?>> chargingTasks = new ConcurrentHashMap<>();
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(3);
    
    public CommandConsumer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
        
        // Initialize battery states
        batteryStates.put("BATT-000", new BatteryState(20.0, 90.0, 25.0));
        batteryStates.put("BATT-001", new BatteryState(50.0, 90.0, 25.0));
        batteryStates.put("BATT-002", new BatteryState(80.0, 90.0, 25.0));
    }

    @KafkaListener(topics = "battery-command-efs", groupId = "bess-command-group")
    public void consumeCommand(String message) {
        try {
            System.out.println("Received message: " + message);
            
            // Parse command: "BATT-001-CHARGE-80"
            String[] parts = message.split("-");
            if (parts.length >= 4) {
                String batteryId = parts[0] + "-" + parts[1];
                String action = parts[2];
                int targetSOC = Integer.parseInt(parts[3]);
                
                BatteryState state = batteryStates.get(batteryId);
                if (state != null) {
                    // Cancel any existing charging task
                    ScheduledFuture<?> existingTask = chargingTasks.get(batteryId);
                    if (existingTask != null) {
                        existingTask.cancel(false);
                    }
                    
                    if ("CHARGE".equals(action)) {
                        System.out.println("Started Charging " + batteryId + " upto " + targetSOC + "%");
                        startGradualCharging(batteryId, targetSOC);
                        
                    } else if ("DISCHARGE".equals(action)) {
                        System.out.println("Started Discharging " + batteryId + " upto " + targetSOC + "%");
                        startGradualDischarging(batteryId, targetSOC);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error processing command: " + e.getMessage());
        }
    }
    
    private void startGradualCharging(String batteryId, int targetSOC) {
        ScheduledFuture<?> task = scheduler.scheduleAtFixedRate(() -> {
            BatteryState state = batteryStates.get(batteryId);
            if (state != null && state.soc < targetSOC) {
                double currentSOC = state.soc;
                state.soc = Math.min(targetSOC, currentSOC + 5.0); // Increase by 5%
                state.charging = true;
                
                System.out.println(batteryId + " charging: " + currentSOC + "% -> " + state.soc + "%");
                produceTelemetry(batteryId, state);
                
                if (state.soc >= targetSOC) {
                    System.out.println(batteryId + " reached " + targetSOC + "%");
                    state.charging = false;
                    chargingTasks.remove(batteryId);
                }
            }
        }, 0, 2, TimeUnit.MINUTES);
        
        chargingTasks.put(batteryId, task);
    }
    
    private void startGradualDischarging(String batteryId, int targetSOC) {
        ScheduledFuture<?> task = scheduler.scheduleAtFixedRate(() -> {
            BatteryState state = batteryStates.get(batteryId);
            if (state != null && state.soc > targetSOC) {
                double currentSOC = state.soc;
                state.soc = Math.max(targetSOC, currentSOC - 5.0); // Decrease by 5%
                state.charging = false;
                
                System.out.println(batteryId + " discharging: " + currentSOC + "% -> " + state.soc + "%");
                produceTelemetry(batteryId, state);
                
                if (state.soc <= targetSOC) {
                    System.out.println(batteryId + " reached " + targetSOC + "%");
                    chargingTasks.remove(batteryId);
                }
            }
        }, 0, 2, TimeUnit.MINUTES);
        
        chargingTasks.put(batteryId, task);
    }
    
    private void produceTelemetry(String batteryId, BatteryState state) {
        try {
            BatteryTelemetry telemetry = new BatteryTelemetry(
                batteryId, state.soc, state.soh, state.temperature, 
                state.charging, "grid", LocalDateTime.now()
            );
            
            String json = objectMapper.writeValueAsString(telemetry);
            kafkaTemplate.send("battery-telemetry", batteryId, json);
            
            System.out.println("Produced telemetry: " + batteryId + " SOC=" + state.soc + "% Charging=" + state.charging);
        } catch (Exception e) {
            System.err.println("Error producing telemetry: " + e.getMessage());
        }
    }
    
    private static class BatteryState {
        double soc;
        double soh;
        double temperature;
        boolean charging;
        
        BatteryState(double soc, double soh, double temperature) {
            this.soc = soc;
            this.soh = soh;
            this.temperature = temperature;
            this.charging = false;
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