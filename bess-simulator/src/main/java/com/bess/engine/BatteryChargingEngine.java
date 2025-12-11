package com.bess.engine;

import com.bess.model.BatteryTelemetry;
import com.bess.service.TelemetryService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class BatteryChargingEngine {
    private final TelemetryService telemetryService;
    private final Map<String, BatteryState> batteryStates = new ConcurrentHashMap<>();
    private final Map<String, ScheduledFuture<?>> chargingTasks = new ConcurrentHashMap<>();
    private final Map<String, String> currentAction = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(5);

    public BatteryChargingEngine(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    public void chargeToTarget(String batteryId, int targetSoc, String source) {
        System.out.println("CHARGE command received for " + batteryId + " to " + targetSoc + "%");
        stopCurrentCharging(batteryId);
        
        BatteryState state = getBatteryState(batteryId);
        
        if (state.soc >= targetSoc) {
            System.out.println(batteryId + " already at " + targetSoc + "%");
            return;
        }
        
        System.out.println("Started Charging " + batteryId + " from " + state.soc + "% to " + targetSoc + "%");
        
        ScheduledFuture<?> task = scheduler.scheduleAtFixedRate(() -> {
            if (state.soc < targetSoc) {
                double oldSoc = state.soc;
                state.soc = Math.min(targetSoc, state.soc + 5.0);
                state.soh = Math.min(100.0, state.soh + 1.0);
                state.temp = Math.min(50.0, state.temp + 2.0);
                
                System.out.println(batteryId + " charging: " + oldSoc + "% -> " + state.soc + "%");
                
                LocalDateTime currentTime = LocalDateTime.now();
                BatteryTelemetry telemetry = new BatteryTelemetry(
                        batteryId, state.soc, state.soh, state.temp, true, source, currentTime);
                
                telemetryService.sendTelemetry("battery-telemetry", batteryId, telemetry);
                System.out.println("Produced telemetry: " + batteryId + " SOC=" + state.soc + "% Charging=true");
                
                if (state.soc >= targetSoc) {
                    System.out.println(batteryId + " reached " + targetSoc + "%");
                    stopCurrentCharging(batteryId);
                }
            }
        }, 0, 2, TimeUnit.SECONDS);
        
        chargingTasks.put(batteryId, task);
    }
    
    public void dischargeToTarget(String batteryId, int targetSoc, String source) {
        String action = "DISCHARGE-" + targetSoc;
        if (action.equals(currentAction.get(batteryId))) {
            System.out.println("Ignoring duplicate command: " + action);
            return;
        }
        
        System.out.println("DISCHARGE command received for " + batteryId + " to " + targetSoc + "%");
        stopCurrentCharging(batteryId);
        currentAction.put(batteryId, action);
        
        BatteryState state = getBatteryState(batteryId);
        
        if (state.soc <= targetSoc) {
            System.out.println(batteryId + " already at " + targetSoc + "%");
            currentAction.remove(batteryId);
            return;
        }
        
        System.out.println("Started Discharging " + batteryId + " from " + state.soc + "% to " + targetSoc + "%");
        
        ScheduledFuture<?> task = scheduler.scheduleAtFixedRate(() -> {
            if (state.soc > targetSoc && action.equals(currentAction.get(batteryId))) {
                double oldSoc = state.soc;
                state.soc = Math.max(targetSoc, state.soc - 5.0);
                state.soh = Math.max(70.0, state.soh - 0.5);
                state.temp = Math.max(25.0, state.temp - 1.5);
                
                System.out.println(batteryId + " discharging: " + oldSoc + "% -> " + state.soc + "%");
                
                LocalDateTime currentTime = LocalDateTime.now();
                BatteryTelemetry telemetry = new BatteryTelemetry(
                        batteryId, state.soc, state.soh, state.temp, false, source, currentTime);
                
                telemetryService.sendTelemetry("battery-telemetry", batteryId, telemetry);
                System.out.println("Produced telemetry: " + batteryId + " SOC=" + state.soc + "% Charging=false");
                
                if (state.soc <= targetSoc) {
                    System.out.println(batteryId + " reached " + targetSoc + "%");
                    stopCurrentCharging(batteryId);
                }
            }
        }, 0, 2, TimeUnit.SECONDS);
        
        chargingTasks.put(batteryId, task);
    }
    
    private void stopCurrentCharging(String batteryId) {
        ScheduledFuture<?> existingTask = chargingTasks.get(batteryId);
        if (existingTask != null && !existingTask.isDone()) {
            existingTask.cancel(false);
            chargingTasks.remove(batteryId);
        }
        currentAction.remove(batteryId);
    }
    
    private BatteryState getBatteryState(String batteryId) {
        return batteryStates.computeIfAbsent(batteryId, k -> {
            switch (batteryId) {
                case "BATT-000": return new BatteryState(20.0, 90.0, 25.0);
                case "BATT-001": return new BatteryState(50.0, 90.0, 25.0);
                case "BATT-002": return new BatteryState(80.0, 90.0, 25.0);
                default: return new BatteryState(50.0, 90.0, 25.0);
            }
        });
    }



    private static class BatteryState {
        double soc;
        double soh;
        double temp;

        BatteryState(double soc, double soh, double temp) {
            this.soc = soc;
            this.soh = soh;
            this.temp = temp;
        }
    }
}