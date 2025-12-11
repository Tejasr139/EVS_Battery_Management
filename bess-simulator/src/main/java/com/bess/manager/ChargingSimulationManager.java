package com.bess.manager;

import com.bess.config.KafkaConfig;
import com.bess.engine.BatteryChargingEngine;
// import com.bess.engine.BatterySimulationEngine; // Not used
// import com.bess.engine.GridSimulationEngine; // Not used
// import com.bess.engine.SolarSimulationEngine; // Not used
import com.bess.service.ChargingControlConsumer;
import com.bess.service.TelemetryService;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
// import java.util.concurrent.ScheduledExecutorService; // Not used
// import java.util.concurrent.TimeUnit; // Not used

public class ChargingSimulationManager {
    private final KafkaProducer<String, String> producer;
    private final KafkaConsumer<String, String> consumer;
    private final TelemetryService telemetryService;
    private final ExecutorService executor;
    // private final ScheduledExecutorService scheduler; // Not used
    private final BatteryChargingEngine chargingEngine;
    private final ChargingControlConsumer chargingConsumer;
    // private final SolarSimulationEngine solarEngine; // Not used
    // private final GridSimulationEngine gridEngine; // Not used

    public ChargingSimulationManager(String kafkaBootstrapServers) {
        this.producer = KafkaConfig.createProducer(kafkaBootstrapServers);
        this.consumer = KafkaConfig.createConsumer(kafkaBootstrapServers, "bess-simulator-group");
        this.telemetryService = new TelemetryService(producer);
        this.executor = Executors.newFixedThreadPool(5);
        // this.scheduler = Executors.newScheduledThreadPool(2); // Not used
        this.chargingEngine = new BatteryChargingEngine(telemetryService);
        this.chargingConsumer = new ChargingControlConsumer(consumer, this::handleChargingCommand);
        // this.solarEngine = new SolarSimulationEngine(telemetryService); // Not used
        // this.gridEngine = new GridSimulationEngine(telemetryService); // Not used
    }

    public void startSimulation(int numBatteries) {
        System.out.println("Starting charging control consumer...");
        executor.submit(() -> chargingConsumer.startListening("efs-command"));
    }

    // Not used - commented out
    /*
    private void sendInitialData(int numBatteries) {
        System.out.println("Sending initial data for first time...");
        executor.submit(() -> solarEngine.simulate("SOLAR-000"));
        executor.submit(() -> gridEngine.simulate());
    }

    private void startContinuousDataPublishing() {
        System.out.println("Starting continuous solar and grid data publishing every 5 minutes...");
        
        scheduler.scheduleAtFixedRate(() -> {
            executor.submit(() -> solarEngine.simulate("SOLAR-000"));
        }, 5, 5, TimeUnit.MINUTES);
        
        scheduler.scheduleAtFixedRate(() -> {
            executor.submit(() -> gridEngine.simulate());
        }, 5, 5, TimeUnit.MINUTES);
    }
    */

    private void handleChargingCommand(String command) {
        System.out.println("Processing command: " + command);
        
        String[] parts = command.split("-");
        if (parts.length >= 3) {
            String batteryId = parts[0];
            String action = parts[1];
            int targetSoc = Integer.parseInt(parts[2]);
            
            System.out.println("Parsed - Battery: " + batteryId + ", Action: " + action + ", Target: " + targetSoc);
            
            if ("CHARGE".equals(action)) {
                chargingEngine.chargeToTarget(batteryId, targetSoc, "grid");
            } else if ("DISCHARGE".equals(action)) {
                chargingEngine.dischargeToTarget(batteryId, targetSoc, "load");
            }
        } else {
            System.out.println("Invalid command format: " + command);
        }
    }

    public void shutdown() {
        chargingConsumer.stop();
        // scheduler.shutdownNow(); // Not used
        executor.shutdownNow();
        producer.close();
    }
}
