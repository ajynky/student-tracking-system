package com.studenttracking.attendanceservice.dto;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceRequest {

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    @NotNull(message = "Class ID is required")
    private UUID classId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Status is required")
    private String status;

    private UUID markedBy;

    // Optional — needed for SMS trigger
    private String phoneNumber;
    private String studentName;
    private UUID userId;        // ← add this
}