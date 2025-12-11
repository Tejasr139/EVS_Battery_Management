package com.ev.batterymanagementsystem.service;


import com.ev.batterymanagementsystem.dto.TimeSeriesData;
import com.ev.batterymanagementsystem.model.BatteryTelemetry;
import com.ev.batterymanagementsystem.repository.BatteryTelemetryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BatteryManagementServiceTest {

    @Mock
    private BatteryTelemetryRepository repository;

    @InjectMocks
    private BatteryManagementService service;

    private BatteryTelemetry telemetry;

    @BeforeEach
    void setUp() {
        telemetry = new BatteryTelemetry();
        telemetry.setBatteryId("BAT123");
        telemetry.setTimestamp(LocalDateTime.now());
        telemetry.setSoc(80.0);
        telemetry.setSoh(95.0);
        telemetry.setTemperature(30.0);
        telemetry.setCharging(false);
    }
    @Test
    void testConsumeBatteryTelemetry() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        String jsonMessage = mapper.writeValueAsString(telemetry);
        service.consumeBatteryTelemetry(jsonMessage);
        verify(repository, times(1)).save(any(BatteryTelemetry.class));
    }

    @Test
    void testGetAllBatteries() {
        when(repository.findAll()).thenReturn(Collections.singletonList(telemetry));

        List<BatteryTelemetry> result = service.getAllBatteries();

        assertEquals(1, result.size());
        assertEquals("BAT123", result.get(0).getBatteryId());
    }

    @Test
    void testGetDistinctBatteries() {
        when(repository.findLatestTelemetryForEachBattery()).thenReturn(Collections.singletonList(telemetry));

        List<BatteryTelemetry> result = service.getDistinctBatteries();

        assertEquals(1, result.size());
        verify(repository, times(1)).findLatestTelemetryForEachBattery();
    }

    @Test
    void testGetUniqueBatteryIds() {
        when(repository.findDistinctBatteryIds()).thenReturn(Arrays.asList("BAT123", "BAT456"));

        List<String> ids = service.getUniqueBatteryIds();

        assertEquals(2, ids.size());
        assertTrue(ids.contains("BAT123"));
    }

    @Test
    void testGetBatteryHistoryData() {
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 2, 0, 0);
        when(repository.findByBatteryIdAndTimestampBetween("BAT123", start, end))
                .thenReturn(Collections.singletonList(telemetry));

        List<BatteryTelemetry> result = service.getBatteryHistoryData("BAT123", start, end);

        assertEquals(1, result.size());
        verify(repository).findByBatteryIdAndTimestampBetween("BAT123", start, end);
    }

    @Test
    void testGetBatteryTelemetryData() {
        when(repository.findByBatteryIdOrderByTimestampAsc("BAT123"))
                .thenReturn(Collections.singletonList(telemetry));

        List<BatteryTelemetry> result = service.getBatteryTelemetryData("BAT123");

        assertEquals(1, result.size());
        verify(repository).findByBatteryIdOrderByTimestampAsc("BAT123");
    }

    @Test
    void testGetMetricsData() {
        LocalDateTime start = LocalDateTime.of(2024, 1, 1, 0, 0);
        LocalDateTime end = LocalDateTime.of(2024, 1, 7, 23, 59);
        List<Object[]> mockResults = new ArrayList<>();
        mockResults.add(new Object[]{LocalDateTime.now(), 80.0, 95.0, 30.0});

        when(repository.findMetricsDataByBatteryIdAndTimeRange("BAT123", start, end)).thenReturn(mockResults);

        Map<String, List<TimeSeriesData>> metrics = service.getMetricsData("BAT123", start, end);

        assertEquals(3, metrics.size());
        assertTrue(metrics.containsKey("soc"));
        assertEquals(80.0, metrics.get("soc").get(0).getValue());
    }
}
