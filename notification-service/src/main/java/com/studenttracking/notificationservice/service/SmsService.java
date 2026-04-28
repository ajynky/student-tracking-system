package com.studenttracking.notificationservice.service;

import com.studenttracking.notificationservice.dto.SmsRequest;
import com.studenttracking.notificationservice.entity.Notification;
import com.studenttracking.notificationservice.enums.NotificationStatus;
import com.studenttracking.notificationservice.enums.NotificationType;
import com.studenttracking.notificationservice.repository.NotificationRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmsService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.from-number}")
    private String fromNumber;

    private final NotificationRepository notificationRepository;

    @PostConstruct
    public void initTwilio() {
        Twilio.init(accountSid, authToken);
    }

    public Notification sendSms(SmsRequest request) {

        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .type(NotificationType.SMS)
                .message(request.getMessage())
                .status(NotificationStatus.PENDING)
                .build();

        notification = notificationRepository.save(notification);

        try {
            Message message = Message.creator(
                    new PhoneNumber(request.getTo()),
                    new PhoneNumber(fromNumber),
                    request.getMessage()
            ).create();

            log.info("SMS sent successfully. SID: {}", message.getSid());

            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());

        } catch (Exception e) {
            log.error("Failed to send SMS: {}", e.getMessage());
            notification.setStatus(NotificationStatus.FAILED);
        }

        return notificationRepository.save(notification);
    }
}