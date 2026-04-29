package com.studenttracking.notificationservice.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import com.studenttracking.notificationservice.dto.EmailRequest;
import com.studenttracking.notificationservice.entity.Notification;
import com.studenttracking.notificationservice.enums.NotificationStatus;
import com.studenttracking.notificationservice.enums.NotificationType;
import com.studenttracking.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Value("${resend.api-key}")
    private String resendApiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    private final NotificationRepository notificationRepository;

    public Notification sendEmail(EmailRequest request) {

        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .type(NotificationType.EMAIL)
                .message(request.getBody())
                .status(NotificationStatus.PENDING)
                .build();

        notification = notificationRepository.save(notification);

        try {
            Resend resend = new Resend(resendApiKey);

            CreateEmailOptions options = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(request.getTo())
                    .subject(request.getSubject())
                    .html("<p>" + org.springframework.web.util.HtmlUtils.htmlEscape(request.getBody()) + "</p>")
                    .build();

            CreateEmailResponse response = resend.emails().send(options);

            log.info("Email sent successfully. ID: {}", response.getId());

            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());

        } catch (ResendException e) {
            log.error("Failed to send email: {}", e.getMessage());
            notification.setStatus(NotificationStatus.FAILED);
        }

        return notificationRepository.save(notification);
    }
}