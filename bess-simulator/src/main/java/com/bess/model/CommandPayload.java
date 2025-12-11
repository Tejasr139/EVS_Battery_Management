package com.bess.model;

public class CommandPayload {
    private String batteryId;
    private String action;
    private int targetSoc;
    private String source;

    public CommandPayload() {}

    public CommandPayload(String batteryId, String action, int targetSoc, String source) {
        this.batteryId = batteryId;
        this.action = action;
        this.targetSoc = targetSoc;
        this.source = source;
    }

    public String getBatteryId() { return batteryId; }
    public void setBatteryId(String batteryId) { this.batteryId = batteryId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public int getTargetSoc() { return targetSoc; }
    public void setTargetSoc(int targetSoc) { this.targetSoc = targetSoc; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}