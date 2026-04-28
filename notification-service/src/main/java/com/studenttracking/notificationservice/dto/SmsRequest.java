package com.studenttracking.notificationservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class SmsRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotBlank(message = "Phone number is required")
    private String to;

    @NotBlank(message = "Message is required")
    private String message;
}