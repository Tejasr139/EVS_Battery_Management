package com.ev.batterymanagementsystem.dto;

import java.time.LocalDateTime;

public class TimeSeriesData {
    private LocalDateTime timestamp;
    private double value;

    public TimeSeriesData(LocalDateTime timestamp, double value) {
        this.timestamp = timestamp;
        this.value = value;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }
}
