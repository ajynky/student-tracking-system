package com.studenttracking.attendanceservice.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.studenttracking.attendanceservice.dto.AttendanceRequest;
import com.studenttracking.attendanceservice.dto.BulkAttendanceRequest;
import com.studenttracking.attendanceservice.entity.Attendance;
import com.studenttracking.attendanceservice.service.AttendanceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

	private final AttendanceService attendanceService;

	@PostMapping("/mark")
	public ResponseEntity<Attendance> markAttendance(@Valid @RequestBody AttendanceRequest request) {
		return ResponseEntity.ok(attendanceService.markAttendance(request));
	}

	@PostMapping("/mark-bulk")
	public ResponseEntity<List<Attendance>> markBulkAttendance(@Valid @RequestBody BulkAttendanceRequest request) {
		return ResponseEntity.ok(attendanceService.markBulkAttendance(request));
	}

	@GetMapping("/student/{studentId}")
	public ResponseEntity<List<Attendance>> getByStudent(@PathVariable UUID studentId) {
		return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
	}

	@GetMapping("/class/{classId}")
	public ResponseEntity<List<Attendance>> getByClassAndDate(@PathVariable UUID classId,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return ResponseEntity.ok(attendanceService.getAttendanceByClassAndDate(classId, date));
	}

	@GetMapping("/student/{studentId}/class/{classId}")
	public ResponseEntity<List<Attendance>> getByStudentAndClass(@PathVariable UUID studentId,
			@PathVariable UUID classId) {
		return ResponseEntity.ok(attendanceService.getAttendanceByStudentAndClass(studentId, classId));
	}

	@GetMapping("/student/{studentId}/range")
	public ResponseEntity<List<Attendance>> getByDateRange(@PathVariable UUID studentId,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
		return ResponseEntity.ok(attendanceService.getAttendanceByStudentAndDateRange(studentId, from, to));
	}

	@GetMapping("/student/{studentId}/class/{classId}/percentage")
	public ResponseEntity<Map<String, Object>> getPercentage(@PathVariable UUID studentId, @PathVariable UUID classId) {
		return ResponseEntity.ok(attendanceService.getAttendancePercentage(studentId, classId));
	}
}