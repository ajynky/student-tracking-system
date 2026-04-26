package com.studenttracking.studentservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class SubmissionRequest {

    @NotNull(message = "Assignment ID is required")
    private UUID assignmentId;

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    private String fileUrl;
}