package com.ev.batterymanagementsystem.controller;

import com.ev.batterymanagementsystem.dto.TimeSeriesData;
import com.ev.batterymanagementsystem.model.BatteryTelemetry;
import com.ev.batterymanagementsystem.service.BatteryManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/battery")
public class BatteryManagementController {

    @Autowired
    private BatteryManagementService service;
    

/**
     * Retrieves all battery telemetry records from the database.
     * @return ResponseEntity containing list of all battery telemetry data
     */
    @GetMapping("/all")
    public ResponseEntity<List<BatteryTelemetry>> getAllBatteries() {
        List<BatteryTelemetry> data = service.getAllBatteries();
        return ResponseEntity.ok(data);
    }

    /**
     * Retrieves the latest telemetry record for each unique battery.
     * @return ResponseEntity containing list of latest telemetry for each battery
     */
    @GetMapping("/distinct")
    public ResponseEntity<List<BatteryTelemetry>> getDistinctBatteries() {
        List<BatteryTelemetry> data = service.getDistinctBatteries();
        return ResponseEntity.ok(data);
    }

    /**
     * Retrieves all unique battery IDs.
     * @return ResponseEntity containing list of unique battery IDs
     */
    @GetMapping("/ids")
    public ResponseEntity<List<String>> getBatteryIds() {
        List<String> ids = service.getUniqueBatteryIds();
        return ResponseEntity.ok(ids);
    }

    /**
     * Retrieves battery telemetry history for a specific battery within a time range.
     * @param batteryId the ID of the battery
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return ResponseEntity containing list of telemetry data or bad request if time range is invalid
     */
    @GetMapping("/{batteryId}/history")
    public ResponseEntity<List<BatteryTelemetry>> getBatteryHistory(
            @PathVariable String batteryId,
            @RequestParam LocalDateTime startTime,
            @RequestParam LocalDateTime endTime) {

        if (startTime.isAfter(endTime) || startTime.isEqual(endTime)) {
            return ResponseEntity.badRequest().body(Collections.<BatteryTelemetry>emptyList());
        }

        List<BatteryTelemetry> data = service.getBatteryHistoryData(batteryId, startTime, endTime);
        return ResponseEntity.ok(data);
    }

    /**
     * Retrieves all telemetry data for a specific battery ordered by timestamp.
     * @param batteryId the ID of the battery
     * @return ResponseEntity containing list of telemetry data
     */
    @GetMapping("/{batteryId}/telemetry")
    public ResponseEntity<List<BatteryTelemetry>> getBatteryTelemetry(@PathVariable String batteryId) {
        List<BatteryTelemetry> data = service.getBatteryTelemetryData(batteryId);
        return ResponseEntity.ok(data);
    }
    /**
     * Retrieves time series metrics (SOC, SOH, temperature) for a specific battery within a time range.
     * @param batteryId the ID of the battery
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return Map containing time series data for each metric
     */
    @GetMapping("/{batteryId}/metrics")
    public Map<String, List<TimeSeriesData>> getBatteryMetrics(
            @PathVariable String batteryId,
            @RequestParam LocalDateTime startTime,
            @RequestParam LocalDateTime endTime) {
        return service.getMetricsData(batteryId, startTime, endTime);
    }
    
    @GetMapping("/high-soc")
    public ResponseEntity<Map<String, Double>> getBatteriesWithHighSOC() {
        Map<String, Double> batterySOCs = service.getBatterySOCLevels();
        return ResponseEntity.ok(batterySOCs);
    }
    
    @GetMapping("/low-soh")
    public ResponseEntity<List<BatteryTelemetry>> getBatteriesWithLowSOH(@RequestParam double threshold) {
        List<BatteryTelemetry> batteries = service.getBatteriesWithLowSOH(threshold);
        return ResponseEntity.ok(batteries);
    }
    
    @GetMapping("/average-temperature")
    public ResponseEntity<Double> getAverageTemperature() {
        double avgTemp = service.getAverageTemperature();
        return ResponseEntity.ok(avgTemp);
    }
    
    @GetMapping("/count-by-soc")
    public ResponseEntity<Long> getBatteryCountBySOCRange(
            @RequestParam double minSOC, 
            @RequestParam double maxSOC) {
        long count = service.getBatteryCountBySOCRange(minSOC, maxSOC);
        return ResponseEntity.ok(count);
    }
}
