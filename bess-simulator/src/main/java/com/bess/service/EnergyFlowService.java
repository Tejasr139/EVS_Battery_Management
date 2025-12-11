package com.bess.service;

import org.springframework.stereotype.Service;

@Service
public class EnergyFlowService {
    
    public String performAction(String batteryId, int targetSoc, String action, int currentSoc) {
        if ("CHARGE".equals(action)) {
            if (currentSoc >= targetSoc) {
                return "Battery " + batteryId + " already at or above " + targetSoc + "% SoC";
            }
            return "Charging battery " + batteryId + " from " + currentSoc + "% to " + targetSoc + "%";
        }
        return "Action " + action + " not supported";
    }
}