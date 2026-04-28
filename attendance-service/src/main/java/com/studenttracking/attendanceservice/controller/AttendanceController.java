package com.studenttracking.attendanceservice.controller;

import com.studenttracking.attendanceservice.dto.AttendanceRequest;
import com.studenttracking.attendanceservice.dto.BulkAttendanceRequest;
import com.studenttracking.attendanceservice.entity.Attendance;
import com.studenttracking.attendanceservice.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/mark")
    public ResponseEntity<Attendance> markAttendance(
            @Valid @RequestBody AttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.markAttendance(request));
    }

    @PostMapping("/mark-bulk")
    public ResponseEntity<List<Attendance>> markBulkAttendance(
            @Valid @RequestBody BulkAttendanceRequest request) {
        return ResponseEntity.ok(attendanceService.markBulkAttendance(request));
    }
}