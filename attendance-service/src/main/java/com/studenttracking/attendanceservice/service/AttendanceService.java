package com.studenttracking.attendanceservice.service;

import com.studenttracking.attendanceservice.dto.AttendanceRequest;
import com.studenttracking.attendanceservice.dto.BulkAttendanceRequest;
import com.studenttracking.attendanceservice.entity.Attendance;
import com.studenttracking.attendanceservice.enums.AttendanceStatus;
import com.studenttracking.attendanceservice.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public Attendance markAttendance(AttendanceRequest request) {

        // Check if already marked
        attendanceRepository.findByStudentIdAndClassIdAndDate(
                request.getStudentId(),
                request.getClassId(),
                request.getDate())
                .ifPresent(a -> {
                    throw new RuntimeException(
                        "Attendance already marked for this student on this date");
                });

        Attendance attendance = Attendance.builder()
                .studentId(request.getStudentId())
                .classId(request.getClassId())
                .date(request.getDate())
                .status(AttendanceStatus.valueOf(
                    request.getStatus().toUpperCase()))
                .markedBy(request.getMarkedBy())
                .build();

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> markBulkAttendance(BulkAttendanceRequest request) {
        List<Attendance> saved = new ArrayList<>();

        for (BulkAttendanceRequest.AttendanceRecord record : request.getRecords()) {

            // Skip if already marked
            attendanceRepository.findByStudentIdAndClassIdAndDate(
                    record.getStudentId(),
                    request.getClassId(),
                    request.getDate())
                    .ifPresent(a -> {
                        throw new RuntimeException(
                            "Attendance already marked for student: "
                            + record.getStudentId());
                    });

            Attendance attendance = Attendance.builder()
                    .studentId(record.getStudentId())
                    .classId(request.getClassId())
                    .date(request.getDate())
                    .status(AttendanceStatus.valueOf(
                        record.getStatus().toUpperCase()))
                    .markedBy(request.getMarkedBy())
                    .build();

            saved.add(attendanceRepository.save(attendance));
        }

        return saved;
    }
}