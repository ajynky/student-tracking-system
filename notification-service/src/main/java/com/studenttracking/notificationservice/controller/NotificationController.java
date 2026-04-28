package com.studenttracking.notificationservice.controller;

import com.studenttracking.notificationservice.dto.EmailRequest;
import com.studenttracking.notificationservice.entity.Notification;
import com.studenttracking.notificationservice.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @PostMapping("/email")
    public ResponseEntity<Notification> sendEmail(
            @Valid @RequestBody EmailRequest request) {
        return ResponseEntity.ok(emailService.sendEmail(request));
    }
}