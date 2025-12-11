package com.ev.batterymanagementsystem.repository;

import com.ev.batterymanagementsystem.model.BatteryTelemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BatteryTelemetryRepository extends JpaRepository<BatteryTelemetry, Long> {
    
    @Query("SELECT b FROM BatteryTelemetry b WHERE b.timestamp = (SELECT MAX(b2.timestamp) FROM BatteryTelemetry b2 WHERE b2.batteryId = b.batteryId)")
    List<BatteryTelemetry> findLatestTelemetryForEachBattery();
    
    @Query("SELECT DISTINCT b.batteryId FROM BatteryTelemetry b")
    List<String> findDistinctBatteryIds();
    
    List<BatteryTelemetry> findByBatteryIdAndTimestampBetween(String batteryId, LocalDateTime startTime, LocalDateTime endTime);
    
    BatteryTelemetry findTopByBatteryIdOrderByTimestampDesc(String batteryId);
    
    List<BatteryTelemetry> findByBatteryIdOrderByTimestampAsc(String batteryId);
    
    @Query("SELECT b.timestamp, b.soc, b.soh, b.temperature FROM BatteryTelemetry b WHERE b.batteryId = ?1 ORDER BY b.timestamp ASC")
    List<Object[]> findMetricsDataByBatteryId(String batteryId);
    
    @Query("SELECT b.timestamp, b.soc, b.soh, b.temperature FROM BatteryTelemetry b WHERE b.batteryId = ?1 AND b.timestamp BETWEEN ?2 AND ?3 ORDER BY b.timestamp ASC")
    List<Object[]> findMetricsDataByBatteryIdAndTimeRange(String batteryId, LocalDateTime startTime, LocalDateTime endTime);
    
   
}
