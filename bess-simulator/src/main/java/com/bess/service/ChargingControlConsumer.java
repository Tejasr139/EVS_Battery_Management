package com.bess.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.time.Duration;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

public class ChargingControlConsumer {
    private final KafkaConsumer<String, String> consumer;
    private final ObjectMapper mapper = new ObjectMapper();
    private final Consumer<String> chargingSourceCallback;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);
    private final Map<String, ScheduledFuture<?>> pendingCommands = new ConcurrentHashMap<>();
    private volatile boolean running = false;

    public ChargingControlConsumer(KafkaConsumer<String, String> consumer, Consumer<String> chargingSourceCallback) {
        this.consumer = consumer;
        this.chargingSourceCallback = chargingSourceCallback;
    }

    public void startListening(String topic) {
        consumer.subscribe(Collections.singletonList(topic));
        running = true;
        System.out.println("Started listening on topic: " + topic);
        while (running) {
            try {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(1000));
                for (ConsumerRecord<String, String> record : records) {
                    processChargingMessage(record.value());
                }
            } catch (Exception e) {
                System.err.println("Error consuming charging control message: " + e.getMessage());
            }
        }
    }

    private void processChargingMessage(String message) {
        try {
            // Handle direct string commands like BATT-001-CHARGE-60
            chargingSourceCallback.accept(message);
            
            // JSON processing - commented out as not used
            /*
            if (message.startsWith("{")) {
                JsonNode node = mapper.readTree(message);
                String batteryId = node.get("batteryId").asText();
                boolean charge = node.get("charge").asBoolean();
                String source = node.get("source").asText();
                String command = batteryId + "|" + charge + "|" + source;
                
                System.out.println("Received JSON command - Battery: " + batteryId + ", Charge: " + charge + ", Source: " + source);
                
                ScheduledFuture<?> existingTask = pendingCommands.get(batteryId);
                if (existingTask != null && !existingTask.isDone()) {
                    existingTask.cancel(false);
                    System.out.println("Cancelled previous command for " + batteryId);
                }
                
                ScheduledFuture<?> future = scheduler.schedule(() -> {
                    System.out.println("Executing delayed command for " + batteryId + " after 5 minutes");
                    chargingSourceCallback.accept(command);
                    pendingCommands.remove(batteryId);
                }, 5, TimeUnit.MINUTES);
                
                pendingCommands.put(batteryId, future);
                System.out.println("Scheduled response for " + batteryId + " in 5 minutes");
            }
            */
            
        } catch (Exception e) {
            System.err.println("Failed to process charging control message: " + e.getMessage());
        }
    }

    public void stop() {
        running = false;
        pendingCommands.values().forEach(task -> task.cancel(false));
        scheduler.shutdown();
        consumer.close();
    }
}