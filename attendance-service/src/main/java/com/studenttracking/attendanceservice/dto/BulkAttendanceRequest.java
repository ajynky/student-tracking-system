package com.studenttracking.attendanceservice.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class BulkAttendanceRequest {

    @NotNull(message = "Class ID is required")
    private UUID classId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private UUID markedBy;

    @NotEmpty(message = "Attendance records are required")
    private List<AttendanceRecord> records;

    @Data
    public static class AttendanceRecord {
        @NotNull(message = "Student ID is required")
        private UUID studentId;

        @NotNull(message = "Status is required")
        private String status;
       	
    	// Optional — needed for SMS trigger
    	private String phoneNumber;
    	private String studentName;
    }
}
