package com.bess.service;

import com.bess.model.CommandPayload;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

public class CommandProducer {
    private final KafkaProducer<String, String> producer;
    private final ObjectMapper mapper = new ObjectMapper();

    public CommandProducer(KafkaProducer<String, String> producer) {
        this.producer = producer;
    }

    public void produceCommand(CommandPayload payload) {
        try {
            String message = mapper.writeValueAsString(payload);
            ProducerRecord<String, String> record = new ProducerRecord<>("battery-command", payload.getBatteryId(), message);
            producer.send(record);
            System.out.println("Sent command: " + message);
        } catch (Exception e) {
            System.err.println("Failed to send command: " + e.getMessage());
        }
    }
}