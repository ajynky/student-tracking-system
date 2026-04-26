package com.studenttracking.studentservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class StudentClassRequest {

    @NotBlank(message = "Class name is required")
    private String name;

    private UUID teacherId;
}