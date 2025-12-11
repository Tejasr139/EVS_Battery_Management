package com.bess.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

public class TelemetryService {
    private final KafkaProducer<String, String> producer;
    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public TelemetryService(KafkaProducer<String, String> producer) {
        this.producer = producer;
    }

    public void sendTelemetry(String topic, String key, Object telemetry) {
        try {
            String json = mapper.writeValueAsString(telemetry);
            producer.send(new ProducerRecord<>(topic, key, json), (metadata, exception) -> {
                if (exception == null) {
                    System.out.println("Telemetry sent to topic " + metadata.topic() +
                            " partition " + metadata.partition() +
                            " offset " + metadata.offset());
                } else {
                    System.err.println("Failed to send telemetry: " + exception.getMessage());
                }
            });
        } catch (Exception e) {
            System.err.println("Failed to send telemetry to topic " + topic + ": " + e.getMessage());
        }
    }
}