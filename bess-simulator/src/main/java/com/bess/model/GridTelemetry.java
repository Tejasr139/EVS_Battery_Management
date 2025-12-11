package com.bess.model;

import java.time.LocalDateTime;

public class GridTelemetry {
    public String gridId;
    public double output;
    public LocalDateTime timestamp;

    public GridTelemetry(String gridId, double output,LocalDateTime timestamp) {
        this.gridId = gridId;
        this.output = output;
        this.timestamp = timestamp;
    }
}