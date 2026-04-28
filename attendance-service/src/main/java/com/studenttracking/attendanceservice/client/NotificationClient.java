package com.studenttracking.attendanceservice.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
@Slf4j
public class NotificationClient {

    @Value("${services.notification-service}")
    private String notificationServiceUrl;

    public void sendAbsenceSms(UUID userId, String phoneNumber,
            String studentName, String date) {
        try {
            WebClient webClient = WebClient.create(notificationServiceUrl);

            Map<String, Object> smsRequest = new HashMap<>();
            smsRequest.put("userId", userId.toString());
            smsRequest.put("to", phoneNumber);
            smsRequest.put("message", "Alert: " + studentName +
                " was marked absent on " + date);

            webClient.post()
                    .uri("/notifications/sms")
                    .bodyValue(smsRequest)
                    .retrieve()
                    .bodyToMono(String.class)
                    .subscribe(
                        response -> log.info("SMS sent for absent student"),
                        error -> log.error("Failed to send SMS: {}",
                            error.getMessage())
                    );

        } catch (Exception e) {
            log.error("Error calling notification service: {}", e.getMessage());
        }
    }
}