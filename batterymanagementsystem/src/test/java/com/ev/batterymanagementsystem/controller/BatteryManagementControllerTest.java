package com.ev.batterymanagementsystem.controller;

import com.ev.batterymanagementsystem.dto.TimeSeriesData;
import com.ev.batterymanagementsystem.model.BatteryTelemetry;
import com.ev.batterymanagementsystem.service.BatteryManagementService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BatteryManagementControllerTest {

    @Mock
    private BatteryManagementService service;

    @InjectMocks
    private BatteryManagementController controller;

    private BatteryTelemetry createTelemetry() {
        BatteryTelemetry telemetry = new BatteryTelemetry();
        telemetry.setBatteryId("BAT123");
        telemetry.setTimestamp(LocalDateTime.now());
        telemetry.setSoc(80.0);
        telemetry.setSoh(95.0);
        telemetry.setTemperature(30.0);
        telemetry.setCharging(false);
        return telemetry;
    }

    @Test
    void testGetAllBatteries() {
        when(service.getAllBatteries()).thenReturn(List.of(createTelemetry()));

        ResponseEntity<List<BatteryTelemetry>> response = controller.getAllBatteries();

        assertEquals(200, response.getStatusCode().value());
        assertEquals("BAT123", response.getBody().get(0).getBatteryId());
        assertEquals(80.0, response.getBody().get(0).getSoc());
    }

    @Test
    void testGetDistinctBatteries() {
        when(service.getDistinctBatteries()).thenReturn(List.of(createTelemetry()));

        ResponseEntity<List<BatteryTelemetry>> response = controller.getDistinctBatteries();

        assertEquals(200, response.getStatusCode().value());
        assertEquals("BAT123", response.getBody().get(0).getBatteryId());
    }

    @Test
    void testGetBatteryIds() {
        when(service.getUniqueBatteryIds()).thenReturn(Arrays.asList("BAT123", "BAT456"));

        ResponseEntity<List<String>> response = controller.getBatteryIds();

        assertEquals(200, response.getStatusCode().value());
        assertEquals("BAT123", response.getBody().get(0));
        assertEquals("BAT456", response.getBody().get(1));
    }

    @Test
    void testGetBatteryHistoryValid() {
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 2, 0, 0);
        when(service.getBatteryHistoryData("BAT123", start, end))
                .thenReturn(List.of(createTelemetry()));

        ResponseEntity<List<BatteryTelemetry>> response = controller.getBatteryHistory("BAT123", start, end);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("BAT123", response.getBody().get(0).getBatteryId());
    }

    @Test
    void testGetBatteryHistoryInvalid() {
        LocalDateTime start = LocalDateTime.of(2024, 1, 2, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 1, 0, 0);

        ResponseEntity<List<BatteryTelemetry>> response = controller.getBatteryHistory("BAT123", start, end);

        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void testGetBatteryTelemetry() {
        when(service.getBatteryTelemetryData("BAT123")).thenReturn(List.of(createTelemetry()));

        ResponseEntity<List<BatteryTelemetry>> response = controller.getBatteryTelemetry("BAT123");

        assertEquals(200, response.getStatusCode().value());
        assertEquals("BAT123", response.getBody().get(0).getBatteryId());
    }

    @Test
    void testGetBatteryMetrics() {
        LocalDateTime timestamp = LocalDateTime.now();
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 7, 23, 59);
        Map<String, List<TimeSeriesData>> metrics = new HashMap<>();
        metrics.put("soc", List.of(new TimeSeriesData(timestamp, 80.0)));
        metrics.put("soh", List.of(new TimeSeriesData(timestamp, 95.0)));
        metrics.put("temperature", List.of(new TimeSeriesData(timestamp, 30.0)));

        when(service.getMetricsData("BAT123", start, end)).thenReturn(metrics);

        Map<String, List<TimeSeriesData>> response = controller.getBatteryMetrics("BAT123", start, end);

        assertEquals(80.0, response.get("soc").get(0).getValue());
        assertEquals(30.0, response.get("temperature").get(0).getValue());
    }
}
