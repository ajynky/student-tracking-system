package com.studenttracking.notificationservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studenttracking.notificationservice.dto.EmailRequest;
import com.studenttracking.notificationservice.dto.SmsRequest;
import com.studenttracking.notificationservice.entity.Notification;
import com.studenttracking.notificationservice.service.EmailService;
import com.studenttracking.notificationservice.service.SmsService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;
    private final SmsService smsService;

    @PostMapping("/email")
    public ResponseEntity<Notification> sendEmail(
            @Valid @RequestBody EmailRequest request) {
        return ResponseEntity.ok(emailService.sendEmail(request));
    }
    

    @PostMapping("/sms")
    public ResponseEntity<Notification> sendSms(
            @Valid @RequestBody SmsRequest request) {
        return ResponseEntity.ok(smsService.sendSms(request));
    }
}