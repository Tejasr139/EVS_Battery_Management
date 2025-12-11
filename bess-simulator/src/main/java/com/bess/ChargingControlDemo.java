package com.bess;

import com.bess.manager.ChargingSimulationManager;

public class ChargingControlDemo {
    public static void main(String[] args) {
        String kafkaBootstrapServers = "localhost:9092";
        ChargingSimulationManager manager = new ChargingSimulationManager(kafkaBootstrapServers);
        
        System.out.println("Starting BESS charging simulation...");
        manager.startSimulation(3);
        
        Runtime.getRuntime().addShutdownHook(new Thread(manager::shutdown));
        
        System.out.println("First time: Sending initial battery, solar, and grid data");
        System.out.println("Listening for charging commands on 'battery-command' topic");
        System.out.println("Send messages like: {\"batteryId\": \"BATT-001\", \"charge\": true, \"source\": \"grid\"}");
        System.out.println("Or for discharge: {\"batteryId\": \"BATT-001\", \"charge\": false, \"source\": \"load\"}");
        
        try {
            Thread.currentThread().join();
        } catch (InterruptedException e) {
            manager.shutdown();
        }
    }
}