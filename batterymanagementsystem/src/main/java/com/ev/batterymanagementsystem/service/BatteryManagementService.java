package com.ev.batterymanagementsystem.service;


import com.ev.batterymanagementsystem.dto.TimeSeriesData;
import com.ev.batterymanagementsystem.model.BatteryTelemetry;
import com.ev.batterymanagementsystem.repository.BatteryTelemetryRepository;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.LocalDateTime;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;


@Service
public class BatteryManagementService {
    
    @Autowired
    private BatteryTelemetryRepository repository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    /**
     * Kafka listener that consumes battery telemetry messages and saves them to the database.
     * @param message JSON string containing battery telemetry data
     */
    @KafkaListener(topics = "${spring.kafka.topic.name}",groupId="${spring.kafka.consumer.group-id}")
    public void consumeBatteryTelemetry(String message) {
        try {
            if (objectMapper == null) {
                System.err.println("ObjectMapper is null - dependency injection failed");
                return;
            }
            BatteryTelemetry telemetry = objectMapper.readValue(message, BatteryTelemetry.class);
            repository.save(telemetry);
        } catch (Exception e) {
            System.err.println("Error processing telemetry: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Retrieves all battery telemetry records from the database.
     * @return List of all battery telemetry data
     */
    public List<BatteryTelemetry> getAllBatteries() {
        return repository.findAll();
    }
    
    /**
     * Retrieves the latest telemetry record for each unique battery.
     * @return List of latest telemetry for each battery
     */
    public List<BatteryTelemetry> getDistinctBatteries() {
        return repository.findLatestTelemetryForEachBattery();
    }
    
    /**
     * Retrieves all unique battery IDs.
     * @return List of unique battery IDs
     */
    public List<String> getUniqueBatteryIds() {
        return repository.findDistinctBatteryIds();
    }
    
    /**
     * Retrieves battery telemetry history for a specific battery within a time range.
     * @param batteryId the ID of the battery
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return List of telemetry data within the specified time range
     */
    public List<BatteryTelemetry> getBatteryHistoryData(String batteryId, LocalDateTime startTime, LocalDateTime endTime) {
        return repository.findByBatteryIdAndTimestampBetween(batteryId, startTime, endTime);
    }
    
   
    
    /**
     * Retrieves all telemetry data for a specific battery ordered by timestamp.
     * @param batteryId the ID of the battery
     * @return List of telemetry data ordered by timestamp
     */
    public List<BatteryTelemetry> getBatteryTelemetryData(String batteryId) {
        return repository.findByBatteryIdOrderByTimestampAsc(batteryId);
    }
    
    /**
     * Retrieves time series metrics (SOC, SOH, temperature) for a specific battery within a time range.
     * @param batteryId the ID of the battery
     * @param startTime the start time of the range
     * @param endTime the end time of the range
     * @return Map containing time series data for each metric (soc, soh, temperature)
     */
    public Map<String, List<TimeSeriesData>> getMetricsData(String batteryId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Object[]> results = repository.findMetricsDataByBatteryIdAndTimeRange(batteryId, startTime, endTime);
        System.out.println("Query returned " + results.size() + " rows for batteryId: " + batteryId);
        
        List<TimeSeriesData> socData = results.stream()
            .map(row -> new TimeSeriesData((LocalDateTime) row[0], ((Number) row[1]).doubleValue()))
            .collect(Collectors.toList());
            
        List<TimeSeriesData> sohData = results.stream()
            .map(row -> new TimeSeriesData((LocalDateTime) row[0], ((Number) row[2]).doubleValue()))
            .collect(Collectors.toList());
            
        List<TimeSeriesData> temperatureData = results.stream()
            .map(row -> new TimeSeriesData((LocalDateTime) row[0], ((Number) row[3]).doubleValue()))
            .collect(Collectors.toList());
        
        Map<String, List<TimeSeriesData>> metricsMap = new HashMap<>();
        metricsMap.put("soc", socData);
        metricsMap.put("soh", sohData);
        metricsMap.put("temperature", temperatureData);
        
        return metricsMap;
    }
    
    public List<String> getBatteryIdsWithHighSOC(double threshold) {
        return repository.findAll().stream()
            .filter(battery -> battery.getSoc() > threshold)
            .map(BatteryTelemetry::getBatteryId)
            .distinct()
            .collect(Collectors.toList());
    }
    
    public Map<String, Double> getBatterySOCLevels() {
        return repository.findLatestTelemetryForEachBattery().stream()
            .collect(Collectors.toMap(
                BatteryTelemetry::getBatteryId,
                BatteryTelemetry::getSoc
            ));
    }
    
    public List<BatteryTelemetry> getBatteriesWithLowSOH(double threshold) {
        return repository.findAll().stream()
            .filter(battery -> battery.getSoh() < threshold)
            .collect(Collectors.toList());
    }
    
    public double getAverageTemperature() {
        return repository.findAll().stream()
            .mapToDouble(BatteryTelemetry::getTemperature)
            .average()
            .orElse(0.0);
    }
    
    public long getBatteryCountBySOCRange(double minSOC, double maxSOC) {
        return repository.findAll().stream()
            .filter(battery -> battery.getSoc() >= minSOC && battery.getSoc() <= maxSOC)
            .count();
    }
   
}
