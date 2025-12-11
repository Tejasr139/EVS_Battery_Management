package com.ev.batterymanagementsystem.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "battery_telemetry")
public class BatteryTelemetry {
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    
	    @Column(name = "battery_id")
	    private String batteryId;
	    private String source;
	    
	  private double soc;
	   private double soh;
	    private double temperature;

		@JsonFormat(pattern = "MM/dd/yyyy HH:mm")
	    private LocalDateTime timestamp;
	    
	    
	    @JsonProperty("charging")
	    public boolean isCharging;
	    
	    
		public String getBatteryId() {
			return batteryId;
		}
		public void setBatteryId(String batteryId) {
			this.batteryId = batteryId;
		}
		public double getSoc() {
			return soc;
		}
		public void setSoc(double soc) {
			this.soc = soc;
		}
		public double getSoh() {
			return soh;
		}
		public void setSoh(double soh) {
			this.soh = soh;
		}
		public double getTemperature() {
			return temperature;
		}
		public void setTemperature(double temperature) {
			this.temperature = temperature;
		}
		public LocalDateTime getTimestamp() {
			return timestamp;
		}
		public void setTimestamp(LocalDateTime timestamp) {
			this.timestamp = timestamp;
		}
		public boolean isCharging() {
			return isCharging;
		}
		public void setCharging(boolean charging) {
			this.isCharging = charging;
		}
		public BatteryTelemetry(String batteryId, double soc, double soh, double temperature, LocalDateTime timestamp, boolean isCharging) {
			super();
			this.batteryId = batteryId;
			this.soc = soc;
			this.soh = soh;
			this.temperature = temperature;
			this.timestamp = timestamp;
			this.isCharging = isCharging;
		}
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public BatteryTelemetry() {
			super();
		}
		@Override
		public String toString() {
			return "BatteryTelemetry [batteryId=" + batteryId + ", soc=" + soc + ", soh=" + soh + ", temperature="
					+ temperature + ", timestamp=" + timestamp + ", isCharging=" + isCharging + "]";
		}
	    
	


}
