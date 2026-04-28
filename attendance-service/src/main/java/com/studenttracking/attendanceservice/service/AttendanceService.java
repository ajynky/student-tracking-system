package com.studenttracking.attendanceservice.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.studenttracking.attendanceservice.dto.AttendanceRequest;
import com.studenttracking.attendanceservice.dto.BulkAttendanceRequest;
import com.studenttracking.attendanceservice.entity.Attendance;
import com.studenttracking.attendanceservice.enums.AttendanceStatus;
import com.studenttracking.attendanceservice.repository.AttendanceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceService {

	private final AttendanceRepository attendanceRepository;

	public Attendance markAttendance(AttendanceRequest request) {

		// Check if already marked
		attendanceRepository
				.findByStudentIdAndClassIdAndDate(request.getStudentId(), request.getClassId(), request.getDate())
				.ifPresent(a -> {
					throw new RuntimeException("Attendance already marked for this student on this date");
				});

		Attendance attendance = Attendance.builder().studentId(request.getStudentId()).classId(request.getClassId())
				.date(request.getDate()).status(AttendanceStatus.valueOf(request.getStatus().toUpperCase()))
				.markedBy(request.getMarkedBy()).build();

		return attendanceRepository.save(attendance);
	}

	public List<Attendance> markBulkAttendance(BulkAttendanceRequest request) {
		List<Attendance> saved = new ArrayList<>();

		for (BulkAttendanceRequest.AttendanceRecord record : request.getRecords()) {

			// Skip if already marked
			attendanceRepository
					.findByStudentIdAndClassIdAndDate(record.getStudentId(), request.getClassId(), request.getDate())
					.ifPresent(a -> {
						throw new RuntimeException("Attendance already marked for student: " + record.getStudentId());
					});

			Attendance attendance = Attendance.builder().studentId(record.getStudentId()).classId(request.getClassId())
					.date(request.getDate()).status(AttendanceStatus.valueOf(record.getStatus().toUpperCase()))
					.markedBy(request.getMarkedBy()).build();

			saved.add(attendanceRepository.save(attendance));
		}

		return saved;
	}

	public List<Attendance> getAttendanceByStudent(UUID studentId) {
		return attendanceRepository.findByStudentId(studentId);
	}

	public List<Attendance> getAttendanceByClassAndDate(UUID classId, LocalDate date) {
		return attendanceRepository.findByClassIdAndDate(classId, date);
	}

	public List<Attendance> getAttendanceByStudentAndClass(UUID studentId, UUID classId) {
		return attendanceRepository.findByStudentIdAndClassId(studentId, classId);
	}

	public List<Attendance> getAttendanceByStudentAndDateRange(UUID studentId, LocalDate from, LocalDate to) {
		return attendanceRepository.findByStudentIdAndDateBetween(studentId, from, to);
	}

	public Map<String, Object> getAttendancePercentage(UUID studentId, UUID classId) {

		long total = attendanceRepository.countByStudentIdAndClassId(studentId, classId);

		long present = attendanceRepository.countByStudentIdAndClassIdAndStatus(studentId, classId,
				AttendanceStatus.PRESENT);

		long late = attendanceRepository.countByStudentIdAndClassIdAndStatus(studentId, classId, AttendanceStatus.LATE);

		double percentage = total == 0 ? 0 : ((double) (present + late) / total) * 100;

		Map<String, Object> report = new HashMap<>();
		report.put("studentId", studentId);
		report.put("classId", classId);
		report.put("totalDays", total);
		report.put("presentDays", present);
		report.put("lateDays", late);
		report.put("absentDays", total - present - late);
		report.put("attendancePercentage", Math.round(percentage * 100.0) / 100.0);

		return report;
	}
}