package com.studenttracking.studentservice.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class GradeRequest {

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Score is required")
    @DecimalMin(value = "0.0", message = "Score cannot be negative")
    @DecimalMax(value = "100.0", message = "Score cannot exceed 100")
    private BigDecimal score;

    @NotBlank(message = "Semester is required")
    private String semester;

    private boolean publish;
}